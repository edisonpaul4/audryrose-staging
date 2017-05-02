import React, { Component } from 'react';
import { Table, Checkbox, Button, Icon, Label } from 'semantic-ui-react';
import numeral from 'numeral';
import moment from 'moment';

class Product extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false
    };
    this.handleToggleClick = this.handleToggleClick.bind(this);
    this.handleStatusChange = this.handleStatusChange.bind(this);
  }
	handleToggleClick(productId) {
		this.props.handleToggleClick(productId);
	}
	handleStatusChange(e, {value}) {
		this.props.handleProductSave({productId: this.props.data.productId, isActive: !this.props.data.is_active});
	}
	render() {
  	const data = this.props.data;
  	
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
  	
		let expandIcon = this.props.expanded ? 'minus' : 'plus';
		
		// Get the product size scale
		let sizes = [];
		if (data.variants && data.variants.length > 1) {
			data.variants.map(function(variant, i) {
  			return variant.variantOptions.map(function(variantOption, j) {
    			if (variantOption.option_id === 32) sizes.push(parseFloat(variantOption.value));
    			return true;
  			});
			});
		}
		sizes.sort((a, b) => (a - b));
		const sizeScale = (sizes.length > 0) ? sizes[0] + '-' + sizes[sizes.length-1] : 'OS' ;
		const storeUrl = 'https://www.loveaudryrose.com' + data.custom_url;
		const name = data.is_visible ? <a href={storeUrl} target="_blank">{data.name} <Icon link name='eye' /></a> : data.name;
		const bcManageUrl = 'https://www.loveaudryrose.com/manage/products/' + data.productId + '/edit';
		const sku = <a href={bcManageUrl} target="_blank">{data.sku} <Icon link name='configure' /></a>;
		const designer = data.designer ? <a href={'/designers/search?q=' + data.designer.designerId}>{data.designer.name}</a> : '';
    return (
      <Table.Row>
        <Table.Cell>
          <Checkbox />
        </Table.Cell>
        <Table.Cell>
          <span className='no-wrap'>{moment(data.date_created.iso).format('M/D/YY h:mm a')}</span>
        </Table.Cell>
        <Table.Cell>
          <img src={data.primary_image.tiny_url ? data.primary_image.tiny_url.replace(/^http:\/\//i, 'https://') : '/imgs/no-image.png'} width='40' alt={data.name} />
        </Table.Cell>
        <Table.Cell>{sku}</Table.Cell>
				<Table.Cell>{name}</Table.Cell>
				<Table.Cell>{designer}</Table.Cell>
				<Table.Cell className='right aligned'>{numeral(data.price).format('$0,0.00')}</Table.Cell>
				<Table.Cell>{data.classification ? data.classification.name : 'Unknown'}</Table.Cell>
				<Table.Cell>{sizeScale}</Table.Cell>
				<Table.Cell>
  				<Checkbox 
  				  slider 
  				  label={data.is_active === false ? 'Done' : (data.is_active === true ? 'Active' : 'Unknown')}  
  				  checked={data.is_active === false ? false : (data.is_active === true ? true : false)}  
  				  name='is_active' 
  				  disabled={this.props.isReloading} 
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