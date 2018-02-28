import { applyMiddleware, createStore } from 'redux';
import { createLogger } from 'redux-logger';
import createSagaMiddleware from 'redux-saga';
import thunk from 'redux-thunk';

import reducers from './reducers';

const { NODE_ENV } = process.env;

export default ({ initialState = {} } = {}) => {
  const packages = [thunk];

  if (__CLIENT__ && NODE_ENV === 'development') {
    // Push the middleware that are specific for development
    packages.push(createLogger({ collapsed: true }));
  }

  // Saga middleware
  packages.push(createSagaMiddleware());

  const enhancers = applyMiddleware(...packages);

  const store = createStore(
    reducers,
    initialState,
    enhancers,
  );

  if (NODE_ENV === 'development') {
    if (module.hot) {
      // Enable Webpack hot module replacement for reducers
      module.hot.accept('./reducers', () => {
        try {
          const nextReducer = require('./reducers').default;

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
