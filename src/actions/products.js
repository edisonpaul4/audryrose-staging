import api from '../api';

export function getProducts(token, subpage, page, sort, search, filters) {
  return {
    types: ['PRODUCTS_REQUEST', 'PRODUCTS_SUCCESS', 'PRODUCTS_FAILURE'],
    promise: api.getProducts(token, subpage, page, sort, search, filters)
  }
}

export function getProductFilters(token) {
  return {
    types: ['PRODUCT_FILTERS_REQUEST', 'PRODUCT_FILTERS_SUCCESS', 'PRODUCT_FILTERS_FAILURE'],
    promise: api.getProductFilters(token)
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

export function saveVariant(token, objectId, inventory) {
  return {
    types: ['VARIANT_SAVE_REQUEST', 'VARIANT_SAVE_SUCCESS', 'VARIANT_SAVE_FAILURE'],
    promise: api.saveVariant(token, objectId, inventory)
  }
}