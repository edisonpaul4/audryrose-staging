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

export const getProducts = (token, page) => Parse.Cloud.run('getProducts', 
  {
    sessionToken: token,
    page
  }
);

export default {
//   signup,
  login,
	logout,
	loadSession,
	getOrders,
	getProducts
}
