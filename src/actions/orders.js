import api from '../api';

export function getOrders(token, page) {
	console.log('action getOrders');
  return {
    types: ['ORDERS_REQUEST', 'ORDERS_SUCCESS', 'ORDERS_FAILURE'],
    promise: api.getOrders(token, page)
  }
}
