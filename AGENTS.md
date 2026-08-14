# AGENTS.md

Working conventions for `@multiversx/sdk-dapp-form`: how the project is laid out,
how it is built and tested, and what must hold before a change is merged.
Installation and usage are covered in [README.md](./README.md).

## Project overview

A React library that holds the logic for building and validating MultiversX
blockchain transactions: form state (Formik), validation schemas (Yup), gas /
amount computation, API calls against the MultiversX API, and an optional set of
UI components.

- Package: `@multiversx/sdk-dapp-form`, published to npm, GPL-3.0-or-later.
- Consumers: dapps built on `@multiversx/sdk-dapp` and `@multiversx/sdk-core`.
- Output: a bundler-targeted library in `out/` (ESM `.mjs` + CJS `.cjs` + `.d.ts`),
  built with Vite in `preserveModules` mode — one output module per source module.

## Setup commands

Requires **Node 24** (the version CI uses) and **pnpm**.

```bash
pnpm install          # use --frozen-lockfile in CI
pnpm build            # vite build + barrel shims + compiled styles -> out/
pnpm watch            # incremental rebuild into out/
pnpm test             # jest
pnpm test:watch
pnpm lint             # eslint --fix src
pnpm lint:check       # eslint src, no writes
pnpm pre-pr           # lint + build + test — run this before opening a PR
```

There is no separate typecheck script; types are emitted (and therefore checked)
as part of `pnpm build` via `vite-plugin-dts` and `tsconfig.build.json`.

## Repository layout

```
src/
  apiCalls/                 API clients (account, addresses, economics, network, tokens, transactions)
  assets/                   icons (SVG, imported as components via svgr) and sass
  constants/                shared constants
  containers/               SendFormContainer — wires Formik + all context providers
  contexts/                 one directory per form concern (Amount, DataField, Form, Gas,
                            Network, Receiver, ReceiverUsername, Tokens)
  helpers/                  misc / transformations / validation helpers
  hooks/                    useComputeGasLimit, useFetchGasLimit, getInitialValues, ...
  operations/               pure transaction math (gas limit, fees, data field, tx generation)
  types/                    shared TypeScript types and enums
  UI/                       optional React components (Fields, Form, ConfirmScreen, ...)
  utilities/                small shared utilities
  validateSignTransactions/ validation of transactions coming from the sign flow
  validation/               field-level validators and default error messages
  validationSchema/         Yup schemas
  tests/                    end-to-end-ish form tests (SendEGLD, SendESDT, SendNFT, ...)
  __mocks__/                MSW server + account fixtures
scripts/emit-barrel-shims.mjs  post-build step, see "Build system"
```

Every directory that is part of the public surface has an `index.ts`/`index.tsx`
barrel; `src/index.ts` re-exports those barrels.

## Code style

- TypeScript, `strict: true`, plus `noUnusedLocals`, `noUnusedParameters`,
  `noImplicitReturns`, `noFallthroughCasesInSwitch`. Do not weaken these.
- Prettier (enforced through ESLint): single quotes, single-quoted JSX
  attributes, semicolons, 2-space indent, no trailing commas, `arrowParens: always`.
- **Imports use the `src`-rooted path aliases**, not relative traversal:
  `import { ZERO } from 'constants/index';`, `import { getTransactionFields } from 'helpers';`.
  Aliases are declared in `tsconfig.base.json` `paths` and resolved by Jest via
  `moduleDirectories: ['node_modules', 'src']`. Relative imports are fine within
  a directory (`./MyComponent`).
- Import external SDK modules from their published deep paths, matching existing
  usage (e.g. `@multiversx/sdk-core/out/core/transaction`).
- Comments explain *why* something is the way it is (see the header comments in
  `vite.config.mts` and `scripts/emit-barrel-shims.mjs`). Match the surrounding
  density; do not narrate obvious code.
- New exports must be re-exported from the enclosing directory barrel, otherwise
  they are unreachable for consumers.

## Testing

- Jest + jsdom + `@testing-library/react`, with MSW (`src/__mocks__/server.ts`)
  intercepting network calls. Global setup: `src/setupTests.js`,
  `src/jest.polyfills.js`.
- Test files match `**/src/**/*.(spec|test).ts(x)`. Colocated `tests/` folders
  exist under `src/tests`, `src/operations/tests`, `src/validateSignTransactions/tests`.
- Form-level tests render through `src/tests/helpers/renderForm.tsx` and
  `TestWrapper.tsx` — reuse those helpers rather than assembling providers by hand.
- The suite is slow (60s per-test timeout, `maxWorkers: '50%'`). Scope runs while
  iterating: `pnpm test src/operations`, `pnpm test -t 'SendNFT'`.
- Add a mock handler in `src/__mocks__` when a change introduces a new API call;
  unmocked requests will fail the suite.

## Build system

`pnpm build` runs three steps and all three matter:

1. `vite build` — multi-entry library build over every non-test `src/**/*.{ts,tsx}`,
   `preserveModules: true`, emitting `.mjs`, `.cjs`, `.d.ts` into `out/`.
2. `node scripts/emit-barrel-shims.mjs` — the `./out/*` export pattern can only
   point at one target shape, so this emits a sibling module next to every barrel
   directory (`out/hooks.mjs` → `out/hooks/index.mjs`). Deep imports at any depth
   keep resolving through a single `exports` pattern.
3. `build:styles` — compiles `src/assets/sass/main.scss` into `out/styles.css`
   (the optional global theme).

Constraints to respect when touching the build:

- `generateScopedName: 'dapp-core-component__[name]__[local]'` ships inside
  consumer markup — changing it is a breaking change.
- Component styles are injected at import time (`vite-plugin-css-injected-by-js`),
  which is why `sideEffects` in `package.json` lists style files; keep that list
  in sync or consumers will tree-shake styles away.
- `dependencies`, `peerDependencies` and `optionalDependencies` are all marked
  external in `vite.config.mts`. A new runtime import must be declared in one of
  those fields, otherwise it gets inlined into the bundle.
- Optional deps (`react-select`, `classnames`, FontAwesome) back UI-only code and
  may be absent for consumers installing with `--no-optional`. Do not import them
  from non-UI modules.

## Pull requests

- Branch off `main`; branch naming follows `feat/…`, `fix/…`, `chore/…`.
- **CHANGELOG.md must be updated in every PR** — CI runs
  `dangoslen/changelog-enforcer`. Add a bullet under `## [Unreleased]` linking to
  the PR: `- [Short description](https://github.com/multiversx/mx-sdk-dapp-form/pull/NNN)`.
- Fill in `.github/pull_request_template.md` (issue, root cause, fix, breaking
  changes, changelog, testing).
- CI on PRs: install, build, `pnpm test --silent` (`.github/workflows/pre-merge-unit-tests.yml`).
  Run `pnpm pre-pr` locally first.
- Merging to `main` triggers `.github/workflows/npm-publish.yml`, which publishes
  to npm — tagged `next` when the version in `package.json` is a prerelease,
  `latest` otherwise. Version bumps are therefore releases; only bump
  deliberately.

## Things not to do

- Do not edit anything in `out/` — it is generated and git-ignored.
- Do not commit a `package.json` version bump as a drive-by; it publishes.
- Do not add a runtime dependency without also adding it to the externals-backing
  fields in `package.json`.
- Do not introduce new public exports without a barrel entry and a CHANGELOG line.
