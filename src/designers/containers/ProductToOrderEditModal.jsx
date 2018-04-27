import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Icon, Modal, Form, Button } from 'semantic-ui-react';
import { getProductAndVariants } from '../../products/actions';
import { updateVendorOrderProduct } from '../actions';

class ProductToOrderEditModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modalOpen: false,
      productVariants: [],
      productVariantSelected: null,
      productUnits: this.props.productUnits || 0,
      notes: this.props.notes,
      internalNotes: this.props.internalNotes,
    };
  }

  requestProductVariants(productId) {
    this.props.getProductAndVariants(this.props.token, productId);
  }

  getVariantsOptions() {
    return this.state.productVariants.reduce((allOptions, pv) => {
      const options = pv.variants
        .filter(pvv => allOptions.findIndex(ao => ao.value === pvv.variantId) === -1)
        .map(pvv => ({
            text: `${pvv.color_label}${pvv.size_label ? ` - ${pvv.size_label}` : ''}`,
            value: pvv.variantId
          })
        );
      return [
        ...allOptions,
        ...options
      ];
    }, []);
  }

  detectIfProductIsStored(productId, products) {
    return this.props.productsStore.products.filter(p => p.productId === this.props.productId) !== -1
  }

  handleProductUpdate() {
    const options = {
      vendorOrderVariantId: this.props.vendorOrderVariantId,
      units: this.state.productUnits,
      notes: this.state.notes,
      internalNotes: this.state.internalNotes,
      productVariantId: this.state.productVariantSelected
    };
    
    this.setState({ modalOpen: false });
    this.props.updateVendorOrderProduct(this.props.token, options);
  }

  componentWillMount() {
    this.requestProductVariants(this.props.productId);
  }

  componentWillReceiveProps(newProps) {
    if (this.detectIfProductIsStored(this.props.productId, newProps.productsStore.products)) {
      this.setState({
        productVariants: newProps.productsStore.products.filter(p => p.productId === this.props.productId)
      });
    }
  }

  render() {
    return (
      <section>
        <div style={Styles.textWrapper}>
          <Button
            size="mini"
            icon="edit"
            onClick={() => this.setState({ modalOpen: true })} />
        </div>

        <Modal dimmer={true} size="tiny" open={this.state.modalOpen} onClose={() => this.setState({ modalOpen: false })}>
          <Modal.Header
            content={`Edit product`} />

          <Modal.Content>
            <Form>
              <Form.Input
                label="Vendor"
                value={this.props.vendorName} />

              <Form.Select
                label="Product Variants"
                options={this.getVariantsOptions()}
                onChange={(e, { value }) => {
                  this.setState({ productVariantSelected: value })
                }} />

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
            <Button positive content='Update' onClick={this.handleProductUpdate.bind(this)} />
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

ProductToOrderEditModal.propTypes = {
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

export default connect(state, actions)(ProductToOrderEditModal);
