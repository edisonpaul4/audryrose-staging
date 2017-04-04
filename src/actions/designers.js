import api from '../api';

export function getDesigners(token, subpage, page) {
  return {
    types: ['DESIGNERS_REQUEST', 'DESIGNERS_SUCCESS', 'DESIGNERS_FAILURE'],
    promise: api.getDesigners(token, subpage, page)
  }
}
