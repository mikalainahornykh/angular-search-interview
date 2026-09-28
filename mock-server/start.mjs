import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { startMockServer } from './server.mjs';

// `npm start` = fake backend + `ng serve` (which proxies /api to the fake backend).
const server = startMockServer();

const ngBin = createRequire(import.meta.url).resolve('@angular/cli/bin/ng.js');
const ng = spawn(process.execPath, [ngBin, 'serve', ...process.argv.slice(2)], { stdio: 'inherit' });

ng.on('exit', (code) => {
  server.close();
  process.exit(code ?? 0);
});
