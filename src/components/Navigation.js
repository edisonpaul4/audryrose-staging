import React, { Component } from 'react';
import { Link } from 'react-router';
import { Menu, Dropdown } from 'semantic-ui-react';
import './Navigation.css';

class Navigation extends Component {
  constructor(props) {
    super(props);
		// this.props = props;
    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false
    };
  }
  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }
	
  render() {
		const pathName = this.props.path;
    return (
				<Menu className='main-nav' attached borderless stackable>
				  <Menu.Item header><img className='logo' src='/imgs/logo.png' width='23' alt='Audry Rose Logo'/></Menu.Item>
	        <Menu.Item href='/dashboard' active={pathName.includes('/dashboard')} link>Dashboard</Menu.Item>
					<Menu.Item href='/orders' active={pathName.includes('/orders')} link>Orders</Menu.Item>
					<Menu.Item href='/emails' active={pathName.includes('/emails')} link>Emails</Menu.Item>
					<Menu.Item href='/products' active={pathName.includes('/products')} link>Products</Menu.Item>
					<Menu.Item href='/shipments' active={pathName.includes('/shipments')} link>Shipments</Menu.Item>
					<Menu.Item href='/designers' active={pathName.includes('/designers')} link>Designers</Menu.Item>

					<Menu.Item href='/product-stats' active={pathName.includes('/product-stats')} link>
						Product stats
					</Menu.Item>

					<Menu.Item href='/repairs-resizes/all' active={pathName.includes('/repairs-resizes')} link>
						Repairs / Resizes
					</Menu.Item>
					
					<Menu.Menu position='right'>
			      <Dropdown item text='Settings'>
			        <Dropdown.Menu>
			          <Dropdown.Item href='/users'>Users</Dropdown.Item>
			          <Dropdown.Item href='/background-jobs'>Background Jobs</Dropdown.Item>
			          <Dropdown.Item href='/options'>Product Options</Dropdown.Item>
								<Dropdown.Item href='/webhooks'>Webhooks</Dropdown.Item>
			        </Dropdown.Menu>
			      </Dropdown>
			      <Dropdown item text={this.props.user.firstName}>
			        <Dropdown.Menu>
			          <Dropdown.Item href='/profile'>Profile</Dropdown.Item>
			          <Dropdown.Item href='/logout'>Logout</Dropdown.Item>
			        </Dropdown.Menu>
			      </Dropdown>
					</Menu.Menu>
				</Menu>
    );
  }
}

export default Navigation;
