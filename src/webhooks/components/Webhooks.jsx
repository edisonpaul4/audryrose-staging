import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Grid, Table, Dimmer, Loader, Form, Select, Segment, Header, Button } from 'semantic-ui-react';
// import moment from 'moment';

class Webhook extends Component {
    constructor(props) {
        super(props);
        this.handleDeleteWebhookClick = this.handleDeleteWebhookClick.bind(this);
    }

    handleDeleteWebhookClick(e, { value }) {
        this.props.handleDeleteWebhookClick(this.props.data.id);
    }

    render() {
        const data = this.props.data;
        return (
            <Table.Row>
                <Table.Cell verticalAlign='top'>{data.id}</Table.Cell>
                <Table.Cell verticalAlign='top'>{data.scope}</Table.Cell>
                <Table.Cell verticalAlign='top'>{data.destination}</Table.Cell>
                <Table.Cell verticalAlign='top'>{data.is_active ? 'Yes' : 'No'}</Table.Cell>
                <Table.Cell verticalAlign='top'><Button size='mini' basic color='red' onClick={this.handleDeleteWebhookClick}>Delete</Button></Table.Cell>
            </Table.Row>
        );
    }
}

class Webhooks extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoadingWebhooks: false,
            webhooks: null,
            webhookEndpoints: null,
            endpointValue: '',
            destinationValue: 'https://audryrose-server.herokuapp.com/parse/functions/'
        };
        this.handleCreateWebhookClick = this.handleCreateWebhookClick.bind(this);
        this.handleEndpointChange = this.handleEndpointChange.bind(this);
        this.handleDestinationChange = this.handleDestinationChange.bind(this);
        this.handleDeleteWebhookClick = this.handleDeleteWebhookClick.bind(this);
    }

    componentWillMount() {
        this.props.getWebhooks(this.props.token);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            isLoadingWebhooks: nextProps.isLoadingWebhooks,
            webhooks: nextProps.webhooks ? nextProps.webhooks : this.state.webhooks,
            webhookEndpoints: nextProps.webhookEndpoints ? nextProps.webhookEndpoints : this.state.webhookEndpoints
        });
    }

    handleEndpointChange(e, { value }) {
        this.setState({
            endpointValue: value
        });
    }

    handleDestinationChange(e, { value }) {
        this.setState({
            destinationValue: value
        });
    }

    handleCreateWebhookClick(e, { value }) {
        this.props.createWebhook(this.props.token, this.state.endpointValue, this.state.destinationValue);
    }

    handleDeleteWebhookClick(id) {
        this.props.deleteWebhook(this.props.token, id);
    }

    render() {
        const scope = this;
        const { error } = this.props;
        const webhooks = this.state.webhooks;
        const endpoints = this.state.webhookEndpoints;
        let webhookRows = [];
        if (webhooks) {
            webhooks.map(function (webhookRow, i) {
                return webhookRows.push(<Webhook data={webhookRow} key={`${webhookRow.id}`} handleDeleteWebhookClick={scope.handleDeleteWebhookClick} />);
            });
        }
        const endpointOptions = endpoints ? endpoints.map(function (endpoint, i) {
            return { key: `endpoint-${i}`, text: endpoint, value: endpoint };
        }) : [];

        return (
            <Grid.Row columns={2}>
                <Grid.Column>
                    {error}
                    <Dimmer active={this.state.isLoadingWebhooks} inverted>
                        <Loader inverted>Loading</Loader>
                    </Dimmer>
                    <Table className='webhooks-table'>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>ID</Table.HeaderCell>
                                <Table.HeaderCell>Endpoint</Table.HeaderCell>
                                <Table.HeaderCell>Destination</Table.HeaderCell>
                                <Table.HeaderCell>Is Active</Table.HeaderCell>
                                <Table.HeaderCell>Actions</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {webhookRows}
                        </Table.Body>
                    </Table>
                </Grid.Column>
                <Grid.Column>
                    <Segment>
                        <Form loading={this.state.isLoadingWebhooks}>
                            <Header>Add a new webhook</Header>
                            <Form.Field control={Select} label='Endpoint' options={endpointOptions} placeholder='Select an endpoint' width='16' value={this.state.endpointValue} onChange={this.handleEndpointChange} />
                            <Form.Input label='Destination' width='16' value={this.state.destinationValue} onChange={this.handleDestinationChange} />
                            <Button color='olive' onClick={this.handleCreateWebhookClick}>Create webhook</Button>
                        </Form>
                    </Segment>
                </Grid.Column>
            </Grid.Row>
        );
    }
}

export default withRouter(Webhooks);
