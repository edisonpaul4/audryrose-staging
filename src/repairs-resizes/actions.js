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
export function deleteReturnEmail(returnId, token) {
  return {
    types: ['DELETE_RETURN_EMAIL_REQUEST', 'DELETE_RETURN_EMAIL_SUCCESS', 'DELETE_RETURN_EMAIL_FAILURE'],
    promise: api.deleteReturnEmail(returnId, token)
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

export function deleteRepairResize(returnId, token) {
  return {
    types: ['DELETE_RETURN_REQUEST', 'DELETE_RETURN_SUCCESS', 'DELETE_RETURN_FAILURE'],
    promise: api.deleteReturnResize(returnId, token)
      .then(r => r.data.result)
  }
}

export function updateResizeSize(returnId, newSize, token) {
  return {
    types: ['EDIT_RESIZE_SIZE_REQUEST', 'EDIT_RESIZE_SIZE_SUCCESS', 'EDIT_RESIZE_SIZE_FAILURE'],
    promise: api.updateResizeSize(returnId, newSize, token)
      .then(r => r.data.result)
  }
}

export function uploadRepairImage(returnId, file, token) {
  return {
    types: ['UPLOAD_REPAIR_IMAGE_REQUEST', 'UPLOAD_REPAIR_IMAGE_SUCCESS', 'UPLOAD_REPAIR_IMAGE_FAILURE'],
    promise: api.uploadRepairImage(returnId, file, token)
      .then(r => r.data.result)
  }
}

