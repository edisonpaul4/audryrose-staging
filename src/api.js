import config from './config';
import { Parse } from 'parse';

const BASE_URL = process.env.REACT_APP_SERVER_URL;
Parse.initialize(config.parseAppId);
Parse.serverURL = BASE_URL;

export const signup = (username, password) => Parse.User.signUp( username, password );

export const login = (username, password) => Parse.User.logIn( username, password );

export const logout = (token) => Parse.User.logOut( token );

export const loadSession = (token) => Parse.User.become( token );

export const getOrders = (token, subpage, page, sort, search) => Parse.Cloud.run('getOrders', 
  {
    sessionToken: token,
    subpage,
    page,
    sort,
    search
  }
);

export const reloadOrder = (token, orderId) => Parse.Cloud.run('reloadOrder', 
  {
    sessionToken: token,
    orderId
  }
);

export const createShipments = (token, shipmentGroups) => Parse.Cloud.run('createShipments', 
  {
    sessionToken: token,
    shipmentGroups
  }
);

export const batchCreateShipments = (token, ordersToShip) => Parse.Cloud.run('batchCreateShipments', 
  {
    sessionToken: token,
    ordersToShip
  }
);

export const batchPrintShipments = (token, ordersToPrint) => Parse.Cloud.run('batchPrintShipments', 
  {
    sessionToken: token,
    ordersToPrint
  }
);

export const getProduct = (token, productId) => Parse.Cloud.run('getProduct', 
  {
    sessionToken: token,
    productId
  }
);

export const addOrderProductToVendorOrder = (token, orders, orderId) => Parse.Cloud.run('addOrderProductToVendorOrder', 
  {
    sessionToken: token,
    orders, 
    orderId
  }
);

export const createResize = (token, resizes, orderId) => Parse.Cloud.run('createResize', 
  {
    sessionToken: token,
    resizes, 
    orderId
  }
);

export const saveOrder = (token, data) => Parse.Cloud.run('saveOrder', 
  {
    sessionToken: token,
    data
  }
);

export const saveOrderProduct = (token, data) => Parse.Cloud.run('saveOrderProduct', 
  {
    sessionToken: token,
    data
  }
);

export const getOrderProductFormData = (token, orderProductId) => Parse.Cloud.run('getOrderProductFormData', 
  {
    sessionToken: token,
    orderProductId
  }
);

export const saveResize = (token, data) => Parse.Cloud.run('saveResize', 
  {
    sessionToken: token,
    data
  }
);

export const getProducts = (token, subpage, page, sort, search, filters) => Parse.Cloud.run('getProducts', 
  {
    sessionToken: token,
    subpage,
    page,
    sort,
    search,
    filters
  }
);

export const getProductFilters = (token) => Parse.Cloud.run('getProductFilters', 
  {
    sessionToken: token
  }
);

export const reloadProduct = (token, productId) => Parse.Cloud.run('reloadProduct', 
  {
    sessionToken: token,
    productId
  }
);

export const saveProduct = (token, data) => Parse.Cloud.run('saveProduct', 
  {
    sessionToken: token,
    data
  }
);

export const saveVariants = (token, variants) => Parse.Cloud.run('saveVariants', 
  {
    sessionToken: token,
    variants
  }
);

export const addToVendorOrder = (token, orders) => Parse.Cloud.run('addToVendorOrder', 
  {
    sessionToken: token,
    orders
  }
);

export const getBundleFormData = (token, productId) => Parse.Cloud.run('getBundleFormData', 
  {
    sessionToken: token,
    productId
  }
);

export const productBundleSave = (token, data) => Parse.Cloud.run('productBundleSave', 
  {
    sessionToken: token,
    data
  }
);

export const getDesigners = (token, subpage, page, search) => Parse.Cloud.run('getDesigners', 
  {
    sessionToken: token,
    subpage, 
    page,
    search
  }
);

export const saveVendor = (token, data) => Parse.Cloud.run('saveVendor', 
  {
    sessionToken: token,
    data
  }
);

export const saveVendorOrder = (token, data) => Parse.Cloud.run('saveVendorOrder', 
  {
    sessionToken: token,
    data
  }
);

export const sendVendorOrder = (token, data) => Parse.Cloud.run('sendVendorOrder', 
  {
    sessionToken: token,
    data
  }
);

export const getOptions = (token, subpage) => Parse.Cloud.run('getOptions', 
  {
    sessionToken: token,
    subpage
  }
);

export const saveOption = (token, objectId, manualCode) => Parse.Cloud.run('saveOption', 
  {
    sessionToken: token,
    objectId,
    manualCode
  }
);

export const getShipments = (token, page) => Parse.Cloud.run('getShipments', 
  {
    sessionToken: token,
    page
  }
);

export const getWebhooks = (token) => Parse.Cloud.run('getWebhooks', 
  {
    sessionToken: token
  }
);

export const createWebhook = (token, endpoint, destination) => Parse.Cloud.run('createWebhook', 
  {
    sessionToken: token, 
    endpoint: endpoint, 
    destination: destination
  }
);

export const deleteWebhook = (token, id) => Parse.Cloud.run('deleteWebhook', 
  {
    sessionToken: token, 
    id: id
  }
);

export default {
  signup,
  login,
	logout,
	loadSession,
	getOrders,
	reloadOrder,
	createShipments,
	batchCreateShipments,
	batchPrintShipments,
	getProduct,
	addOrderProductToVendorOrder,
	createResize,
	saveOrder,
	saveOrderProduct,
	getOrderProductFormData,
	saveResize,
	getProducts,
	getProductFilters,
	reloadProduct,
	saveProduct,
	saveVariants,
	addToVendorOrder,
	getBundleFormData,
	productBundleSave,
	getDesigners,
	saveVendor,
	saveVendorOrder,
	sendVendorOrder,
	getOptions,
	saveOption,
	getShipments,
	getWebhooks,
	createWebhook,
	deleteWebhook
}
