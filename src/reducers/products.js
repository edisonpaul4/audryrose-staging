// import * as schema from './schema';

// import { normalize } from 'normalizr';

const initialState = {
  isLoadingProducts: false,
	products: [],
	filterData: null
};

const products = (state = initialState, action) => {
  switch(action.type) {

    case 'PRODUCTS_REQUEST':
      return {
        ...state,
        isLoadingProducts: true
      }

    case 'PRODUCTS_SUCCESS':
      let products = [];
      if (action.res.products) {
      	products = action.res.products.map(function(product, i) {
        	return product.toJSON();
      	});
//         console.log(products)
//       	const normalizedProducts = normalize(products, schema.productListSchema);
//       	products = normalizedProducts;
      }
      return {
        ...state,
        timeout: action.res.timeout ? action.res.timeout : undefined,
        isLoadingProducts: false,
        products: products,
        totalPages: action.res.totalPages,
        totalProducts: action.res.totalProducts,
        tabCounts: action.res.tabCounts
      };

    case 'PRODUCTS_FAILURE':
      return {
        ...state,
        isLoadingProducts: false
      }
      
    case 'PRODUCT_FILTERS_REQUEST':
      return {
        ...state
      }

    case 'PRODUCT_FILTERS_SUCCESS':
      if (action.res.timeout) return { ...state, timeout: action.res.timeout };
      return {
        ...state,
        filterData: action.res
      };

    case 'PRODUCT_FILTERS_FAILURE':
      return {
        ...state
      }
      
    case 'PRODUCT_OPTIONS_REQUEST':
      return {
        ...state
      }

    case 'PRODUCT_OPTIONS_SUCCESS':
      if (action.res.timeout) return { ...state, timeout: action.res.timeout };
      return {
        ...state,
        optionsData: action.res
      };

    case 'PRODUCT_OPTIONS_FAILURE':
      return {
        ...state
      }
      
    case 'PRODUCT_RELOAD_REQUEST':
      return {
        ...state
      }

    case 'PRODUCT_RELOAD_SUCCESS':
      if (state.products && action.res.updatedProduct) {
      	products = state.products.map(function(product, i) {
        	if (product.objectId === action.res.updatedProduct.id) {
          	console.log('updated product loaded ' + product.objectId);
          	product = action.res.updatedProduct.toJSON();
        	}
        	return product;
      	});
    	}
      return {
        ...state,
        timeout: action.res.timeout ? action.res.timeout : undefined,
        products: products ? products : undefined,
        updatedProducts: action.res.updatedProduct ? [action.res.updatedProduct] : undefined,
        tabCounts: action.res.tabCounts ? action.res.tabCounts : undefined
      };

    case 'PRODUCT_RELOAD_FAILURE':
      return {
        ...state
      }
      
    case 'PRODUCT_SAVE_REQUEST':
      return {
        ...state
      }

    case 'PRODUCT_SAVE_SUCCESS':
      if (state.products && action.res.updatedProduct) {
      	products = state.products.map(function(product, i) {
        	if (product.objectId === action.res.updatedProduct.id) {
          	console.log('updated product loaded ' + product.objectId);
          	product = action.res.updatedProduct.toJSON();
        	}
        	return product;
      	});
    	}
      return {
        ...state,
        timeout: action.res.timeout ? action.res.timeout : undefined,
        products: products ? products : undefined,
        updatedProducts: action.res.updatedProduct ? [action.res.updatedProduct] : undefined,
        tabCounts: action.res.tabCounts ? action.res.tabCounts : undefined
      };

    case 'PRODUCT_SAVE_FAILURE':
      return {
        ...state
      }
      
    case 'VARIANT_SAVE_REQUEST':
      return {
        ...state
      }

    case 'VARIANT_SAVE_SUCCESS':
      if (state.products && action.res.updatedProducts) {
      	products = state.products.map(function(product, i) {
        	action.res.updatedProducts.map(function(updatedProduct, j) {
          	if (product.objectId === updatedProduct.id) {
            	console.log('updated product loaded ' + product.objectId);
            	product = updatedProduct.toJSON();
          	}
          	return updatedProduct;
          });
        	return product;
      	});
    	}
      return {
        ...state,
        timeout: action.res.timeout ? action.res.timeout : undefined,
        products: products ? products : undefined,
        updatedProducts: action.res.updatedProduct ? [action.res.updatedProduct] : undefined,
        updatedVariants: action.res.updatedVariants ? action.res.updatedVariants : undefined,
        tabCounts: action.res.tabCounts ? action.res.tabCounts : undefined
      };

    case 'VARIANT_SAVE_FAILURE':
      return {
        ...state
      }
    
    case 'VARIANTS_SAVE_REQUEST':
      return {
        ...state
      }

    case 'VARIANTS_SAVE_SUCCESS':
      if (state.products && action.res.updatedProducts) {
      	products = state.products.map(function(product, i) {
        	action.res.updatedProducts.map(function(updatedProduct, j) {
          	if (product.objectId === updatedProduct.id) {
            	console.log('updated product loaded ' + product.objectId);
            	product = updatedProduct.toJSON();
          	}
          	return updatedProduct;
          });
        	return product;
      	});
    	}
      return {
        ...state,
        timeout: action.res.timeout ? action.res.timeout : undefined,
        products: products ? products : undefined,
        updatedProducts: action.res.updatedProducts ? action.res.updatedProducts : undefined,
        updatedVariants: action.res.updatedVariants ? action.res.updatedVariants : undefined,
        tabCounts: action.res.tabCounts ? action.res.tabCounts : undefined
      };

    case 'VARIANTS_SAVE_FAILURE':
      return {
        ...state
      }
      
    case 'ADD_TO_VENDOR_ORDER_REQUEST':
      return {
        ...state
      }

    case 'ADD_TO_VENDOR_ORDER_SUCCESS':
      if (state.products && action.res.updatedProducts) {
      	products = state.products.map(function(product, i) {
        	action.res.updatedProducts.map(function(updatedProduct, j) {
          	if (product.objectId === updatedProduct.id) {
            	console.log('updated product loaded ' + product.objectId);
            	product = updatedProduct.toJSON();
          	}
          	return updatedProduct;
          });
        	return product;
      	});
    	}
      return {
        ...state,
        timeout: action.res.timeout ? action.res.timeout : undefined,
        products: products ? products : undefined,
        updatedProducts: action.res.updatedProducts ? action.res.updatedProducts : undefined,
        updatedVariants: action.res.updatedVariants ? action.res.updatedVariants : undefined,
        tabCounts: action.res.tabCounts ? action.res.tabCounts : undefined,
        errors: action.res.errors ? action.res.errors : undefined
      };

    case 'ADD_TO_VENDOR_ORDER_FAILURE':
      return {
        ...state
      }
      
    case 'CREATE_PRODUCT_RESIZE_REQUEST':
      return {
        ...state
      }

    case 'CREATE_PRODUCT_RESIZE_SUCCESS':
      if (state.products && action.res.updatedProducts) {
      	products = state.products.map(function(product, i) {
        	action.res.updatedProducts.map(function(updatedProduct, j) {
          	if (product.objectId === updatedProduct.id) {
            	console.log('updated product loaded ' + product.objectId);
            	product = updatedProduct.toJSON();
          	}
          	return updatedProduct;
          });
        	return product;
      	});
    	}
      return {
        ...state,
        timeout: action.res.timeout ? action.res.timeout : undefined,
        products: products ? products : undefined,
        updatedProducts: action.res.updatedProducts ? action.res.updatedProducts : undefined,
        updatedVariants: action.res.updatedVariants ? action.res.updatedVariants : undefined,
        tabCounts: action.res.tabCounts ? action.res.tabCounts : undefined,
        errors: action.res.errors ? action.res.errors : undefined
      };

    case 'CREATE_PRODUCT_RESIZE_FAILURE':
      return {
        ...state
      }
      
    case 'SAVE_PRODUCT_RESIZE_REQUEST':
      return {
        ...state
      }

    case 'SAVE_PRODUCT_RESIZE_SUCCESS':
      if (state.products && action.res.updatedProducts) {
      	products = state.products.map(function(product, i) {
        	action.res.updatedProducts.map(function(updatedProduct, j) {
          	if (product.objectId === updatedProduct.id) {
            	console.log('updated product loaded ' + product.objectId);
            	product = updatedProduct.toJSON();
          	}
          	return updatedProduct;
          });
        	return product;
      	});
    	}
      return {
        ...state,
        timeout: action.res.timeout ? action.res.timeout : undefined,
        products: products ? products : undefined,
        updatedProducts: action.res.updatedProducts ? action.res.updatedProducts : undefined,
        updatedVariants: action.res.updatedVariants ? action.res.updatedVariants : undefined,
        tabCounts: action.res.tabCounts ? action.res.tabCounts : undefined,
        errors: action.res.errors ? action.res.errors : undefined
      };

    case 'SAVE_PRODUCT_RESIZE_FAILURE':
      return {
        ...state
      }
      
    case 'GET_BUNDLE_FORM_REQUEST':
      return {
        ...state
      }

    case 'GET_BUNDLE_FORM_SUCCESS':
      if (action.res.timeout) return { ...state, timeout: action.res.timeout };
      return {
        ...state,
        bundleFormData: action.res
      };

    case 'GET_BUNDLE_FORM_FAILURE':
      return {
        ...state
      }
      
    case 'BUNDLE_SAVE_REQUEST':
      return {
        ...state
      }

    case 'BUNDLE_SAVE_SUCCESS':
      if (state.products && action.res.updatedProducts) {
      	products = state.products.map(function(product, i) {
        	action.res.updatedProducts.map(function(updatedProduct, j) {
          	if (product.objectId === updatedProduct.id) {
            	console.log('updated product loaded ' + product.objectId);
            	product = updatedProduct.toJSON();
          	}
          	return updatedProduct;
          });
        	return product;
      	});
    	}
      return {
        ...state,
        timeout: action.res.timeout ? action.res.timeout : undefined,
        products: products ? products : undefined,
        updatedProducts: action.res.updatedProducts ? action.res.updatedProducts : undefined,
        errors: action.res.errors ? action.res.errors : undefined
      };

    case 'BUNDLE_SAVE_FAILURE':
      return {
        ...state
      }
			
    default:
      return state;
  }
}

export default products;
