import { connect } from 'react-redux';
import { getOrders, reloadOrder, createShipments, batchCreateShipments, batchPrintShipments, printPickSheet, getProduct, addOrderProductToVendorOrder, createResize, saveOrder, saveOrderProduct, getOrderProductFormData, updateOrderNotes, createReturn, removeOrderFromNeedsAction, addToStoreStats } from '../actions';
import { Orders } from '../components/components';

const select = state => ({
	token: state.auth.token,
	isLoadingOrders: state.orders.isLoadingOrders,
	orders: state.orders.orders,
	updatedOrders: state.orders.updatedOrders,
	generatedFile: state.orders.generatedFile,
	newFiles: state.orders.newFiles,
	errors: state.orders.errors,
	totalPages: state.orders.totalPages,
	totalOrders: state.orders.totalOrders,
	tabCounts: state.orders.tabCounts,
	files: state.orders.files,
	error: state.error,
	product: state.orders.product,
	timeout: state.orders.timeout,
	orderProductEditFormData: state.orders.orderProductEditFormData
});

const actions = {
	getOrders,
	reloadOrder,
	addToStoreStats,
	createShipments,
	batchCreateShipments,
	batchPrintShipments,
	printPickSheet,
	getProduct,
	addOrderProductToVendorOrder,
	createResize,
	saveOrder,
	removeOrderFromNeedsAction,
	saveOrderProduct,
	getOrderProductFormData,
	updateOrderNotes,
	createReturn
};

export default connect(select, actions)(Orders);
