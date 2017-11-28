import React from 'react';
import PropTypes from 'prop-types';
import { Table, Segment, Form, Divider, Button } from "semantic-ui-react";
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
      const dayToReceive = parseInt(new moment(product.awaitingInventoryExpectedDate).format('DD'), 10);
      const today = parseInt(new moment().format('D'), 10);
      let weeks = ['ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN'][Math.floor((dayToReceive - today) / 7)];
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

    const msgHeader = `Hi ${nameToCamelCase(customer.firstName)},\n\n`;
    let msgContent = typeof customer.totalOrders !== 'undefined' && customer.totalOrders >= 2 ? 'Thank you for your continued support' : `Thank you for your order!`;

    const getClassificationName = product => {
      if (product.classificationName !== 'Earrings')
        return product.classificationName.toLowerCase().slice(0, -1);
      else
        return product.classificationName.toLowerCase();
    }

    // const footerMessages = {
    //   first: products.length === 1 ? 'this' : 'these',
    //   second: products.length === 1 ? getClassificationName(products[0]) : 'pieces',
    // }
    
    const footerMessages = products.filter(product => (product.totalInventory === 0 && product.quantity_shipped === 0)).length > 1 ? 'they' : 'it' ;

    if (firstRule && firstRule.length > 0) 
      msgContent = msgContent + ` Your ${firstRule} shipped today, hope you love it!`;

    if (secondRule && secondRule.length > 0)
      msgContent = msgContent + `\n\nYour ${secondRule} will take approximately one week to ship!`;

    if (thirdRule && thirdRule.length > 0) 
      msgContent = msgContent + thirdRule.map(product => {
        const isEarrings = product.classificationName === 'Earrings';
        const handmadeMessage = `as ${isEarrings ? 'they are': 'it is'} being handmade for you!`
        return `\n\nYour ${product.name} will take approximately ${this.defineWaitTime(product).toLowerCase()} to ship, ${handmadeMessage}`;
      }).join('');

    const msgFooter = `\n\nWe guarantee ${footerMessages} will arrive before Christmas; but if you need it by a certain date, kindly let us know so we can do our best to accommodate you.\n\nPlease let me know if you have any question or concerns.\n\n`;
    const lastLine = emailLastLine + '\n\n';
    const msgBrand = `Tracy Inoue\nwww.loveaudryrose.com\n424.387.8000`;
    return msgHeader + msgContent + msgFooter + lastLine + msgBrand;
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
              <Table.HeaderCell width={8}>Wait Time</Table.HeaderCell>
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
    isActive: PropTypes.bool.isRequired,
    totalInventory: PropTypes.number.isRequired,
    quantity: PropTypes.number.isRequired,
    quantity_shipped: PropTypes.number.isRequired,
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