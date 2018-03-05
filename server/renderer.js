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

function serverSideRenderer({ assets }) { // eslint-disable-line
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
      ctx.body = ReactDOMServer.renderToNodeStream(render({ content, assets, store }));
    } catch (error) {
      debug('SSR')(error);

      ctx.status = 500;
      ctx.body = error.message;
    }
  };
}

export default serverSideRenderer;
