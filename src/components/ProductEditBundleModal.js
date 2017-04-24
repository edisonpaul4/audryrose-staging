import React, { Component } from 'react';
import { Modal, Button, Table, Form, Header, Segment } from 'semantic-ui-react';

class ProductEditBundleModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formComplete: false,
      productData: this.props.bundleFormData && this.props.bundleFormData.product ? this.props.bundleFormData.product : null,
      products: this.props.bundleFormData && this.props.bundleFormData.products ? this.props.bundleFormData.products : [],
      selectedProduct: '',
      selectedVariant: '',
      bundleVariants: []
    };
    this.handleSave = this.handleSave.bind(this);
    this.handleProductChange = this.handleProductChange.bind(this);
    this.handleVariantChange = this.handleVariantChange.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }
  
	handleSave() {
    var data = {
      bundleProductId: this.state.productData.productId,
      bundleVariants: this.state.bundleVariants
    };
		this.props.handleProductBundleSave(data);
		this.props.handleEditBundleModalClose();
	}
	
  handleClose() {
    this.setState({
      formComplete: false,
      productData: this.props.bundleFormData && this.props.bundleFormData.product ? this.props.bundleFormData.product : null,
      products: this.props.bundleFormData && this.props.bundleFormData.products ? this.props.bundleFormData.products : [],
      selectedProduct: '',
      selectedVariant: '',
      bundleVariants: []
    });
    this.props.handleEditBundleModalClose();
  }
  
  isFormComplete() {
    let formComplete = true;
    if (this.state.selectedProduct === undefined || this.state.selectedProduct === '') formComplete = false;
    if (this.state.selectedVariant === undefined || this.state.selectedVariant === '') formComplete = false;
    return formComplete;
  }
  
	handleProductChange(e, {value}) {
  	if (value !== this.state.selectedProduct) {
    	this.setState({
      	selectedProduct: value
    	});
  	}
	}
	
	handleVariantChange(e, {value}) {
  	if (value !== this.state.selectedVariant) {
    	this.setState({
      	selectedVariant: value
    	});
  	}
	}
	
	handleAdd() {
  	let bundleVariants = this.state.bundleVariants;
    bundleVariants.push(this.state.selectedVariant);
  	this.setState({
      selectedProduct: '',
      selectedVariant: '',    	
    	bundleVariants: bundleVariants
  	});
	}
	
	handleRemove(id) {
  	let bundleVariants = this.state.bundleVariants;
  	const index = bundleVariants.indexOf(id);
    if (index >= 0) bundleVariants.splice(index, 1);
  	this.setState({	
    	bundleVariants: bundleVariants
  	});
	}
	
	componentWillReceiveProps(nextProps) {
  	if (nextProps.bundleFormData) {
    	let bundleVariants = this.state.bundleVariants;
    	if (nextProps.bundleFormData.product.bundleVariants) {
      	nextProps.bundleFormData.product.bundleVariants.map(function(bundleVariant, i) {
        	bundleVariants.push(bundleVariant.objectId);
        	return bundleVariant;
      	});
    	}
    	this.setState({
      	productData: nextProps.bundleFormData.product ? nextProps.bundleFormData.product : null,
      	products: nextProps.bundleFormData.products ? nextProps.bundleFormData.products : null,
      	bundleVariants: bundleVariants
    	});
  	}
	}
	
	getVariantText(variant) {
		let variantText = '';
		if (variant.color_value) variantText += ' ' + variant.color_value;
		if (variant.gemstone_value) variantText += ' ' + variant.gemstone_value;
		if (variant.length_value) variantText += ' ' + variant.length_value;
		if (variant.letter_value) variantText += ' ' + variant.letter_value;
		if (variant.singlepair_value) variantText += ' ' + variant.singlepair_value;
		variantText = variantText.trim();
		if (variantText === '') variantText = 'No options';
		
  	return variantText;
	}
  
	render() {
  	const scope = this;
  	
  	// Create add product dropdown options
  	let productsOptions = [];
  	let variantsOptions = [];
  	let optionValues = [];
		this.state.products.map(function(product, i) {
  		if (product.variants.length > 0) {
    		product.variants.map(function(variant, j) {
          const variantText = scope.getVariantText(variant);
      		if (product.productId === scope.state.selectedProduct) {	
        		if (optionValues.indexOf(variantText) < 0) {
          		optionValues.push(variantText);
          		variantsOptions.push({ key: j, value: variant.objectId, text: variantText });
        		}
      		}
      		return variant;
    		});
  		}
  		productsOptions.push({ key: i, value: product.productId, text: product.productId + ' - ' + product.name });
  		return product;
		});
		
		// Create bundle product rows
		let bundleProductRows = [];
		this.state.bundleVariants.map(function(bundleVariant, i) {
  		scope.state.products.map(function(product, j) {
    		product.variants.map(function(variant, k) {
      		if (variant.objectId === bundleVariant) {
        		const rowId = i + '-' + j + '-' + k;
        		const variantText = scope.getVariantText(variant);
            bundleProductRows.push(
              <Table.Row key={rowId}>
                <Table.Cell>{product.productId}</Table.Cell>
                <Table.Cell>{product.name}</Table.Cell>
                <Table.Cell>{variantText}</Table.Cell>
                <Table.Cell>
                  <Button 
                    type='button' 
                    basic 
                    content='Remove' 
                    disabled={scope.props.isLoading} 
                    color='red' 
                    size='tiny'
                    onClick={()=>scope.handleRemove(variant.objectId)} 
                  />
                </Table.Cell>
              </Table.Row>
            );
      		}
      		return variant;
    		});
    		return product;
  		});
  		return bundleVariant;
		});
		
		const productsSelect = this.state.products ? <Form.Select search selection placeholder='Select a product' value={this.state.selectedProduct} options={productsOptions} onChange={this.handleProductChange} /> : null;
		
		const variantsSelect = variantsOptions.length > 0 ? <Form.Select placeholder='Select default options' value={this.state.selectedVariant} options={variantsOptions} onChange={this.handleVariantChange} /> : null;
  	
		const saveButton = <Button disabled={this.props.isLoading} color='olive' onClick={this.handleSave}>Save Bundle</Button>;
		
		const addButton = <Button type='button' basic icon='plus' content='Add' disabled={this.props.isLoading || !this.isFormComplete()} color='olive' onClick={this.handleAdd} />;
    
    return (
	    <Modal open={this.props.open} onClose={this.handleClose} size='small' closeIcon='close'>
        <Modal.Content>
          <Header>Bundle Products</Header>
          <Table basic='very' celled>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Product Id</Table.HeaderCell>
                <Table.HeaderCell>Product Name</Table.HeaderCell>
                <Table.HeaderCell>Default Options</Table.HeaderCell>
                <Table.HeaderCell className='right aligned'> </Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {bundleProductRows}
            </Table.Body>
          </Table>
            
          <Segment>
            <Form loading={this.props.isLoading}>
              <Header>Add a product to the bundle</Header>
              <Form.Group inline>
                <Form.Field>
                  {productsSelect}
                </Form.Field>
                <Form.Field>
                  {variantsSelect}
                </Form.Field>
                <Form.Field>
                  {addButton}
                </Form.Field>
              </Form.Group>
            </Form>
          </Segment>
        </Modal.Content>
        <Modal.Actions>
          <Button basic disabled={this.props.isLoading} color='grey' content='Close' onClick={this.handleClose} />
          {saveButton}
        </Modal.Actions>
      </Modal>
    );
  }
}

export default ProductEditBundleModal;