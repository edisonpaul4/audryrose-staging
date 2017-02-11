import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Grid, Table, Dimmer, Loader, Checkbox, Menu } from 'semantic-ui-react';
import ProductsNav from './ProductsNav.js';
import Product from './Product.js';

class Products extends Component {
  constructor(props) {
    super(props);

    this.state = {
			token: null,
			isLoadingProducts: null,
			products: null,
			page: 1
    };
  }
	
	componentDidMount() {
		this.props.getProducts(this.props.token, 1);
	}
	
	handlePaginationClick(event) {
    event.preventDefault();
	  event.stopPropagation();
		var pageNum;
		switch (event.target.name) {
			case 'prev':
				pageNum = parseInt(event.target.name, 10) - 1;
				break;
			case 'next':
				pageNum = parseInt(event.target.name, 10) + 1;
				break;
			default :
				pageNum = parseInt(event.target.name, 10);
				break;
		}
		this.setState({
			page: pageNum
		});
		this.props.getProducts(this.props.token, pageNum);
	}
	
  render() {
		const { error, isLoadingProducts } = this.props;
		let productRows = [];
		if (this.props.products) {
			this.props.products.map(function(productRow, i) {
  			let productJSON = productRow.toJSON();
				// orderRow.expanded = (scope.state.expandedOrders.indexOf(orderRow.orderId) >= 0) ? true : false;
				return productRows.push(<Product data={productJSON} key={`${productJSON.productId}-1`} />);
				// orderRows.push(<OrderProducts data={orderRow} key={`${orderRow.orderId}-2`} />);
	    });
		}
    return (
			<Grid.Column width='16'>
				<ProductsNav pathname={this.props.location.pathname} />
				{error}
	      <Dimmer active={isLoadingProducts} inverted>
	        <Loader inverted>Loading</Loader>
	      </Dimmer>
		    <Table className='products-table' sortable>
		      <Table.Header>
		        <Table.Row>
              <Table.HeaderCell><Checkbox></Checkbox></Table.HeaderCell>
              <Table.HeaderCell>Image</Table.HeaderCell>
              <Table.HeaderCell>Bigcommerce SKU</Table.HeaderCell>
              <Table.HeaderCell>Audry Rose Name</Table.HeaderCell>
              <Table.HeaderCell>Designer</Table.HeaderCell>
              <Table.HeaderCell className='text-right'>Price</Table.HeaderCell>
							<Table.HeaderCell>Class</Table.HeaderCell>										
							<Table.HeaderCell>Size Scale</Table.HeaderCell>
							<Table.HeaderCell>Status</Table.HeaderCell>
							<Table.HeaderCell>Labels</Table.HeaderCell>
							<Table.HeaderCell className='text-right'>Stock</Table.HeaderCell>
							<Table.HeaderCell className='text-right'>&nbsp;</Table.HeaderCell>
		        </Table.Row>
		      </Table.Header>
		      <Table.Body>
						{productRows}
		      </Table.Body>
					<Table.Footer fullWidth>
						<Table.Row>
							<Table.HeaderCell colSpan='12'>
					      <Menu pagination>
					        <Menu.Item name='prev' disabled={this.state.page === 1} onClick={this.handlePaginationClick} />
									<Menu.Item name='1' active={this.state.page === 1} onClick={this.handlePaginationClick} />
					        <Menu.Item name='2' active={this.state.page === 2} onClick={this.handlePaginationClick} />
					        <Menu.Item name='3' active={this.state.page === 3} onClick={this.handlePaginationClick} />
					        <Menu.Item name='4' active={this.state.page === 4} onClick={this.handlePaginationClick} />
									<Menu.Item name='next' disabled={this.state.page === 4} onClick={this.handlePaginationClick} />
					      </Menu>
							</Table.HeaderCell>
						</Table.Row>
					</Table.Footer>
		    </Table>
			</Grid.Column>
    );
  }
}

export default withRouter(Products);
