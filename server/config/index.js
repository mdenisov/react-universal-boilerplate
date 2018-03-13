// import pkg from '../../package.json';

const { NODE_ENV, SHOW_STACK = true } = process.env;

const config = {
  env: NODE_ENV,

  logger: {
    timestamp: false,
    showStack: SHOW_STACK,
  },
};

export default config;
