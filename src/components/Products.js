import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Grid, Table, Dimmer, Loader, Checkbox } from 'semantic-ui-react';
import ProductsNav from './ProductsNav.js';
import Product from './Product.js';
import ProductVariants from './ProductVariants.js';
import Pagination from './Pagination.js';

class Products extends Component {
  constructor(props) {
    super(props);
    this.state = {
			page: null,
			expandedProducts: []
    };
    this._onToggle = this._onToggle.bind(this);
    this.handlePaginationClick = this.handlePaginationClick.bind(this);
  }
	
	componentDidMount() {
  	let page = parseFloat(this.props.location.query.page);
  	if (!page) page = 1;
		this.props.getProducts(this.props.token, page);
	}
	
	_onToggle(productId) {
		let currentlyExpanded = this.state.expandedProducts;
		var index = currentlyExpanded.indexOf(productId);
		if (index >= 0) {
			currentlyExpanded.splice(index, 1);
		} else {
			currentlyExpanded.push(productId);
		}
		this.setState({
			expandedProducts: currentlyExpanded
		});
	}
	
	handlePaginationClick(page) {
		const router = this.props.router;
		const queries = router.location.query;
		queries.page = page;
		
    router.replace({
      pathname: router.location.pathname,
      query: queries
    })
	}
	
	componentWillReceiveProps(nextProps) {
  	let nextPage = parseFloat(nextProps.location.query.page);
  	if (!nextPage) nextPage = 1;
  	if (nextPage !== this.state.page) {
  		this.setState({
  			page: nextPage
  		});
    	this.props.getProducts(this.props.token, nextPage);
  	}
	}
	
  render() {
		const { error, isLoadingProducts, totalPages } = this.props;
		let scope = this;
		let productRows = [];
		if (this.props.products) {
			this.props.products.map(function(productRow, i) {
  			let productJSON = productRow.toJSON();
  			let variants = productJSON.variants;
  			let expanded = (scope.state.expandedProducts.indexOf(productJSON.productId) >= 0) ? true : false;
				productRows.push(<Product data={productJSON} expanded={expanded} key={`${productJSON.productId}-1`} onToggle={scope._onToggle} />);
				productRows.push(<ProductVariants variants={variants} expanded={expanded} key={`${productJSON.productId}-2`} />);
				return productRows;
	    });
		}
    return (
			<Grid.Column width='16'>
				<ProductsNav pathname={this.props.location.pathname} />
				{error}
	      <Dimmer active={isLoadingProducts} inverted>
	        <Loader inverted>Loading</Loader>
	      </Dimmer>
		    <Table className='products-table'>
		      <Table.Header>
		        <Table.Row>
              <Table.HeaderCell><Checkbox></Checkbox></Table.HeaderCell>
              <Table.HeaderCell>Image</Table.HeaderCell>
              <Table.HeaderCell>Bigcommerce SKU</Table.HeaderCell>
              <Table.HeaderCell>Audry Rose Name</Table.HeaderCell>
              <Table.HeaderCell>Designer</Table.HeaderCell>
              <Table.HeaderCell className='right aligned'>Price</Table.HeaderCell>
							<Table.HeaderCell>Class</Table.HeaderCell>
							<Table.HeaderCell>Size Scale</Table.HeaderCell>
							<Table.HeaderCell>Status</Table.HeaderCell>
							<Table.HeaderCell>Labels</Table.HeaderCell>
							<Table.HeaderCell className='right aligned'>Stock</Table.HeaderCell>
							<Table.HeaderCell className='right aligned'>&nbsp;</Table.HeaderCell>
		        </Table.Row>
		      </Table.Header>
		      <Table.Body>
						{productRows}
		      </Table.Body>
					<Table.Footer fullWidth>
						<Table.Row>
							<Table.HeaderCell colSpan='12'>
                <Pagination page={this.state.page} onPaginationClick={this.handlePaginationClick} totalPages={totalPages} />
							</Table.HeaderCell>
						</Table.Row>
					</Table.Footer>
		    </Table>
			</Grid.Column>
    );
  }
}

export default withRouter(Products);
