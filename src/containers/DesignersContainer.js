import { connect } from 'react-redux';
import { getDesigners, saveDesigner } from '../actions/designers';
import Designers from '../components/Designers';

const select = state => ({
  token: state.auth.token,
	isLoadingDesigners: state.designers.isLoadingDesigners,
	designers: state.designers.designers,
	updatedDesigner: state.designers.updatedDesigner,
	totalPages: state.designers.totalPages,
	error: state.error
});

const actions = {
  getDesigners,
  saveDesigner
};

export default connect(select, actions)(Designers);
