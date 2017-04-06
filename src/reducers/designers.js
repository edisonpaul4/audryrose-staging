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
      
    case 'DESIGNER_SAVE_REQUEST':
      return {
        ...state
      }

    case 'DESIGNER_SAVE_SUCCESS':
      return {
        ...state,
        updatedDesigner: action.res
      };

    case 'DESIGNER_SAVE_FAILURE':
      return {
        ...state
      }
			
    default:
      return state;
  }
}

export default designers;
