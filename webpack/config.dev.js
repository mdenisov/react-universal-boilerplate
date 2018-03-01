const path = require('path');
const webpack = require('webpack'); // eslint-disable-line
const AssetsPlugin = require('assets-webpack-plugin'); // eslint-disable-line
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin'); // eslint-disable-line
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer'); // eslint-disable-line

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
      'webpack-hot-middleware/client',
      './app.js',
    ],
    vendor: ['react', 'react-dom', 'redux', 'react-redux', 'redux-thunk', 'react-router-dom', 'react-router-config'],
  },

  output: {
    path: path.resolve(__dirname, '../public/dist'),
    publicPath: '/',
    filename: '[name].js',
    chunkFilename: '[name].chunk.js',
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
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader', options: { modules: true, importLoaders: 1, localIdentName: '[name]-[local]' } },
          { loader: 'less-loader' },
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
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),

    new AssetsPlugin({ path: path.resolve(__dirname, '../public/dist') }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: Infinity,
    }),

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

// const server = {
//   context: path.resolve(__dirname, '../server'),
//   devtool: 'eval-source-map',
//   stats: {
//     colors: true,
//     hash: false,
//     children: false,
//     reasons: false,
//     chunks: false,
//     modules: false,
//     warnings: false,
//   },
//   target: 'node',
//
//   entry: {
//     renderer: ['babel-polyfill', './renderer.js'],
//   },
//
//   output: {
//     path: path.resolve(__dirname, '../server'),
//     publicPath: '/',
//     filename: 'SSR.js',
//     libraryTarget: 'commonjs2',
//   },
//
//   module: {
//     rules: [
//       {
//         test: /\.js?$/,
//         exclude: /(node_modules)/,
//         use: {
//           loader: 'babel-loader',
//           options: {
//             presets: ['env', 'react'],
//             // plugins: [
//             //   ['css-modules-transform', {
//             //     generateScopedName: '[name]__[local]__[hash:base64:5]',
//             //     extensions: ['.css'],
//             //   }],
//             // ],
//           },
//         },
//       },
//     ],
//   },
//
//   plugins: [
//     // Setup enviorment variables for client
//     new webpack.EnvironmentPlugin({
//       NODE_ENV: JSON.stringify('development'),
//     }),
//
//     // Setup global variables for client
//     new webpack.DefinePlugin({
//       __CLIENT__: false,
//       __SERVER__: true,
//       __DEV__: true,
//     }),
//
//     new webpack.HotModuleReplacementPlugin(),
//     new webpack.NamedModulesPlugin(),
//   ],
// };

if (process.env.NODE_ENV === 'inspect') {
  client.plugins.push(new BundleAnalyzerPlugin());
}

// module.exports = [client, server];
module.exports = [client];
