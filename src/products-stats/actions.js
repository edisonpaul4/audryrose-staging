import api from '../api';

export function getProductStats(token) {
  return {
    types: ['GET_PRODUCT_STATS_REQUEST', 'GET_PRODUCT_STATS_SUCCESS', 'GET_PRODUCT_STATS_FAILURE'],
    promise: api.getProductStats(token)
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

export function getProductStatsByDesigner (designerId, token) {
  return {
    types: ['GET_PRODUCTS_BY_DESIGNER_STATS_REQUEST', 'GET_PRODUCTS_BY_DESIGNER_STATS_SUCCESS', 'GET_PRODUCTS_BY_DESIGNER_STATS_FAILURE'],
    promise: api.getProductStatsByDesigner(token, designerId)
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
