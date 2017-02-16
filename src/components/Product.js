import React, { Component } from 'react';
import { Table, Checkbox, Button } from 'semantic-ui-react';
import numeral from 'numeral';
// import moment from 'moment';

class Product extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false
    };
    this.handleToggleClick = this.handleToggleClick.bind(this);
  }
	handleToggleClick(productId) {
		this.props.onToggle(productId);
	}
	render() {
		// let labels = this.props.data.labels.map(function(label, i) {
		// 	var labelName = label.replace('-', ' ');
		// 	let labelStyle;
		// 	switch (label) {
		// 	case 'resizable':
		// 		labelStyle = 'warning';
		// 		break;
		// 	case 'fully-shippable':
		// 		labelStyle = 'success';
		// 		break;
		// 	case 'partially-shippable':
		// 		labelStyle = 'success';
		// 		break;
		// 	case 'cannot-ship':
		// 		labelStyle = 'danger';
		// 		break;
		// 	case 'emails':
		// 		labelStyle = 'info';
		// 		break;
		// 	case 'fulfilled':
		// 		labelStyle = 'success';
		// 		break;
		// 	}
		// 	return <Label key={i} bsStyle={labelStyle}> {labelName} </Label>;
		//     });
		let expandIcon = this.props.expanded ? 'minus' : 'plus';
		
		const data = this.props.data;
		
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
		
    return (
      <Table.Row>
        <Table.Cell><Checkbox /></Table.Cell>
        <Table.Cell><img src={data.primary_image.tiny_url ? data.primary_image.tiny_url.replace(/^http:\/\//i, 'https://') : '/imgs/no-image.png'} width='40' alt={data.name} /></Table.Cell>
        <Table.Cell>{data.sku}</Table.Cell>
				<Table.Cell>{data.name}</Table.Cell>
				<Table.Cell>[not loaded yet]</Table.Cell>
				<Table.Cell className='right aligned'>{numeral(data.price).format('$0,0.00')}</Table.Cell>
				<Table.Cell>[not loaded yet]</Table.Cell>
				<Table.Cell>{sizeScale}</Table.Cell>
				<Table.Cell>[not loaded yet]</Table.Cell>
				<Table.Cell>[not loaded yet]</Table.Cell>
				<Table.Cell className='right aligned'>[not loaded yet]</Table.Cell>
				<Table.Cell className='right aligned'><Button circular icon={expandIcon} basic size='mini' onClick={() => this.handleToggleClick(data.productId)} /></Table.Cell>
      </Table.Row>
    );
  }
}

export default Product;