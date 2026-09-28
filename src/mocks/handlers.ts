import { HttpResponse, delay, http } from 'msw';
import { MOCK_BACKEND as cfg } from './config';
import { USERS } from './users.data';

/**
 * Fake backend powered by Mock Service Worker.
 * Requests are real HTTP requests intercepted by a service worker,
 * so they show up in DevTools -> Network as usual.
 * Infrastructure code, not part of the task.
 */
export const handlers = [
  http.get('/api/users', async ({ request }) => {
    const query = (new URL(request.url).searchParams.get('q') ?? '').trim().toLowerCase();

    await delay(
      Math.max(cfg.minDelayMs, cfg.maxDelayMs - query.length * cfg.delayStepPerCharMs) +
        Math.round(Math.random() * cfg.jitterMs),
    );

    const shouldFail =
      query.includes(cfg.forceErrorKeyword) ||
      (query.length > 0 && Math.random() < cfg.randomErrorRate);

    if (shouldFail) {
      return HttpResponse.json({ message: 'Server temporarily unavailable' }, { status: 500 });
    }

    return HttpResponse.json(
      USERS.filter(
        (u) =>
          !query ||
          u.name.toLowerCase().includes(query) ||
          u.email.includes(query) ||
          u.city.toLowerCase().includes(query),
      ),
    );
  }),
];
