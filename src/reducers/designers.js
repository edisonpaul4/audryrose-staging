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
      let designers = [];
      if (action.res.designers) {
      	designers = action.res.designers.map((designer) => {
        	return designer.toJSON();
      	});
      	if (action.res.completedVendorOrders && action.res.completedVendorOrders.length > 0) {
        	action.res.completedVendorOrders.map((completedVendorOrder) => {
          	var completedVendorOrderJSON = completedVendorOrder.toJSON();
          	designers.map((designer) => {
            	if (designer.vendors) {
              	designer.vendors.map((vendor) => {
                	if (!vendor.completedVendorOrders) vendor.completedVendorOrders = [];
                	if (vendor.objectId === completedVendorOrderJSON.vendor.objectId) vendor.completedVendorOrders.push(completedVendorOrderJSON);
                	return vendor;
              	});
            	}
            	return designer;
          	});
          	return completedVendorOrder;
        	});
      	}
      }
      return {
        ...state,
        timeout: action.res.timeout ? action.res.timeout : undefined,
        isLoadingDesigners: false,
        designers: designers,
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
      if (state.designers && action.res) {
      	designers = state.designers.map(function(designer, i) {
        	if (designer.objectId === action.res.id) {
          	console.log('updated designer loaded ' + designer.objectId);
          	designer = action.res.toJSON();
        	}
        	return designer;
      	});
    	}
      return {
        ...state,
        timeout: action.res.timeout ? action.res.timeout : undefined,
        designers: designers ? designers : undefined,
        updatedDesigner: action.res ? action.res : undefined
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
      if (state.designers && action.res) {
      	designers = state.designers.map(function(designer, i) {
        	if (designer.objectId === action.res.id) {
          	console.log('updated designer loaded ' + designer.objectId);
          	designer = action.res.toJSON();
        	}
        	return designer;
      	});
    	}
      return {
        ...state,
        timeout: action.res.timeout ? action.res.timeout : undefined,
        designers: designers ? designers : undefined,
        updatedDesigner: action.res ? action.res : undefined
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
      if (state.designers && action.res.updatedDesigner) {
      	designers = state.designers.map(function(designer, i) {
        	if (designer.objectId === action.res.updatedDesigner.id) {
          	console.log('updated designer loaded ' + designer.objectId);
          	designer = action.res.updatedDesigner.toJSON();
        	}
        	return designer;
      	});
    	}
      return {
        ...state,
        timeout: action.res.timeout ? action.res.timeout : undefined,
        designers: designers ? designers : undefined,
        updatedDesigner: action.res.updatedDesigner ? action.res.updatedDesigner : undefined,
        successMessage: action.res.successMessage ? action.res.successMessage : undefined,
        errors: action.res.errors ? action.res.errors : undefined
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
