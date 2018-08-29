import api from '../api';

export function getOrders(token, subpage, page, sort, search) {
  return {
    types: ['ORDERS_REQUEST', 'ORDERS_SUCCESS', 'ORDERS_FAILURE'],
    promise: api.getOrders(token, subpage, page, sort, search)
  }
}

export function reloadOrder(token, orderId) {
  return {
    types: ['ORDER_RELOAD_REQUEST', 'ORDER_RELOAD_SUCCESS', 'ORDER_RELOAD_FAILURE'],
    promise: api.reloadOrder(token, orderId)
  }
}

export function createShipments(token, shipmentGroups) {
  return {
    types: ['CREATE_SHIPMENTS_REQUEST', 'CREATE_SHIPMENTS_SUCCESS', 'CREATE_SHIPMENTS_FAILURE'],
    promise: api.createShipments(token, shipmentGroups)
  }
}

export function batchCreateShipments(token, ordersToShip) {
  return {
    types: ['BATCH_CREATE_SHIPMENTS_REQUEST', 'BATCH_CREATE_SHIPMENTS_SUCCESS', 'BATCH_CREATE_SHIPMENTS_FAILURE'],
    promise: api.batchCreateShipments(token, ordersToShip)
  }
}

export function batchPrintShipments(token, ordersToPrint) {
  return {
    types: ['BATCH_PRINT_SHIPMENTS_REQUEST', 'BATCH_PRINT_SHIPMENTS_SUCCESS', 'BATCH_PRINT_SHIPMENTS_FAILURE'],
    promise: api.batchPrintShipments(token, ordersToPrint)
  }
}

export function printPickSheet(token, ordersToPrint) {
  return {
    types: ['PRINT_PICK_SHEET_REQUEST', 'PRINT_PICK_SHEET_SUCCESS', 'PRINT_PICK_SHEET_FAILURE'],
    promise: api.printPickSheet(token, ordersToPrint)
  }
}

export function getProduct(token, productId) {
  return {
    types: ['GET_PRODUCT_REQUEST', 'GET_PRODUCT_SUCCESS', 'GET_PRODUCT_FAILURE'],
    promise: api.getProduct(token, productId)
  }
}

export function addOrderProductToVendorOrder(token, orders, orderId) {
  return {
    types: ['ADD_ORDER_PRODUCT_TO_VENDOR_ORDER_REQUEST', 'ADD_ORDER_PRODUCT_TO_VENDOR_ORDER_SUCCESS', 'ADD_ORDER_PRODUCT_TO_VENDOR_ORDER_FAILURE'],
    promise: api.addOrderProductToVendorOrder(token, orders, orderId)
  }
}

export function createResize(token, resizes, orderId) {
  return {
    types: ['CREATE_ORDER_RESIZE_REQUEST', 'CREATE_ORDER_RESIZE_SUCCESS', 'CREATE_ORDER_RESIZE_FAILURE'],
    promise: api.createResize(token, resizes, orderId)
  }
}

export function saveOrder(token, data) {
  return {
    types: ['ORDER_SAVE_REQUEST', 'ORDER_SAVE_SUCCESS', 'ORDER_SAVE_FAILURE'],
    promise: api.saveOrder(token, data)
  }
}

export function removeOrderFromNeedsAction(token, data) {
  return {
    types: ['ORDER_REMOVE_REQUEST', 'ORDER_REMOVE_SUCCESS', 'ORDER_REMOVE_FAILURE'],
    promise: api.saveOrder(token, data)
  }
}

export function saveOrderProduct(token, data) {
  return {
    types: ['ORDER_PRODUCT_SAVE_REQUEST', 'ORDER_PRODUCT_SAVE_SUCCESS', 'ORDER_PRODUCT_SAVE_FAILURE'],
    promise: api.saveOrderProduct(token, data)
  }
}

export function getOrderProductFormData(token, orderProductId) {
  return {
    types: ['GET_ORDER_PRODUCT_FORM_REQUEST', 'GET_ORDER_PRODUCT_FORM_SUCCESS', 'GET_ORDER_PRODUCT_FORM_FAILURE'],
    promise: api.getOrderProductFormData(token, orderProductId)
  }
}

export function updateOrderNotes(token, orderId, orderNotes) {
  return {
    types: ['UPDATE_ORDER_NOTES_REQUEST', 'UPDATE_ORDER_NOTES_SUCCESS', 'UPDATE_ORDER_NOTES_FAILURE'],
    promise: api.updateOrderNotes(token, orderId, orderNotes).then(r => r.data.result)
  }
}

export function getRatesForShipment(parcelParams, orderId, token) {
  return {
    types: ['SHIPMENTRATES::GET_RATES_REQUEST', 'SHIPMENTRATES::GET_RATES_SUCCESS', 'SHIPMENTRATES::GET_RATES_FAILURE'],
    promise: api.getRatesForShipment(parcelParams, orderId, token).then(r => r.data.result)
  }
}

export function createReturn(returnTypeId, products, token) {
  return {
    types: ['ORDERS::CREATE_RETURN_REQUEST', 'ORDERS::CREATE_RETURN_SUCCESS', 'ORDERS::CREATE_RETURN_FAILURE'],
    promise: api.createReturn(returnTypeId, products, token).then(r => r.data.result)
  }
}

export function addToStoreStats (token, variantObjectId, quantity) {
  return {
    types: ['ADD_TO_STORE_STATS_REQUEST', 'ADD_TO_STORE_STATS_SUCCESS', 'ADD_TO_STORE_STATS_FAILURE'],
    promise: api.addToStoreStats(token, variantObjectId, quantity)
  }
}