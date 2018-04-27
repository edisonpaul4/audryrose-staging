const initialState = {
  requestingForRates: false,
  rates: []
};

const shipmentRates = (state = initialState, action) => {
  switch (action.type) {

    case 'SHIPMENTRATES::GET_RATES_REQUEST':
      return {
        ...state,
        requestingForRates: true
      }

    case 'SHIPMENTRATES::GET_RATES_SUCCESS':
      return {
        ...state,
        rates: action.res.rates,
        requestingForRates: false
      }

    case 'SHIPMENTRATES::GET_RATES_FAILURE':
      return {
        ...state,
        requestingForRates: false
      }

    default:
      return state;
  }
}

export default shipmentRates;