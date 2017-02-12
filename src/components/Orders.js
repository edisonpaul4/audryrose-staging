import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Grid, Table, Dimmer, Loader, Checkbox, Menu } from 'semantic-ui-react';
import OrdersNav from './OrdersNav.js';
import Order from './Order.js';

class Orders extends Component {
  constructor(props) {
    super(props);

    this.state = {
			token: null,
			isLoadingOrders: null,
			orders: null,
			page: 1
    };
  }
	
	componentDidMount() {
		this.props.getOrders(this.props.token, 1);
	}
	
	handlePaginationClick(event) {
    event.preventDefault();
	  event.stopPropagation();
		var pageNum;
		switch (event.target.name) {
			case 'prev':
				pageNum = parseInt(event.target.name, 10) - 1;
				break;
			case 'next':
				pageNum = parseInt(event.target.name, 10) + 1;
				break;
			default :
				pageNum = parseInt(event.target.name, 10);
				break;
		}
		this.setState({
			page: pageNum
		});
		this.props.getOrders(this.props.token, pageNum);
	}
	
  render() {
		const { error, isLoadingOrders } = this.props;
		let orderRows = [];
		if (this.props.orders) {
			this.props.orders.map(function(orderRow, i) {
  			let orderJSON = orderRow.toJSON();
				// orderRow.expanded = (scope.state.expandedOrders.indexOf(orderRow.orderId) >= 0) ? true : false;
				return orderRows.push(<Order data={orderJSON} key={`${orderJSON.orderId}-1`} />);
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
					      <Menu pagination>
					        <Menu.Item name='prev' disabled={this.state.page === 1} onClick={this.handlePaginationClick} />
									<Menu.Item name='1' active={this.state.page === 1} onClick={this.handlePaginationClick} />
					        <Menu.Item name='2' active={this.state.page === 2} onClick={this.handlePaginationClick} />
					        <Menu.Item name='3' active={this.state.page === 3} onClick={this.handlePaginationClick} />
					        <Menu.Item name='4' active={this.state.page === 4} onClick={this.handlePaginationClick} />
									<Menu.Item name='next' disabled={this.state.page === 4} onClick={this.handlePaginationClick} />
					      </Menu>
							</Table.HeaderCell>
						</Table.Row>
					</Table.Footer>
		    </Table>
			</Grid.Column>
    );
  }
}

export default withRouter(Orders);
