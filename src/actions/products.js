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

export function saveProduct(token, data) {
  return {
    types: ['PRODUCT_SAVE_REQUEST', 'PRODUCT_SAVE_SUCCESS', 'PRODUCT_SAVE_FAILURE'],
    promise: api.saveProduct(token, data)
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

export function createResize(token, resizes) {
  return {
    types: ['CREATE_PRODUCT_RESIZE_REQUEST', 'CREATE_PRODUCT_RESIZE_SUCCESS', 'CREATE_PRODUCT_RESIZE_FAILURE'],
    promise: api.createResize(token, resizes)
  }
}

export function saveResize(token, data) {
  return {
    types: ['SAVE_PRODUCT_RESIZE_REQUEST', 'SAVE_PRODUCT_RESIZE_SUCCESS', 'SAVE_PRODUCT_RESIZE_FAILURE'],
    promise: api.saveResize(token, data)
  }
}

export function getBundleFormData(token, productId) {
  return {
    types: ['GET_BUNDLE_FORM_REQUEST', 'GET_BUNDLE_FORM_SUCCESS', 'GET_BUNDLE_FORM_FAILURE'],
    promise: api.getBundleFormData(token, productId)
  }
}

export function productBundleSave(token, data) {
  return {
    types: ['BUNDLE_SAVE_REQUEST', 'BUNDLE_SAVE_SUCCESS', 'BUNDLE_SAVE_FAILURE'],
    promise: api.productBundleSave(token, data)
  }
}