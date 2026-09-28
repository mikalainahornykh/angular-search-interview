import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Subject, catchError, mergeMap, of, startWith } from 'rxjs';
import { UsersApi } from '../api/users.api';
import { User } from '../api/user.model';
import { UserCard } from './user-card';

/**
 * 👉 Здесь идёт вся работа по задаче (см. TASK.md).
 * Можно создавать новые файлы, если нужно.
 */
@Component({
  selector: 'app-users-search',
  imports: [UserCard],
  template: `
    <input
      #box
      class="search"
      type="search"
      placeholder="Поиск по имени, email или городу"
      (input)="query$.next(box.value)"
    />

    <div class="results">
      @for (user of users(); track user.id) {
        <app-user-card [user]="user" />
      }
    </div>
  `,
})
export class UsersSearch {
  private readonly usersApi = inject(UsersApi);

  protected readonly query$ = new Subject<string>();

  protected readonly users = toSignal(
    this.query$.pipe(
      startWith(''),
      mergeMap((query) => this.usersApi.search(query)),
      // если сервер вернул ошибку — показываем пустой список
      catchError(() => of<User[]>([])),
    ),
    { initialValue: [] as User[] },
  );
}
