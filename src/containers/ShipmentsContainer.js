import { connect } from 'react-redux';
import { getShipments } from '../actions/shipments';
import Shipments from '../components/Shipments';

const select = state => ({
  token: state.auth.token,
	isLoadingShipments: state.shipments.isLoadingShipments,
	shipments: state.shipments.shipments,
	totalPages: state.shipments.totalPages,
	error: state.error,
	timeout: state.shipments.timeout
});

const actions = {
  getShipments
};

export default connect(select, actions)(Shipments);
