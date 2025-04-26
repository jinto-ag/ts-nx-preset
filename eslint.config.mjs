import baseConfig from './eslint.base.config.mjs';

export default [
  {
    ignores: [
      '**/dist',
      '.nx/**',
      '**/vite.config.*.timestamp*',
      '**/vitest.config.*.timestamp*',
    ],
  },
  ...baseConfig,
];
