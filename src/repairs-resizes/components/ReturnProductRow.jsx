import React from 'react';
import PropTypes from 'prop-types';
import { Table, Image, Modal, Button, Icon, Segment, Confirm, Dropdown, Input } from 'semantic-ui-react';
import moment from 'moment';
import { ImagesModal } from '../../products-stats/components/components';
class ReturnProductRow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            notesModalOpen: false,
            checkInConfirmModal: false,
            editSizeModal: false,
            customSize: 0,
            isModalOpen: false,
            focusedProductId: null,
            focusedProductName: ''
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

    onDelete(id) {
        this.props.deleteReturn(this.props.returnId)
    }

    onSizeChanged(e, { value }) {
        this.setState({
            customSize: value
        })

    }
    handleOpenModal(productId, productName) {
        this.setState({
            isModalOpen: true,
            focusedProductId: productId,
            focusedProductName: productName
        })
    }
    handleImagesModalClose() {
        this.setState({
            isModalOpen: false,
            focusedProductId: null,
            focusedProductName: ''
        })
    }
    handleResizeSizeSave() {
        if (this.state.customSize > 0) {
            this.setState({ editSizeModal: false })
            this.props.updateResize(this.props.returnId, this.state.customSize);
        }
    }
    handleUploadRepairImage(file) {
        this.props.uploadRepairImageHandler(this.props.returnId, file)

    }

    getAvailableStatus(returnStatusId, returnType, returnTypeId) {
        const startedStatus = (returnType.slice(0, 1).toUpperCase() + returnType.slice(1).toLowerCase()) + ' Initiated';
        const completedStatus = (returnType.slice(0, 1).toUpperCase() + returnType.slice(1).toLowerCase()) + ' Completed';

        const resizeOp = [
            { key: 0, text: startedStatus, value: 0, disabled: !(returnStatusId == 0 || (returnStatusId != 2 && returnStatusId != 3)) },
            { key: 1, text: 'Being resized', value: 2, disabled: !(returnStatusId == 0 || returnStatusId == 2) },
            { key: 2, text: completedStatus, value: 3, disabled: !(returnStatusId == 2 || returnStatusId == 3) },
        ];
        const repairOp = [
            { key: 0, text: startedStatus, value: 0, disabled: !(returnStatusId == 0 || (returnStatusId != 1 && returnStatusId != 4)) },
            { key: 1, text: 'Being repaired', value: 1, disabled: !(returnStatusId == 0 || returnStatusId == 1) },
            { key: 2, text: completedStatus, value: 4, disabled: !(returnStatusId == 1 || returnStatusId == 4) },
        ];
        const returnOp = [
            { key: 0, text: startedStatus, value: 0, disabled: !(returnStatusId == 0 && returnStatusId != 5) },
            { key: 1, text: completedStatus, value: 5, disabled: !(returnStatusId == 0 || returnStatusId == 5) },
        ];
        if (returnTypeId == 0) { //return 
            return returnOp;
        }
        if (returnTypeId == 1) { //repair
            return repairOp;
        }
        if (returnTypeId == 2) { //resize
            return resizeOp;
        }

    }

    render() {
        let { dateRequested, dateCheckedIn, orderId, customerName, productName,
            productImage, orderNotes, returnStatusId, returnType, returnTypeId,
            shippoInfo, returnOptions, productId, returnId, pictureUrl, returnObj } = this.props;
        let returnObject = [];
        returnObject.push(returnObj)
        const words = [
            (orderNotes.customerNotes !== null || orderNotes.staffNotes !== null) ? 'C' : null,
            orderNotes.designerNotes !== null ? 'D' : null,
            orderNotes.internalNotes !== null ? 'I' : null,
        ].filter(w => w !== null).join(' - ');
        productName = returnOptions[0] != undefined ? (productName + '  - Size:  ' + returnOptions[0].newSize + ' - ') : productName;
        const buttonEdit = (returnOptions[0] && returnOptions[0].newSize != undefined) ? (<Button icon onClick={() => this.setState({ editSizeModal: true })}>
            <Icon name='edit' />
        </Button>) : null;
        const modalEdit = (returnOptions[0] && returnOptions[0].newSize != undefined) != undefined ? (<Modal dimmer={true} size="small" open={this.state.editSizeModal} onClose={() => this.setState({ editSizeModal: false })}>
            <Modal.Header
                content="Edit Resize Size" />
            <Modal.Content>
                <Segment>
                    <b>{"Current Size: "}</b> <br />
                    {returnOptions[0].newSize}
                </Segment>
                <Segment>
                    <b>{"New Size: "}</b> <br />
                    <Input type='number' onChange={this.onSizeChanged.bind(this)} />
                </Segment>
            </Modal.Content>

            <Modal.Actions>
                <Button content='Close' onClick={() => this.setState({ editSizeModal: false })} />
                <Button content='Save' onClick={() => this.handleResizeSizeSave()} />
            </Modal.Actions>
        </Modal>) : null;
        const addPicture = returnTypeId == 1 && (returnStatusId == 1 || returnStatusId == 4) ? (<Button icon onClick={() => this.handleOpenModal(productId, productName)}>
            <Icon name='file' color='green' />
        </Button>) : null;

        const modalPictures = returnTypeId == 1 && (returnStatusId == 1 || returnStatusId == 4) ? (<ImagesModal
            open={this.state.isModalOpen}
            productName={this.state.focusedProductName}
            returnId={returnId}
            handleImagesModalClose={this.handleImagesModalClose.bind(this)}
            handleUploadRepairImage={this.handleUploadRepairImage.bind(this)}
            pictureUrl={pictureUrl}
            isUniqueReturn={true} />) : null;
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
                <Table.Cell>{productName}
                    {buttonEdit}
                    {modalEdit}
                </Table.Cell>
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
                        <Icon name='trash' color='red' />
                    </Button>
                    {addPicture}
                </Table.Cell>
                {modalPictures}
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