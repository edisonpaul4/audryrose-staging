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

export function saveProductVendor(token, productId, vendorId) {
  return {
    types: ['PRODUCT_VENDOR_REQUEST', 'PRODUCT_VENDOR_SUCCESS', 'PRODUCT_VENDOR_FAILURE'],
    promise: api.saveProductVendor(token, productId, vendorId)
  }
}

export function saveVariants(token, variants) {
  return {
    types: ['VARIANTS_SAVE_REQUEST', 'VARIANTS_SAVE_SUCCESS', 'VARIANTS_SAVE_FAILURE'],
    promise: api.saveVariants(token, variants)
  }
}

export function addToVendorOrder(token, orders) {
  return {
    types: ['ADD_TO_VENDOR_ORDER_REQUEST', 'ADD_TO_VENDOR_ORDER_SUCCESS', 'ADD_TO_VENDOR_ORDER_FAILURE'],
    promise: api.addToVendorOrder(token, orders)
  }
}