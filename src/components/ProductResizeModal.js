import React, { Component } from 'react';
import { Modal, Button, Form } from 'semantic-ui-react';

class ProductResizeModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formComplete: false,
      resizeId: this.props.data ? this.props.data.objectId : '',
      variant: this.props.data.variant ? this.props.data.variant.id : {},
      resizeVariant: this.props.data.resizeVariant ? this.props.data.resizeVariant.id : {},
      units: this.props.data.units ? this.props.data.units : '',
      received: this.props.data.received ? this.props.data.received : ''
    };
//     this.handleAddToVendorOrder = this.handleAddToVendorOrder.bind(this);
//     this.handleCreateResize = this.handleCreateResize.bind(this);
//     this.handleVariantChange = this.handleVariantChange.bind(this);
//     this.handleResizeVariantChange = this.handleResizeVariantChange.bind(this);
    this.handleUnitsChange = this.handleUnitsChange.bind(this);
    this.handleReceivedChange = this.handleReceivedChange.bind(this);
    this.handleSaveResize = this.handleSaveResize.bind(this);
//     this.handleNotesChange = this.handleNotesChange.bind(this);
//     this.handleClose = this.handleClose.bind(this);
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
    const orderId = this.props.data.orderId ? this.props.data.orderId : null;
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
    const orderId = this.props.data.orderId ? this.props.data.orderId : null;
		this.props.handleCreateResize(resizes, orderId);
		this.props.handleProductOrderModalClose();
	}
*/

	handleSaveResize() {
    const data = {
      resizeId: this.state.resizeId,
      variant: this.state.variant,
      resizeVariant: this.state.resizeVariant,
      units: this.state.units,
      received: this.state.received
    };
		this.props.handleSaveResize(data);
	}
	
/*
  handleClose() {
    this.setState({
      formComplete: false,
      variant: {},
      resizeVariant: {},
      units: '',
      received: ''
    });
  }
*/
  
  isFormComplete() {
    let formComplete = true;
    if (this.state.variant === undefined) formComplete = false;
    if (this.state.units === undefined || this.state.units === '') formComplete = false;
//     if (this.state.received === undefined || this.state.received === '') formComplete = false;
    return formComplete;
  }
  
	handleUnitsChange(e, {value}) {
  	this.setState({
    	units: value
  	});
	}  
	
	handleReceivedChange(e, {value}) {
  	this.setState({
    	received: value
  	});
	}
	
	componentWillMount() {
  	this.setState({
      variant: this.props.data.variant ? this.props.data.variant : {},
      resizeVariant: this.props.data.resizeVariant ? this.props.data.resizeVariant : {},
      units: this.props.data.units ? this.props.data.units : '',
      received: this.props.data.received ? this.props.data.received : ''
  	});
	}
	
	componentWillReceiveProps(nextProps) {
  	this.setState({
      variant: nextProps.data.variant ? nextProps.data.variant : this.state.variant,
      resizeVariant: nextProps.data.resizeVariant ? nextProps.data.resizeVariant : this.state.resizeVariant,
      units: nextProps.data.units ? nextProps.data.units : this.state.units,
      received: nextProps.data.received ? nextProps.data.received : this.state.received
  	});
	}
  
	render() {
		const header = 'Mark units received for ' + (this.state.variant ? this.state.variant.productName : '');
		
		const saveButton = <Button disabled={this.props.isReloading || !this.isFormComplete()} color='olive' onClick={this.handleSaveResize}>Save Resize</Button>;
    
    return (
	    <Modal trigger={this.props.label} size='small' closeIcon='close'>
        <Modal.Header>
          {header}
        </Modal.Header>
        <Modal.Content>
          <Form loading={this.props.isReloading}>
            <Form.Group widths='equal'>
              <Form.Input 
                label='Units' 
                type='number' 
                min='1' 
                disabled={this.props.isReloading}
                value={this.state.units}
                onChange={this.handleUnitsChange}
              />
              <Form.Input 
                label='Received' 
                type='number' 
                min='1' 
                disabled={this.props.isReloading}
                value={this.state.received}
                onChange={this.handleReceivedChange}
              />
            </Form.Group>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          {saveButton}
        </Modal.Actions>
      </Modal>
    );
  }
}

export default ProductResizeModal;