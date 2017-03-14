import { connect } from 'react-redux';
import { getProducts, getProductFilters, reloadProduct, saveProductStatus, saveVariant, saveVariants } from '../actions/products';
import Products from '../components/Products';

const select = state => ({
  token: state.auth.token,
	isLoadingProducts: state.products.isLoadingProducts,
	products: state.products.products,
	filterData: state.products.filterData,
	updatedProduct: state.products.updatedProduct,
	updatedVariants: state.products.updatedVariants,
	totalPages: state.products.totalPages,
	totalProducts: state.products.totalProducts,
	tabCounts: state.products.tabCounts,
	error: state.error
});

const actions = {
  getProducts,
  getProductFilters,
  reloadProduct,
  saveProductStatus,
  saveVariant,
  saveVariants
};

export default connect(select, actions)(Products);
