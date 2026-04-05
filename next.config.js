const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@explorer02/api-playground'],
  webpack: config => {
    config.resolve.alias['~'] = path.resolve(__dirname, 'packages/api-playground/src');
    config.resolve.conditionNames = ['source', 'import', 'require', '...'];
    return config;
  },
};

module.exports = nextConfig;
