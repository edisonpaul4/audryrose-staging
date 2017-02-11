import api from '../api';

/*
export function signup(username, password) {
  return {
    types: ['SIGNUP_REQUEST', 'SIGNUP_SUCCESS', 'SIGNUP_FAILURE'],
    promise: api.signup(username, password)
  };
}
*/

export function login(username, password) {
	console.log('action login');
  return {
    types: ['LOGIN_REQUEST', 'LOGIN_SUCCESS', 'LOGIN_FAILURE'],
    promise: api.login(username, password)
  }
}

export function logout(token) {
	console.log('action logout');
  return {
    types: ['LOGOUT_REQUEST', 'LOGOUT_SUCCESS', 'LOGOUT_FAILURE'],
    promise: api.logout(token)
  }
}

export function loadSession(token) {
	console.log('action loadSession for ' + token);
  return {
    type: ['LOAD_SESSION_REQUEST', 'LOAD_SESSION_SUCCESS', 'LOAD_SESSION_FAILURE'],
    promise: api.loadSession(token)
  }
}

