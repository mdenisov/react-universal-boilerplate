import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';
import { Provider } from 'react-redux';
import serialize from 'serialize-javascript';
import Helmet from 'react-helmet';
import debug from 'debug'; // eslint-disable-line

import routes from '../shared/routes';
import configureStore from '../shared/redux/store';
import fetchData from '../server/utils/fetchData';
import assetsUtil from '../server/utils/assets';

const log = debug('SSR');

const render = ({ content, store, assets }) => { // eslint-disable-line
  const helmet = Helmet.rewind();
  const resources = assetsUtil.prepare(assets);

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />

        {helmet.base.toComponent()}
        {helmet.title.toComponent()}
        {helmet.meta.toComponent()}
        {helmet.link.toComponent()}

        {resources.styles}
      </head>
      <body>
        <div id="app">{content}</div>

        <script dangerouslySetInnerHTML={{ __html: `window.__INITIAL_STATE__=${serialize(store.getState())};` }} charSet="UTF-8" />

        {resources.scripts}

        {helmet.script.toString()}
      </body>
    </html>
  );
};

const serverSideRenderer = ({ assets }) => async function renderer(ctx) {
  const store = configureStore();
  const { url } = ctx.request;
  ctx.type = 'html';

  try {
    // Load data from server-side first
    await fetchData({ routes, store, url });

    const staticContext = {};
    const content = (
      <Provider store={store}>
        <StaticRouter location={url} context={staticContext}>
          {renderRoutes(routes)}
        </StaticRouter>
      </Provider>
    );
    const html = ReactDOMServer.renderToString(render({ content, assets, store }));

    // Check if the render result contains a redirect, if so we need to set
    // the specific status and redirect header and end the response
    if (staticContext.url) {
      ctx.status = 301;

      return ctx.redirect(staticContext.url);
    }

    // Check page status
    ctx.status = staticContext.status === '404' ? 404 : 200;
    ctx.body = html;
  } catch (error) {
    ctx.status = 500;
    ctx.body = error.message;

    log(error);
  }
};

export default serverSideRenderer;
