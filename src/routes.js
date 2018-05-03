import App from './shared/components/App';
import SignupContainer from './auth/containers/SignupContainer';
import LoginContainer from './auth/containers/LoginContainer';
import LogoutContainer from './auth/containers/LogoutContainer';
import DashboardContainer from './shared/containers/DashboardContainer';
import OrdersContainer from './orders/containers/OrdersContainer';
import ProductsContainer from './products/containers/ProductsContainer';
import DesignersContainer from './designers/containers/DesignersContainer';
import OptionsContainer from './options/containers/OptionsContainer';
import ShipmentsContainer from './shipments/containers/ShipmentsContainer';
import WebhooksContainer from './webhooks/containers/WebhooksContainer';
import NotFound from './shared/components/NotFound';

import { EmailSectionMainContainer, EmailSectionContainer, EmailReturnsContainer } from './emails/containers/containers';
import { DesignersMainContainer, VendorOrdersContainer } from './designers/containers/containers';
import { ReturnsMainContainer, RepairsResizesContainer } from './repairs-resizes/containers/containers';
import { ProductsStatsContainer } from './products-stats/containers/containers';

export function requireAuth(store) {
    return (nextState, replace) => {

        const state = store.getState();

        if (!state.auth.isLoggedIn) {
            replace({
                pathname: '/login',
                query: {
                    next: nextState.location.pathname
                }
            });
        }

    };
}

const createRoutes = (store) => {

    const routes = [
        {
            path: '/',
            component: App,
            indexRoute: { onEnter: (nextState, replace) => replace('/dashboard') },
            childRoutes: [
                {
                    path: 'dashboard',
                    component: DashboardContainer,
                    onEnter: requireAuth(store)
                },
                {
                    path: 'orders',
                    component: OrdersContainer,
                    onEnter: requireAuth(store),
                    childRoutes: [
                        {
                            path: ':subpage',
                            component: OrdersContainer,
                            onEnter: requireAuth(store)
                        }
                    ]
                },
                {
                    path: 'emails',
                    component: EmailSectionMainContainer,
                    onEnter: requireAuth(store),
                    childRoutes: [
                        {
                            path: 'customers-orders',
                            component: EmailSectionContainer,
                            onEnter: requireAuth(store)
                        },
                        {
                            path: 'returns',
                            component: EmailReturnsContainer,
                            onEnter: requireAuth(store)
                        }
                    ]
                },
                {
                    path: 'products',
                    component: ProductsContainer,
                    onEnter: requireAuth(store),
                    childRoutes: [
                        {
                            path: ':subpage',
                            component: ProductsContainer,
                            onEnter: requireAuth(store)
                        }
                    ]
                },
                {
                    path: 'options',
                    component: OptionsContainer,
                    onEnter: requireAuth(store),
                    childRoutes: [
                        {
                            path: ':subpage',
                            component: OptionsContainer,
                            onEnter: requireAuth(store)
                        }
                    ]
                },
                {
                    path: 'webhooks',
                    component: WebhooksContainer,
                    onEnter: requireAuth(store),
                    childRoutes: [
                        {
                            path: ':subpage',
                            component: WebhooksContainer,
                            onEnter: requireAuth(store)
                        }
                    ]
                },
                {
                    path: 'designers/vendor-orders',
                    component: DesignersMainContainer,
                    onEnter: requireAuth(store),
                    childRoutes: [
                        {
                            path: 'pending',
                            component: VendorOrdersContainer,
                            onEnter: requireAuth(store)
                        }
                    ]
                },
                {
                    path: 'designers',
                    component: DesignersContainer,
                    onEnter: requireAuth(store),
                    childRoutes: [
                        {
                            path: ':subpage',
                            component: DesignersContainer,
                            onEnter: requireAuth(store)
                        }
                    ]
                },
                {
                    path: 'shipments',
                    component: ShipmentsContainer,
                    onEnter: requireAuth(store),
                },
                {
                    path: 'product-stats',
                    component: ProductsStatsContainer,
                    onEnter: requireAuth(store)
                },
                {
                    path: 'repairs-resizes',
                    component: ReturnsMainContainer,
                    onEnter: requireAuth(store),
                    childRoutes: [
                        {
                            path: ':subpage',
                            component: RepairsResizesContainer,
                            onEnter: requireAuth(store)
                        }
                    ]
                },
                {
                    path: 'signup',
                    component: SignupContainer,
                    isBasic: true
                },
                {
                    path: 'login',
                    component: LoginContainer,
                    isBasic: true
                },
                {
                    path: 'logout',
                    component: LogoutContainer,
                    isBasic: true
                },
                {
                    path: '*',
                    component: NotFound,
                    isBasic: true
                }
            ]
        }
    ];

    return routes;
}

export default createRoutes;
