import React, { Component } from 'react';
import { Table, Button, Dropdown, Dimmer, Segment, Loader } from 'semantic-ui-react';
import classNames from 'classnames';
// import numeral from 'numeral';
// import moment from 'moment';
import OrderShipModal from './OrderShipModal.js';

class ProductRow extends Component {
  constructor(props) {
    super(props);
    this.handleShipModalOpen = this.handleShipModalOpen.bind(this);
  }
  handleShipModalOpen() {
    this.props.handleShipModalOpen();
  }
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
		
		let primaryButton;
		let dropdownItems = [];
// 		let orderShipModal;
    if (shipment) {
  	  primaryButton = <Button icon='shipping' content='View Shipment' onClick={this.handleShipModalOpen} />;
    } else if (product.shippable) {
//   	  let buttonText = product.shippable ? 
  	  primaryButton = <Button icon='shipping' content='Customize Shipment' onClick={this.handleShipModalOpen} />;
//   	  dropdownItems.push(<Dropdown.Item key='1' icon='edit' text='Edit Item' />);
	  } else if (product.resizable) {
  	  primaryButton = <Button icon='exchange' content='Resize' />;
  	  dropdownItems.push(<Dropdown.Item key='1' icon='add to cart' text='Order' />);
//   	  dropdownItems.push(<Dropdown.Item key='2' icon='edit' text='Edit Item' />);
	  } else {
  	  primaryButton = <Button icon='add to cart' content='Order' />;
  	  dropdownItems.push(<Dropdown.Item key='1' icon='exchange' text='Resize' />);
//   	  dropdownItems.push(<Dropdown.Item key='2' icon='edit' text='Edit Item' />);
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
            {primaryButton}
            {dropdownItems.length > 0 ? <Dropdown floating button compact pointing className='icon'>
              <Dropdown.Menu>
                {dropdownItems}
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
      order: null,
      products: null,
      shipments: null,
      showEditor: false,
      shipModalOpen: false,
      shippedGroups: null,
      shippableGroups: null,
      unshippableGroups: null
    };
    this.handleReloadClick = this.handleReloadClick.bind(this);
    this.handleShipModalOpen = this.handleShipModalOpen.bind(this);
    this.handleShipModalClose = this.handleShipModalClose.bind(this);
    this.handleCreateShipments = this.handleCreateShipments.bind(this);
  }
	handleReloadClick(orderId) {
		this.props.handleReloadClick(orderId);
	}
	handleCreateShipments() {
		this.props.handleCreateShipments(this.state.shippableGroups);
	}
  handleShipModalOpen() {
    this.setState({
      shipModalOpen: true
    });
  }
  handleShipModalClose() {
    this.setState({
      shipModalOpen: false
    });
  }
	handleToggleEditorClick() {
  	const showEditor = !this.state.showEditor;
  	
  	this.setState({
    	showEditor: showEditor
  	});
	}
	componentWillMount() {
  	const {shippedGroups, shippableGroups, unshippableGroups} = this.createShipmentGroups(this.props.data.orderProducts, this.props.data.orderShipments)
		this.setState({
      order: this.props.data,
      products: this.props.data.orderProducts,
      shipments: this.props.data.orderShipments,
  		shippedGroups: shippedGroups,
  		shippableGroups: shippableGroups,
  		unshippableGroups: unshippableGroups
		});
	}
	componentWillReceiveProps(nextProps) {
  	const {shippedGroups, shippableGroups, unshippableGroups} = this.createShipmentGroups(nextProps.data.orderProducts, nextProps.data.orderShipments)
    this.setState({
      order: nextProps.data,
      products: nextProps.data.orderProducts,
      shipments: nextProps.data.orderShipments,
  		shippedGroups: shippedGroups,
  		shippableGroups: shippableGroups,
  		unshippableGroups: unshippableGroups
    });
	}
	createShipmentGroups(orderProducts, shippedShipments) {
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
	render() {
  	const scope = this;
  	const showProducts = this.props.expanded ? true : false;
  	const products = this.state.products;
  	const shipments = this.state.shipments;
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
  			let shipment = null;
  			if (shipments) {
    			shipments.map(function(shipmentObj) {
      			shipmentObj.items.map(function(item) {
        			if (productRow.orderProductId === item.order_product_id) shipment = shipmentObj;
        			return item;
      			});
      			return shipmentObj;
    			});
  			}
				productRows.push(<ProductRow product={productRow} shipment={shipment} handleShipModalOpen={scope.handleShipModalOpen} key={i} />);
				return productRows;
	    });
		}
		
		var shipAllButton = this.state.shippableGroups.length > 0 ? 
      <Button circular compact size='small' primary
        icon='shipping' 
        content='Ship Order' 
        floated='right'
        disabled={this.props.isReloading} 
        onClick={this.handleCreateShipments} 
      /> : null;
		
    return (
      <Table.Row className={rowClass}>
        <Table.Cell colSpan='10' className='order-product-row'>
          <Button circular compact basic size='tiny' 
            icon='refresh' 
            content='Reload' 
            disabled={this.props.isReloading} 
            onClick={()=>this.handleReloadClick(this.props.data.orderId)} 
          />
          {shipAllButton}
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
            <OrderShipModal 
              open={this.state.shipModalOpen} 
              handleShipModalClose={this.handleShipModalClose} 
              handleCreateShipments={this.handleCreateShipments} 
              shippedGroups={this.state.shippedGroups} 
              shippableGroups={this.state.shippableGroups} 
              unshippableGroups={this.state.unshippableGroups} 
              isLoading={this.props.isReloading}
            />
          </Dimmer.Dimmable>
        </Table.Cell>
      </Table.Row>
    );
  }
}

export default OrderDetails;