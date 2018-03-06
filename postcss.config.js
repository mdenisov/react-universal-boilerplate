module.exports = {
  plugins: {
    'postcss-clean': {},
    'postcss-nesting': {},
    'postcss-import': {},
    'postcss-cssnext': {
      browsers: ['> 1%', 'last 2 versions', 'ie >= 11', 'iOS >= 8', 'Safari >= 8'],
    },
  },
};
