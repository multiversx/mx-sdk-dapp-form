# sdk-dapp-form

> A library that holds the core functional logic of a dapp on the MultiversX blockchain

[![NPM](https://img.shields.io/npm/v/@multiversx/sdk-dapp-form.svg)](https://www.npmjs.com/package/@multiversx/sdk-dapp-form) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

# Installation

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

# Usage

sdk-dapp-form aims to abstract and simplify the process of formulating and validating transactions on the MultiversX blockchain.

## Development

Requires **Node 24** (see `.nvmrc`) and **pnpm** (pinned via `packageManager`; run
`corepack enable` to pick it up).

```bash
pnpm install
pnpm build     # vite library build + global stylesheet -> out/
pnpm watch     # incremental rebuild into out/
pnpm test
pnpm lint
```

### Consuming the package

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

## Roadmap

See the [open issues](https://github.com/@multiversx/sdk-dapp-form/issues) for a list of proposed features (and known issues).

## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

One can contribute by creating _pull requests_, or by opening _issues_ for discovered bugs or desired features.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

GPL-3.0-or-later
