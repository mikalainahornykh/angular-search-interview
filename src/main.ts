import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { worker } from './mocks/browser';

// Start the fake backend (Mock Service Worker) before the app makes its first request.
worker
  .start({ onUnhandledRequest: 'bypass', quiet: true })
  .then(() => bootstrapApplication(App, appConfig))
  .catch((err) => console.error(err));
