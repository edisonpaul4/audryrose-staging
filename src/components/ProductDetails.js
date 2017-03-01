import React, { Component } from 'react';
import { Table, Input, Button, Dropdown, Dimmer, Segment, Loader } from 'semantic-ui-react';
import classNames from 'classnames';
import numeral from 'numeral';
// import moment from 'moment';

class VariantRow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      variantData: this.props.data,
      inventory: this.props.data.inventory_value,
      inventoryEdited: false,
      inventorySaved: false
    };
    this.handleInventoryChange = this.handleInventoryChange.bind(this);
    this.handleSaveVariantClick = this.handleSaveVariantClick.bind(this);
  }
  handleInventoryChange(e, {value}) {
    if (parseFloat(value) !== parseFloat(this.props.data.inventory_value)) {
      this.setState({
        inventory: parseFloat(value),
        inventoryEdited: true
      });
    } else {
      this.setState({
        inventory: parseFloat(value),
        inventoryEdited: false
      });
    }
  }
	handleSaveVariantClick(e, {value}) {
		this.props.handleSaveVariantClick(this.props.data.objectId, this.state.inventory);
	}
	componentWillReceiveProps(nextProps) {
  	if (nextProps.updatedVariant) {
    	let updatedVariantJSON = nextProps.updatedVariant.toJSON();
    	if (this.state.variantData.objectId === updatedVariantJSON.objectId) {
      	this.setState({
        	variantData: updatedVariantJSON,
        	inventoryEdited: false,
        	inventorySaved: true
      	});
      }
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
		
		const saveButton = this.state.inventoryEdited ? <Button content='Save' size='mini' primary compact loading={this.props.isSaving} disabled={this.props.isSaving} onClick={this.handleSaveVariantClick} /> : null;
    return (
      <Table.Row warning={this.state.inventoryEdited ? true: false} positive={this.state.inventorySaved ? true: false} disabled={this.props.isSaving}>
        <Table.Cell>{data.styleNumber ? data.styleNumber : ''}</Table.Cell>
        <Table.Cell>{data.color_value ? data.color_value : ''}</Table.Cell>
        <Table.Cell>{data.size_value ? data.size_value : 'OS'}</Table.Cell>
        <Table.Cell>{otherOptions ? otherOptions.join(', ') : null}</Table.Cell>
				<Table.Cell><Input type='number' transparent defaultValue={data.inventory_level} onChange={this.handleInventoryChange} min={0} disabled={this.props.isSaving} /></Table.Cell>
				<Table.Cell className='right aligned'>{numeral(price).format('$0,0.00')}</Table.Cell>
				<Table.Cell className='right aligned'>
				  {saveButton}
          <Button.Group color='grey' size='mini' compact>
            <Button content='Order' disabled={this.props.isSaving} />
            <Dropdown floating button compact className='icon' disabled={this.props.isSaving}>
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
  }
	handleSaveVariantClick(objectId, inventory) {
		this.props.handleSaveVariantClick(objectId, inventory);
	}
	render() {  	
  	var scope = this;
		const variants = this.props.variants;
		// Sort the data
		if (variants.length && variants[0].size_value) {
      variants.sort(function(a, b) {
        return parseFloat(a.size_value) - parseFloat(b.size_value);
      });
    }
    
		let variantRows = [];
		if (variants) {
			variants.map(function(variantRow, i) {
  			let adjuster = null;
  			let adjusterValue = 0;
  			if (scope.props.updatedVariant) {
    			let updatedVariantRowJSON = scope.props.updatedVariant.toJSON();
    			if (updatedVariantRowJSON.objectId === variantRow.objectId) variantRow = updatedVariantRowJSON;
  			}
  			if (variantRow.variantOptions) {
    			variantRow.variantOptions.map(function(variantOption, j) {
      			if (variantOption.adjuster) adjuster = variantOption.adjuster;
      			if (variantOption.adjuster_value) adjusterValue = variantOption.adjuster_value;
      			return variantOption;
    			});
  			}
  			let isSaving = scope.props.savingVariants.indexOf(variantRow.objectId) >= 0 ? true : false;
				variantRows.push(
				  <VariantRow 
				    data={variantRow} 
				    basePrice={scope.props.basePrice} 
				    adjuster={adjuster} 
				    adjusterValue={adjusterValue} 
				    key={i} 
				    handleSaveVariantClick={scope.handleSaveVariantClick} 
				    isSaving={isSaving} 
				    updatedVariant={scope.props.updatedVariant}
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
      showEditor: false
    };
    this.handleReloadClick = this.handleReloadClick.bind(this);
    this.handleSaveVariantClick = this.handleSaveVariantClick.bind(this);
  }
	handleReloadClick(productId) {
		this.props.handleReloadClick(productId);
	}
	handleSaveVariantClick(objectId, inventory) {
		this.props.handleSaveVariantClick(objectId, inventory);
	}
	handleToggleEditorClick() {
  	const showEditor = !this.state.showEditor;
  	
  	this.setState({
    	showEditor: showEditor
  	});
	}	
	render() {
  	const scope = this;
  	const showVariants = this.props.expanded ? true : false;
  	const variants = this.props.data.variants;
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
    	        title={variantGroup} 
    	        basePrice={scope.props.data.price} 
    	        key={i} 
    	        handleSaveVariantClick={scope.handleSaveVariantClick} 
    	        savingVariants={scope.props.savingVariants} 
    	        updatedVariant={scope.props.updatedVariant}
  	        />
	        );
    	    return variantGroup;
  	    });
	    } else {
  	    // If no groupings, create one VariantsTable
  	    variantsTables.push(
  	      <VariantsTable 
  	        variants={variants} 
  	        basePrice={scope.props.data.price} 
  	        key={1} 
  	        handleSaveVariantClick={scope.handleSaveVariantClick} 
  	        savingVariants={scope.props.savingVariants} 
  	        updatedVariant={scope.props.updatedVariant}
	        />
        );
	    }
		}
// 		const productEditor = this.state.showEditor ? <ProductEditor/> : null;
    return (
      <Table.Row className={rowClass}>
        <Table.Cell colSpan='13' className='variant-row'>
          <Button circular compact basic size='tiny' 
            icon='refresh' 
            content='Sync' 
            loading={this.props.isReloading} 
            onClick={()=>this.handleReloadClick(this.props.data.productId)} 
          />
          {/*<Button circular compact basic size='tiny' 
            icon={this.state.showEditor ? 'close' : 'edit'} 
            color={this.state.showEditor ? 'black' : null} 
            content={this.state.showEditor ? 'Cancel' : 'Edit'} 
            onClick={this.handleToggleEditorClick.bind(this)} 
          />
          {productEditor}*/}
          <Dimmer.Dimmable as={Segment} vertical blurring dimmed={this.props.isReloading}>
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