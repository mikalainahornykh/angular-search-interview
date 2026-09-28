import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { startMockServer } from './server.mjs';

// `npm start` = `ng serve` + fake backend (ng serve proxies /api to it, see proxy.conf.json).
// The fake backend starts only after ng serve is up, so that online sandboxes
// (StackBlitz) open the preview for the Angular app, not for the API port.

const ngBin = createRequire(import.meta.url).resolve('@angular/cli/bin/ng.js');
const ng = spawn(process.execPath, [ngBin, 'serve', ...process.argv.slice(2)], {
  stdio: ['inherit', 'pipe', 'inherit'],
  env: { ...process.env, FORCE_COLOR: process.env.FORCE_COLOR ?? '1' },
});

let server;
ng.stdout.on('data', (chunk) => {
  process.stdout.write(chunk);
  // Strip ANSI color codes before looking for the "Local: http://..." line.
  if (!server && chunk.toString().replace(/\x1b\[[0-9;]*m/g, '').includes('Local:')) {
    server = startMockServer();
  }
});

ng.on('exit', (code) => {
  server?.close();
  process.exit(code ?? 0);
});
