import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Grid, Table, Dimmer, Loader, Checkbox, Icon, Header } from 'semantic-ui-react';
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
      orders: null,
//       filterData: null,
      updatedOrder: null,
			expandedOrders: [],
			isReloading: []
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
  	let expandedOrders = this.state.expandedOrders;
  	
  	let orders = [];
  	let currentlyReloading = this.state.isReloading;
  	if (nextProps.updatedOrder) {
    	// If updated product exists, push it into the state products array
    	const updatedOrderJSON = nextProps.updatedOrder.toJSON();
      nextProps.orders.map(function(order, i) {
        const orderJSON = order.toJSON();
        if (updatedOrderJSON.orderId === orderJSON.orderId) {
          orders.push(nextProps.updatedOrder);
        } else {
          orders.push(order);
        }
        return order;
      });
      
      // If currently reloading and has successfully updated product, remove updated product
    	if (currentlyReloading.length) {
      	const index = currentlyReloading.indexOf(updatedOrderJSON.orderId);
        if (index >= 0) currentlyReloading.splice(index, 1);
      }
      
    } else {
      orders = nextProps.orders;
    }
  	
/*
  	if (nextPage !== this.state.page) {
  		this.setState({
  			page: nextPage
  		});
    	this.props.getOrders(this.props.token, this.state.subpage, nextPage, this.state.sort, this.state.search);
  	}
*/
  	
/*
  	// Process filters data
  	var filterData = null;
  	if (nextProps.filterData && !this.state.filterData) {
    	var designers = nextProps.filterData.designers.map(function(designer) {
      	return designer.toJSON();
    	});
    	var classes = nextProps.filterData.classes.map(function(classObj) {
      	return classObj.toJSON();
    	});
    	filterData = {designers: designers, classes: classes};
  	}
*/
  	const search = nextProps.router.params.subpage !== 'search' ? null : this.state.search;
  	
		this.setState({
  		subpage: nextProps.router.params.subpage,
			page: nextPage,
			search: search,
			orders: orders,
// 			filterData: filterData ? filterData : this.state.filterData,
			updatedOrder: nextProps.updatedOrder,
			expandedOrders: expandedOrders,
			isReloading: currentlyReloading
		});	
		
  	if (nextPage !== this.state.page || nextProps.router.params.subpage !== this.state.subpage) {
    	expandedOrders = [];
    	this.props.getOrders(this.props.token, nextProps.router.params.subpage, nextPage, this.state.sort, search);
  	}
	}
	
  render() {
		const { error, isLoadingOrders, totalPages, totalOrders } = this.props;
		let scope = this;
		let orderRows = [];
		if (this.state.orders) {
			this.state.orders.map(function(orderRow, i) {
  			let orderJSON = orderRow.toJSON();
				let expanded = (scope.state.expandedOrders.indexOf(orderJSON.orderId) >= 0) ? true : false;
				orderRows.push(<Order data={orderJSON} expanded={expanded} key={`${orderJSON.orderId}-1`} handleToggleClick={scope.handleToggleClick} />);
				if (expanded) orderRows.push(<OrderDetails data={orderJSON} expanded={expanded} key={`${orderJSON.orderId}-2`} />);
				return orderRows;
	    });
		}
		
		// Get sort column name without sort direction
		let sortColumn = '';
		sortColumn = (this.state.sort.includes('date-added')) ? 'date-added' : sortColumn;
		sortColumn = (this.state.sort.includes('total')) ? 'total' : sortColumn;
		
    const searchHeader = this.state.search ? <Header as='h2'>{totalOrders} results for "{this.props.location.query.q}"</Header> : null;
    const dateIcon = this.state.sort === 'date-added-desc' || this.state.sort === 'date-added-asc' ? null : <Icon disabled name='caret down' />;
    const totalIcon = this.state.sort === 'total-desc' || this.state.sort === 'total-asc' ? null : <Icon disabled name='caret down' />;
		
		console.log(this.props.location.query)
    return (
			<Grid.Column width='16'>
				<OrdersNav key={this.props.location.pathname} pathname={this.props.location.pathname} query={this.props.location.query} />
				{searchHeader}
				{error}
	      <Dimmer active={isLoadingOrders} inverted>
	        <Loader inverted>Loading</Loader>
	      </Dimmer>
		    <Table className='orders-table' sortable>
		      <Table.Header>
		        <Table.Row>
              <Table.HeaderCell><Checkbox></Checkbox></Table.HeaderCell>
              <Table.HeaderCell 
                sorted={sortColumn === 'date-added' ? (this.state.sort === 'date-added-asc' ? 'ascending' : 'descending') : null} 
                onClick={this.state.sort === 'date-added-desc' ? ()=>this.handleSortClick('date-added-asc') : ()=>this.handleSortClick('date-added-desc')}>
                Date {dateIcon}
              </Table.HeaderCell>
              <Table.HeaderCell>Order #</Table.HeaderCell>
              <Table.HeaderCell>Customer</Table.HeaderCell>
							<Table.HeaderCell>Order Notes</Table.HeaderCell>
              <Table.HeaderCell 
                className='right aligned'
                sorted={sortColumn === 'total' ? (this.state.sort === 'total-asc' ? 'ascending' : 'descending') : null} 
                onClick={this.state.sort === 'total-desc' ? ()=>this.handleSortClick('total-asc') : ()=>this.handleSortClick('total-desc')}>
                Total {totalIcon}
              </Table.HeaderCell>
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
