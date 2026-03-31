import { defineConfig } from 'tsup';

export default defineConfig(options => ({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: false,
  splitting: false,
  sourcemap: true,
  clean: true,
  onSuccess: options.watch ? 'node scripts/buildStyles.js' : undefined,
  minify: true,
  external: [
    'react',
    'react-dom',
    '@apollo/client',
    'graphql',
    '@monaco-editor/react',
    'react-icons',
    'react-use',
    'rtl-css-js',
  ],
  esbuildOptions(options) {
    options.jsx = 'automatic';
  },
}));
