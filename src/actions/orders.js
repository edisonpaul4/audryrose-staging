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