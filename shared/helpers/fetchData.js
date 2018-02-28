import { trigger } from 'redial';
import isEmpty from 'lodash/isEmpty';
import { match } from 'react-router';

export const FETCH_DATA_HOOK = 'FETCH_DATA_HOOK';

export const UPDATE_HEADER_HOOK = 'UPDATE_HEADER_HOOK';

export const getDefaultParams = (store, { location, params }) => ({ store, location, params });

export const serverFetchData = (props) => {
  const { renderProps, store } = props;

  return trigger(
    FETCH_DATA_HOOK,
    renderProps.components,
    getDefaultParams(store, renderProps),
  );
};

const redirectTo = (url) => {
  window.location.replace(url);
};

export const clientFetchData = (props) => {
  const { history, routes, store } = props;
  const callback = location =>
    match({ routes, location }, (error, redirectLocation, renderProps) => {
      if (error) {
        redirectTo('/500.html');
      } else if (redirectLocation) {
        redirectTo(redirectLocation.pathname + redirectLocation.search);
      } else if (renderProps) {
        if (!isEmpty(window.prerenderData)) {
          // Delete initial data so that subsequent data fetches can occur
          window.prerenderData = undefined;
        } else {
          // Fetch mandatory data dependencies for 2nd route change onwards
          trigger(
            FETCH_DATA_HOOK,
            renderProps.components,
            getDefaultParams(store, renderProps),
          );
        }

        trigger(
          UPDATE_HEADER_HOOK,
          renderProps.components,
          getDefaultParams(store, renderProps),
        );
      } else {
        redirectTo('/404.html');
      }
    });

  history.listen(callback);
  callback(history.getCurrentLocation());
};
