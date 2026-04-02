import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { theme, getRoleColor } from '../utils/colors';
import { t } from '../utils/translations';
import { getInitials } from '../utils/format';

export default function TeamList() {
  const { lang } = useAuth();
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTeam();
  }, []);

  async function loadTeam() {
    const { data } = await supabase
      .from('app_users')
      .select('*')
      .in('role', ['admin', 'office', 'tech'])
      .order('name');
    setMembers(data || []);
    setLoading(false);
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: theme.textSecondary }}>
        {t('loading', lang)}
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', maxWidth: '1000px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 700, color: theme.text, margin: '0 0 20px' }}>
        {t('team', lang)}
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
        {members.map((m) => (
          <div
            key={m.id}
            style={{
              background: theme.card,
              borderRadius: '14px',
              border: `1px solid ${theme.border}`,
              padding: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              transition: 'transform 0.15s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-1px)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: getRoleColor(m.role),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontWeight: 600,
                fontSize: '16px',
                flexShrink: 0,
                overflow: 'hidden',
              }}
            >
              {m.profile_photo ? (
                <img src={m.profile_photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                getInitials(m.name)
              )}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 600, color: theme.text, fontSize: '15px' }}>{m.name}</div>
              <div style={{ fontSize: '13px', color: theme.textSecondary }}>{t(m.role, lang)}</div>
              {m.phone && (
                <div style={{ fontSize: '12px', color: theme.textSecondary, marginTop: '2px' }}>{m.phone}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
