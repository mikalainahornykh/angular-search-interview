import { MOCK_BACKEND as cfg } from './config.mjs';
import { USERS } from './users.mjs';

/**
 * Fake backend. It runs inside `ng serve` (see proxy.conf.mjs), so requests are
 * real HTTP requests and show up in DevTools -> Network.
 * Every request is also logged to the terminal.
 * Infrastructure code, not part of the task.
 *
 * GET /api/users?q=<string>            ->  User[]
 * GET /api/favorites                   ->  number[]  (ids of favorite users)
 * PUT /api/users/:id/favorite {value}  ->  { id, value }
 */

/** Server-side favorites state. Lives while `ng serve` is running. */
const favorites = new Set(cfg.favorites.initial);

export async function handleApiRequest(req, res) {
  const url = new URL(req.url ?? '/', 'http://localhost');
  const startedAt = Date.now();
  const label = `${req.method} ${url.pathname}${url.search}`;

  if (req.method === 'GET' && url.pathname === '/api/users') {
    return searchUsers(url, res, label, startedAt);
  }
  if (req.method === 'GET' && url.pathname === '/api/favorites') {
    return respondLater(res, 300, label, startedAt, {}, () => [200, [...favorites].sort((a, b) => a - b)]);
  }
  const favoriteMatch = url.pathname.match(/^\/api\/users\/(\d+)\/favorite$/);
  if (req.method === 'PUT' && favoriteMatch) {
    return setFavorite(Number(favoriteMatch[1]), req, res, label, startedAt);
  }

  send(res, 404, { message: 'Not found' });
  log(label, '404', Date.now() - startedAt);
}

function searchUsers(url, res, label, startedAt) {
  const s = cfg.search;
  const query = (url.searchParams.get('q') ?? '').trim().toLowerCase();
  const delay = s.minDelayMs + Math.round(Math.random() * (s.maxDelayMs - s.minDelayMs));
  const shouldFail =
    query.includes(s.forceErrorKeyword) || (query.length > 0 && Math.random() < s.randomErrorRate);

  return respondLater(res, delay, label, startedAt, {}, () =>
    shouldFail
      ? [500, { message: 'Server temporarily unavailable' }]
      : [
          200,
          USERS.filter(
            (u) =>
              !query ||
              u.name.toLowerCase().includes(query) ||
              u.email.includes(query) ||
              u.city.toLowerCase().includes(query),
          ),
        ],
  );
}

async function setFavorite(id, req, res, label, startedAt) {
  const f = cfg.favorites;
  const body = await readJson(req);
  const value = body?.value;

  if (typeof value !== 'boolean' || !USERS.some((u) => u.id === id)) {
    send(res, 400, { message: 'Expected body { "value": true | false } and an existing user id' });
    log(label, '400', Date.now() - startedAt);
    return;
  }

  const delay = value ? f.setTrueDelayMs : f.setFalseDelayMs;
  // Like a real server, the write happens even if the client cancels the request.
  return respondLater(res, delay, `${label} value=${value}`, startedAt, { runIfAborted: true }, () => {
    if (value && id === f.cannotBeFavoriteUserId) {
      return [500, { message: 'This user cannot be added to favorites' }];
    }
    // The value is applied when the server responds, not when the request arrives.
    value ? favorites.add(id) : favorites.delete(id);
    return [200, { id, value }];
  });
}

/**
 * Waits `delay` ms, then sends the response returned by `produce`.
 * If the client aborts first, the work is skipped, unless `runIfAborted` is set.
 */
function respondLater(res, delay, label, startedAt, { runIfAborted = false }, produce) {
  return new Promise((resolve) => {
    let aborted = false;

    const timer = setTimeout(() => {
      const [status, body] = produce();
      if (aborted) {
        log(label, `${status} (client already cancelled, change applied anyway)`, Date.now() - startedAt);
        return;
      }
      send(res, status, body);
      log(label, String(status), Date.now() - startedAt);
      resolve();
    }, delay);

    res.on('close', () => {
      if (!res.writableEnded) {
        aborted = true;
        if (!runIfAborted) {
          clearTimeout(timer);
          log(label, 'cancelled by client', Date.now() - startedAt);
        }
        resolve();
      }
    });
  });
}

function readJson(req) {
  return new Promise((resolve) => {
    let raw = '';
    req.on('data', (chunk) => (raw += chunk));
    req.on('end', () => {
      try {
        resolve(JSON.parse(raw || 'null'));
      } catch {
        resolve(null);
      }
    });
  });
}

function send(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(body));
}

function log(label, result, ms) {
  console.log(`[mock-api] ${label} -> ${result} (${ms} ms)`);
}
