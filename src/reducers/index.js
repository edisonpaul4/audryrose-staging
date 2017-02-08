import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux'

import auth from './auth';
import orders from './orders';
import error from './error';

const rootReducer = combineReducers({
  auth,
	orders,
  error,
  routing: routerReducer
});

export default rootReducer;
