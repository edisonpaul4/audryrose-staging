import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux'

import auth from '../auth/reducers';
import orders from '../orders/reducers';
import products from './products';
import designers from './designers';
import options from './options';
import shipments from './shipments';
import webhooks from './webhooks';
import emailOrders from './emailOrders';
import shipmentRates from './shipmentRates';
import vendorOrders from './vendorOrders';
import error from './error';
import returns from './returns';
import productStats from './productStats';

const rootReducer = combineReducers({
    orders,
    products,
    designers,
    options,
    shipments,
    webhooks,
    emailOrders,
    shipmentRates,
    vendorOrders,
    error,
    returns,
    productStats,
    auth,
    routing: routerReducer
});

export default rootReducer;
