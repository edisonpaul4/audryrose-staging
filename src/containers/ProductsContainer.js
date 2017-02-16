import { connect } from 'react-redux';
import { getProducts, reloadProduct } from '../actions/products';
import Products from '../components/Products';

const select = state => ({
  token: state.auth.token,
	isLoadingProducts: state.products.isLoadingProducts,
	products: state.products.products,
	updatedProduct: state.products.updatedProduct,
	totalPages: state.products.totalPages,
	error: state.error
});

const actions = {
  getProducts,
  reloadProduct
};

export default connect(select, actions)(Products);
