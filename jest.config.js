module.exports = {
  verbose: true,
  testRegex: '\\.spec\\.js$',
  rootDir: '.',
  testPathIgnorePatterns: ['/node_modules/'],
  transform: {
    '^.+\\.(jsx|js)?$': '<rootDir>/node_modules/babel-jest',
    '\\.css$': '<rootDir>/node_modules/jest-css-modules',
  },
  setupFiles: ['./jest.setup.js'],
  snapshotSerializers: ['enzyme-to-json/serializer'],
};
