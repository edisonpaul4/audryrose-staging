import React from 'react';
import PropTypes from 'prop-types';
import { Table, Modal, Segment, Button } from 'semantic-ui-react';

class EmailListReturnItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      notesModalOpen: false,
    }
  }

  render() {
    const { returnId, orderId, customerName, customerLifetime, orderNotes } = this.props;
    const { notesModalOpen } = this.state;

    const words = [
      (orderNotes.customerNotes !== null || orderNotes.staffNotes !== null) ? 'C' : null,
      orderNotes.designerNotes !== null ? 'D' : null,
      orderNotes.internalNotes !== null ? 'I' : null,
    ].filter(w => w !== null).join(' - ');

    return (
      <Table.Row>
        <Table.Cell
          content={customerName} />

        <Table.Cell
          content={`$${customerLifetime.totalSpend}, ${customerLifetime.totalOrders} orders`} />

        <Table.Cell
          content={`Order #${orderId}`} />

        <Table.Cell>
          <Button
            style={{ display: 'flex', justifyContent: 'space-around' }}
            onClick={() => this.setState({ notesModalOpen: true })}
            content={words} />

          <Modal dimmer={true} size="small" open={notesModalOpen} onClose={() => this.setState({ notesModalOpen: false })}>
            <Modal.Header
              content="Notes" />

            <Modal.Content>
              <Segment>
                <b>Customer's note:</b> <br />
                {orderNotes.customersNote}
              </Segment>
              <Segment>
                <b>Staff's note:</b> <br />
                {orderNotes.staffNote}
              </Segment>
              <Segment>
                <b>Internal's note:</b> <br />
                {orderNotes.internalNotes}
              </Segment>
              <Segment>
                <b>Designer's note:</b> <br />
                {orderNotes.designerNotes}
              </Segment>
            </Modal.Content>

            <Modal.Actions>
              <Button content='Close' onClick={() => this.setState({ notesModalOpen: false })} />
            </Modal.Actions>
          </Modal>
        </Table.Cell>
      </Table.Row>
    );
  }
}

EmailListReturnItem.propTypes = {
  returnId: PropTypes.string.isRequired,
  orderId: PropTypes.number.isRequired,
  customerName: PropTypes.string.isRequired,
  customerLifetime: PropTypes.shape({
    totalSpend: PropTypes.number,
    totalOrders: PropTypes.number
  }),
  orderNotes: PropTypes.shape({
    customersNote: PropTypes.string,
    staffNote: PropTypes.string,
    internalNotes: PropTypes.string,
    designerNotes: PropTypes.string,
  }),
};

export default EmailListReturnItem;