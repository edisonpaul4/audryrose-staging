const initialState = {
  isLoadingDesigners: false,
  designers: null,
  totalVendorOrdersOutstadingInDollars: 0,
  outStandingUnitsByDesigner : null
};

const mergeUpdatedDesigner = function (designers, updatedDesigner, completedVendorOrders) {
  if (designers && updatedDesigner) {
    const updatedDesignerJSON = typeof updatedDesigner.toJSON !== 'undefined' ? updatedDesigner.toJSON() : updatedDesigner;
    designers = designers.map(function (designer, i) {
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
                  if (vendorVendorOrder.updatedAt) updatedVendorOrder = { status: status, order: vendorVendorOrder, vendor: vendor };
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
                if (completedVendorOrderJSON.updatedAt) updatedVendorOrder = { status: 'Completed', order: completedVendorOrderJSON, vendor: vendorOrder.vendor };
              }
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
        designer = updatedDesignerJSON;
      }
      return designer;
    });
  }

  return designers;
}

const designers = (state = initialState, action) => {
  let designersArray = [];

  switch (action.type) {
    case 'RESET_STORAGE':
      return initialState;

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
          // designer = designer.toJSON();
          const getOutStandingAmountInDollars = function(vendorOrderNumber, vendorOrdersOutStandingAmount) {
            let index = vendorOrdersOutStandingAmount.map(vendorOrder => vendorOrder.vendorOrderNumber).indexOf(vendorOrderNumber);
            return index == -1 ? 0 : vendorOrdersOutStandingAmount[index].outStandingAmountInDollars;
          }
          const getOutStandingData = function (designerId, outStandingUnitsByDesigner) {
            let index = outStandingUnitsByDesigner.map(designer => designer.designerId).indexOf(designerId);
            return index == -1 ? null : outStandingUnitsByDesigner[index];
          }
          
          designer.vendorOrders = [];
          var vendorIds = [];

          // Add pending and send vendor orders to designer
          if (designer.vendors) {
            designer.vendors.map((vendor) => {
              vendorIds.push(vendor.objectId);
              if (vendor.vendorOrders) vendor.vendorOrders.map((vendorOrder) => {
                let status = vendorOrder.orderedAll && vendorOrder.receivedAll === false ? 'Sent' : 'Pending';
                if (vendorOrder.orderedAll && vendorOrder.receivedAll === true) status = 'Completed';
                if (vendorOrder.updatedAt) designer.vendorOrders.push({ status: status, order: vendorOrder, vendor: vendor });
                if (action.res.vendorOrdersOutStandingAmount && action.res.vendorOrdersOutStandingAmount.length > 0) {
                  vendorOrder.outStandingAmountInDollars = getOutStandingAmountInDollars(vendorOrder.vendorOrderNumber, action.res.vendorOrdersOutStandingAmount);
                }
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
              var completedVendorOrderJSON = completedVendorOrders[i];
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
                designer.vendorOrders.push({ status: status, order: completedVendorOrderJSON, vendor: vendorData });
                completedVendorOrders.splice(i, 1);
              }
            }
          }
          
          let outStandingData = getOutStandingData(designer.designerId, action.res.outStandingUnitsByDesigner);
          if (outStandingData) {
            designer.totalOutStandingAmountInDollars = outStandingData.totalAmountOutStanding,
            designer.variantsOutStanding = outStandingData.variantsOutStanding;
          }
          
          designersArray.push(designer);
          //return designer;
        });
      }
      
      return {
        ...state,
        timeout: action.res.timeout ? action.res.timeout : undefined,
        isLoadingDesigners: false,
        designers: designersArray,
        updateProducts: null,
        totalPages: action.res.totalPages,
        totalVendorOrdersOutstadingInDollars: action.res.totalVendorOrdersOutstadingInDollars,
        outStandingUnitsByDesigner : action.res.outStandingUnitsByDesigner
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
      // this is an example of a bad designed resux store, the need of go deep into an object for just one change
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
      };
    case 'CONFIRM_PRODUCT_VENDOR_ORDER_EMAIL_REQUEST':

      return {
        ...state,
      }
    case 'CONFIRM_PRODUCT_VENDOR_ORDER_EMAIL_FAILURE':

      return {
        ...state,
        emailConfirmed: false
      }
    case 'CONFIRM_PRODUCT_VENDOR_ORDER_EMAIL_SUCCESS':

      return {
        ...state,
        emailConfirmed: true
      }
    default:
      return state;
  }
}

export default designers;
