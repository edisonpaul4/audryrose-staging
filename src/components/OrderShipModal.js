import React, { Component } from 'react';
// import { Link } from 'react-router';
import { Modal, Button, List, Step } from 'semantic-ui-react';

class OrderShipModal extends Component {
	render() {
		const order = this.props.order;
		const orderProducts = this.props.order.orderProducts;
		const product = this.props.product;
		const shippingAddress = product.shippingAddress;
		
		// Create an array of shipments
		let shipments = [];
		orderProducts.map(function(orderProduct, i) {
  		console.log(orderProduct);
  		let shipmentIndex = -1;
  		shipments.map(function(shipment, j) {
    		if (orderProduct.order_address_id === shipment[0].order_address_id) shipmentIndex = j;
    		return shipments;
  		});
  		if (shipmentIndex < 0) {
    		shipments.push([orderProduct]);
  		} else {
    		shipments[shipmentIndex].push(orderProduct);
  		}
  		return orderProducts;
		});
		
		// Create order step components
		const steps = [];
		shipments.map(function(shipment, i) {
  		
		});
		
    return (
	    <Modal trigger={<Button icon='shipping' content='Ship Item' />} size='small' closeIcon='close'>
        <Modal.Header>{orderProducts.length} item{orderProducts.length > 1 ? 's' : ''} can be shipped</Modal.Header>
        <Modal.Content image>
          <Modal.Description>
            <List relaxed>
                <List.Item>
                  <List.Header>Address</List.Header>
                  {shippingAddress.first_name} {shippingAddress.last_name}<br/>
                  {shippingAddress.company ? shippingAddress.company : null}{shippingAddress.company ? <br/> : null}
                  {shippingAddress.street_1} {shippingAddress.street_2}<br/>
                  {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zip} {shippingAddress.country}<br/>
                  {shippingAddress.email}<br/>
                  {shippingAddress.phone !== 'undefined' ? shippingAddress.phone : null}<br/>
                </List.Item>
                <List.Item>
                  <List.Header>Shipping Method</List.Header>
                  {shippingAddress.shipping_method}<br/>
                </List.Item>
                <List.Item>
                  <List.Header>Shipping Method</List.Header>
                  {shippingAddress.shipping_method}<br/>
                </List.Item>
            </List>
          </Modal.Description>
        </Modal.Content>
      </Modal>
    );
  }
}

export default OrderShipModal;