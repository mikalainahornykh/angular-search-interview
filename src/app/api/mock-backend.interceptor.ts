import { HttpErrorResponse, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { RequestLog } from '../devtools/request-log';
import { MOCK_BACKEND as cfg } from './mock-backend.config';
import { USERS } from './users.data';

/**
 * Fake backend: intercepts GET /api/users and responds from memory
 * with an artificial delay and random errors.
 * Infrastructure code, not part of the task.
 */
export const mockBackendInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.method !== 'GET' || !req.url.endsWith('/api/users')) {
    return next(req);
  }

  const log = inject(RequestLog);
  const query = (req.params.get('q') ?? '').trim().toLowerCase();

  return new Observable((subscriber) => {
    const id = log.start(query);
    let done = false;

    const delay =
      Math.max(cfg.minDelayMs, cfg.maxDelayMs - query.length * cfg.delayStepPerCharMs) +
      Math.round(Math.random() * cfg.jitterMs);

    const shouldFail =
      query.includes(cfg.forceErrorKeyword) ||
      (query.length > 0 && Math.random() < cfg.randomErrorRate);

    const timer = setTimeout(() => {
      done = true;
      if (shouldFail) {
        log.finish(id, 'error');
        subscriber.error(
          new HttpErrorResponse({
            status: 500,
            statusText: 'Internal Server Error',
            url: req.urlWithParams,
            error: { message: 'Server temporarily unavailable' },
          }),
        );
        return;
      }

      const body = USERS.filter(
        (u) =>
          !query ||
          u.name.toLowerCase().includes(query) ||
          u.email.includes(query) ||
          u.city.toLowerCase().includes(query),
      );
      log.finish(id, 'success');
      subscriber.next(new HttpResponse({ status: 200, body, url: req.urlWithParams }));
      subscriber.complete();
    }, delay);

    // Unsubscribing before the response = cancelled request (like abort for a real XHR/fetch).
    return () => {
      if (!done) {
        clearTimeout(timer);
        log.finish(id, 'cancelled');
      }
    };
  });
};
