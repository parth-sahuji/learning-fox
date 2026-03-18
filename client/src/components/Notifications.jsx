import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function NotificationsDropdown() {
  const { notifications, unreadCount, markNotificationsRead } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleOpen = () => {
    setOpen(o => !o);
    if (!open && unreadCount > 0) markNotificationsRead();
  };

  const typeColor = {
    success: 'text-emerald-500',
    error: 'text-red-500',
    warning: 'text-amber-500',
    info: 'text-blue-500',
  };

  const typeIcon = {
    success: '✓',
    error: '✕',
    warning: '!',
    info: 'i',
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={handleOpen}
        className="relative p-2 rounded-xl hover:bg-[var(--bg-secondary)] transition-colors text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
        title="Notifications"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 bg-brand-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold leading-none">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 card p-0 overflow-hidden shadow-xl z-50 animate-slide-up">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
            <span className="font-semibold text-sm text-[var(--text-primary)]">Notifications</span>
            {unreadCount > 0 && (
              <span className="text-xs text-brand-500 font-medium">{unreadCount} new</span>
            )}
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-[var(--text-secondary)] text-sm">
                <div className="text-3xl mb-2">🔔</div>
                No notifications yet
              </div>
            ) : (
              notifications.map(n => (
                <div
                  key={n.id}
                  className={`px-4 py-3 border-b border-[var(--border)] last:border-0 transition-colors
                    ${!n.is_read ? 'bg-brand-50/30 dark:bg-brand-950/20' : ''}`}
                >
                  <div className="flex items-start gap-3">
                    <span className={`text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5
                      ${typeColor[n.type] || typeColor.info} bg-current/10`}
                      style={{ backgroundColor: 'currentColor', color: 'white', fontSize: '10px' }}>
                      {typeIcon[n.type] || 'i'}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-[var(--text-primary)] truncate">{n.title}</p>
                      <p className="text-xs text-[var(--text-secondary)] mt-0.5 leading-relaxed">{n.message}</p>
                      <p className="text-xs text-[var(--text-secondary)]/60 mt-1">
                        {new Date(n.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
