module.exports = {
  verbose: true,
  testEnvironment: 'jsdom',
  moduleDirectories: ['node_modules', 'src'],
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.(ts|js|tsx|jsx)$': ['@swc/jest'],
    '^.+\\.scss$': 'jest-css-modules-transform',
    '\\.svg$': '<rootDir>/jestFileTransformer.js'
  },
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  moduleFileExtensions: ['js', 'ts', 'tsx', 'jsx', 'json'],
  testMatch: ['**/src/**/?(*.)+(spec|test).ts?(x)'],
  moduleNameMapper: {
    '.+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2|svg)$':
      'identity-obj-proxy'
  },
  transformIgnorePatterns: ['node_modules/(^.+\\\\.(ts|js)$)']
};
