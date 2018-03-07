module.exports = {
  plugins: {
    'postcss-nesting': {},
    'postcss-import': {},
    'postcss-cssnext': {
      browsers: ['> 1%', 'last 2 versions', 'ie >= 11', 'iOS >= 8', 'Safari >= 8'],
    },
    cssnano: {
      autoprefixer: false,
    },
  },
};
