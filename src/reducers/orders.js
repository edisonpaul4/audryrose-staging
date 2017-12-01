const initialState = {
  isLoadingOrders: false,
  orders: [],
  updatedOrders: []
};

const orders = (state = initialState, action) => {
  var ordersData;
  switch(action.type) {

    case 'ORDERS_REQUEST':
      return {
        ...state,
        isLoadingOrders: true
      };

    case 'ORDERS_SUCCESS':
      if (action.res.timeout) return { ...state, timeout: action.res.timeout };
      ordersData = [];
      if (action.res.orders) {
      	ordersData = action.res.orders.map(function(order, i) {
        	return order.toJSON();
      	});
      }
      return {
        ...state,
        isLoadingOrders: false,
        orders: ordersData,
        totalPages: action.res.totalPages,
        totalOrders: action.res.totalOrders,
        tabCounts: action.res.tabCounts,
        files: action.res.files
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
      if (action.res.timeout) return { ...state, timeout: action.res.timeout };
      return {
        ...state,
        updatedOrders: [
          ...state.updatedOrders,
          ...action.res.updatedOrders
        ],
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
      if (action.res.timeout) return { ...state, timeout: action.res.timeout };
      return {
        ...state,
        updatedOrders: [
          ...state.updatedOrders,
          ...action.res.updatedOrders
        ],
        errors: action.res.errors,
        generatedFile: action.res.generatedFile,
        newFiles: action.res.newFiles
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
      if (action.res.timeout) return { ...state, timeout: action.res.timeout };
      return {
        ...state,
        updatedOrders: [
          ...state.updatedOrders,
          ...action.res.updatedOrders
        ],
        tabCounts: action.res.tabCounts,
        errors: action.res.errors,
        generatedFile: action.res.generatedFile,
        newFiles: action.res.newFiles
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
      if (action.res.timeout) return { ...state, timeout: action.res.timeout };
      return {
        ...state,
        errors: action.res.errors,
        generatedFile: action.res.generatedFile,
        newFiles: action.res.newFiles
      };

    case 'BATCH_PRINT_SHIPMENTS_FAILURE':
      return {
        ...state
      };

    case 'PRINT_PICK_SHEET_REQUEST':
      return {
        ...state
      };

    case 'PRINT_PICK_SHEET_SUCCESS':
      if (action.res.timeout) return { ...state, timeout: action.res.timeout };
      return {
        ...state,
        errors: action.res.errors,
        generatedFile: action.res.generatedFile,
        newFiles: action.res.newFiles
      };

    case 'PRINT_PICK_SHEET_FAILURE':
      return {
        ...state
      };

    case 'GET_PRODUCT_REQUEST':
      return {
        ...state
      };

    case 'GET_PRODUCT_SUCCESS':
      if (action.res.timeout) return { ...state, timeout: action.res.timeout };
      return {
        ...state,
        product: action.res.product
      };

    case 'GET_PRODUCT_FAILURE':
      return {
        ...state
      };

    case 'ADD_ORDER_PRODUCT_TO_VENDOR_ORDER_REQUEST':
      return {
        ...state
      }

    case 'ADD_ORDER_PRODUCT_TO_VENDOR_ORDER_SUCCESS':
      if (action.res.timeout) return { ...state, timeout: action.res.timeout };
      return {
        ...state,
        updatedOrders: [
          ...state.updatedOrders,
          ...action.res.updatedOrders
        ],
        tabCounts: action.res.tabCounts
      };

    case 'ADD_ORDER_PRODUCT_TO_VENDOR_ORDER_FAILURE':
      return {
        ...state
      }

    case 'CREATE_ORDER_RESIZE_REQUEST':
      return {
        ...state
      }

    case 'CREATE_ORDER_RESIZE_SUCCESS':
      if (action.res.timeout) return { ...state, timeout: action.res.timeout };
      return {
        ...state,
        updatedOrders: [
          ...state.updatedOrders,
          ...action.res.updatedOrders
        ],
        tabCounts: action.res.tabCounts,
        errors: action.res.errors
      };

    case 'CREATE_ORDER_RESIZE_FAILURE':
      return {
        ...state
      }

    case 'ORDER_SAVE_REQUEST':
      return {
        ...state
      }

    case 'ORDER_SAVE_SUCCESS':
      if (action.res.timeout) return { ...state, timeout: action.res.timeout };
      return {
        ...state,
        updatedOrders: [
          ...state.updatedOrders,
          ...action.res.updatedOrders
        ]
      };

    case 'ORDER_SAVE_FAILURE':
      return {
        ...state
      }

    case 'ORDER_PRODUCT_SAVE_REQUEST':
      return {
        ...state
      }

    case 'ORDER_PRODUCT_SAVE_SUCCESS':
      if (action.res.timeout) return { ...state, timeout: action.res.timeout };
      return {
        ...state,
        updatedOrders: [
          ...state.updatedOrders,
          ...action.res.updatedOrders
        ]
      };

    case 'ORDER_PRODUCT_SAVE_FAILURE':
      return {
        ...state
      }

    case 'GET_ORDER_PRODUCT_FORM_REQUEST':
      return {
        ...state
      }

    case 'GET_ORDER_PRODUCT_FORM_SUCCESS':
      if (action.res.timeout) return { ...state, timeout: action.res.timeout };
      return {
        ...state,
        orderProductEditFormData: action.res
      };

    case 'GET_ORDER_PRODUCT_FORM_FAILURE':
      return {
        ...state
      }

    case 'UPDATE_ORDER_NOTES_REQUEST':
      return {
        ...state,
        isLoadingOrders: true
      };

    case 'UPDATE_ORDER_NOTES_SUCCESS':
      var orderIndex = state.orders.findIndex(o => o.orderId === action.res.order.orderId);
      var newOrder = {
        ...state.orders[orderIndex],
        internalNotes: action.res.order.internalNotes,
        designerNotes: action.res.order.designerNotes,
      };
      
      return {
        ...state,
        orders: [
          ...state.orders.slice(0, orderIndex),
          newOrder,
          ...state.orders.slice(orderIndex + 1)
        ],
        isLoadingOrders: false
      };

    case 'UPDATE_ORDER_NOTES_FAILURE':
      return {
        ...state,
        isLoadingOrders: false
      };

    default:
      return state;
  }
}

export default orders;
