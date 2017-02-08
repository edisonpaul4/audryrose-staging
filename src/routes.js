import App from './components/App';
import SignupContainer from './containers/SignupContainer';
import LoginContainer from './containers/LoginContainer';
import LogoutContainer from './containers/LogoutContainer';
import DashboardContainer from './containers/DashboardContainer';
import OrdersContainer from './containers/OrdersContainer';
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
