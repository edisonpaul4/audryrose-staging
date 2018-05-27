import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Grid, Menu, Form } from 'semantic-ui-react';

class EmailSectionMainContainer extends React.Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    let search = this.props.location.query ? this.props.location.query.q : '';
    const getWindowLocationSearch = (inSearch) => {
      return window.location.origin + this.props.location.pathname.replace('/search','') + '/search?q=' + inSearch;
    }
    return (
      <Grid.Row>
        <Grid.Column>
          <Grid.Row>
            <Grid.Column>
              <Menu style={{ marginBottom: '2rem' }} pointing secondary>
                <Menu.Item
                  as={Link}
                  to="/emails/customers-orders"
                  active={this.props.location.pathname === "/emails/" || this.props.location.pathname.includes("/emails/customers-orders")}
                  link
                  content="Orders' E-mails" />

                <Menu.Item
                  as={Link}
                  to="/emails/returns"
                  active={this.props.location.pathname.includes("/emails/returns")}
                  link
                  content="Returns' E-mails" />
                <Menu.Item fitted className='subnav-search'>
                  <Form action={getWindowLocationSearch(search)} method='get' size='small'>
                    <Form.Input
                      action={{ icon: 'search', basic: true, size: 'small' }}
                      type='search'
                      name='q'
                      defaultValue={search}
                      placeholder='Search by name or order id'
                    />
                  </Form>
                </Menu.Item>
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
