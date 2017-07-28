import React, { PureComponent } from 'react';
import { Table, Checkbox, Button, Icon, Popup, Label } from 'semantic-ui-react';
import { SingleDatePicker } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';
import numeral from 'numeral';
import moment from 'moment';

class Order extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.data ? this.props.data : {},
      expanded: this.props.expanded ? this.props.expanded : false,
      isReloading: this.props.isReloading ? this.props.isReloading : false,
      selected: this.props.selected ? this.props.selected : false,
      subpage: this.props.subpage ? this.props.subpage : '',
      dateNeeded: this.props.data && this.props.data.dateNeeded ? this.props.data.dateNeeded : null,
      dateNeededFocused: false
    };
    this.handleToggleClick = this.handleToggleClick.bind(this);
    this.handleCheckboxClick = this.handleCheckboxClick.bind(this);
    this.handleDateNeededChange = this.handleDateNeededChange.bind(this);
  }
  
	handleToggleClick(orderId) {
		this.props.handleToggleClick(orderId);
	}
	
	handleCheckboxClick(orderId) {
  	this.props.handleCheckboxClick(orderId);
	}
	
	handleDateNeededChange(data) {
  	var date = data.date ? moment(data.date) : null;
  	this.setState({
    	dateNeeded: date
  	});
  	this.props.handleDateNeededChange({dateNeeded: data.date ? moment.utc(data.date, 'ddd, DD MMM YYYY HH:mm:ss Z').toDate() : undefined, orderId: this.state.data.orderId});
	}
	
	componentWillReceiveProps(nextProps) {
  	let state = {};
  	if (nextProps.data) {
    	state.data = nextProps.data;
    	state.dateNeeded = nextProps.data.dateNeeded && nextProps.data.dateNeeded ? nextProps.data.dateNeeded : null;
  	}
  	if (nextProps.expanded !== null) state.expanded = nextProps.expanded;
  	if (nextProps.isReloading !== null) state.isReloading = nextProps.isReloading;
  	if (nextProps.selected !== null) state.selected = nextProps.selected;
  	if (nextProps.subpage) state.subpage = nextProps.subpage;
  	this.setState(state);
	}
	
	render() {
  	const data = this.state.data;
  	const expanded = this.state.expanded;
  	const isReloading = this.state.isReloading;
  	const selected = this.state.selected;
  	const subpage = this.state.subpage;
  	
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
  	if (data.hasCustom) {
    	labels.push(<Label key={5} basic horizontal circular size='mini' color='teal'>Custom</Label>);
  	}
  	if (data.status === 'Shipped') {
    	labels.push(<Label key={6} basic horizontal circular size='mini' color='olive'>Shipped</Label>);
  	}
		    
		let expandIcon = expanded ? 'minus' : 'plus';
		
		const dateShipped = data.date_shipped ? moment(data.date_shipped).calendar() : '';
		const dateShippedColumn = subpage === 'fulfilled' ? <Table.Cell verticalAlign='top' singleLine>{dateShipped}</Table.Cell> : null;
		
		const customerLink = 'https://www.loveaudryrose.com/manage/customers?idFrom=' + data.customer_id + '&idTo=' + data.customer_id;
		const customerName = <a href={customerLink} className='hover-icon' target='_blank'>{data.first_name} {data.last_name} <Icon link name='configure' /></a>
		const orderLink = 'https://www.loveaudryrose.com/manage/orders/' + data.orderId;
		const orderId = <a href={orderLink} className='hover-icon' target='_blank'>{data.orderId} <Icon link name='external' /></a>
		const orderFraudWarning = data.fraudData && data.fraudData.isSuspicious ? <Popup trigger={<Icon color='yellow' name='warning sign' />} content={data.fraudData.message} size='tiny' position='top center' /> : null
		const orderNote = data.customer_message ? <Popup trigger={<Icon name='sticky note outline' link />} on='click' content={data.customer_message} position='top center' /> : null;
		
    return (
      <Table.Row warning={data.customer_message ? true : undefined} disabled={isReloading}>
        <Table.Cell verticalAlign='middle'><Checkbox checked={selected} onClick={() => this.handleCheckboxClick(data.orderId)} /></Table.Cell>
        <Table.Cell verticalAlign='middle' singleLine>{moment(data.date_created).calendar()}</Table.Cell>
        <Table.Cell verticalAlign='middle' singleLine>
          <SingleDatePicker
            date={this.state.dateNeeded ? moment(this.state.dateNeeded) : null}
            numberOfMonths={1} 
            hideKeyboardShortcutsPanel={true}
            showClearDate={true} 
            onDateChange={date => this.handleDateNeededChange({ date })}
            focused={this.state.dateNeededFocused}
            onFocusChange={({ focused }) => this.setState({ dateNeededFocused: focused })}
            disabled={isReloading}
          />
        </Table.Cell>
        {dateShippedColumn}
        <Table.Cell verticalAlign='middle'>{orderId} {orderFraudWarning}</Table.Cell>
				<Table.Cell verticalAlign='middle'>{customerName}</Table.Cell>
				<Table.Cell verticalAlign='middle'>{orderNote}</Table.Cell>
				<Table.Cell className='right aligned' verticalAlign='middle'>{numeral(data.total_inc_tax).format('$0,0.00')}</Table.Cell>
				<Table.Cell verticalAlign='middle'><em>{data.status}</em></Table.Cell>
				<Table.Cell verticalAlign='middle'>{labels}</Table.Cell>
				<Table.Cell className='right aligned' verticalAlign='middle'>{data.items_total}</Table.Cell>
				<Table.Cell verticalAlign='middle'><Button circular icon={expandIcon} basic size='mini' onClick={() => this.handleToggleClick(data.orderId)} /></Table.Cell>
      </Table.Row>
    );
  }
}

export default Order;