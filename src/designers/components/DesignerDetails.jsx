import React, { Component } from 'react';
import { Table, Button, Dimmer, Segment, Loader, Header, Form, Input, TextArea, Divider, Label, Icon, Confirm, Message } from 'semantic-ui-react';
import classNames from 'classnames';
import moment from 'moment';
import { ProductToOrderEditModal, CustomProductModal } from '../containers/containers'

class ProductRow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            units: this.props.vendorOrderVariant.units ? parseFloat(this.props.vendorOrderVariant.units) : 0,
            notes: this.props.vendorOrderVariant.notes ? this.props.vendorOrderVariant.notes : '',
            received: this.props.vendorOrderVariant.received ? parseFloat(this.props.vendorOrderVariant.received) : 0,
            variantSaved: false,
            isSaving: false,
            hoverRow: false,
            deleteProductConfirm: false,
            internalNotes: this.props.vendorOrderVariant.internalNotes ? this.props.vendorOrderVariant.internalNotes : ''
        };
        this.handleUnitsChange = this.handleUnitsChange.bind(this);
        this.handleNotesChange = this.handleNotesChange.bind(this);
        this.handleReceivedChange = this.handleReceivedChange.bind(this);
        this.handleCancelVariantClick = this.handleCancelVariantClick.bind(this);
    }
    handleUnitsChange(e, { value }) {
        this.setState({
            units: parseFloat(value),
            variantSaved: false
        });
        this.props.handleVariantEdited({ objectId: this.props.vendorOrderVariant.objectId, units: parseFloat(value), notes: this.state.notes, received: this.state.received, internalNotes: this.state.internalNotes });
    }
    handleNotesChange(e, { value }) {
        this.setState({
            notes: value,
            variantSaved: false
        });
        this.props.handleVariantEdited({ objectId: this.props.vendorOrderVariant.objectId, units: this.state.units, notes: value, received: this.state.received });
    }
    handleReceivedChange(e, { value }) {
        this.setState({
            received: parseFloat(value),
            variantSaved: false
        });
        this.props.handleVariantEdited({ objectId: this.props.vendorOrderVariant.objectId, units: this.state.units, notes: this.state.notes, received: parseFloat(value) });
    }
    handleCancelVariantClick(e, { value }) {
        const units = this.props.vendorOrderVariant.units ? parseFloat(this.props.vendorOrderVariant.units) : 0;
        const notes = this.props.vendorOrderVariant.notes ? this.props.vendorOrderVariant.notes : '';
        const received = this.props.vendorOrderVariant.received ? parseFloat(this.props.vendorOrderVariant.received) : 0;
        this.setState({
            units: units,
            notes: notes,
            received: received,
            variantSaved: false,
            internalNotes: this.props.vendorOrderVariant.internalNotes ? this.props.vendorOrderVariant.internalNotes : ''
        });
        this.props.handleVariantEdited({ objectId: this.props.vendorOrderVariant.objectId, units: units, notes: notes, received: received });
    }


    isEdited() {
        let edited = false;
        if (parseFloat(this.props.vendorOrderVariant.units) !== parseFloat(this.state.units)) edited = true;
        if (this.props.vendorOrderVariant.notes !== this.state.notes) edited = true;
        if (parseFloat(this.props.vendorOrderVariant.received) !== parseFloat(this.state.received)) edited = true;
        if (this.props.vendorOrderVariant.internalNotes && this.props.vendorOrderVariant.internalNotes !== this.state.internalNotes) edited = true
        return edited;
    }
    componentWillReceiveProps(nextProps) {
        if (this.state.isSaving && nextProps.vendorOrderVariant || this.props.vendorOrderVariant.updatedAt !== nextProps.vendorOrderVariant.updatedAt) {
            this.setState({
                units: nextProps.vendorOrderVariant.units ? parseFloat(nextProps.vendorOrderVariant.units) : 0,
                notes: nextProps.vendorOrderVariant.notes ? nextProps.vendorOrderVariant.notes : '',
                received: nextProps.vendorOrderVariant.received ? parseFloat(nextProps.vendorOrderVariant.received) : 0,
                isSaving: false,
                internalNotes: nextProps.vendorOrderVariant.internalNotes ? nextProps.vendorOrderVariant.internalNotes : '',
            });
        } else if (!this.state.isSaving && nextProps.isSaving) {
            this.setState({
                isSaving: true
            });
        }
    }

    handleDeleteProductFromVendorOrder(productObjectId) {
        this.setState({ deleteProductConfirm: false });
        this.props.handleDeleteProductFromVendorOrder(productObjectId)
    }

    handleInternalNotesChange(text) {
        this.setState({
            internalNotes: text,
            variantSaved: false
        });
        this.props.handleVariantEdited({
            objectId: this.props.vendorOrderVariant.objectId,
            units: this.state.units,
            notes: this.state.notes,
            received: this.state.received,
            internalNotes: text
        });
    }

    render() {
        const vendorOrderVariant = this.props.vendorOrderVariant;
        const variant = vendorOrderVariant.variant;
        const productName = variant.designerProductName ? variant.designerProductName : variant.productName ? variant.productName : '';
        const productUrl = '/products/search?q=' + variant.productId;
        const productLink = <a href={productUrl}>{productName}</a>;
        const wholesalePrice = vendorOrderVariant.variant.adjustedWholesalePrice ? Number(vendorOrderVariant.variant.adjustedWholesalePrice).toFixed(0) : "";
        // Create an array of other options values
        let options = [];
        if (variant) {
            if (variant.color_value) options.push('COLOR: ' + variant.color_value);
            if (variant.size_value) options.push('SIZE: ' + variant.size_value);
            if (variant.gemstone_value) options.push('STONE: ' + variant.gemstone_value);
            if (variant.length_value) options.push('LENGTH: ' + variant.length_value);
            if (variant.font_value) options.push('FONT: ' + variant.font_value);
            if (variant.letter_value) options.push('LETTER: ' + variant.letter_value);
            if (variant.singlepair_value) options.push('SINGLE/PAIR: ' + variant.singlepair_value);

        }

        let totalAwaitingInventory = 0;
        if (this.props.status === 'Pending')
            totalAwaitingInventory = this.props.vendorOrderVariant.variant.totalAwaitingInventory;
        else if (this.props.status === 'Sent' )
            totalAwaitingInventory = this.state.units - this.state.received > 0 ? this.state.units - this.state.received : 0;

        const inventory = variant.inventoryLevel ? variant.inventoryLevel : 0;
        const units = (this.props.status === 'Pending') ? <Input type='number' value={this.state.units ? this.state.units : 0} onChange={this.handleUnitsChange} min={0} disabled={this.props.isSaving} /> : this.state.units;
        const notes = (this.props.status === 'Pending') ? <Input type='text' value={this.state.notes ? this.state.notes : ''} onChange={this.handleNotesChange} min={0} disabled={this.props.isSaving} /> : <p dangerouslySetInnerHTML={{ __html: this.state.notes }} />;
        const doneIconClass = vendorOrderVariant.done ? '' : 'invisible';
        // const received = (this.props.status === 'Sent') ? <Table.Cell><Input type='number' value={this.state.received ? this.state.received : 0} onChange={this.handleReceivedChange} min={0} disabled={this.props.isSaving} /></Table.Cell> : null;
        const cancelClass = this.isEdited() ? '' : 'invisible';

        return (
            <Table.Row
                onMouseEnter={() => this.setState({ hoverRow: true })}
                onMouseLeave={() => this.setState({ hoverRow: false })}>

                <Table.Cell>{productLink}</Table.Cell>
                <Table.Cell>
                    {options.map((option, i) => <span key={i}>{option}<br /></span>)}
                </Table.Cell>
                {this.props.subpage === 'sent' ? <Table.Cell>{wholesalePrice}</Table.Cell> : null}
                {this.props.status !== 'Completed' ? <Table.Cell>{inventory}</Table.Cell> : null}

                {this.props.status === 'Sent' || this.props.status === 'Pending' ? (
                    <Table.Cell>{totalAwaitingInventory}</Table.Cell>
                ) : null}

                <Table.Cell>{units}</Table.Cell>
                <Table.Cell>{notes}</Table.Cell>

                <Table.Cell>
                    {this.props.status === 'Pending' ? (
                        <Input
                            type='text'
                            value={this.state.internalNotes}
                            onChange={(e) => this.handleInternalNotesChange(e.target.value)}
                            min={0}
                            disabled={this.props.isSaving} />
                    ) : <p dangerouslySetInnerHTML={{ __html: this.state.internalNotes }} />}
                </Table.Cell>

                {this.props.status === 'Sent' || this.props.status === 'Completed' ? (
                    <Table.Cell>
                        {this.props.status === 'Sent' ? (
                            <Input
                                type='number'
                                value={this.state.received ? this.state.received : 0}
                                onChange={this.handleReceivedChange}
                                min={0}
                                disabled={this.props.isSaving} />
                        ) : this.state.received ? this.state.received : 0}
                    </Table.Cell>
                ) : null}

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
                <Table.Cell className='right aligned'>
                    <Icon
                        style={{ cursor: 'pointer' }}
                        name='remove'
                        color='black'
                        size='large'
                        className={this.state.hoverRow && this.props.status === 'Sent' ? '' : 'invisible'}
                        onClick={() => this.setState({ deleteProductConfirm: true })} />
                    <Confirm
                        open={this.state.deleteProductConfirm}
                        content="Are you sure you want to delete this incoming product?"
                        onConfirm={() => this.handleDeleteProductFromVendorOrder(this.props.vendorOrderVariant.objectId)}
                        onCancel={() => this.setState({ deleteProductConfirm: false })} />

                </Table.Cell>
                <Table.Cell className='right aligned'>
                    <Icon name='checkmark' color='olive' size='large' className={doneIconClass} />
                </Table.Cell>
                {this.props.status === 'Pending' ? (
                    <Table.Cell className='right aligned'>
                        <ProductToOrderEditModal
                            vendorOrderVariantId={this.props.vendorOrderVariant.objectId}
                            vendorOrderNumber={this.props.vendorOrder.vendorOrderNumber}
                            productId={this.props.vendorOrderVariant.variant.productId}
                            productName={this.props.vendorOrderVariant.variant.designerProductName}
                            vendorName={this.props.vendor.name}
                            productUnits={this.state.units}
                            notes={this.state.notes}
                            internalNotes={this.state.internalNotes} />
                    </Table.Cell>
                ) : null}
            </Table.Row>
        );
    }
}

class CustomProductRow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            units: this.props.customVendorOrderVariant.units ? parseFloat(this.props.customVendorOrderVariant.units) : 0,
            notes: this.props.customVendorOrderVariant.notes ? this.props.customVendorOrderVariant.notes : '',
            received: this.props.customVendorOrderVariant.received ? parseFloat(this.props.customVendorOrderVariant.received) : 0,
            options : this.props.customVendorOrderVariant.options ? this.props.customVendorOrderVariant.options : '',
            productName: this.props.customVendorOrderVariant.productName ? this.props.customVendorOrderVariant.productName : '',
            onHand: this.props.customVendorOrderVariant.onHand ? this.props.customVendorOrderVariant.onHand : 0,
            totalAwaiting: this.props.customVendorOrderVariant.totalAwaiting ? this.props.customVendorOrderVariant.totalAwaiting : 0,
            variantSaved: false,
            isSaving: false,
            hoverRow: false,
            deleteProductConfirm: false,
            internalNotes: this.props.customVendorOrderVariant.internalNotes ? this.props.customVendorOrderVariant.internalNotes : ''
        };
        this.handleUnitsChange = this.handleUnitsChange.bind(this);
        this.handleNotesChange = this.handleNotesChange.bind(this);
        this.handleProductNameChange = this.handleProductNameChange.bind(this);
        this.handleInternalNotesChange = this.handleInternalNotesChange.bind(this);
        this.handleOptionsChange = this.handleOptionsChange.bind(this);
        //this.handleReceivedChange = this.handleReceivedChange.bind(this);
        this.handleCancelVariantClick = this.handleCancelVariantClick.bind(this);
        this.handleOnHandChange = this.handleOnHandChange.bind(this);
        this.handleTotalAwaitingChange = this.handleTotalAwaitingChange.bind(this);
    }
    
    handleUnitsChange(e, { value }) {
        this.setState({
            units: parseFloat(value),
            variantSaved: false
        });
        this.props.handleVariantEdited({ objectId: this.props.customVendorOrderVariant.objectId, productName: this.state.productName, options: this.state.options, units: parseFloat(value), notes: this.state.notes, received: this.state.received, internalNotes: this.state.internalNotes, onHand: this.state.onHand, totalAwaiting: this.state.totalAwaiting });
    }
    handleNotesChange(e, { value }) {
        this.setState({
            notes: value,
            variantSaved: false
        });
        this.props.handleVariantEdited({ objectId: this.props.customVendorOrderVariant.objectId, productName: this.state.productName, options: this.state.options, units: this.state.units, notes: value, received: this.state.received, internalNotes: this.state.internalNotes, onHand: this.state.onHand, totalAwaiting: this.state.totalAwaiting });
    }
    
    handleProductNameChange(e, { value }) {
        this.setState({
            productName: value,
            variantSaved: false
        });
        this.props.handleVariantEdited({ objectId: this.props.customVendorOrderVariant.objectId, productName: value, options: this.state.options, units: this.state.units, notes: this.state.notes, received: this.state.received, internalNotes: this.state.internalNotes, onHand: this.state.onHand, totalAwaiting: this.state.totalAwaiting });
    }
    
    handleInternalNotesChange(e, { value }) {
        this.setState({
            internalNotes: value,
            variantSaved: false
        });
        this.props.handleVariantEdited({ objectId: this.props.customVendorOrderVariant.objectId, productName: this.state.productName, options: this.state.options, units: this.state.units, notes: this.state.notes, received: this.state.received, internalNotes: value, onHand: this.state.onHand, totalAwaiting: this.state.totalAwaiting });
    }
    
    handleOptionsChange (e, { value }) {
        this.setState({
            options: value,
            variantSaved: false
        });
        this.props.handleVariantEdited({ objectId: this.props.customVendorOrderVariant.objectId, productName: this.state.productName, options: value, units: this.state.units, notes: this.state.notes, received: this.state.received, internalNotes: this.state.internalNotes, onHand: this.state.onHand, totalAwaiting: this.state.totalAwaiting });
    }
    
    handleOnHandChange(e, { value }) {
      this.setState({
          onHand: parseFloat(value),
          variantSaved: false
      });
      this.props.handleVariantEdited({ objectId: this.props.customVendorOrderVariant.objectId, productName: this.state.productName, options: value, units: this.state.units, notes: this.state.notes, received: this.state.received, internalNotes: this.state.internalNotes, onHand: parseFloat(value), totalAwaiting: this.state.totalAwaiting });
    }
    
    handleTotalAwaitingChange(e, { value }) {
      this.setState({
          totalAwaiting: parseFloat(value),
          variantSaved: false
      });
      this.props.handleVariantEdited({ objectId: this.props.customVendorOrderVariant.objectId, productName: this.state.productName, options: value, units: this.state.units, notes: this.state.notes, received: this.state.received, internalNotes: this.state.internalNotes, onHand: this.state.onHand, totalAwaiting: parseFloat(value) });
    }
    
    handleCancelVariantClick(e, { value }) {
        const units = this.props.customVendorOrderVariant.units ? parseFloat(this.props.customVendorOrderVariant.units) : 0;
        const notes = this.props.customVendorOrderVariant.notes ? this.props.customVendorOrderVariant.notes : '';
        const received = this.props.customVendorOrderVariant.received ? parseFloat(this.props.customVendorOrderVariant.received) : 0;
        const internalNotes = this.props.customVendorOrderVariant.internalNotes ? this.props.customVendorOrderVariant.internalNotes : '';
        const productName = this.props.customVendorOrderVariant.productName ? this.props.customVendorOrderVariant.productName : '';
        const options = this.props.customVendorOrderVariant.options ? this.props.customVendorOrderVariant.options : '';
        const onHand = this.props.customVendorOrderVariant.onHand ? this.props.customVendorOrderVariant.onHand : 0;
        const totalAwaiting = this.props.customVendorOrderVariant.totalAwaiting ? this.props.customVendorOrderVariant.totalAwaiting : 0;
        this.setState({
            units: units,
            notes: notes,
            received: received,
            internalNotes: internalNotes,
            options: options,
            productName: productName,
            onHand: onHand,
            totalAwaiting: totalAwaiting,
            variantSaved: false,      
        });
        this.props.handleVariantEdited({ objectId: this.props.customVendorOrderVariant.objectId, units: units, notes: notes, internalNotes: internalNotes, received: received });
    }
    
    isEdited() {
        let edited = false;
        if (parseFloat(this.props.customVendorOrderVariant.units) !== parseFloat(this.state.units)) edited = true;
        if (this.props.customVendorOrderVariant.notes !== this.state.notes) edited = true;
        if (this.props.customVendorOrderVariant.options !== this.state.options) edited = true;
        if (this.props.customVendorOrderVariant.productName !== this.state.productName) edited = true;
        if (this.props.customVendorOrderVariant.onHand !== this.state.onHand) edited = true;
        if (this.props.customVendorOrderVariant.totalAwaiting !== this.state.totalAwaiting) edited = true;
        //if (parseFloat(this.props.customVendorOrderVariant.received) !== parseFloat(this.state.received)) edited = true;
        if (this.props.customVendorOrderVariant.internalNotes && this.props.customVendorOrderVariant.internalNotes !== this.state.internalNotes) edited = true
        return edited;
    }
    
    render () {
      const customVendorOrderVariant = this.props.customVendorOrderVariant;
      const productName = this.state.productName;
      const options = this.state.options;
      const units = this.state.units;
      const notes = this.state.notes;
      const internalNotes = this.state.internalNotes;
      const onHand = this.state.onHand;
      const totalAwaiting = this.state.totalAwaiting;
      
      const doneIconClass = customVendorOrderVariant.done ? '' : 'invisible';
      // const received = (this.props.status === 'Sent') ? <Table.Cell><Input type='number' value={this.state.received ? this.state.received : 0} onChange={this.handleReceivedChange} min={0} disabled={this.props.isSaving} /></Table.Cell> : null;
      const cancelClass = this.isEdited() ? '' : 'invisible';
      
      return (
          <Table.Row>
            <Table.Cell>
              <Input type='text' value={productName} onChange={this.handleProductNameChange} min={0} disabled={this.props.isSaving} />
            </Table.Cell>
            <Table.Cell>
              <Input type='text' value={options} onChange={this.handleOptionsChange} min={0} disabled={this.props.isSaving} />
            </Table.Cell>
            <Table.Cell>
              <Input type='number' value={onHand} onChange={this.handleOnHandChange} min={0} disabled={this.props.isSaving} />
            </Table.Cell>
            <Table.Cell>
              <Input type='number' value={totalAwaiting} onChange={this.handleTotalAwaitingChange} min={0} disabled={this.props.isSaving} />
            </Table.Cell>
            <Table.Cell>
              <Input type='number' value={units} onChange={this.handleUnitsChange} min={0} disabled={this.props.isSaving} />
            </Table.Cell>
            <Table.Cell>
              <Input type='text' value={notes} onChange={this.handleNotesChange} min={0} disabled={this.props.isSaving} />
            </Table.Cell>
            <Table.Cell>
              <Input type='text' value={internalNotes} onChange={this.handleInternalNotesChange} min={0} disabled={this.props.isSaving} />
            </Table.Cell>
            
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
            <Table.Cell className='right aligned'>
                <Icon
                    style={{ cursor: 'pointer' }}
                    name='remove'
                    color='black'
                    size='large'
                    className={this.state.hoverRow && this.props.status === 'Sent' ? '' : 'invisible'}
                    onClick={() => this.setState({ deleteProductConfirm: true })} />
                <Confirm
                    open={this.state.deleteProductConfirm}
                    content="Are you sure you want to delete this incoming product?"
                    onConfirm={() => this.handleDeleteProductFromVendorOrder(this.props.vendorOrderVariant.objectId)}
                    onCancel={() => this.setState({ deleteProductConfirm: false })} />

            </Table.Cell>
            <Table.Cell className='right aligned'>
                <Icon name='checkmark' color='olive' size='large' className={doneIconClass} />
            </Table.Cell>
            
          </Table.Row>
      );
    }
}

class OutStandingVariant extends Component {
  constructor(props) {
      super(props);
      this.state = {
          variant: this.props.variant,
          productName: this.props.variant.productName ? this.props.variant.productName : "",
          wholesalePrice: this.props.variant.wholesalePrice ? this.props.variant.wholesalePrice : 0,
          totalAwaiting: this.props.variant.units - this.props.variant.received > 0 ? this.props.variant.units - this.props.variant.received : 0,
          units: this.props.variant.units ? this.props.variant.units : 0,
          received: this.props.variant.received ? this.props.variant.received : 0,
          originalReceived: this.props.variant.received ? this.props.variant.received : 0,
          variantsOutStanding : this.props.variant.variantsOutStanding ? this.props.variant.variantsOutStanding : [],
          isSaving: this.props.isSaving,
          saved: false,
          edited: false
      };
      
      this.handleOnReceivedChange = this.handleOnReceivedChange.bind(this);
  }
  
  handleOnReceivedChange (e, {value}) {
    let variant = this.state.variant;
    variant.received = parseFloat(value);
    this.setState({
      received: parseFloat(value),
      saved: false,
      edited : variant.received - this.state.originalReceived > 0 ? true : false
    })
    
    this.props.handleVariantEdited(variant, variant.received - this.state.originalReceived);
    
    
  }
  
  render () {
    let variant = this.state.variant;
    let options = [];
    if (variant) {
        if (variant.color_value) options.push('COLOR: ' + variant.color_value);
        if (variant.size_value) options.push('SIZE: ' + variant.size_value);
        if (variant.gemstone_value) options.push('STONE: ' + variant.gemstone_value);
        if (variant.length_value) options.push('LENGTH: ' + variant.length_value);
        if (variant.font_value) options.push('FONT: ' + variant.font_value);
        if (variant.letter_value) options.push('LETTER: ' + variant.letter_value);
        if (variant.singlepair_value) options.push('SINGLE/PAIR: ' + variant.singlepair_value);
    }
    const productUrl = '/products/search?q=' + variant.productId;
    const productName = variant.name;
    const productLink = <a href={productUrl}>{productName}</a>;
     return (
      <Table.Row>
        <Table.Cell>
          {productLink}
        </Table.Cell>
        <Table.Cell>
          {options.map((option, i) => <span key={i}>{option}<br /></span>)}
        </Table.Cell>
        <Table.Cell>
          {variant.wholesalePrice ? (
            variant.wholesalePrice.toFixed(0)): null
          }
        </Table.Cell>
        <Table.Cell>
          {this.state.units - this.state.received > 0 ? this.state.units - this.state.received : 0}
        </Table.Cell>
        <Table.Cell>
          {this.state.variant.units}
        </Table.Cell>
        <Table.Cell>
          <Input type='number' value={this.state.variant.received} onChange={this.handleOnReceivedChange} min={0} disabled={this.props.isSaving} />
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
            variantsData: null,
            customVariantsEdited: false,
            customVariantsData: null,
            completeOrderConfirm: false
        };
        this.handleSaveVendorOrderClick = this.handleSaveVendorOrderClick.bind(this);
        this.handleSendVendorOrderClick = this.handleSendVendorOrderClick.bind(this);
        this.handleVariantEdited = this.handleVariantEdited.bind(this);
        this.handleMessageChange = this.handleMessageChange.bind(this);
        this.handleCustomVariantEdited = this.handleCustomVariantEdited.bind(this);
    }
    handleSaveVendorOrderClick() {
        this.props.handleSaveVendorOrder({ orderId: this.props.order.objectId, variantsData: this.state.variantsData, customVariantsData: this.state.customVariantsData, message: this.state.message });
    }
    handleSendVendorOrderClick() {
        this.props.handleSendVendorOrder({ orderId: this.props.order.objectId, variantsData: this.state.variantsData, message: this.state.message });
    }
    handleVariantEdited(data) {
        const scope = this;
        let variantsEdited = false;
        let variantsData = this.state.variantsData.map(function (variant, i) {
            if (variant.objectId === data.objectId) variant = data;
            scope.props.order.vendorOrderVariants.map(function (vendorOrderVariant, j) {
                if (vendorOrderVariant.objectId === variant.objectId) {
                    if (vendorOrderVariant.units !== variant.units) variantsEdited = true;
                    if (vendorOrderVariant.notes !== variant.notes) variantsEdited = true;
                    if (vendorOrderVariant.received !== variant.received) variantsEdited = true;
                    if (vendorOrderVariant.internalNotes !== variant.internalNotes) variantsEdited = true;
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
    
    handleCustomVariantEdited(data) {
        const scope = this;
        let customVariantsEdited = false;
        let customVariantsData = this.state.customVariantsData.map(function (variant, i) {
            if (variant.objectId === data.objectId) variant = data;
            scope.props.order.customVendorOrderVariants.map(function (vendorOrderVariant, j) {
                if (vendorOrderVariant.objectId === variant.objectId) {
                    if (vendorOrderVariant.units !== variant.units) customVariantsEdited = true;
                    if (vendorOrderVariant.notes !== variant.notes) customVariantsEdited = true;
                    if (vendorOrderVariant.received !== variant.received) customVariantsEdited = true;
                    if (vendorOrderVariant.internalNotes !== variant.internalNotes) customVariantsEdited = true;
                    if (vendorOrderVariant.options !== variant.options) customVariantsEdited = true;
                    if (vendorOrderVariant.productName !== variant.productName) customVariantsEdited = true;
                    if (vendorOrderVariant.onHand !== variant.onHand) customVariantsEdited = true;
                    if (vendorOrderVariant.totalAwaiting !== variant.totalAwaiting) customVariantsEdited = true;
                }
                return vendorOrderVariant;
            });
            return variant;
        });
        this.setState({
            customVariantsEdited: customVariantsEdited,
            customVariantsData: customVariantsData
        });
    }
    
    handleMessageChange(e, { value }) {
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
            message += ' ' + this.props.vendor.firstName + ','
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
        return vendorOrderVariants.map(function (vendorOrderVariant, i) {
            return { objectId: vendorOrderVariant.objectId, units: vendorOrderVariant.units, notes: vendorOrderVariant.notes, internalNotes: vendorOrderVariant.internalNotes };
        });
    }
    componentWillMount() {
        this.setState({
            variantsData: this.props.order.vendorOrderVariants ? this.getVariantsData(this.props.order.vendorOrderVariants) : null,
            message: this.props.order && this.props.order.message ? this.props.order.message : this.generateMessage(),
            customVariantsData : this.props.order.customVendorOrderVariants ? this.props.order.customVendorOrderVariants : null
        });
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.order) {
            this.setState({
                variantsData: this.getVariantsData(nextProps.order.vendorOrderVariants),
                formEdited: false,
                variantsEdited: false,
                customVariantsData: nextProps.order.customVendorOrderVariants
            });
        }
    }

    handleCompleteVendorOrder(vendorOrderNumber) {
        this.setState({ completeOrderConfirm: false });
        this.props.handleCompleteVendorOrder(vendorOrderNumber);
    }

    handleDeleteProductFromVendorOrder(productObjectId) {
        this.props.handleDeleteProductFromVendorOrder(productObjectId, this.props.order.vendorOrderNumber);
    }

    render() {
        const scope = this;
        const { status, order, vendor } = this.props;
        // Create Pending Order Table
        let orderProductRows = [];
        let totalReceived = 0;
        if (order && order.vendorOrderVariants && order.vendorOrderVariants.length > 0) {

            order.vendorOrderVariants.map(function (vendorOrderVariant, i) {
                if (vendorOrderVariant.deleted)
                    return null;
                totalReceived += vendorOrderVariant.received;
                orderProductRows.push(
                    <ProductRow
                        vendor={scope.props.vendor}
                        vendorOrder={scope.props.order}
                        status={scope.props.status}
                        subpage = {scope.props.subpage}
                        vendorOrderVariant={vendorOrderVariant}
                        key={vendorOrderVariant.objectId}
                        handleVariantEdited={scope.handleVariantEdited}
                        isSaving={scope.props.isSaving}
                        handleDeleteProductFromVendorOrder={productObjectId => scope.handleDeleteProductFromVendorOrder(productObjectId)} />
                );
                return vendorOrderVariant;
            });
            orderProductRows = [].concat(orderProductRows
                .sort((a, b) => {
                    let pA = a.props.vendorOrderVariant.variant;
                    let pB = b.props.vendorOrderVariant.variant;
                    let nameA = pA.designerProductName === undefined ? pA.productName : pA.designerProductName;
                    let nameB = pB.designerProductName === undefined ? pB.productName : pB.designerProductName;
                    let sizeA = pA.size_value === undefined ? 0 : pA.size_value;
                    let sizeB = pB.size_value === undefined ? 0 : pB.size_value;
                    return (nameA.toLowerCase() > nameB.toLowerCase()) ? 1 :
                        (nameB.toLowerCase() > nameA.toLowerCase()) ? -1 :
                            (sizeA - sizeB);
                }))
        }
        
        let customOrder = [];
        if (order && order.customVendorOrderVariants && order.customVendorOrderVariants.length > 0 && scope.props.subpage == 'pending') {
          order.customVendorOrderVariants.map(function (vendorOrderVariant) {
            customOrder.push(
                <CustomProductRow
                    vendor={scope.props.vendor}
                    vendorOrder={scope.props.order}
                    status={scope.props.status}
                    subpage = {scope.props.subpage}
                    customVendorOrderVariant={vendorOrderVariant}
                    key={vendorOrderVariant.objectId}
                    handleVariantEdited={scope.handleCustomVariantEdited}
                    isSaving={scope.props.isSaving}
                    handleDeleteProductFromVendorOrder={productObjectId => scope.handleDeleteProductFromVendorOrder(productObjectId)} />
            );
          })
        }
        
        const partiallyReceived = (order.orderedAll === true && order.receivedAll === false && totalReceived > 0) ? true : false;
        const partiallyReceivedLabel = partiallyReceived ? <Label size='small' color='orange'>Partially Received</Label> : null;
        const saveChangesButton = this.state.variantsEdited || this.state.formEdited || this.state.customVariantsEdited ? <Button
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

        // const receivedHeader = (status === 'Sent') ? <Table.HeaderCell>Units Received</Table.HeaderCell> : null;

        const emailMessage = (status === 'Pending') ? <Form><Divider /><TextArea disabled={status !== 'Pending' ? true : false} placeholder='Enter a personal message' autoHeight value={this.state.message ? this.state.message : ''} onChange={this.handleMessageChange} /><Divider /></Form> : null;

        const averageWaitTime = vendor.waitTime ? vendor.waitTime : 21;
        const expectedDate = order.dateOrdered ? moment(order.dateOrdered.iso).add(averageWaitTime, 'days') : moment.utc().add(averageWaitTime, 'days');
        const daysLeft = order.dateOrdered ? expectedDate.diff(moment.utc(), 'days') : averageWaitTime;
        let labelColor = status === 'Sent' ? daysLeft < 0 ? 'red' : 'olive' : 'yellow';
        if (order.receivedAll === true) labelColor = null;
        let labelText = status === 'Sent' ? daysLeft < 0 ? Math.abs(daysLeft) + ' days late' : daysLeft + ' days left' : averageWaitTime + ' days average wait time';

        if (order.receivedAll === true && order.dateReceived && order.dateOrdered) {
            labelText = moment(order.dateReceived.iso).diff(moment(order.dateOrdered.iso), 'days') + ' days wait time';
        } else if (order.receivedAll === true && order.dateReceived) {
            labelText = 'Received ' + moment(order.dateReceived.iso).format('M-D-YY');
        } else if (order.receivedAll === true) {
            labelText = 'Received';
        }
        let labelDetailText = order.dateOrdered ? 'Sent ' + moment(order.dateOrdered.iso).format('M-D-YY') : '';
        if (order.receivedAll === true && order.dateReceived) labelDetailText += ' | Received ' + moment(order.dateReceived.iso).format('M-D-YY');
        const labelDetail = order.dateOrdered ? <Label.Detail>{labelDetailText}</Label.Detail> : null;
        const label = <Label size='small' color={labelColor}>{labelText}{labelDetail}</Label>;

        return (
            <Segment secondary key={order.objectId}>
                <Header>
                    {status} Order {order.vendorOrderNumber}
                    {label}
                    {partiallyReceivedLabel}
                    
                    {(this.props.status === 'Sent' ? (
                        
                        <Button
                            onClick={() => this.setState({ completeOrderConfirm: true })}
                            style={{ cursor: 'pointer', float: 'right' }}
                            size='mini'
                            color='green'>
                            Clear entire order
            </Button>
                    ) : null)}
                    {(order.emailConfirmed ? (
                        order.emailConfirmed == 'true'?
                        <Label positive>Email Confirmed</Label> : <Label positive>Email Unconfirmed</Label>
                    ) : null)}
                    {scope.props.subpage === 'sent' ? (
                        <p style={{textAlign: 'right', marginTop:"5px"}}>${order.outStandingAmountInDollars.toFixed(0)} </p> 
                    ) : null}
                    {scope.props.subpage === 'pending' ? (
                            <CustomProductModal
                              vendorName={this.props.vendor.name}
                              style={{ cursor: 'pointer', float: 'right' }}
                              vendorOrderNumber={this.props.order.vendorOrderNumber}
                            />
                    ) : null}
                    <Confirm
                        open={this.state.completeOrderConfirm}
                        content="Are you sure you want to delete this incoming order?"
                        onConfirm={() => this.handleCompleteVendorOrder(this.props.order.vendorOrderNumber)}
                        onCancel={() => this.setState({ completeOrderConfirm: false })} />
                      
                </Header>
              
                <Table className='order-products-table' basic='very' compact size='small' columns={6}>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Product</Table.HeaderCell>
                            <Table.HeaderCell>Options</Table.HeaderCell> 
                            {this.props.subpage === 'sent' ? (<Table.HeaderCell>Wholesale Price</Table.HeaderCell>) : null}
                          
                            {this.props.status !== 'Completed' ? <Table.HeaderCell>ACH OH</Table.HeaderCell> : null}

                            {this.props.status === 'Sent' || this.props.status === 'Pending' ? (
                                <Table.HeaderCell>Total Awaiting</Table.HeaderCell>
                            ) : null}

                            <Table.HeaderCell>Units {status === 'Pending' ? 'To Order' : 'Ordered'}</Table.HeaderCell>
                            <Table.HeaderCell>Notes</Table.HeaderCell>

                            <Table.HeaderCell style={{ minWidth: '10rem' }}>Internal notes</Table.HeaderCell>

                            {this.props.status === 'Sent' || this.props.status === 'Completed' ? (
                                <Table.HeaderCell>Units Received</Table.HeaderCell>
                            ) : null}

                            <Table.HeaderCell className='right aligned'></Table.HeaderCell>
                            <Table.HeaderCell></Table.HeaderCell>
                            <Table.HeaderCell></Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {orderProductRows}
                        {customOrder}
                    </Table.Body>
                </Table>
                {emailMessage}
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
            outStandingVariants: this.props.outStandingVariants ? this.props.outStandingVariants : null,
            originalOutstandingVariants: null,
            variantsEdited : false,
            isSaving:false
        };
        this.handleSaveVendorOrder = this.handleSaveVendorOrder.bind(this);
        this.handleSendVendorOrder = this.handleSendVendorOrder.bind(this);
        this.handleVariantEdited = this.handleVariantEdited.bind(this);
        this.handleSaveOutstandingVariants = this.handleSaveOutstandingVariants.bind(this);
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
        // const vendorOrders = nextProps.vendorOrders ? nextProps.vendorOrders : this.state.vendorOrders;
        this.setState({
            data: data
            // vendorOrders: vendorOrders
        });
    }
    handleDeleteProductFromVendorOrder(productObjectId, vendorOrderNumber) {
        this.props.handleDeleteProductFromVendorOrder(productObjectId, vendorOrderNumber, this.props.data.objectId);
    }
    componentWillMount (){
      this.setState({
        originalOutstandingVariants: this.state.outStandingVariants.map(variant => variant)
      })
    }
    handleVariantEdited(data, difference) {
        const scope = this;
        let variantEdited = false;
        let outStandingVariants = this.state.outStandingVariants;
        if (difference > 0) {
          variantEdited = true;
        }
        outStandingVariants = this.state.outStandingVariants.map(function (variant, i) {
            if (variant.objectId === data.objectId){
              variant = data;
              variant.edited=variantEdited;
              variant.checkedIn = difference;
            } 
            return variant;
        });
        
        this.setState({
            variantsEdited: true,
            outStandingVariants: outStandingVariants
        });
    }
    handleSaveOutstandingVariants () {
      let vendorOrdersToSave = [];
      let outStandingVariants = this.state.outStandingVariants;
      const scope = this;
      outStandingVariants.map(variant => {
        if (variant.edited) {
          //console.log(variant.vendorOrders[0]);
          //console.log(variant.vendorOrders[1]);
          let vendorOrders = variant.vendorOrders.sort(function(a,b){
            return new Date(a.createdAt) - new Date(b.createdAt);
          })
          //console.log(vendorOrders.length)
          let unitsToCheckin = variant.checkedIn;
          while (unitsToCheckin > 0) {
            console.log(unitsToCheckin)
            console.log(vendorOrders.length)
            if (vendorOrders.length == 1) {
              if (vendorOrders[0].vendorOrderVariants) {
                vendorOrders[0].vendorOrderVariants = vendorOrders[0].vendorOrderVariants.map(orderVariant => {
                  if (orderVariant.variant.objectId === variant.objectId) {
                    orderVariant.received += unitsToCheckin;
                  }
                  return orderVariant;
                })
                vendorOrders[0].designerId = scope.props.designerId;
                vendorOrdersToSave.push(vendorOrders[0]);
                unitsToCheckin = 0;
              }  
            } else if (vendorOrders.length > 1) {
              let order = vendorOrders.splice(0, 1)[0];
              if (order.vendorOrderVariants) {
                order.vendorOrderVariants = order.vendorOrderVariants.map(orderVariant => {
                  if (orderVariant.variant.objectId === variant.objectId) {
                    let unitsToAdd = orderVariant.units - orderVariant.received;
                    orderVariant.received += unitsToAdd;
                    unitsToCheckin -= unitsToAdd;
                  }
                  return orderVariant;
                })
                order.designerId = scope.props.designerId;
                vendorOrdersToSave.push(order);
              }
              
            }
          }
          console.log(vendorOrdersToSave)
        }
      })
      this.props.handleSaveVendorOrders(vendorOrdersToSave);
      this.setState({
        isSaving:true
      })
    }
    render() {
    
        const show = this.props.expanded ? true : false;
        const subpage = this.props.subpage;
        const data = this.state.data;
        let vendorOrderRows = [];
        if (data.vendorOrders) data.vendorOrders.map((vendorOrder, i) => {
            if (!subpage || subpage === 'all' || subpage === 'search' || vendorOrder.status.toLowerCase() === subpage || (subpage === 'unconfirmed' && vendorOrder.status.toLowerCase() === 'sent')) {
                if (subpage === 'all' && vendorOrder.status === 'Completed') return vendorOrder;
               if ( subpage === 'unconfirmed' && (!vendorOrder.order.emailConfirmed || vendorOrder.order.emailConfirmed == 'true')) return vendorOrder;
                vendorOrderRows.push(
                    <VendorOrder
                        status={vendorOrder.status}
                        order={vendorOrder.order}
                        vendor={vendorOrder.vendor}
                        isSaving={this.props.isSaving}
                        key={i}
                        subpage = {subpage}
                        handleSaveVendorOrder={this.handleSaveVendorOrder}
                        handleSendVendorOrder={this.handleSendVendorOrder}
                        handleCompleteVendorOrder={this.props.handleCompleteVendorOrder}
                        handleDeleteProductFromVendorOrder={this.handleDeleteProductFromVendorOrder.bind(this)}
                    />
                );
            }
            return vendorOrder;
        });

        const rowClass = classNames(
            {
                '': show,
                'hidden': !show
            }
        );
         
        let outStandingRows = [];
        const scope = this;
        if (this.props.outStandingVariants && this.props.outStandingVariants.length > 0) {
          this.props.outStandingVariants.map(function(variant, index) {
            outStandingRows.push(
              <OutStandingVariant
                key={index}
                variant={variant}
                isSaving= {scope.state.isSaving}
                handleVariantEdited={scope.handleVariantEdited}   
              />
            )
          })
        }
        
        const saveChangesButton = this.state.variantsEdited ? <Button
            primary
            circular
            compact
            size='small'
            icon='save'
            content='Save Changes'
            disabled={this.state.isSaving}
            onClick={this.handleSaveOutstandingVariants}
        /> : null;
        
        return (
            <Table.Row className={rowClass}>
                <Table.Cell colSpan='10' className='order-product-row'>
                {subpage === 'sent' ? (
                  <Table className='order-products-table' basic='very' compact size='small' columns={6}>
                      <Table.Header>
                          <Table.Row>
                              <Table.HeaderCell>Product</Table.HeaderCell>
                              <Table.HeaderCell>Options</Table.HeaderCell> 
                              <Table.HeaderCell>Wholesale Price</Table.HeaderCell>
                            
                              <Table.HeaderCell>Total Awaiting</Table.HeaderCell>
                              <Table.HeaderCell>Units Ordered</Table.HeaderCell>
                              <Table.HeaderCell>Units Received</Table.HeaderCell>
                            
                          </Table.Row>
                      </Table.Header>
                      <Table.Body>
                          {outStandingRows}
                      </Table.Body>
                  </Table>
                ): null}
                {saveChangesButton}
                
                    <Dimmer.Dimmable as={Segment} vertical blurring dimmed={this.props.isSaving}>
                        <Dimmer active={this.props.isSaving} inverted>
                            <Loader>Loading</Loader>
                        </Dimmer>
                        {vendorOrderRows}
                    </Dimmer.Dimmable>
                </Table.Cell>
            </Table.Row>
        );
    }
}

export default DesignerDetails;
