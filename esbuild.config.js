const svgrPlugin = require('esbuild-plugin-svgr');
const glob = require('glob');
const { replace } = require('esbuild-plugin-replace');
const plugin = require('node-stdlib-browser/helpers/esbuild/plugin');
const stdLibBrowser = require('node-stdlib-browser');
const { nodeExternalsPlugin } = require('esbuild-node-externals');
const { sassPlugin, postcssModules } = require('esbuild-sass-plugin');

const basedir = 'src';

const files = glob
  .sync('{./src/**/*.tsx,./src/**/*.ts,./src/**/*.scss}')
  .filter(
    (file) =>
      !file.includes('/tests/') &&
      !file.includes('/stories/') &&
      !file.includes('.test.') &&
      !file.endsWith('.d.ts')
  );

const commonConfig = {
  entryPoints: files,
  bundle: true,
  sourcemap: true,
  treeShaking: true,
  platform: 'node',
  inject: [require.resolve('node-stdlib-browser/helpers/esbuild/shim')],
  define: {
    global: 'global',
    process: 'process',
    Buffer: 'Buffer',
    'process.env.NODE_ENV': '"production"'
  },
  plugins: [
    svgrPlugin(),
    plugin(stdLibBrowser),
    nodeExternalsPlugin(),
    sassPlugin({
      loadPaths: [`./${basedir}`, 'node_modules'],
      basedir,
      transform: postcssModules({
        basedir,
        localsConvention: 'dashes',
        generateScopedName: 'dapp-core-component__[name]__[local]'
      })
    }),
    replace({
      __sdkDappVersion: process.env.npm_package_version
    })
  ]
};

const esmConfig = {
  ...commonConfig,
  minify: true,
  splitting: true,
  format: 'esm',
  outdir: 'out',
  chunkNames: '__chunks__/[name]-[hash]',
  target: ['es2021'],
  outExtension: { '.js': '.mjs' },
  tsconfig: './tsconfig.esm.json'
};

const cjsConfig = {
  ...commonConfig,
  minify: true,
  splitting: false,
  format: 'cjs',
  outdir: 'out',
  target: ['es2021'],
  outExtension: { '.js': '.cjs' },
  tsconfig: './tsconfig.cjs.json'
};

module.exports = { commonConfig, esmConfig, cjsConfig };
