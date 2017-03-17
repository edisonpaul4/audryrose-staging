const initialState = {
  isLoadingWebhooks: false,
	webhooks: null,
  webhookEndpoints: null
};

const webhooks = (state = initialState, action) => {
  switch(action.type) {

    case 'WEBHOOKS_REQUEST':
      return {
        ...state,
        isLoadingWebhooks: true
      }

    case 'WEBHOOKS_SUCCESS':
      return {
        ...state,
        isLoadingWebhooks: false,
        webhooks: action.res.webhooks,
        webhookEndpoints: action.res.webhookEndpoints
      };

    case 'WEBHOOKS_FAILURE':
      return {
        ...state,
        isLoadingWebhooks: false
      }
      
    case 'WEBHOOK_SAVE_REQUEST':
      return {
        ...state,
        isLoadingWebhooks: true
      }

    case 'WEBHOOK_SAVE_SUCCESS':
      return {
        ...state,
        isLoadingWebhooks: false,
        webhooks: action.res.webhooks,
        webhookEndpoints: action.res.webhookEndpoints
      };

    case 'WEBHOOK_SAVE_FAILURE':
      return {
        ...state,
        isLoadingWebhooks: false
      }
			
    default:
      return state;
  }
}

export default webhooks;
