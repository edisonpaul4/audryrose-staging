const initialState = {
    isLoadingWebhooks: false,
    webhooks: null,
    webhookEndpoints: null
};

const webhooks = (state = initialState, action) => {
    switch (action.type) {

        case 'WEBHOOKS_REQUEST':
            return {
                ...state,
                isLoadingWebhooks: true
            }

        case 'WEBHOOKS_SUCCESS':
            if (action.res.timeout) return { ...state, timeout: action.res.timeout };
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

        case 'CREATE_WEBHOOK_REQUEST':
            return {
                ...state,
                isLoadingWebhooks: true
            }

        case 'CREATE_WEBHOOK_SUCCESS':
            if (action.res.timeout) return { ...state, timeout: action.res.timeout };
            return {
                ...state,
                isLoadingWebhooks: false,
                webhooks: action.res.webhooks,
                webhookEndpoints: action.res.webhookEndpoints
            };

        case 'CREATE_WEBHOOK_FAILURE':
            return {
                ...state,
                isLoadingWebhooks: false
            }

        case 'DELETE_WEBHOOK_REQUEST':
            return {
                ...state,
                isLoadingWebhooks: true
            }

        case 'DELETE_WEBHOOK_SUCCESS':
            if (action.res.timeout) return { ...state, timeout: action.res.timeout };
            return {
                ...state,
                isLoadingWebhooks: false,
                webhooks: action.res.webhooks,
                webhookEndpoints: action.res.webhookEndpoints
            };

        case 'DELETE_WEBHOOK_FAILURE':
            return {
                ...state,
                isLoadingWebhooks: false
            }

        default:
            return state;
    }
}

export default webhooks;
