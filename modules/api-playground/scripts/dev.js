const { watch, copyFileSync } = require('fs');
const { resolveTsPaths } = require('resolve-tspaths');
require('./build');

const srcDir = './src';
const distDir = './dist';

function copyCssFile(path) {
  copyFileSync(`${srcDir}/${path}`, `${distDir}/${path}`);
}

watch('./dist', { recursive: true }, (_, filename) => {
  if (filename.endsWith('.js')) {
    try {
      resolveTsPaths();
    } catch (e) {
      console.log(e.message);
    }
  }
});

watch('./src', { recursive: true }, (_, filename) => {
  if (filename.endsWith('.css')) {
    try {
      copyCssFile(filename);
    } catch (e) {
      console.log(e.message);
    }
  }
});
