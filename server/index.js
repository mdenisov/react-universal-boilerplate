// Allows you to use the full set of ES6 features on server-side (place it before anything else)
// require('babel-polyfill'); // eslint-disable-line
// Allows you to precompile ES6 syntax
// require('babel-register'); // eslint-disable-line

global.__CLIENT__ = false;
global.__SERVER__ = true;
global.__DEV__ = true;

// Run server
require('./server');
