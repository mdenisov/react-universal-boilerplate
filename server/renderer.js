import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';
import { Provider } from 'react-redux';
import serialize from 'serialize-javascript';

import routes from '../shared/routes';
import configureStore from '../shared/redux/store';
import fetchData from '../server/utils/fetchData';

const assets = require('../public/dist/webpack-assets.json');

const render = ({ content, store }) => ReactDOMServer.renderToNodeStream((
  <html lang="en">
    <head>
      <meta charSet="UTF-8" />
      <title>Client | Build awesome apps ... faster️</title>
      {
        Object
          .keys(assets)
          .reverse()
          .map(key => assets[key].css && (
            <link key={key} rel="stylesheet" media="all" href={`/dist${assets[key].css}`} charSet="UTF-8" />
          ))
      }
    </head>
    <body>
      <div id="app">{ content }</div>

      <script dangerouslySetInnerHTML={{ __html: `window.__INITIAL_STATE__=${serialize(store.getState())};` }} charSet="UTF-8" />

      {
        Object
          .keys(assets)
          .reverse()
          .map(key => assets[key].js && (
            <script key={key} src={`/dist${assets[key].js}`} charSet="UTF-8" />
          ))
      }

    </body>
  </html>
));

export default function serverSideRenderer({ assets }) { // eslint-disable-line
  return async function (ctx) {
    const store = configureStore();
    const { url } = ctx.request;
    ctx.type = 'html';

    try {
      // Load data from server-side first
      await fetchData({ routes, store, url });

      const context = {};

      if (context.url) {
        return ctx.redirect(context.url);
      }

      const content = (
        <Provider store={store}>
          <StaticRouter location={url} context={context}>
            {renderRoutes(routes)}
          </StaticRouter>
        </Provider>
      );

      ctx.status = 200;
      ctx.body = render({ content, assets, store });
    } catch (error) {
      console.error(error);
    }
  };
}
