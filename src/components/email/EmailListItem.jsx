import React from 'react';
import PropTypes from 'prop-types';
import { Table, Icon, Dropdown } from 'semantic-ui-react';

export default class EmailListItem extends React.Component {
  constructor(props) {
    super(props);

    this.labelOptions = [
      { text: 'NEW ORDER', value: 'new_order' },
      { text: 'REPAIR', value: 'repair' },
      { text: 'RESIZE', value: 'resize' },
      { text: 'DELAYED ORDER', value: 'delayed_order' },
      { text: 'RETURN', value: 'return' },
    ];
  }

  render() {
    const { customerId, name, lifetimeOrders, lifetimeSpend, orderNumber, handleClick, active } = this.props;
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

        <Table.Cell>
          <Dropdown
            placeholder='Select a label'
            selection
            onChange={this.onLabelChanged}
            options={this.labelOptions} />
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

EmailListItem.propTypes = {
  active: PropTypes.bool.isRequired,
  customerId: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  lifetimeSpend: PropTypes.number,
  lifetimeOrders: PropTypes.number,
  orderNumber: PropTypes.number.isRequired,
  handleClick: PropTypes.func.isRequired
}