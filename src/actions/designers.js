import api from '../api';

export function getDesigners(token, subpage, page, search) {
  return {
    types: ['DESIGNERS_REQUEST', 'DESIGNERS_SUCCESS', 'DESIGNERS_FAILURE'],
    promise: api.getDesigners(token, subpage, page, search)
  }
}

export function saveVendor(token, data) {
  return {
    types: ['VENDOR_SAVE_REQUEST', 'VENDOR_SAVE_SUCCESS', 'VENDOR_SAVE_FAILURE'],
    promise: api.saveVendor(token, data)
  }
}

export function saveVendorOrder(token, data) {
  return {
    types: ['VENDOR_ORDER_SAVE_REQUEST', 'VENDOR_ORDER_SAVE_SUCCESS', 'VENDOR_ORDER_SAVE_FAILURE'],
    promise: api.saveVendorOrder(token, data)
  }
}

export function sendVendorOrder(token, data) {
  return {
    types: ['VENDOR_ORDER_SEND_REQUEST', 'VENDOR_ORDER_SEND_SUCCESS', 'VENDOR_ORDER_SEND_FAILURE'],
    promise: api.sendVendorOrder(token, data)
  }
}
