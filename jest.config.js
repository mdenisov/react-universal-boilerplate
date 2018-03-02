module.exports = {
  verbose: true,
  testRegex: '\\.spec\\.js$',
  rootDir: '.',
  testPathIgnorePatterns: ['/node_modules/'],
  transform: {
    scriptPreprocessor: '<rootDir>/node_modules/jest-css-modules',
  },
};
