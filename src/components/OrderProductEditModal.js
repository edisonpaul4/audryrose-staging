import React, { Component } from 'react';
import { Modal, Button, Table, Form, Input, Header, Segment } from 'semantic-ui-react';

class OrderProductEditModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formComplete: false,
      productData: this.props.orderProductEditFormData && this.props.orderProductEditFormData.orderProduct ? this.props.orderProductEditFormData.orderProduct : null,
      products: this.props.orderProductEditFormData && this.props.orderProductEditFormData.products ? this.props.orderProductEditFormData.products : [],
      colorCodes: this.props.orderProductEditFormData && this.props.orderProductEditFormData.colorCodes ? this.props.orderProductEditFormData.colorCodes : [],
      stoneCodes: this.props.orderProductEditFormData && this.props.orderProductEditFormData.stoneCodes ? this.props.orderProductEditFormData.stoneCodes : [],
      sizeCodes: this.props.orderProductEditFormData && this.props.orderProductEditFormData.sizeCodes ? this.props.orderProductEditFormData.sizeCodes : [],
      miscCodes: this.props.orderProductEditFormData && this.props.orderProductEditFormData.miscCodes ? this.props.orderProductEditFormData.miscCodes : [],
      selectedProduct: '',
      selectedColor: '',
      selectedStone: '',
      selectedSize: '',
      selectedMisc: '',
      productVariants: [],
      isCustom: this.props.orderProductEditFormData.orderProduct && this.props.orderProductEditFormData.orderProduct.isCustom !== undefined ? this.props.orderProductEditFormData.orderProduct.isCustom : false
    };
    this.handleSave = this.handleSave.bind(this);
    this.handleProductChange = this.handleProductChange.bind(this);
    this.handleColorChange = this.handleColorChange.bind(this);
    this.handleStoneChange = this.handleStoneChange.bind(this);
    this.handleSizeChange = this.handleSizeChange.bind(this);
    this.handleMiscChange = this.handleMiscChange.bind(this);
    this.handleInventoryChange = this.handleInventoryChange.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }
  
  componentWillMount() {
    let productVariants = this.props.productVariants;
    productVariants = this.getProductVariants(productVariants, this.props.orderProductEditFormData);
  	this.setState({
    	productVariants: productVariants
  	});
  }
  
	handleSave() {
    var data = {
      orderId: this.state.productData.order_id,
      orderProductId: this.state.productData.orderProductId,
      productVariants: this.state.productVariants,
      isCustom: this.state.isCustom
    };
		this.props.handleOrderProductSave(data);
		this.props.handleOrderProductEditClose();
	}
	
  handleClose() {
    this.setState({
      formComplete: false,
      products: this.props.orderProductEditFormData && this.props.orderProductEditFormData.products ? this.props.orderProductEditFormData.products : [],
      colorCodes: this.props.orderProductEditFormData && this.props.orderProductEditFormData.colorCodes ? this.props.orderProductEditFormData.colorCodes : [],
      stoneCodes: this.props.orderProductEditFormData && this.props.orderProductEditFormData.stoneCodes ? this.props.orderProductEditFormData.stoneCodes : [],
      sizeCodes: this.props.orderProductEditFormData && this.props.orderProductEditFormData.sizeCodes ? this.props.orderProductEditFormData.sizeCodes : [],
      miscCodes: this.props.orderProductEditFormData && this.props.orderProductEditFormData.miscCodes ? this.props.orderProductEditFormData.miscCodes : [],
      selectedProduct: '',
      selectedColor: '',
      selectedStone: '',
      selectedSize: '',
      selectedMisc: '',
      productVariants: [],
      isCustom: null
    });
    this.props.handleOrderProductEditClose();
  }
  
  isFormComplete() {
    let formComplete = false;
    let totalSelected = 0;
    if (this.state.selectedProduct !== undefined && this.state.selectedProduct !== '') totalSelected++;
    if (this.state.selectedColor !== undefined && this.state.selectedColor !== '') totalSelected++;
    if (this.state.selectedStone !== undefined && this.state.selectedStone !== '') totalSelected++;
    if (this.state.selectedSize !== undefined && this.state.selectedSize !== '') totalSelected++;
    if (this.state.selectedMisc !== undefined && this.state.selectedMisc !== '') totalSelected++;
    if (totalSelected > 0) formComplete = true;
    return formComplete;
  }
  
	handleProductChange(e, {value}) {
  	if (value !== this.state.selectedProduct) {
    	this.setState({
      	selectedProduct: value
    	});
  	}
	}
	
	handleColorChange(e, {value}) {
  	if (value !== this.state.selectedColor) {
    	this.setState({
      	selectedColor: value
    	});
  	}
	}
	
	handleStoneChange(e, {value}) {
  	if (value !== this.state.selectedStone) {
    	this.setState({
      	selectedStone: value
    	});
  	}
	}
	
	handleSizeChange(e, {value}) {
  	if (value !== this.state.selectedSize) {
    	this.setState({
      	selectedSize: value
    	});
  	}
	}
	
	handleMiscChange(e, {value}) {
  	if (value !== this.state.selectedMisc) {
    	this.setState({
      	selectedMisc: value
    	});
  	}
	}
	
  handleInventoryChange(e) {
    const productVariants = this.state.productVariants.map(function(productVariant) {
      if (productVariant.id === e.target.name) productVariant.inventoryLevel = e.target.value;
      return productVariant;
    });
  	this.setState({
    	productVariants: productVariants
  	});
  }
	
	handleAdd(objectId) {
  	let productVariants = this.state.productVariants;
  	let variantData = {id: objectId, isCustom: false};
    if (objectId.includes('Custom')) {
      variantData.isCustom = true;
      variantData.selectedProduct = this.state.selectedProduct;
      variantData.selectedColor = this.state.selectedColor;
      variantData.selectedStone = this.state.selectedStone;
      variantData.selectedSize = this.state.selectedSize;
      variantData.selectedMisc = this.state.selectedMisc;
    }
    productVariants.push(variantData);
  	this.setState({
      selectedProduct: '',
      selectedColor: '',
      selectedStone: '',
      selectedSize: '',
      selectedMisc: '', 	
    	productVariants: productVariants
  	});
	}
	
	handleRemove(objectId) {
  	let productVariants = this.state.productVariants;
  	let index = -1;
  	productVariants.map(function(productVariant, i) {
    	if (productVariant.id === objectId) index = i;
    	return productVariant;
  	})
    if (index >= 0) productVariants.splice(index, 1);
  	this.setState({	
    	productVariants: productVariants
  	});
	}
	
	getProductVariants(productVariants, orderProductEditFormData) {
    if (orderProductEditFormData.orderProduct && orderProductEditFormData.orderProduct.editedVariants) {
      productVariants = orderProductEditFormData.orderProduct.editedVariants.map(function(productVariant, i) { 
        let variantData = {
          id: productVariant.objectId ? productVariant.objectId : 'Custom-'+i, 
          isCustom: productVariant.isCustom !== undefined ? productVariant.isCustom : false,
        }
        if (variantData.isCustom) {
          variantData.selectedProduct = productVariant.productId;
          variantData.selectedColor = productVariant.colorCode ? productVariant.colorCode.objectId : '';
          variantData.selectedStone = productVariant.stoneCode ? productVariant.stoneCode.objectId : '';
          variantData.selectedSize = productVariant.sizeCode ? productVariant.sizeCode.objectId : '';
          variantData.selectedMisc = productVariant.miscCode ? productVariant.miscCode.objectId : '';
          variantData.inventoryLevel = productVariant.inventoryLevel ? productVariant.inventoryLevel : '';
        }
        return variantData; 
      });
    } else if (orderProductEditFormData.orderProduct && orderProductEditFormData.orderProduct.variants) {
      productVariants = orderProductEditFormData.orderProduct.variants.map(function(productVariant) { 
        return {id: productVariant.objectId, isCustom: false}; 
      });
    }
  	return productVariants;
	}
	
	componentWillReceiveProps(nextProps) {
  	if (nextProps.orderProductEditFormData) {
    	let productVariants = this.state.productVariants;
      productVariants = this.getProductVariants(productVariants, nextProps.orderProductEditFormData);
    	this.setState({
      	productData: nextProps.orderProductEditFormData.orderProduct ? nextProps.orderProductEditFormData.orderProduct : null,
      	products: nextProps.orderProductEditFormData.products ? nextProps.orderProductEditFormData.products : null,
        colorCodes: nextProps.orderProductEditFormData && nextProps.orderProductEditFormData.colorCodes ? nextProps.orderProductEditFormData.colorCodes : [],
        stoneCodes: nextProps.orderProductEditFormData && nextProps.orderProductEditFormData.stoneCodes ? nextProps.orderProductEditFormData.stoneCodes : [],
        sizeCodes: nextProps.orderProductEditFormData && nextProps.orderProductEditFormData.sizeCodes ? nextProps.orderProductEditFormData.sizeCodes : [],
        miscCodes: nextProps.orderProductEditFormData && nextProps.orderProductEditFormData.miscCodes ? nextProps.orderProductEditFormData.miscCodes : [],
      	isCustom: nextProps.orderProductEditFormData.orderProduct && nextProps.orderProductEditFormData.orderProduct.isCustom !== undefined ? nextProps.orderProductEditFormData.orderProduct.isCustom : false,
      	productVariants: productVariants
    	});
  	}
	}
	
	getVariantText(variant) {
		let variantText = '';
		if (variant.color_value) variantText += ' ' + variant.color_value;
		if (variant.gemstone_value) variantText += ' ' + variant.gemstone_value;
		if (variant.size_value) variantText += ' ' + variant.size_value;
		if (variant.length_value) variantText += ' ' + variant.length_value;
		if (variant.letter_value) variantText += ' ' + variant.letter_value;
		if (variant.singlepair_value) variantText += ' ' + variant.singlepair_value;
		variantText = variantText.trim();
		if (variantText === '') variantText = 'No options';
		
  	return variantText;
	}
  
	render() {
  	const scope = this;
  	const { productData, products, colorCodes, stoneCodes, sizeCodes, miscCodes } = this.state;
  	
  	// Create add product dropdown options
  	let productsOptions = [];
		products.map(function(product, i) {
  		productsOptions.push({ key: i, value: product.productId, text: product.productId + ' - ' + product.name });
  		return product;
		});
		
		// Create product variant rows
		let productVariantRows = [];
		this.state.productVariants.map(function(productVariant, i) {
  		let productVariantRow;
  		if (productVariant.isCustom) {
    		let productName = '';
    		let productId = '';
    		scope.state.products.map(function(product, j) {
      		if (productVariant.selectedProduct === product.productId) {
        		productName = product.name;
        		productId = product.productId;
      		}
      		return product;
    		});
    		let colorCodeText = '';
        scope.state.colorCodes.map(function(colorCode, j) {
          if (productVariant.selectedColor && productVariant.selectedColor === colorCode.objectId) {
            colorCodeText = colorCode.display_name + ' - ' + colorCode.label;
          }
          return colorCode;
        });
        let stoneCodeText = '';
        scope.state.stoneCodes.map(function(stoneCode, j) {
          if (productVariant.selectedStone && productVariant.selectedStone === stoneCode.objectId) {
            stoneCodeText = stoneCode.display_name + ' - ' + stoneCode.label;
          }
          return stoneCode;
        });
        let sizeCodeText = '';
        scope.state.sizeCodes.map(function(sizeCode, j) {
          if (productVariant.selectedSize && productVariant.selectedSize === sizeCode.objectId) {
            sizeCodeText = sizeCode.display_name + ' - ' + sizeCode.label;
          }
          return sizeCode;
        });
        let miscCodeText = '';
        scope.state.miscCodes.map(function(miscCode, j) {
          if (productVariant.selectedMisc && productVariant.selectedMisc === miscCode.objectId) {
            miscCodeText = miscCode.display_name + ' - ' + miscCode.label;
          }
          return miscCode;
        });
        productVariantRow = {
          id: productVariant.id ? productVariant.id : 'Custom-' + i,
          rowId: 'Custom-' + i, 
          productId: productId, 
          name: productName, 
          colorCodeText: colorCodeText, 
          stoneCodeText: stoneCodeText, 
          sizeCodeText: sizeCodeText, 
          miscCodeText: miscCodeText,
          isCustom: true,
          inventoryLevel: productVariant.inventoryLevel
        };
  		  
  		} else {
    		scope.state.products.map(function(product, j) {
      		product.variants.map(function(variant, k) {
        		if (variant.objectId === productVariant.id) {
          		const rowId = i + '-' + j + '-' + k;
              let colorCodeText;
              if (variant.variantOptions) {
                variant.variantOptions.map(function(variantOption, l) {
                  scope.state.colorCodes.map(function(colorCode, m) {
                    if (variantOption.option_id === colorCode.option_id && variantOption.option_value_id === colorCode.option_value_id) {
                      colorCodeText = variantOption.display_name + ' - ' + variantOption.label;
                    }
                    return colorCode;
                  });
                  return variantOption;
                });
              }
              let stoneCodeText;
              if (variant.variantOptions) {
                variant.variantOptions.map(function(variantOption, l) {
                  scope.state.stoneCodes.map(function(stoneCode, m) {
                    if (variantOption.option_id === stoneCode.option_id && variantOption.option_value_id === stoneCode.option_value_id) {
                      stoneCodeText = variantOption.display_name + ' - ' + variantOption.label;
                    }
                    return stoneCode;
                  });
                  return variantOption;
                });
              }
              let sizeCodeText;
              if (variant.variantOptions) {
                variant.variantOptions.map(function(variantOption, l) {
                  scope.state.sizeCodes.map(function(sizeCode, m) {
                    if (variantOption.option_id === sizeCode.option_id && variantOption.option_value_id === sizeCode.option_value_id) {
                      sizeCodeText = variantOption.display_name + ' - ' + variantOption.label;
                    }
                    return sizeCode;
                  });
                  return variantOption;
                });
              }
              let miscCodeText;
              if (variant.variantOptions) {
                variant.variantOptions.map(function(variantOption, l) {
                  scope.state.miscCodes.map(function(miscCode, m) {
                    if (variantOption.option_id === miscCode.option_id && variantOption.option_value_id === miscCode.option_value_id) {
                      miscCodeText = variantOption.display_name + ' - ' + variantOption.label;
                    }
                    return miscCode;
                  });
                  return variantOption;
                });
              }
              productVariantRow = {
                id: productVariant.id ? productVariant.id : rowId,
                rowId: rowId, 
                productId: product.productId, 
                name: product.name, 
                colorCodeText: colorCodeText, 
                stoneCodeText: stoneCodeText, 
                sizeCodeText: sizeCodeText, 
                miscCodeText: miscCodeText,
                isCustom: false,
                inventoryLevel: variant.inventoryLevel
              };
        		}
        		return variant;
      		});
      		return product;
    		});
  		}
  		if (productVariantRow) {
    		const inventoryInput = productVariantRow.isCustom ? <Input type='number' value={productVariantRow.inventoryLevel ? productVariantRow.inventoryLevel : 0} onChange={scope.handleInventoryChange} name={productVariantRow.id} min={0} /> : productVariantRow.inventoryLevel;
        productVariantRows.push(
          <Table.Row key={productVariantRow.rowId}>
            <Table.Cell>{productVariantRow.productId}</Table.Cell>
            <Table.Cell>{productVariantRow.name}</Table.Cell>
            <Table.Cell>{productVariantRow.colorCodeText}</Table.Cell>
            <Table.Cell>{productVariantRow.stoneCodeText}</Table.Cell>
            <Table.Cell>{productVariantRow.sizeCodeText}</Table.Cell>
            <Table.Cell>{productVariantRow.miscCodeText}</Table.Cell>
            <Table.Cell>{productVariantRow.isCustom ? 'Yes' : 'No'}</Table.Cell>
            <Table.Cell>{inventoryInput}</Table.Cell>
            <Table.Cell className='right aligned'>
              <Button 
                type='button' 
                basic 
                content='Remove' 
                disabled={scope.props.isLoading} 
                color='red' 
                size='tiny'
                onClick={()=>scope.handleRemove(productVariant.id)} 
              />
            </Table.Cell>
          </Table.Row>
        );
      }
  		return productVariant;
		});
		
		// Create product select
		productsOptions.unshift({ key: 'product-none', value: '', text: 'None' });
		const productsSelect = this.state.products ? <Form.Select search selection width='16' placeholder='Select a product' value={this.state.selectedProduct} options={productsOptions} onChange={this.handleProductChange} /> : null;
		
		// Create color select
		const colorOptions = colorCodes.map(function(colorCode, i) { 
  		return { key: 'colorCode-'+i, value: colorCode.objectId, text: colorCode.display_name + ' - ' + colorCode.label };
		});
		colorOptions.unshift({ key: 'colorCode-none', value: '', text: 'None' });
		const colorSelect = colorOptions.length > 0 ? <Form.Select search selection placeholder='Select color' value={this.state.selectedColor} options={colorOptions} onChange={this.handleColorChange} /> : null;
		
		// Create stone select
		const stoneOptions = stoneCodes.map(function(stoneCode, i) { 
  		return { key: 'stoneCode-'+i, value: stoneCode.objectId, text: stoneCode.display_name + ' - ' + stoneCode.label };
		});
		stoneOptions.unshift({ key: 'stoneCode-none', value: '', text: 'None' });
		const stoneSelect = stoneOptions.length > 0 ? <Form.Select search selection placeholder='Select stone' value={this.state.selectedStone} options={stoneOptions} onChange={this.handleStoneChange} /> : null;
		
		// Create size select
		const sizeOptions = sizeCodes.map(function(sizeCode, i) { 
  		return { key: 'sizeCode-'+i, value: sizeCode.objectId, text: sizeCode.display_name + ' - ' + sizeCode.label };
		});
		sizeOptions.unshift({ key: 'sizeCode-none', value: '', text: 'None' });
		const sizeSelect = sizeOptions.length > 0 ? <Form.Select search selection placeholder='Select size' value={this.state.selectedSize} options={sizeOptions} onChange={this.handleSizeChange} /> : null;
		
		// Create misc select
		const miscOptions = miscCodes.map(function(miscCode, i) { 
  		return { key: 'miscCode-'+i, value: miscCode.objectId, text: miscCode.display_name + ' - ' + miscCode.label };
		});
		miscOptions.unshift({ key: 'miscCode-none', value: '', text: 'None' });
		const miscSelect = miscOptions.length > 0 ? <Form.Select search selection placeholder='Select other option' value={this.state.selectedMisc} options={miscOptions} onChange={this.handleMiscChange} /> : null;
  	
//   	const variantsSelect = variantsOptions.length > 0 ? <Form.Select placeholder='Select options' value={this.state.selectedVariant} options={variantsOptions} onChange={this.handleVariantChange} /> : null;
  	
		const saveButton = <Button disabled={this.props.isLoading} color='olive' onClick={this.handleSave}>Save Order Product</Button>;
		
		let variantSuggestions = [];
		if (this.state.selectedProduct !== '') {
  		scope.state.products.map(function(product, i) {
    		if (product.productId === scope.state.selectedProduct) {
      		product.variants.map(function(variant, j) {
        		if (!variant.variantOptions) return variant;
            let numOptionsSelected = 0;
        		let numOptionMatches = 0;
        		
        		// Check for color code match
        		if (scope.state.selectedColor !== '' && variant.variantOptions) {
          		numOptionsSelected++;
          		let colorCodeObject;
          		colorCodes.map(function(colorCode, k) {
            		if (colorCode.objectId === scope.state.selectedColor) colorCodeObject = colorCode;
            		return colorCode;
          		});
          		if (colorCodeObject) {
            		variant.variantOptions.map(function(variantOption, k) {
              		if (variantOption.value === colorCodeObject.value) {
                		numOptionMatches++;
              		}
              		return variantOption;
            		});
          		}
        		}
        		
        		// Check for stone code match
        		if (scope.state.selectedStone !== '' && variant.variantOptions) {
          		numOptionsSelected++;
          		let stoneCodeObject;
          		stoneCodes.map(function(stoneCode, k) {
            		if (stoneCode.objectId === scope.state.selectedStone) stoneCodeObject = stoneCode;
            		return stoneCode;
          		});
          		if (stoneCodeObject) {
            		variant.variantOptions.map(function(variantOption, k) {
              		if (variantOption.value === stoneCodeObject.value) {
                		numOptionMatches++;
              		}
              		return variantOption;
            		});
          		}
        		}
        		
        		// Check for size match
        		if (scope.state.selectedSize !== '' && variant.variantOptions) {
          		numOptionsSelected++;
          		let sizeCodeObject;
          		sizeCodes.map(function(sizeCode, k) {
            		if (sizeCode.objectId === scope.state.selectedSize) sizeCodeObject = sizeCode;
            		return sizeCode;
          		});
          		if (sizeCodeObject) {
            		variant.variantOptions.map(function(variantOption, k) {
              		if (variantOption.value === sizeCodeObject.value) {
                		numOptionMatches++;
              		}
              		return variantOption;
            		});
          		}
        		}
        		
        		// Check for misc match
        		if (scope.state.selectedMisc !== '' && variant.variantOptions) {
          		numOptionsSelected++;
          		let miscCodeObject;
          		miscCodes.map(function(miscCode, k) {
            		if (miscCode.objectId === scope.state.selectedMisc) miscCodeObject = miscCode;
            		return miscCode;
          		});
          		if (miscCodeObject) {
            		variant.variantOptions.map(function(variantOption, k) {
              		if (variantOption.value === miscCodeObject.value) {
                		numOptionMatches++;
              		}
              		return variantOption;
            		});
          		}
        		}
        		
        		if (numOptionMatches === variant.variantOptions.length && numOptionsSelected <= variant.variantOptions.length) {
          		let buttonLabel = 'Add ' + product.name +  ' - ' + scope.getVariantText(variant);
          		variantSuggestions.push(<Button key={'variantSuggestion-'+i+'-'+j} type='button' basic icon='plus' content={buttonLabel} color='olive' onClick={()=>scope.handleAdd(variant.objectId)} />);
        		}
        		return variant;
          });
        }
        return product;
  		});
    }
		
		const addButton = <Button type='button' basic icon='plus' content='Add Custom Product' disabled={this.props.isLoading || !this.isFormComplete()} color='olive' onClick={()=>this.handleAdd('Custom-' + this.state.productVariants.length)} />;
    
    return (
	    <Modal open={this.props.open} onClose={this.handleClose} size='large' closeIcon='close'>
        <Modal.Content>
          <Header>Editing Order Product {productData.orderProductId} - {productData.name}</Header>
          <p></p>
          <Segment loading={this.props.isLoading}>
            <Header>Order product variants</Header>
            <Table basic='very' celled>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Product Id</Table.HeaderCell>
                  <Table.HeaderCell>Product Name</Table.HeaderCell>
                  <Table.HeaderCell>Color</Table.HeaderCell>
                  <Table.HeaderCell>Stone</Table.HeaderCell>
                  <Table.HeaderCell>Size</Table.HeaderCell>
                  <Table.HeaderCell>Misc</Table.HeaderCell>
                  <Table.HeaderCell>Is Custom</Table.HeaderCell>
                  <Table.HeaderCell>Inventory</Table.HeaderCell>
                  <Table.HeaderCell className='right aligned'> </Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {productVariantRows}
              </Table.Body>
            </Table>
          </Segment>
            
          <Segment>
            <Form loading={this.props.isLoading}>
              <Header>Add a product with custom options</Header>
              <Form.Field>
                {productsSelect}
              </Form.Field>
              <Form.Group widths='equal'>
                <Form.Field>
                  {colorSelect}
                </Form.Field>
                <Form.Field>
                  {stoneSelect}
                </Form.Field>
                <Form.Field>
                  {sizeSelect}
                </Form.Field>
                <Form.Field>
                  {miscSelect}
                </Form.Field>
              </Form.Group>
              <Form.Group>
                <Form.Field>
                  {variantSuggestions}
                </Form.Field>
              </Form.Group>
              <Form.Field>
                {addButton}
              </Form.Field>
            </Form>
          </Segment>
        </Modal.Content>
        <Modal.Actions>
          <Button basic disabled={this.props.isLoading} color='grey' content='Cancel' onClick={this.handleClose} />
          {saveButton}
        </Modal.Actions>
      </Modal>
    );
  }
}

export default OrderProductEditModal;