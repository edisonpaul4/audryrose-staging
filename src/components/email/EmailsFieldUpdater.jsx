import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, Form } from 'semantic-ui-react';

export default class EmailsFieldUpdater extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalOpen: false,
      fieldValue: this.props.value ? this.props.value : '',
    }
  }

  onUpdateAll(text) {
    this.props.handleUpdateAll(text);
    this.setState({
      modalOpen: false,
    })
  }
  
  render() {
    const { fieldValue, modalOpen } = this.state;
    const { button, header, label } = this.props;

    return (
      <Button onClick={() => this.setState({ modalOpen: true })}>
        {button}

        <Modal dimmer={true} size="tiny" open={modalOpen} onClose={() => this.setState({ modalOpen: false })}>
          <Modal.Header
            content={header} />

          <Modal.Content>
            <Form>
              <Form.TextArea
                label={label}
                value={fieldValue}
                onInput={e => this.setState({ fieldValue: e.target.value })} />
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
              onClick={this.onUpdateAll.bind(this, this.state.fieldValue)} />
          </Modal.Actions>
        </Modal>
      </Button>
    );
  }
};

EmailsFieldUpdater.propTypes = {
  button: PropTypes.string.isRequired,
  header: PropTypes.string.isRequired,
  label: PropTypes.string,
  value: PropTypes.string,
  handleUpdateAll: PropTypes.func.isRequired,
}