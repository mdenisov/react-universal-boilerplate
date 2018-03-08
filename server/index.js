// Allows you to use the full set of ES6 features on server-side (place it before anything else)
// require('babel-polyfill'); // eslint-disable-line

// Allows you to precompile ES6 syntax
require('babel-register'); // eslint-disable-line

const path = require('path'); // eslint-disable-line

global.__CLIENT__ = false;
global.__SERVER__ = true;
global.__DEV__ = true;

const Server = require('./server');
const api = require('./api');
const SSR = require('./SSR').default;
const assets = require('../public/dist/webpack-assets.json');
const webpack = require('../tools/webpack/config.dev')[0];

if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'production') {
  process.env.DEBUG = '-*';
} else {
  process.env.DEBUG = '*,-babel,-koa-static';
}


process.on('unhandledRejection', (reason, p) => {
  if (reason.stack) {
    console.error(reason.stack);
  } else {
    console.error('Unhandled Rejection at: Promise ', p, ' reason: ', reason);
  }
});

process.on('uncaughtException', (error) => {
  console.error(`Uncaught Exception: ${error.message}`, error.stack);
});


// Create server instance
const server = new Server({
  favicon: path.resolve(__dirname, '../public/favicon.ico'),
  static: path.resolve(__dirname, '../public'),
  api,
  renderer: SSR({ assets }),
  webpack,
});

// Run server
server.listen(8000);

module.exports = server;
