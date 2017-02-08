import { connect } from 'react-redux';
import { login, loadSession } from '../actions/auth';
import Login from '../components/Login';

const select = state => ({
  error: state.error,
  isLoggedIn: state.auth.isLoggedIn,
  isLoggingIn: state.auth.isLoggingIn,
	token: state.auth.token,
	user: state.auth.user
});

const actions = {
  login,
	loadSession
};

export default connect(select, actions)(Login);
