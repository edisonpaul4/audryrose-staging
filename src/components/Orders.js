import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Grid, Table, Dimmer, Loader, Checkbox } from 'semantic-ui-react';
import OrdersNav from './OrdersNav.js';
import Order from './Order.js';
import Pagination from './Pagination.js';

class Orders extends Component {
  constructor(props) {
    super(props);

    this.state = {
			page: null,
			expandedOrders: []
    };
    this._onToggle = this._onToggle.bind(this);
    this.handlePaginationClick = this.handlePaginationClick.bind(this);
  }
	
	componentDidMount() {
		this.props.getOrders(this.props.token, this.state.page);
	}
	
	_onToggle(orderId) {
		let currentlyExpanded = this.state.expandedOrders;
		var index = currentlyExpanded.indexOf(orderId);
		if (index >= 0) {
			currentlyExpanded.splice(index, 1);
		} else {
			currentlyExpanded.push(orderId);
		}
		this.setState({
			expandedOrders: currentlyExpanded
		});
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
    	this.props.getOrders(this.props.token, nextPage);
  	}
	}
	
  render() {
		const { error, isLoadingOrders, totalPages } = this.props;
		let scope = this;
		let orderRows = [];
		if (this.props.orders) {
			this.props.orders.map(function(orderRow, i) {
  			let orderJSON = orderRow.toJSON();
				let expanded = (scope.state.expandedOrders.indexOf(orderJSON.orderId) >= 0) ? true : false;
				return orderRows.push(<Order data={orderJSON} expanded={expanded} key={`${orderJSON.orderId}-1`} onToggle={scope._onToggle} />);
				// orderRows.push(<OrderProducts data={orderRow} key={`${orderRow.orderId}-2`} />);
	    });
		}
    return (
			<Grid.Column width='16'>
				<OrdersNav pathname={this.props.location.pathname} />
				{error}
	      <Dimmer active={isLoadingOrders} inverted>
	        <Loader inverted>Loading</Loader>
	      </Dimmer>
		    <Table className='orders-table' sortable>
		      <Table.Header>
		        <Table.Row>
              <Table.HeaderCell><Checkbox></Checkbox></Table.HeaderCell>
              <Table.HeaderCell>Date</Table.HeaderCell>
              <Table.HeaderCell>Order #</Table.HeaderCell>
              <Table.HeaderCell>Customer</Table.HeaderCell>
              <Table.HeaderCell>Ship to</Table.HeaderCell>
							<Table.HeaderCell width={4}>Order Notes</Table.HeaderCell>										
							<Table.HeaderCell className='right aligned'>Total</Table.HeaderCell>
							<Table.HeaderCell>Bigcommerce Status</Table.HeaderCell>
							<Table.HeaderCell>Label</Table.HeaderCell>
							<Table.HeaderCell className='right aligned'>Items</Table.HeaderCell>
							<Table.HeaderCell className='right aligned'>&nbsp;</Table.HeaderCell>
		        </Table.Row>
		      </Table.Header>
		      <Table.Body>
						{orderRows}
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

export default withRouter(Orders);
