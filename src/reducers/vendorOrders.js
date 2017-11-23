const initialState = {
  requestingForVendorOrders: false,
  vendorOrders: []
};

const vendorOrders = (state = initialState, action) => {
  switch (action.type) {

    case 'VENDORORDERS::GET_VENDOR_ORDERS_REQUEST':
      return {
        ...state,
        requestingForVendorOrders: true
      }

    case 'VENDORORDERS::GET_VENDOR_ORDERS_SUCCESS':
      return {
        ...state,
        vendorOrders: action.res.vendorOrders,
        requestingForVendorOrders: false
      }

    case 'VENDORORDERS::GET_VENDOR_ORDERS_FAILURE':
      return {
        ...state,
        requestingForVendorOrders: false
      }

    default:
      return state;
  }
}

export default vendorOrders;