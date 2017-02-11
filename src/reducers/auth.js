const initialState = {
  isSigningUp: false,
  isLoggingIn: false,
  isLoggedIn: false,
	session: null,
  token: null,
  user: null,
};

const auth = (state = initialState, action) => {
  switch(action.type) {

/*
    case 'SIGNUP_REQUEST':
      return {
        ...state,
        isSigningUp: true
      }

    case 'SIGNUP_SUCCESS':
      return {
        ...state,
        isLoggedIn: true,
        isSigningUp: false,
        user: { 
					email: action.res.get('email'), 
					firstName: action.res.get('firstName'), 
					lastName: action.res.get('lastName'), 
					username: action.res.get('username'),  
				},
        token: action.res.get('sessionToken')
      };

    case 'SIGNUP_FAILURE':
      return {
        ...state,
        isSigningUp: false
      }
*/

    case 'LOGIN_REQUEST':
      return {
        ...state,
        isLoggingIn: true
      }

    case 'LOGIN_SUCCESS':
      console.log(JSON.stringify(action.res));
      return {
        ...state,
        isLoggedIn: true,
        user: {
					email: action.res.get('email'),
					firstName: action.res.get('firstName'),
					lastName: action.res.get('lastName'),
					username: action.res.get('username'),
				},
        token: action.res.get('sessionToken')
      }

    case 'LOGIN_FAILURE':
      return {
        ...state,
        isLoggingIn: false
      }
			
    case 'LOGOUT_REQUEST':
      console.log(JSON.stringify(action.res));
      return {
        ...state
      }
			
    case 'LOGOUT_SUCCESS':
      console.log(JSON.stringify(action.res));
      return {
        ...state,
        isLoggedIn: false,
        user: null,
        token: null
      }
			
    case 'LOGOUT_FAILURE':
      console.log(JSON.stringify(action.res));
      return {
        ...state,
        isLoggingIn: false
      }
			
    case 'LOAD_SESSION_REQUEST':
      return {
        ...state,
				isLoggingIn: true
      }
			
    case 'LOAD_SESSION_SUCCESS':
      return {
        ...state,
        isLoggedIn: true,
        user: { 
					email: action.res.get('email'), 
					firstName: action.res.get('firstName'), 
					lastName: action.res.get('lastName'), 
					username: action.res.get('username'),  
				},
        token: action.res.get('sessionToken')
      }
			
    case 'LOAD_SESSION_FAILURE':
      return {
        ...state,
        isLoggingIn: false
      }
			
    case 'LOAD_STORED_STATE':
			const isLoggedIn = (action.storedState.user && action.storedState.token) ? true : false;
      return {
        ...state,
				isLoggedIn: isLoggedIn,
        user: action.storedState.user,
        token: action.storedState.token
      }
			
    default:
      return state;
  }
}

export default auth;
