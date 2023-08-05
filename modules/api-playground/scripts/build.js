const watch = require('fs').watch;

const execSync = require('child_process').execSync;

const output = execSync('yarn build', { encoding: 'utf-8' });

watch('./src', { recursive: true }, () => {
  try {
    execSync('yarn build', { encoding: 'utf-8', stdio: 'ignore' });
    console.log('Compiled Successfully!!');
  } catch {
    console.log('TS Errors!!');
  }
});
