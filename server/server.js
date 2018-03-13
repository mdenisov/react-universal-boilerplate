const http = require('http');
const boxen = require('boxen');
const chalk = require('chalk');

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
const Timeout = require('koa-better-timeout');
const compressible = require('compressible');
const helmet = require('koa-helmet');

const webpack = require('webpack'); // eslint-disable-line
const { devMiddleware, hotMiddleware } = require('koa-webpack-middleware'); // eslint-disable-line
const _isFunction = require('lodash/isFunction'); // eslint-disable-line

class Server {
  constructor(config) {
    this.config = Object.assign({
      env: 'development',
      favicon: false,
      public: false,
      cors: {},
      webpack: {},
      logger: console,
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
        publicPath: this.config.webpack.output.publicPath,
      };
      const compiler = webpack(this.config.webpack);

      app.use(devMiddleware(compiler, middlewareOptions));
      app.use(hotMiddleware(compiler, {
        log: false,
      }));
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

    // configure response timeout
    app.use(async (ctx, next) => {
      try {
        const tm = new Timeout({
          ms: 3000,
          message: 'REQUEST_TIMED_OUT',
        });

        await tm.middleware(ctx, next);
      } catch (err) {
        this.config.logger.error(err);
        ctx.throw(err);
      }
    });

    // API
    if (this.config.api && _isFunction(this.config.api)) {
      app.use(async (ctx, next) => {
        const prefix = '/api/';

        if (ctx.path.indexOf(prefix) === 0) {
          ctx.path = ctx.path.replace(prefix, '') || '/';

          return await this.config.api.apply(this, [ctx, next]); // eslint-disable-line
        }

        await next();
      });
    }

    // Server Side Rendering based on routes matched by React-router.
    router.get('*', this.config.renderer);
    // router.get('*', (ctx) => {
    //   ctx.type = 'html';
    //   ctx.body = '123456';
    // });

    app.use(router.routes());
    app.use(router.allowedMethods());

    // expose app and server
    this.app = app;
    this.server = http.createServer(app.callback());
  }

  listen(port, fn) {
    this.server = this.server.listen(port, () => {
      this.config.logger.info('listen port %s', port);

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
