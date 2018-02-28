const path = require('path');
const boxen = require('boxen');
const chalk = require('chalk');
const Koa = require('koa');
const serve = require('koa-static');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const webpack = require('webpack');
const { devMiddleware, hotMiddleware } = require('koa-webpack-middleware');

// Local Imports
const routes = require('./routes');
const webpackConfig = require('../webpack/config.dev')[0];
// const SSR = require('./SSR').default;
const SSR = require('./renderer').default;
const assets = require('../public/dist/webpack-assets.json');

process.on('unhandledRejection', (reason, p) => {
  if (reason.stack) {
    console.error(reason.stack);
  } else {
    console.error('Unhandled Rejection at: Promise ', p, ' reason: ', reason);
  }
});

const { NODE_ENV } = process.env;

// Initialize Express App
const app = new Koa();
const router = new Router();

// Server public assets
app.use(serve(path.resolve(__dirname, '..', 'public')));

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

// API
app
  .use(bodyParser())
  .use(routes.posts.routes())
  .use(routes.posts.allowedMethods());

// Server Side Rendering based on routes matched by React-router.
router.get('*', SSR({ assets }));
app
  .use(router.routes())
  .use(router.allowedMethods());

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

module.exports = app;
