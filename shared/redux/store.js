import { applyMiddleware, createStore, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import thunk from 'redux-thunk';

import reducers from './reducers';

const { NODE_ENV } = process.env;
const IS_DEV = NODE_ENV === 'development';

export default ({ initialState = {} } = {}) => {
  // Middleware and store enhancers
  const enhancers = [
    // thunk middleware
    applyMiddleware(thunk),
    // side effect middleware
    applyMiddleware(createSagaMiddleware()),
  ];

  if (__CLIENT__ && IS_DEV) {
    // Enable DevTools only when rendering on client and during development.
    if (window.devToolsExtension) {
      enhancers.push(window.devToolsExtension());
    }
  }

  const store = createStore(
    reducers,
    initialState,
    compose(...enhancers),
  );

  if (__CLIENT__ && IS_DEV) {
    if (module.hot) {
      // Enable Webpack hot module replacement for reducers
      module.hot.accept('./reducers', () => {
        try {
          const nextReducer = require('./reducers').default; // eslint-disable-line

          store.replaceReducer(nextReducer);
        } catch (error) {
          console.error(`==> 😭  ReduxState hot reloading error ${error}`);
        }
      });
    }
  }

  // sagaMiddleware.run(sagas);

  return store;
};
