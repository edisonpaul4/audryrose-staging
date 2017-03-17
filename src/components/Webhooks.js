import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Grid, Table, Dimmer, Loader } from 'semantic-ui-react';
// import moment from 'moment';

class Webhook extends Component {
	render() {
		const data = this.props.data;
    return (
      <Table.Row>
        <Table.Cell verticalAlign='top'>{data.id}</Table.Cell>
        <Table.Cell verticalAlign='top'>{data.scope}</Table.Cell>
        <Table.Cell verticalAlign='top'>{data.destination}</Table.Cell>
				<Table.Cell verticalAlign='top'>{data.is_active ? 'Yes' : 'No'}</Table.Cell>
				<Table.Cell verticalAlign='top'></Table.Cell>
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
			webhookEndpoints: null
    };
  }
	
	componentDidMount() {
		this.props.getWebhooks(this.props.token);
	}
	
	componentWillReceiveProps(nextProps) {
		this.setState({
			isLoadingWebhooks: nextProps.isLoadingWebhooks ? nextProps.isLoadingWebhooks: this.state.isLoadingWebhooks,
			webhooks: nextProps.webhooks ? nextProps.webhooks: this.state.webhooks,
			webhookEndpoints: nextProps.webhookEndpoints ? nextProps.webhookEndpoints: this.state.webhookEndpoints
		});
	}
	
  render() {
		const { error } = this.props;
		let webhookRows = [];
		if (this.state.webhookRows) {
			this.state.webhookRows.map(function(webhookRow, i) {
				return webhookRows.push(<Webhook data={webhookRow} key={`${webhookRow.id}`} />);
	    });
		}
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
			</Grid.Row>
    );
  }
}

export default withRouter(Webhooks);
