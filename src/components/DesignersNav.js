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
					to='/designers/pending' 
					active={pathName === '/designers/pending'} 
					link>
					Pending
				</Menu.Item>
				<Menu.Item 
					as={Link} 
					to='/designers/sent' 
					active={pathName === '/designers/sent'} 
					link>
					Sent
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