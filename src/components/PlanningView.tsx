import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { theme, getStatusColor } from '../utils/colors';
import { t } from '../utils/translations';

export default function PlanningView() {
  const { lang } = useAuth();
  const [planning, setPlanning] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [weekOffset, setWeekOffset] = useState(0);

  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay() + 1 + weekOffset * 7);

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    return d;
  });

  useEffect(() => {
    loadPlanning();
  }, [weekOffset]);

  async function loadPlanning() {
    const start = days[0].toISOString().split('T')[0];
    const end = days[6].toISOString().split('T')[0];
    const { data } = await supabase
      .from('chantiers')
      .select('*')
      .gte('scheduled_date', start)
      .lte('scheduled_date', end)
      .order('scheduled_time');
    setPlanning(data || []);
    setLoading(false);
  }

  const dayNames = lang === 'fr'
    ? ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
    : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const isToday = (d: Date) =>
    d.toISOString().split('T')[0] === today.toISOString().split('T')[0];

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: theme.text, margin: 0 }}>
          {t('planning', lang)}
        </h1>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            onClick={() => setWeekOffset((w) => w - 1)}
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              border: `1px solid ${theme.border}`,
              background: theme.card,
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            &lt;
          </button>
          <button
            onClick={() => setWeekOffset(0)}
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              border: 'none',
              background: theme.primary,
              color: '#fff',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 500,
            }}
          >
            {lang === 'fr' ? 'Aujourd\'hui' : 'Today'}
          </button>
          <button
            onClick={() => setWeekOffset((w) => w + 1)}
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              border: `1px solid ${theme.border}`,
              background: theme.card,
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            &gt;
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: theme.textSecondary }}>
          {t('loading', lang)}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', minHeight: '400px' }}>
          {days.map((day, i) => {
            const dateStr = day.toISOString().split('T')[0];
            const dayItems = planning.filter((p) => p.scheduled_date === dateStr);
            const todayHighlight = isToday(day);

            return (
              <div
                key={i}
                style={{
                  background: todayHighlight ? `${theme.primary}08` : theme.card,
                  borderRadius: '12px',
                  border: `1px solid ${todayHighlight ? theme.primary : theme.border}`,
                  padding: '12px',
                  minHeight: '150px',
                }}
              >
                <div
                  style={{
                    textAlign: 'center',
                    marginBottom: '10px',
                    paddingBottom: '8px',
                    borderBottom: `1px solid ${theme.border}`,
                  }}
                >
                  <div style={{ fontSize: '12px', color: theme.textSecondary, fontWeight: 500 }}>
                    {dayNames[i]}
                  </div>
                  <div
                    style={{
                      fontSize: '20px',
                      fontWeight: 700,
                      color: todayHighlight ? theme.primary : theme.text,
                    }}
                  >
                    {day.getDate()}
                  </div>
                </div>

                {dayItems.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      padding: '6px 8px',
                      borderRadius: '6px',
                      background: `${getStatusColor(item.status)}12`,
                      borderLeft: `3px solid ${getStatusColor(item.status)}`,
                      marginBottom: '6px',
                      fontSize: '12px',
                    }}
                  >
                    <div style={{ fontWeight: 600, color: theme.text, lineHeight: 1.3 }}>
                      {item.title}
                    </div>
                    {item.scheduled_time && (
                      <div style={{ color: theme.textSecondary, marginTop: '2px' }}>
                        {item.scheduled_time}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
