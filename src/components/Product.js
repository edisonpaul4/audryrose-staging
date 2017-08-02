import React, { PureComponent } from 'react';
import { Table, Checkbox, Button, Icon, Label } from 'semantic-ui-react';
import numeral from 'numeral';
import moment from 'moment';

class Product extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.data ? this.props.data : {},
      expanded: this.props.expanded ? this.props.expanded : false,
      isReloading: this.props.isReloading ? this.props.isReloading : false
    };
    this.handleToggleClick = this.handleToggleClick.bind(this);
    this.handleStatusChange = this.handleStatusChange.bind(this);
  }
	handleToggleClick(productId) {
		this.props.handleToggleClick(productId);
	}
	handleStatusChange(e, {value}) {
		this.props.handleProductSave({productId: this.state.data.productId, isActive: !this.state.data.is_active});
	}
	componentWillReceiveProps(nextProps) {
  	let state = {};
  	if (nextProps.data) state.data = nextProps.data;
  	if (nextProps.expanded !== null) state.expanded = nextProps.expanded;
  	if (nextProps.isReloading !== null) state.isReloading = nextProps.isReloading;
  	this.setState(state);
	}
	render() {
  	const data = this.state.data;
  	const expanded = this.state.expanded;
  	const isReloading = this.state.isReloading;
  	
  	let labels = [];
  	if (data.total_stock > 0 && !data.isBundle) {
    	labels.push(<Label key={1} basic horizontal circular size='mini' color='olive'>In Stock</Label>);
  	}
  	if (data.total_stock <= 0 && !data.isBundle) {
    	labels.push(<Label key={1} basic horizontal circular size='mini' color='red'>Out Of Stock</Label>);
  	}
  	if (!data.is_visible) {
    	labels.push(<Label key={2} basic horizontal circular size='mini' color='grey'>Hidden</Label>);
  	}
  	if (data.hasResizeRequest) {
    	labels.push(<Label key={3} basic horizontal circular size='mini' color='teal'>Being Resized</Label>);
  	}
  	if (data.hasVendorBuy) {
    	labels.push(<Label key={4} basic horizontal circular size='mini' color='teal'>Ordered</Label>);
  	}
  	if (data.isBundle) {
    	labels.push(<Label key={5} basic horizontal circular size='mini' color='teal'>Bundle</Label>);
  	}
  	
		let expandIcon = expanded ? 'minus' : 'plus';
		
		// Get the product size scale
		const storeUrl = 'https://www.loveaudryrose.com' + data.custom_url;
		const name = data.is_visible ? <a href={storeUrl} target="_blank">{data.name}</a> : data.name;
		const bcManageUrl = 'https://www.loveaudryrose.com/manage/products/' + data.productId + '/edit';
		const sku = <a href={bcManageUrl} className='hover-icon' target="_blank">{data.sku} <Icon link name='configure' /></a>;
		const designer = data.designerId ? <a href={'/designers/search?q=' + data.designerId}>{data.designerName ? data.designerName : ''}</a> : '';
    return (
      <Table.Row>
        <Table.Cell>
          <Checkbox />
        </Table.Cell>
        <Table.Cell>
          <span className='no-wrap'>{data.date_created ? moment(data.date_created).format('M/D/YY h:mm a') : null}</span>
        </Table.Cell>
        <Table.Cell>
          <img src={data.image ? data.image.replace(/^http:\/\//i, 'https://') : '/imgs/no-image.png'} width='40' alt={data.name} />
        </Table.Cell>
        <Table.Cell>{sku}</Table.Cell>
				<Table.Cell>{name}</Table.Cell>
				<Table.Cell>{designer}</Table.Cell>
				<Table.Cell className='right aligned'>{numeral(data.price).format('$0,0.00')}</Table.Cell>
				<Table.Cell>{data.classificationName ? data.classificationName : 'Unknown'}</Table.Cell>
				<Table.Cell>{data.sizeScale}</Table.Cell>
				<Table.Cell>
  				<Checkbox 
  				  slider 
  				  label={data.is_active === false ? 'Done' : (data.is_active === true ? 'Active' : 'Unknown')}  
  				  checked={data.is_active === false ? false : (data.is_active === true ? true : false)}  
  				  name='is_active' 
  				  disabled={isReloading} 
  				  onChange={this.handleStatusChange}
				  />
		    </Table.Cell>
				<Table.Cell>{labels}</Table.Cell>
				<Table.Cell className='right aligned'>{data.isBundle ? 'N/A' : data.total_stock}</Table.Cell>
				<Table.Cell className='right aligned'>
				  <Button circular icon={expandIcon} basic size='mini' onClick={()=>this.handleToggleClick(data.productId)} />
			  </Table.Cell>
      </Table.Row>
    );
  }
}

export default Product;