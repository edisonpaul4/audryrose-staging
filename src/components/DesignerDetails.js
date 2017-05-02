import React, { Component } from 'react';
import { Table, Button, Dimmer, Segment, Loader, Header, Form,Input, TextArea, Divider } from 'semantic-ui-react';
import classNames from 'classnames';

class ProductRow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      units: this.props.vendorOrderVariant.units ? parseFloat(this.props.vendorOrderVariant.units) : 0,
      notes: this.props.vendorOrderVariant.notes ? this.props.vendorOrderVariant.notes : '',
      received: this.props.vendorOrderVariant.received ? parseFloat(this.props.vendorOrderVariant.received) : 0,
      variantSaved: false,
      isSaving: false
    };
    this.handleUnitsChange = this.handleUnitsChange.bind(this);
    this.handleNotesChange = this.handleNotesChange.bind(this);
    this.handleReceivedChange = this.handleReceivedChange.bind(this);
    this.handleCancelVariantClick = this.handleCancelVariantClick.bind(this);
  }  
  handleUnitsChange(e, {value}) {
    this.setState({
      units: parseFloat(value),
      variantSaved: false
    });
    this.props.handleVariantEdited({objectId: this.props.vendorOrderVariant.objectId, units: parseFloat(value), notes: this.state.notes, received: this.state.received});
  }
  handleNotesChange(e, {value}) {
    this.setState({
      notes: value,
      variantSaved: false
    });
    this.props.handleVariantEdited({objectId: this.props.vendorOrderVariant.objectId, units: this.state.units, notes: value, received: this.state.received});
  }
  handleReceivedChange(e, {value}) {
    this.setState({
      received: parseFloat(value),
      variantSaved: false
    });
    this.props.handleVariantEdited({objectId: this.props.vendorOrderVariant.objectId, units: this.state.units, notes: this.state.notes, received:parseFloat(value)});
  }
	handleCancelVariantClick(e, {value}) {
  	const units = this.props.vendorOrderVariant.units ? parseFloat(this.props.vendorOrderVariant.units) : 0;
  	const notes = this.props.vendorOrderVariant.notes ? this.props.vendorOrderVariant.notes : '';
  	const received = this.props.vendorOrderVariant.received ? parseFloat(this.props.vendorOrderVariant.received) : 0;
    this.setState({
      units: units,
      notes: notes,
      received: received,
      variantSaved: false
    });
    this.props.handleVariantEdited({objectId: this.props.vendorOrderVariant.objectId, units: units, notes: notes, received: received});
	}
  isEdited() {
    let edited = false;
    if (parseFloat(this.props.vendorOrderVariant.units) !== parseFloat(this.state.units)) edited = true;
    if (this.props.vendorOrderVariant.notes !== this.state.notes) edited = true;
    if (parseFloat(this.props.vendorOrderVariant.received) !== parseFloat(this.state.received)) edited = true;
    return edited;
  }
	componentWillReceiveProps(nextProps) {
  	if (this.state.isSaving && nextProps.vendorOrderVariant) {
    	this.setState({
        units: nextProps.vendorOrderVariant.units ? parseFloat(nextProps.vendorOrderVariant.units) : 0,
        notes: nextProps.vendorOrderVariant.notes ? nextProps.vendorOrderVariant.notes : '',
        received: nextProps.vendorOrderVariant.received ? parseFloat(nextProps.vendorOrderVariant.received) : 0,
        isSaving: false
    	});
  	} else if (!this.state.isSaving && nextProps.isSaving) {
    	this.setState({
        isSaving: true
    	});
  	}
	}
	render() {  	
		const vendorOrderVariant = this.props.vendorOrderVariant;
		const productName = vendorOrderVariant.variant.productName ? vendorOrderVariant.variant.productName : '';
		const productUrl = '/products/search?q=' + vendorOrderVariant.variant.productId;
		const productLink = <a href={productUrl}>{productName}</a>;
		// Create an array of other options values
		let options = [];
		if (vendorOrderVariant.variant.variantOptions) {
			vendorOrderVariant.variant.variantOptions.map(function(option, i) {
				options.push(option.display_name + ': ' + option.label);
				return options;
	    });
		}
		const inventory = vendorOrderVariant.variant.inventoryLevel ? vendorOrderVariant.variant.inventoryLevel : 0;
		const units = (this.props.status === 'Pending') ? <Input type='number' value={this.state.units ? this.state.units : 0} onChange={this.handleUnitsChange} min={0} disabled={this.props.isSaving} /> : this.state.units;
		const notes = (this.props.status === 'Pending') ? <Input type='text' value={this.state.notes ? this.state.notes : ''} onChange={this.handleNotesChange} min={0} disabled={this.props.isSaving} /> : this.state.notes;
		const received = (this.props.status === 'Sent') ? <Table.Cell><Input type='number' value={this.state.received ? this.state.received : 0} onChange={this.handleReceivedChange} min={0} disabled={this.props.isSaving} /></Table.Cell> : null;
		const cancelClass = this.isEdited() ? '' : 'invisible';

    return (
      <Table.Row>
        <Table.Cell>{productLink}</Table.Cell>
        <Table.Cell>
          {options.map(function(option, i) {
            return <span key={i}>{option}<br/></span>;
          })}
        </Table.Cell>
				<Table.Cell>{inventory}</Table.Cell>
				<Table.Cell>{units}</Table.Cell>
				<Table.Cell>{notes}</Table.Cell>
				{received}
				<Table.Cell className='right aligned'>
          <Button.Group size='mini'>
    		    <Button content='Cancel' 
      		    className={cancelClass} 
      		    secondary 
      		    compact 
      		    loading={this.props.isSaving} 
      		    disabled={this.props.isSaving} 
      		    onClick={this.handleCancelVariantClick} 
    		    />
    	    </Button.Group> 
				</Table.Cell>
      </Table.Row>
    );
  }
}

class VendorOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formEdited: false,
      variantsEdited: false,
      message: this.props.order && this.props.order.message ? this.props.order.message : this.generateMessage(),
      variantsData: null
    };
    this.handleSaveVendorOrderClick = this.handleSaveVendorOrderClick.bind(this);
    this.handleSendVendorOrderClick = this.handleSendVendorOrderClick.bind(this);
    this.handleVariantEdited = this.handleVariantEdited.bind(this);
    this.handleMessageChange = this.handleMessageChange.bind(this);
  }
	handleSaveVendorOrderClick() {
		this.props.handleSaveVendorOrder({orderId: this.props.order.objectId, variantsData: this.state.variantsData, message: this.state.message});
	}
	handleSendVendorOrderClick() {
		this.props.handleSendVendorOrder({orderId: this.props.order.objectId, variantsData: this.state.variantsData, message: this.state.message});
	}
  handleVariantEdited(data) {
    const scope = this;
    let variantsEdited = false;
  	let variantsData = this.state.variantsData.map(function(variant, i) {
    	if (variant.objectId === data.objectId) variant = data;
    	scope.props.order.vendorOrderVariants.map(function(vendorOrderVariant, j) {
        if (vendorOrderVariant.objectId === variant.objectId) {
          if (vendorOrderVariant.units !== variant.units) variantsEdited = true;
          if (vendorOrderVariant.notes !== variant.notes) variantsEdited = true;
          if (vendorOrderVariant.received !== variant.received) variantsEdited = true;
        }
        return vendorOrderVariant;
    	});
    	return variant;
  	});
    this.setState({
      variantsEdited: variantsEdited,
      variantsData: variantsData
    });
  }
  handleMessageChange(e, {value}) {
    let edited = false;
    if (!this.props.order.message && this.generateMessage() !== value) {
      edited = true;
    } else if (this.props.order.message && this.props.order.message !== value) {
      edited = true;
    }
    this.setState({
      formEdited: edited,
      message: value
    });
  }
  generateMessage() {
    let message = 'Hi';
    if (this.props.vendor.firstName) {
      message += ' ' +  this.props.vendor.firstName + ','
    } else {
      message += ',';
    }
    message += '\n\nCan I please order the below:';
    message += '\n\n{{PRODUCTS}}';
    message += '\n\nThank you!';
    message += '\n\nJaclyn';
    message += '\nwww.loveaudryrose.com';
    message += '\n424.387.8000';
    message += '\n@loveaudryrose';
    return message;
  }
  getVariantsData(vendorOrderVariants) {
  	return vendorOrderVariants.map(function(vendorOrderVariant, i) {
    	return {objectId: vendorOrderVariant.objectId, units: vendorOrderVariant.units, notes: vendorOrderVariant.notes};
  	});
  }
	componentWillMount() {
		this.setState({
      variantsData: this.getVariantsData(this.props.order.vendorOrderVariants),
      message: this.props.order && this.props.order.message ? this.props.order.message : this.generateMessage(),
		});
	}
	componentWillReceiveProps(nextProps) {
  	if (nextProps.order) {
    	this.setState({
      	variantsData: this.getVariantsData(nextProps.order.vendorOrderVariants),
        formEdited: false,
        variantsEdited: false
    	});
  	}
	}
	render() {
  	const scope = this;
  	const { status, order, vendor } = this.props;
  	
  	// Create Pending Order Table
		let orderProductRows = [];
		if (order && order.vendorOrderVariants.length > 0) {
			order.vendorOrderVariants.map(function(vendorOrderVariant, i) {
				orderProductRows.push(<ProductRow status={scope.props.status} vendorOrderVariant={vendorOrderVariant} key={vendorOrderVariant.objectId} handleVariantEdited={scope.handleVariantEdited} isSaving={scope.props.isSaving} />);
				return vendorOrderVariant;
	    });
		}
		
		const saveChangesButton = this.state.variantsEdited || this.state.formEdited ? <Button 
      primary 
      circular 
      compact 
      size='small' 
      icon='save' 
      content='Save Changes' 
      disabled={this.props.isSaving} 
      onClick={this.handleSaveVendorOrderClick} 
    /> : null;
    
		const sendOrderButton = (status === 'Pending') ? <Button 
      color='olive' 
      compact 
      size='small' 
      icon='mail' 
      content='Send Order' 
      floated='right'
      disabled={this.props.isSaving || this.state.variantsEdited || this.state.formEdited} 
      onClick={this.handleSendVendorOrderClick} 
    /> : null;
    
    const receivedHeader = (status === 'Sent') ? <Table.HeaderCell>Units Received</Table.HeaderCell> : null;
    
    const emailMessage = (status === 'Pending') ? <Form><TextArea disabled={status !== 'Pending' ? true : false} placeholder='Enter a personal message' autoHeight value={this.state.message ? this.state.message : ''} onChange={this.handleMessageChange} /></Form> : <Segment basic><div className='pre-text'>{this.state.message}</div></Segment>;
		
    return (
      <Segment secondary key={order.objectId}>
        <Header>{status} Order for {vendor.name}</Header>
        <Table className='order-products-table' basic='very' compact size='small' columns={6}>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Product</Table.HeaderCell>
              <Table.HeaderCell>Options</Table.HeaderCell>
              <Table.HeaderCell>ACH OH</Table.HeaderCell>
              <Table.HeaderCell>Units {status === 'Pending' ? 'To Order' : 'Ordered'}</Table.HeaderCell>
              <Table.HeaderCell>Notes</Table.HeaderCell>
              {receivedHeader}
              <Table.HeaderCell className='right aligned'> 
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {orderProductRows}
          </Table.Body>
        </Table>
        <Divider />
          {emailMessage}
        <Divider />
        <Segment.Group horizontal compact className='toolbar'>
          <Segment basic secondary>
            {saveChangesButton}
          </Segment>
          <Segment basic secondary>
            {sendOrderButton}
          </Segment>
        </Segment.Group>
      </Segment>
    );
	}
}

class DesignerDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.data ? this.props.data : null,
//       vendorOrders: null
    };
    this.handleSaveVendorOrder = this.handleSaveVendorOrder.bind(this);
    this.handleSendVendorOrder = this.handleSendVendorOrder.bind(this);
  }
  handleSaveVendorOrder(vendorOrderData) {
    vendorOrderData.designerId = this.state.data.objectId;
    this.props.handleSaveVendorOrder(vendorOrderData);
  }
  handleSendVendorOrder(vendorOrderData) {
    vendorOrderData.designerId = this.state.data.objectId;
    this.props.handleSendVendorOrder(vendorOrderData);
  }
  componentWillReceiveProps(nextProps) {
    const data = nextProps.data ? nextProps.data : this.state.data;
    this.setState({
      data: data
    });
  }
	render() {
  	const scope = this;
  	const show = this.props.expanded ? true : false;
  	const vendors = this.state.data && this.state.data.vendors ? this.state.data.vendors : [];
    let vendorOrders = [];
  	vendors.map(function(vendor, i) {
			if (vendor.vendorOrders && vendor.vendorOrders.length > 0) {
  			vendor.vendorOrders.map(function(vendorOrder, j) {
          const status = vendorOrder.orderedAll && vendorOrder.receivedAll === false ? 'Sent' : 'Pending';
    			vendorOrders.push(<VendorOrder status={status} order={vendorOrder} vendor={vendor} isSaving={scope.props.isSaving} key={i+'-'+j} handleSaveVendorOrder={scope.handleSaveVendorOrder} handleSendVendorOrder={scope.handleSendVendorOrder} />);
    			return vendorOrders;
    		});
  			
			}
			return vendor;
  	});
    
		const rowClass = classNames(
			{
				'': show,
				'hidden': !show
			}
		);
		
    return (
      <Table.Row className={rowClass}>
        <Table.Cell colSpan='10' className='order-product-row'>
          <Dimmer.Dimmable as={Segment} vertical blurring dimmed={this.props.isSaving}>
            <Dimmer active={this.props.isSaving} inverted>
              <Loader>Loading</Loader>
            </Dimmer>
            {vendorOrders}
          </Dimmer.Dimmable>
        </Table.Cell>
      </Table.Row>
    );
  }
}

export default DesignerDetails;