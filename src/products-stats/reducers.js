const initialState = {
  isLoadingProducts: false,
  stats: [],
  errors: [],
  pictureUrl:[],
  isLoadingDesigners: false,
  designerStats : [],
};

const returns = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_PRODUCT_STATS_REQUEST':
      return {
        ...state,
        isLoadingProducts: true
      };

    case 'GET_PRODUCT_STATS_SUCCESS':
      return {
        ...state,
        isLoadingProducts: false,
        stats: action.res
      };
      case 'GET_REPAIR_IMAGES_REQUEST':
      return {
        ...state,
        isLoadingProducts: true
      };

    case 'GET_REPAIR_IMAGES_SUCCESS':
      return {
        ...state,
        isLoadingProducts: false,
        pictureUrl: action.res
      };

    case 'GET_REPAIR_IMAGES_FAILURE':
      return {
        ...state,
        isLoadingProducts: false,
        errors: [...state.errors, { type: 'CHECK_IN_RETURN_FAILURE', message: action.err.response.data.error.message }]
      };
      
      case 'GET_DESIGNER_STATS_REQUEST':
        return {
          ...state,
          isLoadingDesigners: true
        };

      case 'GET_DESIGNER_STATS_SUCCESS':
        return {
          ...state,
          isLoadingDesigners: false,
          designerStats: action.res
        };
        
    default:
      return state;
  }
}

export default returns;
