import pkg from '../../package.json';

const { NODE_ENV, APP_NAME = pkg.name, SHOW_STACK = false } = process.env;

const config = {
  env: NODE_ENV,

  logger: {
    timestamp: false,
    showStack: SHOW_STACK,
    appName: APP_NAME,
  },
};

export default config;
