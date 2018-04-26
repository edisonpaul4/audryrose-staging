import api from '../api';

export function getOptions(token, subpage) {
  return {
    types: ['OPTIONS_REQUEST', 'OPTIONS_SUCCESS', 'OPTIONS_FAILURE'],
    promise: api.getOptions(token, subpage)
  }
}

export function saveOption(token, objectId, manualCode) {
  return {
    types: ['OPTION_SAVE_REQUEST', 'OPTION_SAVE_SUCCESS', 'OPTION_SAVE_FAILURE'],
    promise: api.saveOption(token, objectId, manualCode)
  }
}
