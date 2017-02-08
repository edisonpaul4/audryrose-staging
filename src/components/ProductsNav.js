import React, { Component } from 'react';
import { Link } from 'react-router';
import { Menu, Label } from 'semantic-ui-react';

class ProductsNav extends Component {
	// handleItemClick(event) {
	//     event.preventDefault();
	//   event.stopPropagation();
	// 	console.log('click');
		// this.props.onToggle(this.props.data.orderId)
	// }
	render() {
		const pathName = this.props.pathname;
    return (
	    <Menu pointing secondary>
	      <Menu.Item 
					as={Link} 
					to='/products/in-stock' 
					active={pathName === '/products' || pathName === '/products/in-stock'} 
					link>
					In Stock<Label horizontal>23</Label>
				</Menu.Item>
				<Menu.Item 
					as={Link} 
					to='/products/need-to-order' 
					active={pathName === '/products/need-to-order'} 
					link>
					Need To Order<Label horizontal>23</Label>
				</Menu.Item>
				<Menu.Item 
					as={Link} 
					to='/products/waiting-to-receive' 
					active={pathName === '/products/waiting-to-receive'} 
					link>
					Waiting To Receive<Label horizontal>23</Label>
				</Menu.Item>
				<Menu.Item 
					as={Link} 
					to='/products/being-resized' 
					active={pathName === '/products/being-resized'} 
					link>
					Being Resized<Label horizontal>23</Label>
				</Menu.Item>
				<Menu.Item
					as={Link} 
					to='/products/all' 
					active={pathName === '/products/all'} 
					link>
					All<Label horizontal>23</Label>
				</Menu.Item>
	    </Menu>
    );
  }
}

export default ProductsNav;