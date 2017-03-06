import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux'

import auth from './auth';
import orders from './orders';
import products from './products';
import designers from './designers';
import shipments from './shipments';
import error from './error';

const rootReducer = combineReducers({
  auth,
	orders,
	products,
	designers,
	shipments,
  error,
  routing: routerReducer
});

export default rootReducer;
