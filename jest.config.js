module.exports = {
  verbose: true,
  testEnvironment: 'jsdom',
  moduleDirectories: ['node_modules', 'src'],
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.(ts|js|tsx|jsx|cjs|mjs)$': ['@swc/jest'],
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
  transformIgnorePatterns: ["node_modules/(^.+\\\\.(ts|js|tsx|jsx|cjs|mjs)$)"],
  moduleFileExtensions: [
    // Place tsx and ts to beginning as suggestion from Jest team
    // https://jestjs.io/docs/configuration#modulefileextensions-arraystring
    "tsx",
    "ts",
    "cjs",
    "mjs",
    "web.js",
    "js",
    "web.ts",
    "web.tsx",
    "json",
    "node",
  ],
  // bail: 1,
  workerIdleMemoryLimit: '512MB', // Memory used per worker. Required to prevent memory leaks
  maxWorkers: '50%' // Maximum tests ran in parallel. Required to prevent CPU usage at 100%
};
