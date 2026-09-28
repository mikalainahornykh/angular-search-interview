import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Subject, catchError, debounceTime, distinctUntilChanged, of, startWith, switchMap } from 'rxjs';
import { UsersApi } from '../api/users.api';
import { User } from '../api/user.model';
import { FavoritesStore } from '../favorites/favorites.store';
import { UserCard } from './user-card';

/**
 * Tasks 1 and 2 (see TASK.md).
 * Feel free to create new files if needed.
 */
@Component({
  selector: 'app-users-search',
  imports: [UserCard],
  template: `
    <input
      #box
      class="search"
      type="search"
      placeholder="Search by name, email or city"
      (input)="query$.next(box.value)"
    />

    <div class="results">
      @for (user of users(); track user.id) {
        <app-user-card
          [user]="user"
          [favorite]="favorites.isFavorite(user.id)"
          (favoriteClick)="favorites.toggle(user.id)"
        />
      }
    </div>
  `,
})
export class UsersSearch {
  private readonly usersApi = inject(UsersApi);
  protected readonly favorites = inject(FavoritesStore);

  protected readonly query$ = new Subject<string>();

  protected readonly users = toSignal(
    this.query$.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((query) => this.usersApi.search(query.trim())),
      // if the server returns an error, show an empty list
      catchError(() => of<User[]>([])),
    ),
    { initialValue: [] as User[] },
  );
}
