import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RequestLog } from './request-log';

/** Панель с журналом запросов. Служебный компонент, к задаче не относится. */
@Component({
  selector: 'app-request-log-panel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="panel" [class.collapsed]="collapsed()">
      <header>
        <button class="toggle" type="button" (click)="collapsed.set(!collapsed())">
          Network: {{ log.total() }} {{ collapsed() ? '[+]' : '[-]' }}
        </button>
        @if (!collapsed()) {
          <button class="link" type="button" (click)="log.clear()">очистить</button>
        }
      </header>

      @if (!collapsed()) {
        <ol>
          @for (e of log.entries(); track e.id) {
            <li [class]="e.status" [class.stale]="e.stale">
              <span class="id">#{{ e.id }}</span>
              <span class="q">q="{{ e.query }}"</span>
              <span class="status">
                @switch (e.status) {
                  @case ('pending') { ... }
                  @case ('success') { 200 }
                  @case ('error') { 500 }
                  @case ('cancelled') { отменён }
                }
              </span>
              <span class="ms">{{ e.durationMs ?? '...' }} мс</span>
              @if (e.stale) {
                <span class="warn" title="Этот ответ пришёл позже ответа на более новый запрос">устарел</span>
              }
            </li>
          } @empty {
            <li class="empty">Запросов пока не было</li>
          }
        </ol>
      }
    </section>
  `,
  styles: `
    .panel {
      position: fixed; right: 16px; bottom: 16px; width: 400px; max-height: 45vh;
      display: flex; flex-direction: column;
      background: #111827; color: #e5e7eb; border-radius: 10px;
      font: 12px/1.4 ui-monospace, SFMono-Regular, Menlo, monospace;
      box-shadow: 0 8px 24px rgb(0 0 0 / 0.25); overflow: hidden;
    }
    .panel.collapsed { width: auto; }
    header { display: flex; justify-content: space-between; align-items: center; padding: 6px 10px; background: #1f2937; }
    button { background: none; border: 0; color: inherit; font: inherit; cursor: pointer; padding: 0; }
    .link { color: #9ca3af; text-decoration: underline; }
    ol { list-style: none; margin: 0; padding: 4px 0; overflow-y: auto; }
    li { display: grid; grid-template-columns: 36px 1fr auto 64px 52px; gap: 8px; padding: 2px 10px; align-items: center; }
    li.stale { background: rgb(250 204 21 / 0.12); }
    .q { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .ms { text-align: right; color: #9ca3af; }
    .pending .status { color: #93c5fd; }
    .success .status { color: #86efac; }
    .error .status { color: #fca5a5; }
    .cancelled { color: #6b7280; }
    .cancelled .q { text-decoration: line-through; }
    .warn { color: #facc15; font-weight: 600; text-align: right; }
    .empty { display: block; color: #6b7280; }
  `,
})
export class RequestLogPanel {
  protected readonly log = inject(RequestLog);
  protected readonly collapsed = signal(false);
}
