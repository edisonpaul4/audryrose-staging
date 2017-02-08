import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import configureStore from './store/configureStore';
import createRoutes from './routes';

import 'semantic-ui-css/semantic.css';
import './index.css';

const store = configureStore();

const history = syncHistoryWithStore(browserHistory, store);

const routes = createRoutes(store);

ReactDOM.render(
  <Provider store={store}>
    <Router routes={routes} history={history} />
  </Provider>,
  document.getElementById('root')
);
