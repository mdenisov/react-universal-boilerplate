const path = require('path');
const webpack = require('webpack'); // eslint-disable-line
const AssetsPlugin = require('assets-webpack-plugin'); // eslint-disable-line
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin'); // eslint-disable-line
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer'); // eslint-disable-line

const ROOT = path.resolve(__dirname, '../../');
const CLIENT = path.resolve(ROOT, './client');
const SERVER = path.resolve(ROOT, './server');
const DIST = path.resolve(ROOT, './public/dist');

const client = {
  context: CLIENT,
  devtool: 'eval-source-map',
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
      'webpack-hot-middleware/client',
      './app.js',
    ],
    vendor: ['react', 'react-dom', 'redux', 'react-redux', 'redux-thunk', 'react-router-dom', 'react-router-config'],
  },

  output: {
    path: DIST,
    publicPath: 'http://localhost:8000/dist/',
    filename: '[name].js',
    chunkFilename: '[name].chunk.js',
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
            plugins: [['react-transform', {
              transforms: [{
                transform: 'react-transform-hmr',
                imports: ['react'],
                locals: ['module'],
              }],
            }]],
          },
        },
      },
      {
        test: /\.css$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader', options: { modules: true, importLoaders: 1, localIdentName: '[name]-[local]' } },
          { loader: 'postcss-loader' },
        ],
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
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development',
    }),

    // Setup global variables for client
    new webpack.DefinePlugin({
      __CLIENT__: true,
      __SERVER__: false,
      __DEV__: true,
    }),

    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),

    new AssetsPlugin({ path: DIST }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: Infinity,
    }),

    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.IgnorePlugin(/webpack-stats\.json$/),
    new FriendlyErrorsWebpackPlugin(),
  ],
};

const server = {
  context: SERVER,
  devtool: 'eval-source-map',
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
              ['css-modules-transform', {
                generateScopedName: '[name]-[local]',
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
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development',
    }),

    // Setup global variables for client
    new webpack.DefinePlugin({
      __CLIENT__: false,
      __SERVER__: true,
      __DEV__: true,
    }),

    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
  ],
};

if (process.env.NODE_ENV === 'inspect') {
  client.plugins.push(new BundleAnalyzerPlugin());
}

module.exports = [client, server];
