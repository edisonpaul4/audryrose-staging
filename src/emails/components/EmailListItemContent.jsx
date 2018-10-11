import React from 'react';
import PropTypes from 'prop-types';
import { Table, Segment, Form, Divider, Button, Label, Icon } from "semantic-ui-react";
import * as moment from 'moment';

export default class EmailListItemContent extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      emailSubject: this.props.emailSubject,
      emailMessage: '',
      segmentLoading: false,
    };
  }

  defineWaitTime(product) {
    if (product.awaitingInventoryExpectedDate && product.quantity_shipped === 0 && product.totalInventory === 0 && product.isActive) {
      const dayToReceive = new moment(product.awaitingInventoryExpectedDate).utc();
      const today = new moment().utc();
      const waitingDays = dayToReceive.utc().diff(today, 'DAYS');
      let weeks = ['ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN'][Math.floor(waitingDays / 7)];
      if(typeof weeks === 'undefined')
        return 'ONE WEEK';
      else 
        return weeks + ' ' + (weeks === 'ONE' ? 'WEEK' : 'WEEKS');

    } else {
      switch (true) {
        case product.isActive && (product.totalInventory !== 0 || product.quantity_shipped > 0):
          return 'SHIPPED';

        case !product.isActive:
          return 'ONE WEEK';

        case product.isActive && product.totalInventory === 0 && product.quantity_shipped === 0:
          return 'THREE WEEKS';
      }
    }
  }

  createAwaitingInventoryLabels(product, variant) {
    return product.awaitingInventory.reduce((all, ai) => {
      let temp = all | [];
      let label = null;

      if (ai.className === 'VendorOrderVariant') {
        let vendorOrder, vendorOrderVariant;
        product.awaitingInventoryVendorOrders.forEach(vo => {
          if (vo.vendorOrderVariants) {
            const vovIndex = vo.vendorOrderVariants.findIndex(vov => ai.objectId === vov.objectId);
            if (vovIndex !== -1) {
              vendorOrder = vo;
              vendorOrderVariant = vo.vendorOrderVariants[vovIndex];
            }
          }
        });
        label = this.getVendorOrderLabel(product, product.designerId, vendorOrder, vendorOrderVariant);
      } else if (ai.className === 'Resize') {
        label = this.getResizeLabel(product.productId, ai);
      }

      return label !== null ? [
        ...temp,
        label
      ] : temp;
    }, []);
  }

  getVendorOrderLabel(product, designerId, vendorOrder, vendorOrderVariant) {
    if (typeof vendorOrder === 'undefined')
      return <Label size='tiny' color='red' key={'product-' + product.objectId}>Error: Missing vendor order data</Label>;

    const getLabelText = (vo, vov) => {
      let labelText = '';
      switch(true) {
        case vov.done === true && vov.deleted === false:
          labelText = `${vendorOrderVariant.received} Received`;
          break;

        case vov.deleted === true:
          labelText = `${vendorOrderVariant.received} Received before being deleted`;
          break;

        default:
          labelText = vov.ordered ? `${vov.units} Sent` : `${vov.units} Pending`;
          break;
      }
      return `${labelText} #${vo.vendorOrderNumber}`
    }

    const getDaysToWait = product => {
      const averageWaitTime = product.averageWaitTime ? product.averageWaitTime : 21;
      const expectedDate = product.awaitingInventoryExpectedDate ? moment(product.awaitingInventoryExpectedDate).utc() : moment().utc().add(averageWaitTime, 'days');
      return {
        daysLeft: expectedDate.diff(moment().utc(), 'DAYS'),
        averageWaitTime
      };
    }

    const getLabelColor = (vov, daysLeft) => {
      switch (true) {
        case (vov.done === true && vov.deleted === false) || vov.ordered === true:
          return 'olive';
        
        case (vov.ordered && daysLeft < 0) || vov.deleted:
          return 'red';
      
        default:
          return 'yellow';
      }
    }

    const getLabelDetail = (vo, vov, daysLeft, averageWaitTime) => {
      if (vov.done === true || vov.deleted === true)
        return null;

      let labelDetailText;
      if (typeof vo.dateOrdered !== 'undefined')
        if (daysLeft < 0)
          labelDetailText = `${moment(vo.dateOrdered.iso).format('M-D-YY')} (${Math.abs(daysLeft)} days late)`;
        else
          labelDetailText = `${moment(vo.dateOrdered.iso).format('M-D-YY')} (${daysLeft} days left)`;
      else
        labelDetailText = `${averageWaitTime} days wait`;

      return <Label.Detail content={labelDetailText} />;
    }

    const getLabelLink = (vov, designerId) => {
      if(vov.done === false)
        if(typeof designerId !== 'undefined')
          return `/designers/search?q=${designerId}`;
        else
          return '/designers';
      else
        return null;
    }

    const daysToWait = getDaysToWait(product);
    const labelLink = getLabelLink(vendorOrderVariant, designerId);
    const labelColor = getLabelColor(vendorOrderVariant, daysToWait.daysLeft);
    const labelIcon = vendorOrderVariant.done === true && vendorOrderVariant.deleted === false ? <Icon name='checkmark' /> : null;
    const labelText = getLabelText(vendorOrder, vendorOrderVariant);
    const labelDetail = getLabelDetail(vendorOrder, vendorOrderVariant, daysToWait.daysLeft, daysToWait.averageWaitTime);
    return (
      <Label 
        as={labelLink ? 'a' : null}
        href={labelLink}
        size='tiny'
        color={labelColor}
        key={'product-' + product.objectId}>
        {labelIcon}{labelText}{labelDetail}
      </Label>
    );
  }

  getResizeLabel(productId, resizeOrder) {
    // Same code that is in OrderDetails.js
    const averageWaitTime = 7;
    const daysSinceSent = resizeOrder.dateSent ? moment.utc().diff(resizeOrder.dateSent.iso, 'days') : null;
    let labelColor = 'olive';
    let labelIcon;
    if (resizeOrder.done === true) {
      labelIcon = <Icon name='checkmark' />;
    } else if (daysSinceSent > averageWaitTime) {
      labelColor = 'red';
    }
    const labelLink = resizeOrder.done === false && productId && productId ? '/products/search?q=' + productId : null;

    let labelText = resizeOrder.units + ' ResizeOrder' + (resizeOrder.units > 1 ? 's' : '') + (resizeOrder.dateSent ? ' Sent' : ' Pending');
    if (resizeOrder.received >= resizeOrder.units) labelText = resizeOrder.received + ' ResizeOrder Received';
    const labelDetailText = resizeOrder.dateSent ? daysSinceSent + ' days ago' : '';
    const labelDetail = resizeOrder.done === false ? <Label.Detail>{labelDetailText}</Label.Detail> : null;
    let showLabel = false;
    if (resizeOrder.done === true && resizeOrder.shipped === undefined) {
      showLabel = true;
    } else if (resizeOrder.done === true) {
      showLabel = resizeOrder.shipped < resizeOrder.received ? true : false;
    } else {
      showLabel = true;
    }
    return showLabel ? <Label as='a' href={labelLink} size='tiny' color={labelColor} key={'resizeOrder-' + resizeOrder.objectId}>{labelIcon}{labelText}{labelDetail}</Label> : null;
  }

  prepareMessageTemplate(customer, products, user, emailLastLine) {    
    const nameToCamelCase = fullName => fullName
      .split(' ')
      .map(name => name.slice(0, 1).toUpperCase() + name.slice(1).toLowerCase())
      .join(' ');

    const firstRule = products
      .filter(product => product.isActive && (product.totalInventory !== 0 || product.quantity_shipped > 0))
      .map(product => product.name)
      .join(', ');

    const secondRule = products
      .filter(product => !product.isActive)
      .map(product => product.name)
      .join(', ');

    const thirdRule = products
      .filter(product => product.isActive && product.totalInventory === 0 && product.quantity_shipped === 0);
    
    let morningOrEvening = Number(new Date().toLocaleTimeString().split(':')[0]) >= 15 ? "evening" : "afternoon";
    const msgHeader = `Good ${morningOrEvening},\n\n`; 
    //const msgHeader = `Hi ${nameToCamelCase(customer.firstName)},\n\n`;
    let msgContent = typeof customer.totalOrders !== 'undefined' && customer.totalOrders >= 2 ? 'Thank you for your continued support. We feel so lucky to have your trust, and I wanted to remind you of our lifetime warranty, and free 60 day returns' : `Thank you so much for placing your first order! I wanted to be the first to welcome you to the Audry Rose family. We have free returns and a lifetime warranty so you are in good hands!`;

    const getClassificationName = product => {
      if (product.classificationName !== 'Earrings')
        return product.classificationName.toLowerCase().slice(0, -1);
      else
        return product.classificationName.toLowerCase();
    }

    const footerMessages = {
      first: products.length === 1 && products[0].classificationName !== 'Earrings' ? 'this' : 'these',
      second: products.length === 1 ? getClassificationName(products[0]) : 'pieces',
    }

    if (firstRule && firstRule.length > 0) 
      msgContent = msgContent + `\n\nYour ${firstRule} shipped today, hope you love it!`;

    if (secondRule && secondRule.length > 0)
      msgContent = msgContent + `\n\nYour ${secondRule} will take approximately one week to ship!`;

    if (thirdRule && thirdRule.length > 0) 
      msgContent = msgContent + thirdRule.map(product => {
        const isEarrings = product.classificationName === 'Earrings';
        const handmadeMessage = `as ${isEarrings ? 'they are': 'it is'} being handmade for you!`
        return `\n\nYour ${product.name} will take approximately ${this.defineWaitTime(product).toLowerCase()} to ship, ${handmadeMessage}`;
      }).join('');
      
    let totalOrder = 0;
    products.map(p=>{
      totalOrder+=p.price * p.quantity;
    })
    
    const msgFooter = `\n\nI am happy to look into rushing your order, if you need ${footerMessages.first} ${footerMessages.second} by a certain date, please let us know so we can do our best to accommodate you!`;
    const questions = `If you have any questions or concerns, please don’t hesitate to ask!\n\n`
    const lastLine = emailLastLine + '\n\n';
    const msgBrand = `Tracy Inoue\nwww.loveaudryrose.com\n424.387.8000`;
    return msgHeader + msgContent + (totalOrder >= 300 ? msgFooter+"\n\n": "\n\n") + questions + lastLine + msgBrand;
  }

  onDelete() {
    const { orderId } = this.props;
    this.setState({ segmentLoading: true });
    this.props.handleDeleteOrder(orderId);
  }

  onSend() {
    const { orderId, handleSendOrder } = this.props;
    const { emailMessage, emailSubject } = this.state;
    this.setState({ segmentLoading: true })
    handleSendOrder(orderId, {
      emailMessage,
      emailSubject: emailSubject.replace('{ID}', `#${orderId}`)
    });
  }

  componentWillMount(){
    const { customer, products, user, emailLastLine } = this.props;
    this.setState({
      emailMessage: this.prepareMessageTemplate(customer, products, user, emailLastLine)
    });
  }

  componentWillReceiveProps(newProps) {
    const { customer, products, user, emailLastLine, emailSubject } = newProps;

    if(emailSubject !== this.props.emailSubject)
      this.setState({ emailSubject: emailSubject });
    
    if(this.state.segmentLoading 
      || customer !== this.props.customer
      || products !== this.props.products
      || user !== this.props.user
      || emailLastLine !== this.props.emailLastLine)
      this.setState({
        segmentLoading: false,
        emailMessage: this.prepareMessageTemplate(customer, products, user, emailLastLine)
      });
  }

  render() {
    const { emailMessage, emailSubject, segmentLoading } = this.state;
    const { products, customer } = this.props;
    return (
      <Table.Row colSpan="12" as="td">
        <Segment loading={segmentLoading} secondary={true}>
          <Table width={16} basic="very">
            <Table.Header>
              <Table.HeaderCell width={4}>Product</Table.HeaderCell>
              <Table.HeaderCell width={4}>Options</Table.HeaderCell>
              <Table.HeaderCell width={4}>Wait Time</Table.HeaderCell>
              <Table.HeaderCell width={4}>Vendor Orders / Resize</Table.HeaderCell>
            </Table.Header>

            <Table.Body>
              {products.map((product, i) => (
                <Table.Row key={i}>
                  <Table.Cell
                    collapsing
                    content={product.name} />
                  <Table.Cell
                    collapsing
                    content={product.product_options.map((option, i) => (
                      <div key={i}>
                        {`${option.display_name}: ${option.display_value}`}
                      </div>
                    ))} />
                  <Table.Cell
                    content={this.defineWaitTime(product)} />
                  
                  <Table.Cell>
                    {this.createAwaitingInventoryLabels(product, undefined)}
                  </Table.Cell>
                </Table.Row>
              ))}

              <Table.Row colSpan="12" as="td" style={{ paddingLeft: '0em' }}>
                <Divider style={{ marginTop: 0 }}/>
                <Form>
                  <Form.Group>
                    <Form.Input
                      label="Subject (write {ID} where the order's id should be placed)"
                      value={emailSubject}
                      onInput={e => this.setState({ emailSubject: e.target.value })} />
                  </Form.Group>

                  <Form.Group widths='equal'>
                    <Form.TextArea
                      label="Message"
                      autoHeight={true}
                      onChange={e => this.setState({ emailMessage: e.target.value })}
                      value={emailMessage} />
                  </Form.Group>
                </Form>
              </Table.Row>

              <Table.Row>
                <Table.Cell />
                <Table.Cell />
                <Table.Cell />
                <Table.Cell textAlign="right">
                  <Button 
                    color="red" 
                    content="Delete"
                    onClick={this.onDelete.bind(this)} />
                  <Button 
                    color="green" 
                    content="Send"
                    onClick={this.onSend.bind(this)} />
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        </Segment>
      </Table.Row>
    );
  }
}

EmailListItemContent.propTypes = {
  orderId: PropTypes.number.isRequired,
  products: PropTypes.arrayOf(PropTypes.shape({
    objectId: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    isActive: PropTypes.bool.isRequired,
    totalInventory: PropTypes.number.isRequired,
    quantity: PropTypes.number.isRequired,
    quantity_shipped: PropTypes.number.isRequired,
    awaitingInventory: PropTypes.array,
    awaitingInventoryExpectedDate: PropTypes.string,
    product_options: PropTypes.arrayOf(PropTypes.shape({
      display_name: PropTypes.string.isRequired,
      display_value: PropTypes.string.isRequired,
    }))
  })).isRequired,
  customer: PropTypes.shape({
    objectId: PropTypes.string.isRequired,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    totalOrders: PropTypes.number.isRequired,
    customerId: PropTypes.number.isRequired,
    totalSpend: PropTypes.number.isRequired,
  }).isRequired,
  handleSendOrder: PropTypes.func.isRequired,
  handleDeleteOrder: PropTypes.func.isRequired,
  emailLastLine: PropTypes.string.isRequired,
  emailSubject: PropTypes.string.isRequired,
}