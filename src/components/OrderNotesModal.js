import React from 'react';
import { PropTypes } from 'prop-types';
import { Form, Modal, Icon, Button } from 'semantic-ui-react';

export default class OrderNotesModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalOpen: false,
      orderId: this.props.orderId,
      customersNote: this.props.customerMessage || '',
      designersNote: this.props.designersNote || '',
      staffNote: this.props.staffNote || '',
    }
  }

  onSubmit() {
    console.log('OrderNotesModal::onSubmit');
    this.setState({ modalOpen: false });
    this.props.submitHandler(this.state.orderId, {
      designerNote: this.state.designersNote,
      staffNote: this.state.staffNote
    });
  }

  render() {
    const words = [
      this.state.customersNote !== '' ? 'C' : null,
      this.state.designersNote !== '' ? 'D' : null,
      this.state.staffNote !== '' ? 'S' : null,
    ].filter(w => w !== null).join(' - ');

    return (
      <section>
        <div style={Styles.textWrapper}>
          <span>{words}</span>
          <Icon name='edit' link onClick={() => this.setState({ modalOpen: true })} />
        </div>

        <Modal dimmer={true} size="small" open={this.state.modalOpen} onClose={() => this.setState({ modalOpen: false })}>
          <Modal.Header 
            content="Order's notes" />

          <Modal.Content>
            <Form>
              <Form.TextArea
                label="Customer's note" 
                value={this.state.customersNote} 
                style={{ pointerEvents: 'none' }} />
              <Form.TextArea
                label="Designer's note" 
                value={this.state.designersNote}
                onInput={e => this.setState({ designersNote: e.target.value })} />
              <Form.TextArea
                label="Staff's note" 
                value={this.state.staffNote}
                onInput={e => this.setState({ staffNote: e.target.value })} />
            </Form>
          </Modal.Content>

          <Modal.Actions>
            <Button negative content='Cancel' onClick={() => this.setState({ modalOpen: false })} />
            <Button positive content='Update' onClick={this.onSubmit.bind(this)} />
          </Modal.Actions>
        </Modal>
      </section>
    );
  }
}

const Styles = {
  textWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: '0 0 0 15px',
  }
};

OrderNotesModal.propTypes = {
  orderId: PropTypes.number.isRequired,
  customerMessage: PropTypes.string,
  designersNote: PropTypes.string,
  staffNote: PropTypes.string,
  submitHandler: PropTypes.func.isRequired
}