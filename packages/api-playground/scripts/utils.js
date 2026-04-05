const { existsSync, mkdirSync, rmSync, readFileSync, writeFileSync } = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const DIST_DIR = './dist';
const TYPES_DIR = './types';
const SASS_BIN = 'sass';

function clean() {
  if (existsSync(DIST_DIR)) rmSync(DIST_DIR, { recursive: true });
  if (existsSync(TYPES_DIR)) rmSync(TYPES_DIR, { recursive: true });
  console.log('Cleaned dist and types');
}

function compileStyles({ compressed = false } = {}) {
  const destDir = path.join(DIST_DIR, 'styles');
  if (!existsSync(destDir)) {
    mkdirSync(destDir, { recursive: true });
  }

  const styleFlag = compressed ? ' --style=compressed' : '';
  try {
    execSync(`${SASS_BIN} src/styles/root.scss dist/styles/root.css --no-source-map${styleFlag}`, { encoding: 'utf-8' });
    execSync(`${SASS_BIN} src/styles/tailwind.scss dist/styles/tailwind.css --no-source-map${styleFlag}`, {
      encoding: 'utf-8',
    });
    console.log('Styles compiled');
  } catch (e) {
    console.error('SCSS compilation failed:', e.message);
    if (compressed) throw e;
  }
}

function combineStyles() {
  const rootCss = readFileSync(`${DIST_DIR}/styles/root.css`, 'utf-8');
  const tailwindCss = readFileSync(`${DIST_DIR}/styles/tailwind.css`, 'utf-8');
  writeFileSync(`${DIST_DIR}/index.css`, rootCss + '\n' + tailwindCss);
  console.log('Combined CSS into dist/index.css');
}

module.exports = { DIST_DIR, TYPES_DIR, clean, compileStyles, combineStyles };
