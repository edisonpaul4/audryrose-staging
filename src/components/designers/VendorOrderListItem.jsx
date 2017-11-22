import React from 'react';
import PropTypes from 'prop-types';
import { Table, Icon, Dropdown } from 'semantic-ui-react';
import moment from 'moment';

const VendorOrderListItem = props => (
  <Table.Row>
    <Table.Cell content={moment(props.dateAdded.iso).format("MM/DD/YYYY")} />

    <Table.Cell content={props.designerName} />

    <Table.Cell content={props.productName} />

    <Table.Cell content={props.retailPrice ? `$${props.retailPrice}` : null} />
    
    <Table.Cell content={props.productOptions.map(({ displayName, displayValue }, i) => (
      <div key={i}>{`${displayName}: ${displayValue}`}</div>
    ))} />

    <Table.Cell content={props.totalInventory} />

    <Table.Cell content={props.totalAwaiting} />

    <Table.Cell content={props.needToOrder} />

    <Table.Cell content={props.note} />

    <Table.Cell content={props.internalNote} />
  </Table.Row>
);

VendorOrderListItem.propTypes = {
  dateAdded: PropTypes.shape({
    __type: PropTypes.string,
    iso: PropTypes.string
  }),
  designerName: PropTypes.string,
  productName: PropTypes.string,
  retailPrice: PropTypes.number,
  productOptions: PropTypes.arrayOf(PropTypes.shape({
    displayName: PropTypes.string,
    displayValue: PropTypes.string,
  })),
  totalInventory: PropTypes.number,
  totalAwaiting: PropTypes.number,
  unitsToOrder: PropTypes.number,
  note: PropTypes.string,
  internalNote: PropTypes.string,
};

export default VendorOrderListItem;