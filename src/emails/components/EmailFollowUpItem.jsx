import React from 'react';
import PropTypes from 'prop-types';
import { Table, Icon, Dropdown } from 'semantic-ui-react';

import {OrderNotesModal} from '../../orders/components/components';

export default class EmailFollowUpItem extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { customerMessage, staffNotes, internalNotes, designerNotes, orderId, customerId, name, lifetimeOrders, lifetimeSpend, orderNumber, handleClick, active, handleUpdateOrderNotes } = this.props;
    return (
      <Table.Row>
        <Table.Cell>
          <a
            target="_blank"
            style={{ color: typeof lifetimeOrders !== 'undefined' ? 'green' : 'blue' }}
            href={`https://www.loveaudryrose.com/manage/customers?idFrom=${customerId}&idTo=${customerId}`}>
          {name}
          </a>
        </Table.Cell>

        <Table.Cell>
          {`${lifetimeSpend ? `$${lifetimeSpend},` : ''} ${lifetimeOrders ? `${lifetimeOrders} orders` : ''}`}
        </Table.Cell>

        <Table.Cell
          content={`Order #${orderNumber}`} />

        <Table.Cell 
          collapsing>
          <OrderNotesModal
            orderId={orderId}
            customerMessage={customerMessage}
            staffNotes={staffNotes}
            internalNotes={internalNotes}
            designerNotes={designerNotes}
            submitHandler={handleUpdateOrderNotes} />
        </Table.Cell>
        <Table.Cell textAlign="right">
          <Icon
            style={{ cursor: 'pointer' }}
            onClick={handleClick}
            name={`${active ? 'minus' : 'plus'} circle`}
            size="large" />
        </Table.Cell>
      </Table.Row>
    );
  }
}
