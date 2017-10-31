import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Grid, Table, Dimmer, Loader, Icon, Button, Header } from 'semantic-ui-react';
import NotificationSystem from 'react-notification-system';
import Pagination from './Pagination.js';
import DesignersNav from './DesignersNav.js';
import VendorEditModal from './VendorEditModal.js';
import DesignerDetails from './DesignerDetails.js';
import DesignerOrderModal from './DesignerOrderModal.js';
import DesignerNotesModal from './DesignerNotesModal';

class Designer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      designerData: this.props.data,
      selectedVendorData: null,
      vendorEditModalOpen: false,
      vendorEditModalMode: null,
      email: this.props.data.email ? this.props.data.email : '',
      edited: false,
			saved: false
    };
    this.handleShowVendorEditFormClick = this.handleShowVendorEditFormClick.bind(this);
    this.handleShowVendorCreateFormClick = this.handleShowVendorCreateFormClick.bind(this);
    this.handleVendorEditModalClose = this.handleVendorEditModalClose.bind(this);
    this.handleSaveVendor = this.handleSaveVendor.bind(this);
    this.handleShowOrderFormClick = this.handleShowOrderFormClick.bind(this);
  }

	handleToggleClick(designerId) {
		this.props.handleToggleClick(designerId);
	}

	handleSaveVendor(data) {
		this.props.handleSaveVendor(data);
	}

  handleShowVendorEditFormClick(objectId) {
    const data = this.state.designerData;
    let selectedVendorData;
    data.vendors.map(function(vendor, i) {
      if (vendor.objectId === objectId) selectedVendorData = vendor;
      return vendor;
    });
    this.setState({
      selectedVendorData: selectedVendorData,
      vendorEditModalOpen: true,
      vendorEditModalMode: 'edit'
    });
  }

  handleShowVendorCreateFormClick(objectId) {
    this.setState({
      selectedVendorData: null,
      vendorEditModalOpen: true,
      vendorEditModalMode: 'create'
    });
  }

	handleVendorEditModalClose() {
    this.setState({
      selectedVendorData: null,
      vendorEditModalOpen: false
    });
	}

  handleShowOrderFormClick(designerId) {
    this.props.handleShowOrderFormClick(designerId);
  }

	componentWillReceiveProps(nextProps) {
  	if (nextProps.updatedDesigner) {
    	if (this.state.designerData.objectId === nextProps.updatedDesigner.objectId) {
      	this.setState({
        	designerData: nextProps.updatedDesigner,
        	edited: false,
        	saved: true
      	});
      }
  	}
	}
	render() {
  	const scope = this;
		const data = this.state.designerData;
		const totalVendorOrders = this.props.totalVendorOrders;
		const bcManageUrl = 'https://www.loveaudryrose.com/manage/products/brands/' + data.designerId + '/edit';
		const name = <a href={bcManageUrl} target="_blank" className='hover-icon'>{data.name} <Icon link name='configure' /></a>;

    const vendorEditModal =
      <VendorEditModal
        open={this.state.vendorEditModalOpen}
        designerData={data}
        handleSaveVendor={this.handleSaveVendor}
        handleVendorEditModalClose={this.handleVendorEditModalClose}
        vendorData={this.state.selectedVendorData}
        isLoading={this.props.isReloading}
        mode={this.state.vendorEditModalMode}
      />;

    const modalButtons = data.vendors ? data.vendors.map(function(vendor, i) {
      var buttonContent = 'Edit ' + vendor.name;
      return <Button size='mini' circular content={buttonContent} compact onClick={()=>scope.handleShowVendorEditFormClick(vendor.objectId)} key={i} />;
    }) : null;

    let expandIcon = this.props.expanded ? 'minus' : 'plus';
    const expandButton = totalVendorOrders > 0 ? <Button circular icon={expandIcon} basic size='mini' onClick={()=>this.handleToggleClick(data.objectId)} /> : null;

    return (
      <Table.Row disabled={this.props.isSaving} positive={this.state.saved && !this.state.edited ? true : false} >
        <Table.Cell verticalAlign='top' singleLine>
          <img src={data.image_file ? 'https://cdn6.bigcommerce.com/s-jfssqt/images/stencil/378x441/' + data.image_file : '/imgs/no-image.png'} width='80' alt={data.name} />
        </Table.Cell>
        <Table.Cell verticalAlign='top'>{name}</Table.Cell>
				<Table.Cell verticalAlign='top'>{data.abbreviation}</Table.Cell>

				<Table.Cell>
					{this.props.data.orderHasNotes ? 'D' : ''}
				</Table.Cell>

        <Table.Cell singleLine className='right aligned'>
      	    {modalButtons}
      	    <Button
      	      size='mini'
      	      icon='plus'
      	      content='Add Vendor'
      	      basic
      	      compact
      	      circular
      	      onClick={()=>scope.handleShowVendorCreateFormClick(data.objectId)}
    	      />
    	    {vendorEditModal}
  	    </Table.Cell>
        <Table.Cell>
          <Button content='Order' size='mini' primary compact onClick={()=>this.handleShowOrderFormClick(data.objectId)} />
        </Table.Cell>
				<Table.Cell className='right aligned'>{expandButton}</Table.Cell>
      </Table.Row>
    );
  }
}

class Designers extends Component {
  constructor(props) {
    super(props);
    let search = this.props.location.query.q;
    this.state = {
      subpage: this.props.router.params.subpage,
			page: this.props.location.query.page ? this.props.location.query.page : 1,
			search: search,
			designers: null,
			products: null,
      expanded: [],
      designerOrderOpen: false,
      designerOrderData: {},
      designerOrderFormIsLoading: false,
      isReloading: [],
			isSavingDesigners: [],
			successMessages: [],
			errors: []
    };
    this.handlePaginationClick = this.handlePaginationClick.bind(this);
    this.handleSaveVendor = this.handleSaveVendor.bind(this);
    this.handleSaveVendorOrder = this.handleSaveVendorOrder.bind(this);
    this.handleSendVendorOrder = this.handleSendVendorOrder.bind(this);
    this.handleToggleClick = this.handleToggleClick.bind(this);
    this.handleShowOrderFormClick = this.handleShowOrderFormClick.bind(this);
    this.handleAddToVendorOrder = this.handleAddToVendorOrder.bind(this);
    this.handleDesignerOrderModalClose = this.handleDesignerOrderModalClose.bind(this);
    this._notificationSystem = null;
  }

	componentDidMount() {
  	this._notificationSystem = this.refs.notificationSystem;
		this.props.getDesigners(this.props.token, this.state.subpage, this.state.page, this.state.search);
	}

	handleToggleClick(designerId) {
		let currentlyExpanded = this.state.expanded;
		var index = currentlyExpanded.indexOf(designerId);
		if (index >= 0) {
			currentlyExpanded.splice(index, 1);
		} else {
			currentlyExpanded.push(designerId);
		}
		this.setState({
			expanded: currentlyExpanded
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

	handleSaveVendor(data) {
		let currentlySaving = this.state.isSavingDesigners;
		const index = currentlySaving.indexOf(data.designerId);
		if (index < 0) {
			currentlySaving.push(data.designerId);
		}
  	this.setState({
    	isSavingDesigners: currentlySaving
  	});
		this.props.saveVendor(this.props.token, data);
	}

	handleSaveVendorOrder(data) {
		let currentlySaving = this.state.isSavingDesigners;
		const index = currentlySaving.indexOf(data.designerId);
		if (index < 0) {
			currentlySaving.push(data.designerId);
		}
  	this.setState({
    	isSavingDesigners: currentlySaving
  	});
		this.props.saveVendorOrder(this.props.token, data);
	}

	handleSendVendorOrder(data) {
		let currentlySaving = this.state.isSavingDesigners;
		const index = currentlySaving.indexOf(data.designerId);
		if (index < 0) {
			currentlySaving.push(data.designerId);
		}
  	this.setState({
    	isSavingDesigners: currentlySaving
  	});
		this.props.sendVendorOrder(this.props.token, data);
	}

  handleShowOrderFormClick(designerId) {
    let designerOrderData = {};
    this.setState({
      designerOrderOpen: true,
      designerOrderData: designerOrderData,
      designerOrderFormIsLoading: true
    });
    this.props.getDesignerProducts(this.props.token, designerId);
  }

  handleAddToVendorOrder(orders, designerId) {
    let currentlySaving = this.state.isSavingDesigners;
    const index = currentlySaving.indexOf(designerId);
    if (index < 0) {
      currentlySaving.push(designerId);
    }
    this.setState({
      isSavingDesigners: currentlySaving
    });
    this.props.addDesignerProductToVendorOrder(this.props.token, orders, designerId);
	}
	
	handleCompleteVendorOrder(vendorOrderNumber){
		console.log(`Designers::handleCompleteVendorOrder => Call action with vendorOrderNumber: ${vendorOrderNumber}`);
		this.props.completeVendorOrder(this.props.token, vendorOrderNumber);
	}

	handleDeleteProductFromVendorOrder(productObjectId, vendorOrderNumber, objectId){
		console.log(`Designers::handleDeleteProductFromOrder => Call action with productObjectId: ${productObjectId}, vendorOrderNumber: ${vendorOrderNumber} and designer objectId ${objectId}`);
		this.props.deleteProductFromVendorOrder(this.props.token, productObjectId, vendorOrderNumber, objectId);
	}

  handleDesignerOrderModalClose(data) {
    this.setState({
      designerOrderOpen: false,
      designerOrderData: {},
      designerOrderFormIsLoading: false
    });
  }

	componentWillReceiveProps(nextProps) {
  	const scope = this;
  	let nextPage = parseFloat(nextProps.location.query.page);
  	if (!nextPage) nextPage = 1;
  	let expanded = this.state.expanded;

  	let designers = nextProps.designers ? nextProps.designers : this.state.designers;

    let designerOrderData = nextProps.designerOrderData ? nextProps.designerOrderData : this.state.designerOrderData;

    let isSavingDesigners = this.state.isSavingDesigners;
  	if (nextProps.updatedDesigner) {
    	const updatedDesigner = nextProps.updatedDesigner;
    	if (isSavingDesigners.length) {
      	const index = isSavingDesigners.indexOf(updatedDesigner.objectId);
        if (index >= 0) isSavingDesigners.splice(index, 1);
      }
    }

 		// Display any success messages
		let successMessages = this.state.successMessages;
		if (nextProps.successMessage) {
  		var successMessageExists = false;
  		successMessages.map(function(successMessage, i) {
    		if (successMessage === nextProps.successMessage) successMessageExists = true;
        return successMessage;
      });
      if (!successMessageExists) {
        this._notificationSystem.addNotification({
          message: nextProps.successMessage,
          level: 'success',
          autoDismiss: 0,
          dismissible: true
        });
        successMessages.push(nextProps.successMessage);
      }
		}

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

  	// Reset on subpage navigation
  	const search = nextProps.router.params.subpage !== 'search' ? null : this.state.search;
  	expanded = nextProps.router.params.subpage !== this.state.subpage ? [] : expanded;

		this.setState({
			subpage: nextProps.router.params.subpage,
			designers: designers,
			page: nextPage,
			search: search,
			expanded: expanded,
      designerOrderData: designerOrderData,
      designerOrderFormIsLoading: nextProps.designerOrderFormIsLoading,
			isSavingDesigners: isSavingDesigners,
			successMessages: successMessages,
			errors: errors
		});

		if (nextPage !== this.state.page || nextProps.router.params.subpage !== this.state.subpage) {
    	this.props.getDesigners(this.props.token, nextProps.router.params.subpage, nextPage, this.state.search);
  	}

	}

  render() {
    const scope = this;
		const { error, isLoadingDesigners, totalPages } = this.props;
		const { designers, subpage } = this.state;
		let designerRows = [];

		if (designers) {
			designers.map(function(designer, i) {
  			let isSaving = scope.state.isSavingDesigners.indexOf(designer.objectId) >= 0 ? true : false;
				let expanded = (scope.state.expanded.indexOf(designer.objectId) >= 0 || scope.state.search/*  || scope.state.subpage === 'pending' || scope.state.subpage === 'sent' */) ? true : false;

				let orderHasNotes = false;
				if (designer.vendorOrders.length > 0)
					orderHasNotes = designer.vendorOrders.every(vo => !vo.order.vendorOrderVariants.every(vov => vov.notes === ''));
					
        const designerData = {
          abbreviation: designer.abbreviation,
          designerId: designer.designerId,
          hasPendingVendorOrder: designer.hasPendingVendorOrder,
          hasSentVendorOrder: designer.hasSentVendorOrder,
          image_file: designer.image_file,
          name: designer.name,
          objectId: designer.objectId,
          updatedAt: designer.updatedAt,
					vendors: designer.vendors,
					orderHasNotes
        }

				designerRows.push(
				  <Designer
				    data={designerData}
				    totalVendorOrders={designer.vendorOrders ? designer.vendorOrders.length : 0}
				    isSaving={isSaving}
				    expanded={expanded}
				    handleSaveVendor={scope.handleSaveVendor}
				    handleToggleClick={scope.handleToggleClick}
            handleShowOrderFormClick={scope.handleShowOrderFormClick}
				    key={`${designer.designerId}-1`}
						activeSubpage={scope.state.subpage}
			    />
		    );

				if (expanded) {
          const designerDetailsData = {
            name: designer.name,
            objectId: designer.objectId,
            vendorOrders: designer.vendorOrders
          }
  				designerRows.push(
  				  <DesignerDetails
  				    data={designerDetailsData}
  				    subpage={subpage}
  				    expanded={expanded}
  				    key={`${designer.designerId}-2`}
  				    isSaving={isSaving}
  				    handleSaveVendorOrder={scope.handleSaveVendorOrder}
  				    handleSendVendorOrder={scope.handleSendVendorOrder}
							handleCompleteVendorOrder={scope.handleCompleteVendorOrder.bind(scope)}
							handleDeleteProductFromVendorOrder={scope.handleDeleteProductFromVendorOrder.bind(scope)}
				    />
			    );
				}
				return designer;
	    });
		}

		const searchHeader = this.state.search ? <Header as='h2'>{designers ? designers.length : 0} results for "{this.state.search}"</Header> : null;

    const designerOrderModal = this.state.designerOrderData && this.state.designerOrderOpen === true ? <DesignerOrderModal
        open={this.state.designerOrderOpen}
        handleAddToVendorOrder={this.handleAddToVendorOrder}
        handleDesignerOrderModalClose={this.handleDesignerOrderModalClose}
        designerOrderData={this.state.designerOrderData}
        isLoading={this.state.designerOrderFormIsLoading}
      /> : null;

    return (
			<Grid.Column width='16'>
  			<NotificationSystem ref="notificationSystem" />
  			<DesignersNav key={this.props.location.pathname} pathname={this.props.location.pathname} query={this.props.location.query} />
				{error}
	      <Dimmer active={isLoadingDesigners} inverted>
	        <Loader inverted>Loading</Loader>
	      </Dimmer>
	      {searchHeader}
		    <Table className='orders-table'>
		      <Table.Header>
		        <Table.Row>
              <Table.HeaderCell>Image</Table.HeaderCell>
              <Table.HeaderCell>Name</Table.HeaderCell>
							<Table.HeaderCell>Abbreviation</Table.HeaderCell>
							<Table.HeaderCell>Notes</Table.HeaderCell>
							<Table.HeaderCell className='right aligned'>Vendors</Table.HeaderCell>
              <Table.HeaderCell className='right aligned'>&nbsp;</Table.HeaderCell>
							<Table.HeaderCell className='right aligned'>&nbsp;</Table.HeaderCell>
		        </Table.Row>
		      </Table.Header>
		      <Table.Body>
						{designerRows}
		      </Table.Body>
					<Table.Footer fullWidth>
						<Table.Row>
							<Table.HeaderCell colSpan='11'>
					      <Pagination page={this.state.page} onPaginationClick={this.handlePaginationClick} totalPages={totalPages} />
							</Table.HeaderCell>
						</Table.Row>
					</Table.Footer>
		    </Table>
        {designerOrderModal}
			</Grid.Column>
    );
  }
}

export default withRouter(Designers);
