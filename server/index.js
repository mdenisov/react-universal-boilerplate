// Allows you to use the full set of ES6 features on server-side (place it before anything else)
// require('babel-polyfill'); // eslint-disable-line

// Allows you to precompile ES6 syntax
require('babel-register'); // eslint-disable-line

const path = require('path'); // eslint-disable-line

const { NODE_ENV } = process.env;

global.__CLIENT__ = false;
global.__SERVER__ = true;
global.__DEV__ = NODE_ENV === 'development';

if (NODE_ENV === 'test' || NODE_ENV === 'production') {
  process.env.DEBUG = '-*';
} else {
  process.env.DEBUG = '*,-babel,-koa-static,-koa-send,-koa-better-error-handler';
}

const Server = require('./server');
const api = require('./api');
const SSR = require('./SSR').default;
const Logger = require('./utils/logger');
const assets = require('../public/dist/webpack-assets.json');
const webpack = require('../tools/webpack/config.dev')[0];

// Create logger instance
const logger = Logger.create('SERVER');


process.on('unhandledRejection', (reason, p) => {
  if (reason.stack) {
    logger.error(JSON.stringify(reason.stack));
  } else {
    logger.error('Unhandled Rejection at: Promise ', p, ' reason: ', reason);
  }
});

process.on('uncaughtException', (error) => {
  logger.error(`Uncaught Exception: ${error.message}`, JSON.stringify(error.stack));
});

// Create server instance
const server = new Server({
  env: NODE_ENV,
  favicon: path.resolve(__dirname, '../public/favicon.ico'),
  public: path.resolve(__dirname, '../public'),
  renderer: SSR({ assets }),
  api,
  webpack,
  logger,
});

// Run server
server.listen(8000);

module.exports = server;
