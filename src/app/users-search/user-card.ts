import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { User } from '../api/user.model';

/**
 * User card. Ready-made component, no changes needed.
 *
 * Inputs:  user, favorite (star is filled), busy (star is disabled and dimmed)
 * Output:  favoriteClick (the star was clicked)
 */
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
    <button
      type="button"
      class="star"
      [class.on]="favorite()"
      [disabled]="busy()"
      [attr.aria-pressed]="favorite()"
      [attr.aria-label]="favorite() ? 'Remove from favorites' : 'Add to favorites'"
      (click)="favoriteClick.emit()"
    >
      @if (favorite()) { &#9733; } @else { &#9734; }
    </button>
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
    .star {
      width: 32px; height: 32px; flex: none; border: 0; border-radius: 6px; background: transparent;
      font-size: 20px; line-height: 1; color: var(--muted); cursor: pointer;
    }
    .star:hover { background: var(--accent-soft); }
    .star.on { color: #f59e0b; }
    .star:disabled { opacity: 0.4; cursor: progress; }
  `,
})
export class UserCard {
  readonly user = input.required<User>();
  readonly favorite = input(false);
  readonly busy = input(false);
  readonly favoriteClick = output<void>();

  protected readonly initials = computed(() =>
    this.user()
      .name.split(' ')
      .map((part) => part[0])
      .join(''),
  );
}
