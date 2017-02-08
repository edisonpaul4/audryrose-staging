import axios from 'axios';
import config from './config';

const BASE_URL = process.env.REACT_APP_SERVER_URL;

const userInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'X-Parse-Application-Id': config.parseAppId,
		'X-Parse-Revocable-Session': '1'
  }
});

export const signup = (username, password) => userInstance.post('/users', {
  username,
  password
});

export const login = (username, password) => userInstance.get('/login', {
  params: {
    username,
    password
  }
});

export const logout = (token) => userInstance.post('/logout', {
  params: {
    token
  }
});

export const loadSession = (token) => axios.get('/users/me', {
	baseURL: BASE_URL,
  headers: {
    'X-Parse-Application-Id': config.parseAppId,
		'X-Parse-Session-Token': token
  }
});

export const getOrders = (token, page) => axios.post('/functions/getOrders', {page},
	{
		baseURL: BASE_URL,
	  headers: {
	    'X-Parse-Application-Id': config.parseAppId,
			'X-Parse-Session-Token': token
	  }
	}
);

export default {
  signup,
  login,
	logout,
	loadSession,
	getOrders
}
