const { watch, existsSync, mkdirSync, copyFileSync } = require('fs');
const path = require('path');
const glob = require('glob');
const { execSync } = require('child_process');

const srcDir = './src';
const distDir = './dist';

function copyCssFiles() {
  const cssFiles = glob.sync(`${srcDir}/**/*.css`);

  cssFiles.forEach(cssFile => {
    const relativePath = path.relative(srcDir, cssFile);
    const destFile = path.join(distDir, relativePath);

    const destDir = path.dirname(destFile);

    if (!existsSync(destDir)) {
      mkdirSync(destDir, { recursive: true });
    }

    copyFileSync(cssFile, destFile);
    console.log(`Copied: ${cssFile} -> ${destFile}`);
  });
}

const buildFn = () => {
  try {
    execSync('yarn build', { encoding: 'utf-8' });
    copyCssFiles();
    console.log('Build Success!');
  } catch (e) {
    console.log(e.message);
  }
};

watch('./dist', { recursive: true }, () => {
  execSync('yarn resolve-path', { encoding: 'utf-8' });
});

watch('./src', { recursive: true }, () => {
  try {
    copyCssFiles();
  } catch (e) {
    console.log(e.message);
  }
});

buildFn();
