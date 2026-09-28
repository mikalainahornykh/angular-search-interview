import { Component } from '@angular/core';
import { UsersSearch } from './users-search/users-search';

@Component({
  selector: 'app-root',
  imports: [UsersSearch],
  template: `
    <main>
      <h1>Users</h1>
      <app-users-search />
    </main>
  `,
})
export class App {}
