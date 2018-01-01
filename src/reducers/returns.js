const initialState = {
  isLoadingReturns: false,
  returns: []
};

const returns = (state = initialState, action) => {
  switch (action.type) {
    
    case 'GET_RETURNS_REQUEST':
      return {
        ...state,
        isLoadingReturns: true
      }
    
    case 'GET_RETURNS_SUCCESS':
      return {
        ...state,
        isLoadingReturns: false,
        returns: action.res
      }
    
    case 'GET_RETURNS_FAILURE':
      return {
        ...state,
        isLoadingReturns: false
      }
    default:
      return state;
  }
}

export default returns;
