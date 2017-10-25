const initialState = {
  isLoadingDesigners: false,
	designers: null
};

const mergeUpdatedDesigner = function(designers, updatedDesigner, completedVendorOrders) {
  if(!updatedDesigner)
    return designers;

  const designerIndex = designers.findIndex(designer => designer.objectId === updatedDesigner.id);
  const updatedDesignerJSON = updatedDesigner.hasOwnProperty('toJSON') ? updatedDesigner.toJSON() : updatedDesigner;
  
  const formatUpdatedDesigner = designer => {
    const vendorOrders = [];
    if (designer.vendorOrders) designer.vendorOrders.map((vendorOrder) => {
      let updatedVendorOrder;
      if (updatedDesignerJSON.vendors) {
        updatedDesignerJSON.vendors.map((vendor) => {
          if (vendor.vendorOrders) vendor.vendorOrders.map((vendorVendorOrder) => {
            if (vendorOrder.order.objectId === vendorVendorOrder.objectId) {
              let status = vendorVendorOrder.orderedAll && vendorVendorOrder.receivedAll === false ? 'Sent' : 'Pending';
              if (vendorVendorOrder.orderedAll && vendorVendorOrder.receivedAll === true) status = 'Completed';
              if (vendorVendorOrder.updatedAt) updatedVendorOrder = { status: status, order: vendorVendorOrder, vendor: vendor };
            }
            return vendorOrder;
          });
          vendor.vendorOrders = null;
          return vendor;
        });
      }
      if (completedVendorOrders) {
        completedVendorOrders.forEach((completedVendorOrder) => {
          const completedVendorOrderJSON = completedVendorOrder.toJSON();
          if (vendorOrder.order.objectId === completedVendorOrderJSON.objectId)
            if (completedVendorOrderJSON.updatedAt) 
              updatedVendorOrder = { status: 'Completed', order: completedVendorOrderJSON, vendor: vendorOrder.vendor };
          return completedVendorOrder;
        });
      }
      if (updatedVendorOrder) {
        vendorOrders.push(updatedVendorOrder);
      } else {
        vendorOrders.push(vendorOrder);
      }
      return vendorOrder;
    });
    updatedDesignerJSON.vendorOrders = vendorOrders;
    return updatedDesignerJSON;
  }

  return {
    ...designers.slice(0, designerIndex),
    ...formatUpdatedDesigner(designers[designerIndex]),
    ...designers.slice(designerIndex + 1)
  }
}

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
      	designersArray = action.res.designers.map((designer) => {
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
            	var completedVendorOrder = completedVendorOrders[i];
            	if (vendorIds.indexOf(completedVendorOrder.vendor.objectId) >= 0) {
                let status = completedVendorOrder.orderedAll && completedVendorOrder.receivedAll === false ? 'Sent' : 'Pending';
                if (completedVendorOrder.orderedAll && completedVendorOrder.receivedAll === true) status = 'Completed';
                const vendorData = {
                  abbreviation: completedVendorOrder.vendor.abbreviation,
                  email: completedVendorOrder.vendor.email,
                  firstName: completedVendorOrder.vendor.firstName,
                  name: completedVendorOrder.vendor.name,
                  objectId: completedVendorOrder.vendor.objectId,
                  vendorOrderCount: completedVendorOrder.vendor.vendorOrderCount
                }
          			designer.vendorOrders.push({status:status, order:completedVendorOrder, vendor:vendorData});
              	completedVendorOrders.splice(i, 1);
            	}
          	}
        	}

        	return designer;
      	});
      }

      return {
        ...state,
        timeout: action.res.timeout ? action.res.timeout : undefined,
        isLoadingDesigners: false,
        designers: designersArray,
        updateProducts: null,
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
        updatedDesigner: action.res.updatedDesigner ? action.res.updatedDesigner.toJSON() : undefined
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

    case 'GET_DESIGNER_PRODUCTS_REQUEST':
      return {
        ...state,
        designerOrderFormIsLoading: true
      }

    case 'GET_DESIGNER_PRODUCTS_SUCCESS':
      if (action.res.timeout) return { ...state, timeout: action.res.timeout };
      return {
        ...state,
        designerOrderFormIsLoading: false,
        designerOrderData: action.res
      };

    case 'GET_DESIGNER_PRODUCTS_FAILURE':
      return {
        ...state,
        designerOrderFormIsLoading: false
      }

    case 'ADD_DESIGNER_PRODUCT_TO_VENDOR_ORDER_REQUEST':
      return {
        ...state
      }

    case 'ADD_DESIGNER_PRODUCT_TO_VENDOR_ORDER_SUCCESS':
      designersArray = mergeUpdatedDesigner(state.designers, action.res.updatedDesigner);
      return {
        ...state,
        timeout: action.res.timeout ? action.res.timeout : undefined,
        designers: designersArray ? designersArray : undefined,
        updatedDesigner: action.res.updatedDesigner ? action.res.updatedDesigner.toJSON() : undefined
      };

    case 'ADD_DESIGNER_PRODUCT_TO_VENDOR_ORDER_FAILURE':
      return {
        ...state
      }
    
    case 'COMPLETE_VENDOR_ORDER_SUCCESS':
      var designerIndex = state.designers.findIndex(d => d.designerId === action.res.updatedDesigner.designerId);
      var designer = state.designers[designerIndex];
      var vendorOrderIndex = designer.vendorOrders.findIndex(vo => vo.order.vendorOrderNumber === action.res.vendorOrder.vendorOrderNumber);
      designer.hasSentVendorOrder = action.res.updatedDesigner.hasSentVendorOrder;
      designer.vendorOrders[vendorOrderIndex].status = "Completed";
      return {
        ...state,
        designers: [
          ...state.designers.slice(0, designerIndex),
          designer,
          ...state.designers.slice(designerIndex + 1)
        ]
      };
    
    case 'DELETE_PRODUCT_VENDOR_ORDER_SUCCESS':
      var designerIndex = state.designers.findIndex(d => d.objectId === action.res.objectId);
      var designer = state.designers[designerIndex];
      var vendorOrderIndex = designer.vendorOrders.findIndex(vo => vo.order.vendorOrderNumber === action.res.vendorOrder.vendorOrderNumber);
      designer.vendorOrders[vendorOrderIndex].order.vendorOrderVariants = designer.vendorOrders[vendorOrderIndex].order.vendorOrderVariants
        .filter(vov => vov.objectId !== action.res.vendorOrderVariant.objectId);
      return {
        ...state,
        designers: [
          ...state.designers.slice(0, designerIndex),
          designer,
          ...state.designers.slice(designerIndex + 1)
        ]
      }

    default:
      return state;
  }
}

export default designers;
