import React, { Component } from 'react';
import { Table, Button, Dropdown, Dimmer, Segment, Loader, Modal, List } from 'semantic-ui-react';
import classNames from 'classnames';
// import numeral from 'numeral';
import moment from 'moment';

class ProductRow extends Component {
	render() {  	
		const product = this.props.product;
		const shipment = this.props.shipment;
		// Create an array of other options values
		let options = [];
		if (product.product_options) {
			product.product_options.map(function(option, i) {
				options.push(option.display_name + ': ' + option.display_value);
				return options;
	    });
		}
		const productName = product.name ? product.name : '';
		const productUrl = '/products/search?q=' + product.product_id;
		const productLink = product.variant ? <a href={productUrl}>{productName}</a> : productName;
		
		const alwaysResize = product.variant ? product.variant.alwaysResize : '';
		
		const inventory = product.variant ? product.variant.inventoryLevel : '';
		
		const designerName = product.variant ? product.variant.designer ? product.variant.designer.name : '' : '';
		
		let shipmentButton = <Button icon='shipping' content='Ship Item' />;
		if (shipment) {
  		let totalItems = 0;
  		shipment.items.map(function(item) {
    		totalItems += item.quantity;
    		return totalItems;
  		});
  		shipmentButton = 
		    <Modal trigger={<Button icon='shipping' content='View Shipment' />} size='small' closeIcon='close'>
          <Modal.Header>{totalItems} Item{totalItems > 1 ? 's' : ''} in Shipment</Modal.Header>
          <Modal.Content image>
            <Modal.Description>
              <List relaxed>
                  <List.Item>
                    <List.Header>Date Shipped</List.Header>
                    {moment(shipment.date_created.iso).calendar()}<br/>
                  </List.Item>
                  <List.Item>
                    <List.Header>ID</List.Header>
                    {shipment.shipmentId}<br/>
                  </List.Item>
                  <List.Item>
                    <List.Header>Address</List.Header>
                    {shipment.shipping_address.first_name} {shipment.shipping_address.last_name} {shipment.company}<br/>
                    {shipment.shipping_address.street_1} {shipment.shipping_address.street_2}<br/>
                    {shipment.shipping_address.city}, {shipment.shipping_address.state} {shipment.shipping_address.zip} {shipment.shipping_address.country}<br/>
                    {shipment.shipping_address.email}<br/>
                    {shipment.shipping_address.phone !== 'undefined' ? shipment.shipping_address.phone : null}<br/>
                  </List.Item>
                  <List.Item>
                    <List.Header>Shipping Provider</List.Header>
                    {shipment.shipping_provider}<br/>
                  </List.Item>
                  <List.Item>
                    <List.Header>Tracking Carrier</List.Header>
                    {shipment.tracking_carrier}<br/>
                  </List.Item>
                  <List.Item>
                    <List.Header>Tracking Number</List.Header>
                    {shipment.tracking_number}<br/>
                  </List.Item>
              </List>
            </Modal.Description>
          </Modal.Content>
        </Modal>;
	  }

    return (
      <Table.Row>
        <Table.Cell>{productLink}</Table.Cell>
        <Table.Cell>
          {options.map(function(option, i) {
            return <span key={i}>{option}<br/></span>;
          })}
        </Table.Cell>
        <Table.Cell>{product.quantity ? product.quantity : ''}</Table.Cell>
        <Table.Cell></Table.Cell>
				<Table.Cell>{alwaysResize}</Table.Cell>
				<Table.Cell>{inventory}</Table.Cell>
				<Table.Cell>{designerName}</Table.Cell>
				<Table.Cell className='right aligned'>
          <Button.Group color='grey' size='mini' compact>
            {shipmentButton}
            {!shipment ? <Dropdown floating button compact className='icon'>
              <Dropdown.Menu>
                <Dropdown.Item icon='add to cart' text='Order' />
                <Dropdown.Item icon='exchange' text='Resize' />
              </Dropdown.Menu>
            </Dropdown>
            : null}
          </Button.Group>
				</Table.Cell>
      </Table.Row>
    );
  }
}

class OrderDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showProducts: false,
      showEditor: false
    };
    this.handleReloadClick = this.handleReloadClick.bind(this);
  }
	handleReloadClick(productId) {
		this.props.handleReloadClick(productId);
	}
	handleToggleEditorClick() {
  	const showEditor = !this.state.showEditor;
  	
  	this.setState({
    	showEditor: showEditor
  	});
	}
	render() {
  	const showProducts = this.props.expanded ? true : false;
  	const products = this.props.data.orderProducts;
  	const shipments = this.props.data.orderShipments;
		var rowClass = classNames(
			{
				'': showProducts,
				'hidden': !showProducts
			}
		);
			
		// Sort the data
		if (products && products.length && products[0].orderProductId) {
      products.sort(function(a, b) {
        return parseFloat(a.orderProductId) - parseFloat(b.orderProductId);
      });
    }
    
		let productRows = [];
		if (products) {
			products.map(function(productRow, i) {
  			// Match an OrderShipment to this OrderProduct
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
				productRows.push(<ProductRow product={productRow} shipment={shipment} key={i} />);
				return productRows;
	    });
		}
    return (
      <Table.Row className={rowClass}>
        <Table.Cell colSpan='10' className='order-product-row'>
          <Button circular compact basic size='tiny' 
            icon='refresh' 
            content='Reload' 
            disabled={this.props.isReloading} 
            onClick={()=>this.handleReloadClick(this.props.data.orderId)} 
          />
          <Dimmer.Dimmable as={Segment} vertical blurring dimmed={this.props.isReloading}>
            <Dimmer active={this.props.isReloading} inverted>
              <Loader>Loading</Loader>
            </Dimmer>
            <Segment secondary>
              <Table className='order-products-table' basic='very' compact size='small' columns={8}>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>Product</Table.HeaderCell>
                    <Table.HeaderCell>Options</Table.HeaderCell>
                    <Table.HeaderCell>Quantity</Table.HeaderCell>
                    <Table.HeaderCell>Resizable</Table.HeaderCell>
                    <Table.HeaderCell>Always Resize</Table.HeaderCell>
                    <Table.HeaderCell>Inventory</Table.HeaderCell>
                    <Table.HeaderCell>Designer</Table.HeaderCell>
                    <Table.HeaderCell className='right aligned'>Actions</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {productRows}
                </Table.Body>
              </Table>
            </Segment>
          </Dimmer.Dimmable>
        </Table.Cell>
      </Table.Row>
    );
  }
}

export default OrderDetails;