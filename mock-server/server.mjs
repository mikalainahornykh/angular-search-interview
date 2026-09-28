import { createServer } from 'node:http';
import { MOCK_BACKEND as cfg } from './config.mjs';
import { USERS } from './users.mjs';

/**
 * Fake backend: a tiny Node HTTP server.
 * `ng serve` proxies /api/* to it (see proxy.conf.json), so requests are real
 * and show up in DevTools -> Network. Infrastructure code, not part of the task.
 *
 * GET /api/users?q=<string>  ->  User[]
 */
export function startMockServer() {
  const server = createServer((req, res) => {
    const url = new URL(req.url ?? '/', 'http://localhost');

    if (req.method !== 'GET' || url.pathname !== '/api/users') {
      res.writeHead(404).end();
      return;
    }

    const query = (url.searchParams.get('q') ?? '').trim().toLowerCase();
    const delay =
      Math.max(cfg.minDelayMs, cfg.maxDelayMs - query.length * cfg.delayStepPerCharMs) +
      Math.round(Math.random() * cfg.jitterMs);
    const shouldFail =
      query.includes(cfg.forceErrorKeyword) ||
      (query.length > 0 && Math.random() < cfg.randomErrorRate);

    const startedAt = Date.now();
    let finished = false;

    const timer = setTimeout(() => {
      finished = true;
      if (shouldFail) {
        send(res, 500, { message: 'Server temporarily unavailable' });
      } else {
        send(
          res,
          200,
          USERS.filter(
            (u) =>
              !query ||
              u.name.toLowerCase().includes(query) ||
              u.email.includes(query) ||
              u.city.toLowerCase().includes(query),
          ),
        );
      }
      log(query, shouldFail ? '500' : '200', Date.now() - startedAt);
    }, delay);

    // The browser aborted the request (e.g. switchMap unsubscribed).
    res.on('close', () => {
      if (!finished) {
        clearTimeout(timer);
        log(query, 'cancelled by client', Date.now() - startedAt);
      }
    });
  });

  server.listen(cfg.port, () => {
    console.log(`[mock-api] listening on http://localhost:${cfg.port}`);
  });
  return server;
}

function send(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(body));
}

function log(query, result, ms) {
  console.log(`[mock-api] GET /api/users?q="${query}" -> ${result} (${ms} ms)`);
}
