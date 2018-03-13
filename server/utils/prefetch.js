import { matchRoutes } from 'react-router-config';

// The method for loading data from server-side
const prefetch = ({ routes, store, url }) => {
  const matches = matchRoutes(routes, url);

  const promises = matches.map(({ route, match }) => {
    if (route.loadData) {
      return Promise.all(route
        .loadData({ params: match.params, getState: store.getState })
        .map(item => store.dispatch(item)));
    }

    return Promise.resolve(null);
  });

  return Promise.all(promises);
};

export default prefetch;
