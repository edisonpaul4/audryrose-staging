import React, { Component } from 'react';
import { Table, Input, Button, Dropdown, Dimmer, Segment, Loader, Label, Form } from 'semantic-ui-react';
import classNames from 'classnames';
import numeral from 'numeral';
// import moment from 'moment';

class VariantRow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      variantData: this.props.data,
      inventory: this.props.data.inventoryLevel ? parseFloat(this.props.data.inventoryLevel) : undefined,
      variantEdited: false,
      variantSaved: false
    };
    this.handleInventoryChange = this.handleInventoryChange.bind(this);
    this.handleSaveVariantClick = this.handleSaveVariantClick.bind(this);
    this.handleCancelVariantClick = this.handleCancelVariantClick.bind(this);
    this.handleShowOrderFormClick = this.handleShowOrderFormClick.bind(this);
  }
  handleInventoryChange(e, {value}) {
    let edited = (parseFloat(value) !== parseFloat(this.props.data.inventoryLevel)) ? true : false;
    if (!this.props.data.inventoryLevel && parseFloat(value) === 0) edited = false;
    this.setState({
      inventory: parseFloat(value),
      variantEdited: edited,
      variantSaved: false
    });
    this.props.handleVariantEdited({objectId: this.props.data.objectId, inventory: parseFloat(value)}, edited);
  }
	handleSaveVariantClick(e, {value}) {
		this.props.handleSaveVariantClick({objectId: this.props.data.objectId, inventory: this.state.inventory});
	}
	handleCancelVariantClick(e, {value}) {
    this.setState({
      inventory: this.props.data.inventoryLevel ? parseFloat(this.props.data.inventoryLevel) : undefined,
      variantEdited: false,
      variantSaved: false
    });
    this.props.handleVariantEdited({objectId: this.props.data.objectId}, false);
	}
	handleShowOrderFormClick(e, {value}) {
		this.props.handleShowOrderFormClick({productId: this.props.data.productId, variant: this.props.data.objectId});
	}
	componentWillReceiveProps(nextProps) {
  	if (nextProps.updatedVariant && this.props.isSaving) {
    	this.setState({
      	variantData: nextProps.updatedVariant,
      	inventory: parseFloat(nextProps.updatedVariant.inventoryLevel),
      	variantEdited: false,
      	variantSaved: true
    	});
  	}
	}
	render() {  	
		const data = this.props.data;
		
		// Create an array of other options values
		let otherOptions = [];
		if (data.gemstone_value) otherOptions.push(data.gemstone_value);
		if (data.singlepair_value) otherOptions.push(data.singlepair_value);
		if (data.letter_value) otherOptions.push(data.letter_value);
		if (data.length_value) otherOptions.push(data.length_value);
		if (data.font_value) otherOptions.push(data.font_value);
		
		let price = this.props.basePrice;
		if (this.props.adjuster && this.props.adjuster === 'absolute') price = this.props.adjusterValue;
		if (this.props.adjuster && this.props.adjuster === 'relative') price += this.props.adjusterValue;

    const stoneColorCode = data.code ? '-' + data.code : null;
		const saveCancelClass = this.state.variantEdited ? '' : 'invisible';
		
		const vendorOrder = data.vendorOrderVariant && data.vendorOrderVariant.received === false ? <Label>Pending<Label.Detail>{data.vendorOrderVariant.units}</Label.Detail></Label> : null;
	    
    return (
      <Table.Row warning={this.state.variantEdited ? true: false} positive={this.state.variantSaved && !this.state.variantEdited ? true: false} disabled={this.props.isSaving}>
        <Table.Cell>{data.styleNumber ? data.styleNumber : ''}{stoneColorCode}</Table.Cell>
        <Table.Cell>{data.color_value ? data.color_value : ''}</Table.Cell>
        <Table.Cell>{data.size_value ? data.size_value : 'OS'}</Table.Cell>
        <Table.Cell>{otherOptions ? otherOptions.join(', ') : null}</Table.Cell>
				<Table.Cell><Input type='number' value={this.state.inventory ? this.state.inventory : 0} onChange={this.handleInventoryChange} min={0} disabled={this.props.isSaving} /></Table.Cell>
				<Table.Cell>{vendorOrder}</Table.Cell>
				<Table.Cell className='right aligned'>{numeral(price).format('$0,0.00')}</Table.Cell>
				<Table.Cell className='right aligned' singleLine>
    		  <Button.Group size='mini'>
    		    <Button 
    		      content='Save' 
    		      className={saveCancelClass} 
    		      primary 
    		      compact 
    		      loading={this.props.isSaving} 
    		      disabled={this.props.isSaving} 
    		      onClick={this.handleSaveVariantClick} 
    		      /> 
    		    <Button content='Cancel' 
      		    className={saveCancelClass} 
      		    secondary 
      		    compact 
      		    loading={this.props.isSaving} 
      		    disabled={this.props.isSaving} 
      		    onClick={this.handleCancelVariantClick} 
    		    />
    	    </Button.Group>  <span>&nbsp;</span>
          <Button.Group color='grey' size='mini' compact>
            <Button content='Order' disabled={this.props.isSaving || this.state.variantEdited} onClick={this.handleShowOrderFormClick} />
            <Dropdown floating button compact className='icon' disabled={this.props.isSaving || this.state.variantEdited}>
              <Dropdown.Menu>
                <Dropdown.Item icon='exchange' text='Resize' />
                <Dropdown.Item icon='hide' text='Hide' />
              </Dropdown.Menu>
            </Dropdown>
          </Button.Group>
				</Table.Cell>
      </Table.Row>
    );
  }
}

class VariantsTable extends Component {
  constructor(props) {
    super(props);
    this.handleSaveVariantClick = this.handleSaveVariantClick.bind(this);
    this.handleVariantEdited = this.handleVariantEdited.bind(this);
    this.handleVariantEdited = this.handleVariantEdited.bind(this);
    this.handleShowOrderFormClick = this.handleShowOrderFormClick.bind(this);
  }
  handleVariantEdited(data, edited) {
    this.props.handleVariantsEdited(data, edited)
  }
	handleSaveVariantClick(variantEdited) {
		this.props.handleSaveVariantClick(variantEdited);
	}
	handleShowOrderFormClick(data) {
  	this.props.handleShowOrderFormClick(data);
	}
	render() {  	
  	var scope = this;
		const variants = this.props.variants;
		const vendor = this.props.vendor;
		
		// Sort the data
		if (variants.length && variants[0].size_value) {
      variants.sort(function(a, b) {
        return parseFloat(a.size_value) - parseFloat(b.size_value);
      });
    }
    
		let variantRows = [];
		if (variants) {
			variants.map(function(variantData, i) {
  			let adjuster = null;
  			let adjusterValue = 0;
  			let updatedVariantMatch;
  			if (scope.props.updatedVariants && scope.props.updatedVariants.length > 0) {
        	scope.props.updatedVariants.map(function(updatedVariant, i) {
          	const updatedVariantDataJSON = updatedVariant.toJSON();
          	if (updatedVariantDataJSON.objectId === variantData.objectId) {
            	variantData = updatedVariantDataJSON;
            	updatedVariantMatch = updatedVariantDataJSON;
          	}
            return updatedVariant;
          });
  			}
  			if (variantData.variantOptions) {
    			variantData.variantOptions.map(function(variantOption, j) {
      			if (variantOption.adjuster) adjuster = variantOption.adjuster;
      			if (variantOption.adjuster_value) adjusterValue = variantOption.adjuster_value;
      			return variantOption;
    			});
  			}
        let index = -1;
//         console.log(scope.props.savingVariants)
        scope.props.savingVariants.map(function(savingVariant, i) {
          if (savingVariant.objectId === variantData.objectId) index = i;
          return savingVariant;
        });
        const isSaving = index < 0 ? false : true;
        
        if (vendor.pendingOrder) {
          vendor.pendingOrder.vendorOrderVariants.map(function(vendorOrderVariant, i) {
            if (vendorOrderVariant.variant.objectId === variantData.objectId) variantData.vendorOrderVariant = vendorOrderVariant;
            return vendorOrderVariant;
          });
        }
        
				variantRows.push(
				  <VariantRow 
				    data={variantData} 
				    basePrice={scope.props.basePrice} 
				    adjuster={adjuster} 
				    adjusterValue={adjusterValue} 
				    key={i} 
				    handleSaveVariantClick={scope.handleSaveVariantClick} 
				    handleVariantEdited={scope.handleVariantEdited} 
				    isSaving={isSaving} 
				    updatedVariant={updatedVariantMatch}
				    handleShowOrderFormClick={scope.handleShowOrderFormClick}
			    />
		    );
				return variantRows;
	    });
		}
		const tableTitle = (this.props.title) ? <h3>{this.props.title}</h3> : null;
		
    return (
      <Segment secondary>
        {tableTitle}
        <Table className='variants-table' basic='very' compact size='small' columns={7}>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Style-Color</Table.HeaderCell>
              <Table.HeaderCell>Color</Table.HeaderCell>
              <Table.HeaderCell>Size</Table.HeaderCell>
              <Table.HeaderCell>Other Options</Table.HeaderCell>
              <Table.HeaderCell>ACT OH</Table.HeaderCell>
              <Table.HeaderCell>Ordered</Table.HeaderCell>
              <Table.HeaderCell className='right aligned'>RETAIL $</Table.HeaderCell>
              <Table.HeaderCell className='right aligned'>Actions</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {variantRows}
          </Table.Body>
        </Table>
      </Segment>
    );
  }
}

/*
class ProductEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      edited: false
    };
  }
  handleSelectChange(event) {
    console.log(event.target);
  }
  handleSelectChange = (e, { value }) => {
    console.log(e);
    console.log(value);
    this.setState({ 
      edited: true,
      value
    });
  }
	render() {
    const classifications = [
      { key: 'one', text: 'One', value: 'one' },
      { key: 'two', text: 'Two', value: 'two' },
    ]; 
    return (
      <Segment hidden={this.props.hidden} color={this.state.edited ? 'blue' : null} >
        <Form>
          <Form.Group>
            <Form.Select required label='Classification' options={classifications} placeholder='Select Classification' onChange={this.handleSelectChange} />
          </Form.Group>
          <Form.Button disabled={this.state.edited ? null : true} primary>Save</Form.Button>
        </Form>
      </Segment>
    );
  }
}
*/

class ProductDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showVariants: false,
      showEditor: false,
			variantsEdited: [],
			vendor: this.props.data.vendor ? this.props.data.vendor.objectId : '',
			isBundle: this.props.data.isBundle !== undefined ? this.props.data.isBundle === true ? 'true' : 'false' : ''
    };
    this.handleReloadClick = this.handleReloadClick.bind(this);
    this.handleSaveVariantClick = this.handleSaveVariantClick.bind(this);
    this.handleSaveAllVariantsClick = this.handleSaveAllVariantsClick.bind(this);
    this.handleVariantsEdited = this.handleVariantsEdited.bind(this);
    this.handleShowOrderFormClick = this.handleShowOrderFormClick.bind(this);
    this.handleVendorChange = this.handleVendorChange.bind(this);
    this.handleProductTypeChange = this.handleProductTypeChange.bind(this);
  }
	handleReloadClick(productId) {
		this.props.handleReloadClick(productId);
	}
	handleSaveVariantClick(variantEdited) {
		this.props.handleSaveVariantClick(variantEdited);
	}
	handleSaveAllVariantsClick() {
		this.props.handleSaveAllVariantsClick(this.state.variantsEdited);
	}
  handleVariantsEdited(data, edited) {
    let variantsEdited = this.state.variantsEdited;
    let index = -1;
    variantsEdited.map(function(variant, i) {
      if (variant.objectId === data.objectId) index = i;
      return variantsEdited;
    });
    if (edited && index < 0) {
      variantsEdited.push(data);
    } else if (!edited && index >= 0) {
      variantsEdited.splice(index, 1);
    } else if (edited && index >= 0) {
      variantsEdited[index] = data;
    }
    
  	this.setState({
    	variantsEdited: variantsEdited
  	});
  	this.props.handleVariantsEdited(data, edited);
  }
	handleToggleEditorClick() {
  	const showEditor = !this.state.showEditor;
  	
  	this.setState({
    	showEditor: showEditor
  	});
	}	
	handleShowOrderFormClick(data) {
  	this.props.handleShowOrderFormClick(data);
	}
	
	handleVendorChange(e, {value}) {
  	if (value !== this.state.vendor) {
    	this.props.handleVendorChange(this.props.data.productId, value);
    	this.setState({
      	vendor: value
    	});
  	}
	}
	
	handleProductTypeChange(e, {value}) {
  	if (value !== this.state.isBundle) {
    	this.props.handleProductTypeChange(this.props.data.productId, value);
    	this.setState({
      	isBundle: value
    	});
  	}
	}
	
	componentWillReceiveProps(nextProps) {
    let variantsEdited = this.state.variantsEdited;
    if (nextProps.updatedVariants) {
      nextProps.updatedVariants.map(function(updatedVariant, i) {
        let index = -1;
        variantsEdited.map(function(editedVariant, j) {
          if (editedVariant.objectId === updatedVariant.id) index = j;
          return variantsEdited;
        }); 
        if (index >= 0) {
          variantsEdited.splice(index, 1);
        }
        return updatedVariant;
      }); 
    }
  	this.setState({
    	variantsEdited: variantsEdited
  	});
	}
	render() {
  	const scope = this;
  	const showVariants = this.props.expanded ? true : false;
  	const variants = this.props.data.variants;
  	const vendor = this.props.data.vendor;
		var rowClass = classNames(
			{
				'': showVariants,
				'hidden': !showVariants
			}
		);
			
		var variantsTables = [];
		if (variants) {
  		let variantGroupings = [];
  		// Determine variant groupings
			variants.map(function(variantItem, i) {
  			const color = (variantItem.color_value) ? variantItem.color_value : null;
  			if (color && variantGroupings.indexOf(color) < 0) {
    			variantGroupings.push(color);
  			}
				return variantItem;
	    });
	    
	    if (variantGroupings.length > 0) {
  	    // If there are groupings, create a VariantsTable for each group
  	    variantGroupings.map(function(variantGroup, i) {
    	    var variantsInGroup = [];
    	    variants.map(function(variantItem, j) {
      	    if (variantItem.color_value === variantGroup) variantsInGroup.push(variantItem);
      	    return variantItem;
    	    });
    	    variantsTables.push(
    	      <VariantsTable 
    	        variants={variantsInGroup} 
    	        vendor={vendor}
    	        title={variantGroup} 
    	        basePrice={scope.props.data.price} 
    	        key={i} 
    	        handleSaveVariantClick={scope.handleSaveVariantClick} 
    	        handleVariantsEdited={scope.handleVariantsEdited}
    	        savingVariants={scope.props.savingVariants} 
    	        updatedVariants={scope.props.updatedVariants}
    	        handleShowOrderFormClick={scope.handleShowOrderFormClick}
  	        />
	        );
    	    return variantGroup;
  	    });
	    } else {
  	    // If no groupings, create one VariantsTable
  	    variantsTables.push(
  	      <VariantsTable 
  	        variants={variants} 
  	        vendor={vendor}
  	        basePrice={scope.props.data.price} 
  	        key={1} 
  	        handleSaveVariantClick={scope.handleSaveVariantClick} 
  	        handleVariantsEdited={scope.handleVariantsEdited}
  	        savingVariants={scope.props.savingVariants} 
  	        updatedVariants={scope.props.updatedVariants}
  	        handleShowOrderFormClick={scope.handleShowOrderFormClick}
	        />
        );
	    }
		}
		
		const vendorOptions = this.props.data.designer && this.props.data.designer.vendors ? this.props.data.designer.vendors.map(function(vendor, i) {
  		return { key: i, value: vendor.objectId, text: 'Vendor: ' + vendor.name };
		}) : null;
		const vendorSelect = <Form.Select placeholder='Select a vendor' value={this.state.vendor} options={vendorOptions} onChange={this.handleVendorChange} />
		
		const productTypeOptions = [
  		{ key: 0, value: 'false', text: 'Standard Product' },
  		{ key: 1, value: 'true', text: 'Bundle Product' }
		];
		
		const productTypeSelect = <Form.Select placeholder='Select product type' value={this.state.isBundle} options={productTypeOptions} onChange={this.handleProductTypeChange} />
		
		const saveAllButton = this.state.variantsEdited.length > 0 ? <Button primary circular compact size='small' icon='save' content='Save All' disabled={this.props.isReloading} onClick={this.handleSaveAllVariantsClick} /> : null;
// 		const productEditor = this.state.showEditor ? <ProductEditor/> : null;
    return (
      <Table.Row className={rowClass}>
        <Table.Cell colSpan='13' className='variant-row'>
          <Segment.Group horizontal compact className='toolbar'>
            <Segment basic>
              <Form size='tiny' loading={this.props.isReloading}>
                <Form.Group inline>
                  <Form.Field>
                    <Form.Button circular compact basic size='small' 
                      icon='refresh' 
                      content='Reload' 
                      disabled={this.props.isReloading} 
                      onClick={()=>this.handleReloadClick(this.props.data.productId)} 
                    />
                  </Form.Field>
                  <Form.Field>
                    {vendorSelect}
                  </Form.Field>
                  <Form.Field>
                  {productTypeSelect}
                  </Form.Field>
                  {/*<Form.Field>
                    <Button circular compact basic size='tiny' 
                      icon={this.state.showEditor ? 'close' : 'edit'} 
                      color={this.state.showEditor ? 'black' : null} 
                      content={this.state.showEditor ? 'Cancel' : 'Edit'} 
                      onClick={this.handleToggleEditorClick.bind(this)} 
                    />
                    {productEditor}
                  </Form.Field>*/}
                </Form.Group>
              </Form>
            </Segment>
            <Segment basic textAlign='right'>
              {saveAllButton}
            </Segment>
          </Segment.Group>
          <Dimmer.Dimmable as={Segment} vertical dimmed={this.props.isReloading}>
            <Dimmer active={this.props.isReloading} inverted>
              <Loader>Loading</Loader>
            </Dimmer>
            {variantsTables}
          </Dimmer.Dimmable>
        </Table.Cell>
      </Table.Row>
    );
  }
}

export default ProductDetails;