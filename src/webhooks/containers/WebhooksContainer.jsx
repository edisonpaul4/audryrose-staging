import { connect } from 'react-redux';
import { getWebhooks, createWebhook, deleteWebhook } from '../actions';
import Webhooks from '../components/Webhooks';

const select = state => ({
  token: state.auth.token,
	isLoadingWebhooks: state.webhooks.isLoadingWebhooks,
	webhooks: state.webhooks.webhooks,
	webhookEndpoints: state.webhooks.webhookEndpoints,
	error: state.error,
	timeout: state.webhooks.timeout
});

const actions = {
  getWebhooks, 
  createWebhook,
  deleteWebhook
};

export default connect(select, actions)(Webhooks);
