import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Grid, Table, Dimmer, Loader, Icon, Button } from 'semantic-ui-react';
import Pagination from './Pagination.js';
import DesignersNav from './DesignersNav.js';
import VendorEditModal from './VendorEditModal.js';

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
  
	handleToggleClick(productId) {
		this.props.handleToggleClick(productId);
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
      return <Button content={buttonContent} compact onClick={()=>scope.handleShowVendorEditFormClick(vendor.objectId)} key={i} />;
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
          <Button.Group size='mini'>
      	    {modalButtons}
      	    <Button icon='plus' content='Add Vendor' basic compact onClick={()=>scope.handleShowVendorCreateFormClick(data.objectId)} />
    	    </Button.Group>
    	    {vendorEditModal}
  	    </Table.Cell>
				<Table.Cell className='right aligned'>
				  <Button circular icon={expandIcon} basic size='mini' onClick={()=>this.handleToggleClick(data.productId)} />
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
			updatedDesigner: null,
      expanded: [],
      isReloading: [],
			isSavingDesigners: []
    };
    this.handlePaginationClick = this.handlePaginationClick.bind(this);
    this.handleSaveVendor = this.handleSaveVendor.bind(this);
    this.handleToggleClick = this.handleToggleClick.bind(this);
  }
	
	componentDidMount() {
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
	
	componentWillReceiveProps(nextProps) {
  	let nextPage = parseFloat(nextProps.location.query.page);
  	if (!nextPage) nextPage = 1;
  	
  	let designers = [];
  	if (nextProps.updatedDesigner) {
    	// If updated designer exists, push it into the state designers array
    	const updatedDesignerJSON = nextProps.updatedDesigner.toJSON();
      nextProps.designers.map(function(designer, i) {
        const designerJSON = designer.toJSON();
        if (updatedDesignerJSON.objectId === designerJSON.objectId) {
          designers.push(nextProps.updatedDesigner);
        } else {
          designers.push(designer);
        }
        return designer;
      });
      
    } else {
      designers = nextProps.designers;
    }
  	
    let isSavingDesigners = this.state.isSavingDesigners;
  	if (nextProps.updatedDesigner) {
    	const updatedDesignerJSON = nextProps.updatedDesigner.toJSON();
    	if (isSavingDesigners.length) {
      	const index = isSavingDesigners.indexOf(updatedDesignerJSON.objectId);
        if (index >= 0) isSavingDesigners.splice(index, 1);
      }
    }
  	
		this.setState({
			subpage: nextProps.router.params.subpage,
			designers: designers,
			page: nextPage,
			updatedDesigner: nextProps.updatedDesigner,
			isSavingDesigners: isSavingDesigners
		});
		
		if (nextPage !== this.state.page || nextProps.router.params.subpage !== this.state.subpage) {
    	this.props.getDesigners(this.props.token,  nextProps.router.params.subpage, nextPage);
  	}
  	
	}
	
  render() {
    const scope = this;
		const { error, isLoadingDesigners, totalPages } = this.props;
		let designerRows = [];
    
		if (this.props.designers) {
  		const updatedDesignerJSON = this.state.updatedDesigner ? this.state.updatedDesigner.toJSON() : null;
			this.props.designers.map(function(designerRow, i) {
  			let designerJSON = designerRow.toJSON();
  			let isSaving = scope.state.isSavingDesigners.indexOf(designerJSON.objectId) >= 0 ? true : false;
  			let expanded = (scope.state.expanded.indexOf(designerJSON.designerId) >= 0) ? true : false;
				return designerRows.push(
				  <Designer 
				    data={designerJSON} 
				    updatedDesigner={updatedDesignerJSON} 
				    isSaving={isSaving} 
				    expanded={expanded} 
				    handleSaveVendor={scope.handleSaveVendor} 
				    handleToggleClick={scope.handleToggleClick} 
				    key={`${designerJSON.designerId}-1`} 
			    />
		    );
	    });
		}
    return (
			<Grid.Column width='16'>
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
