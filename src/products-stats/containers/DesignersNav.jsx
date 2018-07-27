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
                    to="/designers/all"
                    active={pathName === "/designers" || pathName === "/designers/all"}
                    link
                    content="All" />
                <Menu.Item
                    as={Link}
                    to="/designers/vendor-orders/pending"
                    active={pathName === "/designers/vendor-orders/pending"}
                    link
                    content="All Pending" />
                <Menu.Item
                    as={Link}
                    to="/designers/pending"
                    active={pathName === "/designers/pending"}
                    link
                    content="Pending" />
                <Menu.Item
                    as={Link}
                    to="/designers/sent"
                    active={pathName === "/designers/sent"}
                    link
                    content="Sent" />
                <Menu.Item
                    as={Link}
                    to="/designers/completed"
                    active={pathName === "/designers/completed"}
                    link
                    content="Completed" />
                <Menu.Item
                    as={Link}
                    to="/designers/unconfirmed"
                    active={pathName === "/designers/unconfirmed"}
                    link
                    content="Unconfirmed" />
            </Menu>
        );
    }
}

export default DesignersNav;