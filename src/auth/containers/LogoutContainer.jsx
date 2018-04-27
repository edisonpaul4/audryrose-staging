import { connect } from 'react-redux';
import { login, loadSession, logout } from '../actions';
import Logout  from '../components/Logout';
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

export default connect(select, actions)(Logout);
