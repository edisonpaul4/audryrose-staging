import { connect } from 'react-redux';
import { logout } from '../actions/auth';
import Logout from '../components/Logout';

const select = state => ({
  error: state.error,
  isLoggedIn: state.auth.isLoggedIn,
	token: state.auth.token,
});

const actions = {
  logout
};

export default connect(select, actions)(Logout);
