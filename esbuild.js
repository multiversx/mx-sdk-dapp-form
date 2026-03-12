const esbuild = require('esbuild');
const { esmConfig, cjsConfig } = require('./esbuild.config');

async function build() {
  try {
    await esbuild.build(esmConfig);
    console.log(
      '\x1b[36m%s\x1b[0m',
      `[${new Date().toLocaleTimeString()}] sdk-dapp-form ESM build succeeded`
    );

    await esbuild.build(cjsConfig);
    console.log(
      '\x1b[36m%s\x1b[0m',
      `[${new Date().toLocaleTimeString()}] sdk-dapp-form CJS build succeeded`
    );
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

build();
