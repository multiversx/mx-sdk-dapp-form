import { globSync } from 'tinyglobby';
import { defineConfig } from 'vite';
import cssInjectedByJs from 'vite-plugin-css-injected-by-js';
import dts from 'vite-plugin-dts';
import svgr from 'vite-plugin-svgr';
import pkg from './package.json' with { type: 'json' };

const basedir = 'src';
const outdir = 'out';

/**
 * Tests, stories and mocks never reach the published package.
 */
const excludeFromBuild =
  /(\/tests\/|\/stories\/|\/__mocks__\/|\/__tests__\/|\.test\.|\.spec\.|\.jest\.|\.playwright\.|\.puppeteer\.|-mock\.)/;

const entryPoints = globSync(`${basedir}/**/*.{ts,tsx}`).filter(
  (file) => !excludeFromBuild.test(file) && !file.endsWith('.d.ts')
);

const externalPackages = [
  ...Object.keys(pkg.dependencies),
  ...Object.keys(pkg.peerDependencies),
  ...Object.keys(pkg.optionalDependencies)
];

const isExternal = (id: string) =>
  /^node:/.test(id) ||
  externalPackages.some((name) => id === name || id.startsWith(`${name}/`));

const sharedOutput = {
  dir: outdir,
  preserveModules: true,
  preserveModulesRoot: basedir,
  exports: 'named'
} as const;

export default defineConfig({
  plugins: [
    svgr({ include: '**/*.svg' }),
    cssInjectedByJs({ relativeCSSInjection: true }),
    dts({
      tsconfigPath: './tsconfig.build.json',
      entryRoot: basedir,
      outDir: outdir
    })
  ],
  resolve: {
    tsconfigPaths: true
  },
  css: {
    preprocessorOptions: {
      scss: {
        loadPaths: [`./${basedir}`, 'node_modules'],
        silenceDeprecations: ['import', 'global-builtin', 'legacy-js-api']
      }
    },
    modules: {
      localsConvention: 'dashes',
      // Shipped in consumer markup — do not change.
      generateScopedName: 'dapp-core-component__[name]__[local]'
    }
  },
  build: {
    outDir: outdir,
    emptyOutDir: true,
    target: 'es2021',
    minify: true,
    sourcemap: true,
    cssCodeSplit: true,
    lib: {
      entry: entryPoints,
      formats: ['es', 'cjs']
    },
    rollupOptions: {
      external: isExternal,
      output: [
        { ...sharedOutput, format: 'es', entryFileNames: '[name].mjs' },
        { ...sharedOutput, format: 'cjs', entryFileNames: '[name].cjs' }
      ]
    }
  }
});
