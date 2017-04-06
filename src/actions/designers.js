import api from '../api';

export function getDesigners(token, subpage, page) {
  return {
    types: ['DESIGNERS_REQUEST', 'DESIGNERS_SUCCESS', 'DESIGNERS_FAILURE'],
    promise: api.getDesigners(token, subpage, page)
  }
}

export function saveDesigner(token, objectId, email) {
  return {
    types: ['DESIGNER_SAVE_REQUEST', 'DESIGNER_SAVE_SUCCESS', 'DESIGNER_SAVE_FAILURE'],
    promise: api.saveDesigner(token, objectId, email)
  }
}
