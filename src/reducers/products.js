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
      return {
        ...state,
        isLoadingProducts: false,
        products: action.res.products,
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
      return {
        ...state,
        updatedProducts: [action.res.updatedProduct],
        tabCounts: action.res.tabCounts
      };

    case 'PRODUCT_RELOAD_FAILURE':
      return {
        ...state
      }
      
    case 'PRODUCT_STATUS_REQUEST':
      return {
        ...state
      }

    case 'PRODUCT_STATUS_SUCCESS':
      return {
        ...state,
        updatedProducts: [action.res.updatedProduct],
        tabCounts: action.res.tabCounts
      };

    case 'PRODUCT_STATUS_FAILURE':
      return {
        ...state
      }
      
    case 'PRODUCT_VENDOR_REQUEST':
      return {
        ...state
      }

    case 'PRODUCT_VENDOR_SUCCESS':
      return {
        ...state,
        updatedProducts: [action.res.updatedProduct],
        tabCounts: action.res.tabCounts
      };

    case 'PRODUCT_VENDOR_FAILURE':
      return {
        ...state
      }
      
    case 'PRODUCT_TYPE_REQUEST':
      return {
        ...state
      }

    case 'PRODUCT_TYPE_SUCCESS':
      return {
        ...state,
        updatedProducts: [action.res.updatedProduct],
        tabCounts: action.res.tabCounts
      };

    case 'PRODUCT_TYPE_FAILURE':
      return {
        ...state
      }
      
    case 'VARIANT_SAVE_REQUEST':
      return {
        ...state
      }

    case 'VARIANT_SAVE_SUCCESS':
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
      return {
        ...state,
        updatedVariants: action.res.updatedVariants,
        updatedProducts: action.res.updatedProducts,
        tabCounts: action.res.tabCounts
      };

    case 'ADD_TO_VENDOR_ORDER_FAILURE':
      return {
        ...state
      }
      
    case 'GET_BUNDLE_FORM_REQUEST':
      return {
        ...state
      }

    case 'GET_BUNDLE_FORM_SUCCESS':
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
