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