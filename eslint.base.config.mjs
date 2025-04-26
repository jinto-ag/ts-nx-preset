import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import nxEslintPlugin from '@nx/eslint-plugin';
import tsEslintPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import importPlugin from 'eslint-plugin-import';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import perfPlugin from 'eslint-plugin-perf-standard';
import prettierPlugin from 'eslint-plugin-prettier';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import securityPlugin from 'eslint-plugin-security';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

export default [
  // Global ignores for build artifacts and temporary files
  {
    ignores: [
      '**/dist',
      '**/build',
      '.nx/**',
      '**/coverage',
      '**/node_modules',
      '**/.next',
      '**/.turbo',
      '**/*.generated.*',
      '**/pnpm-lock.yaml',
    ],
  },
  // Base plugins and settings for all files
  {
    plugins: {
      '@nx': nxEslintPlugin,
      import: importPlugin,
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      'jsx-a11y': jsxA11yPlugin,
      '@typescript-eslint': tsEslintPlugin,
      prettier: prettierPlugin,
      security: securityPlugin,
      'perf-standard': perfPlugin,
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
  },
  // General rules for all JS/TS files
  {
    files: [
      '**/*.ts',
      '**/*.tsx',
      '**/*.js',
      '**/*.jsx',
      '**/*.cts',
      '**/*.mts',
    ],
    rules: {
      // Nx-specific rules
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: [],
          depConstraints: [
            {
              sourceTag: '*',
              onlyDependOnLibsWithTags: ['*'],
            },
          ],
        },
      ],
      '@nx/dependency-checks': [
        'error',
        {
          ignoredDependencies: ['tslib'],
          checkMissingDependencies: true,
          checkVersionMismatches: true,
          checkObsoleteDependencies: true,
        },
      ],
      // Import rules
      'import/no-cycle': 'error',
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            ['parent', 'sibling'],
            'index',
          ],
          pathGroups: [
            {
              pattern: '@ts-nx-preset/**',
              group: 'internal',
              position: 'before',
            },
            {
              pattern: '@ts-nx-preset/**',
              group: 'internal',
              position: 'before',
            },
          ],
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
          'newlines-between': 'always',
        },
      ],
      'import/no-extraneous-dependencies': [
        'error',
        {
          devDependencies: [
            '**/*.spec.*',
            '**/*.test.*',
            '**/vite.config.*',
            '**/vitest.config.*',
            '**/rollup.config.*',
            '**/jest.config.*',
            '**/webpack.config.*',
            '**/eslint.config.*',
          ],
        },
      ],
      'import/no-unused-modules': 'warn',
      // General JS/TS rules
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-duplicate-imports': 'error',
      eqeqeq: ['error', 'always', { null: 'ignore' }],
      'no-var': 'error',
      'prefer-const': 'error',
      'no-unused-expressions': [
        'error',
        { allowShortCircuit: true, allowTernary: true },
      ],
      // Security rules
      'security/detect-object-injection': 'warn',
      'security/detect-unsafe-regex': 'error',
      // Performance rules (replaced invalid rules)
      // 'perf-standard/no-excessive-nesting': 'warn',
      // 'perf-standard/no-excessive-loops': 'warn',
    },
  },
  // TypeScript-specific rules with type checking
  {
    files: [
      '**/src/**/*.ts',
      '**/src/**/*.tsx',
      'libs/**/*.ts',
      'libs/**/*.tsx',
      'apps/**/*.ts',
      'apps/**/*.tsx',
    ],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: [
          './tsconfig.base.json',
          './libs/*/tsconfig.json',
          './apps/*/tsconfig.json',
        ],
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'separate-type-imports' },
      ],
      '@typescript-eslint/no-unnecessary-condition': 'warn',
      '@typescript-eslint/prefer-nullish-coalescing': 'error',
      '@typescript-eslint/prefer-optional-chain': 'error',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      '@typescript-eslint/no-empty-object-type': 'error',
      '@typescript-eslint/prefer-enum-initializers': 'error',
      '@typescript-eslint/no-unsafe-assignment': 'warn',
      '@typescript-eslint/no-unsafe-call': 'warn',
      '@typescript-eslint/no-unsafe-member-access': 'warn',
      '@typescript-eslint/no-unsafe-return': 'warn',
    },
  },
  // Nx TypeScript configuration
  ...compat
    .config({
      extends: ['plugin:@nx/typescript'],
    })
    .map(config => ({
      ...config,
      files: ['**/*.ts', '**/*.tsx', '**/*.cts', '**/*.mts'],
      rules: {
        ...config.rules,
      },
    })),
  // Nx JavaScript configuration
  ...compat
    .config({
      extends: ['plugin:@nx/javascript'],
    })
    .map(config => ({
      ...config,
      files: ['**/*.js', '**/*.jsx', '**/*.cjs', '**/*.mjs'],
      rules: {
        ...config.rules,
      },
    })),
  // Import plugin for TypeScript
  ...compat
    .config({
      extends: ['plugin:import/typescript'],
    })
    .map(config => ({
      ...config,
      files: ['**/*.ts', '**/*.tsx', '**/*.cts', '**/*.mts'],
      rules: {
        ...config.rules,
      },
    })),
  // React-specific rules
  ...compat
    .config({
      extends: [
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
        'plugin:jsx-a11y/recommended',
      ],
    })
    .map(config => ({
      ...config,
      files: ['**/*.tsx', '**/*.jsx'],
      languageOptions: {
        parserOptions: {
          ecmaFeatures: {
            jsx: true,
          },
        },
      },
      settings: {
        react: {
          version: 'detect',
        },
      },
      rules: {
        ...config.rules,
        'react/prop-types': 'off',
        'react/jsx-uses-react': 'off',
        'react/react-in-jsx-scope': 'off',
        'react/jsx-filename-extension': [
          'error',
          { extensions: ['.jsx', '.tsx'] },
        ],
        'react/function-component-definition': [
          'error',
          {
            namedComponents: 'arrow-function',
            unnamedComponents: 'arrow-function',
          },
        ],
        'react/display-name': 'off',
        'react/jsx-handler-names': [
          'warn',
          {
            eventHandlerPrefix: 'handle',
            eventHandlerPropPrefix: 'on',
          },
        ],
        'react/jsx-fragments': ['error', 'syntax'],
        'react/jsx-no-useless-fragment': ['error', { allowExpressions: true }],
        'react/jsx-curly-brace-presence': [
          'error',
          { props: 'never', children: 'never', propElementValues: 'always' },
        ],
        'react/jsx-sort-props': [
          'warn',
          {
            callbacksLast: true,
            shorthandFirst: true,
            reservedFirst: true,
            multiline: 'last',
          },
        ],
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'warn',
        'react/no-danger': 'error',
        'react/jsx-no-target-blank': [
          'error',
          { enforceDynamicLinks: 'always' },
        ],
        'jsx-a11y/alt-text': 'error',
        'jsx-a11y/no-autofocus': 'warn',
        'jsx-a11y/anchor-is-valid': 'error',
        'jsx-a11y/control-has-associated-label': 'warn',
      },
    })),
  // Prettier integration
  ...[eslintPluginPrettierRecommended],
  // Test-specific rules
  ...compat
    .config({
      env: {
        jest: true,
        vitest: true,
      },
    })
    .map(config => ({
      ...config,
      files: [
        '**/*.spec.ts',
        '**/*.spec.tsx',
        '**/*.spec.js',
        '**/*.spec.jsx',
        '**/*.test.ts',
        '**/*.test.tsx',
      ],
      rules: {
        ...config.rules,
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-empty-function': 'off',
      },
    })),
  // Server-side (SSR) specific rules
  {
    files: [
      '**/server/**/*.{ts,tsx,js,jsx}',
      '**/ssr/**/*.{ts,tsx,js,jsx}',
      '**/*.server.{ts,tsx,js,jsx}',
    ],
    rules: {
      'no-restricted-globals': [
        'error',
        'window',
        'document',
        'localStorage',
        'sessionStorage',
      ],
      'react-hooks/rules-of-hooks': 'error',
      '@typescript-eslint/no-require-imports': 'error',
    },
  },
];
