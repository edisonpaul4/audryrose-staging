const initialState = {
  isLoadingDesigners: false,
	designers: null
};

const designers = (state = initialState, action) => {
  let designersArray = [];

  switch(action.type) {

    case 'DESIGNERS_REQUEST':
      return {
        ...state,
        isLoadingDesigners: true,
        designers: null
      }

    case 'DESIGNERS_SUCCESS':
      if (action.res.designers) {
        var completedVendorOrders = action.res.completedVendorOrders ? action.res.completedVendorOrders.slice(0).reverse() : null;
        designersArray = [];
      	action.res.designers.map((designer) => {
        	designer = designer.toJSON();
        	designer.vendorOrders = [];
          var vendorIds = [];

          // Add pending and send vendor orders to designer
        	if (designer.vendors) {
          	designer.vendors.map((vendor) => {
            	vendorIds.push(vendor.objectId);
            	if (vendor.vendorOrders) vendor.vendorOrders.map((vendorOrder) => {
                let status = vendorOrder.orderedAll && vendorOrder.receivedAll === false ? 'Sent' : 'Pending';
                if (vendorOrder.orderedAll && vendorOrder.receivedAll === true) status = 'Completed';
              	if (vendorOrder.updatedAt) designer.vendorOrders.push({status:status, order:vendorOrder, vendor:vendor});
              	return vendorOrder;
            	});
            	vendor.vendorOrders = null;
            	return vendor;
          	});
        	}

        	// Add completed vendor orders to designer
        	if (completedVendorOrders && completedVendorOrders.length > 0) {
          	var i = completedVendorOrders.length;
          	while (i--) {
            	var completedVendorOrderJSON = completedVendorOrders[i].toJSON();
            	if (vendorIds.indexOf(completedVendorOrderJSON.vendor.objectId) >= 0) {
                let status = completedVendorOrderJSON.orderedAll && completedVendorOrderJSON.receivedAll === false ? 'Sent' : 'Pending';
                if (completedVendorOrderJSON.orderedAll && completedVendorOrderJSON.receivedAll === true) status = 'Completed';
                const vendorData = {
                  abbreviation: completedVendorOrderJSON.vendor.abbreviation,
                  email: completedVendorOrderJSON.vendor.email,
                  firstName: completedVendorOrderJSON.vendor.firstName,
                  name: completedVendorOrderJSON.vendor.name,
                  objectId: completedVendorOrderJSON.vendor.objectId,
                  vendorOrderCount: completedVendorOrderJSON.vendor.vendorOrderCount
                }
          			designer.vendorOrders.push({status:status, order:completedVendorOrderJSON, vendor:vendorData});
              	completedVendorOrders.splice(i, 1);
            	}
          	}
        	}

        	designersArray.push(designer);
        	return designer;
      	});
      }
      // console.log(designersArray)

      return {
        ...state,
        timeout: action.res.timeout ? action.res.timeout : undefined,
        isLoadingDesigners: false,
        designers: designersArray,
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
      designersArray = mergeUpdatedDesigner(state.designers, action.res.updatedDesigner, action.res.completedVendorOrders);
      return {
        ...state,
        timeout: action.res.timeout ? action.res.timeout : undefined,
        designers: designersArray ? designersArray : undefined,
        updatedDesigner: action.res.updatedDesigner ? action.res.updatedDesigner : undefined
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
      console.log('completedVendorOrders', action.res.completedVendorOrders)
      designersArray = mergeUpdatedDesigner(state.designers, action.res.updatedDesigner, action.res.completedVendorOrders);
      return {
        ...state,
        timeout: action.res.timeout ? action.res.timeout : undefined,
        designers: designersArray ? designersArray : undefined,
        updatedDesigner: action.res.updatedDesigner ? action.res.updatedDesigner.toJSON() : undefined
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
      designersArray = mergeUpdatedDesigner(state.designers, action.res.updatedDesigner, action.res.completedVendorOrders);
      return {
        ...state,
        timeout: action.res.timeout ? action.res.timeout : undefined,
        designers: designersArray ? designersArray : undefined,
        updatedDesigner: action.res.updatedDesigner ? action.res.updatedDesigner.toJSON() : undefined,
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

const mergeUpdatedDesigner = function(designers, updatedDesigner, completedVendorOrders) {
  if (designers && updatedDesigner) {
    const updatedDesignerJSON = updatedDesigner.toJSON();
  	designers = designers.map(function(designer, i) {
    	if (designer.objectId === updatedDesigner.id) {
      	const vendorOrders = [];
      	if (designer.vendorOrders) designer.vendorOrders.map((vendorOrder) => {
        	let updatedVendorOrder;
        	if (updatedDesignerJSON.vendors) {
          	updatedDesignerJSON.vendors.map((vendor) => {
            	if (vendor.vendorOrders) vendor.vendorOrders.map((vendorVendorOrder) => {
              	if (vendorOrder.order.objectId === vendorVendorOrder.objectId) {
                  let status = vendorVendorOrder.orderedAll && vendorVendorOrder.receivedAll === false ? 'Sent' : 'Pending';
                  if (vendorVendorOrder.orderedAll && vendorVendorOrder.receivedAll === true) status = 'Completed';
                	if (vendorVendorOrder.updatedAt) updatedVendorOrder = {status:status, order:vendorVendorOrder, vendor:vendor};
              	}
              	return vendorOrder;
            	});
            	vendor.vendorOrders = null;
            	return vendor;
          	});
        	}
        	if (completedVendorOrders) {
          	completedVendorOrders.map((completedVendorOrder) => {
            	const completedVendorOrderJSON = completedVendorOrder.toJSON();
            	if (vendorOrder.order.objectId === completedVendorOrderJSON.objectId) {
              	if (completedVendorOrderJSON.updatedAt) updatedVendorOrder = {status:'Completed', order:completedVendorOrderJSON, vendor:vendorOrder.vendor};
            	}
            	return completedVendorOrder;
          	});
        	}
        	if (updatedVendorOrder) {
          	vendorOrders.push(updatedVendorOrder);
          	console.log('updatedVendorOrder', updatedVendorOrder)
        	} else {
          	vendorOrders.push(vendorOrder);
          	console.log('existing VendorOrder', vendorOrder)
        	}
        	return vendorOrder;
      	});
      	updatedDesignerJSON.vendorOrders = vendorOrders;
      	designer = updatedDesignerJSON;
    	}
    	return designer;
  	});
	}
	console.log(designers)

	return designers;
}

export default designers;
