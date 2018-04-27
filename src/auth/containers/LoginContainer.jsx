import { connect } from 'react-redux';
import { login, loadSession, logout } from '../actions';
import Login from '../components/Login';

const select = state => ({
    error: state.error,
    isLoggedIn: state.auth.isLoggedIn,
    isLoggingIn: state.auth.isLoggingIn,
    token: state.auth.token,
    user: state.auth.user,
    timeout: state.auth.timeout
});

const actions = {
    login,
    loadSession,
    logout,
};

export default connect(select, actions)(Login);
