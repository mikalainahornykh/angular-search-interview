import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from './user.model';

/**
 * Users API client. Use as is, no changes needed.
 *
 * GET /api/users?q=<string>  ->  User[]
 * Case-insensitive search by name, email and city.
 */
@Injectable({ providedIn: 'root' })
export class UsersApi {
  private readonly http = inject(HttpClient);

  search(query: string): Observable<User[]> {
    return this.http.get<User[]>('/api/users', { params: { q: query } });
  }
}
