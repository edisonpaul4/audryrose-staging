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
            designerNotes: this.props.designerNotes || '',
            staffNote: this.props.staffNote || '',
            internalNotes: this.props.internalNotes || '',
        }
    }

    onSubmit() {
        this.setState({ modalOpen: false });
        this.props.submitHandler(this.state.orderId, {
            designerNotes: this.state.designerNotes,
            internalNotes: this.state.internalNotes
        });
    }

    render() {
        const words = [
            (this.state.customersNote !== '' || this.state.staffNote !== '') ? 'C' : null,
            this.state.designerNotes !== '' ? 'D' : null,
            this.state.internalNotes !== '' ? 'I' : null,
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
                                label="Staff's note"
                                value={this.state.staffNote}
                                style={{ pointerEvents: 'none' }} />
                            <Form.TextArea
                                label="Internal's note"
                                value={this.state.internalNotes}
                                onInput={e => this.setState({ internalNotes: e.target.value })} />
                            <Form.TextArea
                                label="Designer's note"
                                value={this.state.designerNotes}
                                onInput={e => this.setState({ designerNotes: e.target.value })} />
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
    designerNotes: PropTypes.string,
    staffNote: PropTypes.string,
    internalNotes: PropTypes.string,
    submitHandler: PropTypes.func.isRequired
}