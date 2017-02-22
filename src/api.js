import config from './config';
import { Parse } from 'parse';

const BASE_URL = process.env.REACT_APP_SERVER_URL;
Parse.initialize(config.parseAppId);
Parse.serverURL = BASE_URL;

// export const signup = (username, password) => Parse.User.signUp( username, password );

export const login = (username, password) => Parse.User.logIn( username, password );

export const logout = (token) => Parse.User.logOut( token );

export const loadSession = (token) => Parse.User.become( token );

export const getOrders = (token, page) => Parse.Cloud.run('getOrders', 
  {
    sessionToken: token,
    page
  }
);

export const getProducts = (token, page, sort) => Parse.Cloud.run('getProducts', 
  {
    sessionToken: token,
    page,
    sort
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

export default {
//   signup,
  login,
	logout,
	loadSession,
	getOrders,
	getProducts,
	reloadProduct,
	saveProductStatus
}
