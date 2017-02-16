import { connect } from 'react-redux';
import { getProducts } from '../actions/products';
import Products from '../components/Products';

const select = state => ({
  token: state.auth.token,
	isLoadingProducts: state.products.isLoadingProducts,
	products: state.products.products,
	totalPages: state.products.totalPages,
	error: state.error
});

const actions = {
  getProducts
};

export default connect(select, actions)(Products);
