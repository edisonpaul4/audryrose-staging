import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Grid, Table, Dimmer, Loader, Checkbox, Icon, Header, Sidebar, Menu, Button } from 'semantic-ui-react';
import NotificationSystem from 'react-notification-system';
import OrdersNav from './OrdersNav.js';
import Order from './Order.js';
import OrderDetails from './OrderDetails.js';
import Pagination from './Pagination.js';
import ProductOrderModal from './ProductOrderModal.js';

class Orders extends Component {
  constructor(props) {
    super(props);
    let subpage = this.props.router.params.subpage;
  	let page = parseFloat(this.props.location.query.page);
  	if (!page) page = 1;
  	let sort = this.props.location.query.sort;
  	if (subpage === 'fulfilled' && !sort) {
    	sort = 'date-shipped-desc';
  	} else if (!sort) {
    	sort = 'date-added-desc';
  	}
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
			isGeneratingFile: false,
			tabCounts: null,
			selectedRows: [],
			selectAllRows: false,
			generatedFile: null,
			productOrderOpen: false,
			productOrderData: {},
			errors: [],
			files: [],
			product: null
    };
    this._notificationSystem = null;
    this.handleToggleClick = this.handleToggleClick.bind(this);
    this.handleCheckboxClick = this.handleCheckboxClick.bind(this);
    this.handleSelectAllClick = this.handleSelectAllClick.bind(this);
    this.handleReloadClick = this.handleReloadClick.bind(this);
    this.handleCreateShipments = this.handleCreateShipments.bind(this);
    this.handleShipSelectedClick = this.handleShipSelectedClick.bind(this);
    this.handlePrintSelectedClick = this.handlePrintSelectedClick.bind(this);
    this.handlePaginationClick = this.handlePaginationClick.bind(this);
    this.handleAddToVendorOrder = this.handleAddToVendorOrder.bind(this);
    this.handleCreateResize = this.handleCreateResize.bind(this);
    this.handleShowOrderFormClick = this.handleShowOrderFormClick.bind(this);
    this.handleProductOrderModalClose = this.handleProductOrderModalClose.bind(this);
    this.handleDateNeededChange = this.handleDateNeededChange.bind(this);
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
//       	let orderJSON = order.toJSON();
      	return order.orderId;
    	});	
    	selectAllRows = true;
  	}
  	this.setState({
    	selectedRows: selectedRows,
    	selectAllRows: selectAllRows
  	});
	}
	
	handleShipSelectedClick() {
  	// Add order ids to currently reloading array
  	let reloadingOrderIds = this.state.isReloading;
		let currentlyReloading = reloadingOrderIds.concat(this.state.selectedRows);
		currentlyReloading = currentlyReloading.filter(function(v,i) { return currentlyReloading.indexOf(v) === i; });
		
  	this.setState({
    	isReloading: currentlyReloading
  	});
		this.props.batchCreateShipments(this.props.token, this.state.selectedRows);
	}
	
	handlePrintSelectedClick() {
		this.props.batchPrintShipments(this.props.token, this.state.selectedRows);
		this.setState({
  		isGeneratingFile: true
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
	
	handleAddToVendorOrder(orders, orderId, orderProductId) {
  	let currentlyReloading = this.state.isReloading;
    if (orderId) {
  		const index = currentlyReloading.indexOf(orderId);
  		if (index < 0) {
  			currentlyReloading.push(orderId);
  		}
		}
  	this.setState({
    	isReloading: currentlyReloading,
      productOrderOpen: false,
      productOrderData: {}
  	});
		this.props.addOrderProductToVendorOrder(this.props.token, orders, orderId, orderProductId);
	}
	
	handleCreateResize(resizes, orderId) {
  	let currentlyReloading = this.state.isReloading;
    if (orderId) {
  		const index = currentlyReloading.indexOf(orderId);
  		if (index < 0) {
  			currentlyReloading.push(orderId);
  		}
		}
  	this.setState({
    	isReloading: currentlyReloading,
      productOrderOpen: false,
      productOrderData: {}
  	});
		this.props.createResize(this.props.token, resizes, orderId);
	}
	
	handleDateNeededChange(data) {
  	let currentlyReloading = this.state.isReloading;
    if (data.orderId) {
  		const index = currentlyReloading.indexOf(data.orderId);
  		if (index < 0) {
  			currentlyReloading.push(data.orderId);
  		}
		}
  	this.setState({
    	isReloading: currentlyReloading
  	});
		this.props.saveOrder(this.props.token, data);
	}
	
	handleShowOrderFormClick(data) {
  	let productOrderData = this.state.productOrderData;
  	if (data.variant) productOrderData.variant = data.variant.objectId;
  	if (data.orderId) productOrderData.orderId = data.orderId;
  	if (data.orderProductId) productOrderData.orderProductId = data.orderProductId;
  	if (data.resize !== undefined) productOrderData.resize = data.resize;
  	this.props.getProduct(this.props.token, data.productId);
    this.setState({
      productOrderOpen: true,
      productOrderData: productOrderData
    });
	}
	
	handleProductOrderModalClose(data) {
    this.setState({
      productOrderOpen: false,
      productOrderData: {}
    });
	}
	
	componentWillReceiveProps(nextProps) {
  	let scope = this;
  	let nextPage = parseFloat(nextProps.location.query.page);
  	if (!nextPage) nextPage = 1;
  	let expandedOrders = this.state.expandedOrders;
  	
  	let currentOrders = this.state.orders;
  	if (nextProps.orders) {
    	currentOrders = nextProps.orders.map(function(order, i) {
      	return order.toJSON();
    	});
  	}
  	let orders = [];
  	let currentlyReloading = this.state.isReloading;
  	
  	if (nextProps.updatedOrders) {
      currentOrders.map(function(order, i) {
        let addUpdatedOrder;
        nextProps.updatedOrders.map(function(updatedOrder, i) {
        	// If updated product exists, push it into the state products array
        	if (updatedOrder.get('orderId') === order.orderId) addUpdatedOrder = updatedOrder.toJSON();
        	return updatedOrder;
      	});
        if (addUpdatedOrder) {
          orders.push(addUpdatedOrder);
        } else {
          orders.push(order);
        }
        // If currently reloading and has successfully updated order, remove updated order
      	if (currentlyReloading.length && addUpdatedOrder) {
        	const index = currentlyReloading.indexOf(addUpdatedOrder.orderId);
          if (index >= 0) currentlyReloading.splice(index, 1);
        }
        return order;
      });
      
    } else {
      orders = currentOrders;
    }
    
  	// Update tab counts if available
  	const tabCounts = nextProps.tabCounts ? nextProps.tabCounts : this.state.tabCounts;
    
    // Reset on subpage navigation
  	const search = nextProps.router.params.subpage !== 'search' ? null : this.state.search;
  	expandedOrders = nextProps.router.params.subpage !== this.state.subpage ? [] : expandedOrders;
  	
		// Display any errors
		let errors = [];
		if (nextProps.errors) {
  		nextProps.errors.map(function(errorMessage, i) {
    		var errorExists = false;
    		scope.state.errors.map(function(error, j) {
      		if (errorMessage === error) errorExists = true;
          return error;
        });
        if (!errorExists) {
          scope._notificationSystem.addNotification({
            message: errorMessage,
            level: 'error',
            autoDismiss: 0,
            dismissible: true
          });
        }
    		return errorMessage;
  		});
      errors = nextProps.errors.length > 0 ? nextProps.errors : this.state.errors;
		} else {
  		errors = this.state.errors;
		}
		
		// Display generated files with notification system
		const generatedFile = nextProps.generatedFile ? nextProps.generatedFile : this.state.generatedFile;
		let isGeneratingFile = this.state.isGeneratingFile;
		if (nextProps.generatedFile && nextProps.generatedFile !== this.state.generatedFile) {
      this._notificationSystem.addNotification({
        message: 'You have a new file ready to print.',
        level: 'success',
        autoDismiss: 0,
        dismissible: true,
        action: {
          label: 'Print File',
          callback: function() {
            window.open(nextProps.generatedFile);
          }
        }
      });
      isGeneratingFile = false;
		}
		
		// Display files
  	let files = this.state.files ? this.state.files : [];
  	let newFiles = [];
  	if (nextProps.newFiles) {
      nextProps.newFiles.map(function(newFile, i) {
        const newFileJSON = newFile.toJSON();
        let addUpdatedFile = true;
        nextProps.files.map(function(file, i) {
        	// If new file exists, don't push it into the array
        	const fileJSON = file.toJSON();
        	if (newFileJSON.objectId === fileJSON.objectId) addUpdatedFile = false;
        	return file;
      	});
        if (addUpdatedFile) {
          newFiles.push(newFile);
        }
        return newFile;
      });
      files = files.concat(newFiles);
    } else {
      files = nextProps.files;
    }
    
    let product = this.state.product;
    let productOrderData = this.state.productOrderData;
    if (nextProps.product) {
      product = nextProps.product.toJSON();
      productOrderData.product = product;
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
			selectAllRows: false,
			generatedFile: generatedFile,
			isGeneratingFile: isGeneratingFile,
			errors: errors,
			files: files,
			product: product,
			productOrderData: productOrderData
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
		const files = this.state.files;
    
		if (this.state.orders) {
			this.state.orders.map(function(order, i) {
  			let isReloading = (scope.state.isReloading.indexOf(order.orderId) >= 0) ? true : false;
				let expanded = (scope.state.expandedOrders.indexOf(order.orderId) >= 0) ? true : false;
				let selected = (scope.state.selectedRows.indexOf(order.orderId) >= 0) ? true : false;
				
				// Create Order rows with simpilified order data object
				let orderData = {
          status: order.status,
          fullyShippable: order.fullyShippable,
          partiallyShippable: order.partiallyShippable,
          resizable: order.resizable,
          date_created: order.date_created,
          date_shipped: order.date_shipped,
          dateNeeded: order.dateNeeded,
          customer_id: order.customer_id,
          billing_address: order.billing_address,
          orderId: order.orderId,
          customer_message: order.customer_message,
          total_inc_tax: order.total_inc_tax,
          items_total: order.items_total
				};
				orderRows.push(
				  <Order 
				    subpage={scope.state.subpage}
				    data={orderData} 
				    expanded={expanded} 
				    key={`${orderData.orderId}-1`} 
				    isReloading={isReloading} 
				    handleToggleClick={scope.handleToggleClick} 
				    handleCheckboxClick={scope.handleCheckboxClick} 
				    handleDateNeededChange={scope.handleDateNeededChange}
				    selected={selected}
			    />
		    );
		    
		    // Create OrderDetails rows
				if (expanded) orderRows.push(
				  <OrderDetails 
  				  subpage={scope.state.subpage} 
				    data={order} 
				    expanded={expanded} 
				    key={`${order.orderId}-2`} 
				    isReloading={isReloading} 
				    handleReloadClick={scope.handleReloadClick} 
				    handleCreateShipments={scope.handleCreateShipments}
				    handleAddToVendorOrder={scope.handleAddToVendorOrder} 
				    handleCreateResize={scope.handleCreateResize} 
				    handleShowOrderFormClick={scope.handleShowOrderFormClick} 
				    handleProductOrderModalClose={scope.handleProductOrderModalClose} 
			    />
		    );
				return orderRows;
	    });
		}
		
		// Get sort column name without sort direction
		let sortColumn = '';
		sortColumn = (this.state.sort.includes('date-added')) ? 'date-added' : sortColumn;
		sortColumn = (this.state.sort.includes('date-needed')) ? 'date-needed' : sortColumn;
		sortColumn = (this.state.sort.includes('date-shipped')) ? 'date-shipped' : sortColumn;
		sortColumn = (this.state.sort.includes('total')) ? 'total' : sortColumn;
		
    const searchHeader = this.state.search ? <Header as='h2'>{totalOrders} results for "{this.props.location.query.q}"</Header> : null;
    const dateIcon = this.state.sort === 'date-added-desc' || this.state.sort === 'date-added-asc' ? null : <Icon disabled name='caret down' />;
    const dateNeededIcon = this.state.sort === 'date-needed-desc' || this.state.sort === 'date-needed-asc' ? null : <Icon disabled name='caret down' />;
    const dateShippedIcon = this.state.sort === 'date-shipped-desc' || this.state.sort === 'date-shipped-asc' ? null : <Icon disabled name='caret down' />;
    const totalIcon = this.state.sort === 'total-desc' || this.state.sort === 'total-asc' ? null : <Icon disabled name='caret down' />;
    const shipSelectedName = 'Create ' + this.state.selectedRows.length + ' Shipments';
    const printSelectedName = 'Print ' + this.state.selectedRows.length + ' Orders';
    
    let batchShipEnabled = (this.state.subpage === 'fully-shippable' || this.state.subpage === 'partially-shippable' || this.state.subpage === 'search') && this.state.isReloading.length <= 0;
    const batchShipButton = this.state.subpage === 'fully-shippable' || this.state.subpage === 'partially-shippable' || this.state.subpage === 'search' ? <Button circular basic disabled={!batchShipEnabled} loading={!batchShipEnabled} color='olive' onClick={this.handleShipSelectedClick}><Icon name='shipping' /> {shipSelectedName}</Button> : null;
    const batchPrintButton = this.state.subpage === 'fulfilled' ? <Button circular basic disabled={this.state.isGeneratingFile} loading={this.state.isGeneratingFile} primary onClick={this.handlePrintSelectedClick}><Icon name='print' /> {printSelectedName}</Button> : null;
    
    const dateShippedColumn = this.state.subpage === 'fulfilled' ? 
      <Table.HeaderCell 
        sorted={sortColumn === 'date-shipped' ? (this.state.sort === 'date-shipped-asc' ? 'ascending' : 'descending') : null} 
        onClick={this.state.sort === 'date-shipped-desc' ? ()=>this.handleSortClick('date-shipped-asc') : ()=>this.handleSortClick('date-shipped-desc')}>
        Date Shipped {dateShippedIcon}
      </Table.HeaderCell> : null;
      
    const productOrderModal = this.state.productOrderData ? <ProductOrderModal 
        open={this.state.productOrderOpen}
        handleAddToVendorOrder={this.handleAddToVendorOrder} 
        handleCreateResize={this.handleCreateResize} 
        handleProductOrderModalClose={this.handleProductOrderModalClose} 
        handleProductOrder={this.handleProductOrder} 
        productOrderData={this.state.productOrderData} 
        isLoading={this.props.isReloading}
      /> : null;
		
    return (
			<Grid.Column width='16'>
  			<NotificationSystem ref="notificationSystem" />
				<OrdersNav key={this.props.location.pathname} pathname={this.props.location.pathname} query={this.props.location.query} tabCounts={tabCounts} files={files} />
				{searchHeader}
				{error}
	      <Dimmer active={isLoadingOrders} inverted>
	        <Loader inverted>Loading</Loader>
	      </Dimmer>
  			<Sidebar.Pushable>
          <Sidebar as={Menu} borderless size='small' animation='push' direction='top' visible={this.state.selectedRows.length > 0}>
            <Menu.Item>
              {batchShipButton}
              {batchPrintButton}
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
                  <Table.HeaderCell 
                    sorted={sortColumn === 'date-needed' ? (this.state.sort === 'date-needed-asc' ? 'ascending' : 'descending') : null} 
                    onClick={this.state.sort === 'date-needed-desc' ? ()=>this.handleSortClick('date-needed-asc') : ()=>this.handleSortClick('date-needed-desc')}>
                    Date Needed By {dateNeededIcon}
                  </Table.HeaderCell>
                  {dateShippedColumn}
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
		    {productOrderModal}
			</Grid.Column>
    );
  }
}

export default withRouter(Orders);
