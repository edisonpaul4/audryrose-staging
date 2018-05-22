import api from '../api';

export function getOrdersToSendEmails(offset, token) {
  return {
    types: ['GET_ORDERS_TO_SEND_EMAILS_REQUEST', 'GET_ORDERS_TO_SEND_EMAILS_SUCCESS', 'GET_ORDERS_TO_SEND_EMAILS_FAILURE'],
    promise: api.getOrdersToSendEmails(offset, token).then(r => r.data.result)
  }
}

export function sendOrderEmail(objectId, emailParams, token) {
  return {
    types: ['SEND_ORDER_EMAIL_REQUEST', 'SEND_ORDER_EMAIL_SUCCESS', 'SEND_ORDER_EMAIL_FAILURE'],
    promise: api.sendOrderEmail(objectId, emailParams, token).then(r => r.data.result)
  }
}

export function deleteOrderEmail(orderId, token) {
  return {
    types: ['DELETE_ORDER_EMAIL_REQUEST', 'DELETE_ORDER_EMAIL_SUCCESS', 'DELETE_ORDER_EMAIL_FAILURE'],
    promise: api.deleteOrderEmail(orderId, token).then(r => r.data.result)
  }
}