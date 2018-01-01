import api from '../api';

export function getReturns(token) {
  return {
    types: ['GET_RETURNS_REQUEST', 'GET_RETURNS_SUCCESS', 'GET_RETURNS_FAILURE'],
    promise: api.getReturns(token)
      .then(r => r.data.result)
  }
}

export function checkInReturn(returnId, token) {
  return {
    types: ['CHECK_IN_RETURN_REQUEST', 'CHECK_IN_RETURN_SUCCESS', 'CHECK_IN_RETURN_FAILURE'],
    promise: api.checkInReturn(returnId, token)
      .then(r => r.data.result)
  }
}