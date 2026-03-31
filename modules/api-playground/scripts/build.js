const { execSync } = require('child_process');
const { resolveTsPaths } = require('resolve-tspaths');
const { DIST_DIR, clean, compileStyles, combineStyles } = require('./utils');

function purgeTailwind() {
  execSync(
    `purgecss --css ${DIST_DIR}/styles/tailwind.css --content "${DIST_DIR}/**/*.{js,mjs,cjs}" --output ${DIST_DIR}/styles`,
    {
      encoding: 'utf-8',
    }
  );
  console.log('Tailwind CSS purged');
}

const build = async () => {
  try {
    // Step 0: Clean previous build artifacts
    clean();

    // Step 1: Run tsup (JS bundling + minification)
    console.log('Building with tsup...');
    execSync('tsup', { encoding: 'utf-8', stdio: 'inherit' });

    // Step 2: Generate declaration files (tsup dts fails with path aliases)
    console.log('Generating type declarations...');
    execSync('tsc --declaration --emitDeclarationOnly --outDir ./types', { encoding: 'utf-8' });
    await resolveTsPaths({ out: './types' });
    console.log('Type declarations generated');

    // Step 3: Compile SCSS → CSS
    compileStyles({ compressed: true });

    // Step 4: Purge unused Tailwind CSS
    purgeTailwind();

    // Step 5: Combine CSS into dist/index.css (replaces tsup's bundled CSS)
    combineStyles();

    console.log('Build Success!');
  } catch (e) {
    console.error('Build failed:', e.message);
    process.exit(1);
  }
};

build();
