const initialState = {
  isLoadingShipments: false,
	shipments: null
};

const shipments = (state = initialState, action) => {
  switch(action.type) {

    case 'SHIPMENTS_REQUEST':
      return {
        ...state,
        isLoadingShipments: true
      }

    case 'SHIPMENTS_SUCCESS':
      return {
        ...state,
        isLoadingShipments: false,
        shipments: action.res.shipments,
        totalPages: action.res.totalPages
      };

    case 'SHIPMENTS_FAILURE':
      return {
        ...state,
        isLoadingShipments: false
      }
			
    default:
      return state;
  }
}

export default shipments;
