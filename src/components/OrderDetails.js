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
    this.handleShowEditOrderProductFormClick = this.handleShowEditOrderProductFormClick.bind(this);
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
  	let variant = this.props.variant ? this.props.variant : null;
  	let orderProductId = this.props.product && this.props.product.orderProductId ? this.props.product.orderProductId : null;
		this.props.handleShowOrderFormClick({productId: variant.productId, orderProductId: orderProductId, variant: variant, resize: false});
	}
	handleShowResizeFormClick(e, {value}) {
  	let variant = this.props.variant ? this.props.variant : null;
  	let orderProductId = this.props.product && this.props.product.orderProductId ? this.props.product.orderProductId : null;
		this.props.handleShowOrderFormClick({productId: variant.productId, orderProductId: orderProductId, variant: variant, resize: true});
	}
	handleShowEditOrderProductFormClick(e, {value}) {
  	let variant = this.props.product.variants ? this.props.product.variants[0] : null;
		this.props.handleOrderProductEditClick({orderProductId: this.props.product.orderProductId, variant: variant});
	}
	getVendorOrderLabel(product, variant, vendorOrderVariant, vendorOrder, orderProductMatch) {
  	if (!vendorOrder) return <Label size='tiny' color='red' key={'product-'+product.objectId+'-'+vendorOrderVariant.objectId}>Error: Missing vendor order data</Label>;
  	
  	const averageWaitTime = vendorOrder.vendor.waitTime ? vendorOrder.vendor.waitTime : 21;
  	const expectedDate = vendorOrder.dateOrdered ? moment(vendorOrder.dateOrdered.iso).add(averageWaitTime, 'days') : moment.utc().add(averageWaitTime, 'days');
  	const daysLeft = vendorOrder.dateOrdered ? expectedDate.diff(moment.utc(), 'days') : averageWaitTime;
  	let labelColor = 'yellow';
  	let labelIcon;
  	if (vendorOrderVariant.done === true) {
  		labelColor = 'olive';
  		labelIcon = <Icon name='checkmark' />;
  	} else if (vendorOrderVariant.ordered && daysLeft < 0) {
  		labelColor = 'red';
  	} else if (vendorOrderVariant.ordered) {
  		labelColor = 'olive';
  	}
  	let labelText = vendorOrderVariant.ordered ? vendorOrderVariant.units + ' Sent' : vendorOrderVariant.units + ' Pending';
  	
  	if (vendorOrderVariant.done === true) {
  		labelText = vendorOrderVariant.received + ' Received';
  	} else if (vendorOrderVariant.ordered && vendorOrderVariant.received > 0) {
  		labelText += ', ' + vendorOrderVariant.received + ' Received';
  	}
  	labelText += ' #' + product.order_id;
  	const labelDetailText = vendorOrder.dateOrdered ? daysLeft < 0 ? moment(vendorOrder.dateOrdered.iso).format('M-D-YY') + ' (' + Math.abs(daysLeft) + ' days late)' : moment(vendorOrder.dateOrdered.iso).format('M-D-YY') + ' (' + daysLeft + ' days left)' : averageWaitTime + ' days wait';
  	const labelDetail = vendorOrderVariant.done === false ? <Label.Detail>{labelDetailText}</Label.Detail> : null;
  	const labelLink = vendorOrderVariant.done === false ? variant.designer ? '/designers/search?q=' + variant.designer.designerId : '/designers' : null;
  	let showLabel = false;
  	if (vendorOrderVariant.done === true && vendorOrderVariant.shipped === undefined) {
  		showLabel = true;
  	} else if (vendorOrderVariant.done === true) {
  		showLabel = vendorOrderVariant.shipped < vendorOrderVariant.received ? true : false;
  	} else {
  		showLabel = true;
  	}
  	return showLabel ? <Label as={labelLink ? 'a' : null} href={labelLink} size='tiny' color={labelColor} key={'product-'+product.objectId+'-'+vendorOrderVariant.objectId}>{labelIcon}{labelText}{labelDetail}</Label> : null;
	}
	getResizeLabel(product, variant, resize, orderProductMatch) {
		const averageWaitTime = 7;
		const daysSinceSent = resize.dateSent ? moment.utc().diff(resize.dateSent.iso, 'days') : null;
		let labelColor = 'olive';
		let labelIcon;
		if (resize.done === true) {
  		labelIcon = <Icon name='checkmark' />;
		} else if (daysSinceSent > averageWaitTime) {
  		labelColor = 'red';
		}
		const labelLink = resize.done === false && product && product.product_id ? '/products/search?q=' + product.product_id : null;
    
		let labelText = resize.units + ' Resize' + (resize.units > 1 ? 's' : '') + (resize.dateSent ? ' Sent' : ' Pending');
		if (resize.received >= resize.units) labelText = resize.received + ' Resize Received';
  	if (resize.orderProduct) labelText += ' #' + product.order_id;
		const labelDetailText = resize.dateSent ?  daysSinceSent + ' days ago' : '';
		const labelDetail = resize.done === false ? <Label.Detail>{labelDetailText}</Label.Detail> : null;
		let showLabel = false;
		if (resize.done === true && resize.shipped === undefined) {
  		showLabel = true;
		} else if (resize.done === true) {
  		showLabel = resize.shipped < resize.received ? true : false;
		} else {
  		showLabel = true;
		}
		return showLabel ? <Label as='a' href={labelLink} size='tiny' color={labelColor} key={'resize-'+resize.objectId}>{labelIcon}{labelText}{labelDetail}</Label> : null;
	}
	render() {  	
  	const scope = this;
		const product = this.props.product;
		const shipment = this.props.shipment;
		const variant = this.props.variant;

		// Create an array of options values
		let options = [];
		if (variant) {
  		if (variant.color_value) options.push('COLOR: ' + variant.color_value);
  		if (variant.size_value) options.push('SIZE: ' + variant.size_value);
  		if (variant.gemstone_value) options.push('STONE: ' + variant.gemstone_value);
  		if (variant.length_value) options.push('LENGTH: ' + variant.length_value);
  		if (variant.font_value) options.push('FONT: ' + variant.font_value);
  		if (variant.letter_value) options.push('LETTER: ' + variant.letter_value);
  		if (variant.singlepair_value) options.push('SINGLE/PAIR: ' + variant.singlepair_value);
  		
		} else if (product.product_options) {
			product.product_options.map(function(option, i) {
				options.push(option.display_name + ': ' + option.display_value);
				return options;
	    });
		}
		options = options.map(function(option, i) {
  		return <span key={i}>{option}<br/></span>;
		});
		
		const productName = product.name ? product.name : '';
		const variantName = variant && variant.productName ? variant.productName : null;
		const productUrl = product.product_id ? '/products/search?q=' + product.product_id : null;
		const productLink = productUrl ? <a href={productUrl}>{productName + (product.isBundle ? ': ' + variantName : '')}</a> : productName;
		
		const alwaysResize = variant ? variant.alwaysResize : '';
		const inventory = variant ? variant.inventoryLevel : '';
		const designerName = variant && variant.designer ? variant.designer.name : '';
		const shippingLabel = shipment && shipment.labelWithPackingSlipUrl ? 
		  <Button as={Link} href={shipment.labelWithPackingSlipUrl} target='_blank'>
		    <Icon name='print' />Print
	    </Button> : null;
	    
	  // Check if variant has been ordered
	  let vendorOrders = [];
	  if (product && product.vendorOrders) {
  	  product.vendorOrders.map(function(vendorOrder, i) {
    	  vendorOrder.vendorOrderVariants.map(function(vendorOrderVariant, j) {
      	  var orderProductMatch;
      	  if (vendorOrderVariant.orderProducts) {
        	  vendorOrderVariant.orderProducts.map(function(vendorOrderVariantProduct, k) {
          	  if (vendorOrderVariantProduct.objectId === product.objectId) {
//             	  console.log('op match: ' + product.objectId);
            	  orderProductMatch = product.objectId;
          	  }
          	  return vendorOrderVariantProduct;
        	  });
      	  }
      	  if (orderProductMatch && variant.objectId === vendorOrderVariant.variant.objectId) {
        	  var vendorOrderLabel = scope.getVendorOrderLabel(product, variant, vendorOrderVariant, vendorOrder, orderProductMatch);
        	  if (vendorOrderLabel) vendorOrders.push(vendorOrderLabel);	  
      	  }
      	  return vendorOrderVariant;
    	  });
    	  return vendorOrder;
  	  });
	  }
    
	  let resizes = [];
		if (product && product.resizes && product.resizes.length > 0) {
  		product.resizes.map(function(resize, i) {
    	  var orderProductMatch;
    	  if (resize.orderProduct) {
      	  if (resize.orderProduct.objectId === product.objectId) {
//         	  console.log('op match: ' + product.objectId);
        	  orderProductMatch = product.objectId;
      	  }
    	  }
        var resizeLabel = scope.getResizeLabel(product, variant, resize, orderProductMatch);
        if (resizeLabel) resizes.push(resizeLabel);
    		return resize;
  		});
    }
    
	  let awaitingInventoryQueue = [];
		if (product && product.awaitingInventory && product.awaitingInventory.length > 0) {
  		let label;
  		product.awaitingInventory.map(function(inventoryItem, i) {
//     		console.log(inventoryItem)
    		const isVendorOrder = inventoryItem.className === 'VendorOrderVariant' ? true : false;
    		if (isVendorOrder){
      		let vendorOrderMatch;
      		if (product.awaitingInventoryVendorOrders) {
        		product.awaitingInventoryVendorOrders.map(function(vendorOrder, j) {
          		if (vendorOrder.vendorOrderVariants) {
            		vendorOrder.vendorOrderVariants.map(function(vendorOrderVariant, l) {
              		if (inventoryItem.objectId === vendorOrderVariant.objectId) {
                		vendorOrderMatch = vendorOrder;
              		}
              		return vendorOrderVariant;
            		});
          		}
          		return vendorOrder;
        		});
      		}
      		label = scope.getVendorOrderLabel(product, variant, inventoryItem, vendorOrderMatch)
    		} else {
      		label = scope.getResizeLabel(product, variant, inventoryItem)
    		}
    		
    		if (label) awaitingInventoryQueue.push(label);

    		return inventoryItem;
  		});
    }
		
		let primaryButton;
		let dropdownItems = [];
		const allowEditing = vendorOrders.length < 1 && resizes.length < 1;
    if (shipment) {
  	  primaryButton = <Button icon='shipping' content='View' onClick={this.handleShipModalOpen} />;
    } else if (product.shippable || product.partiallyShippable) {
  	  primaryButton = <Button icon='shipping' content='Custom Shipment' onClick={this.handleShipModalOpen} />;
      if (allowEditing) dropdownItems.push(<Dropdown.Item key='1' icon='edit' text='Edit Product' onClick={this.handleShowEditOrderProductFormClick} />);
	  } else if (product.resizable) {
  	  primaryButton = <Button icon='exchange' content='Resize' onClick={this.handleShowResizeFormClick} />;
  	  dropdownItems.push(<Dropdown.Item key='1' icon='add to cart' text='Order' onClick={this.handleShowOrderFormClick} />);
  	  if (allowEditing) dropdownItems.push(<Dropdown.Item key='2' icon='edit' text='Edit Product' onClick={this.handleShowEditOrderProductFormClick} />);
	  } else if (product.variants || product.editedVariants) {
  	  primaryButton = <Button icon='add to cart' content='Order' onClick={this.handleShowOrderFormClick} />;
  	  if (allowEditing) dropdownItems.push(<Dropdown.Item key='2' icon='edit' text='Edit Product' onClick={this.handleShowEditOrderProductFormClick} />);
	  } else if (product.isCustom) {
//   	  primaryButton = <Button icon='shipping' content='Custom Shipment' onClick={this.handleShipModalOpen} />;
  	  if (allowEditing) primaryButton = <Button icon='edit' content='Edit Product' onClick={this.handleShowEditOrderProductFormClick} />;
	  }

    return (
      <Table.Row>
        <Table.Cell>{productLink}</Table.Cell>
        <Table.Cell>
          {options}
        </Table.Cell>
        <Table.Cell>{product.quantity ? product.quantity : ''}</Table.Cell>
				<Table.Cell>{alwaysResize}</Table.Cell>
				<Table.Cell>{inventory}</Table.Cell>
				<Table.Cell>{designerName}</Table.Cell>
				<Table.Cell>{vendorOrders}{resizes}{awaitingInventoryQueue}</Table.Cell>
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
    this.handleOrderProductEditClick = this.handleOrderProductEditClick.bind(this);
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
	handleOrderProductEditClick(data) {
  	this.props.handleOrderProductEditClick(data);
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
      		
    		} else if ((orderProduct.shippable || orderProduct.partiallyShippable) && orderProduct.quantity_shipped < orderProduct.quantity) {
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
  			let variants = productRow.editedVariants && productRow.editedVariants.length > 0 ? productRow.editedVariants : productRow.variants ? productRow.variants : null;
  			
        if (variants) {
    			variants.map(function(variant, j) {
      			productRows.push(<ProductRow product={productRow} variant={variant} shipment={shipment} handleShipModalOpen={scope.handleShipModalOpen} key={i+'-'+j} handleShowOrderFormClick={scope.handleShowOrderFormClick} handleOrderProductEditClick={scope.handleOrderProductEditClick} />);
      			return variant;
    			});
  			} else if (productRow.isCustom) {
    			productRows.push(<ProductRow product={productRow} shipment={shipment} handleShipModalOpen={scope.handleShipModalOpen} key={i+'-Custom'} handleShowOrderFormClick={scope.handleShowOrderFormClick} handleOrderProductEditClick={scope.handleOrderProductEditClick} />);
  			}
				
				return productRow;
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
      
    const detailsColSpan = this.props.subpage === 'fulfilled' ? '12' : '11';
		
    return (
      <Table.Row className={rowClass}>
        <Table.Cell colSpan={detailsColSpan} className='order-product-row'>
          <Dimmer.Dimmable as={Segment} vertical blurring dimmed={this.props.isReloading}>
            <Dimmer active={this.props.isReloading} inverted>
              <Loader>Loading</Loader>
            </Dimmer>
            <Button circular compact basic size='tiny' 
              icon='refresh' 
              content='Reload' 
              disabled={this.props.isReloading} 
              onClick={()=>this.handleReloadClick(this.props.data.orderId)} 
            />
            {shipAllButton}
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