import { theme, getRoleColor } from '../utils/colors';
import { t } from '../utils/translations';
import { getInitials } from '../utils/format';
import { useAuth } from '../contexts/AuthContext';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  collapsed: boolean;
  onToggle: () => void;
}

const navItems = [
  { key: 'dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', roles: ['admin', 'office', 'tech'] },
  { key: 'projects', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4', roles: ['admin', 'office', 'tech'] },
  { key: 'planning', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', roles: ['admin', 'office'] },
  { key: 'team', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z', roles: ['admin', 'office'] },
  { key: 'clients', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', roles: ['admin', 'office'] },
  { key: 'invoices', icon: 'M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z', roles: ['admin', 'office'] },
  { key: 'messages', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z', roles: ['admin', 'office', 'tech'] },
  { key: 'settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z', roles: ['admin'] },
];

export default function Sidebar({ activeTab, onTabChange, collapsed, onToggle }: SidebarProps) {
  const { user, signOut, lang } = useAuth();
  if (!user) return null;

  const visibleItems = navItems.filter((item) => item.roles.includes(user.role));

  return (
    <div
      style={{
        width: collapsed ? '72px' : '240px',
        height: '100vh',
        background: theme.secondary,
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.2s ease',
        flexShrink: 0,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          padding: collapsed ? '16px 12px' : '20px 16px',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          cursor: 'pointer',
        }}
        onClick={onToggle}
      >
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: `linear-gradient(135deg, ${theme.primary}, ${theme.primaryLight})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
            fontWeight: 700,
            color: '#fff',
            flexShrink: 0,
          }}
        >
          TSD
        </div>
        {!collapsed && (
          <span style={{ color: '#fff', fontWeight: 600, fontSize: '16px' }}>TSD Services</span>
        )}
      </div>

      <nav style={{ flex: 1, padding: '8px', overflowY: 'auto' }}>
        {visibleItems.map((item) => {
          const active = activeTab === item.key;
          return (
            <button
              key={item.key}
              onClick={() => onTabChange(item.key)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: collapsed ? '12px' : '10px 14px',
                borderRadius: '10px',
                border: 'none',
                cursor: 'pointer',
                background: active ? 'rgba(255,255,255,0.15)' : 'transparent',
                color: active ? '#fff' : 'rgba(255,255,255,0.6)',
                fontSize: '14px',
                fontWeight: active ? 600 : 400,
                marginBottom: '2px',
                transition: 'all 0.15s',
                justifyContent: collapsed ? 'center' : 'flex-start',
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d={item.icon} />
              </svg>
              {!collapsed && <span>{t(item.key, lang)}</span>}
            </button>
          );
        })}
      </nav>

      <div
        style={{
          padding: collapsed ? '12px' : '16px',
          borderTop: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '8px',
          }}
        >
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: getRoleColor(user.role),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: '13px',
              fontWeight: 600,
              flexShrink: 0,
            }}
          >
            {user.profile_photo ? (
              <img
                src={user.profile_photo}
                alt=""
                style={{ width: '100%', height: '100%', borderRadius: '10px', objectFit: 'cover' }}
              />
            ) : (
              getInitials(user.name)
            )}
          </div>
          {!collapsed && (
            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  color: '#fff',
                  fontSize: '13px',
                  fontWeight: 600,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {user.name}
              </div>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px' }}>
                {t(user.role, lang)}
              </div>
            </div>
          )}
        </div>
        <button
          onClick={signOut}
          style={{
            width: '100%',
            padding: '8px',
            borderRadius: '8px',
            border: '1px solid rgba(255,255,255,0.2)',
            background: 'transparent',
            color: 'rgba(255,255,255,0.6)',
            fontSize: '12px',
            cursor: 'pointer',
            transition: 'all 0.15s',
          }}
        >
          {collapsed ? 'X' : t('signOut', lang)}
        </button>
      </div>
    </div>
  );
}
