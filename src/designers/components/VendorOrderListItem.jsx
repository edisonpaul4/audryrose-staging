import React from 'react';
import PropTypes from 'prop-types';
import { Table, Icon } from 'semantic-ui-react';
import moment from 'moment';

class VendorOrderListItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            rowHover: false,
        };
    }

    render() {
        const { dateAdded, designerId, designerName, productId, productName, retailPrice, productOptions, variantOptions, totalInventory, totalAwaiting, unitsToOrder, note, internalNote, handleOnDelete, vendorOrderObjectId, vendorOrderVariantObjectId, designerObjectId } = this.props;

        const options = typeof variantOptions !== 'undefined' ? variantOptions : productOptions;

        return (
            <Table.Row
                onMouseOver={e => this.setState({ rowHover: true })}
                onMouseOut={e => this.setState({ rowHover: false })}>

                <Table.Cell
                    collapsing
                    content={moment(dateAdded.iso).format("MM/DD/YYYY")} />

                <Table.Cell
                    collapsing
                    content={<a target="_blank" href={`https://www.loveaudryrose.com/manage/products/brands/${designerId}/edit`}>{designerName}</a>} />

                <Table.Cell
                    content={<a href={`/products/search?q=${productId}`}>{productName}</a>} />

                <Table.Cell
                    content={`$${retailPrice | 0}`} />

                <Table.Cell
                    collapsing
                    content={options.map(({ displayName, displayValue }, i) => (
                        <div key={i}>{`${displayName}: ${displayValue}`}</div>
                    ))} />

                <Table.Cell content={totalInventory | 0} />

                <Table.Cell content={totalAwaiting | 0} />

                <Table.Cell content={unitsToOrder | 0} />

                <Table.Cell>
                    <span dangerouslySetInnerHTML={{ __html: note }} />
                </Table.Cell>

                <Table.Cell>
                    <span dangerouslySetInnerHTML={{ __html: internalNote }} />
                </Table.Cell>

                <Table.Cell
                    onClick={e => handleOnDelete(vendorOrderObjectId, vendorOrderVariantObjectId)}
                    style={{ cursor: 'pointer' }}
                    content={this.state.rowHover ? <Icon name="close" /> : null} />
            </Table.Row>
        );
    }
}

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
    variantOptions: PropTypes.arrayOf(PropTypes.shape({
        displayName: PropTypes.string,
        displayValue: PropTypes.string,
    })),
    totalInventory: PropTypes.number,
    totalAwaiting: PropTypes.number,
    unitsToOrder: PropTypes.number,
    note: PropTypes.string,
    internalNote: PropTypes.string,
    handleOnDelete: PropTypes.func.isRequired,
};

export default VendorOrderListItem;