import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Icon, Modal, Form, Button } from 'semantic-ui-react';
import { getProductAndVariants } from '../../products/actions';
import { updateVendorOrderProduct } from '../actions';

class CustomProductModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modalOpen: false,
      productUnits: this.props.productUnits || 0,
      notes: this.props.notes || '',
      internalNotes: this.props.internalNotes || '',
      productName: this.props.productName || '',
      options: this.props.options || ''
    };
  }
  
  handleProductUpdate() {
    const options = {
      units: this.state.productUnits,
      notes: this.state.notes,
      internalNotes: this.state.internalNotes,
      productName: this.state.productName,
      options: this.state.options
    };
    
    this.setState({ modalOpen: false });
    console.log(options);
    //this.props.updateVendorOrderProduct(this.props.token, options);
  }
  
  render() {
    return (
      <section>
        
        <Button
          size="mini"
          //label="Add Custom Product"
          color="green"
          style={{ cursor: 'pointer', float: 'right'}}
          onClick={() => this.setState({ modalOpen: true })} >
          Add Custom Product
          </Button>
    

        <Modal dimmer={true} size="tiny" open={this.state.modalOpen} onClose={() => this.setState({ modalOpen: false })}>
          <Modal.Header
            content={`Add Custom Product`} />

          <Modal.Content>
            <Form>
              <Form.Input
                label="Vendor"
                value={this.props.vendorName} />
              
              <Form.Input
                label="Product Name"
                value={this.state.productName} 
                onInput={e => this.setState({ productName: e.target.value })}/>
              
              <Form.Input
                label="Options"
                value={this.state.options} 
                onInput={e => this.setState({ options: e.target.value })}/>

              <Form.Input
                type="number"
                label="Units"
                value={this.state.productUnits}
                onInput={e => this.setState({ productUnits: e.target.value })} />

              <Form.TextArea
                label="Notes"
                value={this.state.notes}
                onInput={e => this.setState({ notes: e.target.value })} />

              <Form.TextArea
                label="Internal Notes"
                value={this.state.internalNotes}
                onInput={e => this.setState({ internalNotes: e.target.value })} />

            </Form>
          </Modal.Content>

          <Modal.Actions>
            <Button negative content='Cancel' onClick={() => this.setState({ modalOpen: false })} />
            <Button positive content='Add' onClick={this.handleProductUpdate.bind(this)} />
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
    alignItems: 'right',
    margin: '0 0 0 15px',
  }
};

CustomProductModal.propTypes = {
  vendorOrderVariantId: PropTypes.string.isRequired,
  vendorOrderNumber: PropTypes.string.isRequired,
  productId: PropTypes.number.isRequired,
  productName: PropTypes.string,
  vendorName: PropTypes.string.isRequired,
  notes: PropTypes.string,
  productUnits: PropTypes.number,
  internalNotes: PropTypes.string
};

const state = state => ({
  token: state.auth.token,
  productsStore: state.products
});

const actions = {
  getProductAndVariants,
  updateVendorOrderProduct
};

export default connect(state, actions)(CustomProductModal);