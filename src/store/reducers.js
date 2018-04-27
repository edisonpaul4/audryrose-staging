import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux'
import { orders } from '../orders/reducers';
import products from '../products/reducers';
import designers from '../designers/reducers';
import options from '../options/reducers';
import shipments from '../shipments/reducers';
import webhooks from '../webhooks/reducers';
import emailOrders from '../emails/reducers';
import shipmentRates from '../shared/reducers/shipmentRates';
import vendorOrders from '../shared/reducers/vendorOrders';
import error from '../shared/reducers/error';
import returns from '../repairs-resizes/reducers';
import productStats from '../products-stats/reducers';
import auth from '../auth/reducers';
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
