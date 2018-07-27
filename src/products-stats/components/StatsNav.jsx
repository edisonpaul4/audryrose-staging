import React, { Component } from 'react';
import { Link } from 'react-router';
import { Menu } from 'semantic-ui-react';
class StatsNav extends Component {

    render() {
        const pathName = this.props.pathname;
        return (
            <Menu pointing secondary>
                <Menu.Item
                    as={Link}
                    to="/product-stats"
                    active={pathName === "/product-stats" || pathName === "/product-stats/product-stats"}
                    link
                    content="Product Stats" />
                <Menu.Item
                    as={Link}
                    to="/product-stats/designer-stats"
                    active={pathName === "/product-stats/designer-stats"}
                    link
                    content="Designer Stats" />
            </Menu>
        );
    }
}

export default StatsNav;