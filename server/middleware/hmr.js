import webpack from 'webpack'; // eslint-disable-line
import { devMiddleware, hotMiddleware } from 'koa-webpack-middleware'; // eslint-disable-line

function hmr(options) {
  const compiler = webpack(options.config);
  const config = {
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
    publicPath: options.config.output.publicPath,
  };

  return {
    dev: devMiddleware(compiler, config),
    hot: hotMiddleware(compiler, { log: false }),
  };
}

export default hmr;
