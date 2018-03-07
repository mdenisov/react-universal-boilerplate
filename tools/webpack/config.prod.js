const path = require('path');
const webpack = require('webpack'); // eslint-disable-line
const AssetsPlugin = require('assets-webpack-plugin'); // eslint-disable-line
const ExtractTextPlugin = require('extract-text-webpack-plugin'); // eslint-disable-line
const MinifyPlugin = require('babel-minify-webpack-plugin'); // eslint-disable-line
const CompressionPlugin = require('compression-webpack-plugin'); // eslint-disable-line

const ROOT = path.resolve(__dirname, '../../');
const CLIENT = path.resolve(ROOT, './client');
const SERVER = path.resolve(ROOT, './server');
const DIST = path.resolve(ROOT, './public/dist');

const client = {
  context: CLIENT,
  devtool: false,
  stats: {
    colors: true,
    hash: false,
    children: false,
    reasons: false,
    chunks: false,
    modules: false,
    warnings: false,
    errors: false,
  },
  target: 'web',

  entry: {
    app: [
      'babel-polyfill',
      './app.js',
    ],
    vendor: ['react', 'react-dom', 'redux', 'react-redux', 'redux-thunk', 'react-router-dom', 'react-router-config'],
  },

  output: {
    path: DIST,
    publicPath: 'http://localhost:8000/dist/',
    filename: '[name].[hash:8].js',
    chunkFilename: '[name].bundle.[hash:8].js',
    jsonpFunction: 'wsp',
  },

  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env', 'react'],
            plugins: ['transform-react-remove-prop-types'],
          },
        },
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            { loader: 'css-loader', options: { modules: true, importLoaders: 1, localIdentName: '[hash:base64:5]' } },
            { loader: 'postcss-loader' },
          ],
        }),
      },
      {
        test: /\.(woff2?|ttf|eot|svg)$/,
        loader: 'url-loader',
        options: { limit: 10240 },
      },
      {
        test: /\.(gif|png|jpe?g|webp)$/,
        // Any image below or equal to 10K will be converted to inline base64 instead
        use: [
          {
            loader: 'url-loader',
            options: { limit: 10240 },
          },
          // Using for image optimization
          {
            loader: 'image-webpack-loader',
            options: { bypassOnDebug: true },
          },
        ],
      },
    ],
  },

  plugins: [
    // Setup environment variables for client
    new webpack.EnvironmentPlugin(['NODE_ENV', 'DEBUG']),

    // Setup global variables for client
    new webpack.DefinePlugin({
      __CLIENT__: true,
      __SERVER__: false,
      __DEV__: false,
    }),

    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
    }),
    new MinifyPlugin({}, { test: /\.js?$/, comments: false }),
    new webpack.HashedModuleIdsPlugin(),

    new AssetsPlugin({ path: DIST }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: Infinity,
    }),
    new ExtractTextPlugin({
      filename: '[name].[contenthash:8].css',
      allChunks: true,
      ignoreOrder: true,
    }),

    new CompressionPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: /\.js$|\.css$|\.html$/,
      threshold: 10240,
      minRatio: 0.8,
    }),

    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.IgnorePlugin(/webpack-stats\.json$/),
  ],
};

const server = {
  context: SERVER,
  devtool: false,
  stats: {
    colors: true,
    hash: false,
    children: false,
    reasons: false,
    chunks: false,
    modules: false,
    warnings: false,
  },
  target: 'node',

  entry: {
    renderer: ['babel-polyfill', './renderer.js'],
  },

  output: {
    path: SERVER,
    publicPath: '/',
    filename: 'SSR.js',
    libraryTarget: 'commonjs2',
    jsonpFunction: 'wsp',
  },

  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env', 'react'],
            plugins: [
              'transform-react-remove-prop-types',
              ['css-modules-transform', {
                generateScopedName: '[hash:base64:5]',
                extensions: ['.css'],
                rootDir: CLIENT,
              }],
            ],
          },
        },
      },
    ],
  },

  plugins: [
    // Setup enviorment variables for client
    new webpack.EnvironmentPlugin(['NODE_ENV', 'DEBUG']),

    // Setup global variables for client
    new webpack.DefinePlugin({
      __CLIENT__: false,
      __SERVER__: true,
      __DEV__: false,
    }),

    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
    }),
    new MinifyPlugin({}, { test: /\.jsx?$/, comments: false }),
    new webpack.HashedModuleIdsPlugin(),
  ],
};

module.exports = [client, server];
