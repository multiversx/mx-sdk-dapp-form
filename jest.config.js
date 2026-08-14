module.exports = {
  verbose: true,
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    customExportConditions: ['']
  },
  moduleDirectories: ['node_modules', 'src'],
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.(ts|js|tsx|jsx|mjs)$': ['@swc/jest'],
    '^.+\\.svg$': 'jest-transformer-svg'
  },
  setupFiles: ['<rootDir>/src/jest.polyfills.js'],
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  moduleFileExtensions: ['js', 'ts', 'tsx', 'jsx', 'json', 'cjs', 'mjs'],
  testMatch: ['**/src/**/?(*.)+(spec|test).ts?(x)'],
  moduleNameMapper: {
    '.+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$':
      'identity-obj-proxy'
  },
  transformIgnorePatterns: [],
  workerIdleMemoryLimit: '512MB', // Memory used per worker. Required to prevent memory leaks
  maxWorkers: '50%' // Maximum tests ran in parallel. Required to prevent CPU usage at 100%
};
