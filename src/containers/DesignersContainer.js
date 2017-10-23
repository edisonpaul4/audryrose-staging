import { connect } from 'react-redux';
import { getDesigners, saveVendor, saveVendorOrder, sendVendorOrder, getDesignerProducts, addDesignerProductToVendorOrder, completeVendorOrder } from '../actions/designers';
import Designers from '../components/Designers';

const select = state => ({
  token: state.auth.token,
	isLoadingDesigners: state.designers.isLoadingDesigners,
	designers: state.designers.designers,
	products: state.designers.products,
	updatedDesigner: state.designers.updatedDesigner,
  designerOrderFormIsLoading: state.designers.designerOrderFormIsLoading,
  designerOrderData: state.designers.designerOrderData,
	successMessage: state.designers.successMessage,
	totalPages: state.designers.totalPages,
	error: state.error,
	errors: state.designers.errors,
	timeout: state.designers.timeout
});

const actions = {
  getDesigners,
  saveVendor,
  saveVendorOrder,
  sendVendorOrder,
	getDesignerProducts,
	addDesignerProductToVendorOrder,
	completeVendorOrder
};

export default connect(select, actions)(Designers);
