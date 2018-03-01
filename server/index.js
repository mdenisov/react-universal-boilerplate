// Allows you to use the full set of ES6 features on server-side (place it before anything else)
require('babel-polyfill'); // eslint-disable-line
// Allows you to precompile ES6 syntax
require('babel-register'); // eslint-disable-line

const path = require('path');
const less = require('less').parser; // eslint-disable-line

global.__CLIENT__ = false;
global.__SERVER__ = true;
global.__DEV__ = true;

require('css-modules-require-hook')({ // eslint-disable-line
  // generateScopedName: '[name]__[local]__[hash:base64:5]',
  generateScopedName: '[name]-[local]',
  extensions: ['.less'],
  processorOpts: { parser: less },
  rootDir: path.resolve(__dirname, '../client'),
});

// Run server
require('./server');
