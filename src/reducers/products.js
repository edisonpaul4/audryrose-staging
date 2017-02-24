const initialState = {
  isLoadingProducts: false,
  isReloading: false,
	products: null
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
        totalProducts: action.res.totalProducts
      };

    case 'PRODUCTS_FAILURE':
      return {
        ...state,
        isLoadingProducts: false
      }
      
    case 'PRODUCT_RELOAD_REQUEST':
      return {
        ...state,
        isReloading: true
      }

    case 'PRODUCT_RELOAD_SUCCESS':
      return {
        ...state,
        isReloading: false,
        updatedProduct: action.res
      };

    case 'PRODUCT_RELOAD_FAILURE':
      return {
        ...state,
        isReloading: false
      }
      
    case 'PRODUCT_STATUS_REQUEST':
      return {
        ...state,
        isReloading: true
      }

    case 'PRODUCT_STATUS_SUCCESS':
      return {
        ...state,
        isReloading: false,
        updatedProduct: action.res
      };

    case 'PRODUCT_STATUS_FAILURE':
      return {
        ...state,
        isReloading: false
      }
			
    default:
      return state;
  }
}

export default products;
