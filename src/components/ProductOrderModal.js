import React, { Component } from 'react';
import { Modal, Button, Header, Form } from 'semantic-ui-react';

class ProductOrderModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formComplete: false,
      vendor: this.props.productOrderData.product.vendor ? this.props.productOrderData.product.vendor.objectId : null,
      variant: this.props.productOrderData.variant ? this.props.productOrderData.variant : null,
      units: 1,
      notes: ''
    };
    this.handleAddToVendorOrder = this.handleAddToVendorOrder.bind(this);
    this.handleVariantChange = this.handleVariantChange.bind(this);
    this.handleUnitsChange = this.handleUnitsChange.bind(this);
    this.handleNotesChange = this.handleNotesChange.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }
  
	handleAddToVendorOrder() {
    var orders = [{
      vendor: this.state.vendor,
      variant: this.state.variant,
      productId: this.props.productOrderData.product.productId,
      units: this.state.units,
      notes: this.state.notes
    }]
		this.props.handleAddToVendorOrder(orders);
		this.props.handleProductOrderModalClose();
	}
	
  handleClose() {
    this.setState({
      formComplete: false,
      vendor: this.props.productOrderData.product.vendor ? this.props.productOrderData.product.vendor.objectId : null,
      variant: this.props.productOrderData.variant ? this.props.productOrderData.variant : null,
      units: 1,
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
    	variant: value
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
  
	render() {
		const { productOrderData } = this.props;
		
		let variants = productOrderData.product.variants;
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
  		
		
		const variantOptions = variants.map(function(variant, i) {
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
  		let optionContent = (optionText !== '') ? <Header content={optionText} subheader={styleCode} /> : <Header content={styleCode} />;
  		return { 
    		key: i, 
    		text: optionText !== '' ? optionText : styleCode, 
    		value: variant.objectId,
    		content: optionContent
  		};
		});
		
		const createOrderButton = <Button disabled={this.props.isLoading || !this.isFormComplete() || !productOrderData.product.vendor} color='olive' onClick={this.handleAddToVendorOrder}>Add To Order</Button>;
    
    return (
	    <Modal open={this.props.open} onClose={this.handleClose} size='small' closeIcon='close'>
        <Modal.Header>
          Create an order for {productOrderData.product.name}
        </Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Group>
              <Form.Input label='Vendor' error={productOrderData.product.vendor ? false : true} value={productOrderData.product.vendor ? productOrderData.product.vendor.name : 'Product vendor missing'} readOnly />
            </Form.Group>
            <Form.Group widths='equal'>
              <Form.Select 
                label='Product Variant' 
                options={variantOptions} 
                placeholder='Select a product variant' 
                value={this.state.variant}
                onChange={this.handleVariantChange} 
              />
            </Form.Group>
            <Form.Group>
              <Form.Input 
                label='Units' 
                type='number' 
                min='1' 
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

export default ProductOrderModal;