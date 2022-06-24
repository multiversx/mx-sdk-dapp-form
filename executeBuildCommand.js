const svgrPlugin = require('esbuild-plugin-svgr');
const esbuild = require('esbuild');
const glob = require('glob');
const plugin = require('node-stdlib-browser/helpers/esbuild/plugin');
const stdLibBrowser = require('node-stdlib-browser');
const { nodeExternalsPlugin } = require('esbuild-node-externals');
const { sassPlugin, postcssModules } = require('esbuild-sass-plugin');
const path = require('path');

const basedir = 'src';

function createSassImporter({ basedir = process.cwd() }) {
  const opts = { basedir, extensions: ['.scss', '.sass', '.css'] };

  return function importer(url, prev) {
    if (url.startsWith('~')) {
      url = url.slice(1);
    }
    return { file: resolve.sync(url, opts) };
  };
}

module.exports = function executeBuildCommand(customOptions = {}) {
  glob(
    '{./src/UI/index.tsx,./src/index.tsx,./src/**/*.scss}',
    function (err, files) {
      if (err) {
        console.log('error reading files', err);
      }

      esbuild
        .build({
          entryPoints: files,
          outdir: 'dist',
          treeShaking: true,
          minify: true,
          bundle: true,
          sourcemap: true,
          splitting: true,
          chunkNames: '__chunks__/[name]-[hash]',
          format: 'esm',
          target: ['es2015'],
          tsconfig: './tsconfig.json',
          platform: 'node',
          inject: [require.resolve('node-stdlib-browser/helpers/esbuild/shim')],
          define: {
            global: 'global',
            process: 'process',
            Buffer: 'Buffer',
            'process.env.NODE_ENV': `"production"`
          },
          plugins: [
            sassPlugin({
              loadPaths: [
                `./${basedir}`,
                'node_modules'
                // path.resolve(__dirname, 'node_modules/bootstrap/scss')
              ],
              basedir,
              // quietDeps: true,
              cssImports: true,
              transform: postcssModules({
                basedir,
                localsConvention: 'dashes'
              })
            }),
            svgrPlugin(),
            plugin(stdLibBrowser),
            nodeExternalsPlugin()
          ],
          ...customOptions
        })
        .catch(() => process.exit(1));
    }
  );
};
