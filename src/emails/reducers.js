const initialState = {
  isLoading: false,
  orders: [],
  followUpsCustomers: []
};

const removeEmailOrderFromState = (orderId, orders) => {
  const orderIndex = orders.findIndex(order => order.orderId === orderId);
  return [
    ...orders.slice(0, orderIndex),
    ...orders.slice(orderIndex + 1)
  ];
}

const removeEmailFollowUpFromState = (customerId, customers) => {
  const orderIndex = customers.findIndex(customer => customer.customerId === customerId);
  return [
    ...customers.slice(0, orderIndex),
    ...customers.slice(orderIndex + 1)
  ];
}
const emailOrders = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_ORDERS_TO_SEND_EMAILS_REQUEST':
      return {
        ...state,
        isLoading: true
      };

    case 'GET_ORDERS_TO_SEND_EMAILS_SUCCESS':
      return {
        ...state,
        orders: action.res.emailOrders,
        isLoading: false,
      };

    case 'GET_ORDERS_TO_SEND_EMAILS_FAILURE':
      return {
        ...state,
        isLoading: false
      };

    case 'SEND_ORDER_EMAIL_REQUEST':
      return {
        ...state,
        isLoading: true
      };

    case 'SEND_ORDER_EMAIL_SUCCESS':
      return {
        ...state,
        isLoading: false,
        orders: removeEmailOrderFromState(action.res.orderId, state.orders)
      };

    case 'SEND_ORDER_EMAIL_FAILURE':
      return {
        ...state,
        isLoading: false
      };

    case 'DELETE_ORDER_EMAIL_REQUEST':
      return {
        ...state,
        isLoading: true
      };

    case 'DELETE_ORDER_EMAIL_SUCCESS':
      return {
        ...state,
        isLoading: false,
        orders: removeEmailOrderFromState(action.res.orderId, state.orders)
      };

    case 'DELETE_ORDER_EMAIL_FAILURE':
      return {
        ...state,
        isLoading: false
      };
    case 'GET_ORDERS_TO_FOLLOWUP_EMAILS_REQUEST':
      return {
        ...state,
        isLoading: true
      };

    case 'GET_ORDERS_TO_FOLLOWUP_EMAILS_SUCCESS':
      return {
        ...state,
        followUpsCustomers: action.res,
        isLoading: false,
      };

    case 'GET_ORDERS_TO_FOLLOWUP_EMAILS_FAILURE':
      return {
        ...state,
        isLoading: false
      };
    case 'DELETE_FOLLOWUP_EMAIL_REQUEST':
      return {
        ...state,
        isLoading: true
      };

    case 'DELETE_FOLLOWUP_EMAIL_SUCCESS':
      return {
        ...state,
        isLoading: false,
        followUpsCustomers: removeEmailFollowUpFromState(action.res.customerId, state.followUpsCustomers)
      };

    case 'DELETE_FOLLOWUP_EMAIL_FAILURE':
      return {
        ...state,
        isLoading: false
      };
    case 'SEND_FOLLOWUP_EMAIL_REQUEST':
      return {
        ...state,
        isLoading: true
      };

    case 'SEND_FOLLOWUP_EMAIL_SUCCESS':
      return {
        ...state,
        isLoading: false,
        followUpsCustomers: removeEmailFollowUpFromState(action.res.customerId, state.followUpsCustomers)
      };

    case 'SEND_FOLLOWUP_EMAIL_FAILURE':
      return {
        ...state,
        isLoading: false
      };
    default:
      return state;
  }
}

export default emailOrders;
