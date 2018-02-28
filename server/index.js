// Allows you to use the full set of ES6 features on server-side (place it before anything else)
require('babel-polyfill');
// Allows you to precompile ES6 syntax
require('babel-register');

const path = require('path');

global.__CLIENT__ = false;
global.__SERVER__ = true;
global.__DEV__ = true;

require('css-modules-require-hook')({
  // generateScopedName: '[name]__[local]__[hash:base64:5]',
  generateScopedName: '[name]-[local]',
  extensions: ['.css'],
  rootDir: path.resolve(__dirname, '../client'),
});

// Run server
require('./server');
