const matchRoutes = require('react-router-config').matchRoutes;

// The method for loading data from server-side
const fetchData = ({ routes, store, url }) => {
  const match = matchRoutes(routes, url);

  const promises = match.map(({ route, match }) => {
    if (route.loadData) {
      return Promise.all(route
        .loadData({ params: match.params, getState: store.getState })
        .map(item => store.dispatch(item)));
    }

    return Promise.resolve(null);
  });

  return Promise.all(promises);
};

module.exports = fetchData;
