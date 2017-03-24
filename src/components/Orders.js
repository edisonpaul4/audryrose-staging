import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Grid, Table, Dimmer, Loader, Checkbox, Icon, Header, Sidebar, Menu, Button } from 'semantic-ui-react';
import NotificationSystem from 'react-notification-system';
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
      updatedOrders: null,
			expandedOrders: [],
			isReloading: [],
			tabCounts: null,
			selectedRows: [],
			selectAllRows: false
    };
    this.handleToggleClick = this.handleToggleClick.bind(this);
    this.handleCheckboxClick = this.handleCheckboxClick.bind(this);
    this.handleSelectAllClick = this.handleSelectAllClick.bind(this);
    this.handleReloadClick = this.handleReloadClick.bind(this);
    this.handleCreateShipments = this.handleCreateShipments.bind(this);
    this.handleShipSelectedClick = this.handleShipSelectedClick.bind(this);
    this.handlePaginationClick = this.handlePaginationClick.bind(this);
    this._notificationSystem = null;
  }
	
	componentDidMount() {
  	this._notificationSystem = this.refs.notificationSystem;
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
	
	handleCheckboxClick(orderId) {
		let selectedRows = this.state.selectedRows;
		var index = selectedRows.indexOf(orderId);
		if (index >= 0) {
			selectedRows.splice(index, 1);
		} else {
			selectedRows.push(orderId);
		}
		this.setState({
			selectedRows: selectedRows
		});
	}
	
	handleSelectAllClick() {
  	let selectedRows;
  	let selectAllRows = this.state.selectAllRows;
  	if (this.state.selectAllRows) {
      selectedRows = [];
      selectAllRows = false;
  	} else {
    	selectedRows = this.state.orders.map(function(order, i) {
      	let orderJSON = order.toJSON();
      	return orderJSON.orderId;
    	});	
    	selectAllRows = true;
  	}
  	this.setState({
    	selectedRows: selectedRows,
    	selectAllRows: selectAllRows
  	});
	}
	
	handleShipSelectedClick() {
		console.log(this.state.selectedRows)
  	// Add shipment group order ids to currently reloading array
  	let reloadingOrderIds = this.state.isReloading;
		let currentlyReloading = reloadingOrderIds.concat(this.state.selectedRows);
		currentlyReloading = currentlyReloading.filter(function(v,i) { return currentlyReloading.indexOf(v) === i; });
		
  	this.setState({
    	isReloading: currentlyReloading
  	});
		this.props.batchCreateShipments(this.props.token, this.state.selectedRows);
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
	
	handleReloadClick(orderId) {
		let currentlyReloading = this.state.isReloading;
		const index = currentlyReloading.indexOf(orderId);
		if (index < 0) {
			currentlyReloading.push(orderId);
		}
  	this.setState({
    	isReloading: currentlyReloading
  	});
		this.props.reloadOrder(this.props.token, orderId);
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
	
	handleCreateShipments(shipmentGroups) {
  	// Add shipment group order ids to currently reloading array
  	var orderIds = shipmentGroups.map(function(obj) { return obj.orderProducts[0].order_id; });
    orderIds = orderIds.filter(function(v,i) { return orderIds.indexOf(v) === i; });
		let currentlyReloading = orderIds.concat(this.state.isReloading);
		currentlyReloading = currentlyReloading.filter(function(v,i) { return currentlyReloading.indexOf(v) === i; });
		
  	this.setState({
    	isReloading: currentlyReloading
  	});
  	this.props.createShipments(this.props.token, shipmentGroups);
	}
	
	componentWillReceiveProps(nextProps) {
  	let scope = this;
  	let nextPage = parseFloat(nextProps.location.query.page);
  	if (!nextPage) nextPage = 1;
  	let expandedOrders = this.state.expandedOrders;
  	
  	let orders = [];
  	let currentlyReloading = this.state.isReloading;
  	if (nextProps.updatedOrders) {
    	console.log('has updated orders');
      nextProps.orders.map(function(order, i) {
        const orderJSON = order.toJSON();
        let addUpdatedOrder;
        nextProps.updatedOrders.map(function(updatedOrder, i) {
        	// If updated product exists, push it into the state products array
        	const updatedOrderJSON = updatedOrder.toJSON();
        	if (updatedOrderJSON.orderId === orderJSON.orderId) addUpdatedOrder = updatedOrder;
        	return updatedOrder;
      	});
        if (addUpdatedOrder) {
          console.log('update order ' + addUpdatedOrder.get('orderId'));
          orders.push(addUpdatedOrder);
        } else {
          orders.push(order);
        }
        // If currently reloading and has successfully updated order, remove updated order
      	if (currentlyReloading.length && addUpdatedOrder) {
        	console.log('check for updated order')
        	const index = currentlyReloading.indexOf(addUpdatedOrder.get('orderId'));
          if (index >= 0) currentlyReloading.splice(index, 1);
        }
        return order;
      });
      
    } else {
      orders = nextProps.orders;
    }
    
  	// Update tab counts if available
  	const tabCounts = nextProps.tabCounts ? nextProps.tabCounts : this.state.tabCounts;
    
    // Reset on subpage navigation
  	const search = nextProps.router.params.subpage !== 'search' ? null : this.state.search;
  	expandedOrders = nextProps.router.params.subpage !== this.state.subpage ? [] : expandedOrders;
  	
		// Display any errors with notification system
		if (nextProps.errors) {
  		nextProps.errors.map(function(errorMessage, i) {
        scope._notificationSystem.addNotification({
          message: errorMessage,
          level: 'error',
          autoDismiss: 0,
          dismissible: true
        });
    		return errorMessage;
  		});
		}
  	
		this.setState({
  		subpage: nextProps.router.params.subpage,
			page: nextPage,
			search: search,
			orders: orders,
			updatedOrders: nextProps.updatedOrders,
			expandedOrders: expandedOrders,
			isReloading: currentlyReloading,
			tabCounts: tabCounts,
			selectedRows: [],
			selectAllRows: false
		});	
		
  	if (nextPage !== this.state.page || nextProps.router.params.subpage !== this.state.subpage) {
    	this.props.getOrders(this.props.token, nextProps.router.params.subpage, nextPage, this.state.sort, search);
  	}
	}
	
  render() {
		const { error, isLoadingOrders, totalPages, totalOrders } = this.props;
		let scope = this;
		let orderRows = [];
		const tabCounts = this.state.tabCounts;
    
		if (this.state.orders) {
			this.state.orders.map(function(orderRow, i) {
  			let orderJSON = orderRow.toJSON();
  			let isReloading = (scope.state.isReloading.indexOf(orderJSON.orderId) >= 0) ? true : false;
				let expanded = (scope.state.expandedOrders.indexOf(orderJSON.orderId) >= 0) ? true : false;
				let selected = (scope.state.selectedRows.indexOf(orderJSON.orderId) >= 0) ? true : false;
				orderRows.push(
				  <Order 
				    data={orderJSON} 
				    expanded={expanded} 
				    key={`${orderJSON.orderId}-1`} 
				    isReloading={isReloading} 
				    handleToggleClick={scope.handleToggleClick} 
				    handleCheckboxClick={scope.handleCheckboxClick} 
				    selected={selected}
			    />
		    );
				if (expanded) orderRows.push(
				  <OrderDetails 
				    data={orderJSON} 
				    expanded={expanded} 
				    key={`${orderJSON.orderId}-2`} 
				    isReloading={isReloading} 
				    handleReloadClick={scope.handleReloadClick} 
				    handleCreateShipments={scope.handleCreateShipments}
			    />
			    );
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
    const shipSelectedName = 'Create ' + this.state.selectedRows.length + ' Shipments';
    
    let batchShipEnabled = this.state.subpage === 'fully-shippable' || this.state.subpage === 'partially-shippable';
		
    return (
			<Grid.Column width='16'>
  			<NotificationSystem ref="notificationSystem" />
				<OrdersNav key={this.props.location.pathname} pathname={this.props.location.pathname} query={this.props.location.query} tabCounts={tabCounts} />
				{searchHeader}
				{error}
	      <Dimmer active={isLoadingOrders} inverted>
	        <Loader inverted>Loading</Loader>
	      </Dimmer>
  			<Sidebar.Pushable>
          <Sidebar as={Menu} size='small' animation='push' direction='top' visible={this.state.selectedRows.length > 0}>
            <Menu.Item>
              <Button disabled={!batchShipEnabled} color='olive' onClick={this.handleShipSelectedClick}><Icon name='shipping' /> {shipSelectedName}</Button>
            </Menu.Item>
          </Sidebar>
          <Sidebar.Pusher>
    		    <Table className='orders-table' sortable>
    		      <Table.Header>
    		        <Table.Row>
                  <Table.HeaderCell>
                    <Checkbox checked={this.state.selectAllRows} onClick={() => this.handleSelectAllClick()} />
                  </Table.HeaderCell>
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
  		    </Sidebar.Pusher>
		    </Sidebar.Pushable>
			</Grid.Column>
    );
  }
}

export default withRouter(Orders);
