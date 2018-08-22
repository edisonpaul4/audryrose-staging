import React, { Component } from 'react';
import { Link } from 'react-router';
import { Menu, Label, Form, Dropdown, Button } from 'semantic-ui-react';
import moment from 'moment';

class OrdersNav extends Component {
    
    render() {
        const pathName = this.props.pathname;
        const search = this.props.query.q ? this.props.query.q : '';
        const tabCounts = this.props.tabCounts;
        let expanded = this.props.expanded;
        let expandedIcon = expanded ? 'minus' : 'plus'
        // Display files list
        let files = [];
        if (this.props.files) {
            this.props.files.map(function (file, i) {
                const date = moment(file.createdAt).format('M/D/YY h:mm a');
                files.push(
                    <Dropdown.Item
                        as={Link}
                        href={file.url}
                        target='_blank'
                        text={file.name}
                        description={date}
                        key={file.objectId}
                        className='file-item'
                    />
                );
                return file;
            });
        }

        const searchUrl = window.location.hostname === 'localhost' ? `${window.location.protocol}//${window.location.hostname}:${window.location.port}/orders/search` : `${window.location.protocol}//${window.location.hostname}/orders/search`;
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
                    to='/orders/needs-action'
                    active={pathName === '/orders/needs-action'}
                    link>
                    Needs Ordering
            <Label horizontal circular size='tiny' color={tabCounts && tabCounts.needsAction > 0 ? 'olive' : null}>{tabCounts ? tabCounts.needsAction : null}</Label>
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
                    <Menu.Item fitted className='subnav-files'>
                        <Dropdown icon='file text outline' compact={false} basic button scrolling className='icon'>
                            <Dropdown.Menu>
                                <Dropdown.Header content='Recent Files' />
                                <Dropdown.Divider />
                                {files}
                            </Dropdown.Menu>
                        </Dropdown>
                    </Menu.Item>
                    <Menu.Item fitted className='subnav-files'>
                        <Button circular icon={expandedIcon} basic size='mini' onClick={() => this.props.handleToggleClick()}/>
                    </Menu.Item>
                    <Menu.Item fitted className='subnav-search'>
                        <Form action={searchUrl} method='get' size='small'>
                            <Form.Input
                                action={{ icon: 'search', basic: true, size: 'small' }}
                                type='search'
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
