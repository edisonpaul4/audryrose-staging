import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Grid, Table, Dimmer, Loader, Checkbox } from 'semantic-ui-react';
import OrdersNav from './OrdersNav.js';
import Order from './Order.js';
import OrderDetails from './OrderDetails.js';
import Pagination from './Pagination.js';

class Orders extends Component {
  constructor(props) {
    super(props);
    let subpage = this.props.router.params.subpage;
  	let page = parseFloat(this.props.location.query.page);
  	if (!page) page = 1;
  	let sort = this.props.location.query.sort;
  	if (!sort) sort = 'date-added-desc';
  	let search = this.props.location.query.q;
//   	let filters = {designer: this.props.location.query.designer, price: this.props.location.query.price, class: this.props.location.query.class };
    this.state = {
      subpage: subpage,
			page: page,
			sort: sort,
// 			filters: filters,
			search: search,
			expandedOrders: []
    };
    this.handleToggleClick = this.handleToggleClick.bind(this);
    this.handlePaginationClick = this.handlePaginationClick.bind(this);
  }
	
	componentDidMount() {
		this.props.getOrders(this.props.token, this.state.subpage, this.state.page, this.state.sort, this.state.search);
	}
	
	handleToggleClick(orderId) {
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
	
	handleSortClick(sort) {
		this.setState({
  		sort: sort,
  		page: 1,
  		expandedOrders: []
		});
		
		const router = this.props.router;
		const queries = router.location.query;
		queries.sort = sort;
		queries.page = 1;
    router.replace({
      pathname: router.location.pathname,
      page: 1,
      query: queries
    });
    this.props.getOrders(this.props.token, this.state.subpage, 1,  sort, this.state.search);
	}
	
	componentWillReceiveProps(nextProps) {
  	let nextPage = parseFloat(nextProps.location.query.page);
  	if (!nextPage) nextPage = 1;
  	if (nextPage !== this.state.page) {
  		this.setState({
  			page: nextPage
  		});
    	this.props.getOrders(this.props.token, this.state.subpage, nextPage, this.state.sort, this.state.search);
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
				orderRows.push(<Order data={orderJSON} expanded={expanded} key={`${orderJSON.orderId}-1`} handleToggleClick={scope.handleToggleClick} />);
				if (expanded) orderRows.push(<OrderDetails data={orderJSON} expanded={expanded} key={`${orderJSON.orderId}-2`} />);
				return orderRows;
	    });
		}
    return (
			<Grid.Column width='16'>
				<OrdersNav pathname={this.props.location.pathname} />
				{error}
	      <Dimmer active={isLoadingOrders} inverted>
	        <Loader inverted>Loading</Loader>
	      </Dimmer>
		    <Table className='orders-table'>
		      <Table.Header>
		        <Table.Row>
              <Table.HeaderCell><Checkbox></Checkbox></Table.HeaderCell>
              <Table.HeaderCell>Date</Table.HeaderCell>
              <Table.HeaderCell>Order #</Table.HeaderCell>
              <Table.HeaderCell>Customer</Table.HeaderCell>
							<Table.HeaderCell>Order Notes</Table.HeaderCell>										
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
