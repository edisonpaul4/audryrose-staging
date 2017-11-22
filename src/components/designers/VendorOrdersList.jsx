import React from 'react';
import PropTypes from 'prop-types';
import { Table, Menu, Icon } from "semantic-ui-react";

const VendorOrderList = props => {
  const { sort, activePage, totalPages, handleOnSortChange } = props;
  const caretIcon = typeof sort === 'object' ? <Icon disabled name={`caret ${sort.direction === 'ASC' ? 'up' : 'down'}`} /> : null;
    
  return (
    <Table>
      <Table.Header>
        <Table.HeaderCell 
          style={{ cursor: 'pointer' }}
          content={["Date Added", typeof sort === 'object' && sort.key === 'date_added' ? caretIcon : null]}
          onClick={e => handleOnSortChange('date_added')} />

        <Table.HeaderCell 
          style={{ cursor: 'pointer' }}
          content={["Designer", typeof sort === 'object' && sort.key === 'designer' ? caretIcon : null]}
          onClick={e => handleOnSortChange('designer')} />

        <Table.HeaderCell 
          style={{ cursor: 'pointer' }}
          content={["Product", typeof sort === 'object' && sort.key === 'product' ? caretIcon : null]}
          onClick={e => handleOnSortChange('product')} />

        <Table.HeaderCell 
          style={{ cursor: 'pointer' }}
          content={["Retail price", typeof sort === 'object' && sort.key === 'retail_price' ? caretIcon : null]}
          onClick={e => handleOnSortChange('retail_price')} />

        <Table.HeaderCell
          content="Options" />

        <Table.HeaderCell 
          style={{ cursor: 'pointer' }}
          content={["ACH OH", typeof sort === 'object' && sort.key === 'total_inventory' ? caretIcon : null]}
          onClick={e => handleOnSortChange('total_inventory')} />

        <Table.HeaderCell 
          style={{ cursor: 'pointer' }}
          content={["Total Awaiting", typeof sort === 'object' && sort.key === 'total_awaiting' ? caretIcon : null]}
          onClick={e => handleOnSortChange('total_awaiting')} />

        <Table.HeaderCell 
          style={{ cursor: 'pointer' }}
          content={["Units To Order", typeof sort === 'object' && sort.key === 'need_order' ? caretIcon : null]}
          onClick={e => handleOnSortChange('need_order')} />

        <Table.HeaderCell 
          content="Notes" />

        <Table.HeaderCell 
          content="Internal Notes" />

      </Table.Header>

      <Table.Body>
        {props.children}
      </Table.Body>

      <Table.Footer>
        <Table.Row>
          <Table.HeaderCell colSpan='12'>
            <Menu pagination>
              <Menu.Item
                onClick={() => props.handleOnPageChange(props.activePage - 1)}
                as='a'
                icon
                content={<Icon name='left chevron' />} />
              
              {[...Array(props.totalPages)].map((empty, i) => (
                <Menu.Item
                  onClick={() => props.handleOnPageChange(i)}
                  active={i === props.activePage}
                  key={i}
                  as='a'
                  content={i + 1} />
              ))}

              <Menu.Item
                onClick={() => props.handleOnPageChange(props.activePage + 1)}
                as='a'
                icon
                content={<Icon name='right chevron' />} />

            </Menu>
          </Table.HeaderCell>
        </Table.Row>
      </Table.Footer>
    </Table>
  )
};

VendorOrderList.propTypes = {
  sort: PropTypes.shape({
    key: PropTypes.string.isRequired,
    direction: PropTypes.string.isRequired
  }),
  activePage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  handleOnPageChange: PropTypes.func.isRequired,
  handleOnSortChange: PropTypes.func.isRequired
}

export default VendorOrderList;