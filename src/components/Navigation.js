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

					<Link to="/dashboard" style={{ display: 'inherit' }}>
		        <Menu.Item active={pathName.includes('/dashboard')} link>Dashboard</Menu.Item>
					</Link>
					<Link to="/orders" style={{ display: 'inherit' }}>
						<Menu.Item active={pathName.includes('/orders')} link>Orders</Menu.Item>
					</Link>
					<Link to="/emails" style={{ display: 'inherit' }}>
						<Menu.Item active={pathName.includes('/emails')} link>Emails</Menu.Item>
					</Link>
					<Link to="/products" style={{ display: 'inherit' }}>
						<Menu.Item active={pathName.includes('/products')} link>Products</Menu.Item>
					</Link>
					<Link to="/shipments" style={{ display: 'inherit' }}>
						<Menu.Item active={pathName.includes('/shipments')} link>Shipments</Menu.Item>
					</Link>
					<Link to="/designers" style={{ display: 'inherit' }}>
						<Menu.Item active={pathName.includes('/designers')} link>Designers</Menu.Item>
					</Link>
					<Menu.Menu position="right">
			      <Dropdown item text="Settings">
			        <Dropdown.Menu>
								<Link to="/users" style={{ display: 'inherit' }}>
			          	<Dropdown.Item>Users</Dropdown.Item>
								</Link>
								<Link to="/background-jobs" style={{ display: 'inherit' }}>
			          	<Dropdown.Item>Background Jobs</Dropdown.Item>
								</Link>
								<Link to="/options" style={{ display: 'inherit' }}>
			          	<Dropdown.Item>Product Options</Dropdown.Item>
								</Link>
								<Link to="/webhooks">
									<Dropdown.Item>Webhooks</Dropdown.Item>
								</Link>
			        </Dropdown.Menu>
			      </Dropdown>
			      <Dropdown item text={this.props.user.firstName}>
			        <Dropdown.Menu>
								<Link to="/profile" style={{ display: 'inherit' }}>
			          	<Dropdown.Item>Profile</Dropdown.Item>
								</Link>
								<Link to="/logout" style={{ display: 'inherit' }}>
			          	<Dropdown.Item>Logout</Dropdown.Item>
								</Link>
			        </Dropdown.Menu>
			      </Dropdown>
					</Menu.Menu>
				</Menu>
    );
  }
}

export default Navigation;
