/**
 * Notification Panel Component
 * Dropdown panel anchored to the bell icon showing a scrollable list of notifications.
 */
import { getState, markAllRead, markRead, clearAll } from './notificationService.js';

function timeAgo(date) {
  const now = new Date();
  const diffMs = now - date;
  const diffS = Math.floor(diffMs / 1000);
  if (diffS < 60) return 'Just now';
  const diffM = Math.floor(diffS / 60);
  if (diffM < 60) return `${diffM}m ago`;
  const diffH = Math.floor(diffM / 60);
  if (diffH < 24) return `${diffH}h ago`;
  return `${Math.floor(diffH / 24)}d ago`;
}

function iconForType(type) {
  switch (type) {
    case 'success': return { icon: 'check_circle', color: 'text-green-600' };
    case 'error':   return { icon: 'error', color: 'text-red-500' };
    case 'info':    return { icon: 'info', color: 'text-blue-500' };
    default:        return { icon: 'notifications', color: 'text-slate-500' };
  }
}

/**
 * Render the full notification panel HTML.
 */
export function renderNotificationPanel() {
  return `
    <div id="notif-panel" class="notif-panel">
      <div class="notif-panel-inner">
        <!-- Header -->
        <div class="flex items-center justify-between px-5 py-4 border-b border-outline-variant/10">
          <h3 class="text-sm font-bold text-on-surface tracking-tight">Notifications</h3>
          <div class="flex items-center gap-2">
            <button id="btn-mark-all-read" class="text-[11px] font-semibold text-primary hover:text-primary-dim transition-colors">
              Mark all read
            </button>
            <span class="text-outline-variant">·</span>
            <button id="btn-clear-all-notifs" class="text-[11px] font-semibold text-on-surface-variant hover:text-error transition-colors">
              Clear
            </button>
          </div>
        </div>
        <!-- Notification list -->
        <div id="notif-list" class="notif-list">
          <!-- Items injected dynamically -->
        </div>
      </div>
    </div>
  `;
}

/**
 * Re-render just the list items inside the panel.
 */
export function updateNotificationList() {
  const list = document.getElementById('notif-list');
  if (!list) return;

  const { notifications } = getState();

  if (notifications.length === 0) {
    list.innerHTML = `
      <div class="flex flex-col items-center justify-center py-12 text-center">
        <span class="material-symbols-outlined text-outline-variant text-4xl mb-3">notifications_off</span>
        <p class="text-sm text-on-surface-variant">No notifications yet</p>
      </div>
    `;
    return;
  }

  list.innerHTML = notifications.map(n => {
    const { icon, color } = iconForType(n.type);
    return `
      <div class="notif-item ${n.read ? 'notif-read' : ''}" data-notif-id="${n.id}">
        <div class="w-8 h-8 rounded-full bg-surface-container-low flex items-center justify-center flex-shrink-0">
          <span class="material-symbols-outlined ${color}" style="font-size: 18px;">${n.icon || icon}</span>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-[13px] font-semibold text-on-surface truncate">${n.title}</p>
          <p class="text-[11px] text-on-surface-variant mt-0.5 line-clamp-2">${n.message}</p>
        </div>
        <span class="text-[10px] text-on-surface-variant flex-shrink-0 mt-0.5">${timeAgo(n.timestamp)}</span>
      </div>
    `;
  }).join('');
}

/**
 * Open / close the panel.
 */
export function showPanel() {
  const panel = document.getElementById('notif-panel');
  if (panel) {
    panel.classList.add('open');
    updateNotificationList();
  }
}

export function hidePanel() {
  const panel = document.getElementById('notif-panel');
  if (panel) panel.classList.remove('open');
}

export function togglePanel(isOpen) {
  if (isOpen) showPanel();
  else hidePanel();
}

/**
 * Mount panel event listeners.
 */
export function mountNotificationPanel() {
  document.getElementById('btn-mark-all-read')?.addEventListener('click', () => {
    markAllRead();
    updateNotificationList();
  });

  document.getElementById('btn-clear-all-notifs')?.addEventListener('click', () => {
    clearAll();
    updateNotificationList();
  });

  // Click a notification to mark it read
  document.getElementById('notif-list')?.addEventListener('click', (e) => {
    const item = e.target.closest('.notif-item');
    if (item) {
      markRead(item.dataset.notifId);
      updateNotificationList();
    }
  });

  // Close panel when clicking outside
  document.addEventListener('click', (e) => {
    const panel = document.getElementById('notif-panel');
    const bell = document.getElementById('btn-notif-bell');
    if (panel && panel.classList.contains('open') && !panel.contains(e.target) && !bell?.contains(e.target)) {
      hidePanel();
    }
  });
}
