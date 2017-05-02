import { connect } from 'react-redux';
import { getOrders, reloadOrder, createShipments, batchCreateShipments, batchPrintShipments, getProduct, addOrderProductToVendorOrder } from '../actions/orders';
import Orders from '../components/Orders';

const select = state => ({
  token: state.auth.token,
	isLoadingOrders: state.orders.isLoadingOrders,
	orders: state.orders.orders,
	updatedOrders: state.orders.updatedOrders,
	generatedFile: state.orders.generatedFile,
	errors: state.orders.errors,
	totalPages: state.orders.totalPages,
	totalOrders: state.orders.totalOrders,
	tabCounts: state.orders.tabCounts,
	files: state.orders.files,
	error: state.error,
	product: state.orders.product
});

const actions = {
  getOrders,
  reloadOrder,
  createShipments,
  batchCreateShipments,
  batchPrintShipments,
  getProduct,
  addOrderProductToVendorOrder
};

export default connect(select, actions)(Orders);
