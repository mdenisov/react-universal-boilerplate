const path = require('path');
const boxen = require('boxen');
const chalk = require('chalk');
const Koa = require('koa');
const serve = require('koa-static');
const favicon = require('koa-favicon');
const Router = require('koa-router');
// const cors = require('@koa/cors');
const cookie = require('koa-cookie').default;
const compress = require('koa-compress');
const bodyParser = require('koa-bodyparser');
const conditional = require('koa-conditional-get'); // eslint-disable-line
const etag = require('koa-etag'); // eslint-disable-line
const logger = require('koa-logger'); // eslint-disable-line
const compressible = require('compressible'); // eslint-disable-line
const zlib = require('zlib'); // eslint-disable-line
const webpack = require('webpack'); // eslint-disable-line
const { devMiddleware, hotMiddleware } = require('koa-webpack-middleware'); // eslint-disable-line
const debug = require('debug')('server'); // eslint-disable-line

// Local Imports
const apiLayer = require('./api').default;
const webpackConfig = require('../webpack/config.dev')[0];
const SSR = require('./SSR').default;
// const SSR = require('./renderer').default;
const assets = require('../public/dist/webpack-assets.json');

const { NODE_ENV } = process.env;

// Initialize Express App
const app = new Koa();
const router = new Router();

// error handling
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    debug(error.message, error.stack);

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
    publicPath: webpackConfig.output.publicPath,
  };

  const compiler = webpack(webpackConfig);

  app.use(devMiddleware(compiler, middlewareOptions));
  app.use(hotMiddleware(compiler, {
    log: false,
  }));
}

// Server public assets
app
  .use(logger())
  .use(favicon(path.resolve(__dirname, '..', 'public', 'favicon.ico'), { maxage: 0 }))
  .use(serve(path.resolve(__dirname, '..', 'public'), { maxage: 0 }))
  .use(compress({
    filter: type => !(/event-stream/i.test(type)) && compressible(type),
    threshold: 2048,
    flush: zlib.Z_SYNC_FLUSH,
  }))
  .use(conditional())
  .use(etag());

app
  .use(cookie())
  .use(bodyParser());

// API
apiLayer(app);

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
