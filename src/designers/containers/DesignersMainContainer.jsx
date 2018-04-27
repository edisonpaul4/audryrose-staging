import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Grid } from 'semantic-ui-react';

import { DesignersNav } from '../components/components';
import NotificationSystem from 'react-notification-system';

class DesignersMainContainer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Grid.Column width='16'>
        <NotificationSystem ref="notificationSystem" />
        <DesignersNav
          key={this.props.location.pathname}
          pathname={this.props.location.pathname}
          query={this.props.location.query} />
        {this.props.children}
      </Grid.Column>
    );
  }
}

DesignersMainContainer.propTypes = {

};

const state = state => ({

});

const actions = {

};

export default connect(state, actions)(DesignersMainContainer);