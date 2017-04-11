import api from '../api';

export function getDesigners(token, subpage, page) {
  return {
    types: ['DESIGNERS_REQUEST', 'DESIGNERS_SUCCESS', 'DESIGNERS_FAILURE'],
    promise: api.getDesigners(token, subpage, page)
  }
}

export function saveVendor(token, data) {
  return {
    types: ['VENDOR_SAVE_REQUEST', 'VENDOR_SAVE_SUCCESS', 'VENDOR_SAVE_FAILURE'],
    promise: api.saveVendor(token, data)
  }
}
