const initialState = {
  isLoadingProducts: false,
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
        totalPages: action.res.totalPages
      };

    case 'PRODUCTS_FAILURE':
      return {
        ...state,
        isLoadingProducts: false
      }
			
    default:
      return state;
  }
}

export default products;
