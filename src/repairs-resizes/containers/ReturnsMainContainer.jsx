import React from 'react';
import { connect } from 'react-redux';
import { Grid, Menu } from 'semantic-ui-react';
import { Link } from 'react-router';

import NotificationSystem from 'react-notification-system';

class ReturnsMainContainer extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Grid.Column width='16'>
                <NotificationSystem ref="notificationSystem" />
                {this.props.children}
            </Grid.Column>
        );
    }
}

const state = state => ({

});

const actions = {

}

export default connect(state, actions)(ReturnsMainContainer);