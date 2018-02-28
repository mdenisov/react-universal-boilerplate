const webpack = require('webpack');
const AssetsPlugin = require('assets-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const path = require('path');
// const precss = require('precss');
// const postcssImport = require('postcss-import');
// const cssNext = require('postcss-cssnext');
// const cssNested = require('postcss-nested');
// const ExtractTextPlugin = require('extract-text-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const client = {
  context: path.resolve(__dirname, '../client'),
  // devtool: 'eval-source-map',
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
      'webpack-hot-middleware/client?path=http://localhost:8000/__webpack_hmr',
      './app.js',
    ],
    vendor: ['react', 'react-dom', 'redux', 'react-redux', 'redux-thunk', 'react-router-dom', 'react-router-config'],
  },

  output: {
    path: path.resolve(__dirname, '../public/dist'),
    publicPath: '/',
    filename: '[name].js',
    chunkFilename: '[name].chunk.js',
    // filename: '[name].[hash:8].js',
    // chunkFilename: '[name].[chunkhash:8].chunk.js',
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
          },
        },
      },
      {
        test: /\.less$/,
        // include: [APP, PLATFORM],
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader', options: { modules: true, importLoaders: 1, localIdentName: '[name]-[local]' } },
          { loader: 'less-loader' },
        ],
      },
      // {
      //   test: /\.css$/,
      //   use: ExtractTextPlugin.extract({
      //     fallback: 'style-loader',
      //     use: [
      //       {
      //         loader: 'css-loader',
      //         options: {
      //           // importLoaders: 1,
      //           sourceMap: true,
      //           modules: true,
      //           localIdentName: '[name]__[local]__[hash:base64:5]',
      //           minimize: false,
      //         },
      //       },
      //       // {
      //       //   loader: 'less-loader',
      //       //   options: {
      //       //     outputStyle: 'expanded',
      //       //     sourceMap: true,
      //       //     sourceMapContents: false,
      //       //   },
      //       // },
      //     ],
      //   }),
      // },
    ],
  },

  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),

    new AssetsPlugin({ path: path.resolve(__dirname, '../public/dist') }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: Infinity,
    }),

    // new ExtractTextPlugin({
    //   // Don't use hash in development, we need the persistent for "renderHtml.js"
    //   // filename: '[name].[contenthash:8].css',
    //   filename: '[name].css',
    //   allChunks: true,
    //   ignoreOrder: true,
    // }),

    // Setup enviorment variables for client
    new webpack.EnvironmentPlugin({
      NODE_ENV: JSON.stringify('development'),
    }),

    // Setup global variables for client
    new webpack.DefinePlugin({
      __CLIENT__: true,
      __SERVER__: false,
      __DEV__: true,
    }),

    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.IgnorePlugin(/webpack-stats\.json$/),
    new FriendlyErrorsWebpackPlugin(),
  ],
};

const server = {
  context: path.resolve(__dirname, '../server'),
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
    path: path.resolve(__dirname, '../server'),
    publicPath: '/',
    filename: 'SSR.js',
    libraryTarget: 'commonjs2',
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
            // plugins: [
            //   ['css-modules-transform', {
            //     generateScopedName: '[name]__[local]__[hash:base64:5]',
            //     extensions: ['.css'],
            //   }],
            // ],
          },
        },
      },
    ],
  },

  plugins: [
    // Setup enviorment variables for client
    new webpack.EnvironmentPlugin({
      NODE_ENV: JSON.stringify('development'),
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

// module.exports = [client, server];
module.exports = [client];
