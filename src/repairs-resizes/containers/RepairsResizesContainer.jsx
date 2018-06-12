import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Grid, Menu, Segment, Table } from 'semantic-ui-react';

import { ReturnProductRow } from '../components/components';
import { getReturns, checkInReturn, updateReturnStatus, deleteRepairResize, updateResizeSize } from '../actions';

class RepairsResizesContainer extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        this.props.getReturns(this.props.token);
    }

    getFilteredReturns(returns, type) {
        switch (type) {
            case 'all':
                return returns.filter(r => r.returnStatusId <= 2);

            case 'waiting':
                return returns.filter(r => r.returnStatusId === 0);

            case 'returns':
                return returns.filter(r => r.returnTypeId === 0);

            case 'repair':
                return returns.filter(r => r.returnTypeId === 1);

            case 'being-repaired':
                return returns.filter(r => r.returnTypeId === 1 && r.returnStatusId === 1);

            case 'resize':
                return returns.filter(r => r.returnTypeId === 2);

            case 'being-resized':
                return returns.filter(r => r.returnTypeId === 2 && r.returnStatusId === 2);

            case 'completed':
                return returns.filter(r => r.returnStatusId >= 3);

            default:
                return returns;
        }
    }

    updateReturnStatus(returnId, returnStatusId) {
        this.props.updateReturnStatus(returnId, returnStatusId);
    }

    checkInProductHandler(returnId) {
        this.props.checkInReturn(returnId);
    }

    deleteReturnResizeHandler(returnId){
        this.props.deleteRepairResize(returnId,this.props.token)
    }

    updateResizeSizeHandler(returnId, newSize){
        this.props.updateResizeSize(returnId, newSize, this.props.token)
    }
    render() {
        return (
            <Grid.Row>
                <Grid.Column width="16" style={{ marginBottom: '2rem' }}>
                    <Menu pointing secondary>
                        <Menu.Item
                            as={Link}
                            to="/repairs-resizes/all"
                            active={this.props.location.pathname === "/repairs-resizes/" || this.props.location.pathname === "/repairs-resizes/all"}
                            link
                            content="All" />

                        <Menu.Item
                            as={Link}
                            to="/repairs-resizes/waiting"
                            active={this.props.location.pathname === "/repairs-resizes/waiting"}
                            link
                            content="Waiting for customer" />

                        <Menu.Item
                            as={Link}
                            to="/repairs-resizes/returns"
                            active={this.props.location.pathname === "/repairs-resizes/returns"}
                            link
                            content="Returns" />

                        <Menu.Item
                            as={Link}
                            to="/repairs-resizes/repair"
                            active={this.props.location.pathname === "/repairs-resizes/repair"}
                            link
                            content="Repairs" />

                        <Menu.Item
                            as={Link}
                            to="/repairs-resizes/being-repaired"
                            active={this.props.location.pathname === "/repairs-resizes/being-repaired"}
                            link
                            content="Being repaired" />

                        <Menu.Item
                            as={Link}
                            to="/repairs-resizes/resize"
                            active={this.props.location.pathname === "/repairs-resizes/resize"}
                            link
                            content="Resizes" />

                        <Menu.Item
                            as={Link}
                            to="/repairs-resizes/being-resized"
                            active={this.props.location.pathname === "/repairs-resizes/being-resized"}
                            link
                            content="Being resized" />

                        <Menu.Item
                            as={Link}
                            to="/repairs-resizes/completed"
                            active={this.props.location.pathname === "/repairs-resizes/completed"}
                            link
                            content="Completed" />
                    </Menu>
                </Grid.Column>

                <Grid.Column width="16">
                    <Segment loading={this.props.loadingReturns}>
                        <Table celled>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>Date requested</Table.HeaderCell>
                                    <Table.HeaderCell>Date Checked in</Table.HeaderCell>
                                    <Table.HeaderCell>Order #</Table.HeaderCell>
                                    <Table.HeaderCell>Customer name</Table.HeaderCell>
                                    <Table.HeaderCell>Product name</Table.HeaderCell>
                                    <Table.HeaderCell>Product image</Table.HeaderCell>
                                    <Table.HeaderCell>Notes</Table.HeaderCell>
                                    <Table.HeaderCell>Status</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {this.getFilteredReturns(this.props.returns, this.props.routeParams.subpage).map(returnObject => (
                                    <ReturnProductRow
                                        key={`return-${returnObject.id}`}
                                        returnId={returnObject.id}
                                        dateRequested={returnObject.dateRequested}
                                        dateCheckedIn={returnObject.dateCheckedIn}
                                        checkedInHandler={this.checkInProductHandler.bind(this)}
                                        updateReturnStatus={this.updateReturnStatus.bind(this)}
                                        orderId={returnObject.orderId}
                                        customerName={returnObject.customerName}
                                        productName={returnObject.productName}
                                        productImage={returnObject.productImage}
                                        orderNotes={returnObject.orderNotes}
                                        returnStatus={returnObject.returnStatus}
                                        returnStatusId={returnObject.returnStatusId}
                                        returnType={returnObject.returnType}
                                        returnTypeId={returnObject.returnTypeId}
                                        shippoInfo={returnObject.shippoInfo}
                                        deleteReturn={this.deleteReturnResizeHandler.bind(this)}
                                        returnOptions={returnObject.returnOptions}
                                        updateResize={this.updateResizeSizeHandler.bind(this)}
                                    />
                                ))}
                            </Table.Body>
                        </Table>
                    </Segment>
                </Grid.Column>
            </Grid.Row>
        );
    }
}

const state = state => ({
    user: state.auth.user,
    token: state.auth.token,
    returns: state.returns.returns,
    loadingReturns: state.returns.isLoadingReturns
});

const actions = {
    getReturns,
    checkInReturn,
    updateReturnStatus,
    deleteRepairResize,
    updateResizeSize
};

export default connect(state, actions)(RepairsResizesContainer);