import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';

const pageTitles: Record<string, string> = {
  '/analytics': 'Analytics',
  '/reports': 'Reports',
  '/settings': 'Settings',
};

const INITIAL_NOTIFICATIONS = [
  { id: 1, title: 'Revenue milestone hit', body: 'Monthly revenue crossed $140K', time: '2m ago', unread: true, route: '/analytics' },
  { id: 2, title: 'Conversion rate drop', body: 'Conversion fell 0.3% vs last week', time: '1h ago', unread: true, route: '/analytics' },
  { id: 3, title: 'New report ready', body: 'Q1 traffic analysis is available', time: '3h ago', unread: false, route: '/reports' },
  { id: 4, title: 'User spike detected', body: 'Active users +18% in last hour', time: '5h ago', unread: false, route: '/analytics' },
];

export default function TopBar() {
  const { toggleSidebar, toggleChat, isChatOpen } = useAppStore();
  const location = useLocation();
  const navigate = useNavigate();
  const title = pageTitles[location.pathname] ?? 'Dashboard';

  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (userRef.current && !userRef.current.contains(e.target as Node)) setUserOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const unreadCount = notifications.filter(n => n.unread).length;

  function handleNotifClick(id: number, route: string) {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
    setNotifOpen(false);
    navigate(route);
  }

  function markAllRead() {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  }

  return (
    <header
      className="flex items-center justify-between px-5 border-b border-slate-800"
      style={{ height: '64px', flexShrink: 0, backgroundColor: '#0f1117', position: 'relative', zIndex: 40 }}
    >
      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="text-slate-400 hover:text-slate-200 p-2 rounded-lg hover:bg-slate-800 transition-colors"
          aria-label="Toggle sidebar"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <span>Pulse</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
          <span className="text-slate-200 font-medium">{title}</span>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-1">
        {/* AI Chat toggle */}
        <button
          onClick={toggleChat}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer"
          style={{
            background: isChatOpen ? 'rgba(47,129,247,0.15)' : 'transparent',
            color: isChatOpen ? '#2f81f7' : '#94a3b8',
            border: isChatOpen ? '1px solid rgba(47,129,247,0.4)' : '1px solid rgba(255,255,255,0.06)',
            zIndex: 1,
          }}
          aria-label="Toggle AI assistant"
          aria-pressed={isChatOpen}
          type="button"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <span className="hidden sm:inline">AI Assistant</span>
        </button>

        {/* Notifications */}
        <div ref={notifRef} style={{ position: 'relative' }}>
          <button
            onClick={() => { setNotifOpen(o => !o); setUserOpen(false); }}
            className="relative p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label={`Notifications (${unreadCount} unread)`}
            aria-haspopup="true"
            aria-expanded={notifOpen}
            type="button"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
            )}
          </button>

          {notifOpen && (
            <div
              className="absolute right-0 mt-2 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl"
              style={{ width: '320px', zIndex: 100, top: '100%' }}
              role="menu"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
                <span className="text-slate-200 font-semibold text-sm">Notifications</span>
                {unreadCount > 0 && (
                  <button onClick={markAllRead} className="text-xs text-blue-400 hover:underline cursor-pointer" type="button">
                    Mark all read
                  </button>
                )}
              </div>
              {notifications.map(n => (
                <button
                  key={n.id}
                  onClick={() => handleNotifClick(n.id, n.route)}
                  className={`w-full px-4 py-3 border-b border-slate-800 hover:bg-slate-800 cursor-pointer transition-colors last:border-0 text-left ${n.unread ? 'bg-slate-800/40' : ''}`}
                  role="menuitem"
                  type="button"
                >
                  <div className="flex items-start gap-3">
                    <span className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${n.unread ? 'bg-blue-500' : 'bg-transparent'}`} />
                    <div>
                      <p className={`text-sm font-medium ${n.unread ? 'text-slate-100' : 'text-slate-400'}`}>{n.title}</p>
                      <p className="text-slate-500 text-xs mt-0.5">{n.body}</p>
                      <p className="text-slate-600 text-xs mt-1">{n.time}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* User avatar */}
        <div ref={userRef} style={{ position: 'relative' }}>
          <button
            onClick={() => { setUserOpen(o => !o); setNotifOpen(false); }}
            className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="User menu"
            aria-haspopup="true"
            aria-expanded={userOpen}
            type="button"
          >
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold bg-blue-600">
              JD
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {userOpen && (
            <div
              className="absolute right-0 mt-2 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden"
              style={{ width: '200px', zIndex: 100, top: '100%' }}
              role="menu"
            >
              <div className="px-4 py-3 border-b border-slate-800">
                <p className="text-slate-200 text-sm font-semibold">Jane Doe</p>
                <p className="text-slate-500 text-xs">jane@streamline.ai</p>
              </div>
              {[
                { label: 'Profile Settings', icon: '👤', route: '/settings' },
                { label: 'Preferences', icon: '⚙️', route: '/settings' },
                { label: 'Help & Docs', icon: '📖', route: '/reports' },
              ].map(item => (
                <button
                  key={item.label}
                  onClick={() => { setUserOpen(false); navigate(item.route); }}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-slate-300 hover:bg-slate-800 transition-colors text-sm text-left"
                  role="menuitem"
                  type="button"
                >
                  <span>{item.icon}</span>{item.label}
                </button>
              ))}
              <div className="border-t border-slate-800">
                <button
                  onClick={() => { setUserOpen(false); window.location.reload(); }}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-red-400 hover:bg-slate-800 transition-colors text-sm text-left"
                  role="menuitem"
                  type="button"
                >
                  <span>🚪</span>Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
