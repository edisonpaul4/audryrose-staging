import React from 'react';
import PropTypes from 'prop-types';
import { Table, Icon, Dropdown } from 'semantic-ui-react';

const VendorOrderListItem = props => (
  <Table.Row>
    <Table.Cell content={props.dateAdded} />

    <Table.Cell content={props.designerName} />

    <Table.Cell content={props.productName} />

    <Table.Cell content={`$${props.retailPrice.toFixed(2)}`} />
    
    <Table.Cell content={props.productOptions.map(({ displayName, displayValue }) => (
      <div>{`${displayName}: ${displayValue}`}</div>
    ))} />

    <Table.Cell content={props.totalInventory} />

    <Table.Cell content={props.totalAwaiting} />

    <Table.Cell content={props.needToOrder} />

    <Table.Cell content={props.note} />

    <Table.Cell content={props.internalNote} />
  </Table.Row>
);

VendorOrderListItem.propTypes = {
  dateAdded: PropTypes.number.isRequired,
  designerName: PropTypes.string.isRequired,
  productName: PropTypes.string.isRequired,
  retailPrice: PropTypes.number.isRequired,
  productOptions: PropTypes.arrayOf(PropTypes.shape({
    displayName: PropTypes.string.isRequired,
    displayValue: PropTypes.string.isRequired,
  })),
  totalInventory: PropTypes.number.isRequired,
  totalAwaiting: PropTypes.number.isRequired,
  unitsToOrder: PropTypes.number.isRequired,
  note: PropTypes.string.isRequired,
  internalNote: PropTypes.string.isRequired,
};

export default VendorOrderListItem;