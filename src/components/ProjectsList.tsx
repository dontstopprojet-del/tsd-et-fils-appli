import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { theme, getStatusColor } from '../utils/colors';
import { t } from '../utils/translations';
import { formatDate } from '../utils/format';

export default function ProjectsList() {
  const { user, lang } = useAuth();
  const [chantiers, setChantiers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadChantiers();
  }, []);

  async function loadChantiers() {
    let query = supabase.from('chantiers').select('*').order('created_at', { ascending: false });
    if (user?.role === 'tech') {
      query = query.eq('technician_id', user.id);
    }
    const { data } = await query;
    setChantiers(data || []);
    setLoading(false);
  }

  const filtered = chantiers.filter((c) => {
    if (filter !== 'all' && c.status !== filter) return false;
    if (search) {
      const s = search.toLowerCase();
      return (
        c.title?.toLowerCase().includes(s) ||
        c.client_name?.toLowerCase().includes(s) ||
        c.location?.toLowerCase().includes(s)
      );
    }
    return true;
  });

  const statuses = ['all', 'planned', 'inProgress', 'completed', 'interrupted', 'abandoned'];

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: theme.textSecondary }}>
        {t('loading', lang)}
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', maxWidth: '1200px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: theme.text, margin: 0 }}>
          {t('projects', lang)}
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

      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            style={{
              padding: '6px 14px',
              borderRadius: '20px',
              border: 'none',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
              background: filter === s ? theme.primary : theme.borderLight,
              color: filter === s ? '#fff' : theme.textSecondary,
              transition: 'all 0.15s',
            }}
          >
            {s === 'all' ? (lang === 'fr' ? 'Tous' : 'All') : t(s, lang)}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: theme.textSecondary }}>
          {t('noData', lang)}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
          {filtered.map((ch) => (
            <div
              key={ch.id}
              style={{
                background: theme.card,
                borderRadius: '14px',
                border: `1px solid ${theme.border}`,
                padding: '20px',
                transition: 'transform 0.15s, box-shadow 0.15s',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: theme.text, flex: 1, marginRight: '8px' }}>
                  {ch.title}
                </h3>
                <span
                  style={{
                    padding: '3px 10px',
                    borderRadius: '20px',
                    fontSize: '11px',
                    fontWeight: 600,
                    background: `${getStatusColor(ch.status)}15`,
                    color: getStatusColor(ch.status),
                    whiteSpace: 'nowrap',
                  }}
                >
                  {t(ch.status, lang)}
                </span>
              </div>

              {ch.client_name && (
                <div style={{ fontSize: '13px', color: theme.textSecondary, marginBottom: '6px' }}>
                  {ch.client_name}
                </div>
              )}
              {ch.location && (
                <div style={{ fontSize: '13px', color: theme.textSecondary, marginBottom: '10px' }}>
                  {ch.location}
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontSize: '12px', color: theme.textSecondary }}>
                  {formatDate(ch.scheduled_date, lang)}
                </div>
                {ch.progress != null && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '60px', height: '4px', borderRadius: '2px', background: theme.borderLight }}>
                      <div
                        style={{
                          width: `${ch.progress}%`,
                          height: '100%',
                          borderRadius: '2px',
                          background: getStatusColor(ch.status),
                          transition: 'width 0.3s',
                        }}
                      />
                    </div>
                    <span style={{ fontSize: '11px', color: theme.textSecondary }}>{ch.progress}%</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
