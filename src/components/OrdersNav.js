import React, { Component } from 'react';
import { Link } from 'react-router';
import { Menu, Label, Form } from 'semantic-ui-react';

class OrdersNav extends Component {
	// handleItemClick(event) {
	//     event.preventDefault();
	//   event.stopPropagation();
	// 	console.log('click');
		// this.props.onToggle(this.props.data.orderId)
	// }
	render() {
		const pathName = this.props.pathname;
		const search = this.props.query.q ? this.props.query.q : '';
    return (
	    <Menu pointing secondary>
	      <Menu.Item 
					as={Link} 
					to='/orders/awaiting-fulfillment' 
					active={pathName === '/orders' || pathName === '/orders/awaiting-fulfillment'} 
					link>
					Awaiting Fulfillment <Label horizontal>23</Label>
				</Menu.Item>
				<Menu.Item 
					as={Link} 
					to='/orders/resizable' 
					active={pathName === '/orders/resizable'} 
					link>
					Resizable <Label horizontal>23</Label>
				</Menu.Item>
				<Menu.Item 
					as={Link} 
					to='/orders/fully-shippable' 
					active={pathName === '/orders/fully-shippable'} 
					link>
					Fully Shippable <Label horizontal>23</Label>
				</Menu.Item>
				<Menu.Item 
					as={Link} 
					to='/orders/partially-shippable' 
					active={pathName === '/orders/partially-shippable'} 
					link>
					Partially Shippable <Label horizontal>23</Label>
				</Menu.Item>
				<Menu.Item
					as={Link} 
					to='/orders/cannot-ship' 
					active={pathName === '/orders/cannot-ship'} 
					link>
					Cannot Ship <Label horizontal>23</Label>
				</Menu.Item>
				<Menu.Item 
					as={Link} 
					to='/orders/fulfilled' 
					active={pathName === '/orders/fulfilled'} 
					link>
					Fulfilled <Label horizontal>23</Label>
				</Menu.Item>
        <Menu.Menu position='right'>
          <Menu.Item fitted className='subnav-search'>
            <Form action='/orders/search' method='get' size='small'>
              <Form.Input 
                action={{ icon: 'search', basic: true, size: 'small' }} 
                name='q' 
                defaultValue={search} 
                placeholder='Search by name, order id, product, email ...' 
              />
            </Form>
          </Menu.Item>
        </Menu.Menu>
	    </Menu>
    );
  }
}

export default OrdersNav;