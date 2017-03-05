import React, { Component } from 'react';
import { Table, Button, Dropdown, Dimmer, Segment, Loader } from 'semantic-ui-react';
import classNames from 'classnames';
// import numeral from 'numeral';
// import moment from 'moment';

class ProductRow extends Component {
	render() {  	
		const data = this.props.data;
		// Create an array of other options values
		let options = [];
		if (data.product_options) {
			data.product_options.map(function(option, i) {
				options.push(option.display_name + ': ' + option.display_value);
				return options;
	    });
		}
		const productName = data.name ? data.name : '';
		const productUrl = '/products/search?q=' + data.product_id;
		const productLink = data.variant ? <a href={productUrl}>{productName}</a> : productName;
		
		const alwaysResize = data.variant ? data.variant.alwaysResize : '';
		
		const inventory = data.variant ? data.variant.inventory_level : '';
		
		const designerName = data.variant ? data.variant.designer ? data.variant.designer.name : '' : '';
		
    return (
      <Table.Row>
        <Table.Cell>{productLink}</Table.Cell>
        <Table.Cell>
          {options.map(function(option, i) {
            return <span key={i}>{option}<br/></span>;
          })}
        </Table.Cell>
        <Table.Cell>{data.quantity ? data.quantity : ''}</Table.Cell>
        <Table.Cell></Table.Cell>
				<Table.Cell>{alwaysResize}</Table.Cell>
				<Table.Cell>{inventory}</Table.Cell>
				<Table.Cell>{designerName}</Table.Cell>
				<Table.Cell className='right aligned'>
          <Button.Group color='grey' size='mini' compact>
            <Button icon='shipping' content='Ship Item' />
            <Dropdown floating button compact className='icon'>
              <Dropdown.Menu>
                <Dropdown.Item icon='add to cart' text='Order' />
                <Dropdown.Item icon='exchange' text='Resize' />
                <Dropdown.Item icon='hide' text='Hide' />
              </Dropdown.Menu>
            </Dropdown>
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
//     this.handleReloadClick = this.handleReloadClick.bind(this);
  }
/*
	handleReloadClick(productId) {
		this.props.handleReloadClick(productId);
	}
*/
	handleToggleEditorClick() {
  	const showEditor = !this.state.showEditor;
  	
  	this.setState({
    	showEditor: showEditor
  	});
	}
	render() {
  	const showProducts = this.props.expanded ? true : false;
  	const products = this.props.data.orderProducts;
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
				productRows.push(<ProductRow data={productRow} key={i} />);
				return productRows;
	    });
		}
    return (
      <Table.Row className={rowClass}>
        <Table.Cell colSpan='10' className='order-product-row'>
          {/*<Button circular compact basic size='tiny' 
            icon='refresh' 
            content='Sync' 
            loading={this.props.isReloading} 
            onClick={()=>this.handleReloadClick(this.props.data.productId)} 
          />*/}
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