const initialState = {
  isLoadingReturns: false,
  returns: [],
  errors: []
};

const returns = (state = initialState, action) => {
  switch (action.type) {
    
    case 'GET_RETURNS_REQUEST':
      return {
        ...state,
        isLoadingReturns: true
      };
    
    case 'GET_RETURNS_SUCCESS':
      return {
        ...state,
        isLoadingReturns: false,
        returns: action.res
      };
    
    case 'GET_RETURNS_FAILURE':
      return {
        ...state,
        isLoadingReturns: false
      };

    case 'CHECK_IN_RETURN_REQUEST':
      return {
        ...state,
        isLoadingReturns: true
      };
    
    case 'CHECK_IN_RETURN_SUCCESS':
      return {
        ...state,
        isLoadingReturns: false,
        returns: updateReturnObject(action.res, state.returns)
      };
    
    case 'CHECK_IN_RETURN_FAILURE':
      return {
        ...state,
        isLoadingReturns: false,
        errors: [...state.errors, { type: 'CHECK_IN_RETURN_FAILURE', message: action.err.response.data.error.message }]
      };

    case 'UPDATE_RETURN_STATUS_REQUEST':
      return {
        ...state,
        isLoadingReturns: true
      };

    case 'UPDATE_RETURN_STATUS_SUCCESS':
      return {
        ...state,
        isLoadingReturns: false,
        returns: updateReturnObject(action.res, state.returns)
      };

    case 'UPDATE_RETURN_STATUS_FAILURE':
      return {
        ...state,
        isLoadingReturns: false,
        errors: [...state.errors, { type: 'CHECK_IN_RETURN_FAILURE', message: action.err.response.data.error.message }]
      };
    
      
    default:
      return state;
  }
}

const updateReturnObject = (updatedReturn, returnsState) => {
  const index = returnsState.findIndex(returnObject => returnObject.id === updatedReturn.id);
  return [
    ...returnsState.slice(0, index),
    updatedReturn,
    ...returnsState.slice(index + 1)
  ];
};

export default returns;
