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
        products: action.res.products,
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
      
    case 'VENDOR_ORDER_SAVE_REQUEST':
      return {
        ...state
      }

    case 'VENDOR_ORDER_SAVE_SUCCESS':
      return {
        ...state,
        updatedDesigner: action.res
      };

    case 'VENDOR_ORDER_SAVE_FAILURE':
      return {
        ...state
      }
      
    case 'VENDOR_ORDER_SEND_REQUEST':
      return {
        ...state
      }

    case 'VENDOR_ORDER_SEND_SUCCESS':
      return {
        ...state,
        updatedDesigner: action.res.updatedDesigner,
        successMessage: action.res.successMessage
      };

    case 'VENDOR_ORDER_SEND_FAILURE':
      return {
        ...state
      }
			
    default:
      return state;
  }
}

export default designers;
