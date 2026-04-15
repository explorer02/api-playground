const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@explorer02/api-playground'],
  turbopack: {
    resolveAlias: {
      '~': path.resolve(__dirname, 'packages/api-playground/src'),
    },
    resolveConditions: ['source', 'import', 'require'],
  },
};

module.exports = nextConfig;
