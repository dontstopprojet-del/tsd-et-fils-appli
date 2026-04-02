import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { theme, getStatusColor } from '../utils/colors';
import { t } from '../utils/translations';
import { formatDate, formatCurrency } from '../utils/format';
import StatCard from './StatCard';

interface DashboardStats {
  totalChantiers: number;
  activeChantiers: number;
  completedChantiers: number;
  totalRevenue: number;
  teamCount: number;
  clientCount: number;
}

export default function Dashboard() {
  const { user, lang } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalChantiers: 0,
    activeChantiers: 0,
    completedChantiers: 0,
    totalRevenue: 0,
    teamCount: 0,
    clientCount: 0,
  });
  const [recentChantiers, setRecentChantiers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    const [chantiersRes, teamRes, clientsRes] = await Promise.all([
      supabase.from('chantiers').select('*').order('created_at', { ascending: false }),
      supabase.from('app_users').select('id').in('role', ['tech', 'office']),
      supabase.from('app_users').select('id').eq('role', 'client'),
    ]);

    const chantiers = chantiersRes.data || [];
    const active = chantiers.filter((c) => c.status === 'inProgress');
    const completed = chantiers.filter((c) => c.status === 'completed');
    const revenue = completed.reduce((sum, c) => sum + (c.montant_facture_client || 0), 0);

    setStats({
      totalChantiers: chantiers.length,
      activeChantiers: active.length,
      completedChantiers: completed.length,
      totalRevenue: revenue,
      teamCount: teamRes.data?.length || 0,
      clientCount: clientsRes.data?.length || 0,
    });

    setRecentChantiers(chantiers.slice(0, 8));
    setLoading(false);
  }

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          color: theme.textSecondary,
        }}
      >
        {t('loading', lang)}
      </div>
    );
  }

  const statusLabel = (s: string) => t(s, lang);

  return (
    <div style={{ padding: '24px', maxWidth: '1200px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 700, color: theme.text, margin: '0 0 24px' }}>
        {t('dashboard', lang)}
      </h1>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: '16px',
          marginBottom: '32px',
        }}
      >
        <StatCard
          label={t('activeSites', lang)}
          value={stats.activeChantiers}
          icon="🔨"
          color={theme.accent}
        />
        <StatCard
          label={t('completed', lang)}
          value={stats.completedChantiers}
          icon="✓"
          color={theme.success}
        />
        <StatCard
          label={t('totalRevenue', lang)}
          value={formatCurrency(stats.totalRevenue)}
          icon="$"
          color={theme.primary}
        />
        <StatCard
          label={t('teamMembers', lang)}
          value={stats.teamCount}
          icon="👤"
          color={theme.secondary}
        />
      </div>

      <div
        style={{
          background: theme.card,
          borderRadius: '14px',
          border: `1px solid ${theme.border}`,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            padding: '16px 20px',
            borderBottom: `1px solid ${theme.border}`,
            fontWeight: 600,
            color: theme.text,
          }}
        >
          {t('recentActivity', lang)}
        </div>

        {recentChantiers.length === 0 ? (
          <div
            style={{ padding: '40px', textAlign: 'center', color: theme.textSecondary }}
          >
            {t('noData', lang)}
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['title', 'status', 'client_name', 'location', 'date'].map((h) => (
                    <th
                      key={h}
                      style={{
                        textAlign: 'left',
                        padding: '10px 16px',
                        fontSize: '12px',
                        fontWeight: 600,
                        color: theme.textSecondary,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        borderBottom: `1px solid ${theme.border}`,
                      }}
                    >
                      {h === 'client_name' ? t('clients', lang) : t(h, lang)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentChantiers.map((ch) => (
                  <tr
                    key={ch.id}
                    style={{ transition: 'background 0.1s' }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = theme.borderLight)
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = 'transparent')
                    }
                  >
                    <td
                      style={{
                        padding: '12px 16px',
                        fontWeight: 500,
                        color: theme.text,
                        fontSize: '14px',
                      }}
                    >
                      {ch.title}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span
                        style={{
                          padding: '3px 10px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: 600,
                          background: `${getStatusColor(ch.status)}15`,
                          color: getStatusColor(ch.status),
                        }}
                      >
                        {statusLabel(ch.status)}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: '12px 16px',
                        color: theme.textSecondary,
                        fontSize: '14px',
                      }}
                    >
                      {ch.client_name || '-'}
                    </td>
                    <td
                      style={{
                        padding: '12px 16px',
                        color: theme.textSecondary,
                        fontSize: '14px',
                      }}
                    >
                      {ch.location || '-'}
                    </td>
                    <td
                      style={{
                        padding: '12px 16px',
                        color: theme.textSecondary,
                        fontSize: '13px',
                      }}
                    >
                      {formatDate(ch.scheduled_date, lang)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
