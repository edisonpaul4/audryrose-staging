import { connect } from 'react-redux';
import { getOrders } from '../actions/orders';
import Orders from '../components/Orders';

const select = state => ({
  token: state.auth.token,
	isLoadingOrders: state.orders.isLoadingOrders,
	orders: state.orders.orders,
	error: state.error
});

const actions = {
  getOrders
};

export default connect(select, actions)(Orders);
