import { Component } from '@angular/core';
import { RequestLogPanel } from './devtools/request-log-panel';
import { UsersSearch } from './users-search/users-search';

@Component({
  selector: 'app-root',
  imports: [UsersSearch, RequestLogPanel],
  template: `
    <main>
      <h1>Пользователи</h1>
      <app-users-search />
    </main>
    <app-request-log-panel />
  `,
})
export class App {}
