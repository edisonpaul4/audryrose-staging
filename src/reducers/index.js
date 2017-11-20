import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux'

import auth from './auth';
import orders from './orders';
import products from './products';
import designers from './designers';
import options from './options';
import shipments from './shipments';
import webhooks from './webhooks';
import emailOrders from './emailOrders';
import shipmentRates from './shipmentRates';
import error from './error';

const rootReducer = combineReducers({
  auth,
	orders,
	products,
	designers,
	options,
	shipments,
	webhooks,
	emailOrders,
	shipmentRates,
  error,
  routing: routerReducer
});

export default rootReducer;
