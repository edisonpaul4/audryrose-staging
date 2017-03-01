import { connect } from 'react-redux';
import { getProducts, getProductFilters, reloadProduct, saveProductStatus, saveVariant } from '../actions/products';
import Products from '../components/Products';

const select = state => ({
  token: state.auth.token,
	isLoadingProducts: state.products.isLoadingProducts,
	products: state.products.products,
	filterData: state.products.filterData,
	updatedProduct: state.products.updatedProduct,
	updatedVariant: state.products.updatedVariant,
	totalPages: state.products.totalPages,
	totalProducts: state.products.totalProducts,
	error: state.error
});

const actions = {
  getProducts,
  getProductFilters,
  reloadProduct,
  saveProductStatus,
  saveVariant
};

export default connect(select, actions)(Products);
