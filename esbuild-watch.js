const esbuild = require('esbuild');
const { esmConfig } = require('./esbuild.config');

esbuild
  .build({
    ...esmConfig,
    minify: false,
    define: {
      ...esmConfig.define,
      'process.env.NODE_ENV': '"development"'
    },
    watch: {
      onRebuild(error) {
        if (error) {
          console.error('Watch build failed:', error);
        } else {
          console.log(
            '\x1b[36m%s\x1b[0m',
            `[${new Date().toLocaleTimeString()}] sdk-dapp-form rebuild succeeded`
          );
        }
      }
    }
  })
  .catch(() => process.exit(1));
