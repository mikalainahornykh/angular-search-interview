import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Subject, catchError, mergeMap, of, startWith } from 'rxjs';
import { UsersApi } from '../api/users.api';
import { User } from '../api/user.model';
import { UserCard } from './user-card';

/**
 * All the work for the task happens here (see TASK.md).
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
      // if the server returns an error, show an empty list
      catchError(() => of<User[]>([])),
    ),
    { initialValue: [] as User[] },
  );
}
