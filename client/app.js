import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';
import { Provider } from 'react-redux';

import configureStore from '../shared/redux/store';
import routes from '../shared/routes';

// Get the initial state from server-side rendering
const initialState = window.__INITIAL_STATE__;
const store = configureStore({ initialState });

const render = (routes) => {
  ReactDOM.hydrate(
    <Provider store={store}>
      <BrowserRouter>
        { routes }
      </BrowserRouter>
    </Provider>,
    document.getElementById('app'),
  );
};

document.addEventListener('DOMContentLoaded', () => {
  render(renderRoutes(routes));
});

// Hot Module Replacement API
if (module.hot) {
  module.hot.accept('../shared/routes', () => {
    render(renderRoutes(require('../shared/routes').default));
  });
}
