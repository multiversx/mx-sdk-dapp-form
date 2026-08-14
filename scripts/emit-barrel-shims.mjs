import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { basename, join } from 'node:path';

/**
 * `exports` patterns resolve a subpath to exactly one target and Node performs no
 * existence-based fallback, so `./out/*` cannot serve both `out/types/enums`
 * (a module) and `out/UI/Fields/AmountSelect` (a directory barrel).
 *
 * The wildcard is pointed at modules, and this script gives every barrel
 * directory a sibling module that re-exports it, so both subpath shapes keep
 * resolving through the single pattern.
 */
const outdir = new URL('../out/', import.meta.url).pathname;

const hasDefaultExport = (dir) =>
  /(^|\n)export default |as default[,\s}]/.test(
    readFileSync(join(dir, 'index.d.ts'), 'utf8')
  );

const emitShims = (dir) => {
  const name = basename(dir);
  const withDefault = hasDefaultExport(dir);

  writeFileSync(
    `${dir}.mjs`,
    `export * from './${name}/index.mjs';\n` +
      (withDefault ? `export { default } from './${name}/index.mjs';\n` : '')
  );
  writeFileSync(`${dir}.cjs`, `module.exports = require('./${name}/index.cjs');\n`);
  writeFileSync(
    `${dir}.d.ts`,
    `export * from './${name}/index';\n` +
      (withDefault ? `export { default } from './${name}/index';\n` : '')
  );
};

let count = 0;

const walk = (dir) => {
  const entries = readdirSync(dir, { withFileTypes: true });

  for (const entry of entries.filter((entry) => entry.isDirectory())) {
    // `_virtual` holds Rollup's internal chunks and is never a public subpath.
    if (entry.name.startsWith('_')) {
      continue;
    }

    const child = join(dir, entry.name);
    walk(child);

    const isBarrel = readdirSync(child).includes('index.mjs');
    const collides = entries.some((sibling) =>
      ['.mjs', '.cjs', '.d.ts'].some(
        (extension) => sibling.name === `${entry.name}${extension}`
      )
    );

    if (!isBarrel) {
      continue;
    }

    if (collides) {
      throw new Error(
        `Cannot emit a barrel shim for ${child}: a module of the same name already exists beside it.`
      );
    }

    emitShims(child);
    count++;
  }
};

walk(outdir);

console.log(`Emitted barrel shims for ${count} directories.`);
