import React, { Component } from 'react';
import { Modal, Button, List, Segment, Icon, Header } from 'semantic-ui-react';

class Shipment extends Component {
  render() {
    const shipment = this.props.data;
    const shippingAddress = shipment.orderProducts[0].shippingAddress;
    let shipmentProducts = shipment.orderProducts.map(function(product, i) {
      const title = product.quantity + ' x ' + product.name;
      let options = product.product_options.map(function(option, j) {
        return <span key={`${i}-${j}`}>{option.display_name}: {option.display_value}<br/></span>
      });
      return <span key={`${i}`}>{title}<br/>{options}</span>
    });
    return (
      <Segment>
      <Header>{this.props.title}</Header>
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
              <List.Header>Products</List.Header>
              {shipmentProducts}
            </List.Item>
        </List>
      </Segment>
    )
  }
}

class OrderShipModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showProducts: false,
      showEditor: false,
      product: null,
      orderProducts: null,
      shipments: null
    };
    this.handleCreateShipments = this.handleCreateShipments.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }
	handleCreateShipments() {
// 		this.props.handleCreateShipments(productId);
	}
  handleClose() {
    console.log('close')
    this.props.handleShipModalClose();
  }
	componentWillMount() {
		this.setState({
  		product: this.props.product,
  		orderProducts: this.props.order.orderProducts,
  		shipments: this.props.shipments
		});
	}
	componentWillReceiveProps(nextProps) {
		this.setState({
  		product: nextProps.product,
  		orderProducts: nextProps.order.orderProducts,
  		shipments: nextProps.shipments
		});
	}
	render() {
// 		const scope = this;
		const orderProducts = this.state.orderProducts;
		
  			// Match an OrderShipment to this OrderProduct
/*
  			var shipment = null;
  			if (shipments) {
    			shipments.map(function(shipmentObj) {
      			shipmentObj.items.map(function(item) {
        			if (productRow.orderProductId === item.order_product_id) shipment = shipmentObj;
        			return item;
      			});
      			return shipmentObj;
    			});
  			}
*/


		
		// Create an array of shipments
		let shipmentGroups = [];
		orderProducts.map(function(orderProduct, i) {
  		let shipmentIndex = -1;
  		shipmentGroups.map(function(shipmentGroup, j) {
    		if (orderProduct.order_address_id === shipmentGroup.orderAddressId) shipmentIndex = j;
    		return shipmentGroups;
  		});
  		if (shipmentIndex < 0) {
    		shipmentGroups.push({orderAddressId: orderProduct.order_address_id, orderProducts: [orderProduct]});
  		} else {
    		shipmentGroups[shipmentIndex].orderProducts.push(orderProduct);
  		}
  		return orderProduct;
		});
		
		console.log(shipmentGroups);

		const shipmentComponents = [];
		shipmentGroups.map(function(shipmentGroup, i) {
  		const title = 'Shipment ' + (i+1);
//   		let description = shipmentGroup.orderProducts.length + ' item';
//   		if (shipmentGroup.orderProducts.length > 1) description += 's';
//   		const asElement = active ? 'div' : 'a';
    	shipmentComponents.push(<Shipment title={title} data={shipmentGroup} key={i}/>);
//     	shipmentComponents.push({ as: asElement, active: active, title: title, description: description });
  		return shipmentGroups;
		});

// 		let shippingAddress = activeShipment.orderProducts[0].shippingAddress;
// 		if (!shippingAddress) return (<Button disabled={true} icon='shipping' content='Error' />);

    return (
	    <Modal open={this.props.open} onClose={this.handleClose} size='small' closeIcon='close'>
        <Modal.Content>
          <Modal.Description>
            <Segment.Group>
              {shipmentComponents}
            </Segment.Group>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button basic color='grey' content='Close' onClick={this.handleClose} />
          <Button color='green' onClick={this.handleCreateShipments}>
            <Icon name='checkmark' /> Create Shipment{shipmentComponents.length > 1 ? 's' : null}
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

export default OrderShipModal;