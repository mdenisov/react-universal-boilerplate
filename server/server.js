const http = require('http');
const boxen = require('boxen');
const chalk = require('chalk');
const _isFunction = require('lodash/isFunction'); // eslint-disable-line

// koa stuff
const Koa = require('koa');
const serve = require('koa-static');
const favicon = require('koa-favicon');
const Router = require('koa-router');
const cors = require('kcors');
const compress = require('koa-compress');
const bodyParser = require('koa-bodyparser');
const conditional = require('koa-conditional-get');
const etag = require('koa-etag');
const logger = require('koa-logger'); // eslint-disable-line
const json = require('koa-json'); // eslint-disable-line
const responseTime = require('koa-response-time'); // eslint-disable-line
const errorHandler = require('koa-better-error-handler');
const compressible = require('compressible');
const helmet = require('koa-helmet');
const compose = require('koa-compose');

// middlewares
const timeout = require('./middleware/timeout');
const hmr = require('./middleware/hmr');
const api = require('./middleware/api');

class Server {
  constructor(config) {
    this.config = Object.assign({
      env: 'development',
      favicon: false,
      public: false,
      cors: {},
      webpack: false,
      logger: console,
      middlewares: false,
    }, config);

    if (!_isFunction(this.config.renderer)) {
      throw new Error('renderer was not a function');
    }

    const IS_DEV = this.config.env === 'development';
    const IS_PROD = this.config.env === 'production';

    const cacheOptions = {
      gzip: !IS_DEV,
      maxage: IS_DEV ? 0 : 1000 * 60 * 60 * 24,
    };

    // initialize the app
    const app = new Koa();

    app.on('error', this.config.logger.error);
    app.on('log', this.config.logger.log);

    // initialize the app router
    const router = new Router();

    // HMR Stuff
    if (IS_DEV && this.config.webpack) {
      const hmrm = hmr({ config: this.config.webpack });

      app.use(hmrm.dev);
      app.use(hmrm.hot);
    }

    // favicon
    if (this.config.favicon) {
      app.use(favicon(this.config.favicon, cacheOptions));
    }

    // serve static assets
    if (this.config.public) {
      app.use(serve(this.config.public, cacheOptions));
    }

    // compress/gzip
    if (IS_PROD) {
      app.use(compress({
        filter: type => !(/event-stream/i.test(type)) && compressible(type),
        threshold: 2048,
      }));
    }

    // override koa's undocumented error handler
    app.context.onerror = errorHandler;

    // response time
    if (IS_DEV) {
      app.use(responseTime());
    }

    // request logger with custom logger
    if (IS_DEV) {
      app.use(logger());
    }

    // conditional-get
    app.use(conditional());

    // etag
    app.use(etag());

    // cors
    app.use(cors(this.config.cors));

    // security
    app.use(helmet());

    // body parser
    app.use(bodyParser());

    // pretty-printed json responses
    app.use(json());

    if (Array.isArray(this.config.middlewares)) {
      app.use(compose(this.config.middlewares));
    }

    // configure response timeout
    app.use(timeout({ logger: this.config.logger }));

    // API
    if (this.config.api && _isFunction(this.config.api)) {
      app.use(api({ prefix: '/api/', app: this.config.api }));
    }

    // Server Side Rendering based on routes matched by React-router.
    router.get('*', this.config.renderer);

    app.use(router.routes());
    app.use(router.allowedMethods());

    // expose app and server
    this.app = app;
    this.server = http.createServer(app.callback());
  }

  listen(port, fn) {
    this.server = this.server.listen(port, () => {
      // this.config.logger.debug('listen port %s', port);
      this.config.logger.info('listen port %s', port);
      // this.config.logger.warn('listen port %s', port);
      // this.config.logger.error('listen port %s', port);
      // this.config.logger.fatal('listen port %s', port);

      if (_isFunction(fn)) {
        fn();
      }

      if (this.config.env === 'development') {
        const message = [
          `App is running in ${chalk.bold.yellow(this.config.env)} mode\n`,
          `Open ${chalk.bold.yellow(`http://localhost:${port}`)} in a browser to view the app.\n`,
          'Build something amazing!',
        ];

        console.info(boxen(chalk.green(message.join('')), {
          padding: 1,
          borderColor: 'green',
          margin: 1,
        }));
      }
    });

    return this.server;
  }

  close(fn) {
    this.server.close(fn);

    this.config.logger.info('close');

    return this;
  }
}

module.exports = Server;
