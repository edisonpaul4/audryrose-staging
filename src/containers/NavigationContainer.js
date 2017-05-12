import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Navigation from '../components/Navigation';

Navigation.propTypes = {
  user: PropTypes.object
};

const select = (state) => ({
  user: state.auth.user
});

export default connect(select)(Navigation);