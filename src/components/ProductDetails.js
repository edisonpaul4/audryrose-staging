import React, { Component } from 'react';
import { Table, Input, Button, Dropdown, Dimmer, Segment, Loader, Label, Form } from 'semantic-ui-react';
import classNames from 'classnames';
import numeral from 'numeral';
import moment from 'moment';
import ProductResizeModal from './ProductResizeModal.js';

class VariantRow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      variantData: this.props.data,
      inventory: this.props.data.inventoryLevel ? parseFloat(this.props.data.inventoryLevel) : 0,
      startInventory: this.props.data.inventoryLevel ? parseFloat(this.props.data.inventoryLevel) : 0,
      variantEdited: false,
      variantSaved: false
    };
    this.handleInventoryChange = this.handleInventoryChange.bind(this);
    this.handleSaveVariantClick = this.handleSaveVariantClick.bind(this);
    this.handleCancelVariantClick = this.handleCancelVariantClick.bind(this);
    this.handleShowOrderFormClick = this.handleShowOrderFormClick.bind(this);
    this.handleShowResizeFormClick = this.handleShowResizeFormClick.bind(this);
    this.handleSaveResize = this.handleSaveResize.bind(this);
  }
  handleInventoryChange(e, {value}) {
    console.log(value)
    let edited = (parseFloat(value) !== parseFloat(this.state.startInventory)) ? true : false;
    if (!this.state.startInventory && parseFloat(value) === 0) edited = false;
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
      inventory: this.state.startInventory,
      variantEdited: false,
      variantSaved: false
    });
    this.props.handleVariantEdited({objectId: this.props.data.objectId}, false);
	}
	handleShowOrderFormClick(e, {value}) {
		this.props.handleShowOrderFormClick({productId: this.props.data.productId, variant: this.props.data.objectId, resize: false});
	}
	handleShowResizeFormClick(e, {value}) {
		this.props.handleShowOrderFormClick({productId: this.props.data.productId, variant: this.props.data.objectId, resize: true});
	}
	handleSaveResize(data) {
		this.props.handleSaveResize(data);
	}
	componentWillReceiveProps(nextProps) {
  	if (nextProps.updatedVariant) {
    	console.log(nextProps.updatedVariant)
    	this.setState({
      	variantData: this.props.isSaving ? nextProps.data : this.state.variantData,
      	inventory: nextProps.updatedVariant.inventoryLevel,
      	startInventory: nextProps.updatedVariant.inventoryLevel,
      	variantSaved: true
    	});
  	}
	}
	render() {
  	const scope = this;
		const data = this.props.data;
    let variantEdited = (this.state.inventory !== this.state.startInventory) ? true : false;
    if (!this.state.startInventory && this.state.inventory === 0) variantEdited = false;
		
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
		const saveCancelClass = variantEdited ? '' : 'invisible';
		
		let vendorOrderAndResizes = [];
		if (data.vendorOrders) {
  		data.vendorOrders.map(function(vendorOrder, i) {
    		const vendorOrderVariant = vendorOrder.vendorOrderVariant;
    		const averageWaitTime = vendorOrder.vendor.waitTime ? vendorOrder.vendor.waitTime : 21;
    		const expectedDate = vendorOrder.order.dateOrdered ? moment(vendorOrder.order.dateOrdered.iso).add(averageWaitTime, 'days') : moment.utc().add(averageWaitTime, 'days');
    		const daysLeft = vendorOrder.order.dateOrdered ? expectedDate.diff(moment.utc(), 'days') : averageWaitTime;
    		const labelColor = vendorOrderVariant.ordered ? daysLeft < 0 ? 'red' : 'olive' : 'yellow';
    		const labelText = vendorOrderVariant.ordered ? vendorOrderVariant.units + ' Sent' : vendorOrderVariant.units + ' Pending';
    		const labelDetail = vendorOrderVariant.ordered ? daysLeft < 0 ? Math.abs(daysLeft) + ' days late' : daysLeft + ' days left' : averageWaitTime + ' days wait';
    		vendorOrderAndResizes.push((vendorOrderVariant.done === false) ? <Label as='a' href={data.designer ? '/designers/search?q=' + data.designer.designerId : '/designers'} size='tiny' color={labelColor} key={'vendorOrder-'+i}>{labelText}<Label.Detail>{labelDetail}</Label.Detail></Label> : null);
    		return vendorOrderVariant;
  		});
    }
    
		if (data.resizes) {
  		data.resizes.map(function(resize, i) {
    		const averageWaitTime = 7;
    		const expectedDate = resize.dateSent ? moment(resize.dateSent.iso).add(averageWaitTime, 'days') : moment.utc().add(averageWaitTime, 'days');
    		const daysLeft = resize.dateSent ? expectedDate.diff(moment.utc(), 'days') : averageWaitTime;
    		const labelColor = daysLeft < 0 ? 'red' : 'olive';
    		const labelText = resize.units + ' Resizing';
    		const labelDetail = daysLeft < 0 ? Math.abs(daysLeft) + ' days late' : daysLeft + ' days left';
    		const labelComponent = <Label as='a' size='tiny' color={labelColor}>{labelText}<Label.Detail>{labelDetail}</Label.Detail></Label>;
    		vendorOrderAndResizes.push(
		      <ProductResizeModal 
		        data={resize} 
		        label={labelComponent} 
		        key={'resize-'+i} 
		        isReloading={scope.props.isReloading}
		        handleSaveResize={scope.handleSaveResize}
	        />
  		  );
    		return resize;
  		});
    }
    
    const resizeButton = data.size_value ? <Dropdown.Item icon='exchange' text='Resize' disabled={this.props.isSaving || variantEdited} onClick={this.handleShowResizeFormClick} /> : null;
     
    return (
      <Table.Row warning={variantEdited ? true: false} positive={this.state.variantSaved && !variantEdited ? true: false} disabled={this.props.isSaving}>
        <Table.Cell>{data.styleNumber ? data.styleNumber : ''}{stoneColorCode}</Table.Cell>
        <Table.Cell>{data.color_value ? data.color_value : ''}</Table.Cell>
        <Table.Cell>{data.size_value ? data.size_value : 'OS'}</Table.Cell>
        <Table.Cell>{otherOptions ? otherOptions.join(', ') : null}</Table.Cell>
				<Table.Cell><Input type='number' value={this.state.inventory ? this.state.inventory : 0} onChange={this.handleInventoryChange} min={0} disabled={this.props.isSaving} /></Table.Cell>
				<Table.Cell>{vendorOrderAndResizes}</Table.Cell>
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
            <Button content='Order' disabled={this.props.isSaving || variantEdited} onClick={this.handleShowOrderFormClick} />
            <Dropdown floating button compact className='icon' disabled={this.props.isSaving || variantEdited}>
              <Dropdown.Menu>
                {resizeButton}
                {/*<Dropdown.Item icon='hide' text='Hide' />*/}
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
    this.handleShowOrderFormClick = this.handleShowOrderFormClick.bind(this);
    this.handleSaveResize = this.handleSaveResize.bind(this);
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
	handleSaveResize(data) {
		this.props.handleSaveResize(data);
	}
	render() {  	
  	var scope = this;
		const variants = this.props.variants;
		const vendor = this.props.vendor;
		const designer = this.props.designer;
// 		const resizes = this.props.resizes;
		
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
//             	variantData = updatedVariantDataJSON;
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
        scope.props.savingVariants.map(function(savingVariant, i) {
          if (savingVariant === variantData.objectId) index = i;
          return savingVariant;
        });
        const isSaving = index < 0 ? false : true;
        
        var vendorOrders = [];
        if (vendor && vendor.vendorOrders) {
      	  vendor.vendorOrders.map(function(vendorOrder, j) {
        	  vendorOrder.vendorOrderVariants.map(function(vendorOrderVariant, k) {
          	  if (variantData.objectId === vendorOrderVariant.variant.objectId && vendorOrderVariant.done === false) {
            	  vendorOrders.push({vendor: vendor, order: vendorOrder, vendorOrderVariant: vendorOrderVariant});
          	  }
          	  return vendorOrderVariant;
        	  });
        	  return vendorOrder;
      	  });
        }
        if (vendorOrders.length > 0) variantData.vendorOrders = vendorOrders;
        
        if (designer) variantData.designer = designer;
        
				variantRows.push(
				  <VariantRow 
				    data={variantData} 
				    basePrice={scope.props.basePrice} 
				    adjuster={adjuster} 
				    adjusterValue={adjusterValue} 
				    key={i} 
				    isReloading={scope.props.isReloading}
				    handleSaveVariantClick={scope.handleSaveVariantClick} 
				    handleVariantEdited={scope.handleVariantEdited} 
				    isSaving={isSaving} 
				    updatedVariant={updatedVariantMatch}
				    handleShowOrderFormClick={scope.handleShowOrderFormClick}
				    handleSaveResize={scope.handleSaveResize}
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
              <Table.HeaderCell>Ordered/Resizing</Table.HeaderCell>
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

class BundleVariantRow extends Component {
	render() {  	
		const variant = this.props.variant;
		
		let variantOptionsText = '';
		if (variant.color_value) variantOptionsText += ' ' + variant.color_value;
		if (variant.gemstone_value) variantOptionsText += ' ' + variant.gemstone_value;
		if (variant.length_value) variantOptionsText += ' ' + variant.length_value;
		if (variant.letter_value) variantOptionsText += ' ' + variant.letter_value;
		if (variant.singlepair_value) variantOptionsText += ' ' + variant.singlepair_value;
		variantOptionsText = variantOptionsText.trim();
		if (variantOptionsText === '') variantOptionsText = 'No options';
		
		const productUrl = variant.productId ? '/products/search?q=' + variant.productId : '';
		const productLink = variant.productName ? <a href={productUrl}>{variant.productName}</a> : '';
	    
    return (
      <Table.Row>
        <Table.Cell>{productLink}</Table.Cell>
        <Table.Cell>{variant.productId}</Table.Cell>
        <Table.Cell>{variantOptionsText}</Table.Cell>
				<Table.Cell className='right aligned' singleLine></Table.Cell>
      </Table.Row>
    );
  }
}

class BundleVariantsTable extends Component {
	render() {  	
		const bundleVariants = this.props.bundleVariants;
    
		let variantRows = [];
		if (bundleVariants) {
			bundleVariants.map(function(variantData, i) {
				variantRows.push(
				  <BundleVariantRow 
				    variant={variantData} 
				    key={i} 
			    />
		    );
				return variantRows;
	    });
		}
		
    return (
      <Segment secondary>
        <Table className='variants-table' basic='very' compact size='small' columns={7}>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Product Name</Table.HeaderCell>
              <Table.HeaderCell>Product ID</Table.HeaderCell>
              <Table.HeaderCell>Default Options</Table.HeaderCell>
              <Table.HeaderCell className='right aligned'></Table.HeaderCell>
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

class ProductEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productId: this.props.productId ? this.props.productId : '',
      vendor: this.props.vendor ? this.props.vendor.objectId : '',
      isBundle: this.props.isBundle !== undefined ? this.props.isBundle === true ? 'true' : 'false' : '',
      designerProductName: this.props.designerProductName ? this.props.designerProductName : ''
    };
    this.handleVendorChange = this.handleVendorChange.bind(this);
    this.handleProductTypeChange = this.handleProductTypeChange.bind(this);
    this.handleProductSaveClick = this.handleProductSaveClick.bind(this);
    this.handleDesignerProductName = this.handleDesignerProductName.bind(this);
  }
	handleProductTypeChange(e, {value}) {
  	if (value !== this.state.isBundle) {
    	this.setState({
      	isBundle: value
    	});
  	}
	}
	handleVendorChange(e, {value}) {
  	if (value !== this.state.vendor) {
    	this.setState({
      	vendor: value
    	});
  	}
	}
	handleDesignerProductName(e, {value}) {
  	if (value !== this.state.designerProductName) {
    	this.setState({
      	designerProductName: value
    	});
  	}
	}
	handleProductSaveClick() {
  	this.props.handleProductSave({productId: this.state.productId, vendorId: this.state.vendor, isBundle: this.state.isBundle, designerProductName: this.state.designerProductName});
	}
	isFormEdited() {
  	let edited = false;
  	if (
    	  (this.props.vendor && this.state.vendor !== this.props.vendor.objectId) 
    	  || (!this.props.vendor && this.state.vendor !== '')
      ) edited = true;
  	if (
    	  (this.props.isBundle === undefined && this.state.isBundle !== '') 
    	  || (this.props.isBundle !== undefined && this.state.isBundle === 'true' && this.props.isBundle === false) 
    	  || (this.props.isBundle !== undefined && this.state.isBundle === 'false' && this.props.isBundle === true)
  	  ) edited = true;
  	if (
    	  (this.props.designerProductName && this.state.designerProductName !== this.props.designerProductName) 
    	  || (!this.props.designerProductName && this.state.designerProductName !== '')
      ) edited = true;
  	return edited;
	}
	render() {
		const productTypeOptions = [
  		{ key: 0, value: 'false', text: 'Standard Product' },
  		{ key: 1, value: 'true', text: 'Bundle Product' }
		];
  	const productTypeSelect = <Form.Select label='Product Type' placeholder='Select product type' value={this.state.isBundle} options={productTypeOptions} onChange={this.handleProductTypeChange} />
  	
		const vendorOptions = this.props.designer && this.props.designer.vendors ? this.props.designer.vendors.map(function(vendor, i) {
  		return { key: i, value: vendor.objectId, text: vendor.name };
		}) : null;
		const vendorSelect = this.state.isBundle === 'false' || this.state.isBundle === '' ? <Form.Select label='Vendor' size='small' placeholder='Select a vendor' value={this.state.vendor} options={vendorOptions} onChange={this.handleVendorChange} /> : null;
		
		const designerProductName = this.state.isBundle === 'false' || this.state.isBundle === '' ? <Form.Input label='Designer Product Name' size='medium' placeholder='Enter name' value={this.state.designerProductName} onChange={this.handleDesignerProductName} /> : null;
    
    return (
      <Segment hidden={this.props.hidden} color={this.isFormEdited() ? 'blue' : null} >
        <Form>
          <Form.Group>
            {productTypeSelect}
            {vendorSelect}
            {designerProductName}
          </Form.Group>
          <Form.Button type='button' disabled={this.isFormEdited() ? null : true} primary onClick={this.handleProductSaveClick}>Save</Form.Button>
        </Form>
      </Segment>
    );
  }
}

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
//     this.handleVendorChange = this.handleVendorChange.bind(this);
//     this.handleProductTypeChange = this.handleProductTypeChange.bind(this);
    this.handleEditBundleClick = this.handleEditBundleClick.bind(this);
    this.handleToggleEditorClick = this.handleToggleEditorClick.bind(this);
    this.handleProductSave = this.handleProductSave.bind(this);
    this.handleSaveResize = this.handleSaveResize.bind(this);
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
	handleProductSave(data) {
		this.props.handleProductSave(data);
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
	handleSaveResize(data) {
  	data.productId = this.props.data.productId;
		this.props.handleSaveResize(data);
	}	
	
	handleEditBundleClick(productId) {
		this.props.handleEditBundleClick(productId);
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
  	let variants = this.props.data.variants;
  	const designer = this.props.data.designer;
  	const isBundle = this.props.data.isBundle;
  	const resizes = this.props.data.resizes;
  	const vendor = this.props.data.vendor;
		var rowClass = classNames(
			{
				'': showVariants,
				'hidden': !showVariants
			}
		);
			
		var variantsTables = [];
		if (variants && !isBundle) {
  		let variantGroupings = [];
  		// Determine variant groupings
			variants = variants.map(function(variantItem, i) {
  			
  			// Copy resizes to the variant if any exist
  			var variantResizes = [];
  			if (resizes && resizes.length > 0) {
    			resizes.map(function(resize, j) {
      			if (resize.variant && variantItem.objectId === resize.variant.objectId) {
        			variantResizes.push(resize);
      			}
      			return resize;
    			});
  			}
  			variantItem.resizes = variantResizes;
  			
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
    	        designer={designer}
    	        title={variantGroup} 
    	        basePrice={scope.props.data.price} 
    	        key={i} 
    	        isReloading={scope.props.isReloading}
    	        handleSaveVariantClick={scope.handleSaveVariantClick} 
    	        handleVariantsEdited={scope.handleVariantsEdited}
    	        savingVariants={scope.props.savingVariants} 
    	        updatedVariants={scope.props.updatedVariants}
    	        handleShowOrderFormClick={scope.handleShowOrderFormClick}
    	        handleSaveResize={scope.handleSaveResize}
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
  	        designer={designer}
  	        basePrice={scope.props.data.price} 
  	        key={1} 
  	        isReloading={scope.props.isReloading}
  	        handleSaveVariantClick={scope.handleSaveVariantClick} 
  	        handleVariantsEdited={scope.handleVariantsEdited}
  	        savingVariants={scope.props.savingVariants} 
  	        updatedVariants={scope.props.updatedVariants}
  	        handleShowOrderFormClick={scope.handleShowOrderFormClick}
  	        handleSaveResize={scope.handleSaveResize}
	        />
        );
      }
    } else if (isBundle) {
	    // Display table of bundle products
  	    variantsTables.push(
  	      <BundleVariantsTable 
  	        bundleVariants={this.props.data.bundleVariants} 
  	        bundleVariantsProducts={this.props.bundleVariantsProducts} 
  	        key={1} 
	        />
        );
    }
		
		const editBundleButton = isBundle ? 
		  <Form.Field><Form.Button compact basic circular 
        size='small' 
		    type='button'
        icon='list layout' 
        content='Edit Bundle Products' 
        disabled={this.props.isReloading} 
        onClick={()=>this.handleEditBundleClick(this.props.data.productId)} 
      /></Form.Field> : null;
		
		const saveAllButton = this.state.variantsEdited.length > 0 ? <Button primary circular compact size='small' icon='save' content='Save All' disabled={this.props.isReloading} onClick={this.handleSaveAllVariantsClick} /> : null;
		const productEditor = this.state.showEditor ? <ProductEditor productId={this.props.data.productId} designer={designer} vendor={vendor} isBundle={isBundle} designerProductName={this.props.data.designerProductName} handleProductSave={this.handleProductSave}/> : null;
		
    return (
      <Table.Row className={rowClass}>
        <Table.Cell colSpan='13' className='variant-row'>
          <Segment.Group horizontal compact className='toolbar'>
            <Segment basic>
              {productEditor}
              <Form size='mini' loading={this.props.isReloading}>
                <Form.Group inline>
                  <Form.Field>
                    <Form.Button circular compact basic size='small' type='button' icon='refresh' 
                      content='Reload' 
                      disabled={this.props.isReloading || this.state.showEditor} 
                      onClick={()=>this.handleReloadClick(this.props.data.productId)} 
                    />
                  </Form.Field>
                  <Form.Field>
                    <Form.Button circular compact basic size='small' type='button' 
                      icon={this.state.showEditor ? 'close' : 'edit'} 
                      color={this.state.showEditor ? 'black' : null} 
                      content={this.state.showEditor ? 'Close' : 'Edit Details'} 
                      onClick={this.handleToggleEditorClick} 
                    />
                  </Form.Field>
                  {editBundleButton}
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