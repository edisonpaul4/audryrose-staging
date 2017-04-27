import React, { Component } from 'react';
import { Table, Button, Dimmer, Segment, Loader, Header } from 'semantic-ui-react';
import classNames from 'classnames';

class ProductRow extends Component {
	render() {  	
		const product = this.props.product;
		const vendorOrderVariant = this.props.vendorOrderVariant;
		const productName = product.name ? product.name : '';
		const productUrl = '/products/search?q=' + product.product_id;
		const productLink = <a href={productUrl}>{productName}</a>;
		// Create an array of other options values
		let options = [];
		if (vendorOrderVariant.variant.variantOptions) {
			vendorOrderVariant.variant.variantOptions.map(function(option, i) {
				options.push(option.display_name + ': ' + option.label);
				return options;
	    });
		}
		const inventory = vendorOrderVariant.variant.inventoryLevel ? vendorOrderVariant.variant.inventoryLevel : 0;
		console.log(vendorOrderVariant)
/*
		let primaryButton;
		let dropdownItems = [];
    if (product.shippable) {
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
*/

    return (
      <Table.Row>
        <Table.Cell>{productLink}</Table.Cell>
        <Table.Cell>
          {options.map(function(option, i) {
            return <span key={i}>{option}<br/></span>;
          })}
        </Table.Cell>
				<Table.Cell>{inventory}</Table.Cell>
				<Table.Cell>{vendorOrderVariant.units}</Table.Cell>
				<Table.Cell className='right aligned'>
				</Table.Cell>
      </Table.Row>
    );
  }
}

class VendorRow extends Component {
	render() {
  	const { status, order, vendor, products } = this.props;
  	
  	// Create Pending Order Table
		let orderProductRows = [];
		if (order && order.vendorOrderVariants.length > 0) {
			order.vendorOrderVariants.map(function(vendorOrderVariant, i) {
  			let productData;		
  			products.map(function(product, j) {
    			if (vendorOrderVariant.variant.productId === product.productId) productData = product;
    			return product;
  			});
				orderProductRows.push(<ProductRow product={productData} vendorOrderVariant={vendorOrderVariant} key={i} />);
				return vendorOrderVariant;
	    });
		}
    return (
      <Segment secondary>
        <Header>{status} Order for {vendor.name}</Header>
        <Table className='order-products-table' basic='very' compact size='small' columns={6}>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Product</Table.HeaderCell>
              <Table.HeaderCell>Options</Table.HeaderCell>
              <Table.HeaderCell>ACH OH</Table.HeaderCell>
              <Table.HeaderCell>Units</Table.HeaderCell>
              <Table.HeaderCell className='right aligned'></Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {orderProductRows}
          </Table.Body>
        </Table>
      </Segment>
    );
	}
}

class DesignerDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      products: null
    };
//     this.handleReloadClick = this.handleReloadClick.bind(this);
//     this.handleShipModalOpen = this.handleShipModalOpen.bind(this);
//     this.handleShipModalClose = this.handleShipModalClose.bind(this);
//     this.handleCreateShipments = this.handleCreateShipments.bind(this);
  }
/*
	handleReloadClick(orderId) {
		this.props.handleReloadClick(orderId);
	}
*/
/*
	handleCreateShipments() {
		this.props.handleCreateShipments(this.state.shippableGroups);
	}
*/
/*
  handleShipModalOpen() {
    this.setState({
      shipModalOpen: true
    });
  }
*/
/*
  handleShipModalClose() {
    this.setState({
      shipModalOpen: false
    });
  }
*/
/*
	handleToggleEditorClick() {
  	const showEditor = !this.state.showEditor;
  	
  	this.setState({
    	showEditor: showEditor
  	});
	}
*/
	componentWillMount() {
		this.setState({
      data: this.props.data,
      products: this.props.products
		});
	}
	componentWillReceiveProps(nextProps) {
		this.setState({
      data: nextProps.data,
      products: nextProps.products
		});
	}
	render() {
  	const show = this.props.expanded ? true : false;
  	const data = this.state.data;
  	const products = this.state.products;
		const rowClass = classNames(
			{
				'': show,
				'hidden': !show
			}
		);
    
		let vendorRows = [];
		if (data.vendors && data.vendors.length > 0) {
			data.vendors.map(function(vendor, i) {
  			let vendorProducts = [];
  			products.map(function(product, j) {
    			if (!product.vendor) {
      			vendorProducts.push(product);
    			} else if (vendor.objectId === product.vendor.objectId) {
      			vendorProducts.push(product);
    			}
    			return product;
  			});
  			
  			if (vendor.pendingOrder) {
    			vendorRows.push(<VendorRow status='Pending' order={vendor.pendingOrder} vendor={vendor} products={vendorProducts} key={i} />);
  			}
  			
  			if (vendor.sentOrders && vendor.sentOrders.length > 0) {
    			vendor.sentOrders.map(function(sentOrder, j) {
      			vendorRows.push(<VendorRow status='Sent' order={sentOrder} vendor={vendor} products={vendorProducts} key={i+'-'+j} />);
      			return sentOrder;
      		});
    			
  			}
  			
				return vendor;
	    });
		}
		
    return (
      <Table.Row className={rowClass}>
        <Table.Cell colSpan='10' className='order-product-row'>
          <Button circular compact basic size='tiny' 
            icon='refresh' 
            content='Reload' 
            disabled={this.props.isReloading} 
          />
          <Dimmer.Dimmable as={Segment} vertical blurring dimmed={this.props.isReloading}>
            <Dimmer active={this.props.isReloading} inverted>
              <Loader>Loading</Loader>
            </Dimmer>
            {vendorRows}
          </Dimmer.Dimmable>
        </Table.Cell>
      </Table.Row>
    );
  }
}

export default DesignerDetails;