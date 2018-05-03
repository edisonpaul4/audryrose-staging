import React, { Component } from 'react';
import { Modal, Button, Header, Form } from 'semantic-ui-react';

class ProductOrderModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formComplete: false,
            designer: this.props.designerOrderData && this.props.designerOrderData.designer ? this.props.designerOrderData.designer : null,
            products: this.props.designerOrderData && this.props.designerOrderData.products ? this.props.designerOrderData.products : [],
            selectedProduct: this.props.designerOrderData && this.props.designerOrderData.product ? this.props.designerOrderData.product : '',
            selectedVariant: this.props.designerOrderData && this.props.designerOrderData.variant ? this.props.designerOrderData.variant : '',
            originalVariant: this.props.designerOrderData && this.props.designerOrderData.variant ? this.props.designerOrderData.variant : '',
            units: 1,
            notes: '',
            colorCodes: this.props.designerOrderData && this.props.designerOrderData.colorCodes ? this.props.designerOrderData.colorCodes : [],
            stoneCodes: this.props.designerOrderData && this.props.designerOrderData.stoneCodes ? this.props.designerOrderData.stoneCodes : [],
            sizeCodes: this.props.designerOrderData && this.props.designerOrderData.sizeCodes ? this.props.designerOrderData.sizeCodes : [],
            sizeCodeAddition: null,
            miscCodes: this.props.designerOrderData && this.props.designerOrderData.miscCodes ? this.props.designerOrderData.miscCodes : [],
            selectedColor: '',
            selectedStone: '',
            selectedSize: '',
            selectedMisc: '',
            selectedVendor: ''
        };
        this.handleAddToVendorOrder = this.handleAddToVendorOrder.bind(this);
        this.handleProductChange = this.handleProductChange.bind(this);
        this.handleVariantChange = this.handleVariantChange.bind(this);
        this.handleUnitsChange = this.handleUnitsChange.bind(this);
        this.handleNotesChange = this.handleNotesChange.bind(this);
        this.handleColorChange = this.handleColorChange.bind(this);
        this.handleStoneChange = this.handleStoneChange.bind(this);
        this.handleSizeChange = this.handleSizeChange.bind(this);
        this.handleSizeAddition = this.handleSizeAddition.bind(this);
        this.handleMiscChange = this.handleMiscChange.bind(this);
        this.handleVendorChange = this.handleVendorChange.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    handleAddToVendorOrder() {
        const orders = [{
            variant: this.state.selectedVariant,
            vendor: this.state.selectedVendor,
            color: this.state.selectedColor,
            stone: this.state.selectedStone,
            size: this.state.selectedSize,
            misc: this.state.selectedMisc,
            units: this.state.units,
            notes: this.state.notes,
            getUpdatedDesigner: true
        }];
        this.props.handleAddToVendorOrder(orders, this.state.designer.objectId);
        this.handleClose();
    }

    handleClose() {
        this.setState({
            formComplete: false,
            designer: null,
            products: [],
            selectedProduct: '',
            selectedColor: '',
            selectedStone: '',
            selectedSize: '',
            selectedMisc: '',
            selectedVariant: '',
            originalVariant: '',
            units: 1,
            notes: '',
            colorCodes: [],
            stoneCodes: [],
            sizeCodes: [],
            sizeCodeAddition: null,
            miscCodes: []
        });
        this.props.handleDesignerOrderModalClose();
    }

    isFormComplete() {
        let formComplete = true;
        // if (this.state.selectedProduct === undefined || this.state.selectedProduct === '') formComplete = false;
        if (this.state.selectedVariant === undefined || this.state.selectedVariant === '') formComplete = false;
        if (this.state.selectedVariant === 'custom') {
            var anySelectedOptions = false;
            if (this.state.selectedColor !== undefined && this.state.selectedColor !== '') anySelectedOptions = true;
            if (this.state.selectedStone !== undefined && this.state.selectedStone !== '') anySelectedOptions = true;
            if (this.state.selectedSize !== undefined && this.state.selectedSize !== '') anySelectedOptions = true;
            if (this.state.selectedMisc !== undefined && this.state.selectedMisc !== '') anySelectedOptions = true;
            if (!anySelectedOptions) formComplete = false;
            if (this.state.selectedVendor !== undefined && this.state.selectedVendor !== '') formComplete = false;
        }
        if (this.state.units === undefined || this.state.units === '') formComplete = false;
        return formComplete;
    }

    handleProductChange(e, { value }) {
        var state = {};
        state.selectedProduct = value;
        // Auto-select the vendor based on product selection
        this.state.products.map(function (product, i) {
            if (product.productId === value) {
                state.selectedVendor = product.vendor.objectId;
            }
            return product;
        });
        this.setState(state);
    }

    handleVariantChange(e, { value }) {
        let state = {};
        state.selectedVariant = value;
        if (value !== 'custom') {
            state.selectedColor = '';
            state.selectedStone = '';
            state.selectedSize = '';
            state.selectedMisc = '';
        }
        this.setState(state);
    }

    handleUnitsChange(e, { value }) {
        this.setState({
            units: value
        });
    }

    handleNotesChange(e, { value }) {
        this.setState({
            notes: value
        });
    }

    handleColorChange(e, { value }) {
        if (value !== this.state.selectedColor) {
            this.setState({
                selectedColor: value
            });
        }
    }

    handleStoneChange(e, { value }) {
        if (value !== this.state.selectedStone) {
            this.setState({
                selectedStone: value
            });
        }
    }

    handleSizeAddition(e, { value }) {
        const sizeCodeAddition = { key: 'sizeCodeAddition', value: value, text: value };
        this.setState({
            sizeCodeAddition: sizeCodeAddition,
            selectedSize: value
        });
    }

    handleSizeChange(e, { value }) {
        if (value !== this.state.selectedSize) {
            this.setState({
                selectedSize: value
            });
        }
    }

    handleMiscChange(e, { value }) {
        if (value !== this.state.selectedMisc) {
            this.setState({
                selectedMisc: value
            });
        }
    }

    handleVendorChange(e, { value }) {
        if (value !== this.state.selectedVendor) {
            this.setState({
                selectedVendor: value
            });
        }
    }

    componentWillReceiveProps(nextProps) {
        const designer = nextProps.designerOrderData && nextProps.designerOrderData.designer ? nextProps.designerOrderData.designer : null;
        const selectedProduct = nextProps.designerOrderData && nextProps.designerOrderData.product ? nextProps.designerOrderData.product : '';
        const selectedVariant = nextProps.designerOrderData && nextProps.designerOrderData.variant ? nextProps.designerOrderData.variant : '';
        const originalVariant = nextProps.designerOrderData && nextProps.designerOrderData.variant ? nextProps.designerOrderData.variant : '';
        const products = nextProps.designerOrderData && nextProps.designerOrderData.products ? nextProps.designerOrderData.products : [];
        const colorCodes = nextProps.designerOrderData && nextProps.designerOrderData.colorCodes ? nextProps.designerOrderData.colorCodes : [];
        const stoneCodes = nextProps.designerOrderData && nextProps.designerOrderData.stoneCodes ? nextProps.designerOrderData.stoneCodes : [];
        const sizeCodes = nextProps.designerOrderData && nextProps.designerOrderData.sizeCodes ? nextProps.designerOrderData.sizeCodes : [];
        const miscCodes = nextProps.designerOrderData && nextProps.designerOrderData.miscCodes ? nextProps.designerOrderData.miscCodes : [];
        this.setState({
            designer: designer,
            products: products,
            selectedProduct: selectedProduct,
            selectedVariant: selectedVariant,
            originalVariant: originalVariant,
            colorCodes: colorCodes,
            stoneCodes: stoneCodes,
            sizeCodes: sizeCodes,
            miscCodes: miscCodes
        });
    }

    render() {
        // const scope = this;
        const { designer, products, selectedProduct, selectedVariant, selectedVendor, selectedColor, selectedStone, selectedSize, sizeCodeAddition, selectedMisc, units, notes, colorCodes, stoneCodes, sizeCodes, miscCodes } = this.state;
        const header = this.props.isLoading ? '' : 'Create an order for ' + (designer ? designer.name : '');

        let productOptions = [];
        let variantOptions = [];
        let variants = [];
        products.map(function (product, i) {
            if (product.variants.length > 0) {
                product.variants.map(function (variant, j) {
                    if (product.productId === selectedProduct) {
                        variants.push(variant);
                    }
                    return variant;
                });
            }
            productOptions.push({ key: i, value: product.productId, text: product.productId + ' - ' + product.name });
            return product;
        });

        let vendorOptions = [];
        if (designer && designer.vendors && designer.vendors.length > 0) {
            designer.vendors.map(function (vendor, i) {
                vendorOptions.push({ key: i, value: vendor.objectId, text: vendor.name });
                return vendor;
            });
        }
        const vendorSelect = <Form.Select search selection placeholder='Select a vendor' value={selectedVendor} options={vendorOptions} disabled={selectedProduct !== ''} onChange={this.handleVendorChange} />;

        // const productData = product !== '' ? products.find(productObj => productObj.objectId === product) : null;
        // console.log('productData', productData);

        // let variants = productData && productData.variants ? productData.variants : [];

        // let originalVariantFound = false;
        if (variants.length > 0) {
            const hasColorValue = variants[0].color_value !== undefined;
            const hasStoneValue = variants[0].gemstone_value !== undefined;
            const hasSizeValue = variants[0].size_value !== undefined;
            if (hasColorValue && hasSizeValue) {
                variants.sort(function (a, b) { return a["color_value"] - b["color_value"] || parseFloat(a["size_value"]) - parseFloat(b["size_value"]); });
            } else if (hasStoneValue && hasSizeValue) {
                variants.sort(function (a, b) { return a["gemstone_value"] - b["gemstone_value"] || parseFloat(a["size_value"]) - parseFloat(b["size_value"]); });
            } else if (hasSizeValue) {
                variants.sort(function (a, b) { return (parseFloat(a.size_value) > parseFloat(b.size_value)) ? 1 : ((parseFloat(b.size_value) > parseFloat(a.size_value)) ? -1 : 0); });
            }

            variants.map(function (variant, i) {
                // if (variant.objectId === selectedVariant) originalVariantFound = true;

                let styleCode = variant.styleNumber;
                let optionText = '';
                if (variant.code) {
                    styleCode += '-' + variant.code;
                }
                if (variant.color_value) {
                    optionText += 'Color: ' + variant.color_value;
                }
                if (variant.gemstone_value) {
                    if (optionText !== '') optionText += ',  ';
                    optionText += 'Stone: ' + variant.gemstone_value;
                }
                if (variant.size_value) {
                    if (optionText !== '') optionText += ',  ';
                    optionText += 'Size: ' + variant.size_value;
                }
                if (variant.inventoryLevel !== undefined) {
                    if (optionText !== '') optionText += ',  ';
                    optionText += 'Inventory: ' + variant.inventoryLevel;
                }
                let optionContent = (optionText !== '') ? <Header content={optionText} subheader={styleCode} /> : <Header content={styleCode} />;

                const option = {
                    key: i,
                    text: optionText !== '' ? optionText : styleCode,
                    value: variant.objectId,
                    content: optionContent
                };
                variantOptions.push(option);
                return variant;
            });
        }

        variantOptions.push({
            key: 'custom',
            text: 'Custom',
            value: 'custom',
            content: <Header content='Custom' />
        });

        const productsSelect = <Form.Select search selection placeholder='Select a product' value={selectedProduct} options={productOptions} onChange={this.handleProductChange} />;

        const variantsSelect = <Form.Select placeholder='Select default options' value={selectedVariant} options={variantOptions} onChange={this.handleVariantChange} />;

        // Create color select
        const colorOptions = colorCodes.map(function (colorCode, i) {
            return { key: 'colorCode-' + i, value: colorCode.objectId, text: colorCode.display_name + ' - ' + colorCode.label };
        });
        colorOptions.unshift({ key: 'colorCode-none', value: '', text: 'None' });
        const colorSelect = colorOptions.length > 0 ? <Form.Select search selection placeholder='Select color' value={selectedColor} options={colorOptions} onChange={this.handleColorChange} /> : null;

        // Create stone select
        const stoneOptions = stoneCodes.map(function (stoneCode, i) {
            return { key: 'stoneCode-' + i, value: stoneCode.objectId, text: stoneCode.display_name + ' - ' + stoneCode.label };
        });
        stoneOptions.unshift({ key: 'stoneCode-none', value: '', text: 'None' });
        const stoneSelect = stoneOptions.length > 0 ? <Form.Select search selection placeholder='Select stone' value={selectedStone} options={stoneOptions} onChange={this.handleStoneChange} /> : null;

        // Create size select
        const sizeOptions = sizeCodes.map(function (sizeCode, i) {
            return { key: 'sizeCode-' + i, value: sizeCode.objectId, text: sizeCode.display_name + ' - ' + sizeCode.label };
        });
        sizeOptions.unshift({ key: 'sizeCode-none', value: '', text: 'None' });
        if (sizeCodeAddition) {
            sizeOptions.unshift(sizeCodeAddition);
        }
        const sizeSelect = sizeOptions.length > 0 ? <Form.Select search selection allowAdditions additionLabel='Enter manual value: ' placeholder='Select size' value={selectedSize} options={sizeOptions} onAddItem={this.handleSizeAddition} onChange={this.handleSizeChange} /> : null;

        // Create misc select
        const miscOptions = miscCodes.map(function (miscCode, i) {
            return { key: 'miscCode-' + i, value: miscCode.objectId, text: miscCode.display_name + ' - ' + miscCode.label };
        });
        miscOptions.unshift({ key: 'miscCode-none', value: '', text: 'None' });
        const miscSelect = miscOptions.length > 0 ? <Form.Select search selection placeholder='Select other option' value={selectedMisc} options={miscOptions} onChange={this.handleMiscChange} /> : null;

        const customOptions = selectedVariant === 'custom' ?
            <Form.Group widths='equal'>
                <Form.Field>{colorSelect}</Form.Field>
                <Form.Field>{stoneSelect}</Form.Field>
                <Form.Field>{sizeSelect}</Form.Field>
                <Form.Field>{miscSelect}</Form.Field>
            </Form.Group> : null;

        const createOrderButton = <Button disabled={this.props.isLoading || !this.isFormComplete()} color='olive' onClick={this.handleAddToVendorOrder}>Add To Order</Button>;

        return (
            <Modal open={this.props.open} onClose={this.handleClose} size='large' closeIcon='close'>
                <Modal.Header>
                    {header}
                </Modal.Header>
                <Modal.Content>
                    <Form loading={this.props.isLoading}>
                        <Form.Group widths='equal'>
                            {productsSelect}
                        </Form.Group>
                        <Form.Group widths='equal'>
                            {variantsSelect}
                        </Form.Group>
                        {customOptions}
                        <Form.Group>
                            {vendorSelect}
                        </Form.Group>
                        <Form.Group>
                            <Form.Input
                                label='Units'
                                type='number'
                                min='1'
                                value={units}
                                onChange={this.handleUnitsChange}
                            />
                        </Form.Group>
                        <Form.Group widths='equal'>
                            <Form.TextArea
                                label='Notes'
                                value={notes}
                                onChange={this.handleNotesChange}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button basic disabled={this.props.isLoading} color='grey' content='Close' onClick={this.handleClose} />
                    {createOrderButton}
                </Modal.Actions>
            </Modal>
        );
    }
}

export default ProductOrderModal;
