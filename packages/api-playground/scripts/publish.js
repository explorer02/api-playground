const { execSync } = require('child_process');
const { existsSync, writeFileSync, rmSync } = require('fs');
const path = require('path');

function parseToken(argv) {
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--token' || a === '-t') return argv[i + 1];
    if (a.startsWith('--token=')) return a.slice('--token='.length);
  }
  return process.env.NPM_TOKEN;
}

const NPMRC_PATH = path.resolve(__dirname, '..', '.npmrc');

function writeNpmrc(token) {
  // Restrict to user-only perms so the token isn't world-readable.
  writeFileSync(NPMRC_PATH, `//registry.npmjs.org/:_authToken=${token}\n`, { mode: 0o600 });
}

function cleanupNpmrc() {
  if (existsSync(NPMRC_PATH)) rmSync(NPMRC_PATH);
}

function publish() {
  const token = parseToken(process.argv.slice(2));
  if (!token) {
    console.error('Error: npm token is required. Pass --token <token> or set NPM_TOKEN.');
    process.exit(1);
  }

  try {
    console.log('Running build...');
    execSync('node ./scripts/build.js', { encoding: 'utf-8', stdio: 'inherit' });

    console.log('Publishing to npm...');
    writeNpmrc(token);
    execSync('npm publish --access public', { encoding: 'utf-8', stdio: 'inherit' });
    console.log('Publish Success!');
  } catch (e) {
    console.error('Publish failed:', e.message);
    process.exitCode = 1;
  } finally {
    cleanupNpmrc();
  }
}

publish();
