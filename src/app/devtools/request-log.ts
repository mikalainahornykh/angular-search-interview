import { Injectable, computed, signal } from '@angular/core';

export type RequestStatus = 'pending' | 'success' | 'error' | 'cancelled';

export interface RequestLogEntry {
  id: number;
  query: string;
  status: RequestStatus;
  startedAt: number;
  durationMs?: number;
  /** The response arrived after a newer request had already been answered. */
  stale?: boolean;
}

/** Log of requests to the fake backend. Infrastructure code, not part of the task. */
@Injectable({ providedIn: 'root' })
export class RequestLog {
  private nextId = 1;
  private readonly _entries = signal<RequestLogEntry[]>([]);

  readonly entries = this._entries.asReadonly();
  readonly total = computed(() => this._entries().length);

  start(query: string): number {
    const id = this.nextId++;
    const entry: RequestLogEntry = { id, query, status: 'pending', startedAt: performance.now() };
    this._entries.update((list) => [entry, ...list].slice(0, 50));
    return id;
  }

  finish(id: number, status: Exclude<RequestStatus, 'pending'>): void {
    this._entries.update((list) => {
      // A newer request has already returned successfully -> this response is stale
      // and, if applied, would overwrite fresh data.
      const newerAlreadyAnswered = list.some((e) => e.id > id && e.status === 'success');
      return list.map((e) =>
        e.id === id
          ? {
              ...e,
              status,
              durationMs: Math.round(performance.now() - e.startedAt),
              stale: status === 'success' && newerAlreadyAnswered,
            }
          : e,
      );
    });
  }

  clear(): void {
    this._entries.set([]);
  }
}
