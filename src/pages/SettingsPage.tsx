import { useState } from 'react';
import { useAppStore } from '../store/useAppStore';

interface Toggle {
  id: string;
  label: string;
  description: string;
  value: boolean;
}

export default function SettingsPage() {
  const { isDarkMode, toggleDarkMode } = useAppStore();

  const [profile, setProfile] = useState({
    name: 'Jane Doe',
    email: 'jane@streamline.ai',
    company: 'Pulse Inc.',
  });
  const [profileSaved, setProfileSaved] = useState(false);

  const [notifications, setNotifications] = useState<Toggle[]>([
    { id: 'email', label: 'Email Alerts', description: 'Receive alerts and reports via email', value: true },
    { id: 'sms', label: 'SMS Alerts', description: 'Receive critical alerts via SMS', value: false },
    { id: 'weekly', label: 'Weekly Digest', description: 'Weekly summary of key metrics', value: true },
    { id: 'product', label: 'Product Updates', description: 'News about new features and improvements', value: true },
  ]);

  const [apiKeyVisible, setApiKeyVisible] = useState(false);
  const [apiKey, setApiKey] = useState('sk-live-3f8a2b9c1d4e5f6a7b8c9d0e1f2a3b4c');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSaveProfile = () => {
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  };

  const handleRegenerateKey = () => {
    const chars = 'abcdef0123456789';
    const newKey = 'sk-live-' + Array.from({ length: 32 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    setApiKey(newKey);
  };

  const toggleNotification = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, value: !n.value } : n))
    );
  };

  const cardStyle = {
    backgroundColor: 'rgba(30, 41, 59, 0.5)',
    border: '1px solid rgba(51, 65, 85, 0.5)',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '24px',
  };

  const inputStyle = {
    width: '100%',
    backgroundColor: '#e2e8f0',
    border: '1px solid #334155',
    borderRadius: '8px',
    padding: '10px 14px',
    color: '#1e293b',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '13px',
    fontWeight: 500,
    color: '#64748b',
    marginBottom: '6px',
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '720px' }}>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-gray-500 mt-1">Manage your account preferences and configuration</p>
      </div>

      {/* Profile */}
      <div style={cardStyle}>
        <h2 className="text-base font-semibold text-white mb-5">Profile Information</h2>
        <div className="grid gap-4" style={{ gridTemplateColumns: '1fr 1fr' }}>
          <div>
            <label style={labelStyle}>Full Name</label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = '#6366f1')}
              onBlur={(e) => (e.target.style.borderColor = '#94a3b8')}
            />
          </div>
          <div>
            <label style={labelStyle}>Email Address</label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = '#6366f1')}
              onBlur={(e) => (e.target.style.borderColor = '#94a3b8')}
            />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Company</label>
            <input
              type="text"
              value={profile.company}
              onChange={(e) => setProfile({ ...profile, company: e.target.value })}
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = '#6366f1')}
              onBlur={(e) => (e.target.style.borderColor = '#94a3b8')}
            />
          </div>
        </div>
        <div className="flex items-center gap-3 mt-5">
          <button
            onClick={handleSaveProfile}
            className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white transition-all duration-200"
            style={{
              background: profileSaved
                ? 'linear-gradient(135deg, #10b981, #059669)'
                : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            }}
          >
            {profileSaved ? 'Saved!' : 'Save Profile'}
          </button>
          {profileSaved && (
            <span className="text-sm text-emerald-400 flex items-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Changes saved successfully
            </span>
          )}
        </div>
      </div>

      {/* Notifications */}
      <div style={cardStyle}>
        <h2 className="text-base font-semibold text-white mb-5">Notification Preferences</h2>
        <div className="space-y-4">
          {notifications.map((n) => (
            <div key={n.id} className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium text-gray-900">{n.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{n.description}</p>
              </div>
              <button
                onClick={() => toggleNotification(n.id)}
                className="relative w-11 h-6 rounded-full transition-all duration-200 flex-shrink-0"
                style={{
                  backgroundColor: n.value ? '#6366f1' : '#94a3b8',
                }}
                aria-label={`Toggle ${n.label}`}
                role="switch"
                aria-checked={n.value}
              >
                <span
                  className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform duration-200"
                  style={{ transform: n.value ? 'translateX(20px)' : 'translateX(0)' }}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Theme */}
      <div style={cardStyle}>
        <h2 className="text-base font-semibold text-white mb-5">Appearance</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-900">Dark Mode</p>
            <p className="text-xs text-gray-500 mt-0.5">
              {isDarkMode ? 'Currently using dark theme' : 'Currently using light theme'}
            </p>
          </div>
          <button
            onClick={toggleDarkMode}
            className="relative w-11 h-6 rounded-full transition-all duration-200"
            style={{ backgroundColor: isDarkMode ? '#6366f1' : '#94a3b8' }}
            aria-label="Toggle dark mode"
            role="switch"
            aria-checked={isDarkMode}
          >
            <span
              className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform duration-200"
              style={{ transform: isDarkMode ? 'translateX(20px)' : 'translateX(0)' }}
            />
          </button>
        </div>
      </div>

      {/* API Configuration */}
      <div style={cardStyle}>
        <h2 className="text-base font-semibold text-white mb-5">API Configuration</h2>
        <div className="space-y-4">
          <div>
            <label style={labelStyle}>Webhook URL</label>
            <input
              type="text"
              defaultValue="https://hooks.streamline.ai/webhook/v1/a3f9b2c1"
              readOnly
              style={{ ...inputStyle, color: '#64748b', cursor: 'default' }}
            />
          </div>
          <div>
            <label style={labelStyle}>API Key</label>
            <div className="flex gap-2">
              <input
                type={apiKeyVisible ? 'text' : 'password'}
                value={apiKey}
                readOnly
                style={{ ...inputStyle, flex: 1, fontFamily: 'monospace', color: '#64748b', cursor: 'default' }}
              />
              <button
                onClick={() => setApiKeyVisible(!apiKeyVisible)}
                className="px-3 py-2 rounded-lg text-sm text-gray-500 hover:text-gray-900 transition-colors"
                style={{ backgroundColor: '#e2e8f0', border: '1px solid #334155', flexShrink: 0 }}
                title={apiKeyVisible ? 'Hide' : 'Show'}
              >
                {apiKeyVisible ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
              <button
                onClick={handleRegenerateKey}
                className="px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                style={{
                  backgroundColor: 'rgba(99,102,241,0.1)',
                  border: '1px solid rgba(99,102,241,0.3)',
                  color: '#818cf8',
                  flexShrink: 0,
                }}
              >
                Regenerate
              </button>
            </div>
            <p className="text-xs text-slate-600 mt-2">Keep your API key secret. Never share it publicly.</p>
          </div>
        </div>
      </div>

      {/* Danger zone */}
      <div
        style={{
          ...cardStyle,
          borderColor: 'rgba(239,68,68,0.2)',
          backgroundColor: 'rgba(239,68,68,0.04)',
        }}
      >
        <h2 className="text-base font-semibold mb-2" style={{ color: '#f87171' }}>Danger Zone</h2>
        <p className="text-sm text-gray-500 mb-5">
          Permanently delete your account and all associated data. This action cannot be undone.
        </p>
        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200"
            style={{
              backgroundColor: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.3)',
              color: '#f87171',
            }}
          >
            Delete Account
          </button>
        ) : (
          <div
            className="rounded-lg p-4"
            style={{ backgroundColor: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}
          >
            <p className="text-sm font-medium text-red-400 mb-3">
              Are you sure? This will permanently delete all your data.
            </p>
            <div className="flex gap-3">
              <button
                className="px-4 py-2 rounded-lg text-sm font-semibold text-white transition-colors"
                style={{ backgroundColor: '#dc2626' }}
                onClick={() => setShowDeleteConfirm(false)}
              >
                Yes, delete everything
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
                style={{ backgroundColor: '#e2e8f0', border: '1px solid #334155' }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
