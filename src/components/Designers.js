import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Grid, Table, Dimmer, Loader } from 'semantic-ui-react';
import Pagination from './Pagination.js';

class Designer extends Component {
	render() {
		const data = this.props.data;
// 		const imageFile = 
// 		const image = data.image_file ? <a href=''
    return (
      <Table.Row>
        <Table.Cell verticalAlign='top' singleLine>{data.designerId}</Table.Cell>
        <Table.Cell verticalAlign='top' singleLine>
          <img src={data.image_file ? 'https://cdn6.bigcommerce.com/s-jfssqt/images/stencil/378x441/' + data.image_file : '/imgs/no-image.png'} width='80' alt={data.name} />
        </Table.Cell>
        <Table.Cell verticalAlign='top'>{data.name}</Table.Cell>
				<Table.Cell verticalAlign='top'>{data.abbreviation}</Table.Cell>
				<Table.Cell verticalAlign='top'></Table.Cell>
      </Table.Row>
    );
  }
}

class Designers extends Component {
  constructor(props) {
    super(props);

    this.state = {
			page: null
    };
    this.handlePaginationClick = this.handlePaginationClick.bind(this);
  }
	
	componentDidMount() {
		this.props.getDesigners(this.props.token, this.state.page);
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
    	this.props.getDesigners(this.props.token, nextPage);
  	}
	}
	
  render() {
		const { error, isLoadingDesigners, totalPages } = this.props;
		let designerRows = [];
		if (this.props.designers) {
			this.props.designers.map(function(designerRow, i) {
  			let designerJSON = designerRow.toJSON();
				return designerRows.push(<Designer data={designerJSON} key={`${designerJSON.designerId}-1`} />);
	    });
		}
    return (
			<Grid.Column width='16'>
				{error}
	      <Dimmer active={isLoadingDesigners} inverted>
	        <Loader inverted>Loading</Loader>
	      </Dimmer>
		    <Table className='orders-table'>
		      <Table.Header>
		        <Table.Row>
              <Table.HeaderCell>ID</Table.HeaderCell>
              <Table.HeaderCell>Image</Table.HeaderCell>
              <Table.HeaderCell>Name</Table.HeaderCell>
							<Table.HeaderCell>Abbreviation</Table.HeaderCell>										
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
