import React, { Component } from 'react';
import { Table, Checkbox, Button } from 'semantic-ui-react';
import moment from 'moment';

class Order extends Component {
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
    return (
      <Table.Row warning={this.props.data.customer_message ? true : undefined}>
        <Table.Cell><Checkbox /></Table.Cell>
        <Table.Cell verticalAlign='top' singleLine>{moment.utc(this.props.data.date_created.iso).calendar()}</Table.Cell>
        <Table.Cell verticalAlign='top'>{this.props.data.orderId}</Table.Cell>
				<Table.Cell verticalAlign='top'>{this.props.data.billing_address.first_name} {this.props.data.billing_address.last_name}</Table.Cell>
				<Table.Cell verticalAlign='top'>[Shipping Address]</Table.Cell>
				<Table.Cell verticalAlign='top'>{this.props.data.customer_message}</Table.Cell>
				<Table.Cell verticalAlign='top'>${this.props.data.total_inc_tax}</Table.Cell>
				<Table.Cell verticalAlign='top'><em>{this.props.data.status}</em></Table.Cell>
				<Table.Cell verticalAlign='top'>[Labels]</Table.Cell>
				<Table.Cell verticalAlign='top'>{this.props.data.items_total}</Table.Cell>
				<Table.Cell><Button circular icon='plus' basic size='mini' onClick={this.handleToggleClick} /></Table.Cell>
      </Table.Row>
    );
  }
}

export default Order;