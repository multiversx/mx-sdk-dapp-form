import js from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import jestPlugin from 'eslint-plugin-jest';
import prettierPlugin from 'eslint-plugin-prettier';
import reactPlugin from 'eslint-plugin-react';
import globals from 'globals';
import tseslint from 'typescript-eslint';

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    ignores: [
      'build/**',
      'dist/**',
      'out/**',
      'out-esm/**',
      'out-cjs/**',
      'node_modules/**',
      '.snapshots/**',
      '**/*.min.js',
      'src/setupTests.js'
    ]
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  reactPlugin.configs.flat.recommended,
  {
    files: ['**/*.{js,mjs,cjs,ts,tsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest
      },
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
        project: './tsconfig.json'
      }
    },
    plugins: {
      import: importPlugin,
      jest: jestPlugin,
      prettier: prettierPlugin
    },
    settings: {
      'import/parsers': {
        '@typescript-eslint/parser': ['.ts', '.tsx']
      },
      'import/resolver': {
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
          moduleDirectory: ['node_modules', 'src/']
        },
        typescript: {
          alwaysTryTypes: true
        }
      },
      react: {
        pragma: 'React',
        version: 'detect'
      }
    },
    rules: {
      'import/order': [
        'warn',
        {
          groups: ['builtin', 'external', 'internal'],
          pathGroups: [
            { pattern: 'react', group: 'external', position: 'before' }
          ],
          pathGroupsExcludedImportTypes: ['react'],
          'newlines-between': 'ignore',
          alphabetize: { order: 'asc', caseInsensitive: true }
        }
      ],
      'prettier/prettier': ['error', { endOfLine: 'lf' }],
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            '@mui/*/*/*',
            '!@mui/material/test-utils/*',
            '!@mui/material/styles/*',
            '!@mui/styles/*'
          ]
        }
      ],
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_'
        }
      ],
      '@typescript-eslint/no-shadow': 'off',
      'react/jsx-one-expression-per-line': 'off',
      'react/prop-types': 'off',
      'react/jsx-props-no-spreading': 'off',
      'react/require-default-props': 'off',
      'react/display-name': 'off',
      'react/jsx-curly-newline': 'off',
      'react/jsx-wrap-multilines': 'off',
      'react/destructuring-assignment': 'off',
      'react/no-array-index-key': 'off',
      // Explicit Boolean(...) in a condition is a deliberate readability choice here.
      'no-extra-boolean-cast': 'off',
      'linebreak-style': ['error', 'unix'],
      quotes: ['error', 'single'],
      semi: ['error', 'always'],
      'object-curly-newline': 'off',
      'arrow-body-style': 'off',
      'implicit-arrow-linebreak': 'off',
      'func-names': 'off',
      'operator-linebreak': 'off',
      'function-paren-newline': 'off',
      'no-shadow': 'off'
    }
  },
  // Prettier last: turns off every stylistic rule the formatter owns.
  {
    rules: (await import('eslint-config-prettier')).default.rules
  }
];
