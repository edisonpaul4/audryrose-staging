import { connect } from 'react-redux';
import { getWebhooks } from '../actions/webhooks';
import Webhooks from '../components/Webhooks';

const select = state => ({
  token: state.auth.token,
	isLoadingWebhooks: state.webhooks.isLoadingWebhooks,
	webhooks: state.webhooks.webhooks,
	webhookEndpoints: state.webhooks.webhookEndpoints,
	error: state.error
});

const actions = {
  getWebhooks
};

export default connect(select, actions)(Webhooks);
