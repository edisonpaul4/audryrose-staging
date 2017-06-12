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
      if (action.res.timeout) return { ...state, timeout: action.res.timeout };
      let products = [];
      if (action.res.products) {
      	products = action.res.products.map(function(product, i) {
        	return product.toJSON();
      	});
      }
      return {
        ...state,
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
      
    case 'PRODUCT_RELOAD_REQUEST':
      return {
        ...state
      }

    case 'PRODUCT_RELOAD_SUCCESS':
      if (action.res.timeout) return { ...state, timeout: action.res.timeout };
      return {
        ...state,
        updatedProducts: [action.res.updatedProduct],
        tabCounts: action.res.tabCounts ? action.res.tabCounts : {}
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
      if (action.res.timeout) return { ...state, timeout: action.res.timeout };
      return {
        ...state,
        updatedProducts: [action.res.updatedProduct],
        tabCounts: action.res.tabCounts
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
      if (action.res.timeout) return { ...state, timeout: action.res.timeout };
      return {
        ...state,
        updatedVariants: [action.res.updatedVariant],
        updatedProducts: [action.res.updatedProduct],
        tabCounts: action.res.tabCounts
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
      if (action.res.timeout) return { ...state, timeout: action.res.timeout };
      return {
        ...state,
        updatedVariants: action.res.updatedVariants,
        updatedProducts: action.res.updatedProducts,
        tabCounts: action.res.tabCounts
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
      if (action.res.timeout) return { ...state, timeout: action.res.timeout };
      return {
        ...state,
        updatedProducts: action.res.updatedProducts,
        tabCounts: action.res.tabCounts,
        errors: action.res.errors
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
      if (action.res.timeout) return { ...state, timeout: action.res.timeout };
      return {
        ...state,
        updatedProducts: action.res.updatedProducts,
        updatedVariants: action.res.updatedVariants,
        tabCounts: action.res.tabCounts,
        errors: action.res.errors
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
      if (action.res.timeout) return { ...state, timeout: action.res.timeout };
      return {
        ...state,
        updatedProducts: action.res.updatedProducts,
        updatedVariants: action.res.updatedVariants,
        tabCounts: action.res.tabCounts,
        errors: action.res.errors
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
      if (action.res.timeout) return { ...state, timeout: action.res.timeout };
      return {
        ...state,
        updatedProducts: action.res.updatedProducts
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
