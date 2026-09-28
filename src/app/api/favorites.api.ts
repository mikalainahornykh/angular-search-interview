import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

/**
 * Favorites API client. Use as is, no changes needed.
 *
 * GET /api/favorites                   ->  number[]  (ids of favorite users)
 * PUT /api/users/:id/favorite {value}  ->  { id, value }
 *   Sets (does not toggle) the favorite flag. May fail with 500.
 */
@Injectable({ providedIn: 'root' })
export class FavoritesApi {
  private readonly http = inject(HttpClient);

  getAll(): Observable<number[]> {
    return this.http.get<number[]>('/api/favorites');
  }

  set(userId: number, value: boolean): Observable<{ id: number; value: boolean }> {
    return this.http.put<{ id: number; value: boolean }>(`/api/users/${userId}/favorite`, { value });
  }
}
