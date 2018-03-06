import path from 'path';
import boxen from 'boxen';
import chalk from 'chalk';
import Koa from 'koa';
import serve from 'koa-static';
import favicon from 'koa-favicon';
import Router from 'koa-router';
import cors from '@koa/cors';
import cookie from 'koa-cookie';
import compress from 'koa-compress';
import bodyParser from 'koa-bodyparser';
import conditional from 'koa-conditional-get';
import etag from 'koa-etag';
import logger from 'koa-logger'; // eslint-disable-line
import compressible from 'compressible';
import zlib from 'zlib';
import webpack from 'webpack'; // eslint-disable-line
import { devMiddleware, hotMiddleware } from 'koa-webpack-middleware'; // eslint-disable-line
import debug from 'debug'; // eslint-disable-line

// Local Imports
import api from './api';
import webpackConfigs from '../tools/webpack/config.dev';
import SSR from './SSR';
// import SSR from './renderer';
import assets from '../public/dist/webpack-assets.json';

const { NODE_ENV } = process.env;

// Initialize Express App
const app = new Koa();
const router = new Router();

// error handling
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    debug('server')(error.message, error.stack);

    ctx.status = error.status || 500;
    ctx.body = error.message;
    ctx.app.emit('error', error, ctx);
  }
});

// HMR Stuff
if (NODE_ENV === 'development') {
  const middlewareOptions = {
    stats: {
      colors: true,
      hash: false,
      children: false,
      reasons: false,
      chunks: false,
      modules: false,
      warnings: false,
      timings: false,
      version: false,
    },
    hot: true,
    quiet: false,
    noInfo: false,
    lazy: false,
    headers: {
      'Access-Control-Allow-Origin': 'http://localhost',
    },
    publicPath: webpackConfigs[0].output.publicPath,
  };

  const compiler = webpack(webpackConfigs[0]);

  app.use(devMiddleware(compiler, middlewareOptions));
  app.use(hotMiddleware(compiler, {
    log: false,
  }));
}

// Server request logging
if (NODE_ENV === 'development') {
  app.use(logger());
}

const options = {
  gzip: NODE_ENV !== 'development',
  maxage: NODE_ENV === 'development' ? 0 : 1000 * 60 * 60 * 24,
};

// Server middlewares
app
  .use(favicon(path.resolve(__dirname, '..', 'public', 'favicon.ico'), options))
  .use(serve(path.resolve(__dirname, '..', 'public'), options))
  .use(compress({
    filter: type => !(/event-stream/i.test(type)) && compressible(type),
    threshold: 2048,
    flush: zlib.Z_SYNC_FLUSH,
  }))
  .use(cors({
    origin: true,
  }))
  .use(conditional())
  .use(etag());

// Parsing request cookies and body
app
  .use(cookie())
  .use(bodyParser());

// API
app.use(async (ctx, next) => {
  const prefix = '/api/';

  if (ctx.path.indexOf(prefix) === 0) {
    ctx.mountPath = prefix;
    ctx.path = ctx.path.replace(prefix, '') || '/';

    debug('api')('request %s', ctx.path);

    return await api.apply(this, [ctx, next]); // eslint-disable-line
  }

  await next();
});

// Server Side Rendering based on routes matched by React-router.
router.get('*', SSR({ assets }));
app
  .use(router.routes())
  .use(router.allowedMethods());

app.on('error', (error) => {
  if (error.message !== 'read ECONNRESET') {
    debug(error);
  }
});

if (NODE_ENV !== 'test') {
// Testing does not require you to listen on a port
  app.listen(8000, (error) => {
    if (!error) {
      const message = [
        `App is running in ${chalk.bold.yellow(NODE_ENV)} mode\n`,
        `Open ${chalk.bold.yellow('http://localhost:8000')} in a browser to view the app.\n`,
        'Build something amazing!',
      ];

      console.log(boxen(chalk.green(message.join('')), {
        padding: 1,
        borderColor: 'green',
        margin: 1,
      }));
    }
  });
}

module.exports = app;
