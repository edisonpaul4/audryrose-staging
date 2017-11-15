import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, Form} from 'semantic-ui-react';

export default class EmailLastLineUpdater extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalOpen: false,
      formText: '',
    }
  }

  onUpdateAll(text) {
    this.props.handleUpdateAll(text);
    this.setState({
      modalOpen: false,
    })
  }
  
  render() {
    return (
      <Button onClick={() => this.setState({ modalOpen: true })}>
        Update emails' Last Line

        <Modal dimmer={true} size="tiny" open={this.state.modalOpen} onClose={() => this.setState({ modalOpen: false })}>
          <Modal.Header
            content="Emails' last line" />

          <Modal.Content>
            <Form>
              <Form.TextArea
                label="Emails' last line text"
                value={this.state.formText}
                onInput={e => this.setState({ formText: e.target.value })} />
            </Form>
          </Modal.Content>

          <Modal.Actions>
            <Button 
              negative 
              content='Cancel' 
              onClick={() => this.setState({ modalOpen: false })} />

            <Button 
              positive 
              content='Update all' 
              onClick={this.onUpdateAll.bind(this, this.state.formText)} />
          </Modal.Actions>
        </Modal>
      </Button>
    );
  }
};

EmailLastLineUpdater.propTypes = {
  handleUpdateAll: PropTypes.func.isRequired,
}