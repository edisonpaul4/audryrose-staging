import React from 'react';
import PropTypes from 'prop-types';
import { Table, Menu, Icon } from "semantic-ui-react";

const VendorOrderList = props => {
  const { sort, activePage, totalPages } = props;
  let direction = null;
  if (typeof sort === 'object')
    direction = sort.direction === 'ASC' ? 'ascending' : (sort.direction === 'DESC' ? 'descending' : null);
    
  return (
    <Table>
      <Table.Header>
        <Table.HeaderCell 
          sorted={direction}>
          Date Added
          {typeof sort !== undefined && sort.key === 'date_added' ? <Icon disabled name={`caret ${sort.key === 'ascending' ? 'up' : 'down'}`} /> : null}
        </Table.HeaderCell>
        <Table.HeaderCell>
          Designer
        </Table.HeaderCell>
        <Table.HeaderCell>
          Product
        </Table.HeaderCell>
        <Table.HeaderCell>
          Retail price
        </Table.HeaderCell>
        <Table.HeaderCell>
          Options
        </Table.HeaderCell>
        <Table.HeaderCell>
          ACH OH
        </Table.HeaderCell>
        <Table.HeaderCell>
          Total Awaiting
        </Table.HeaderCell>
        <Table.HeaderCell>
          Units To Order
        </Table.HeaderCell>
        <Table.HeaderCell>
          Notes
        </Table.HeaderCell>
        <Table.HeaderCell>
          Internal Notes
        </Table.HeaderCell>
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
}

export default VendorOrderList;