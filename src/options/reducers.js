const initialState = {
  isLoadingOptions: false,
	options: null
};

const options = (state = initialState, action) => {
  switch(action.type) {

    case 'OPTIONS_REQUEST':
      return {
        ...state,
        isLoadingOptions: true
      }

    case 'OPTIONS_SUCCESS':
      return {
        ...state,
        isLoadingOptions: false,
        options: action.res.options
      };

    case 'OPTIONS_FAILURE':
      return {
        ...state,
        isLoadingOptions: false
      }
      
    case 'OPTION_SAVE_REQUEST':
      return {
        ...state
      }

    case 'OPTION_SAVE_SUCCESS':
      return {
        ...state,
        updatedOption: action.res
      };

    case 'OPTION_SAVE_FAILURE':
      return {
        ...state
      }
			
    default:
      return state;
  }
}

export default options;
