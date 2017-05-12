import React, { Component } from 'react';
import { Modal, Button, Header, Form } from 'semantic-ui-react';

class ProductResizeModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formComplete: false,
      variant: this.props.productResizeData.variant ? this.props.productResizeData.variant : {},
      resizeVariant: this.props.productResizeData.resizeVariant ? this.props.productResizeData.resizeVariant : {},
      units: 1,
      received: '',
      notes: ''
    };
//     this.handleAddToVendorOrder = this.handleAddToVendorOrder.bind(this);
//     this.handleCreateResize = this.handleCreateResize.bind(this);
//     this.handleVariantChange = this.handleVariantChange.bind(this);
//     this.handleResizeVariantChange = this.handleResizeVariantChange.bind(this);
    this.handleUnitsChange = this.handleUnitsChange.bind(this);
    this.handleReceivedChange = this.handleReceivedChange.bind(this);
//     this.handleNotesChange = this.handleNotesChange.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }
  
/*
	handleAddToVendorOrder() {
    const orders = [{
      productId: this.state.product ? this.state.product.productId : null,
      vendor: this.state.vendor,
      variant: this.state.variant,
      units: this.state.units,
      notes: this.state.notes
    }];
    const orderId = this.props.productResizeData.orderId ? this.props.productResizeData.orderId : null;
		this.props.handleAddToVendorOrder(orders, orderId);
		this.props.handleProductOrderModalClose();
	}
*/
	
/*
	handleCreateResize() {
    const resizes = [{
      productId: this.state.product ? this.state.product.productId : null,
      vendor: this.state.vendor,
      variant: this.state.variant,
      resizeVariant: this.state.resizeVariant,
      units: this.state.units,
      notes: this.state.notes
    }];
    const orderId = this.props.productResizeData.orderId ? this.props.productResizeData.orderId : null;
		this.props.handleCreateResize(resizes, orderId);
		this.props.handleProductOrderModalClose();
	}
*/
	
  handleClose() {
    this.setState({
      formComplete: false,
      variant: {},
      resizeVariant: {},
      units: 1,
      received: '',
      notes: ''
    });
    this.props.handleProductOrderModalClose();
  }
  
  isFormComplete() {
    let formComplete = true;
    if (this.state.variant === undefined || this.state.variant === '') formComplete = false;
    if (this.state.units === undefined || this.state.units === '') formComplete = false;
    return formComplete;
  }
  
	handleVariantChange(e, {value}) {
  	this.setState({
    	variant: value,
    	resizeVariant: this.getRecommendedResize(value, this.state.product)
  	});
	}
	
	handleResizeVariantChange(e, {value}) {
  	this.setState({
    	resizeVariant: value
  	});
	}
	
	handleUnitsChange(e, {value}) {
  	this.setState({
    	units: value
  	});
	}
	
	handleNotesChange(e, {value}) {
  	this.setState({
    	notes: value
  	});
	}
	
	componentWillMount() {
  	const variant = this.props.productResizeData && this.props.productResizeData.variant ? this.props.productResizeData.variant : '';
  	const resize = this.props.productResizeData && this.props.productResizeData.resize ? this.props.productResizeData.resize : false;
    const vendor = this.props.productResizeData && this.props.productResizeData.product && this.props.productResizeData.product.vendor ? this.props.productResizeData.product.vendor.objectId : null;
  	const product = this.props.productResizeData && this.props.productResizeData.product ? this.props.productResizeData.product : null;
  	const resizeVariant = this.props.productResizeData && variant !== '' ? this.getRecommendedResize(variant, product) : '';
  	this.setState({
    	variant: variant,
    	resize: resize,
    	product: product,
    	resizeVariant: resizeVariant,
    	vendor: vendor
  	});
	}
	
	componentWillReceiveProps(nextProps) {
  	const variant = nextProps.productResizeData && nextProps.productResizeData.variant ? nextProps.productResizeData.variant : '';
  	const resize = nextProps.productResizeData && nextProps.productResizeData.resize ? nextProps.productResizeData.resize : false;
    const vendor = nextProps.productResizeData && nextProps.productResizeData.product && nextProps.productResizeData.product.vendor ? nextProps.productResizeData.product.vendor.objectId : null;
  	const product = nextProps.productResizeData && nextProps.productResizeData.product ? nextProps.productResizeData.product : null;
  	this.setState({
    	variant: variant,
    	resize: resize,
    	product: product,
    	resizeVariant: this.getRecommendedResize(variant, product),
    	vendor: vendor
  	});
	}
  
	render() {
  	console.log(this.state.units)
		const product = this.state.product;
		const header = this.state.resize ? 'Send ' + (product ? product.name : '') + ' for resize' : 'Create an order for ' + (product ? product.name : '');
		
		let variants = product && product.variants ? product.variants : [];
		let variantOptions = [];
		let resizeVariantOptions = [];
		let resizeSelect = null;
		if (variants.length > 0) {
  		const hasColorValue = variants[0].color_value !== undefined;
  		const hasStoneValue = variants[0].gemstone_value !== undefined;
  		const hasSizeValue = variants[0].size_value !== undefined;
  		if (hasColorValue && hasSizeValue) {
        variants.sort(function(a, b) { return a["color_value"] - b["color_value"] || parseFloat(a["size_value"]) - parseFloat(b["size_value"]); });
  		} else if (hasStoneValue && hasSizeValue) {
    		variants.sort(function(a, b) { return a["gemstone_value"] - b["gemstone_value"] || parseFloat(a["size_value"]) - parseFloat(b["size_value"]); });
  		} else if (hasSizeValue) {
    		variants.sort(function(a, b) { return (parseFloat(a.size_value) > parseFloat(b.size_value)) ? 1 : ((parseFloat(b.size_value) > parseFloat(a.size_value)) ? -1 : 0);} );
  		}
      
  		variants.map(function(variant, i) {
    		let styleCode = variant.styleNumber;
    		let optionText = '';
    		if (variant.code) {
      		styleCode += '-' + variant.code;
    		}
    		if (variant.color_value) {
      		optionText += 'Color: ' + variant.color_value;
    		}
    		if (variant.gemstone_value) {
      		if (optionText !== '') optionText += ',  ';
      		optionText += 'Stone: ' + variant.gemstone_value;
    		}
    		if (variant.size_value) {
      		if (optionText !== '') optionText += ',  ';
      		optionText += 'Size: ' + variant.size_value;
    		}
    		if (variant.inventoryLevel !== undefined) {
      		if (optionText !== '') optionText += ',  ';
      		optionText += 'Inventory: ' + variant.inventoryLevel;
    		}
    		let optionContent = (optionText !== '') ? <Header content={optionText} subheader={styleCode} /> : <Header content={styleCode} />;
        
    		const option = { 
      		key: i, 
      		text: optionText !== '' ? optionText : styleCode, 
      		value: variant.objectId,
      		content: optionContent
    		};
    		variantOptions.push(option);
    		if (variant.inventoryLevel === undefined || variant.inventoryLevel > 0) resizeVariantOptions.push(option);
        return variant;
  		});
  		
      resizeSelect = this.state.resize ? <Form.Group widths='equal'><Form.Select 
          label={'Product Variant To Be Resized'}
          options={resizeVariantOptions} 
          placeholder='Select a product variant' 
          value={this.state.resizeVariant}
          onChange={this.handleResizeVariantChange} 
        /></Form.Group> : null;
		}
		
		const createOrderButton = <Button disabled={this.props.isLoading || !this.isFormComplete() || (product && !product.vendor)} color='olive' onClick={this.state.resize ? this.handleCreateResize : this.handleAddToVendorOrder}>{this.state.resize ? 'Create Resize' : 'Add To Order'}</Button>;
    
    return (
	    <Modal open={this.props.open} onClose={this.handleClose} size='small' closeIcon='close'>
        <Modal.Header>
          {header}
        </Modal.Header>
        <Modal.Content>
          <Form loading={!product}>
            <Form.Group>
              <Form.Input 
                label='Units' 
                type='number' 
                disabled={true}
                value={this.state.units}
                onChange={this.handleUnitsChange} 
              />
            </Form.Group>
            <Form.Group widths='equal'>
              <Form.TextArea 
                label='Notes' 
                value={this.state.notes}
                onChange={this.handleNotesChange} 
              />
            </Form.Group>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button basic disabled={this.props.isLoading} color='grey' content='Close' onClick={this.handleClose} />
          {createOrderButton}
        </Modal.Actions>
      </Modal>
    );
  }
}

export default ProductResizeModal;