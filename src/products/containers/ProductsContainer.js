import { connect } from 'react-redux';
import { getProducts, getProductFilters, getProductOptions, reloadProduct, saveProduct, saveVariants, addToVendorOrder, createResize, saveResize, getBundleFormData, productBundleSave } from '../actions';
import { Products } from '../components/components';

const select = state => ({
    token: state.auth.token,
    isLoadingProducts: state.products.isLoadingProducts,
    products: state.products.products,
    filterData: state.products.filterData,
    optionsData: state.products.optionsData,
    updatedProducts: state.products.updatedProducts,
    updatedVariants: state.products.updatedVariants,
    bundleFormData: state.products.bundleFormData,
    totalPages: state.products.totalPages,
    totalProducts: state.products.totalProducts,
    tabCounts: state.products.tabCounts,
    error: state.error,
    errors: state.products.errors,
    timeout: state.products.timeout
});

const actions = {
    getProducts,
    getProductFilters,
    getProductOptions,
    reloadProduct,
    saveProduct,
    saveVariants,
    addToVendorOrder,
    createResize,
    saveResize,
    getBundleFormData,
    productBundleSave
};

export default connect(select, actions)(Products);
