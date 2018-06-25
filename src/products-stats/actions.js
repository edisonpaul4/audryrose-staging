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