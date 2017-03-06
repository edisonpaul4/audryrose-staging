import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Grid, Table, Dimmer, Loader, Checkbox, Header, Icon, Segment, Form, Select } from 'semantic-ui-react';
import ProductsNav from './ProductsNav.js';
import Product from './Product.js';
import ProductDetails from './ProductDetails.js';
import Pagination from './Pagination.js';

class Products extends Component {
  constructor(props) {
    super(props);
    let subpage = this.props.router.params.subpage;
    if (!subpage) subpage = 'in-stock';
  	let page = parseFloat(this.props.location.query.page);
  	if (!page) page = 1;
  	let sort = this.props.location.query.sort;
  	if (!sort) sort = 'date-added-desc';
  	let search = this.props.location.query.q;
  	let filters = {designer: this.props.location.query.designer, price: this.props.location.query.price, class: this.props.location.query.class };
    this.state = {
      subpage: subpage,
			page: page,
			sort: sort,
			filters: filters,
			search: search,
			products: null,
			filterData: null,
			updatedProduct: null,
			updatedVariant: null,
			expandedProducts: [],
			isReloading: [],
			isSavingVariants: []
    };
    this.handleToggleClick = this.handleToggleClick.bind(this);
    this.handlePaginationClick = this.handlePaginationClick.bind(this);
    this.handleReloadClick = this.handleReloadClick.bind(this);
    this.handleSaveVariantClick = this.handleSaveVariantClick.bind(this);
    this.handleStatusChange = this.handleStatusChange.bind(this);
    this.handleFilterDesignerChange = this.handleFilterDesignerChange.bind(this);
    this.handleFilterPriceChange = this.handleFilterPriceChange.bind(this);
    this.handleFilterClassChange = this.handleFilterClassChange.bind(this);
  }
	
	componentDidMount() {
		this.props.getProducts(this.props.token, this.state.subpage, this.state.page, this.state.sort, this.state.search, this.state.filters);
		this.props.getProductFilters(this.props.token);
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
		queries.page = parseFloat(page);
		
    router.replace({
      pathname: router.location.pathname,
      query: queries
    });
    this.props.getProducts(this.props.token, this.state.subpage, queries.page, this.state.sort, this.state.search, this.state.filters);
    this.setState({
      page: page,
      expandedProducts: []
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
	
	handleSaveVariantClick(objectId, inventory) {
		let currentlySaving = this.state.isSavingVariants;
		const index = currentlySaving.indexOf(objectId);
		if (index < 0) {
			currentlySaving.push(objectId);
		}
  	this.setState({
    	isSavingVariants: currentlySaving
  	});
		this.props.saveVariant(this.props.token, objectId, inventory);
	}
	
	handleSortClick(sort) {
		this.setState({
  		sort: sort,
  		page: 1,
  		expandedProducts: []
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
    this.props.getProducts(this.props.token, this.state.subpage, 1, sort, this.state.search, this.state.filters);
	}
	
  handleFilterDesignerChange(e, {value}) {
		const router = this.props.router;
		const queries = router.location.query;
		queries.page = 1;
		queries.designer = value;
    router.replace({
      pathname: router.location.pathname,
      page: 1,
      query: queries
    });
    var filters = this.state.filters;
    filters.designer = value;
    this.setState({
      page: 1,
      filters: filters,
      search: null,
      expandedProducts: []
    });
    this.props.getProducts(this.props.token, this.state.subpage, 1, this.state.sort, this.state.search, filters);
	}	
	
  handleFilterPriceChange(e, {value}) {
		const router = this.props.router;
		const queries = router.location.query;
		queries.page = 1;
		queries.price = value;
    router.replace({
      pathname: router.location.pathname,
      page: 1,
      query: queries
    });
    var filters = this.state.filters;
    filters.price = value;
    this.setState({
      page: 1,
      filters: filters,
      search: null,
      expandedProducts: []
    });
    this.props.getProducts(this.props.token, this.state.subpage, 1, this.state.sort, this.state.search, filters);
	}	
	
  handleFilterClassChange(e, {value}) {
		const router = this.props.router;
		const queries = router.location.query;
		queries.page = 1;
		queries.class = value;
    router.replace({
      pathname: router.location.pathname,
      page: 1,
      query: queries
    });
    var filters = this.state.filters;
    filters.class = value;
    this.setState({
      page: 1,
      filters: filters,
      search: null,
      expandedProducts: []
    });
    this.props.getProducts(this.props.token, this.state.subpage, 1, this.state.sort, this.state.search, filters);
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
    
    let isSavingVariants = this.state.isSavingVariants;
  	if (nextProps.updatedVariant) {
    	const updatedVariantJSON = nextProps.updatedVariant.toJSON();
    	if (isSavingVariants.length) {
      	const index = isSavingVariants.indexOf(updatedVariantJSON.objectId);
        if (index >= 0) isSavingVariants.splice(index, 1);
      }
    }
  	
  	// Process filters data
  	var filterData = null;
  	if (nextProps.filterData && !this.state.filterData) {
    	var designers = nextProps.filterData.designers.map(function(designer) {
      	return designer.toJSON();
    	});
    	var classes = nextProps.filterData.classes.map(function(classObj) {
      	return classObj.toJSON();
    	});
    	filterData = {designers: designers, classes: classes};
  	}
		this.setState({
  		subpage: nextProps.router.params.subpage,
			page: nextPage,
			search: nextProps.router.params.subpage !== 'search' ? null : this.state.search,
			products: products,
			filterData: filterData ? filterData : this.state.filterData,
			updatedProduct: nextProps.updatedProduct,
			updatedVariant: nextProps.updatedVariant,
			expandedProducts: expandedProducts,
			isReloading: currentlyReloading,
			isSavingVariants: isSavingVariants
		});	
		
  	if (nextPage !== this.state.page || nextProps.router.params.subpage !== this.state.subpage) {
    	expandedProducts = [];
    	this.props.getProducts(this.props.token, nextProps.router.params.subpage, nextPage, this.state.sort, this.state.search, this.state.filters);
  	}
		
	}
	
  render() {
		const { error, isLoadingProducts, totalPages, totalProducts, tabCounts } = this.props;
		let scope = this;
		let productRows = [];
		if (this.state.products) {
			this.state.products.map(function(productRow, i) {
  			let productJSON = productRow.toJSON();
  			let isReloading = (scope.state.isReloading.indexOf(productJSON.productId) >= 0) ? true : false;
  			let expanded = (scope.state.expandedProducts.indexOf(productJSON.productId) >= 0) ? true : false;
				productRows.push(
				  <Product 
				    data={productJSON} 
				    expanded={expanded} 
				    key={`${productJSON.productId}-1`} 
				    isReloading={isReloading} 
				    handleToggleClick={scope.handleToggleClick} 
				    handleStatusChange={scope.handleStatusChange} 
			    />
		    );
				if (expanded) {
  				productRows.push(
  				  <ProductDetails 
  				    data={productJSON} 
  				    expanded={expanded} 
  				    key={`${productJSON.productId}-2`} 
  				    isReloading={isReloading} 
  				    handleReloadClick={scope.handleReloadClick} 
  				    handleSaveVariantClick={scope.handleSaveVariantClick} 
  				    savingVariants={scope.state.isSavingVariants} 
  				    updatedVariant={scope.state.updatedVariant} 
				    />
			    );
				}
				return productRows;
	    });
		}
		
		// Get sort column name without sort direction
		let sortColumn = '';
		sortColumn = (this.state.sort.includes('date-added')) ? 'date-added' : sortColumn;
		sortColumn = (this.state.sort.includes('price')) ? 'price' : sortColumn;
		sortColumn = (this.state.sort.includes('stock')) ? 'stock' : sortColumn;
		
		// Populate filter selects from state
		let filterDesigners = [{ key: 0, value: 'all', text: 'All' }];
		let filterClass = [{ key: 0, value: 'all', text: 'All' }];
		const filterPrice = [
		  { key: 0, value: 'all', text: 'All' },
		  { key: 1, value: '0-150', text: '$0-$150' },
      { key: 2, value: '151-350', text: '$151-$350' },
      { key: 3, value: '351-550', text: '$351-$550' },
      { key: 4, value: '551-850', text: '$551-$850' },
      { key: 5, value: '851-1500', text: '$851-$1,500' },
      { key: 6, value: '1500', text: '$1,500+' },
	  ];
	  let defaultDesigner = scope.props.location.query.designer ? scope.props.location.query.designer : 'all';
	  let defaultClass = scope.props.location.query.class ? scope.props.location.query.class : 'all';
	  let defaultPrice = scope.props.location.query.price ? scope.props.location.query.price : 'all';
	  if (this.state.filterData) {
  		this.state.filterData.designers.map(function(designer, i) {
    		return filterDesigners.push({ key: designer.designerId, value: designer.name, text: designer.name });
  		});
  		this.state.filterData.classes.map(function(classObj, i) {
    		return filterClass.push({ key: i+1, value: classObj.name, text: classObj.name });
  		});
		}
		
    const searchHeader = this.state.search ? <Header as='h2'>{totalProducts} results for "{this.state.search}"</Header> : null;
    const filterBarClassNames = this.state.search ? 'toolbar-products hidden' : 'toolbar-products';
    const dateIcon = this.state.sort === 'date-added-desc' || this.state.sort === 'date-added-asc' ? null : <Icon disabled name='caret down' />;
    const priceIcon = this.state.sort === 'price-desc' || this.state.sort === 'price-asc' ? null : <Icon disabled name='caret down' />;
    const stockIcon = this.state.sort === 'stock-desc' || this.state.sort === 'stock-asc' ? null : <Icon disabled name='caret down' />;
    return (
			<Grid.Column width='16'>
				<ProductsNav key={this.props.location.pathname} pathname={this.props.location.pathname} query={this.props.location.query} tabCounts={tabCounts} />
			  <Segment attached basic size='small' className={filterBarClassNames}>
          <Form className='filter-form' size='tiny'>
            <Form.Group inline>
              <Form.Field>
                <label>Designer:</label>
                <Select options={filterDesigners} defaultValue={defaultDesigner} onChange={this.handleFilterDesignerChange}/>
              </Form.Field>
              <Form.Field>
                <label>Price:</label>
                <Select options={filterPrice} defaultValue={defaultPrice} onChange={this.handleFilterPriceChange} />
              </Form.Field>
              <Form.Field>
                <label>Class:</label>
                <Select options={filterClass} defaultValue={defaultClass} onChange={this.handleFilterClassChange} />
              </Form.Field>
            </Form.Group>
          </Form>
        </Segment>
				{error}
	      <Dimmer active={isLoadingProducts} inverted>
	        <Loader inverted>Loading</Loader>
	      </Dimmer>
	      {searchHeader}
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
