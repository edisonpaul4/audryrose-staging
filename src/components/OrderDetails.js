import React, { Component } from 'react';
import { Link } from 'react-router';
import { Table, Button, Dropdown, Dimmer, Segment, Loader, Icon, Label } from 'semantic-ui-react';
import classNames from 'classnames';
// import numeral from 'numeral';
import moment from 'moment';
import OrderShipModal from './OrderShipModal.js';

class ProductRow extends Component {
  constructor(props) {
    super(props);
    this.handleShipModalOpen = this.handleShipModalOpen.bind(this);
    this.handleShowOrderFormClick = this.handleShowOrderFormClick.bind(this);
    this.handleShowResizeFormClick = this.handleShowResizeFormClick.bind(this);
  }
  handleShipModalOpen() {
    this.props.handleShipModalOpen();
  }
  getProductInventory(variants) {
    let inventoryLevel = 0;
    variants.map(function(variant, i) {
      if (i === 0 && variant.inventoryLevel) {
        inventoryLevel = variant.inventoryLevel;
      } else if (variant.inventoryLevel < inventoryLevel) {
        inventoryLevel = variant.inventoryLevel; 
      }
      return variant;
    }); 
    return inventoryLevel;
  }
	handleShowOrderFormClick(e, {value}) {
  	let variant = this.props.product.variants ? this.props.product.variants[0] : null;
		this.props.handleShowOrderFormClick({productId: this.props.product.product_id, variant: variant, resize: false});
	}
	handleShowResizeFormClick(e, {value}) {
  	let variant = this.props.product.variants ? this.props.product.variants[0] : null;
		this.props.handleShowOrderFormClick({productId: this.props.product.product_id, variant: variant, resize: true});
	}
	handleShowEditOrderProductFormClick(e, {value}) {
//   	let variant = this.props.product.variants ? this.props.product.variants[0] : null;
// 		this.props.handleShowEditOrderProductFormClick({productId: this.props.product.product_id, variant: variant, resize: false});
	}
	render() {  	
		const product = this.props.product;
		const shipment = this.props.shipment;
		const variant = this.props.product.variants ? this.props.product.variants[0] : null;
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
		const productLink = <a href={productUrl}>{productName}</a>;
		
		const alwaysResize = product.variants && product.variants.length === 1 ? product.variants[0].alwaysResize : '';
		const inventory = product.variants && product.variants.length > 0 ? this.getProductInventory(product.variants) : '';
		const designerName = product.variants && product.variants.length === 1 && product.variants[0].designer ? product.variants[0].designer.name : '';
		const shippingLabel = shipment && shipment.labelWithPackingSlipUrl ? 
		  <Button as={Link} href={shipment.labelWithPackingSlipUrl} target='_blank'>
		    <Icon name='print' />Print
	    </Button> : null;
	    
	  // Check if variant has been ordered
	  let vendorOrders = [];
	  if (variant && variant.designer && variant.designer.vendors) {
  	  variant.designer.vendors.map(function(vendor, i) {
    	  if (vendor.vendorOrders) {
      	  vendor.vendorOrders.map(function(vendorOrder, j) {
        	  vendorOrder.vendorOrderVariants.map(function(vendorOrderVariant, k) {
          	  if (variant.objectId === vendorOrderVariant.variant.objectId && vendorOrderVariant.done === false) {
//             	  vendorOrders.push(<Label key={i+'-'+j+'-'+k}>{vendorOrderVariant.ordered ? 'Sent' : 'Pending'}<Label.Detail>{vendorOrderVariant.units}</Label.Detail></Label>);
            		const averageWaitTime = vendor.waitTime ? vendor.waitTime : 21;
            		const expectedDate = vendorOrder.dateOrdered ? moment(vendorOrder.dateOrdered.iso).add(averageWaitTime, 'days') : moment.utc().add(averageWaitTime, 'days');
            		const daysLeft = vendorOrder.dateOrdered ? expectedDate.diff(moment.utc(), 'days') : averageWaitTime;
            		const labelColor = vendorOrderVariant.ordered ? daysLeft < 0 ? 'red' : 'olive' : 'yellow';
            		const labelText = vendorOrderVariant.ordered ? vendorOrderVariant.units + ' Sent' : vendorOrderVariant.units + ' Pending';
            		const labelDetail = vendorOrder.dateOrdered ? daysLeft < 0 ? Math.abs(daysLeft) + ' days late' : daysLeft + ' days left' : averageWaitTime + ' days wait';
            		vendorOrders.push((vendorOrderVariant.done === false) ? <Label as='a' href={variant.designer ? '/designers/search?q=' + variant.designer.designerId : '/designers'} size='tiny' color={labelColor} key={'vendorOrderVariant-'+i+'-'+j+'-'+k}>{labelText}<Label.Detail>{labelDetail}</Label.Detail></Label> : null);
          	  }
          	  return vendorOrderVariant;
        	  });
        	  return vendorOrder;
      	  });
    	  }
    	  return vendor;
  	  });
	  }
    
	  let resizes = [];
		if (variant && variant.resizes && variant.resizes.length > 0) {
  		variant.resizes.map(function(resize, i) {
    		const averageWaitTime = 7;
    		const expectedDate = resize.dateSent ? moment(resize.dateSent.iso).add(averageWaitTime, 'days') : moment.utc().add(averageWaitTime, 'days');
    		const daysLeft = resize.dateSent ? expectedDate.diff(moment.utc(), 'days') : averageWaitTime;
    		const labelColor = daysLeft < 0 ? 'red' : 'olive';
    		const labelText = resize.units + ' Resizing';
    		const labelDetail = daysLeft < 0 ? Math.abs(daysLeft) + ' days late' : daysLeft + ' days left';
//     		vendorOrderAndResizes.push((resize.done === false) ? <Label as='a' href={data.designer ? '/designers/search?q=' + data.designer.designerId : '/designers'} size='tiny' color={labelColor} key={'resize-'+i}>{labelText}<Label.Detail>{labelDetail}</Label.Detail><ProductResizeModal productResizeData={resize} /></Label> : null);
    		resizes.push((resize.done === false) ? <Label size='tiny' color={labelColor} key={'resize-'+i}>{labelText}<Label.Detail>{labelDetail}</Label.Detail></Label> : null);
    		return resize;
  		});
    }
		
		let primaryButton;
		let dropdownItems = [];
// 		let pendingAction = false;
    if (shipment) {
  	  primaryButton = <Button icon='shipping' content='View' onClick={this.handleShipModalOpen} />;
    } else if (product.shippable) {
  	  primaryButton = <Button icon='shipping' content='Customize Shipment' onClick={this.handleShipModalOpen} />;
      dropdownItems.push(<Dropdown.Item key='1' icon='edit' text='Edit Product' onClick={this.handleShowEditOrderProductFormClick} />);
	  } else if (product.resizable) {
  	  primaryButton = <Button icon='exchange' content='Resize' onClick={this.handleShowResizeFormClick} />;
  	  dropdownItems.push(<Dropdown.Item key='1' icon='add to cart' text='Order' onClick={this.handleShowOrderFormClick} />);
  	  dropdownItems.push(<Dropdown.Item key='2' icon='edit' text='Edit Product' onClick={this.handleShowEditOrderProductFormClick} />);
	  } else {
  	  primaryButton = <Button icon='add to cart' content='Order' onClick={this.handleShowOrderFormClick} />;
  	  dropdownItems.push(<Dropdown.Item key='1' icon='exchange' text='Resize' onClick={this.handleShowResizeFormClick} />);
  	  dropdownItems.push(<Dropdown.Item key='2' icon='edit' text='Edit Product' onClick={this.handleShowEditOrderProductFormClick} />);
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
				<Table.Cell>{alwaysResize}</Table.Cell>
				<Table.Cell>{inventory}</Table.Cell>
				<Table.Cell>{designerName}</Table.Cell>
				<Table.Cell>{vendorOrders}{resizes}</Table.Cell>
				<Table.Cell className='right aligned'>
          <Button.Group color='grey' size='mini' compact>
            {primaryButton}
            {shippingLabel}
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
    this.handleShowOrderFormClick = this.handleShowOrderFormClick.bind(this);
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
	handleShowOrderFormClick(data) {
  	data.orderId = this.state.order.orderId;
  	this.props.handleShowOrderFormClick(data);
	}
	componentWillMount() {
  	const {shippedGroups, shippableGroups, unshippableGroups} = this.createShipmentGroups(this.props.data, this.props.data.orderProducts, this.props.data.orderShipments)
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
  	const {shippedGroups, shippableGroups, unshippableGroups} = this.createShipmentGroups(nextProps.data, nextProps.data.orderProducts, nextProps.data.orderShipments)
    this.setState({
      order: nextProps.data,
      products: nextProps.data.orderProducts,
      shipments: nextProps.data.orderShipments,
  		shippedGroups: shippedGroups,
  		shippableGroups: shippableGroups,
  		unshippableGroups: unshippableGroups
    });
	}
	createShipmentGroups(order, orderProducts, shippedShipments) {
		// Create an array of shipments
		let shippedGroups = [];
		let shippableGroups = [];
		let unshippableGroups = [];
		
		if (orderProducts) {
  		orderProducts.map(function(orderProduct, i) {
//     		console.log('\nop:' + orderProduct.orderProductId + ' oa:' + orderProduct.order_address_id);
    		
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
          orderBillingAddress: order.billing_address,
          shippedShipmentId: shippedShipmentId, 
          orderProducts: [orderProduct],
          shipment: shipment
        };
        let shipmentIndex = -1;
        
//         console.log('orderProduct.name:' + orderProduct.name);
//         console.log('isShipped:' + isShipped);
//         console.log('orderProduct.shippable:' + orderProduct.shippable);
//         console.log('orderProduct.quantity_shipped:' + orderProduct.quantity_shipped);
//         console.log('orderProduct.quantity:' + orderProduct.quantity);
    		
    		// Set whether product is added to shippable, shipped or unshippable groups
    		if (isShipped) {
//       		console.log('product is shipped');
      		// Check whether product is being added to an existing shipment group
      		
      		shippedGroups.map(function(shippedGroup, j) {
        		if (shippedShipmentId === shippedGroup.shippedShipmentId) shipmentIndex = j;
        		return shippedGroups;
      		});
          if (shipmentIndex < 0) {
//             console.log('not in shippedGroups')
            shippedGroups.push(group);
          } else {
//             console.log('found in shippedGroups')
            shippedGroups[shipmentIndex].orderProducts.push(orderProduct);
          }
      		
    		} else if (orderProduct.shippable && orderProduct.quantity_shipped !== orderProduct.quantity) {
//       		console.log('product is shippable');
      		
      		// Check whether product is being shipped to a unique address
      		shippableGroups.map(function(shippableGroup, j) {
        		if (orderProduct.order_address_id === shippableGroup.orderAddressId) shipmentIndex = j;
        		return shippableGroups;
      		});
          if (shipmentIndex < 0) {
//             console.log('not in shippableGroups')
            shippableGroups.push(group);
          } else {
//             console.log('found in shippableGroups')
            shippableGroups[shipmentIndex].orderProducts.push(orderProduct);
          }
      		
    		} else {
//       		console.log('product is not shippable');
      		// Check whether product is being shipped to a unique address
      		unshippableGroups.map(function(unshippableGroup, j) {
        		if (orderProduct.order_address_id === unshippableGroup.orderAddressId) shipmentIndex = j;
        		return unshippableGroup;
      		});
          if (shipmentIndex < 0) {
//             console.log('not in shippableGroups')
            unshippableGroups.push(group);
          } else {
//             console.log('found in shippableGroups')
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
				productRows.push(<ProductRow product={productRow} shipment={shipment} handleShipModalOpen={scope.handleShipModalOpen} key={i} handleShowOrderFormClick={scope.handleShowOrderFormClick} />);
				return productRows;
	    });
		}
		
		var shipAllButton = this.state.shippableGroups.length > 0 ? 
      <Button circular compact size='tiny' primary
        icon='shipping' 
        content='Ship Order' 
        floated='right'
        disabled={this.props.isReloading} 
        onClick={this.handleCreateShipments} 
      /> : null;
      
    const detailsColSpan = this.props.subpage === 'fulfilled' ? '11' : '10';
		
    return (
      <Table.Row className={rowClass}>
        <Table.Cell colSpan={detailsColSpan} className='order-product-row'>
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
              <Table className='order-products-table' basic='very' size='small' columns={9}>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>Product</Table.HeaderCell>
                    <Table.HeaderCell>Options</Table.HeaderCell>
                    <Table.HeaderCell>Quantity</Table.HeaderCell>
                    <Table.HeaderCell>Always Resize</Table.HeaderCell>
                    <Table.HeaderCell>Inventory</Table.HeaderCell>
                    <Table.HeaderCell>Designer</Table.HeaderCell>
                    <Table.HeaderCell>Vendor Orders / Resize</Table.HeaderCell>
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