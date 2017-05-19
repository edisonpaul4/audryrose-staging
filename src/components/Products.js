import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Grid, Table, Dimmer, Loader, Checkbox, Header, Icon, Segment, Form, Select } from 'semantic-ui-react';
import NotificationSystem from 'react-notification-system';
import ProductsNav from './ProductsNav.js';
import Product from './Product.js';
import ProductDetails from './ProductDetails.js';
import Pagination from './Pagination.js';
import ProductOrderModal from './ProductOrderModal.js';
import ProductEditBundleModal from './ProductEditBundleModal.js';

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
			products: [],
			filterData: null,
			updatedProducts: null,
			updatedVariants: [],
			expandedProducts: [],
			isReloading: [],
			savingVariants: [],
			tabCounts: null,
			productOrderOpen: false,
			productOrderData: null,
			bundleFormOpen: false,
			bundleFormData: null,
			errors: []
    };
    this._notificationSystem = null;
    this.handleToggleClick = this.handleToggleClick.bind(this);
    this.handlePaginationClick = this.handlePaginationClick.bind(this);
    this.handleReloadClick = this.handleReloadClick.bind(this);
    this.handleSaveVariantClick = this.handleSaveVariantClick.bind(this);
    this.handleSaveAllVariantsClick = this.handleSaveAllVariantsClick.bind(this);
    this.handleVariantsEdited = this.handleVariantsEdited.bind(this);
    this.handleProductSave = this.handleProductSave.bind(this);
    this.handleEditBundleClick = this.handleEditBundleClick.bind(this);
    this.handleEditBundleModalClose = this.handleEditBundleModalClose.bind(this);
    this.handleProductBundleSave = this.handleProductBundleSave.bind(this);
    this.handleFilterDesignerChange = this.handleFilterDesignerChange.bind(this);
    this.handleFilterPriceChange = this.handleFilterPriceChange.bind(this);
    this.handleFilterClassChange = this.handleFilterClassChange.bind(this);
    this.handleShowOrderFormClick = this.handleShowOrderFormClick.bind(this);
    this.handleAddToVendorOrder = this.handleAddToVendorOrder.bind(this);
    this.handleCreateResize = this.handleCreateResize.bind(this);
    this.handleSaveResize = this.handleSaveResize.bind(this);
    this.handleProductOrderModalClose = this.handleProductOrderModalClose.bind(this);
  }
	
	componentDidMount() {
  	this._notificationSystem = this.refs.notificationSystem;
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
	
	handleSaveVariantClick(variantEdited) {
  	this.setState({
    	savingVariants: [variantEdited.objectId]
  	});
		this.props.saveVariants(this.props.token, [variantEdited]);
	}
	
	handleSaveAllVariantsClick(variantsEdited) {
  	const ids = variantsEdited.map(function(variant, i) {
    	return variant.objectId;
  	});
  	this.setState({
    	savingVariants: ids
  	});
		this.props.saveVariants(this.props.token, variantsEdited);
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
	
	handleProductSave(data) {
		let currentlyReloading = this.state.isReloading;
		const index = currentlyReloading.indexOf(data.productId);
		if (index < 0) {
			currentlyReloading.push(data.productId);
		}
  	this.setState({
    	isReloading: currentlyReloading
  	});
		this.props.saveProduct(this.props.token, data);
	}
	
	handleEditBundleClick(productId) {
  	let bundleFormData = {};
    this.state.products.map(function(product, i) {
      if (product.productId === productId) {
        bundleFormData.product = product.toJSON();
      }
      return product;
    });
    this.setState({
      bundleFormOpen: true,
      bundleFormData: bundleFormData,
      bundleFormIsLoading: true
    });
		this.props.getBundleFormData(this.props.token, productId);
	}
	
	handleEditBundleModalClose(data) {
    this.setState({
      bundleFormOpen: false,
      bundleFormData: null,
      bundleFormIsLoading: false
    });
	}
	
	handleProductBundleSave(data) {
  	let currentlyReloading = this.state.isReloading;
		const index = currentlyReloading.indexOf(data.bundleProductId);
		if (index < 0) {
			currentlyReloading.push(data.bundleProductId);
		}
  	this.setState({
    	isReloading: currentlyReloading
  	});
		this.props.productBundleSave(this.props.token, data);
	}
	
	handleVariantsEdited(data, edited) {
  	this.setState({
    	savingVariants: []
  	});
	}
	
	handleAddToVendorOrder(orders) {
  	let currentlyReloading = this.state.isReloading;
  	const variantEdited = orders.map(function(order, i) {
  		const index = currentlyReloading.indexOf(order.productId);
  		if (index < 0) {
  			currentlyReloading.push(order.productId);
  		}
    	return order.variant;
  	});
  	this.setState({
    	isReloading: currentlyReloading,
    	savingVariants: [variantEdited]
  	});
		this.props.addToVendorOrder(this.props.token, orders);
	}
	
	handleCreateResize(resizes) {
  	let currentlyReloading = this.state.isReloading;
  	let savingVariants = this.state.savingVariants;
  	resizes.map(function(resize, i) {
  		if (currentlyReloading.indexOf(resize.productId) < 0) currentlyReloading.push(resize.productId);
  		if (savingVariants.indexOf(resize.variant) < 0) savingVariants.push(resize.variant);
  		if (savingVariants.indexOf(resize.resizeVariant) < 0) savingVariants.push(resize.resizeVariant);
    	return resize;
  	});
  	this.setState({
    	isReloading: currentlyReloading,
    	savingVariants: savingVariants
  	});
		this.props.createResize(this.props.token, resizes);
	}
	
	handleShowOrderFormClick(data) {
  	let productOrderData = {};
    this.state.products.map(function(product, i) {
      if (product.productId === data.productId) {
        productOrderData.product = product.toJSON();
      }
      return product;
    });
    productOrderData.variant = data.variant;
    productOrderData.resize = data.resize;
    this.setState({
      productOrderOpen: true,
      productOrderData: productOrderData
    });
  }
	
	handleSaveResize(data) {
  	let currentlyReloading = this.state.isReloading;
  	const index = currentlyReloading.indexOf(data.productId);
		if (index < 0) {
			currentlyReloading.push(data.productId);
		}
  	this.setState({
    	isReloading: currentlyReloading,
    	savingVariants: [data.variant, data.resizeVariant]
  	});
		this.props.saveResize(this.props.token, data);
	}
	
	handleProductOrderModalClose(data) {
    this.setState({
      productOrderOpen: false,
      productOrderData: null
    });
	}
	
	componentWillReceiveProps(nextProps) {
  	const scope = this;
  	let state = {};
  	
  	if (nextProps.router.params.subpage !== this.state.subpage) state.subpage = nextProps.router.params.subpage;
  	
  	let nextPage = parseFloat(nextProps.location.query.page);
  	if (!nextPage) nextPage = 1;
  	if (nextPage !== this.state.page) state.page = nextPage;
  	
  	let currentProducts = this.state.products;
  	if (nextProps.products) {
    	currentProducts = nextProps.products.map(function(product, i) {
      	return product.toJSON();
    	});
  	}
  	let products = [];
  	let currentlyReloading = this.state.isReloading;
  	
  	// Process updated products from reloadProduct, saveProductStatus, saveVariants
  	if (nextProps.updatedProducts) {
      currentProducts.map(function(product, i) {
        nextProps.updatedProducts.map(function(updatedProduct, i) {
          const updatedProductJSON = updatedProduct.toJSON();
          // If updated product exists, push it into the state products array
          if (updatedProductJSON.productId === product.productId) {
            products.push(updatedProductJSON);
          } else {
            products.push(product);
          }
          
          // If currently reloading and has successfully updated product, remove updated product
        	if (currentlyReloading.length) {
          	const index = currentlyReloading.indexOf(updatedProductJSON.productId);
            if (index >= 0) {
              currentlyReloading.splice(index, 1);
            }
          }
          
          return updatedProduct; 
        });
        return product;
      });
    } else {
      products = currentProducts;
    }
    if (nextProps.products || nextProps.updatedProducts) state.products = products;
    state.isReloading = currentlyReloading;
    
    // Remove any updated variants from savingVariants state
  	if (nextProps.updatedVariants && nextProps.updatedVariants.length > 0) {
    	let savingVariants = this.state.savingVariants;
    	nextProps.updatedVariants.map(function(updatedVariant, i) {
      	const updatedVariantJSON = updatedVariant.toJSON();
      	if (savingVariants.length) {
        	let index = -1;
          savingVariants.map(function(variant, j) {
            if (variant === updatedVariantJSON.objectId) index = j;
            return savingVariants;
          });
          if (index >= 0) {
            savingVariants.splice(index, 1);
          }
        }
        return updatedVariant;
      });
      state.updatedVariants = nextProps.updatedVariants;
      state.savingVariants = nextProps.savingVariants;
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
    	state.filterData = filterData;
  	}
  	
  	if (nextProps.bundleFormData) {
      state.bundleFormData.products = nextProps.bundleFormData;
      state.bundleFormIsLoading = nextProps.bundleFormIsLoading;
  	}
  	
		// Display any errors
		if (nextProps.errors) {
  		let errors = [];
  		nextProps.errors.map(function(errorMessage, i) {
    		var errorExists = false;
    		scope.state.errors.map(function(error, j) {
      		if (errorMessage === error) errorExists = true;
          return error;
        });
        if (!errorExists) {
          scope._notificationSystem.addNotification({
            message: errorMessage,
            level: 'error',
            autoDismiss: 0,
            dismissible: true
          });
        }
    		return errorMessage;
  		});
      errors = nextProps.errors.length > 0 ? nextProps.errors : this.state.errors;
      state.errors = errors;
		}
  	
  	// Update tab counts if available
  	if (nextProps.tabCounts) {
    	state.tabCounts = nextProps.tabCounts;
  	}
  	
  	// Reset on subpage navigation
  	if (nextProps.router.params.subpage !== 'search') state.search = null;
		
		this.setState(state);	
    
  	if (nextPage !== this.state.page || (nextProps.router.params.subpage !== undefined && nextProps.router.params.subpage !== this.state.subpage)) {
    	this.props.getProducts(
    	  this.props.token, 
    	  nextProps.router.params.subpage, 
    	  nextPage, 
    	  this.state.sort, 
    	  (state.search ? state.search : this.state.search), 
    	  this.state.filters
  	  );
  	}
		
	}
	
  render() {
		const { error, isLoadingProducts, totalPages, totalProducts } = this.props;
		let scope = this;
		let productRows = [];
		const tabCounts = this.state.tabCounts;
		
		if (this.state.products) {
			this.state.products.map(function(product, i) {
  			let isReloading = (scope.state.isReloading.indexOf(product.productId) >= 0) ? true : false;
  			let expanded = (scope.state.expandedProducts.indexOf(product.productId) >= 0) ? true : false;
  			
  			// Create simple object for Product row
  			let productData = {
          productId: product.productId,
          is_active: product.is_active,
          total_stock: product.total_stock,
          isBundle: product.isBundle,
          is_visible: product.is_visible,
          hasResizeRequest: product.hasResizeRequest,
          hasVendorBuy: product.hasVendorBuy,
          custom_url: product.custom_url,
          name: product.name,
          sku: product.sku,
          designer: product.designer,
          date_created: product.date_created,
          primary_image: product.primary_image,
          price: product.price,
          classification: product.classification
  			}
    		let sizes = [];
    		if (product.variants && product.variants.length > 1) {
    			product.variants.map(function(variant, i) {
      			if (!variant.variantOptions) {
        			console.log('variant has no options: ' + variant.productName + ' ' + variant.variantId); 
        			return true;
      			}
      			return variant.variantOptions.map(function(variantOption, j) {
        			if (variantOption.option_id === 32) sizes.push(parseFloat(variantOption.value));
        			return true;
      			});
    			});
    		}
    		sizes.sort((a, b) => (a - b));
    		const sizeScale = (sizes.length > 0) ? sizes[0] + '-' + sizes[sizes.length-1] : 'OS' ;
    		productData.sizeScale = sizeScale;
				productRows.push(
				  <Product 
				    data={productData} 
				    expanded={expanded} 
				    key={`${product.productId}-1`} 
				    isReloading={isReloading} 
				    handleToggleClick={scope.handleToggleClick} 
				    handleProductSave={scope.handleProductSave} 
			    />
		    );
		    
		    // Create ProductDetails row
				if (expanded) {
  				productRows.push(
  				  <ProductDetails 
  				    data={product} 
  				    expanded={expanded} 
  				    key={`${product.productId}-2`} 
  				    isReloading={isReloading} 
  				    savingVariants={scope.state.savingVariants} 
  				    updatedVariants={scope.state.updatedVariants} 
  				    handleReloadClick={scope.handleReloadClick} 
  				    handleSaveVariantClick={scope.handleSaveVariantClick} 
  				    handleSaveAllVariantsClick={scope.handleSaveAllVariantsClick} 
  				    handleShowOrderFormClick={scope.handleShowOrderFormClick} 
  				    handleVariantsEdited={scope.handleVariantsEdited}
  				    handleProductSave={scope.handleProductSave} 
  				    handleEditBundleClick={scope.handleEditBundleClick}
  				    handleSaveResize={scope.handleSaveResize}
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
    const filterBarClassNames = this.state.search ? 'toolbar hidden' : 'toolbar';
    const dateIcon = this.state.sort === 'date-added-desc' || this.state.sort === 'date-added-asc' ? null : <Icon disabled name='caret down' />;
    const priceIcon = this.state.sort === 'price-desc' || this.state.sort === 'price-asc' ? null : <Icon disabled name='caret down' />;
    const stockIcon = this.state.sort === 'stock-desc' || this.state.sort === 'stock-asc' ? null : <Icon disabled name='caret down' />;
    
    const productOrderModal = this.state.productOrderData && this.state.productOrderOpen === true ? <ProductOrderModal 
        open={this.state.productOrderOpen}
        handleAddToVendorOrder={this.handleAddToVendorOrder} 
        handleCreateResize={this.handleCreateResize} 
        handleProductOrderModalClose={this.handleProductOrderModalClose} 
        handleProductOrder={this.handleProductOrder} 
        productOrderData={this.state.productOrderData} 
        isLoading={this.props.isReloading}
      /> : null;
      
    const productEditBundleModal = this.state.bundleFormData && this.state.bundleFormData.product && this.state.bundleFormOpen === true ? <ProductEditBundleModal 
        open={this.state.bundleFormOpen}
        handleEditBundleModalClose={this.handleEditBundleModalClose} 
        handleProductBundleSave={this.handleProductBundleSave} 
        bundleFormData={this.state.bundleFormData} 
        isLoading={this.state.bundleFormIsLoading}
      /> : null; 
    
    return (
			<Grid.Column width='16'>
  			<NotificationSystem ref="notificationSystem" />
				<ProductsNav key={this.props.location.pathname} pathname={this.props.location.pathname} query={this.props.location.query} tabCounts={tabCounts} />
			  <Segment basic size='small' className={filterBarClassNames}>
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
		    {productOrderModal}
		    {productEditBundleModal}
			</Grid.Column>
    );
  }
}

export default withRouter(Products);
