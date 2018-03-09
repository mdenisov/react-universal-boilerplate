import http from 'http';
import boxen from 'boxen';
import chalk from 'chalk';
import Koa from 'koa';
import serve from 'koa-static';
import favicon from 'koa-favicon';
import Router from 'koa-router';
import cors from 'kcors';
import compress from 'koa-compress';
import bodyParser from 'koa-bodyparser';
import conditional from 'koa-conditional-get';
import etag from 'koa-etag';
import koaLogger from 'koa-logger'; // eslint-disable-line
import json from 'koa-json'; // eslint-disable-line
import responseTime from 'koa-response-time'; // eslint-disable-line
import errorHandler from 'koa-better-error-handler';
import Timeout from 'koa-better-timeout';
import compressible from 'compressible';
import helmet from 'koa-helmet';
import webpack from 'webpack'; // eslint-disable-line
import { devMiddleware, hotMiddleware } from 'koa-webpack-middleware'; // eslint-disable-line
import debug from 'debug'; // eslint-disable-line
import _isFunction from 'lodash/isFunction'; // eslint-disable-line

class Server {
  constructor(config) {
    this.config = Object.assign({
      env: 'development',
      favicon: false,
      static: false,
      cors: {},
      webpack: {},
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

    // favicons
    if (this.config.favicon) {
      app.use(favicon(this.config.favicon, cacheOptions));
    }

    // serve static assets
    if (this.config.static) {
      app.use(serve(this.config.static, cacheOptions));
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
    app.use(responseTime());

    // request logger with custom logger
    app.use(koaLogger());

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
        ctx.throw(err);
      }
    });

    // API
    if (this.config.api && _isFunction(this.config.api)) {
      app.use(async (ctx, next) => {
        const prefix = '/api/';

        if (ctx.path.indexOf(prefix) === 0) {
          ctx.path = ctx.path.replace(prefix, '') || '/';

          debug('api')('request %s', ctx.path);

          return await this.config.api.apply(this, [ctx, next]); // eslint-disable-line
        }

        await next();
      });
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
      if (_isFunction(fn)) {
        fn();
      }

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
    });

    return this.server;
  }

  close(fn) {
    this.server.close(fn);

    return this;
  }
}

export default Server;
