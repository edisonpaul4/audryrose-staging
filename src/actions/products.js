import api from '../api';

export function getProducts(token, page, sort, search) {
  return {
    types: ['PRODUCTS_REQUEST', 'PRODUCTS_SUCCESS', 'PRODUCTS_FAILURE'],
    promise: api.getProducts(token, page, sort, search)
  }
}

export function reloadProduct(token, productId) {
  return {
    types: ['PRODUCT_RELOAD_REQUEST', 'PRODUCT_RELOAD_SUCCESS', 'PRODUCT_RELOAD_FAILURE'],
    promise: api.reloadProduct(token, productId)
  }
}

export function saveProductStatus(token, productId, status) {
  return {
    types: ['PRODUCT_STATUS_REQUEST', 'PRODUCT_STATUS_SUCCESS', 'PRODUCT_STATUS_FAILURE'],
    promise: api.saveProductStatus(token, productId, status)
  }
}
