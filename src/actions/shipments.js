import api from '../api';

export function getShipments(token, page) {
  return {
    types: ['SHIPMENTS_REQUEST', 'SHIPMENTS_SUCCESS', 'SHIPMENTS_FAILURE'],
    promise: api.getShipments(token, page)
  }
}
