import { connect } from 'react-redux';
import { getOrders, reloadOrder } from '../actions/orders';
import Orders from '../components/Orders';

const select = state => ({
  token: state.auth.token,
	isLoadingOrders: state.orders.isLoadingOrders,
	orders: state.orders.orders,
	updatedOrder: state.orders.updatedOrder,
	totalPages: state.orders.totalPages,
	totalOrders: state.orders.totalOrders,
	tabCounts: state.orders.tabCounts,
	error: state.error
});

const actions = {
  getOrders,
  reloadOrder
};

export default connect(select, actions)(Orders);
