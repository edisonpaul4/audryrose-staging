import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Grid, Table, Dimmer, Loader, Icon, Button } from 'semantic-ui-react';
import NotificationSystem from 'react-notification-system';
import Pagination from './Pagination.js';
import DesignersNav from './DesignersNav.js';
import VendorEditModal from './VendorEditModal.js';
import DesignerDetails from './DesignerDetails.js';

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
		const bcManageUrl = 'https://www.loveaudryrose.com/manage/products/brands/' + data.designerId + '/edit';
		const name = <a href={bcManageUrl} target="_blank">{data.name} <Icon link name='configure' /></a>;
		
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
    
    return (
      <Table.Row disabled={this.props.isSaving} positive={this.state.saved && !this.state.edited ? true : false} >
        <Table.Cell verticalAlign='top' singleLine>
          <img src={data.image_file ? 'https://cdn6.bigcommerce.com/s-jfssqt/images/stencil/378x441/' + data.image_file : '/imgs/no-image.png'} width='80' alt={data.name} />
        </Table.Cell>
        <Table.Cell verticalAlign='top'>{name}</Table.Cell>
				<Table.Cell verticalAlign='top'>{data.abbreviation}</Table.Cell>
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
				<Table.Cell className='right aligned'>
				  <Button 
				    circular 
				    icon={expandIcon} 
				    basic 
				    size='mini' 
				    onClick={()=>this.handleToggleClick(data.objectId)} 
			    />
			  </Table.Cell>
      </Table.Row>
    );
  }
}

class Designers extends Component {
  constructor(props) {
    super(props);

    this.state = {
      subpage: this.props.router.params.subpage,
			page: null,
			designers: null,
			products: null,
			updatedDesigner: null,
      expanded: [],
      isReloading: [],
			isSavingDesigners: [],
			successMessage: null
    };
    this.handlePaginationClick = this.handlePaginationClick.bind(this);
    this.handleSaveVendor = this.handleSaveVendor.bind(this);
    this.handleSaveVendorOrder = this.handleSaveVendorOrder.bind(this);
    this.handleSendVendorOrder = this.handleSendVendorOrder.bind(this);
    this.handleToggleClick = this.handleToggleClick.bind(this);
    this._notificationSystem = null;
  }
	
	componentDidMount() {
  	this._notificationSystem = this.refs.notificationSystem;
		this.props.getDesigners(this.props.token, this.state.subpage, this.state.page);
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
	
	componentWillReceiveProps(nextProps) {
  	let nextPage = parseFloat(nextProps.location.query.page);
  	if (!nextPage) nextPage = 1;
  	
  	let designers = nextProps.designers ? nextProps.designers : [];
  	if (nextProps.updatedDesigner) {
    	// If updated designer exists, push it into the state designers array
    	const updatedDesignerJSON = nextProps.updatedDesigner.toJSON();
      designers = designers.map(function(designer, i) {
        const designerJSON = designer.toJSON();
        return (updatedDesignerJSON.objectId === designerJSON.objectId) ? nextProps.updatedDesigner : designer;
      });
    }
  	
    let isSavingDesigners = this.state.isSavingDesigners;
  	if (nextProps.updatedDesigner) {
    	const updatedDesignerJSON = nextProps.updatedDesigner.toJSON();
    	if (isSavingDesigners.length) {
      	const index = isSavingDesigners.indexOf(updatedDesignerJSON.objectId);
        if (index >= 0) isSavingDesigners.splice(index, 1);
      }
    }
    
    let successMessage = this.state.successMessage;
    if (nextProps.successMessage && nextProps.successMessage !== this.state.successMessage) {
      successMessage = nextProps.successMessage;
      this._notificationSystem.addNotification({
        message: successMessage,
        level: 'success',
        autoDismiss: 0,
        dismissible: true
      });
    }
  	
		this.setState({
			subpage: nextProps.router.params.subpage,
			designers: designers,
			page: nextPage,
			updatedDesigner: nextProps.updatedDesigner,
			isSavingDesigners: isSavingDesigners,
			successMessage: successMessage
		});
		
		if (nextPage !== this.state.page || nextProps.router.params.subpage !== this.state.subpage) {
    	this.props.getDesigners(this.props.token,  nextProps.router.params.subpage, nextPage);
  	}
  	
	}
	
  render() {
    const scope = this;
		const { error, isLoadingDesigners, totalPages } = this.props;
		const { designers } = this.state;
		let designerRows = [];
    
		if (designers) {
			designers.map(function(designerRow, i) {
  			let designerJSON = designerRow.toJSON();
  			let isSaving = scope.state.isSavingDesigners.indexOf(designerJSON.objectId) >= 0 ? true : false;
  			let expanded = (scope.state.expanded.indexOf(designerJSON.objectId) >= 0) ? true : false;
				designerRows.push(
				  <Designer 
				    data={designerJSON} 
				    isSaving={isSaving} 
				    expanded={expanded} 
				    handleSaveVendor={scope.handleSaveVendor} 
				    handleToggleClick={scope.handleToggleClick} 
				    key={`${designerJSON.designerId}-1`} 
			    />
		    );
				if (expanded) {
  				designerRows.push(
  				  <DesignerDetails 
  				    data={designerJSON} 
  				    expanded={expanded} 
  				    key={`${designerJSON.designerId}-2`} 
  				    isSaving={isSaving} 
  				    handleSaveVendorOrder={scope.handleSaveVendorOrder}
  				    handleSendVendorOrder={scope.handleSendVendorOrder}
				    />
			    );
				}
				return designerRow;
	    });
		}
    return (
			<Grid.Column width='16'>
  			<NotificationSystem ref="notificationSystem" />
  			<DesignersNav key={this.props.location.pathname} pathname={this.props.location.pathname} query={this.props.location.query} />
				{error}
	      <Dimmer active={isLoadingDesigners} inverted>
	        <Loader inverted>Loading</Loader>
	      </Dimmer>
		    <Table className='orders-table'>
		      <Table.Header>
		        <Table.Row>
              <Table.HeaderCell>Image</Table.HeaderCell>
              <Table.HeaderCell>Name</Table.HeaderCell>
							<Table.HeaderCell>Abbreviation</Table.HeaderCell>
							<Table.HeaderCell className='right aligned'>Vendors</Table.HeaderCell>
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
			</Grid.Column>
    );
  }
}

export default withRouter(Designers);
