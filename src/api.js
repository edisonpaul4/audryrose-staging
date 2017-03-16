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

export const saveProductStatus = (token, productId, status) => Parse.Cloud.run('saveProductStatus', 
  {
    sessionToken: token,
    productId,
    status
  }
);

export const saveVariants = (token, variants) => Parse.Cloud.run('saveVariants', 
  {
    sessionToken: token,
    variants
  }
);

export const getDesigners = (token, page) => Parse.Cloud.run('getDesigners', 
  {
    sessionToken: token,
    page
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

export default {
  signup,
  login,
	logout,
	loadSession,
	getOrders,
	reloadOrder,
	createShipments,
	getProducts,
	getProductFilters,
	reloadProduct,
	saveProductStatus,
	saveVariants,
	getDesigners,
	getOptions,
	saveOption,
	getShipments
}
