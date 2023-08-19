const { watch, existsSync, mkdirSync, copyFileSync } = require('fs');
const path = require('path');
const glob = require('glob');
const { execSync } = require('child_process');

const { resolveTsPaths } = require('resolve-tspaths');

const srcDir = './src';
const distDir = './dist';

function copyAllCssFiles() {
  const cssFiles = glob.sync(`${srcDir}/**/*.css`);

  cssFiles.forEach(cssFile => {
    const relativePath = path.relative(srcDir, cssFile);
    const destFile = path.join(distDir, relativePath);

    const destDir = path.dirname(destFile);

    if (!existsSync(destDir)) {
      mkdirSync(destDir, { recursive: true });
    }

    copyFileSync(cssFile, destFile);
  });
  console.log(`Copied ${cssFiles.length} css files`);
}

const build = async () => {
  try {
    execSync('yarn tsc', { encoding: 'utf-8' });
    await resolveTsPaths();
    copyAllCssFiles();
    console.log('Build Success!');
  } catch (e) {
    console.log(e.message);
  }
};

build();
