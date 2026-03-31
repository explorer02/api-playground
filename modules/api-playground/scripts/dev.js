const { watch } = require('fs');
const { spawn } = require('child_process');
const { compileStyles, combineStyles } = require('./utils');

// Start tsup in watch mode (onSuccess in tsup.config.ts rebuilds styles after each TS build)
const tsup = spawn('tsup', ['--watch'], { stdio: 'inherit', shell: true });
tsup.on('error', err => console.error('tsup error:', err.message));

// Watch for SCSS-only changes (TS changes are handled by tsup's onSuccess)
watch('./src', { recursive: true }, (_, filename) => {
  if (filename && (filename.endsWith('.scss') || filename.endsWith('.css'))) {
    compileStyles();
    combineStyles();
  }
});

console.log('Watching for style changes...');
