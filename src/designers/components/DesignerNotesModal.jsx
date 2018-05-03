import React from 'react';
import { PropTypes } from 'prop-types';
import { Form, Modal, Icon, Button } from 'semantic-ui-react';

export default class DesignerNotesModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modalOpen: false,
            designersNotes: this.props.designersNote || [],
        }
    }

    onSubmit() {
        this.setState({ modalOpen: false });
        this.props.submitHandler(this.state.orderId, {
            designerNote: this.state.designersNote,
            staffNote: this.state.staffNote
        });
    }

    render() {
        return (
            <section>
                <div style={Styles.textWrapper}>
                    <span>{this.state.designersNotes.length > 0 ? 'D' : ''}</span>
                    <Icon name='edit' link onClick={() => this.setState({ modalOpen: true })} />
                </div>

                <Modal dimmer={true} size="tiny" open={this.state.modalOpen} onClose={() => this.setState({ modalOpen: false })}>
                    <Modal.Header
                        content="Notes" />

                    <Modal.Content>
                        <Form>
                            <Form.TextArea
                                label="Designer's note"
                                value={this.state.designersNote}
                                onInput={e => this.setState({ designersNote: e.target.value })} />
                        </Form>
                    </Modal.Content>

                    <Modal.Actions>
                        <Button negative content='Cancel' onClick={() => this.setState({ modalOpen: false })} />
                        <Button positive content='Update all' onClick={this.onSubmit.bind(this)} />
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

DesignerNotesModal.propTypes = {
    designersNote: PropTypes.array,
    submitHandler: PropTypes.func.isRequired
}