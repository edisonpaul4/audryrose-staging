import React, { Component } from 'react';
import { Link } from 'react-router';
import { Menu } from 'semantic-ui-react';

class OptionsNav extends Component {
	render() {
		const pathName = this.props.pathname;
    return (
	    <Menu pointing secondary>
	      <Menu.Item 
					as={Link} 
					to='/options/colors' 
					active={pathName === '/options' || pathName === '/options/colors'} 
					link>
					Colors
				</Menu.Item>
				<Menu.Item 
					as={Link} 
					to='/options/stones' 
					active={pathName === '/options/stones'} 
					link>
					Stones
				</Menu.Item>
	    </Menu>
    );
  }
}

export default OptionsNav;