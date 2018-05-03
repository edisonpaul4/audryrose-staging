import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Grid, Message } from 'semantic-ui-react';

class Logout extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoggedIn: null,
            token: null
        };
    }

    componentDidMount() {
        if (this.props.isLoggedIn || this.props.token) {
            this.props.logout(this.props.token);
        } else {
            this.props.router.push('/login');
        }
    }

    componentWillUpdate() {
        if (!this.state.isLoggedIn) {
            this.props.router.push('/login');
        }
    }

    render() {
        return (
            <Grid centered>
                <Grid.Row>
                    <p>&nbsp;</p>
                </Grid.Row>
                <Grid.Row>
                    <Message>
                        <Message.Header>Logging out...</Message.Header>
                    </Message>
                </Grid.Row>
            </Grid>
        );
    }
}

export default withRouter(Logout);
