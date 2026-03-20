/**
 * Notification Service
 * Central state manager for the notification pipeline.
 * Maintains a list of notifications, an unread count, and
 * notifies subscribers when the state changes.
 */

// ─── Notification Store ─────────────────────────────────────
let _notifications = [];
let _unreadCount = 0;
let _listeners = [];

/**
 * Subscribe to notification state changes.
 * @param {Function} callback — called with { notifications, unreadCount }
 * @returns {Function} unsubscribe function
 */
export function subscribe(callback) {
  _listeners.push(callback);
  return () => {
    _listeners = _listeners.filter(l => l !== callback);
  };
}

function _emit() {
  const snapshot = { notifications: [..._notifications], unreadCount: _unreadCount };
  _listeners.forEach(fn => fn(snapshot));
}

/**
 * Push a new notification.
 * @param {object} opts
 * @param {string} opts.title — Short headline
 * @param {string} opts.message — Detail text
 * @param {string} [opts.icon] — Material icon name (default: 'check_circle')
 * @param {string} [opts.type] — 'success' | 'error' | 'info' (default: 'success')
 */
export function pushNotification({ title, message, icon = 'check_circle', type = 'success' }) {
  const notification = {
    id: Date.now() + '-' + Math.random().toString(36).substr(2, 5),
    title,
    message,
    icon,
    type,
    timestamp: new Date(),
    read: false
  };
  _notifications.unshift(notification);  // newest first
  _unreadCount++;
  _emit();
}

/**
 * Mark all notifications as read.
 */
export function markAllRead() {
  _notifications.forEach(n => { n.read = true; });
  _unreadCount = 0;
  _emit();
}

/**
 * Mark a single notification as read.
 */
export function markRead(id) {
  const n = _notifications.find(n => n.id === id);
  if (n && !n.read) {
    n.read = true;
    _unreadCount = Math.max(0, _unreadCount - 1);
    _emit();
  }
}

/**
 * Clear all notifications.
 */
export function clearAll() {
  _notifications = [];
  _unreadCount = 0;
  _emit();
}

/**
 * Get current state.
 */
export function getState() {
  return { notifications: [..._notifications], unreadCount: _unreadCount };
}
