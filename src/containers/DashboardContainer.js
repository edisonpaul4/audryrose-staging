import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Message } from 'semantic-ui-react';

class DashboardContainer extends Component {
	componentDidMount() {
		this.props.router.push('/orders');
	}
  render() {
		console.log('render dashboard');
    return (
      <Message>Hey {this.props.firstName}, high five!</Message>
    );
  }
}

DashboardContainer.propTypes = {
  firstName: PropTypes.string
};

const select = (state) => ({
  firstName: state.auth.user.firstName
});

export default connect(select)(DashboardContainer);
