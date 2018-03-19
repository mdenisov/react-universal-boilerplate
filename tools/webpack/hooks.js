/* Require hooks for server-side */

const path = require('path');

module.exports = () => {
  // CSS modules
  require('css-modules-require-hook')({ // eslint-disable-line
    generateScopedName: '[name]-[local]',
    rootDir: path.resolve(__dirname, '../client'),
  });
};
