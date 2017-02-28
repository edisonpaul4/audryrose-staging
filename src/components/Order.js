import React, { Component } from 'react';
import { Table, Checkbox, Button, Icon, Popup } from 'semantic-ui-react';
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
		this.props.handleToggleClick(orderId);
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
		const customerLink = 'https://www.loveaudryrose.com/manage/customers/' + data.customer_id + '/edit';
		const customerName = <a href={customerLink} target='_blank'>{data.billing_address.first_name} {data.billing_address.last_name} <Icon link name='configure' /></a>
		const orderLink = 'https://www.loveaudryrose.com/manage/orders/' + data.orderId;
		const orderId = <a href={orderLink} target='_blank'>{data.orderId} <Icon link name='external' /></a>
		const orderNote = data.customer_message ? <Popup trigger={<Icon name='sticky note outline' link />} on='click' content={data.customer_message} positioning='top center' /> : null;
    return (
      <Table.Row warning={data.customer_message ? true : undefined}>
        <Table.Cell verticalAlign='top'><Checkbox /></Table.Cell>
        <Table.Cell verticalAlign='top' singleLine>{moment(data.date_created.iso).calendar()}</Table.Cell>
        <Table.Cell verticalAlign='top'>{orderId}</Table.Cell>
				<Table.Cell verticalAlign='top'>{customerName}</Table.Cell>
				<Table.Cell verticalAlign='top'>{orderNote}</Table.Cell>
				<Table.Cell className='right aligned' verticalAlign='top'>{numeral(data.total_inc_tax).format('$0,0.00')}</Table.Cell>
				<Table.Cell verticalAlign='top'><em>{data.status}</em></Table.Cell>
				<Table.Cell verticalAlign='top'>[Labels]</Table.Cell>
				<Table.Cell className='right aligned' verticalAlign='top'>{data.items_total}</Table.Cell>
				<Table.Cell verticalAlign='top'><Button circular icon={expandIcon} basic size='mini' onClick={() => this.handleToggleClick(data.orderId)} /></Table.Cell>
      </Table.Row>
    );
  }
}

export default Order;