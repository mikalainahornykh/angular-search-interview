import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from './user.model';

/**
 * Клиент API пользователей. Использовать как есть, менять не нужно.
 *
 * GET /api/users?q=<строка>  →  User[]
 * Поиск идёт по имени, email и городу, без учёта регистра.
 */
@Injectable({ providedIn: 'root' })
export class UsersApi {
  private readonly http = inject(HttpClient);

  search(query: string): Observable<User[]> {
    return this.http.get<User[]>('/api/users', { params: { q: query } });
  }
}
