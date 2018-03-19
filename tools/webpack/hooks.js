/* Require hooks for server-side */

const path = require('path');
// const cssnext = require('cssnext');

module.exports = () => {
  // CSS modules
  require('css-modules-require-hook')({ // eslint-disable-line
    generateScopedName: '[name]-[local]',
    extensions: ['.css'],
    // prepend: [
    //   // adding CSS Next plugin
    //   cssnext(),
    // ],
    rootDir: path.resolve(__dirname, '../client'),
  });

  // Images
  // require('asset-require-hook')({
  //   extensions: ['gif', 'jpg', 'jpeg', 'png', 'webp'],
  //   limit: 10240
  // });

  // Fonts
  // require('asset-require-hook')({
  //   extensions: ['woff', 'woff2', 'ttf', 'eot', 'svg'],
  //   limit: 10240
  // });
};
