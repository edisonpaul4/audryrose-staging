const initialState = {
  isLoadingDesigners: false,
	designers: null
};

const orders = (state = initialState, action) => {
  switch(action.type) {

    case 'DESIGNERS_REQUEST':
      return {
        ...state,
        isLoadingDesigners: true
      }

    case 'DESIGNERS_SUCCESS':
      return {
        ...state,
        isLoadingDesigners: false,
        designers: action.res.designers,
        totalPages: action.res.totalPages
      };

    case 'DESIGNERS_FAILURE':
      return {
        ...state,
        isLoadingDesigners: false
      }
			
    default:
      return state;
  }
}

export default orders;
