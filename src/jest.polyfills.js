/**
 * Runs via `setupFiles`, i.e. before the test framework and before setupTests.js.
 *
 * msw v2 touches web globals (TextEncoder, streams, fetch primitives) while its modules
 * are being evaluated, and jsdom provides none of them. Assigning these from
 * setupTests.js is too late: ES imports there are hoisted above the assignments.
 */

const define = (property, value) =>
  Object.defineProperty(globalThis, property, {
    value,
    writable: true,
    configurable: true
  });

// Node primitives jsdom lacks. Blob/File/performance are deliberately left alone —
// jsdom's FileReader rejects a node:buffer Blob as "not of type 'Blob'".
const {
  ReadableStream,
  TransformStream,
  WritableStream
} = require('node:stream/web');
const { TextDecoder, TextEncoder } = require('node:util');
const {
  BroadcastChannel,
  MessageChannel,
  MessagePort
} = require('node:worker_threads');

define('MessageChannel', MessageChannel);
define('MessagePort', MessagePort);
define('TextDecoder', TextDecoder);
define('TextEncoder', TextEncoder);
define('ReadableStream', ReadableStream);
define('TransformStream', TransformStream);
define('WritableStream', WritableStream);
define('BroadcastChannel', BroadcastChannel);

// Required after the defines above: undici reads TextDecoder at module scope.
//
// jsdom ships no fetch, and whatwg-fetch's Response is not spec-compliant enough for
// msw v2 — its body never reaches the XHR interceptor, so every mocked response arrives
// as an empty string. undici is the implementation Node itself uses.
const { fetch, FormData, Headers, Request, Response } = require('undici');

define('fetch', fetch);
define('FormData', FormData);
define('Headers', Headers);
define('Request', Request);
define('Response', Response);
