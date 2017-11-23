import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'semantic-ui-react';
import moment from 'moment';

const VendorOrderListItem = props => (
  <Table.Row>
    <Table.Cell content={moment(props.dateAdded.iso).format("MM/DD/YYYY")} />

    <Table.Cell 
      content={<a target="_blank" href={`https://www.loveaudryrose.com/manage/products/brands/${props.designerId}/edit`}>{props.designerName}</a>} />

    <Table.Cell
      content={<a href={`/products/search?q=${props.productId}`}>{props.productName}</a>} />

    <Table.Cell content={props.retailPrice ? `$${props.retailPrice}` : null} />
    
    <Table.Cell content={props.productOptions.map(({ displayName, displayValue }, i) => (
      <div key={i}>{`${displayName}: ${displayValue}`}</div>
    ))} />

    <Table.Cell content={props.totalInventory} />

    <Table.Cell content={props.totalAwaiting} />

    <Table.Cell content={props.unitsToOrder} />

    <Table.Cell content={props.note} />

    <Table.Cell content={props.internalNote} />
  </Table.Row>
);

VendorOrderListItem.propTypes = {
  designerId: PropTypes.number.isRequired,
  productId: PropTypes.number.isRequired,
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