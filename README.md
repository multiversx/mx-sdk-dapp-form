# sdk-dapp-form

> A library that holds the core functional logic of a dapp on the MultiversX blockchain

[![NPM](https://img.shields.io/npm/v/@multiversx/sdk-dapp-form.svg)](https://www.npmjs.com/package/@multiversx/sdk-dapp-form)

## Table of contents

- [Installation](#installation)
- [Usage](#usage)
- [Consuming the package](#consuming-the-package)
- [Development](#development)
- [Project structure](#project-structure)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

## Installation

The library can be installed via npm or yarn.

```bash
npm install @multiversx/sdk-dapp-form
```

or

```bash
yarn add @multiversx/sdk-dapp-form
```

If you need only the sdk-dapp-form basic logic, without the additional UI, consider using the `--no-optional` flag.
This will not install the packages needed for the optional UI components.

```bash
npm install @multiversx/sdk-dapp-form --no-optional
```

or

```bash
yarn add @multiversx/sdk-dapp-form --no-optional
```

## Usage

sdk-dapp-form aims to abstract and simplify the process of formulating and validating transactions on the MultiversX blockchain.

It provides:

- **Form state** for a MultiversX transaction, built on Formik, wired through
  `SendFormContainer`.
- **Contexts** for each concern of the transaction — amount, receiver, gas,
  data field, tokens, network.
- **Validation** — Yup schemas, field-level validators and default error
  messages, plus validation of transactions arriving from the sign flow.
- **Operations** — pure helpers for gas limit, fees, data field and transaction
  generation.
- **Optional UI** — ready-made React fields, form and confirmation screens. These
  are the only part that needs the optional dependencies.

## Consuming the package

The package targets bundlers. Deep imports address a directory barrel at any depth:

```ts
import { useFetchGasLimit } from '@multiversx/sdk-dapp-form/out/hooks';
import { Receiver } from '@multiversx/sdk-dapp-form/out/UI/Fields';
import { Form } from '@multiversx/sdk-dapp-form';
```

Individual non-barrel files are not part of the public surface — import the barrel
that re-exports them. Component styles inject themselves on import, so no CSS import
is needed; the optional global theme is:

```ts
import '@multiversx/sdk-dapp-form/styles.css';
```

## Development

Requires **Node 24** (the version used by CI) and **pnpm**.

```bash
pnpm install
pnpm build       # vite library build + barrel shims + global stylesheet -> out/
pnpm watch       # incremental rebuild into out/
pnpm test        # jest (jsdom + testing-library + msw)
pnpm test:watch
pnpm lint        # eslint --fix src
pnpm lint:check  # eslint src, no writes
pnpm pre-pr      # lint + build + test — run before opening a pull request
```

Local integration with a consuming app:

```bash
pnpm publish-yalc        # yalc publish --push
pnpm publish-verdaccio   # publish to a local verdaccio registry
```

Source imports use the `src`-rooted path aliases declared in
`tsconfig.base.json` (`import { getTransactionFields } from 'helpers'`), not
relative traversal.

Conventions, build constraints and release rules are documented in
[AGENTS.md](./AGENTS.md).

## Project structure

| Path                                        | Contents                                                                              |
| ------------------------------------------- | ------------------------------------------------------------------------------------- |
| `src/apiCalls`                              | MultiversX API clients (account, addresses, economics, network, tokens, transactions) |
| `src/containers`                            | `SendFormContainer` — Formik plus all context providers                               |
| `src/contexts`                              | One context per form concern (amount, receiver, gas, data field, tokens, network)     |
| `src/operations`                            | Pure transaction math: gas limit, fees, data field, transaction generation            |
| `src/validation`, `src/validationSchema`    | Field validators, error messages and Yup schemas                                      |
| `src/validateSignTransactions`              | Validation of transactions coming from the sign flow                                  |
| `src/hooks`, `src/helpers`, `src/utilities` | Shared logic                                                                          |
| `src/UI`                                    | Optional React components                                                             |
| `src/types`, `src/constants`                | Shared types, enums and constants                                                     |
| `src/tests`, `src/__mocks__`                | Form-level tests and the MSW mock server                                              |

Directories that are part of the public surface expose an `index` barrel;
`src/index.ts` re-exports them.

## Roadmap

See the [open issues](https://github.com/multiversx/mx-sdk-dapp-form/issues) for a list of proposed features (and known issues).

## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

One can contribute by creating _pull requests_, or by opening _issues_ for discovered bugs or desired features.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Before opening the pull request:

- Run `pnpm pre-pr` (lint, build, tests).
- Add an entry under `## [Unreleased]` in [CHANGELOG.md](./CHANGELOG.md) — a CI
  check rejects pull requests without one.
- Fill in the pull request template.

## License

GPL-3.0-or-later
