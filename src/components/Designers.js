import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Grid, Table, Dimmer, Loader, Icon, Input, Button } from 'semantic-ui-react';
import Pagination from './Pagination.js';
import DesignersNav from './DesignersNav.js';

class Designer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      designerData: this.props.data,
      email: this.props.data.email ? this.props.data.email : '',
      edited: false,
      saved: false
    };
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handleSaveDesignerClick = this.handleSaveDesignerClick.bind(this);
    this.handleCancelClick = this.handleCancelClick.bind(this);
  }
  handleEmailChange(e, {value}) {
    const defaultEmail = this.props.data.email ? this.props.data.email : '';
    const edited = (this.state.email !== defaultEmail || value !== this.props.data.email) ? true : false;
    this.setState({
      email: value,
      edited: edited,
      saved: false
    });
  }
	handleSaveDesignerClick(e, {value}) {
  	console.log('save ' + this.state.email);
		this.props.handleSaveDesignerClick(this.props.data.objectId, this.state.email);
	}
	handleCancelClick(e, {value}) {
    this.setState({
      email: this.props.data.email ? this.props.data.email : '',
      edited: false,
      saved: false
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
		const data = this.props.data;
		const saveCancelClass = this.state.edited ? '' : 'invisible';
		const bcManageUrl = 'https://www.loveaudryrose.com/manage/products/brands/' + data.designerId + '/edit';
		const name = <a href={bcManageUrl} target="_blank">{data.name} <Icon link name='configure' /></a>;

    return (
      <Table.Row disabled={this.props.isSaving} positive={this.state.saved && !this.state.edited ? true : false} >
        <Table.Cell verticalAlign='top' singleLine>
          <img src={data.image_file ? 'https://cdn6.bigcommerce.com/s-jfssqt/images/stencil/378x441/' + data.image_file : '/imgs/no-image.png'} width='80' alt={data.name} />
        </Table.Cell>
        <Table.Cell verticalAlign='top'>{name}</Table.Cell>
				<Table.Cell verticalAlign='top'>{data.abbreviation}</Table.Cell>
				<Table.Cell singleLine><Input type='text' size='mini' value={this.state.email} onChange={this.handleEmailChange} disabled={this.props.isSaving} /></Table.Cell>
        <Table.Cell singleLine className='right aligned'>
    		  <Button.Group size='mini'>
    		    <Button 
    		      content='Save' 
    		      className={saveCancelClass} 
    		      primary 
    		      compact 
    		      loading={this.props.isSaving} 
    		      disabled={this.props.isSaving} 
    		      onClick={this.handleSaveDesignerClick} 
    		      /> 
    		    <Button content='Cancel' 
      		    className={saveCancelClass} 
      		    secondary 
      		    compact 
      		    loading={this.props.isSaving} 
      		    disabled={this.props.isSaving} 
      		    onClick={this.handleCancelClick} 
    		    />
    	    </Button.Group> 
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
			isSavingDesigners: []
    };
    this.handlePaginationClick = this.handlePaginationClick.bind(this);
    this.handleSaveDesignerClick = this.handleSaveDesignerClick.bind(this);
  }
	
	componentDidMount() {
		this.props.getDesigners(this.props.token, this.state.subpage, this.state.page);
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
	
	handleSaveDesignerClick(objectId, email) {
  	console.log('save designer: ' + email);
		let currentlySaving = this.state.isSavingDesigners;
		const index = currentlySaving.indexOf(objectId);
		if (index < 0) {
			currentlySaving.push(objectId);
		}
  	this.setState({
    	isSavingDesigners: currentlySaving
  	});
		this.props.saveDesigner(this.props.token, objectId, email);
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
		console.log(scope.state.isSavingDesigners);
		if (this.props.designers) {
  		const updatedDesignerJSON = this.state.updatedDesigner ? this.state.updatedDesigner.toJSON() : null;
			this.props.designers.map(function(designerRow, i) {
  			let designerJSON = designerRow.toJSON();
  			let isSaving = scope.state.isSavingDesigners.indexOf(designerJSON.objectId) >= 0 ? true : false;
				return designerRows.push(
				  <Designer 
				    data={designerJSON} 
				    updatedDesigner={updatedDesignerJSON} 
				    isSaving={isSaving} 
				    handleSaveDesignerClick={scope.handleSaveDesignerClick} 
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
							<Table.HeaderCell>Email</Table.HeaderCell>
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
