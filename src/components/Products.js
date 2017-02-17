import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Grid, Table, Dimmer, Loader, Checkbox } from 'semantic-ui-react';
import ProductsNav from './ProductsNav.js';
import Product from './Product.js';
import ProductDetails from './ProductDetails.js';
import Pagination from './Pagination.js';

class Products extends Component {
  constructor(props) {
    super(props);
  	let page = parseFloat(this.props.location.query.page);
  	if (!page) page = 1;
    this.state = {
			page: page,
			products: null,
			updatedProduct: null,
			expandedProducts: [],
			isReloading: []
    };
    this.handleToggleClick = this.handleToggleClick.bind(this);
    this.handlePaginationClick = this.handlePaginationClick.bind(this);
    this.handleReloadClick = this.handleReloadClick.bind(this);
  }
	
	componentDidMount() {
		this.props.getProducts(this.props.token, this.state.page);
	}
	
	handleToggleClick(productId) {
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
	
	handleReloadClick(productId) {
		let currentlyReloading = this.state.isReloading;
		const index = currentlyReloading.indexOf(productId);
		if (index < 0) {
			currentlyReloading.push(productId);
		}
  	this.setState({
    	isReloading: currentlyReloading
  	});
		this.props.reloadProduct(this.props.token, productId);
	}
	
	componentWillReceiveProps(nextProps) {
  	let nextPage = parseFloat(nextProps.location.query.page);
  	if (!nextPage) nextPage = 1;
  	let expandedProducts = this.state.expandedProducts;
  	if (nextPage !== this.state.page) {
    	expandedProducts = [];
    	this.props.getProducts(this.props.token, nextPage);
  	}
  	
  	let products = [];
  	let currentlyReloading = this.state.isReloading;
  	if (nextProps.updatedProduct) {
    	// If updated product exists, push it into the state products array
    	const updatedProductJSON = nextProps.updatedProduct.toJSON();
      nextProps.products.map(function(product, i) {
        const productJSON = product.toJSON();
        if (updatedProductJSON.productId === productJSON.productId) {
          products.push(nextProps.updatedProduct);
        } else {
          products.push(product);
        }
        return product;
      });
      
      // If currently reloading and has successfully updated product, remove updated product
    	if (currentlyReloading.length) {
      	const index = currentlyReloading.indexOf(updatedProductJSON.productId);
        if (index >= 0) currentlyReloading.splice(index, 1);;
      }
      
    } else {
      products = nextProps.products;
    }
    
		this.setState({
			page: nextPage,
			products: products,
			updatedProduct: nextProps.updatedProduct,
			expandedProducts: expandedProducts,
			isReloading: currentlyReloading
		});	
	}
	
  render() {
		const { error, isLoadingProducts, totalPages } = this.props;
		let scope = this;
		let productRows = [];
		if (this.state.products) {
			this.state.products.map(function(productRow, i) {
  			let productJSON = productRow.toJSON();
  			let isReloading = (scope.state.isReloading.indexOf(productJSON.productId) >= 0) ? true : false;
  			let expanded = (scope.state.expandedProducts.indexOf(productJSON.productId) >= 0) ? true : false;
				productRows.push(<Product data={productJSON} expanded={expanded} key={`${productJSON.productId}-1`} handleToggleClick={scope.handleToggleClick} />);
				if (expanded) productRows.push(<ProductDetails data={productJSON} expanded={expanded} key={`${productJSON.productId}-2`} isReloading={isReloading} handleReloadClick={scope.handleReloadClick} />);
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
