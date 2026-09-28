import { MOCK_BACKEND as cfg } from './config.mjs';
import { USERS } from './users.mjs';

/**
 * Fake backend. It runs inside `ng serve` (see proxy.conf.mjs), so requests are
 * real HTTP requests and show up in DevTools -> Network.
 * Every request is also logged to the terminal.
 * Infrastructure code, not part of the task.
 *
 * GET /api/users?q=<string>  ->  User[]
 */
export function handleApiRequest(req, res) {
  const url = new URL(req.url ?? '/', 'http://localhost');

  if (req.method !== 'GET' || url.pathname !== '/api/users') {
    send(res, 404, { message: 'Not found' });
    return Promise.resolve();
  }

  const query = (url.searchParams.get('q') ?? '').trim().toLowerCase();
  const delay =
    Math.max(cfg.minDelayMs, cfg.maxDelayMs - query.length * cfg.delayStepPerCharMs) +
    Math.round(Math.random() * cfg.jitterMs);
  const shouldFail =
    query.includes(cfg.forceErrorKeyword) ||
    (query.length > 0 && Math.random() < cfg.randomErrorRate);
  const startedAt = Date.now();

  return new Promise((resolve) => {
    const timer = setTimeout(() => {
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
      resolve();
    }, delay);

    // The browser aborted the request (e.g. switchMap unsubscribed).
    res.on('close', () => {
      if (!res.writableEnded) {
        clearTimeout(timer);
        log(query, 'cancelled by client', Date.now() - startedAt);
        resolve();
      }
    });
  });
}

function send(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(body));
}

function log(query, result, ms) {
  console.log(`[mock-api] GET /api/users?q="${query}" -> ${result} (${ms} ms)`);
}
