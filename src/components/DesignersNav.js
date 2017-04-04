import React, { Component } from 'react';
import { Link } from 'react-router';
import { Menu } from 'semantic-ui-react';

class DesignersNav extends Component {
	render() {
		const pathName = this.props.pathname;
    return (
	    <Menu pointing secondary>
	      <Menu.Item 
					as={Link} 
					to='/designers/all' 
					active={pathName === '/designers' || pathName === '/designers/all'} 
					link>
					All
				</Menu.Item>
				<Menu.Item 
					as={Link} 
					to='/designers/ordered' 
					active={pathName === '/designers/ordered'} 
					link>
					Ordered
				</Menu.Item>
				<Menu.Item 
					as={Link} 
					to='/designers/resizing' 
					active={pathName === '/designers/resizing'} 
					link>
					Resizing
				</Menu.Item>				
	    </Menu>
    );
  }
}

export default DesignersNav;