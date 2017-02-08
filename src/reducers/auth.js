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
					email: action.res.data.email, 
					firstName: action.res.data.firstName, 
					lastName: action.res.data.lastName, 
					username: action.res.data.username,  
				},
        token: action.res.data.sessionToken
      };

    case 'SIGNUP_FAILURE':
      return {
        ...state,
        isSigningUp: false
      }

    case 'LOGIN_REQUEST':
      return {
        ...state,
        isLoggingIn: true
      }

    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isLoggedIn: true,
        user: {
					email: action.res.data.email,
					firstName: action.res.data.firstName,
					lastName: action.res.data.lastName,
					username: action.res.data.username,
				},
        token: action.res.data.sessionToken
      }

    case 'LOGIN_FAILURE':
      return {
        ...state,
        isLoggingIn: false
      }
			
    case 'LOGOUT_REQUEST':
      return {
        ...state
      }
			
    case 'LOGOUT_SUCCESS':
      return {
        ...state,
        isLoggedIn: false,
        user: null,
        token: null
      }
			
    case 'LOGOUT_FAILURE':
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
					email: action.res.data.email, 
					firstName: action.res.data.firstName, 
					lastName: action.res.data.lastName, 
					username: action.res.data.username,  
				},
        token: action.res.data.sessionToken
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
