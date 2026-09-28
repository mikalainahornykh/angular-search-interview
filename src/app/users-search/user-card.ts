import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { User } from '../api/user.model';

/** User card. Ready-made component, no changes needed. */
@Component({
  selector: 'app-user-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="avatar">{{ initials() }}</div>
    <div class="info">
      <div class="name">{{ user().name }}</div>
      <div class="meta">{{ user().email }} &middot; {{ user().city }}</div>
    </div>
    <span class="role">{{ user().role }}</span>
  `,
  styles: `
    :host { display: flex; align-items: center; gap: 12px; padding: 10px 12px; border-bottom: 1px solid var(--border); }
    .avatar {
      width: 36px; height: 36px; border-radius: 50%; flex: none;
      display: grid; place-items: center; font-weight: 600; font-size: 13px;
      background: var(--accent-soft); color: var(--accent);
    }
    .info { flex: 1; min-width: 0; }
    .name { font-weight: 500; }
    .meta { color: var(--muted); font-size: 13px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .role { font-size: 12px; color: var(--muted); border: 1px solid var(--border); border-radius: 999px; padding: 2px 8px; }
  `,
})
export class UserCard {
  readonly user = input.required<User>();

  protected readonly initials = computed(() =>
    this.user()
      .name.split(' ')
      .map((part) => part[0])
      .join(''),
  );
}
