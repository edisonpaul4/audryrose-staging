const initialState = {
  isLoadingDesigners: false,
	designers: null
};

const designers = (state = initialState, action) => {
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
      
    case 'VENDOR_SAVE_REQUEST':
      return {
        ...state
      }

    case 'VENDOR_SAVE_SUCCESS':
      return {
        ...state,
        updatedDesigner: action.res
      };

    case 'VENDOR_SAVE_FAILURE':
      return {
        ...state
      }
			
    default:
      return state;
  }
}

export default designers;
