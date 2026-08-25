/**
 * `jest.config.js` sets `customExportConditions: ['']` so MSW resolves to its
 * neutral build. That also drops the `browser` condition, which makes
 * `@lit/react` — the runtime behind the `@multiversx/sdk-dapp-ui/react` Stencil
 * wrappers — resolve to its `node` (SSR) build. That build never assigns props
 * onto the custom element, so every `Mvx*` component renders empty under jsdom.
 * Re-add `browser` for that one package only.
 */
module.exports = (request, options) => {
  if (request === '@lit/react' || request.startsWith('@lit/react/')) {
    return options.defaultResolver(request, {
      ...options,
      conditions: [...(options.conditions ?? []), 'browser']
    });
  }

  return options.defaultResolver(request, options);
};
