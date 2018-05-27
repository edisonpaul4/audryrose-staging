import React, { Component } from 'react';
import { Menu, Dropdown } from 'semantic-ui-react';
import './Navigation.css';
import { Link } from 'react-router';
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
                <Menu.Item header as={Link} to='/orders'><img className='logo' src='/imgs/logo.png' width='23' alt='Audry Rose Logo' /></Menu.Item>
                {/*<Menu.Item as={Link} to='/dashboard' active={pathName.includes('/dashboard')} link>Dashboard</Menu.Item>*/}
                <Menu.Item as={Link} to='/orders' active={pathName.includes('/orders')} link>Orders</Menu.Item>
                <Menu.Item as={Link} to='/emails/customers-orders' active={pathName.includes('/emails/')} link>Emails</Menu.Item>
                <Menu.Item as={Link} to='/products' active={pathName.includes('/products')} link>Products</Menu.Item>
                <Menu.Item as={Link} to='/shipments' active={pathName.includes('/shipments')} link>Shipments</Menu.Item>
                <Menu.Item as={Link} to='/designers' active={pathName.includes('/designers')} link>Designers</Menu.Item>

                <Menu.Item as={Link} to='/product-stats' active={pathName.includes('/product-stats')} link>
                    Product stats
					</Menu.Item>

                <Menu.Item as={Link} to='/repairs-resizes/all' active={pathName.includes('/repairs-resizes')} link>
                    Repairs / Resizes
					</Menu.Item>

                <Menu.Menu position='right'>
                    <Dropdown item text='Settings'>
                        <Dropdown.Menu>
                            <Dropdown.Item as={Link} to='/users'>Users</Dropdown.Item>
                            <Dropdown.Item as={Link} to='/background-jobs'>Background Jobs</Dropdown.Item>
                            <Dropdown.Item as={Link} to='/options'>Product Options</Dropdown.Item>
                            <Dropdown.Item as={Link} to='/webhooks'>Webhooks</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    <Dropdown item text={this.props.user.firstName}>
                        <Dropdown.Menu>
                            <Dropdown.Item as={Link} to='/profile'>Profile</Dropdown.Item>
                            <Dropdown.Item as={Link} to='/logout'>Logout</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Menu.Menu>
            </Menu>
        );
    }
}

export default Navigation;
