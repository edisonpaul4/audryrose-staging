import api from '../api';

export function getOrders(token, subpage, page, sort, search) {
  return {
    types: ['ORDERS_REQUEST', 'ORDERS_SUCCESS', 'ORDERS_FAILURE'],
    promise: api.getOrders(token, subpage, page, sort, search)
  }
}
