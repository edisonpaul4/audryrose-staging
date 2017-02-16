import api from '../api';

export function getProducts(token, page) {
  return {
    types: ['PRODUCTS_REQUEST', 'PRODUCTS_SUCCESS', 'PRODUCTS_FAILURE'],
    promise: api.getProducts(token, page)
  }
}

export function reloadProduct(token, productId) {
  return {
    types: ['PRODUCT_RELOAD_REQUEST', 'PRODUCT_RELOAD_SUCCESS', 'PRODUCT_RELOAD_FAILURE'],
    promise: api.reloadProduct(token, productId)
  }
}
