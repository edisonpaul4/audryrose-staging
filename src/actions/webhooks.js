import api from '../api';

export function getWebhooks(token) {
  return {
    types: ['WEBHOOKS_REQUEST', 'WEBHOOKS_SUCCESS', 'WEBHOOKS_FAILURE'],
    promise: api.getWebhooks(token)
  }
}

export function createWebhook(token, endpoint, destination) {
  return {
    types: ['CREATE_WEBHOOK_REQUEST', 'CREATE_WEBHOOK_SUCCESS', 'CREATE_WEBHOOK_FAILURE'],
    promise: api.createWebhook(token, endpoint, destination)
  }
}

export function deleteWebhook(token, id) {
  return {
    types: ['DELETE_WEBHOOK_REQUEST', 'DELETE_WEBHOOK_SUCCESS', 'DELETE_WEBHOOK_FAILURE'],
    promise: api.deleteWebhook(token, id)
  }
}