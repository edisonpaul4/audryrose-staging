const initialState = {
    requestingForVendorOrders: false,
    vendorOrders: []
};

const vendorOrderIndex = (condition, vendorOrders) => {

}

const vendorOrders = (state = initialState, action) => {
    let vendorOrderIndex = 0;
    switch (action.type) {

        case 'VENDORORDERS::GET_VENDOR_ORDERS_REQUEST':
            return {
                ...state,
                requestingForVendorOrders: true
            };

        case 'VENDORORDERS::GET_VENDOR_ORDERS_SUCCESS':
            return {
                ...state,
                vendorOrders: action.res.vendorOrders,
                requestingForVendorOrders: false
            };

        case 'VENDORORDERS::GET_VENDOR_ORDERS_FAILURE':
            return {
                ...state,
                requestingForVendorOrders: false
            };

        case 'VENDORORDERS::REMOVE_PENDING_PRODUCT_REQUEST':
            return {
                ...state,
                requestingForVendorOrders: true
            };

        case 'VENDORORDERS::REMOVE_PENDING_PRODUCT_SUCCESS':
            vendorOrderIndex = state.vendorOrders.findIndex(vo => action.res.vendorOrderVariantObjectId === vo.vendorOrderVariantObjectId);
            return {
                ...state,
                requestingForVendorOrders: false,
                vendorOrders: [
                    ...state.vendorOrders.slice(0, vendorOrderIndex),
                    ...state.vendorOrders.slice(vendorOrderIndex + 1)
                ]
            };
            
        default:
            return state;
    }
}

export default vendorOrders;