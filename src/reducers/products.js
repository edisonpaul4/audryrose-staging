const initialState = {
  isLoadingProducts: false,
	products: null,
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
        updatedProduct: action.res
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
        updatedProduct: action.res
      };

    case 'PRODUCT_STATUS_FAILURE':
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
        updatedVariants: [action.res]
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
        updatedVariants: action.res
      };

    case 'VARIANTS_SAVE_FAILURE':
      return {
        ...state
      }
			
    default:
      return state;
  }
}

export default products;
