import { connect } from 'react-redux';
import { getOrders, reloadOrder, createShipments, batchCreateShipments } from '../actions/orders';
import Orders from '../components/Orders';

const select = state => ({
  token: state.auth.token,
	isLoadingOrders: state.orders.isLoadingOrders,
	orders: state.orders.orders,
	updatedOrders: state.orders.updatedOrders,
	errors: state.orders.errors,
	totalPages: state.orders.totalPages,
	totalOrders: state.orders.totalOrders,
	tabCounts: state.orders.tabCounts,
	error: state.error
});

const actions = {
  getOrders,
  reloadOrder,
  createShipments,
  batchCreateShipments
};

export default connect(select, actions)(Orders);
