const initialState = {
  isLoadingOrders: false,
	orders: null
};

const orders = (state = initialState, action) => {
  switch(action.type) {

    case 'ORDERS_REQUEST':
      return {
        ...state,
        isLoadingOrders: true
      }

    case 'ORDERS_SUCCESS':
      return {
        ...state,
        isLoadingOrders: false,
        orders: action.res.orders,
        totalPages: action.res.totalPages,
        totalOrders: action.res.totalOrders,
        tabCounts: action.res.tabCounts
      };

    case 'ORDERS_FAILURE':
      return {
        ...state,
        isLoadingOrders: false
      }
			
    default:
      return state;
  }
}

export default orders;
