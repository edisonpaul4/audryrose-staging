import React, { Component } from 'react';
import { Link } from 'react-router';
import { Menu, Label, Grid, Form } from 'semantic-ui-react';

class ProductsNav extends Component {
	render() {
		const pathName = this.props.pathname;
    const query = this.props.query;
		const search = query.q ? query.q : '';
		const tabCounts = this.props.tabCounts;
		const searchUrl = window.location.hostname === 'localhost' ? `${window.location.protocol}//${window.location.hostname}:${window.location.port}/products/search/` : `${window.location.protocol}//${window.location.hostname}/products/search/`;

    return (
      <Grid>
        <Grid.Row>
          <Grid.Column width={16}>
      	    <Menu pointing secondary>
      	      <Menu.Item
      					as={Link}
      					to={{pathname: '/products/in-stock', query: query}}
      					active={pathName === '/products' || pathName === '/products/in-stock'}
      					link>
      					In Stock<Label horizontal circular size='tiny' color={tabCounts && tabCounts.inStock > 0 ? 'olive' : null}>{tabCounts ? tabCounts.inStock : null}</Label>
      				</Menu.Item>
      				<Menu.Item
      					as={Link}
                to={{pathname: '/products/need-to-order', query: query}}
      					active={pathName === '/products/need-to-order'}
      					link>
      					Need To Order<Label horizontal circular size='tiny' color={tabCounts && tabCounts.needToOrder > 0 ? 'yellow' : null}>{tabCounts ? tabCounts.needToOrder : null}</Label>
      				</Menu.Item>
      				<Menu.Item
      					as={Link}
                to={{pathname: '/products/waiting-to-receive', query: query}}
      					active={pathName === '/products/waiting-to-receive'}
      					link>
      					Waiting To Receive<Label horizontal circular size='tiny' color={tabCounts && tabCounts.waitingToReceive > 0 ? 'yellow' : null}>{tabCounts ? tabCounts.waitingToReceive : null}</Label>
      				</Menu.Item>
      				<Menu.Item
      					as={Link}
                to={{pathname: '/products/being-resized', query: query}}
      					active={pathName === '/products/being-resized'}
      					link>
      					Being Resized<Label horizontal circular size='tiny' color={tabCounts && tabCounts.beingResized > 0 ? 'yellow' : null}>{tabCounts ? tabCounts.beingResized : null}</Label>
      				</Menu.Item>
      				<Menu.Item
      					as={Link}
                to={{pathname: '/products/all', query: query}}
      					active={pathName === '/products/all'}
      					link>
      					All<Label horizontal circular size='tiny'>{tabCounts ? tabCounts.all : null}</Label>
      				</Menu.Item>
              <Menu.Menu position='right'>
                <Menu.Item fitted className='subnav-search'>
                  <Form action={searchUrl} method='get' size='small'>
                    <Form.Input
                      action={{ icon: 'search', basic: true, size: 'small' }}
                      name='q'
                      defaultValue={search}
                      placeholder='Search by name or sku...'
                    />
                  </Form>
                </Menu.Item>
              </Menu.Menu>
      	    </Menu>
    	    </Grid.Column>
  	    </Grid.Row>
	    </Grid>
    );
  }
}

export default ProductsNav;
