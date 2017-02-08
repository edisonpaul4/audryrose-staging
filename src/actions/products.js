import api from '../api';

export function getProducts(token, page) {
  return {
    types: ['PRODUCTS_REQUEST', 'PRODUCTS_SUCCESS', 'PRODUCTS_FAILURE'],
    promise: api.getProducts(token, page)
  }
}
