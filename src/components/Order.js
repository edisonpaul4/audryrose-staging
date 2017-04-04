import React, { Component } from 'react';
import { Table, Checkbox, Button, Icon, Popup, Label } from 'semantic-ui-react';
import numeral from 'numeral';
import moment from 'moment';

class Order extends Component {
  constructor(props) {
    super(props);
    this.handleToggleClick = this.handleToggleClick.bind(this);
    this.handleCheckboxClick = this.handleCheckboxClick.bind(this);
  }
  
	handleToggleClick(orderId) {
		this.props.handleToggleClick(orderId);
	}
	
	handleCheckboxClick(orderId) {
  	this.props.handleCheckboxClick(orderId);
	}
	
	render() {
  	const data = this.props.data;
  	
  	let labels = [];
  	if (data.fullyShippable && data.status !== 'Shipped') {
    	labels.push(<Label key={1} basic horizontal circular size='mini' color='olive'>Fully Shippable</Label>);
  	}
  	if (data.partiallyShippable) {
    	labels.push(<Label key={2} basic horizontal circular size='mini' color='olive'>Partially Shippable</Label>);
  	}
  	if (data.fullyShippable === false && data.partiallyShippable === false && data.status !== 'Shipped') {
    	labels.push(<Label key={3} basic horizontal circular size='mini' color='red'>Cannot Ship</Label>);
  	}
  	if (data.resizable) {
    	labels.push(<Label key={4} basic horizontal circular size='mini' color='yellow'>Resizable</Label>);
  	}
  	if (data.status === 'Shipped') {
    	labels.push(<Label key={5} basic horizontal circular size='mini' color='olive'>Shipped</Label>);
  	}
		    
		let expandIcon = this.props.expanded ? 'minus' : 'plus';
		
		const dateShippedColumn = data.date_shipped ? <Table.Cell verticalAlign='top' singleLine>{moment(data.date_shipped.iso).calendar()}</Table.Cell> : null;
		
		const customerLink = 'https://www.loveaudryrose.com/manage/customers/' + data.customer_id + '/edit';
		const customerName = <a href={customerLink} target='_blank'>{data.billing_address.first_name} {data.billing_address.last_name} <Icon link name='configure' /></a>
		const orderLink = 'https://www.loveaudryrose.com/manage/orders/' + data.orderId;
		const orderId = <a href={orderLink} target='_blank'>{data.orderId} <Icon link name='external' /></a>
		const orderNote = data.customer_message ? <Popup trigger={<Icon name='sticky note outline' link />} on='click' content={data.customer_message} position='top center' /> : null;
		
    return (
      <Table.Row warning={data.customer_message ? true : undefined} disabled={this.props.isReloading}>
        <Table.Cell verticalAlign='top'><Checkbox checked={this.props.selected} onClick={() => this.handleCheckboxClick(data.orderId)} /></Table.Cell>
        <Table.Cell verticalAlign='top' singleLine>{moment(data.date_created.iso).calendar()}</Table.Cell>
        {dateShippedColumn}
        <Table.Cell verticalAlign='top'>{orderId}</Table.Cell>
				<Table.Cell verticalAlign='top'>{customerName}</Table.Cell>
				<Table.Cell verticalAlign='top'>{orderNote}</Table.Cell>
				<Table.Cell className='right aligned' verticalAlign='top'>{numeral(data.total_inc_tax).format('$0,0.00')}</Table.Cell>
				<Table.Cell verticalAlign='top'><em>{data.status}</em></Table.Cell>
				<Table.Cell verticalAlign='top'>{labels}</Table.Cell>
				<Table.Cell className='right aligned' verticalAlign='top'>{data.items_total}</Table.Cell>
				<Table.Cell verticalAlign='top'><Button circular icon={expandIcon} basic size='mini' onClick={() => this.handleToggleClick(data.orderId)} /></Table.Cell>
      </Table.Row>
    );
  }
}

export default Order;