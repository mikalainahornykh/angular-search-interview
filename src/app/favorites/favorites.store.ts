import { Injectable, inject, signal } from '@angular/core';
import { FavoritesApi } from '../api/favorites.api';

/**
 * Task 3: favorites (see TASK.md).
 * Holds the ids of favorite users and syncs changes with the server.
 */
@Injectable({ providedIn: 'root' })
export class FavoritesStore {
  private readonly api = inject(FavoritesApi);

  private readonly ids = signal<ReadonlySet<number>>(new Set());

  constructor() {
    this.api.getAll().subscribe((ids) => this.ids.set(new Set(ids)));
  }

  isFavorite(userId: number): boolean {
    return this.ids().has(userId);
  }

  toggle(userId: number): void {
    const next = !this.isFavorite(userId);

    // optimistic update: the star reacts instantly
    this.setLocal(userId, next);

    this.api.set(userId, next).subscribe({
      // rollback if the server failed
      error: () => this.setLocal(userId, !this.isFavorite(userId)),
    });
  }

  private setLocal(userId: number, value: boolean): void {
    this.ids.update((ids) => {
      const copy = new Set(ids);
      if (value) {
        copy.add(userId);
      } else {
        copy.delete(userId);
      }
      return copy;
    });
  }
}
