import api from '../api';

export function getReturns(token) {
  return {
    types: ['GET_RETURNS_REQUEST', 'GET_RETURNS_SUCCESS', 'GET_RETURNS_FAILURE'],
    promise: api.getReturns(token).then(r => r.data.result)
  }
}