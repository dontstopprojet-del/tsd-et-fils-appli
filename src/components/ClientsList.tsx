import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { theme } from '../utils/colors';
import { t } from '../utils/translations';
import { getInitials, formatDate } from '../utils/format';

export default function ClientsList() {
  const { lang } = useAuth();
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadClients();
  }, []);

  async function loadClients() {
    const { data } = await supabase
      .from('app_users')
      .select('*')
      .eq('role', 'client')
      .order('name');
    setClients(data || []);
    setLoading(false);
  }

  const filtered = clients.filter((c) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return c.name?.toLowerCase().includes(s) || c.email?.toLowerCase().includes(s) || c.phone?.includes(s);
  });

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: theme.textSecondary }}>
        {t('loading', lang)}
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', maxWidth: '1000px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: theme.text, margin: 0 }}>
          {t('clients', lang)}
        </h1>
        <input
          type="text"
          placeholder={t('search', lang) + '...'}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: `1px solid ${theme.border}`,
            fontSize: '14px',
            outline: 'none',
            width: '240px',
          }}
        />
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: theme.textSecondary }}>
          {t('noData', lang)}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
          {filtered.map((c) => (
            <div
              key={c.id}
              style={{
                background: theme.card,
                borderRadius: '14px',
                border: `1px solid ${theme.border}`,
                padding: '20px',
                transition: 'transform 0.15s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-1px)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    background: '#7C3AED',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontWeight: 600,
                    fontSize: '15px',
                    flexShrink: 0,
                  }}
                >
                  {getInitials(c.name)}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 600, color: theme.text, fontSize: '15px' }}>{c.name}</div>
                  <div style={{ fontSize: '13px', color: theme.textSecondary }}>{c.email}</div>
                </div>
              </div>
              {c.phone && (
                <div style={{ fontSize: '13px', color: theme.textSecondary, marginBottom: '4px' }}>
                  {c.phone}
                </div>
              )}
              {c.city && (
                <div style={{ fontSize: '12px', color: theme.textSecondary }}>
                  {c.city}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
