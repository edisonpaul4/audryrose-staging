import { connect } from 'react-redux';
import { getDesigners } from '../actions/designers';
import Designers from '../components/Designers';

const select = state => ({
  token: state.auth.token,
	isLoadingDesigners: state.orders.isLoadingDesigners,
	designers: state.designers.designers,
	totalPages: state.designers.totalPages,
	error: state.error
});

const actions = {
  getDesigners
};

export default connect(select, actions)(Designers);
