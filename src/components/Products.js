import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Grid, Table, Dimmer, Loader, Checkbox, Header, Icon/* , Segment, Form, Select */ } from 'semantic-ui-react';
import ProductsNav from './ProductsNav.js';
import Product from './Product.js';
import ProductDetails from './ProductDetails.js';
import Pagination from './Pagination.js';

class Products extends Component {
  constructor(props) {
    super(props);
  	let page = parseFloat(this.props.location.query.page);
  	if (!page) page = 1;
  	let sort = this.props.location.query.sort;
  	if (!sort) sort = 'date-added-desc';
  	let search = this.props.location.query.q;
  	let filters = {vendor: this.props.location.query.vendor, price: this.props.location.query.price, class: this.props.location.query.class };
    this.state = {
			page: page,
			sort: sort,
			search: search,
			products: null,
			filters: filters,
			updatedProduct: null,
			expandedProducts: [],
			isReloading: []
    };
    this.handleToggleClick = this.handleToggleClick.bind(this);
    this.handlePaginationClick = this.handlePaginationClick.bind(this);
    this.handleReloadClick = this.handleReloadClick.bind(this);
    this.handleStatusChange = this.handleStatusChange.bind(this);
//     this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
  }
	
	componentDidMount() {
		this.props.getProducts(this.props.token, this.state.page, this.state.sort, this.state.search);
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
    });
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
	
	handleSortClick(sort) {
		this.setState({
  		sort: sort,
  		page: 1
		});
		
		const router = this.props.router;
		const queries = router.location.query;
		queries.sort = sort;
		queries.page = 1;
    router.replace({
      pathname: router.location.pathname,
      page: 1,
      query: queries
    });
    this.props.getProducts(this.props.token, 1, sort);
	}
	
	handleStatusChange(productId, isActive) {
		let currentlyReloading = this.state.isReloading;
		const index = currentlyReloading.indexOf(productId);
		if (index < 0) {
			currentlyReloading.push(productId);
		}
  	this.setState({
    	isReloading: currentlyReloading
  	});
  	var status = isActive ? 'active' : 'done';
		this.props.saveProductStatus(this.props.token, productId, status);
	}
	
	componentWillReceiveProps(nextProps) {
  	let nextPage = parseFloat(nextProps.location.query.page);
  	if (!nextPage) nextPage = 1;
  	let expandedProducts = this.state.expandedProducts;
  	if (nextPage !== this.state.page) {
    	expandedProducts = [];
    	this.props.getProducts(this.props.token, nextPage, this.state.sort);
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
        if (index >= 0) currentlyReloading.splice(index, 1);
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
		const { error, isLoadingProducts, totalPages, totalProducts } = this.props;
		let scope = this;
		let productRows = [];
		if (this.state.products) {
			this.state.products.map(function(productRow, i) {
  			let productJSON = productRow.toJSON();
  			let isReloading = (scope.state.isReloading.indexOf(productJSON.productId) >= 0) ? true : false;
  			let expanded = (scope.state.expandedProducts.indexOf(productJSON.productId) >= 0) ? true : false;
				productRows.push(<Product data={productJSON} expanded={expanded} key={`${productJSON.productId}-1`} isReloading={isReloading} handleToggleClick={scope.handleToggleClick} handleStatusChange={scope.handleStatusChange} />);
				if (expanded) productRows.push(<ProductDetails data={productJSON} expanded={expanded} key={`${productJSON.productId}-2`} isReloading={isReloading} handleReloadClick={scope.handleReloadClick} />);
				return productRows;
	    });
		}
		let sortColumn = '';
		sortColumn = (this.state.sort.includes('date-added')) ? 'date-added' : sortColumn;
		sortColumn = (this.state.sort.includes('price')) ? 'price' : sortColumn;
		sortColumn = (this.state.sort.includes('stock')) ? 'stock' : sortColumn;
/*
		const filterVendors = [
		  { key: 0, value: 'all', text: 'All' },
		  { key: 1, value: 'ea', text: 'EMILY AMEY' },
		  { key: 2, value: 'rj', text: 'ROSEDALE JEWELRY' }
	  ];
		const filterPrice = [
		  { key: 0, value: 'all', text: 'All' },
		  { key: 1, value: '1', text: '$0-$100' },
      { key: 2, value: '2', text: '$101-$1,000' },
      { key: 3, value: '3', text: '$1,001-$10,000' },
      { key: 4, value: '4', text: '$10,001-$50,000' },
	  ];
		const filterClass = [
		  { key: 0, value: 'All', text: 'All' },
		  { key: 1, value: 'Rings', text: 'Rings' },
		  { key: 2, value: 'Necklaces', text: 'Necklaces' },
		  { key: 3, value: 'Earrings', text: 'Earrings' },
		  { key: 4, value: 'Bracelet', text: 'Bracelet' },
		  { key: 5, value: 'Bags', text: 'Bags' },
		  { key: 6, value: 'Scarves', text: 'Scarves' },
		  { key: 7, value: 'Home', text: 'Home' }
	  ];
*/
    const searchHeader = this.state.search ? <Header as='h2'>{totalProducts} results for "{this.props.location.query.q}"</Header> : null;
    const dateIcon = this.state.sort === 'date-added-desc' || this.state.sort === 'date-added-asc' ? null : <Icon disabled name='caret down' />;
    const priceIcon = this.state.sort === 'price-desc' || this.state.sort === 'price-asc' ? null : <Icon disabled name='caret down' />;
    const stockIcon = this.state.sort === 'stock-desc' || this.state.sort === 'stock-asc' ? null : <Icon disabled name='caret down' />;
    return (
			<Grid.Column width='16'>
				<ProductsNav pathname={this.props.location.pathname} query={this.props.location.query} />
			  {/*<Segment attached basic size='small' className='toolbar-products'>
          <Form className='filter-form' size='tiny'>
            <Form.Group inline>
              <Form.Field>
                <label>Vendor:</label>
                <Select options={filterVendors} defaultValue={filterVendors[0].value} />
              </Form.Field>
              <Form.Field>
                <label>Price:</label>
                <Select options={filterPrice} defaultValue={filterPrice[0].value} />
              </Form.Field>
              <Form.Field>
                <label>Class:</label>
                <Select options={filterClass} defaultValue={filterClass[0].value} />
              </Form.Field>
            </Form.Group>
          </Form>
        </Segment>*/}
				{searchHeader}
				{error}
	      <Dimmer active={isLoadingProducts} inverted>
	        <Loader inverted>Loading</Loader>
	      </Dimmer>
		    <Table className='products-table' sortable>
		      <Table.Header>
		        <Table.Row>
              <Table.HeaderCell><Checkbox></Checkbox></Table.HeaderCell>
              <Table.HeaderCell 
                sorted={sortColumn === 'date-added' ? (this.state.sort === 'date-added-asc' ? 'ascending' : 'descending') : null} 
                onClick={this.state.sort === 'date-added-desc' ? ()=>this.handleSortClick('date-added-asc') : ()=>this.handleSortClick('date-added-desc')}>
                Date Added {dateIcon}
              </Table.HeaderCell>
              <Table.HeaderCell>Image</Table.HeaderCell>
              <Table.HeaderCell>Bigcommerce SKU</Table.HeaderCell>
              <Table.HeaderCell>Audry Rose Name</Table.HeaderCell>
              <Table.HeaderCell>Designer</Table.HeaderCell>
              <Table.HeaderCell 
                className='center aligned'
                sorted={sortColumn === 'price' ? (this.state.sort === 'price-asc' ? 'ascending' : 'descending') : null} 
                onClick={this.state.sort === 'price-desc' ? ()=>this.handleSortClick('price-asc') : ()=>this.handleSortClick('price-desc')}>
                Price {priceIcon}
              </Table.HeaderCell>
							<Table.HeaderCell>Class</Table.HeaderCell>
							<Table.HeaderCell>Size Scale</Table.HeaderCell>
							<Table.HeaderCell>Status</Table.HeaderCell>
							<Table.HeaderCell>Labels</Table.HeaderCell>
              <Table.HeaderCell 
                className='right aligned'
                sorted={sortColumn === 'stock' ? (this.state.sort === 'stock-asc' ? 'ascending' : 'descending') : null} 
                onClick={this.state.sort === 'stock-desc' ? ()=>this.handleSortClick('stock-asc') : ()=>this.handleSortClick('stock-desc')}>
                Stock {stockIcon}
              </Table.HeaderCell>
							<Table.HeaderCell className='right aligned'>&nbsp;</Table.HeaderCell>
		        </Table.Row>
		      </Table.Header>
		      <Table.Body>
						{productRows}
		      </Table.Body>
					<Table.Footer fullWidth>
						<Table.Row>
							<Table.HeaderCell colSpan='13'>
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
