import React from 'react';
import PropTypes from 'prop-types';
import { Table, Segment, Input, Form, TextArea, Divider, Button } from "semantic-ui-react";
import * as moment from 'moment';

export default class EmailListItemContent extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      emailMessage: '',
    };
  }

  defineWaitTime(product) {
    if (product.awaitingInventoryExpectedDate) {
      const dayToReceive = parseInt(new moment(product.awaitingInventoryExpectedDate.iso).format('DD'), 10);
      const today = parseInt(new moment().format('D'), 10);
      return (dayToReceive - today) > 0 ? `${dayToReceive - today} days` : 'UNSHIPPED';
    } else {
      switch (true) {
        case product.quantity_shipped === product.quantity:
          return 'SHIPPED';

        case product.quantity_shipped !== product.quantity:
          return 'PARTIALLY SHIPPED';

        case product.quantity_shipped === 0:
          return 'UNSHIPPED';
      }
    }
  }

  prepareMessageTemplate(customer, products, user) {
    const msgHeader = `Hi ${customer.firstName},\n\n`;
    const shippedProducts = products
      .filter(product => product.quantity_shipped === product.quantity)
      .map(product => product.name)
      .join(', ');
    const unShippedProducts = products
      .filter(product => product.quantity_shipped === 0)
      .map(product => product.name)
      .join(', ');
    const partiallyShippedProducts = products
      .filter(product => product.quantity_shipped !== product.quantity)
      .map(product => product.name)
      .join(', ');
    
    let msgContent = `Thank you for your order!\n\n`;
    if (shippedProducts && shippedProducts.length > 0) {
      msgContent = msgContent + `Your ${shippedProducts} shipped today, hope you love it!\n\n`;
    }
    if (unShippedProducts && unShippedProducts.length > 0) {
      msgContent = msgContent + `Your ${unShippedProducts} will take approximately three to four weeks to ship as it is being handmade for you.\n\n`;
    }

    const msgFooter = 'If you need this order by a certain date, please let us know so we can do our best to accommodate you.\n\nPlease let me know if you have any question or concerns.\n\nThanks again!\n\n';
    const msgBrand = `${user.firstName} ${user.lastName}\nwww.loveaudryrose.com\n424.387.8000`;
    return msgHeader + msgContent + msgFooter + msgBrand;
  }

  componentWillMount(){
    this.setState({
      emailMessage: this.prepareMessageTemplate(this.props.customer, this.props.products, this.props.user)
    });
  }

  render() {
    const { emailMessage } = this.state;
    const { products, customer } = this.props;
    return (
      <Table.Row colSpan="12" as="td">
        <Segment loading={false} secondary={true}>
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
                <Form>
                  <TextArea
                    autoHeight={true}
                    onChange={e => this.setState({ emailMessage: e.target.value })}
                    value={emailMessage} />
                </Form>
              </Table.Row>

              <Table.Row>
                <Table.Cell />
                <Table.Cell />
                <Table.Cell textAlign="right">
                  <Button 
                    color="red" 
                    content="Delete"
                    onClick={e => this.props.handleDeleteOrder(this.props.orderId)} />
                  <Button 
                    color="green" 
                    content="Send"
                    onClick={e => this.props.handleSendOrder(this.props.orderId, this.state.emailMessage)} />
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
  handleDeleteOrder: PropTypes.func.isRequired
}