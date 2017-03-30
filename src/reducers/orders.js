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
      };

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
      };
      
    case 'ORDER_RELOAD_REQUEST':
      return {
        ...state
      };

    case 'ORDER_RELOAD_SUCCESS':
      return {
        ...state,
        updatedOrders: action.res.updatedOrders,
        tabCounts: action.res.tabCounts
      };

    case 'ORDER_RELOAD_FAILURE':
      return {
        ...state
      };
      
    case 'CREATE_SHIPMENTS_REQUEST':
      return {
        ...state
      };

    case 'CREATE_SHIPMENTS_SUCCESS':
      return {
        ...state,
        updatedOrders: action.res.updatedOrders,
        errors: action.res.errors,
        generatedFile: action.res.generatedFile
      };

    case 'CREATE_SHIPMENTS_FAILURE':
      return {
        ...state
      };
      
    case 'BATCH_CREATE_SHIPMENTS_REQUEST':
      return {
        ...state
      };

    case 'BATCH_CREATE_SHIPMENTS_SUCCESS':
      return {
        ...state,
        updatedOrders: action.res.updatedOrders,
        tabCounts: action.res.tabCounts,
        errors: action.res.errors,
        generatedFile: action.res.generatedFile
      };

    case 'BATCH_CREATE_SHIPMENTS_FAILURE':
      return {
        ...state
      };
      
    case 'BATCH_PRINT_SHIPMENTS_REQUEST':
      return {
        ...state
      };

    case 'BATCH_PRINT_SHIPMENTS_SUCCESS':
      return {
        ...state,
        errors: action.res.errors,
        generatedFile: action.res.generatedFile
      };

    case 'BATCH_PRINT_SHIPMENTS_FAILURE':
      return {
        ...state
      };
			
    default:
      return state;
  }
}

export default orders;
