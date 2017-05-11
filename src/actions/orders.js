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