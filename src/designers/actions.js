import api from '../api';

export function getDesigners(token, subpage, page, search) {
    return {
        types: ['DESIGNERS_REQUEST', 'DESIGNERS_SUCCESS', 'DESIGNERS_FAILURE'],
        promise: api.getDesigners(token, subpage, page, search).then(r => r.data.result)
    }
}

export function saveVendor(token, data) {
    return {
        types: ['VENDOR_SAVE_REQUEST', 'VENDOR_SAVE_SUCCESS', 'VENDOR_SAVE_FAILURE'],
        promise: api.saveVendor(token, data)
    }
}

export function saveVendorOrder(token, data) {
    return {
        types: ['VENDOR_ORDER_SAVE_REQUEST', 'VENDOR_ORDER_SAVE_SUCCESS', 'VENDOR_ORDER_SAVE_FAILURE'],
        promise: api.saveVendorOrder(token, data)
    }
}

export function sendVendorOrder(token, data) {
    return {
        types: ['VENDOR_ORDER_SEND_REQUEST', 'VENDOR_ORDER_SEND_SUCCESS', 'VENDOR_ORDER_SEND_FAILURE'],
        promise: api.sendVendorOrder(token, data)
    }
}

export function getDesignerProducts(token, designerId) {
    return {
        types: ['GET_DESIGNER_PRODUCTS_REQUEST', 'GET_DESIGNER_PRODUCTS_SUCCESS', 'GET_DESIGNER_PRODUCTS_FAILURE'],
        promise: api.getDesignerProducts(token, designerId)
    }
}

export function addDesignerProductToVendorOrder(token, orders, designerId) {
    return {
        types: ['ADD_DESIGNER_PRODUCT_TO_VENDOR_ORDER_REQUEST', 'ADD_DESIGNER_PRODUCT_TO_VENDOR_ORDER_SUCCESS', 'ADD_DESIGNER_PRODUCT_TO_VENDOR_ORDER_FAILURE'],
        promise: api.addDesignerProductToVendorOrder(token, orders, designerId)
    }
}

export function completeVendorOrder(token, vendorOrderNumber) {
    return {
        types: ['COMPLETE_VENDOR_ORDER_REQUEST', 'COMPLETE_VENDOR_ORDER_SUCCESS', 'COMPLETE_VENDOR_ORDER_FAILURE'],
        promise: api.completeVendorOrder(token, vendorOrderNumber)
    }
}

export function deleteProductFromVendorOrder(token, productObjectId, vendorOrderNumber, objectId) {
    return {
        types: ['DELETE_PRODUCT_VENDOR_ORDER_REQUEST', 'DELETE_PRODUCT_VENDOR_ORDER_SUCCESS', 'DELETE_PRODUCT_VENDOR_ORDER_FAILURE'],
        promise: api.deleteProductFromVendorOrder(token, productObjectId, vendorOrderNumber).then(r => ({ ...r, objectId })),
    }
}

export function getAllPendingVendorOrders(page, sort, direction, ordersToSkip, token) {
    return {
        types: ['VENDORORDERS::GET_VENDOR_ORDERS_REQUEST', 'VENDORORDERS::GET_VENDOR_ORDERS_SUCCESS', 'VENDORORDERS::GET_VENDOR_ORDERS_FAILURE'],
        promise: api.getAllPendingVendorOrders(page, sort, direction, ordersToSkip, token).then(r => r.data.result)
    }
}

export function finishPendingVendorOrderProduct(vendorOrderObjectId, vendorOrderVariantObjectId, token) {
    return {
        types: ['VENDORORDERS::REMOVE_PENDING_PRODUCT_REQUEST', 'VENDORORDERS::REMOVE_PENDING_PRODUCT_SUCCESS', 'VENDORORDERS::REMOVE_PENDING_PRODUCT_FAILURE'],
        promise: api.finishPendingVendorOrderProduct(vendorOrderObjectId, vendorOrderVariantObjectId, token).then(r => r.data.result)
    }
}

export function updateVendorOrderProduct(token, options) {
    return {
        types: ['DESIGNERS_REQUEST', 'DESIGNERS_SUCCESS', 'DESIGNERS_FAILURE'],
        promise: api.updateVendorOrderProduct(token, options).then(r => r.data.result)
    };
}

export function confirmVendorOrderEmail(options) {
    return {
        types: ['CONFIRM_PRODUCT_VENDOR_ORDER_EMAIL_REQUEST', 'CONFIRM_PRODUCT_VENDOR_ORDER_EMAIL_SUCCESS', 'CONFIRM_PRODUCT_VENDOR_ORDER_EMAIL_FAIL'],
        promise: api.confirmVendorOrderEmail(options).then(r => r)
    };
}
