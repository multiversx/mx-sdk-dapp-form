import '@testing-library/jest-dom/extend-expect';
import 'whatwg-fetch';

/**************
 * MSW config code
 ***************/

import { TextDecoder, TextEncoder } from 'util';
import { server } from './__mocks__/server';

global.ResizeObserver = require('resize-observer-polyfill');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

jest.setTimeout(60000);
jest.retryTimes(0);

// Establish API mocking before all tests.
beforeAll(() => server.listen());

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => server.resetHandlers());

// Clean up after the tests are finished.
afterAll(() => server.close());

/**************
 * window config
 ***************/

window.scrollTo = jest.fn();

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn()
  }))
});
