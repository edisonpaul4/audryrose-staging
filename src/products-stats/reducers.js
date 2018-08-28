const initialState = {
  isLoadingProducts: false,
  stats: [],
  errors: [],
  pictureUrl:[],
  isLoadingDesigners: false,
  designerStats : [],
  productsStatsByDesigner: [],
  isLoadingProductsStatsByDesigner : false,
  isLoadingDesignersName: false,
  designers: [],
  statsInStore: [],
  isLoadingProductsInStore: false
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
      
      case 'GET_PRODUCT_STATS_IN_STORE_REQUEST':
        return {
          ...state,
          isLoadingProductsInStore: true
        };

      case 'GET_PRODUCT_STATS_IN_STORE_SUCCESS':
        return {
          ...state,
          isLoadingProductsInStore: false,
          statsInStore: action.res
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
        
      case 'GET_PRODUCTS_BY_DESIGNER_STATS_REQUEST':
        return {
          ...state,
          isLoadingProductsStatsByDesigner: true
        };

      case 'GET_PRODUCTS_BY_DESIGNER_STATS_SUCCESS':
        return {
          ...state,
          isLoadingProductsStatsByDesigner: false,
          productsStatsByDesigner: action.res
        };
        
        case 'GET_DESIGNERS_REQUEST':
          return {
            ...state,
            isLoadingDesignersName: true
          };

        case 'GET_DESIGNERS_SUCCESS':
          return {
            ...state,
            isLoadingDesignersName: false,
            designers: action.res
          };
        
    default:
      return state;
  }
}

export default returns;
