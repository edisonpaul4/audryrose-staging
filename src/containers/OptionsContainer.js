import { connect } from 'react-redux';
import { getOptions, saveOption } from '../actions/options';
import Options from '../components/Options';

const select = state => ({
  token: state.auth.token,
	isLoadingOptions: state.options.isLoadingOptions,
	updatedOption: state.options.updatedOption,
	options: state.options.options,
	error: state.error,
	timeout: state.options.timeout
});

const actions = {
  getOptions,
  saveOption
};

export default connect(select, actions)(Options);
