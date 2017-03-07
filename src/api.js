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

export const saveVariant = (token, objectId, inventory, colorCode) => Parse.Cloud.run('saveVariant', 
  {
    sessionToken: token,
    objectId,
    inventory,
    colorCode
  }
);

export const getDesigners = (token, page) => Parse.Cloud.run('getDesigners', 
  {
    sessionToken: token,
    page
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
	getProducts,
	getProductFilters,
	reloadProduct,
	saveProductStatus,
	saveVariant,
	getDesigners,
	getShipments
}
