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
		const tabCounts = this.props.tabCounts;
    return (
	    <Menu pointing secondary>
	      <Menu.Item 
					as={Link} 
					to='/orders/awaiting-fulfillment' 
					active={pathName === '/orders' || pathName === '/orders/awaiting-fulfillment'} 
					link>
  					Awaiting Fulfillment
  					<Label horizontal circular size='tiny'>{tabCounts ? tabCounts.awaitingFulfillment : null}</Label>
				</Menu.Item>
				<Menu.Item 
					as={Link} 
					to='/orders/resizable' 
					active={pathName === '/orders/resizable'} 
					link>
					  Resizable
            <Label horizontal circular size='tiny' color={tabCounts && tabCounts.resizable > 0 ? 'yellow' : null}>{tabCounts ? tabCounts.resizable : null}</Label>
				</Menu.Item>
				<Menu.Item 
					as={Link} 
					to='/orders/fully-shippable' 
					active={pathName === '/orders/fully-shippable'} 
					link>
					  Fully Shippable
					  <Label horizontal circular size='tiny' color={tabCounts && tabCounts.fullyShippable > 0 ? 'olive' : null}>{tabCounts ? tabCounts.fullyShippable : null}</Label>
				</Menu.Item>
				<Menu.Item 
					as={Link} 
					to='/orders/partially-shippable' 
					active={pathName === '/orders/partially-shippable'} 
					link>
					Partially Shippable <Label horizontal circular size='tiny' color={tabCounts && tabCounts.partiallyShippable > 0 ? 'olive' : null}>{tabCounts ? tabCounts.partiallyShippable : null}</Label>
				</Menu.Item>
				<Menu.Item
					as={Link} 
					to='/orders/cannot-ship' 
					active={pathName === '/orders/cannot-ship'} 
					link>
					Cannot Ship <Label horizontal circular size='tiny' color={tabCounts && tabCounts.cannotShip > 0 ? 'red' : null}>{tabCounts ? tabCounts.cannotShip : null}</Label>
				</Menu.Item>
				<Menu.Item 
					as={Link} 
					to='/orders/fulfilled' 
					active={pathName === '/orders/fulfilled'} 
					link>
					Fulfilled <Label horizontal circular size='tiny'>{tabCounts ? tabCounts.fulfilled : null}</Label>
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