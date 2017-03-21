import React, { Component } from 'react';
import { Modal, Button, List, Segment, Icon, Header/* , Form, Select */ } from 'semantic-ui-react';
import moment from 'moment';

class ShipmentGroup extends Component {
  render() {
    const shipmentGroup = this.props.data;
    const shipment = shipmentGroup.shipment;
//     console.log(shipmentGroup.shipment)
    const shippingAddress = shipmentGroup.orderProducts[0].shippingAddress;
    
    let shipmentProducts = shipmentGroup.orderProducts.map(function(product, i) {
      const title = product.quantity + ' x ' + product.name;
      let options = product.product_options.map(function(option, j) {
        return <span key={`${i}-${j}`}>{option.display_name}: {option.display_value}<br/></span>
      });
      return <span key={`${i}`}>{title}<br/>{options}</span>
    });
    
    const dateShipped = shipment ? <List.Item><List.Header>Date Shipped</List.Header>{moment(shipment.date_created.iso).calendar()}<br/></List.Item> : null;
    const trackingNumber = shipment ? <List.Item><List.Header>Tracking Number</List.Header>{shipment.tracking_number}<br/></List.Item> : null;
    const shippingLabel = shipment && shipment.shippo_label_url ? <List.Item><a href={shipment.shippo_label_url} target='_blank'>Print Shipping Label</a></List.Item> : null;
    
/*
    const shippingProviderOptions = [
      { key: 'usps', value: 'usps', flag: 'usps', text: 'USPS' }, 
      { key: 'fedex', value: 'fedex', flag: 'fedex', text: 'FedEx' }
    ];
    const shippingProviderSelect = shipment ? null : <Select placeholder='Shipping provider' options={shippingProviderOptions} />;
*/
    
    return (
      <Segment color={this.props.color} secondary={this.props.secondary} disabled={this.props.disabled} loading={this.props.isLoading}>
        <Header>
          <Icon name={shipmentGroup.shipment ? 'check' : 'shipping'} color={shipmentGroup.shipment ? 'olive' : 'black'} />
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
            {shippingLabel}
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
      showEditor: false
    };
    this.handleCreateShipments = this.handleCreateShipments.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }
	handleCreateShipments() {
  	// Add shipment detail form data to handleCreateShipments here
		this.props.handleCreateShipments(this.props.shippableGroups);
	}
  handleClose() {
    this.props.handleShipModalClose();
  }
/*
	componentWillMount() {
  	const {shippedGroups, shippableGroups, unshippableGroups} = this.createShipmentGroups(this.props.order.orderProducts, this.props.shipments)
		this.setState({
  		order: this.props.order,
  		shippedGroups: shippedGroups,
  		shippableGroups: shippableGroups,
  		unshippableGroups: unshippableGroups
		});
	}
	componentWillReceiveProps(nextProps) {
  	const {shippedGroups, shippableGroups, unshippableGroups} = this.createShipmentGroups(nextProps.order.orderProducts, nextProps.shipments)
		this.setState({
  		order: nextProps.order,
  		shippedGroups: shippedGroups,
  		shippableGroups: shippableGroups,
  		unshippableGroups: unshippableGroups
		});
	}
*/
/*
	createShipmentGroups() {
		const orderProducts = this.state.orderProducts;
		const shippedShipments = this.state.shipments;
		
		// Create an array of shipments
		let shippedGroups = [];
		let shippableGroups = [];
		let unshippableGroups = [];
		
		if (orderProducts) {
  		orderProducts.map(function(orderProduct, i) {
    		console.log('\nop:' + orderProduct.orderProductId + ' oa:' + orderProduct.order_address_id);
    		
    		// Check if product is in a shipment
    		let isShipped = false;
    		let shippedShipmentId;
    		let shipment;
    		if (shippedShipments) {
      		shippedShipments.map(function(shippedShipment, j) {
        		shippedShipment.items.map(function(item, k) {
          		if (orderProduct.order_address_id === shippedShipment.order_address_id && orderProduct.orderProductId === item.order_product_id) {
            		isShipped = true;
            		shippedShipmentId = shippedShipment.shipmentId;
            		shipment = shippedShipment;
          		}
          		return item;
        		});
        		return shippedShipments;
      		});
    		}
        const group = {
          orderId: orderProduct.order_id, 
          orderAddressId: orderProduct.order_address_id, 
          shippedShipmentId: shippedShipmentId, 
          orderProducts: [orderProduct],
          shipment: shipment
        };
        let shipmentIndex = -1;
    		
    		// Set whether product is added to shippable, shipped or unshippable groups
    		if (isShipped) {
      		console.log('product is shipped');
      		// Check whether product is being added to an existing shipment group
      		
      		shippedGroups.map(function(shippedGroup, j) {
        		if (shippedShipmentId === shippedGroup.shippedShipmentId) shipmentIndex = j;
        		return shippedGroups;
      		});
          if (shipmentIndex < 0) {
            console.log('not in shippedGroups')
            shippedGroups.push(group);
          } else {
            console.log('found in shippedGroups')
            shippedGroups[shipmentIndex].orderProducts.push(orderProduct);
          }
      		
    		} else if (orderProduct.shippable && orderProduct.quantity_shipped !== orderProduct.quantity) {
      		console.log('product is shippable');
      		// Check whether product is being shipped to a unique address
      		shippableGroups.map(function(shippableGroup, j) {
        		if (orderProduct.order_address_id === shippableGroup.orderAddressId) shipmentIndex = j;
        		return shippableGroups;
      		});
          if (shipmentIndex < 0) {
            console.log('not in shippableGroups')
            shippableGroups.push(group);
          } else {
            console.log('found in shippableGroups')
            shippableGroups[shipmentIndex].orderProducts.push(orderProduct);
          }
      		
    		} else {
      		console.log('product is unshippable');
      		// Check whether product is being shipped to a unique address
      		unshippableGroups.map(function(unshippableGroup, j) {
        		if (orderProduct.order_address_id === unshippableGroup.orderAddressId) shipmentIndex = j;
        		return unshippableGroup;
      		});
          if (shipmentIndex < 0) {
            console.log('not in shippableGroups')
            unshippableGroups.push(group);
          } else {
            console.log('found in shippableGroups')
            unshippableGroups[shipmentIndex].orderProducts.push(orderProduct);
          }
      		
    		}
    		return orderProduct;
    		
  		});
		}
    
    return {shippedGroups, shippableGroups, unshippableGroups};
	}
*/
	render() {
		const scope = this;
		const shippedGroups = this.props.shippedGroups;
		const shippableGroups = this.props.shippableGroups;
		const unshippableGroups = this.props.unshippableGroups;
		
		let missingShippingAddress = false;
		const shippableComponents = [];
		shippableGroups.map(function(shippableGroup, i) {
  		const title = 'Ready to Ship';
    	shippableComponents.push(<ShipmentGroup color='yellow' isLoading={scope.props.isLoading} title={title} data={shippableGroup} key={`1-${i}`}/>);
    	if (!shippableGroup.orderProducts[0].shippingAddress) missingShippingAddress = true;
  		return shippableGroup;
		});
		const unshippableComponents = [];
		unshippableGroups.map(function(unshippableGroup, i) {
  		const title = 'Unshippable';
    	unshippableComponents.push(<ShipmentGroup color='red' secondary={true} isLoading={scope.props.isLoading} title={title} data={unshippableGroup} key={`2-${i}`}/>);
  		return unshippableGroups;
		});
		const shippedComponents = [];
		shippedGroups.map(function(shippedGroup, i) {
  		const title = 'Shipped';
    	shippedComponents.push(<ShipmentGroup color='olive' isLoading={scope.props.isLoading} title={title} data={shippedGroup} key={`3-${i}`}/>);
  		return shippedGroups;
		});
		
		const shipButton = (shippableComponents.length > 0) ? <Button disabled={this.props.isLoading} color='olive' onClick={this.handleCreateShipments}>Create Shipment{shippableComponents.length > 1 ? 's' : null}</Button> : null;
		
		// Show error message if shipping address has not been synced with Bigcommerce
		if (missingShippingAddress) {
  		return (
  		  <Modal 
  		    open={this.props.open} 
  		    onClose={this.handleClose} 
  		    size={'small'} 
  		    closeIcon='close'>
  		    <Modal.Content>
    		    Shipping addresses need to sync with Bigcommerce for this order. Click the reload button.
  		    </Modal.Content>
		    </Modal>
	    );
		}
    return (
	    <Modal open={this.props.open} onClose={this.handleClose} size='small' closeIcon='close'>
        <Modal.Content>
          <Modal.Description>
            {shippedComponents}
            {shippableComponents}
            {unshippableComponents}
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button basic disabled={this.props.isLoading} color='grey' content='Close' onClick={this.handleClose} />
          {shipButton}
        </Modal.Actions>
      </Modal>
    );
  }
}

export default OrderShipModal;