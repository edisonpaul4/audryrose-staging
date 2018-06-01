import React from 'react';
import PropTypes from 'prop-types';
import { Table, Image, Modal, Button, Icon, Segment, Confirm, Dropdown } from 'semantic-ui-react';
import moment from 'moment';

class ReturnProductRow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            notesModalOpen: false,
            checkInConfirmModal: false,

        }
    }

    onCheckInConfirm() {
        this.setState({ checkInConfirmModal: false });
        this.props.checkedInHandler(this.props.returnId);
    }

    onReturnStatusChanged(e, { value }) {
        if (this.props.returnStatusId !== value)
            this.props.updateReturnStatus(this.props.returnId, value);
    }

    onDelete(id){
        this.props.deleteReturn(this.props.returnId)
    }

    getAvailableStatus(returnStatusId, returnType, returnTypeId) {
        const startedStatus = (returnType.slice(0, 1).toUpperCase() + returnType.slice(1).toLowerCase()) + ' Initiated';
        const completedStatus = (returnType.slice(0, 1).toUpperCase() + returnType.slice(1).toLowerCase()) + ' Completed';

        const all = [
            { key: 0, text: startedStatus, value: 0, disabled: false },
            { key: 1, text: 'Being repaired', value: 1, disabled: false },
            { key: 2, text: 'Being resized', value: 2, disabled: false },
            { key: 3, text: 'Resize completed', value: 3, disabled: false },
            { key: 4, text: 'Repair completed', value: 4, disabled: false },
            { key: 5, text: completedStatus, value: 5, disabled: false },
        ];

        if (returnStatusId === 1)
            return all.map(s => s.key === 1 || s.key === 4 ? s : { ...s, disabled: true });
        else if (returnStatusId === 2)
            return all.map(s => s.key === 2 || s.key === 3 ? s : { ...s, disabled: true });
        else if (returnStatusId === 3 || returnStatusId === 4)
            return all.map(s => s.key === returnStatusId || s.key === 5 ? s : { ...s, disabled: true });
        else if (returnStatusId === 5)
            return all.map(s => s.key === 5 ? s : { ...s, disabled: true });
        else
            return all.map(s => s.key === 0 ? s : { ...s, disabled: true });

    }

    render() {
        const { dateRequested, dateCheckedIn, orderId, customerName, productName, productImage, orderNotes, returnStatusId, returnType, returnTypeId, shippoInfo } = this.props;

        const words = [
            (orderNotes.customerNotes !== null || orderNotes.staffNotes !== null) ? 'C' : null,
            orderNotes.designerNotes !== null ? 'D' : null,
            orderNotes.internalNotes !== null ? 'I' : null,
        ].filter(w => w !== null).join(' - ');

        return (
            <Table.Row
                style={{ backgroundColor: moment().diff(dateRequested, 'weeks') >= 1 ? 'rgba(255, 0, 0, .25)' : 'transparent' }}>

                <Table.Cell>{moment(dateRequested).format('MMMM DD, YYYY')}</Table.Cell>
                <Table.Cell>
                    {dateCheckedIn ? moment(dateCheckedIn).format('MMMM DD, YYYY') : (
                        <Button
                            fluid
                            onClick={() => this.setState({ checkInConfirmModal: true })}
                            content={"Check In"} />
                    )}

                    <Confirm
                        size={"mini"}
                        header="Check in"
                        open={this.state.checkInConfirmModal}
                        content="Are you sure you want to check in this return?"
                        confirmButton="Check in"
                        cancelButton="Cancel"
                        onCancel={() => this.setState({ checkInConfirmModal: false })}
                        onConfirm={this.onCheckInConfirm.bind(this)} />
                </Table.Cell>
                <Table.Cell>{orderId}</Table.Cell>
                <Table.Cell>{customerName}</Table.Cell>
                <Table.Cell>{productName}</Table.Cell>
                <Table.Cell>
                    <Image
                        href={productImage} />
                </Table.Cell>

                <Table.Cell>
                    <Button style={{ display: 'flex', justifyContent: 'space-around' }} fluid onClick={() => this.setState({ notesModalOpen: true })}>
                        <span>{words}</span>
                        <Icon name="edit" />
                    </Button>

                    <Modal dimmer={true} size="small" open={this.state.notesModalOpen} onClose={() => this.setState({ notesModalOpen: false })}>
                        <Modal.Header
                            content="Notes" />

                        <Modal.Content>
                            <Segment>
                                <b>{"Customer's note:"}</b> <br />
                                {orderNotes.customersNote}
                            </Segment>
                            <Segment>
                                <b>{"Staff's note:"}</b> <br />
                                {orderNotes.staffNote}
                            </Segment>
                            <Segment>
                                <b>{"Internal's note:"}</b> <br />
                                {orderNotes.internalNotes}
                            </Segment>
                            <Segment>
                                <b>{"Designer's note:"}</b> <br />
                                {orderNotes.designerNotes}
                            </Segment>
                        </Modal.Content>

                        <Modal.Actions>
                            <Button content='Close' onClick={() => this.setState({ notesModalOpen: false })} />
                        </Modal.Actions>
                    </Modal>
                </Table.Cell>
                <Table.Cell>
                    <Dropdown
                        placeholder='Select status'
                        selection
                        options={this.getAvailableStatus(returnStatusId, returnType, returnTypeId)}
                        value={returnStatusId}
                        onChange={this.onReturnStatusChanged.bind(this)} />

                    <Button content='Track' onClick={() => window.open(shippoInfo.tracking_url_provider, "_blank")} />
                    <Button icon onClick={() => this.onDelete(orderId)}>
                        <Icon name='trash' color='red'/>
                    </Button>
                </Table.Cell>
            </Table.Row>
        );
    }
}

ReturnProductRow.propTypes = {
    returnId: PropTypes.string.isRequired,
    dateRequested: PropTypes.string.isRequired,
    dateCheckedIn: PropTypes.string,
    checkedInHandler: PropTypes.func.isRequired,
    orderId: PropTypes.number.isRequired,
    customerName: PropTypes.string.isRequired,
    productName: PropTypes.string.isRequired,
    productImage: PropTypes.string,
    orderNotes: PropTypes.shape({
        staffNotes: PropTypes.string,
        internalNotes: PropTypes.string,
        designerNotes: PropTypes.string,
        customerNotes: PropTypes.string,
    }),
    returnStatus: PropTypes.string.isRequired,
    returnStatusId: PropTypes.number.isRequired,
    returnType: PropTypes.string.isRequired,
    returnTypeId: PropTypes.number.isRequired,
}

export default ReturnProductRow;