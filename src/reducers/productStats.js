const initialState = {
  isLoadingProducts: false,
  stats: [],
  errors: []
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

    default:
      return state;
  }
}

export default returns;
