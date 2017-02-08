import React, { Component } from 'react';
import { Table, Checkbox, Button } from 'semantic-ui-react';
// import moment from 'moment';

class Product extends Component {
	handleToggleClick(event) {
    event.preventDefault();
	  event.stopPropagation();
		console.log('click');
		// this.props.onToggle(this.props.data.orderId)
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
		// let expandIcon = this.props.data.expanded ? 'glyphicon-minus-sign' : 'glyphicon-plus-sign';
		const data = this.props.data;
    return (
      <Table.Row>
        <Table.Cell><Checkbox /></Table.Cell>
        <Table.Cell><img src={data.primary_image.tiny_url} width='40' alt={data.name} /></Table.Cell>
        <Table.Cell>{data.sku}</Table.Cell>
				<Table.Cell>{data.name}</Table.Cell>
				<Table.Cell>[not loaded yet]</Table.Cell>
				<Table.Cell>${data.price}</Table.Cell>
				<Table.Cell>[not loaded yet]</Table.Cell>
				<Table.Cell>[not loaded yet]</Table.Cell>
				<Table.Cell>[not loaded yet]</Table.Cell>
				<Table.Cell>[not loaded yet]</Table.Cell>
				<Table.Cell>[not loaded yet]</Table.Cell>
				<Table.Cell><Button circular icon='plus' basic size='mini' onClick={this.handleToggleClick} /></Table.Cell>
      </Table.Row>
    );
  }
}

export default Product;