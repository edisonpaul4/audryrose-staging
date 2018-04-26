import React, { Component } from 'react';
import { Table, Input, Button, Dropdown, Dimmer, Segment, Loader, Label, Form, Icon, Select, Popup } from 'semantic-ui-react';
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
      wholesalePrice: this.props.data.customWholesalePrice ? parseFloat(this.props.data.customWholesalePrice) : this.props.data.adjustedWholesalePrice ? parseFloat(this.props.data.adjustedWholesalePrice) : 0,
      startWholesalePrice: this.props.data.customWholesalePrice ? parseFloat(this.props.data.customWholesalePrice) : this.props.data.adjustedWholesalePrice ? parseFloat(this.props.data.adjustedWholesalePrice) : 0,
      color: this.props.data.color_value ? this.props.data.color_value : '',
      startColor: this.props.data.color_value ? this.props.data.color_value : '',
      variantEdited: false,
      variantSaved: false
    };
    this.handleInventoryChange = this.handleInventoryChange.bind(this);
    this.handleWholesalePriceChange = this.handleWholesalePriceChange.bind(this);
    this.handleColorChange = this.handleColorChange.bind(this);
    this.handleSaveVariantClick = this.handleSaveVariantClick.bind(this);
    this.handleCancelVariantClick = this.handleCancelVariantClick.bind(this);
    this.handleShowOrderFormClick = this.handleShowOrderFormClick.bind(this);
    this.handleShowResizeFormClick = this.handleShowResizeFormClick.bind(this);
    this.handleApplyToAllClick = this.handleApplyToAllClick.bind(this);
    this.handleSaveResize = this.handleSaveResize.bind(this);
  }
  handleInventoryChange(e, {value}) {
    let edited = (parseFloat(value) !== parseFloat(this.state.startInventory)) ? true : false;
    if (!this.state.startInventory && parseFloat(value) === 0) edited = false;
    if (this.state.wholesalePrice !== this.state.startWholesalePrice) edited = true;
    if (this.state.color !== this.state.startColor) edited = true;
    this.setState({
      inventory: parseFloat(value),
      variantEdited: edited,
      variantSaved: false
    });
    this.props.handleVariantEdited({objectId: this.props.data.objectId, inventory: parseFloat(value), color: this.state.color, wholesalePrice: this.state.wholesalePrice}, edited);
  }
  handleWholesalePriceChange(e, {value}) {
    let edited = (parseFloat(value) !== parseFloat(this.state.startWholesalePrice)) ? true : false;
    if (this.state.inventory !== this.state.startInventory) edited = true;
    if (this.state.color !== this.state.startColor) edited = true;
    this.setState({
      wholesalePrice: parseFloat(value),
      variantEdited: edited,
      variantSaved: false
    });
    this.props.handleVariantEdited({objectId: this.props.data.objectId, inventory: this.state.inventory, color: this.state.color, wholesalePrice: parseFloat(value)}, edited);
  }
  handleColorChange(e, {value}) {
    let edited = (value !== this.state.startColor) ? true : false;
    if (!this.state.startColor && value === '') edited = false;
    if (this.state.inventory !== this.state.startInventory) edited = true;
    if (this.state.wholesalePrice !== this.state.startWholesalePrice) edited = true;
    this.setState({
      color: value,
      variantEdited: edited,
      variantSaved: false
    });
    this.props.handleVariantEdited({objectId: this.props.data.objectId, inventory: this.state.inventory, color: value, wholesalePrice: this.state.wholesalePrice}, edited);
  }
	handleSaveVariantClick(e, {value}) {
		this.props.handleSaveVariantClick({objectId: this.props.data.objectId, inventory: this.state.inventory, color: this.state.color, wholesalePrice: this.state.wholesalePrice});
	}
	handleCancelVariantClick(e, {value}) {
    this.setState({
      inventory: this.state.startInventory,
      color: this.state.startColor,
      wholesalePrice: this.state.startWholesalePrice,
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
	handleApplyToAllClick(value) {
  	this.props.handleApplyToAll(value);
	}
	handleSaveResize(data) {
		this.props.handleSaveResize(data);
	}
	getVendorOrderLabel(product, variant, vendorOrderVariant, vendorOrder, orderProductMatch) {
  	if (!vendorOrder) return <Label size='tiny' color='red' key={'vendorOrder-'+vendorOrder.objectId+'-'+vendorOrderVariant.objectId}>Error: Missing vendor order data</Label>;

  	const averageWaitTime = vendorOrder.vendor.waitTime ? vendorOrder.vendor.waitTime : 21;
  	const expectedDate = vendorOrder.dateOrdered ? moment(vendorOrder.dateOrdered.iso).add(averageWaitTime, 'days') : moment.utc().add(averageWaitTime, 'days');
  	const daysLeft = vendorOrder.dateOrdered ? expectedDate.diff(moment.utc(), 'days') : averageWaitTime;
  	let labelColor = 'yellow';
  	let labelIcon;
  	if (vendorOrderVariant.done === true) {
  		labelColor = 'olive';
  		labelIcon = <Icon name='checkmark' />;
  	} else if (vendorOrderVariant.ordered && daysLeft < 0) {
  		labelColor = 'red';
  	} else if (vendorOrderVariant.ordered) {
  		labelColor = 'olive';
  	}
  	let labelText = vendorOrderVariant.ordered ? vendorOrderVariant.units + ' Sent' : vendorOrderVariant.units + ' Pending';

  	if (vendorOrderVariant.done === true) {
  		labelText = vendorOrderVariant.received + ' Received';
  	}// else if (vendorOrderVariant.ordered && vendorOrderVariant.received > 0) {
  	// 	labelText += ', ' + vendorOrderVariant.received + ' Received';
  	// }
  	if (vendorOrderVariant.orderProducts) {
    	vendorOrderVariant.orderProducts.map(function(orderProduct, i) {
      	labelText += ' #' + vendorOrder.vendorOrderNumber;
      	return orderProduct;
    	});
  	}
  	const labelDetailText = vendorOrder.dateOrdered ? daysLeft < 0 ? moment(vendorOrder.dateOrdered.iso).format('M-D-YY') + ' (' + Math.abs(daysLeft) + ' days late)' : moment(vendorOrder.dateOrdered.iso).format('M-D-YY') + ' (' + daysLeft + ' days left)' : averageWaitTime + ' days wait';
  	const labelDetail = vendorOrderVariant.done === false ? <Label.Detail>{labelDetailText}</Label.Detail> : null;
  	const labelLink = vendorOrderVariant.done === false ? variant.designer ? '/designers/search?q=' + variant.designer.designerId : '/designers' : null;
  	let showLabel = false;
  	if (vendorOrderVariant.done === true && vendorOrderVariant.shipped === undefined) {
  		showLabel = true;
  	} else if (vendorOrderVariant.done === true) {
  		showLabel = vendorOrderVariant.shipped < vendorOrderVariant.received ? true : false;
  	} else {
  		showLabel = true;
  	}
  	return showLabel ? <Label as={labelLink ? 'a' : null} href={labelLink} size='tiny' color={labelColor} key={'vendorOrder-'+vendorOrder.objectId+'-'+vendorOrderVariant.objectId}>{labelIcon}{labelText}{labelDetail}</Label> : null;
	}
	getResizeLabel(product, variant, resize, orderProductMatch) {
		const averageWaitTime = 7;
		// const expectedDate = resize.dateSent ? moment(resize.dateSent.iso).add(averageWaitTime, 'days') : moment.utc().add(averageWaitTime, 'days');
		// const daysLeft = resize.dateSent ? expectedDate.diff(moment.utc(), 'days') : averageWaitTime;
		const daysSinceSent = resize.dateSent ? moment.utc().diff(resize.dateSent.iso, 'days') : null;
		let labelColor = 'olive';
		let labelIcon;
		if (resize.done === true) {
  		labelIcon = <Icon name='checkmark' />;
		} else if (daysSinceSent > averageWaitTime) {
  		labelColor = 'red';
		}
		const labelLink = resize.done === false && product && product.product_id ? '/products/search?q=' + product.product_id : null;

		let labelText = resize.units + ' Resize' + (resize.units > 1 ? 's' : '') + (resize.dateSent ? ' Sent' : ' Pending');
		if (resize.received >= resize.units) labelText = resize.received + ' Resize Received';
  	//if (resize.orderProduct) labelText += ' #' + resize.orderProduct.order_id;
		// const labelDetailText = daysLeft < 0 ? moment(resize.dateSent.iso).format('M-D-YY') + ' (' + Math.abs(daysLeft) + ' days late)' : moment(resize.dateSent.iso).format('M-D-YY') + ' (' + daysLeft + ' days left)';
		const labelDetailText = resize.dateSent ?  daysSinceSent + ' days ago' : '';
		const labelDetail = resize.done === false ? <Label.Detail>{labelDetailText}</Label.Detail> : null;
		let showLabel = false;
		if (resize.done === true && resize.shipped === undefined) {
  		showLabel = true;
		} else if (resize.done === true) {
  		showLabel = resize.shipped < resize.received ? true : false;
		} else {
  		showLabel = true;
		}
		return showLabel ? <Label as='a' href={labelLink} size='tiny' color={labelColor} key={'resize-'+resize.objectId}>{labelIcon}{labelText}{labelDetail}</Label> : null;
	}
	componentWillReceiveProps(nextProps) {
  	const state = this.state;
  	if (nextProps.updatedVariant) {
    	state.variantData = this.props.isSaving ? nextProps.data : this.state.variantData;
    	state.startInventory = nextProps.updatedVariant.inventoryLevel;
    	state.startColor = nextProps.updatedVariant.color_value;
      state.startWholesalePrice = nextProps.updatedVariant.customWholesalePrice ? parseFloat(nextProps.updatedVariant.customWholesalePrice) : nextProps.updatedVariant.adjustedWholesalePrice ? parseFloat(nextProps.updatedVariant.adjustedWholesalePrice) : 0;
      state.variantSaved = true;
  	}
  	if (nextProps.applyAllData) {
    	state.applyAllData = nextProps.applyAllData;
    	if (nextProps.applyAllData.color) {
      	state.color = nextProps.applyAllData.color;
      	this.props.handleVariantEdited({objectId: this.props.data.objectId, inventory: state.inventory, color: nextProps.applyAllData.color}, (state.inventory
      	!== state.startInventory || nextProps.applyAllData.color !== state.startColor || nextProps.wholesalePrice !== state.startWholesalePrice));
			}
			
			if(nextProps.applyAllData.wholesalePrice){
				state.wholesalePrice = nextProps.applyAllData.wholesalePrice;
				this.props.handleVariantEdited({ 
					objectId: this.props.data.objectId, 
					inventory: state.inventory, 
					wholesalePrice: nextProps.applyAllData.wholesalePrice }, 
					(state.inventory !== state.startInventory || 
						nextProps.applyAllData.color !== state.startColor || 
						nextProps.wholesalePrice !== state.startWholesalePrice)
				);
			}

    	this.props.handleClearApplyAllData();
  	}
  	if (nextProps.updatedVariant || nextProps.applyAllData) this.setState(state);
	}
	render() {
  	const scope = this;
		const data = this.props.data;
		const optionsData = this.props.optionsData;
    let variantEdited = (this.state.inventory !== this.state.startInventory || this.state.color !== this.state.startColor || this.state.wholesalePrice !== this.state.startWholesalePrice) ? true : false;
    // if (!this.state.startInventory && this.state.inventory === 0) variantEdited = false;
    // if (!this.state.startColor && this.state.color === '') variantEdited = false;

		// Create an array of other options values
		let otherOptions = [];
		if (data.gemstone_value) otherOptions.push(data.gemstone_value);
		if (data.singlepair_value) otherOptions.push(data.singlepair_value);
		if (data.letter_value) otherOptions.push(data.letter_value);
		if (data.length_value) otherOptions.push(data.length_value);
		if (data.font_value) otherOptions.push(data.font_value);

    const stoneColorCode = data.code ? '-' + data.code : null;
		const saveCancelClass = variantEdited ? '' : 'invisible';

		let vendorOrderAndResizes = [];
		if (data.vendorOrders) {
  		data.vendorOrders.map(function(vendorOrder, i) {
    	  var vendorOrderLabel = scope.getVendorOrderLabel(null, data, vendorOrder.vendorOrderVariant, vendorOrder.order);
    	  if (vendorOrderLabel) vendorOrderAndResizes.push(vendorOrderLabel);
    		return vendorOrder;
  		});
    }

		if (data.resizes) {
  		data.resizes.map(function(resize, i) {
        var resizeLabel = scope.getResizeLabel(null, data, resize);
        if (resizeLabel) {
      		vendorOrderAndResizes.push(
  		      <ProductResizeModal
  		        data={resize}
  		        label={resizeLabel}
  		        key={'resize-'+i}
  		        isReloading={scope.props.isReloading}
  		        handleSaveResize={scope.handleSaveResize}
  	        />
    		  );
  		  }
    		return resize;
  		});
    }

    const colorOptions = [];
    if (optionsData && optionsData.colors) {
      optionsData.colors.map(function(color, i) {
        colorOptions.push({key: `colorOption-${i}`, value: color.value, text: color.value});
        return color;
      });
    }

    const totalAwaitingInventory = data.totalAwaitingInventory ? data.totalAwaitingInventory : 0;

    const dropdownItems = [];
    if (data.size_value) dropdownItems.push(<Dropdown.Item icon='exchange' text='Resize' disabled={this.props.isSaving || variantEdited} onClick={this.handleShowResizeFormClick} key={'dropdown-resize'} />);

    return (
      <Table.Row warning={variantEdited ? true: false} positive={this.state.variantSaved && !variantEdited ? true: false} disabled={this.props.isSaving}>
        <Table.Cell>{data.styleNumber ? data.styleNumber : ''}{stoneColorCode}</Table.Cell>
        <Table.Cell className='no-wrap hover-icon'>
          <Select placeholder='Select a color' options={colorOptions} value={this.state.color} disabled={this.props.isSaving} onChange={this.handleColorChange} />
          {this.state.color !== '' ? (
						<Popup
							trigger={<Icon name='angle double down' />}
							position='right center'
							size='tiny'
							on='click'>
            	<Button 
								content={`Apply ${this.state.color} to all`} 
								primary 
								compact 
								size='tiny' 
								onClick={() => this.handleApplyToAllClick({color: this.state.color})} />
          	</Popup>
					) : null}
          {/*resize vertical*/}
        </Table.Cell>
        <Table.Cell>{data.size_value ? data.size_value : 'OS'}</Table.Cell>
        <Table.Cell>{otherOptions ? otherOptions.join(', ') : null}</Table.Cell>
				<Table.Cell><Input fluid type='number' value={this.state.inventory ? this.state.inventory : 0} onChange={this.handleInventoryChange} min={0} disabled={this.props.isSaving} /></Table.Cell>
				<Table.Cell>{data.inventoryOnHand}</Table.Cell>
				<Table.Cell>{totalAwaitingInventory}</Table.Cell>
				<Table.Cell>{vendorOrderAndResizes}</Table.Cell>
				<Table.Cell>{numeral(data.adjustedPrice).format('$0,0.00')}</Table.Cell>
				
				<Table.Cell className='no-wrap hover-icon'>
					<Input 
						type='number' 
						value={this.state.wholesalePrice ? numeral(this.state.wholesalePrice).format('0.00') : 0} 
						onChange={this.handleWholesalePriceChange} 
						min={0} 
						disabled={this.props.isSaving} />
					{this.state.wholesalePrice ? (
						<Popup
							trigger={<Icon name='angle double down' />}
							position='right center'
							size='tiny'
							on='click'>
							<Button 
								content={`Apply ${this.state.wholesalePrice} to all`} 
								primary 
								compact 
								size='tiny' 
								onClick={() => this.handleApplyToAllClick({ wholesalePrice: this.state.wholesalePrice })} />
						</Popup>
					) : null}
				</Table.Cell>

				<Table.Cell singleLine>
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
            {dropdownItems.length > 0 ?
              <Dropdown floating button compact className='icon' disabled={this.props.isSaving || variantEdited}>
                <Dropdown.Menu>
                  {dropdownItems}
                </Dropdown.Menu>
              </Dropdown> : null}
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
    this.handleApplyToAll = this.handleApplyToAll.bind(this);
    this.handleClearApplyAllData = this.handleClearApplyAllData.bind(this);
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
	handleApplyToAll(data) {
  	this.props.handleApplyToAll(data);
	}
	handleClearApplyAllData() {
  	this.props.handleClearApplyAllData();
	}
	handleSaveResize(data) {
		this.props.handleSaveResize(data);
	}
	render() {
  	var scope = this;
		const variants = this.props.variants;
		const vendor = this.props.vendor;
		const designer = this.props.designer;
		// const resizes = this.props.resizes;
    const subpage = this.props.subpage;

		// Sort the data
		if (variants.length && variants[0].size_value) {
      variants.sort(function(a, b) {
        return parseFloat(a.size_value) - parseFloat(b.size_value);
      });
    }

		let variantRows = [];
		if (variants) {
			variants.map(function(variantData, i) {
  			let updatedVariantMatch;
  			if (scope.props.updatedVariants && scope.props.updatedVariants.length > 0) {
        	scope.props.updatedVariants.map(function(updatedVariant, i) {
          	const updatedVariantDataJSON = updatedVariant.toJSON();
          	if (updatedVariantDataJSON.objectId === variantData.objectId) {
            	updatedVariantMatch = updatedVariantDataJSON;
          	}
            return updatedVariant;
          });
  			}

        let index = -1;
        if (scope.props.savingVariants) {
          scope.props.savingVariants.map(function(savingVariant, i) {
            if (savingVariant === variantData.objectId) index = i;
            return savingVariant;
          });
        }
        const isSaving = index < 0 ? false : true;

        // Only show pending resize variants in /products/being-resized
        if (subpage === 'being-resized'){
          if (!variantData.resizes) return variantData;
          if (variantData.resizes && variantData.resizes.length < 1) return variantData;
        }

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
				    subpage={subpage}
				    optionsData={scope.props.optionsData}
				    applyAllData={scope.props.applyAllData}
				    key={i}
				    isReloading={scope.props.isReloading}
				    handleSaveVariantClick={scope.handleSaveVariantClick}
				    handleVariantEdited={scope.handleVariantEdited}
				    isSaving={isSaving}
				    updatedVariant={updatedVariantMatch}
				    handleShowOrderFormClick={scope.handleShowOrderFormClick}
				    handleApplyToAll={scope.handleApplyToAll}
				    handleClearApplyAllData={scope.handleClearApplyAllData}
				    handleSaveResize={scope.handleSaveResize}
			    />
		    );
				return variantData;
	    });
		}
		const tableTitle = (this.props.title) ? <h3>{this.props.title}</h3> : null;

    return (
      <Segment secondary>
        {tableTitle}
        <Table className='variants-table' basic='very' compact size='small' columns={16}>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Style-Color</Table.HeaderCell>
              <Table.HeaderCell>Color</Table.HeaderCell>
              <Table.HeaderCell>Size</Table.HeaderCell>
              <Table.HeaderCell>Other Options</Table.HeaderCell>
              <Table.HeaderCell>ACT OH</Table.HeaderCell>
              <Table.HeaderCell>Available</Table.HeaderCell>
              <Table.HeaderCell>Total Awaiting</Table.HeaderCell>
              <Table.HeaderCell>Ordered/Resizing</Table.HeaderCell>
              <Table.HeaderCell>RETAIL $</Table.HeaderCell>
              <Table.HeaderCell>WHLS $</Table.HeaderCell>
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
		const subpage = this.props.subpage;

		let variantRows = [];
		if (bundleVariants) {
			bundleVariants.map(function(variantData, i) {
				variantRows.push(
				  <BundleVariantRow
				    variant={variantData}
				    subpage={subpage}
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
			isBundle: this.props.data.isBundle !== undefined ? this.props.data.isBundle === true ? 'true' : 'false' : '',
			applyAllData: null
    };
    this.handleReloadClick = this.handleReloadClick.bind(this);
    this.handleSaveVariantClick = this.handleSaveVariantClick.bind(this);
    this.handleSaveAllVariantsClick = this.handleSaveAllVariantsClick.bind(this);
    this.handleVariantsEdited = this.handleVariantsEdited.bind(this);
    this.handleShowOrderFormClick = this.handleShowOrderFormClick.bind(this);
    // this.handleVendorChange = this.handleVendorChange.bind(this);
    // this.handleProductTypeChange = this.handleProductTypeChange.bind(this);
    this.handleEditBundleClick = this.handleEditBundleClick.bind(this);
    this.handleToggleEditorClick = this.handleToggleEditorClick.bind(this);
    this.handleApplyToAll = this.handleApplyToAll.bind(this);
    this.handleClearApplyAllData = this.handleClearApplyAllData.bind(this);
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
	handleApplyToAll(data) {
  	this.setState({
    	applyAllData: data
  	});
	}
	handleClearApplyAllData() {
  	this.setState({
    	applyAllData: null
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
  	const subpage = this.props.subpage;
  	const optionsData = this.props.optionsData;
  	const applyAllData = this.state.applyAllData;
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

        const colorStone = {
          color: variantItem.color_value ? variantItem.color_value : null,
          gemstone: variantItem.gemstone_value ? variantItem.gemstone_value : null
        };

        function containsObject(obj, list) {
          var match = false;
          list.map(function(g) {
            if (obj.color === g.color && obj.gemstone === g.gemstone) match = true;
            return g;
          });
          return match;
        }

  			if (!containsObject(colorStone, variantGroupings)) {
    			variantGroupings.push(colorStone);
  			}
				return variantItem;
	    });

	    if (variantGroupings.length > 1) {
  	    // If there are groupings, create a VariantsTable for each group
  	    variantGroupings.map(function(variantGroup, i) {
    	    var variantsInGroup = [];
    	    variants.map(function(variantItem, j) {
            var matches = true;
      	    if (variantItem.color_value) {
              if (variantItem.color_value !== variantGroup.color) matches = false;
            }
            if (variantItem.gemstone_value) {
              if (variantItem.gemstone_value !== variantGroup.gemstone) matches = false;
            }
            if (matches) variantsInGroup.push(variantItem);
      	    return variantItem;
    	    });
          var title = `${variantGroup.color ? variantGroup.color : ''}${variantGroup.color && variantGroup.gemstone ? ' / ' : ''}${variantGroup.gemstone ? variantGroup.gemstone : ''}`;
    	    variantsTables.push(
    	      <VariantsTable
    	        variants={variantsInGroup}
    	        vendor={vendor}
    	        designer={designer}
    	        title={title}
    	        subpage={subpage}
    	        optionsData={optionsData}
    	        applyAllData={applyAllData}
    	        key={i}
    	        isReloading={scope.props.isReloading}
    	        handleSaveVariantClick={scope.handleSaveVariantClick}
    	        handleVariantsEdited={scope.handleVariantsEdited}
    	        savingVariants={scope.props.savingVariants}
    	        updatedVariants={scope.props.updatedVariants}
    	        handleShowOrderFormClick={scope.handleShowOrderFormClick}
    	        handleSaveResize={scope.handleSaveResize}
    	        handleApplyToAll={scope.handleApplyToAll}
    	        handleClearApplyAllData={scope.handleClearApplyAllData}
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
  	        subpage={subpage}
  	        optionsData={optionsData}
  	        applyAllData={applyAllData}
  	        key={1}
  	        isReloading={scope.props.isReloading}
  	        handleSaveVariantClick={scope.handleSaveVariantClick}
  	        handleVariantsEdited={scope.handleVariantsEdited}
  	        savingVariants={scope.props.savingVariants}
  	        updatedVariants={scope.props.updatedVariants}
  	        handleShowOrderFormClick={scope.handleShowOrderFormClick}
  	        handleSaveResize={scope.handleSaveResize}
  	        handleApplyToAll={scope.handleApplyToAll}
  	        handleClearApplyAllData={scope.handleClearApplyAllData}
	        />
        );
      }
    } else if (isBundle) {
	    // Display table of bundle products
	    variantsTables.push(
	      <BundleVariantsTable
	        bundleVariants={this.props.data.bundleVariants}
	        bundleVariantsProducts={this.props.bundleVariantsProducts}
	        subpage={subpage}
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
        <Table.Cell colSpan='16' className='variant-row'>
          <Dimmer.Dimmable as={Segment} vertical dimmed={this.props.isReloading}>
            <Dimmer active={this.props.isReloading} inverted>
              <Loader>Loading</Loader>
            </Dimmer>
            <Segment.Group horizontal compact className='toolbar'>
              <Segment basic>
                {productEditor}
                <Form size='mini'>
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
            {variantsTables}
          </Dimmer.Dimmable>
        </Table.Cell>
      </Table.Row>
    );
  }
}

export default ProductDetails;
