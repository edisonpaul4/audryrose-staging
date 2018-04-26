import React from 'react';
import PropTypes from 'prop-types';
import { Table, Menu, Icon } from "semantic-ui-react";

const EmailList = props => (
  <Table>
    <Table.Header>
      <Table.Row>
        {props.headerColumns.map((hc, i) => (
          <Table.HeaderCell
            key={i}
            content={hc} />  
        ))}
      </Table.Row>
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
);

EmailList.propTypes = {
  activePage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  handleOnPageChange: PropTypes.func.isRequired,
  headerColumns: PropTypes.arrayOf(PropTypes.string).isRequired
}

export default EmailList;