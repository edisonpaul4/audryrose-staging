import React, { Component } from 'react';
import { Modal, Button, List, Segment, Icon, Header, Form } from 'semantic-ui-react';
import moment from 'moment';

/*
class VariantGroup extends Component {
  render() {
    const variantGroup = this.props.data;
    const shipment = variantGroup.shipment;
//     console.log(variantGroup.shipment)
    const shippingAddress = variantGroup.orderProducts[0].shippingAddress;
    
    let shipmentProducts = variantGroup.orderProducts.map(function(product, i) {
      const title = product.quantity + ' x ' + product.name;
      let options = product.product_options.map(function(option, j) {
        return <span key={`${i}-${j}`}>{option.display_name}: {option.display_value}<br/></span>
      });
      return <span key={`${i}`}>{title}<br/>{options}</span>
    });
    
    const dateShipped = shipment ? <List.Item><List.Header>Date Shipped</List.Header>{moment(shipment.date_created.iso).calendar()}<br/></List.Item> : null;
    const trackingNumber = shipment ? <List.Item><List.Header>Tracking Number</List.Header>{shipment.tracking_number}<br/></List.Item> : null;
    const packingSlip = shipment && shipment.packingSlipUrl ? <List.Item><a href={shipment.packingSlipUrl} target='_blank'>Print Packing Slip</a></List.Item> : null;
    const shippingLabel = shipment && shipment.shippo_label_url ? <List.Item><a href={shipment.shippo_label_url} target='_blank'>Print Shipping Label</a></List.Item> : null;
    
    return (
      <Segment color={this.props.color} secondary={this.props.secondary} disabled={this.props.disabled} loading={this.props.isLoading}>
        <Header>
          <Icon name={variantGroup.shipment ? 'check' : 'shipping'} color={variantGroup.shipment ? 'olive' : 'black'} />
          <Header.Content>
            {this.props.title}
          </Header.Content>
        </Header>
        <List relaxed>
            <List.Item>
              <List.Header>Address</List.Header>
              {shippingAddress.first_name} {shippingAddress.last_name}<br/>
              {shippingAddress.company ? shippingAddress.company : null}{shippingAddress.company ? <br/> : null}
              {shippingAddress.street_1 ? shippingAddress.street_1 : null}{shippingAddress.street_1 ? <br/> : null}
              {shippingAddress.street_2 ? shippingAddress.street_2 : null}{shippingAddress.street_2 ? <br/> : null}
              {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zip} <br/>
              {shippingAddress.country ? shippingAddress.country : null}{shippingAddress.country ? <br/> : null}
              {shippingAddress.email ? shippingAddress.email : null}{shippingAddress.email ? <br/> : null}
              {shippingAddress.phone !== 'undefined' ? shippingAddress.phone : null}<br/>
            </List.Item>
            <List.Item>
              <List.Header>Products</List.Header>
              {shipmentProducts}
            </List.Item>
            <List.Item>
              <List.Header>Shipping Method</List.Header>
              {shippingAddress.shipping_method}<br/>
            </List.Item>
            {dateShipped}
            {trackingNumber}
            {packingSlip}
            {shippingLabel}
        </List>
      </Segment>
    )
  }
}
*/

class ProductOrderModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formComplete: true
    };
    this.handleCreateProductOrder = this.handleCreateProductOrder.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }
  
	handleCreateProductOrder() {
  	const scope = this;
/*
  	// Add shipment detail form data to all shippableGroups
  	let shippableGroups = this.props.shippableGroups.map(function(group, i) {
    	group.customShipment = {
        shippingProvider: scope.state.shippingProvider,
        shippingParcel: scope.state.shippingParcel,
        shippingServiceLevel: scope.state.shippingServiceLevel,
        length: scope.state.length,
        width: scope.state.width,
        height: scope.state.height,
        weight: scope.state.weight
    	}
    	return group;
  	});
*/
		this.props.handleCreateProductOrder(/* shippableGroups */);
		this.props.handleProductOrderModalClose();
	}
	
  handleClose() {
/*
  	this.setState({
      shippingProvider: 'usps',
      shippingParcel: 'USPS_SmallFlatRateBox',
      shippingServiceLevel: 'usps_priority',
      length: '5.44',
      width: '8.69',
      height: '1.75',
      weight: '3',
  	});
*/
    this.props.handleProductOrderModalClose();
  }
  
  isFormComplete() {
    let formComplete = true;
/*
    if (this.state.shippingProvider === undefined || this.state.shippingProvider === '') formComplete = false;
    if (this.state.shippingParcel === undefined || this.state.shippingParcel === '') formComplete = false;
    if (this.state.shippingServiceLevel === undefined || this.state.shippingServiceLevel === '') formComplete = false;
    if (this.state.length === undefined || this.state.length === '') formComplete = false;
    if (this.state.width === undefined || this.state.width === '') formComplete = false;
    if (this.state.height === undefined || this.state.height === '') formComplete = false;
    if (this.state.weight === undefined || this.state.weight === '') formComplete = false;
*/
    
    return formComplete;
  }
  
	render() {
		const scope = this;
// 		const shippedGroups = this.props.shippedGroups;
		
    return (
	    <Modal open={this.props.open} onClose={this.handleClose} size='large' closeIcon='close'>
        <Modal.Content>
          <Modal.Description>
            Content goes here...
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button basic disabled={this.props.isLoading} color='grey' content='Close' onClick={this.handleClose} />
        </Modal.Actions>
      </Modal>
    );
  }
}

export default ProductOrderModal;