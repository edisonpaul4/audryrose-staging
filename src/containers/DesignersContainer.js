import { connect } from 'react-redux';
import { getDesigners, saveVendor, saveVendorOrder, sendVendorOrder } from '../actions/designers';
import Designers from '../components/Designers';

const select = state => ({
  token: state.auth.token,
	isLoadingDesigners: state.designers.isLoadingDesigners,
	designers: state.designers.designers,
	products: state.designers.products,
	updatedDesigner: state.designers.updatedDesigner,
	successMessage: state.designers.successMessage,
	totalPages: state.designers.totalPages,
	error: state.error,
	errors: state.designers.errors
});

const actions = {
  getDesigners,
  saveVendor,
  saveVendorOrder,
  sendVendorOrder
};

export default connect(select, actions)(Designers);
