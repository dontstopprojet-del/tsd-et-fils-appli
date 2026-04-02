import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { theme } from '../utils/colors';
import { t } from '../utils/translations';

export default function SettingsView() {
  const { user, lang, setLang } = useAuth();
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    const { data } = await supabase.from('admin_settings').select('*').maybeSingle();
    setSettings(data);
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
    <div style={{ padding: '24px', maxWidth: '600px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 700, color: theme.text, margin: '0 0 24px' }}>
        {t('settings', lang)}
      </h1>

      <div
        style={{
          background: theme.card,
          borderRadius: '14px',
          border: `1px solid ${theme.border}`,
          padding: '24px',
          marginBottom: '16px',
        }}
      >
        <h2 style={{ fontSize: '16px', fontWeight: 600, color: theme.text, margin: '0 0 16px' }}>
          {lang === 'fr' ? 'Langue' : 'Language'}
        </h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          {['fr', 'en'].map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              style={{
                padding: '10px 20px',
                borderRadius: '10px',
                border: lang === l ? 'none' : `1px solid ${theme.border}`,
                background: lang === l ? theme.primary : theme.card,
                color: lang === l ? '#fff' : theme.text,
                fontWeight: 500,
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {l === 'fr' ? 'Francais' : 'English'}
            </button>
          ))}
        </div>
      </div>

      <div
        style={{
          background: theme.card,
          borderRadius: '14px',
          border: `1px solid ${theme.border}`,
          padding: '24px',
        }}
      >
        <h2 style={{ fontSize: '16px', fontWeight: 600, color: theme.text, margin: '0 0 12px' }}>
          {lang === 'fr' ? 'Profil' : 'Profile'}
        </h2>
        {user && (
          <div>
            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontSize: '12px', color: theme.textSecondary, marginBottom: '4px' }}>{t('name', lang)}</div>
              <div style={{ fontSize: '15px', color: theme.text, fontWeight: 500 }}>{user.name}</div>
            </div>
            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontSize: '12px', color: theme.textSecondary, marginBottom: '4px' }}>{t('email', lang)}</div>
              <div style={{ fontSize: '15px', color: theme.text, fontWeight: 500 }}>{user.email}</div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: theme.textSecondary, marginBottom: '4px' }}>{t('role', lang)}</div>
              <div style={{ fontSize: '15px', color: theme.text, fontWeight: 500 }}>{t(user.role, lang)}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
