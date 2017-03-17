import App from './components/App';
import SignupContainer from './containers/SignupContainer';
import LoginContainer from './containers/LoginContainer';
import LogoutContainer from './containers/LogoutContainer';
import DashboardContainer from './containers/DashboardContainer';
import OrdersContainer from './containers/OrdersContainer';
import ProductsContainer from './containers/ProductsContainer';
import DesignersContainer from './containers/DesignersContainer';
import OptionsContainer from './containers/OptionsContainer';
import ShipmentsContainer from './containers/ShipmentsContainer';
import WebhooksContainer from './containers/WebhooksContainer';
import NotFound from './components/NotFound';

export function requireAuth(store) {
  return (nextState, replace) => {

    const state = store.getState();

    if(!state.auth.isLoggedIn) {
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
      indexRoute:  { onEnter: (nextState, replace) => replace('/dashboard') },
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
          path: 'designers',
          component: DesignersContainer,
					onEnter: requireAuth(store),
        },
        {
          path: 'shipments',
          component: ShipmentsContainer,
					onEnter: requireAuth(store),
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
