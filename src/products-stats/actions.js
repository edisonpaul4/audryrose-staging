import api from '../api';

export function getProductStats(token) {
  return {
    types: ['GET_PRODUCT_STATS_REQUEST', 'GET_PRODUCT_STATS_SUCCESS', 'GET_PRODUCT_STATS_FAILURE'],
    promise: api.getProductStats(token)
      .then(r => r.data.result)
  }
}

export function getProductStatsInStore(date_from, date_to, token) {
  return {
    types: ['GET_PRODUCT_STATS_IN_STORE_REQUEST', 'GET_PRODUCT_STATS_IN_STORE_SUCCESS', 'GET_PRODUCT_STATS_IN_STORE_FAILURE'],
    promise: api.getProductStatsInStore(token, date_from, date_to)
      .then(r => r.data.result)
  }
}

export function getPicturesRepairsByProduct(productId, token) {
  return {
    types: ['GET_REPAIR_IMAGES_REQUEST', 'GET_REPAIR_IMAGES_SUCCESS', 'GET_REPAIR_IMAGES_FAILURE'],
    promise: api.getPicturesRepairsByProduct(productId, token)
      .then(r => r.data.result)
  }
}

export function getDesignerStats (token) {
  return {
    types: ['GET_DESIGNER_STATS_REQUEST', 'GET_DESIGNER_STATS_SUCCESS', 'GET_DESIGNER_STATS_FAILURE'],
    promise: api.getDesignerStats(token)
      .then(r => r.data.result)
  }
}

export function getProductStatsByDesigner (designerId, date_from, date_to, token) {
  return {
    types: ['GET_PRODUCTS_BY_DESIGNER_STATS_REQUEST', 'GET_PRODUCTS_BY_DESIGNER_STATS_SUCCESS', 'GET_PRODUCTS_BY_DESIGNER_STATS_FAILURE'],
    promise: api.getProductStatsByDesigner(token, designerId, date_from, date_to)
      .then(r => r.data.result)
  }
}

export function getDesigners (token) {
  return {
    types: ['GET_DESIGNERS_REQUEST', 'GET_DESIGNERS_SUCCESS', 'GET_DESIGNERS_FAILURE'],
    promise: api.getDesignersName(token)
      .then(r => r.data.result)
  }
}
