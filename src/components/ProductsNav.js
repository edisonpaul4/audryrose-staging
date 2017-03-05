import React, { Component } from 'react';
import { Link } from 'react-router';
import { Menu, Label, Grid, Form } from 'semantic-ui-react';

class ProductsNav extends Component {
	render() {
		const pathName = this.props.pathname;
		const search = this.props.query.q ? this.props.query.q : '';
		const tabCounts = this.props.tabCounts;
    return (
      <Grid>
        <Grid.Row>
          <Grid.Column width={16}>
      	    <Menu pointing secondary>
      	      <Menu.Item 
      					as={Link} 
      					to='/products/in-stock' 
      					active={pathName === '/products' || pathName === '/products/in-stock'} 
      					link>
      					In Stock<Label horizontal>{tabCounts ? tabCounts.inStock : null}</Label>
      				</Menu.Item>
      				<Menu.Item 
      					as={Link} 
      					to='/products/need-to-order' 
      					active={pathName === '/products/need-to-order'} 
      					link>
      					Need To Order<Label horizontal>{tabCounts ? tabCounts.needToOrder : null}</Label>
      				</Menu.Item>
      				<Menu.Item 
      					as={Link} 
      					to='/products/waiting-to-receive' 
      					active={pathName === '/products/waiting-to-receive'} 
      					link>
      					Waiting To Receive<Label horizontal>{tabCounts ? tabCounts.waitingToReceive : null}</Label>
      				</Menu.Item>
      				<Menu.Item 
      					as={Link} 
      					to='/products/being-resized' 
      					active={pathName === '/products/being-resized'} 
      					link>
      					Being Resized<Label horizontal>{tabCounts ? tabCounts.beingResized : null}</Label>
      				</Menu.Item>
      				<Menu.Item
      					as={Link} 
      					to='/products/all' 
      					active={pathName === '/products/all'} 
      					link>
      					All<Label horizontal>{tabCounts ? tabCounts.all : null}</Label>
      				</Menu.Item>
              <Menu.Menu position='right'>
                <Menu.Item fitted className='subnav-search'>
                  <Form action='/products/search' method='get' size='small'>
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