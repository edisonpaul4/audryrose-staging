const initialState = '';

export default function error(state = initialState, action) {

  if(action.type === 'RESET_ERROR') {
    return initialState;
  }

  if(action.type.includes('_FAILURE')) {
    console.error('ERROR: ', action)
    return action.err.response.data.error || '';
  }

  return state;
}
