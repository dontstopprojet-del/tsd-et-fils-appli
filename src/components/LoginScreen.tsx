import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { t } from '../utils/translations';
import { theme } from '../utils/colors';

export default function LoginScreen() {
  const { signIn, lang, setLang } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error: err } = await signIn(email, password);
    if (err) setError(t('loginError', lang));
    setLoading(false);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `linear-gradient(135deg, ${theme.secondary} 0%, ${theme.primaryDark} 100%)`,
        padding: '16px',
      }}
    >
      <div
        style={{
          background: theme.card,
          borderRadius: '16px',
          padding: '40px',
          width: '100%',
          maxWidth: '400px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '16px',
              background: `linear-gradient(135deg, ${theme.primary}, ${theme.primaryLight})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              fontSize: '28px',
              fontWeight: 700,
              color: '#fff',
            }}
          >
            TSD
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: theme.text, margin: '0 0 4px' }}>
            TSD Services
          </h1>
          <p style={{ color: theme.textSecondary, margin: 0, fontSize: '14px' }}>
            {t('welcomeBack', lang)}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: 600,
                color: theme.textSecondary,
                marginBottom: '6px',
              }}
            >
              {t('email', lang)}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '10px',
                border: `1px solid ${theme.border}`,
                fontSize: '15px',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => (e.target.style.borderColor = theme.primary)}
              onBlur={(e) => (e.target.style.borderColor = theme.border)}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: 600,
                color: theme.textSecondary,
                marginBottom: '6px',
              }}
            >
              {t('password', lang)}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '10px',
                border: `1px solid ${theme.border}`,
                fontSize: '15px',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => (e.target.style.borderColor = theme.primary)}
              onBlur={(e) => (e.target.style.borderColor = theme.border)}
            />
          </div>

          {error && (
            <div
              style={{
                padding: '10px 14px',
                borderRadius: '8px',
                background: '#FEF2F2',
                color: theme.error,
                fontSize: '13px',
                marginBottom: '16px',
                textAlign: 'center',
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '10px',
              border: 'none',
              background: `linear-gradient(135deg, ${theme.primary}, ${theme.primaryLight})`,
              color: '#fff',
              fontSize: '16px',
              fontWeight: 600,
              cursor: loading ? 'wait' : 'pointer',
              opacity: loading ? 0.7 : 1,
              transition: 'opacity 0.2s, transform 0.1s',
            }}
          >
            {loading ? '...' : t('signIn', lang)}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button
            onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')}
            style={{
              background: 'none',
              border: 'none',
              color: theme.textSecondary,
              fontSize: '13px',
              cursor: 'pointer',
              padding: '4px 8px',
            }}
          >
            {lang === 'fr' ? 'English' : 'Francais'}
          </button>
        </div>
      </div>
    </div>
  );
}
