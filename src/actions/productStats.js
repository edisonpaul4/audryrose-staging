import api from '../api';

export function getProductStats(token) {
  return {
    types: ['GET_PRODUCT_STATS_REQUEST', 'GET_PRODUCT_STATS_SUCCESS', 'GET_PRODUCT_STATS_FAILURE'],
    promise: api.getProductStats(token)
      .then(r => r.data.result)
  }
}
