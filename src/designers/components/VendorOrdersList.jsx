import React from 'react';
import PropTypes from 'prop-types';
import { Table, Menu, Icon } from "semantic-ui-react";

const VendorOrderList = props => {
    const { sort, activePage, totalPages, handleOnSortChange } = props;
    const caretIcon = typeof sort === 'object' ? <Icon key="1" disabled name={`caret ${sort.direction === 'ASC' ? 'up' : 'down'}`} /> : null;

    return (
        <Table>
            <Table.Header>
                <Table.HeaderCell
                    content={["Date Added", typeof sort === 'object' && sort.key === 'dateAdded' ? caretIcon : null]}
                    onClick={() => handleOnSortChange("dateAdded")}
                    style={{ cursor: "pointer" }}
                    collapsing />
                <Table.HeaderCell
                    content={["Designer", typeof sort === 'object' && sort.key === 'designerName' ? caretIcon : null]}
                    onClick={() => handleOnSortChange("designerName")}
                    style={{ cursor: "pointer" }} />
                <Table.HeaderCell
                    content={["Product", typeof sort === 'object' && sort.key === 'productName' ? caretIcon : null]}
                    onClick={() => handleOnSortChange("productName")}
                    style={{ cursor: "pointer" }} />
                <Table.HeaderCell
                    content={["Retail price", typeof sort === 'object' && sort.key === 'retailPrice' ? caretIcon : null]}
                    onClick={() => handleOnSortChange("retailPrice")}
                    style={{ cursor: "pointer" }}
                    collapsing />
                <Table.HeaderCell
                    content="Options" />
                <Table.HeaderCell
                    content={["ACH OH", typeof sort === 'object' && sort.key === 'totalInventory' ? caretIcon : null]}
                    onClick={() => handleOnSortChange("totalInventory")}
                    style={{ cursor: "pointer" }}
                    collapsing />
                <Table.HeaderCell
                    content={["Total Awaiting", typeof sort === 'object' && sort.key === 'totalAwaiting' ? caretIcon : null]}
                    onClick={() => handleOnSortChange("totalAwaiting")}
                    style={{ cursor: "pointer" }}
                    collapsing />
                <Table.HeaderCell
                    content={["Units To Order", typeof sort === 'object' && sort.key === 'unitsToOrder' ? caretIcon : null]}
                    onClick={() => handleOnSortChange("unitsToOrder")}
                    style={{ cursor: "pointer" }}
                    collapsing />
                <Table.HeaderCell
                    content={["Notes", typeof sort === 'object' && sort.key === 'note' ? caretIcon : null]}
                    onClick={() => handleOnSortChange("note")}
                    style={{ cursor: "pointer" }} />
                <Table.HeaderCell
                    content={["Internal Notes", typeof sort === 'object' && sort.key === 'internalNote' ? caretIcon : null]}
                    onClick={() => handleOnSortChange("internalNote")}
                    style={{ cursor: "pointer" }} />
                <Table.HeaderCell width={1} />
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
        key: PropTypes.string,
        direction: PropTypes.string
    }),
    activePage: PropTypes.number.isRequired,
    totalPages: PropTypes.number.isRequired,
    handleOnPageChange: PropTypes.func.isRequired,
    handleOnSortChange: PropTypes.func.isRequired
}

export default VendorOrderList;