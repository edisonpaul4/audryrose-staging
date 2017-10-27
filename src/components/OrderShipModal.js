import React, { Component } from 'react';
import { Modal, Button, List, Segment, Icon, Header, Form } from 'semantic-ui-react';
import moment from 'moment';

const SHIPPING_PARCELS = [
  { value: 'USPS_SmallFlatRateBox', text: 'Small Flat Rate Box', length: '8.69', width: '5.44', height: '1.75', weight: '3'},
  { value: 'USPS_MediumFlatRateBox1', text: 'Medium Flat Rate Box 1', length: '11.25', width: '8.75', height: '6.00', weight: '3'},
  { value: 'USPS_MediumFlatRateBox2', text: 'Medium Flat Rate Box 2', length: '14.00', width: '12.00', height: '3.50', weight: '3'},
  { value: 'USPS_LargeFlatRateBox', text: 'Large Flat Rate Box', length: '12.25', width: '12.25', height: '6.00', weight: '3'},
  { value: 'USPS_APOFlatRateBox', text: 'APO/FPO/DPO Large Flat Rate Box', length: '12.25', width: '12.25', height: '6.00', weight: '3'},
  { value: 'FedEx_Envelope', text: 'Fedex Envelope', length: '12.50', width: '9.50', height: '0.80', weight: '2'},
  { value: 'FedEx_Box_Small_1', text: 'Box Small (1)', length: '12.38', width: '10.88', height: '1.50', weight: '3'},
  { value: 'FedEx_Box_Small_2', text: 'Box Small (2)', length: '11.25', width: '8.75', height: '4.38', weight: '3'},
  { value: 'FedEx_Box_Medium_1', text: 'Box Medium (1)', length: '13.25', width: '11.50', height: '2.38', weight: '3'},
  { value: 'FedEx_Box_Medium_2', text: 'Box Medium (2)', length: '11.25', width: '8.75', height: '4.38', weight: '3'},
  { value: 'FedEx_Box_Large_1', text: 'Box Large (1)', length: '17.50', width: '12.38', height: '3.00', weight: '3'},
  { value: 'FedEx_Box_Large_2', text: 'Box Large (2)', length: '11.25', width: '8.75', height: '7.75', weight: '3'},
  { value: 'FedEx_Box_Extra_Large_1', text: 'Box Extra Large (1)', length: '11.88', width: '11.00', height: '10.75', weight: '3'},
  { value: 'FedEx_Box_Extra_Large_2', text: 'Box Extra Large (2)', length: '15.75', width: '14.13', height: '6.00', weight: '3'},
  { value: 'custom', text: 'Custom', length: '', width: '', height: '' , weight: ''}
];

const SHIPPING_SIGNATURES = [
  { value: 'NOT_REQUIRED', text: 'No Signature Required', carrierAvailable: 'all' },
  { value: 'STANDARD', text: 'Standard', carrierAvailable: 'all' },
  { value: 'ADULT', text: 'Adult signature', carrierAvailable: 'all' },
  { value: 'CERTIFIED', text: 'Certified Mail', carrierAvailable: 'usps' },
  { value: 'INDIRECT', text: 'Indirect signature', carrierAvailable: 'fedex' },
];


class ShipmentGroup extends Component {
  render() {
    const shipmentGroup = this.props.data;
    const shipment = shipmentGroup.shipment;
    const shippingAddress = shipmentGroup.orderProducts[0].shippingAddress;
    
    let shipmentProducts = shipmentGroup.orderProducts.map(function(product, i) {
      const title = product.quantity + ' x ' + product.name;
      let options = product.product_options.map(function(option, j) {
        return <span key={`${i}-${j}`}>{option.display_name}: {option.display_value}<br/></span>
      });
      return <span key={`${i}`}>{title}<br/>{options}</span>
    });
    
    const dateShipped = shipment ? <List.Item><List.Header>Date Shipped</List.Header>{moment(shipment.date_created.iso).calendar()}<br/></List.Item> : null;
    const trackingNumber = shipment ? <List.Item><List.Header>Tracking Number</List.Header>{shipment.tracking_number}<br/></List.Item> : null;
    const packingSlip = shipment && shipment.packingSlipUrl ? <List.Item><a href={shipment.packingSlipUrl} target='_blank'>Print Packing Slip</a></List.Item> : null;
    const shippingLabel = shipment && shipment.shippo_label_url ? <List.Item><a href={shipment.shippo_label_url} target='_blank'>Print Shipping Label</a></List.Item> : null;
    
    return (
      <Segment color={this.props.color} secondary={this.props.secondary} disabled={this.props.disabled} loading={this.props.isLoading}>
        <Header>
          <Icon name={shipmentGroup.shipment ? 'check' : 'shipping'} color={shipmentGroup.shipment ? 'olive' : 'black'} />
          <Header.Content>
            {this.props.title}
          </Header.Content>
        </Header>
        <List relaxed>
            <List.Item>
              <List.Header>Address</List.Header>
              {shippingAddress.first_name} {shippingAddress.last_name}<br/>
              {shippingAddress.company ? shippingAddress.company : null}{shippingAddress.company ? <br/> : null}
              {shippingAddress.street_1 ? shippingAddress.street_1 : null}{shippingAddress.street_1 ? <br/> : null}
              {shippingAddress.street_2 ? shippingAddress.street_2 : null}{shippingAddress.street_2 ? <br/> : null}
              {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zip} <br/>
              {shippingAddress.country ? shippingAddress.country : null}{shippingAddress.country ? <br/> : null}
              {shippingAddress.email ? shippingAddress.email : null}{shippingAddress.email ? <br/> : null}
              {shippingAddress.phone !== 'undefined' ? shippingAddress.phone : null}<br/>
            </List.Item>
            <List.Item>
              <List.Header>Products</List.Header>
              {shipmentProducts}
            </List.Item>
            <List.Item>
              <List.Header>Shipping Method</List.Header>
              {shippingAddress.shipping_method}<br/>
            </List.Item>
            {dateShipped}
            {trackingNumber}
            {packingSlip}
            {shippingLabel}
        </List>
      </Segment>
    )
  }
}

class OrderShipModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showProducts: false,
      showEditor: false,
      shippingProvider: 'usps',
      shippingParcel: 'USPS_SmallFlatRateBox',
      shippingServiceLevel: 'usps_priority',
      length: '5.44',
      width: '8.69',
      height: '1.75',
      weight: '3',
      formComplete: true,
      signature: 'NOT_REQUIRED'
    };
    this.handleCreateShipments = this.handleCreateShipments.bind(this);
    this.handleShippingProviderChange = this.handleShippingProviderChange.bind(this);
    this.handleShippingServiceLevelChange = this.handleShippingServiceLevelChange.bind(this);
    this.handleShippingParcelChange = this.handleShippingParcelChange.bind(this);
    this.handleLengthChange = this.handleLengthChange.bind(this);
    this.handleWidthChange = this.handleWidthChange.bind(this);
    this.handleHeightChange = this.handleHeightChange.bind(this);
    this.handleWeightChange = this.handleWeightChange.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }
  
	handleCreateShipments() {
  	const scope = this;
  	// Add shipment detail form data to all shippableGroups
  	let shippableGroups = this.props.shippableGroups.map(function(group, i) {
    	group.customShipment = {
        shippingProvider: scope.state.shippingProvider,
        shippingParcel: scope.state.shippingParcel,
        shippingServiceLevel: scope.state.shippingServiceLevel,
        length: scope.state.length,
        width: scope.state.width,
        height: scope.state.height,
        weight: scope.state.weight,
        signature: scope.state.signature
    	}
    	return group;
  	});
		this.props.handleCreateShipments(shippableGroups);
		this.props.handleShipModalClose();
	}
	
	handleShippingProviderChange(e, {value}) {
  	this.setState({
    	shippingProvider: value,
      shippingParcel: '',
      shippingServiceLevel: '',
      length: '',
      width: '',
      height: '',
      weight: '',
      signature: 'NOT_REQUIRED',
  	});
	}
	
	handleShippingParcelChange(e, {value}) {
  	let parcelTemplate;
  	SHIPPING_PARCELS.map(function(parcel, i) {
    	if (parcel.value === value) {
      	parcelTemplate = parcel;
    	}
    	return parcel;
  	});
  	
  	this.setState({
    	shippingParcel: value,
      length: parcelTemplate.length,
      width: parcelTemplate.width,
      height: parcelTemplate.height,
      weight: parcelTemplate.weight
  	});
	}
	
	handleShippingServiceLevelChange(e, {value}) {
  	this.setState({
    	shippingServiceLevel: value
  	});
	}
	
	handleLengthChange(e, {value}) {
  	this.setState({
    	length: value
  	});
	}
	
	handleWidthChange(e, {value}) {
  	this.setState({
    	width: value
  	});
	}
	
	handleHeightChange(e, {value}) {
  	this.setState({
    	height: value
  	});
	}	
	
	handleWeightChange(e, {value}) {
  	this.setState({
    	weight: value
  	});
	}	
	
  handleClose() {
  	this.setState({
      shippingProvider: 'usps',
      shippingParcel: 'USPS_SmallFlatRateBox',
      shippingServiceLevel: 'usps_priority',
      length: '5.44',
      width: '8.69',
      height: '1.75',
      weight: '3',
  	});
    this.props.handleShipModalClose();
  }
  
  isFormComplete() {
    let formComplete = true;
    if (this.state.shippingProvider === undefined || this.state.shippingProvider === '') formComplete = false;
    if (this.state.shippingParcel === undefined || this.state.shippingParcel === '') formComplete = false;
    if (this.state.shippingServiceLevel === undefined || this.state.shippingServiceLevel === '') formComplete = false;
    if (this.state.length === undefined || this.state.length === '') formComplete = false;
    if (this.state.width === undefined || this.state.width === '') formComplete = false;
    if (this.state.height === undefined || this.state.height === '') formComplete = false;
    if (this.state.weight === undefined || this.state.weight === '') formComplete = false;
    
    return formComplete;
  }


  
	render() {
		const scope = this;
		const shippedGroups = this.props.shippedGroups;
		const shippableGroups = this.props.shippableGroups;
		const unshippableGroups = this.props.unshippableGroups;
		
		let missingShippingAddress = false;
		const shippableComponents = [];
		shippableGroups.map(function(shippableGroup, i) {
  		const title = 'Ready to Ship';
    	shippableComponents.push(<ShipmentGroup color='yellow' isLoading={scope.props.isLoading} title={title} data={shippableGroup} key={`1-${i}`}/>);
    	if (!shippableGroup.orderProducts[0].shippingAddress) missingShippingAddress = true;
  		return shippableGroup;
		});
		const unshippableComponents = [];
		unshippableGroups.map(function(unshippableGroup, i) {
  		const title = 'Unshippable';
    	unshippableComponents.push(<ShipmentGroup color='red' secondary={true} isLoading={scope.props.isLoading} title={title} data={unshippableGroup} key={`2-${i}`}/>);
  		return unshippableGroups;
		});
		const shippedComponents = [];
		shippedGroups.map(function(shippedGroup, i) {
  		const title = 'Shipped';
    	shippedComponents.push(<ShipmentGroup color='olive' isLoading={scope.props.isLoading} title={title} data={shippedGroup} key={`3-${i}`}/>);
  		return shippedGroups;
		});
		
		const shipButton = shippableComponents.length > 0 ? <Button disabled={this.props.isLoading || !this.isFormComplete()} color='olive' onClick={this.handleCreateShipments}>Create Shipment{shippableComponents.length > 1 ? 's' : null}</Button> : null;
		
		
		// Custom shipment form components
		const customShipmentHeader = shippableGroups.length > 0 ? <Header as='h3'>Choose Shipment Options</Header> : null;
    const shippingProviderOptions = [
      { value: 'usps', text: 'USPS' }, 
      { value: 'fedex', text: 'FedEx' },
      { value: 'dhl_express', text: 'DHL Express' }
    ];
    const shippingProviderSelect = shippableGroups.length > 0 ? <Form.Select label='Provider' value={this.state.shippingProvider} options={shippingProviderOptions} onChange={this.handleShippingProviderChange}/> : null;
    
    let shippingParcelOptions;
    switch (this.state.shippingProvider) {
      case 'usps': 
        shippingParcelOptions = [
          { value: 'USPS_SmallFlatRateBox', text: 'Small Flat Rate Box'},
          { value: 'USPS_MediumFlatRateBox1', text: 'Medium Flat Rate Box 1'},
          { value: 'USPS_MediumFlatRateBox2', text: 'Medium Flat Rate Box 2'},
          { value: 'USPS_LargeFlatRateBox', text: 'Large Flat Rate Box'},
          { value: 'USPS_APOFlatRateBox', text: 'APO/FPO/DPO Large Flat Rate Box'},
          { value: 'custom', text: 'Custom'}
        ];
        break;
      case 'fedex':
        shippingParcelOptions = [
          { value: 'FedEx_Envelope', text: 'Fedex Envelope' },
          { value: 'FedEx_Box_Small_1', text: 'Box Small (1)'},
          { value: 'FedEx_Box_Small_2', text: 'Box Small (2)'},
          { value: 'FedEx_Box_Medium_1', text: 'Box Medium (1)'},
          { value: 'FedEx_Box_Medium_2', text: 'Box Medium (2)'},
          { value: 'FedEx_Box_Large_1', text: 'Box Large (1)'},
          { value: 'FedEx_Box_Large_2', text: 'Box Large (2)'},
          { value: 'FedEx_Box_Extra_Large_1', text: 'Box Extra Large (1)'},
          { value: 'FedEx_Box_Extra_Large_2', text: 'Box Extra Large (2)'},
          { value: 'custom', text: 'Custom'}
        ];
        break;
      case 'dhl_express':
        shippingParcelOptions = [
          { value: 'custom', text: 'Custom'}
        ];
        break;
      default:
        shippingParcelOptions = [];
        break;
    }
    const shippingParcelSelect = shippableGroups.length > 0 ? <Form.Select label='Parcel' value={this.state.shippingParcel} options={shippingParcelOptions} onChange={this.handleShippingParcelChange}/> : null;
    
    let shippingServiceLevelOptions;
    switch (this.state.shippingProvider) {
      case 'usps': 
        shippingServiceLevelOptions = [
          { value: 'usps_priority', text: 'Priority Mail'},
          { value: 'usps_priority_express', text: 'Priority Mail Express'},
          { value: 'usps_first', text: 'First Class Mail/Package'},
          { value: 'usps_parcel_select', text: 'Parcel Select'},
          { value: 'usps_priority_mail_international', text: 'Priority Mail International'},
          { value: 'usps_priority_mail_express_international', text: 'Priority Mail Express International'},
          { value: 'usps_first_class_package_international_service', text: 'First Class Package International'}
        ];
        break;
      case 'fedex':
        shippingServiceLevelOptions = [
          { value: 'fedex_ground', text: 'Ground'},
          { value: 'fedex_home_delivery', text: 'Home Delivery'},
          { value: 'fedex_smart_post', text: 'Smartpost'},
          { value: 'fedex_2_day', text: '2 Day'},
          { value: 'fedex_2_day_am', text: '2 Day A.M.'},
          { value: 'fedex_express_saver', text: 'Express Saver'},
          { value: 'fedex_standard_overnight', text: 'Standard Overnight'},
          { value: 'fedex_priority_overnight', text: 'Priority Overnight'},
          { value: 'fedex_first_overnight', text: 'First Overnight'},
          { value: 'fedex_international_economy', text: 'International Economy'},
          { value: 'fedex_international_priority', text: 'International Priority'},
          { value: 'fedex_international_first', text: 'International First'},
          { value: 'fedex_europe_first_international_priority', text: 'Europe First International Priority'}
        ];
        break;
      case 'dhl_express':
        shippingServiceLevelOptions = [
          { value: 'dhl_express_worldwide', text: 'Worldwide'}
        ];
        break;
      default:
        shippingServiceLevelOptions = [];
        break;
    }
    const shippingServiceLevelSelect = shippableGroups.length > 0 ? <Form.Select label='Service Level' value={this.state.shippingServiceLevel} options={shippingServiceLevelOptions} onChange={this.handleShippingServiceLevelChange}/> : null;
    
    const isCustom = this.state.shippingParcel === 'custom';
    const lengthInput = shippableGroups.length > 0 ? <Form.Input disabled={!isCustom} type='number' label='Length (in)' value={this.state.length} onChange={this.handleLengthChange} /> : null;
    const widthInput = shippableGroups.length > 0 ? <Form.Input disabled={!isCustom} type='number' label='Width (in)' value={this.state.width} onChange={this.handleWidthChange} /> : null;
    const heightInput = shippableGroups.length > 0 ? <Form.Input disabled={!isCustom} type='number' label='Height (in)' value={this.state.height} onChange={this.handleHeightChange} /> : null;
    const weightInput = shippableGroups.length > 0 ? <Form.Input disabled={!isCustom} type='number' label='Weight (oz)' value={this.state.weight} onChange={this.handleWeightChange} /> : null;
		
		// Show error message if shipping address has not been synced with Bigcommerce
		if (missingShippingAddress) {
  		return (
  		  <Modal 
  		    open={this.props.open} 
  		    onClose={this.handleClose} 
  		    size={'small'} 
  		    closeIcon='close'>
  		    <Modal.Content>
    		    Shipping addresses need to sync with Bigcommerce for this order. Click the reload button.
  		    </Modal.Content>
		    </Modal>
	    );
		}
    return (
	    <Modal open={this.props.open} onClose={this.handleClose} size='large' closeIcon='close'>
        <Modal.Content>
          <Modal.Description>
            {shippedComponents}
            {shippableComponents}
            {unshippableComponents}
            <Form>
              {customShipmentHeader}
              <Form.Group widths='equal'>
                {shippingProviderSelect}
                {shippingParcelSelect}
                {shippingServiceLevelSelect}

                {shippableGroups.length > 0 ? (
                  <Form.Select
                    label='Signature options'
                    value={this.state.signature}
                    options={SHIPPING_SIGNATURES.filter(ss => ss.carrierAvailable === 'all' || ss.carrierAvailable === this.state.shippingProvider)}
                    onChange={(e, {value}) => this.setState({ signature: value })} />
                ) : null}
              </Form.Group>

              <Form.Group widths='equal'>
                {lengthInput}
                {widthInput}
                {heightInput}
                {weightInput}
              </Form.Group>
            </Form>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button basic disabled={this.props.isLoading} color='grey' content='Close' onClick={this.handleClose} />
          {shipButton}
        </Modal.Actions>
      </Modal>
    );
  }
}

export default OrderShipModal;