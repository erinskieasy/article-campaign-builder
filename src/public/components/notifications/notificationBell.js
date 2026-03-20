/**
 * Notification Bell Component
 * Renders the bell icon with an unread badge counter.
 * Clicking toggles the notification panel.
 */
import { getState, subscribe, markAllRead } from './notificationService.js';

let _panelOpen = false;
let _onToggle = null;

/**
 * Render the bell button HTML (placed inside the navbar).
 */
export function renderNotificationBell() {
  const { unreadCount } = getState();
  const badgeHtml = unreadCount > 0
    ? `<span id="notif-badge" class="notif-badge">${unreadCount > 99 ? '99+' : unreadCount}</span>`
    : '';

  return `
    <button id="btn-notif-bell" class="relative p-2 hover:bg-slate-200/50 rounded-full transition-all active:scale-95 duration-200 ease-in-out" aria-label="Notifications">
      <span class="material-symbols-outlined text-slate-600">notifications</span>
      ${badgeHtml}
    </button>
  `;
}

/**
 * Update just the badge without re-rendering everything.
 */
export function updateBadge() {
  const { unreadCount } = getState();
  let badge = document.getElementById('notif-badge');
  const bell = document.getElementById('btn-notif-bell');

  if (unreadCount > 0) {
    if (!badge && bell) {
      badge = document.createElement('span');
      badge.id = 'notif-badge';
      badge.className = 'notif-badge';
      bell.appendChild(badge);
    }
    if (badge) {
      badge.textContent = unreadCount > 99 ? '99+' : unreadCount;
      // Trigger pop animation
      badge.classList.remove('notif-badge-pop');
      void badge.offsetWidth;  // force reflow
      badge.classList.add('notif-badge-pop');
    }
  } else {
    if (badge) badge.remove();
  }
}

/**
 * Mount the bell click handler.
 */
export function mountNotificationBell(onToggle) {
  _onToggle = onToggle;

  const bell = document.getElementById('btn-notif-bell');
  if (bell) {
    bell.addEventListener('click', (e) => {
      e.stopPropagation();
      _panelOpen = !_panelOpen;
      if (_onToggle) _onToggle(_panelOpen);
    });
  }

  // Subscribe to auto-update badge
  subscribe(() => updateBadge());
}
