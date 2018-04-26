import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Grid, Menu } from 'semantic-ui-react';

class EmailSectionMainContainer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Grid.Row>
        <Grid.Column>
          <Grid.Row>
            <Grid.Column>
              <Menu style={{ marginBottom: '2rem' }} pointing secondary>
                <Menu.Item
                  as={Link}
                  to="/emails/customers-orders/"
                  active={this.props.location.pathname === "/emails/" || this.props.location.pathname === "/emails/customers-orders/"}
                  link
                  content="Orders' E-mails" />

                <Menu.Item
                  as={Link}
                  to="/emails/returns/"
                  active={this.props.location.pathname === "/emails/returns/"}
                  link
                  content="Returns' E-mails" />

              </Menu>
            </Grid.Column>

            <Grid.Column>
              {this.props.children}
            </Grid.Column>
          </Grid.Row>
        </Grid.Column>
      </Grid.Row>
    );
  }
}

const state = state => ({
  user: state.auth.user,
  token: state.auth.token,
});

const actions = {
};

export default connect(state, actions)(EmailSectionMainContainer);
