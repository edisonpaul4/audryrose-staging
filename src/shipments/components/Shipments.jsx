import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Grid, Table, Dimmer, Loader, Button } from 'semantic-ui-react';
import Pagination from '../../shared/components/Pagination.js';
import moment from 'moment';

class Shipment extends Component {
    render() {
        const data = this.props.data;
        const printButton = data.labelWithPackingSlipUrl ? <Button as='a' size='mini' href={data.labelWithPackingSlipUrl} target='_blank' content='Print' /> : null;
        return (
            <Table.Row>
                <Table.Cell verticalAlign='top' singleLine>{data.shipmentId}</Table.Cell>
                <Table.Cell verticalAlign='top' singleLine>{data.order_id}</Table.Cell>
                <Table.Cell verticalAlign='top'>{data.shipping_address.first_name} {data.shipping_address.last_name}</Table.Cell>
                <Table.Cell verticalAlign='top'>{moment(data.date_created.iso).calendar()}</Table.Cell>
                <Table.Cell verticalAlign='top'>{data.shipping_provider}</Table.Cell>
                <Table.Cell verticalAlign='top'>{data.tracking_number}</Table.Cell>
                <Table.Cell verticalAlign='top'>{printButton}</Table.Cell>
            </Table.Row>
        );
    }
}

class Shipments extends Component {
    constructor(props) {
        super(props);

        this.state = {
            page: null
        };
        this.handlePaginationClick = this.handlePaginationClick.bind(this);
    }

    componentDidMount() {
        this.props.getShipments(this.props.token, this.state.page);
    }

    handlePaginationClick(page) {
        const router = this.props.router;
        const queries = router.location.query;
        queries.page = page;

        router.replace({
            pathname: router.location.pathname,
            query: queries
        })
    }

    componentWillReceiveProps(nextProps) {
        let nextPage = parseFloat(nextProps.location.query.page);
        if (!nextPage) nextPage = 1;
        if (nextPage !== this.state.page) {
            this.setState({
                page: nextPage
            });
            this.props.getShipments(this.props.token, nextPage);
        }
    }

    render() {
        const { error, isLoadingShipments, totalPages } = this.props;
        let shipmentRows = [];
        if (this.props.shipments) {
            this.props.shipments.map(function (shipmentRow, i) {
                let shipmentJSON = shipmentRow.toJSON();
                return shipmentRows.push(<Shipment data={shipmentJSON} key={`${shipmentJSON.shipmentId}-1`} />);
            });
        }
        return (
            <Grid.Column width='16'>
                {error}
                <Dimmer active={isLoadingShipments} inverted>
                    <Loader inverted>Loading</Loader>
                </Dimmer>
                <Table className='shipments-table'>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>ID</Table.HeaderCell>
                            <Table.HeaderCell>Order ID</Table.HeaderCell>
                            <Table.HeaderCell>Shipped To</Table.HeaderCell>
                            <Table.HeaderCell>Date Shipped</Table.HeaderCell>
                            <Table.HeaderCell>Shipping Provider</Table.HeaderCell>
                            <Table.HeaderCell>Tracking No.</Table.HeaderCell>
                            <Table.HeaderCell className='right aligned'>&nbsp;</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {shipmentRows}
                    </Table.Body>
                    <Table.Footer fullWidth>
                        <Table.Row>
                            <Table.HeaderCell colSpan='11'>
                                <Pagination page={this.state.page} onPaginationClick={this.handlePaginationClick} totalPages={totalPages} />
                            </Table.HeaderCell>
                        </Table.Row>
                    </Table.Footer>
                </Table>
            </Grid.Column>
        );
    }
}

export default withRouter(Shipments);
