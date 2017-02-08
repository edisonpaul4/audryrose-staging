import { connect } from 'react-redux';
import { signup } from '../actions/auth';
import Signup from '../components/Signup';

const select = state => ({
  error: state.error,
  isLoggedIn: state.auth.isLoggedIn,
  isSigningUp: state.auth.isSigningUp
});

const actions = {
  signup
};

export default connect(select, actions)(Signup);
