import React, { Component } from 'react';
import { Table, Checkbox, Button } from 'semantic-ui-react';
import numeral from 'numeral';
import moment from 'moment';

class Order extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false
    };
    this.handleToggleClick = this.handleToggleClick.bind(this);
  }
	handleToggleClick(orderId) {
//     event.preventDefault();
// 	  event.stopPropagation();
		this.props.onToggle(orderId);
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
    return (
      <Table.Row warning={this.props.data.customer_message ? true : undefined}>
        <Table.Cell verticalAlign='top'><Checkbox /></Table.Cell>
        <Table.Cell verticalAlign='top' singleLine>{moment(this.props.data.date_created.iso).calendar()}</Table.Cell>
        <Table.Cell verticalAlign='top'>{this.props.data.orderId}</Table.Cell>
				<Table.Cell verticalAlign='top'>{this.props.data.billing_address.first_name} {this.props.data.billing_address.last_name}</Table.Cell>
				<Table.Cell verticalAlign='top'>[Shipping Address]</Table.Cell>
				<Table.Cell verticalAlign='top'>{this.props.data.customer_message}</Table.Cell>
				<Table.Cell className='right aligned' verticalAlign='top'>{numeral(this.props.data.total_inc_tax).format('$0,0.00')}</Table.Cell>
				<Table.Cell verticalAlign='top'><em>{this.props.data.status}</em></Table.Cell>
				<Table.Cell verticalAlign='top'>[Labels]</Table.Cell>
				<Table.Cell className='right aligned' verticalAlign='top'>{this.props.data.items_total}</Table.Cell>
				<Table.Cell verticalAlign='top'><Button circular icon={expandIcon} basic size='mini' onClick={() => this.handleToggleClick(this.props.data.orderId)} /></Table.Cell>
      </Table.Row>
    );
  }
}

export default Order;