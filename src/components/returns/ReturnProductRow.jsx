import React from 'react';
import PropTypes from 'prop-types';
import { Table, Image, Modal, Button, Icon, Segment, Confirm } from 'semantic-ui-react';
import moment from 'moment';

class ReturnProductRow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      notesnotesModalOpen: false,
      checkInConfirmModal: false
    }
  }

  onCheckInConfirm() {
    this.setState({ checkInConfirmModal: false });
    this.props.checkedInHandler();
  }

  render() {
    const { dateRequested, dateCheckedIn, orderId, customerName, productName, productImage, orderNotes, returnStatus } = this.props;
    
    const words = [
      (orderNotes.customerNotes !== null || orderNotes.staffNotes !== null) ? 'C' : null,
      orderNotes.designerNotes !== null ? 'D' : null,
      orderNotes.internalNotes !== null ? 'I' : null,
    ].filter(w => w !== null).join(' - ');

    return (
      <Table.Row>
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
            onConfirm={this.onCheckInConfirm.bind(this)}/>
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
                <b>Customer's note:</b> <br/>
                {orderNotes.customersNote}
              </Segment>
              <Segment>
                <b>Staff's note:</b> <br/>
                {orderNotes.staffNote}
              </Segment>
              <Segment>
                <b>Internal's note:</b> <br/>
                {orderNotes.internalNotes}
              </Segment>
              <Segment>
                <b>Designer's note:</b> <br/>
                {orderNotes.designerNotes}
              </Segment>
            </Modal.Content>

            <Modal.Actions>
              <Button content='Close' onClick={() => this.setState({ notesModalOpen: false })} />
            </Modal.Actions>
          </Modal>
        </Table.Cell>
        <Table.Cell>{returnStatus}</Table.Cell>
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