import nodeConfig from '@repo/eslint-config/node';

export default [
  { ignores: ['dist', 'node_modules', 'drizzle'] },
  ...nodeConfig,
];
