import api from '../api';

export function getWebhooks(token) {
  return {
    types: ['WEBHOOKS_REQUEST', 'WEBHOOKS_SUCCESS', 'WEBHOOKS_FAILURE'],
    promise: api.getWebhooks(token)
  }
}

export function saveWebhook(token, endpoint, destination) {
  return {
    types: ['WEBHOOK_SAVE_REQUEST', 'WEBHOOK_SAVE_SUCCESS', 'WEBHOOK_SAVE_FAILURE'],
    promise: api.saveWebhook(token, endpoint, destination)
  }
}