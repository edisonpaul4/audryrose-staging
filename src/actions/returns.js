import api from '../api';

export function getReturns(token) {
  return {
    types: ['GET_RETURNS_REQUEST', 'GET_RETURNS_SUCCESS', 'GET_RETURNS_FAILURE'],
    promise: api.getReturns(token)
      .then(r => r.data.result)
  }
}

export function getReturnsForEmails(token) {
  return {
    types: ['GET_RETURNS_TO_EMAIL_REQUEST', 'GET_RETURNS_TO_EMAIL_SUCCESS', 'GET_RETURNS_TO_EMAIL_FAILURE'],
    promise: api.getReturnsForEmails(token)
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

export function updateReturnStatus(returnId, returnStatusId, token) {
  return {
    types: ['UPDATE_RETURN_STATUS_REQUEST', 'UPDATE_RETURN_STATUS_SUCCESS', 'UPDATE_RETURN_STATUS_FAILURE'],
    promise: api.updateReturnStatus(returnId, returnStatusId, token)
      .then(r => r.data.result)
  }
}

export function sendReturnEmail(returnId, emailData, token) {
  return {
    types: ['SEND_RETURN_EMAIL_REQUEST', 'SEND_RETURN_EMAIL_SUCCESS', 'SEND_RETURN_EMAIL_FAILURE'],
    promise: api.sendReturnEmail(returnId, emailData, token)
      .then(r => r.data.result)
  }
}
