import { useState } from 'react';
import { supabase } from '../lib/supabase';
import Logo from './Logo';

interface LoginScreenProps {
  colors: any;
  translations: any;
  lang: string;
  darkMode: boolean;
  onLoginSuccess: (user: any, role: string) => void;
  onLanguageChange: () => void;
  onDarkModeToggle: () => void;
  onBackToHome?: () => void;
}

const LoginScreen = ({ colors: C, translations: t, lang, darkMode, onLoginSuccess, onLanguageChange, onDarkModeToggle, onBackToHome }: LoginScreenProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

      if (authError) {
        setError(lang === 'fr' ? 'Email ou mot de passe incorrect' : 'Invalid email or password');
        setLoading(false);
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setError(lang === 'fr' ? 'Erreur de session' : 'Session error');
        setLoading(false);
        return;
      }

      const { data: user } = await supabase
        .from('app_users')
        .select('*')
        .eq('id', session.user.id)
        .maybeSingle();

      if (!user) {
        setError(lang === 'fr' ? 'Compte utilisateur introuvable' : 'User account not found');
        setLoading(false);
        return;
      }

      const roleMap: Record<string, string> = {
        admin: 'admin',
        tech: 'tech',
        office_employee: 'office',
        client: 'client',
      };
      const mappedRole = roleMap[user.role] || 'client';
      onLoginSuccess(user, mappedRole);
    } catch {
      setError(lang === 'fr' ? 'Erreur de connexion' : 'Connection error');
    }

    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: darkMode
        ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)'
        : 'linear-gradient(135deg, #1B4D7A 0%, #2E8BC0 50%, #1B4D7A 100%)',
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }}>
      {onBackToHome && (
        <button
          onClick={onBackToHome}
          style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            borderRadius: '12px',
            border: '1px solid rgba(255,255,255,0.25)',
            background: 'rgba(255,255,255,0.12)',
            color: '#FFF',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.3s ease',
            zIndex: 10,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.25)';
            e.currentTarget.style.transform = 'translateX(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.12)';
            e.currentTarget.style.transform = 'translateX(0)';
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          {lang === 'fr' ? 'Accueil' : lang === 'en' ? 'Home' : 'الرئيسية'}
        </button>
      )}

      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        display: 'flex',
        gap: '8px',
        zIndex: 10,
      }}>
        <button
          onClick={onLanguageChange}
          style={{
            padding: '8px 14px',
            borderRadius: '10px',
            border: '1px solid rgba(255,255,255,0.2)',
            background: 'rgba(255,255,255,0.1)',
            color: '#FFF',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer',
            backdropFilter: 'blur(10px)',
          }}
        >
          {lang === 'fr' ? 'FR' : lang === 'en' ? 'EN' : 'AR'}
        </button>
        <button
          onClick={onDarkModeToggle}
          style={{
            padding: '8px 14px',
            borderRadius: '10px',
            border: '1px solid rgba(255,255,255,0.2)',
            background: 'rgba(255,255,255,0.1)',
            color: '#FFF',
            fontSize: '18px',
            cursor: 'pointer',
            backdropFilter: 'blur(10px)',
          }}
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
      </div>

      <div style={{
        background: C.card,
        borderRadius: '24px',
        padding: '48px 40px',
        width: '100%',
        maxWidth: '420px',
        boxShadow: '0 25px 80px rgba(0,0,0,0.3)',
        border: darkMode ? '1px solid #334155' : 'none',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <Logo size="large" />
          <h1 style={{ margin: '16px 0 0', fontSize: '24px', fontWeight: '800', color: C.text }}>
            TSD et Fils
          </h1>
          <p style={{ margin: '8px 0 0', color: C.textSecondary, fontSize: '14px' }}>
            {lang === 'fr' ? 'Connectez-vous a votre compte' : lang === 'en' ? 'Sign in to your account' : 'تسجيل الدخول'}
          </p>
        </div>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: C.textSecondary, marginBottom: '6px' }}>
              {lang === 'fr' ? 'Email' : 'Email'}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder={lang === 'fr' ? 'votre@email.com' : 'your@email.com'}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '12px',
                border: `2px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
                fontSize: '14px',
                outline: 'none',
                background: darkMode ? '#1a2332' : '#FFF',
                color: C.text,
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: C.textSecondary, marginBottom: '6px' }}>
              {lang === 'fr' ? 'Mot de passe' : 'Password'}
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                style={{
                  width: '100%',
                  padding: '12px 48px 12px 16px',
                  borderRadius: '12px',
                  border: `2px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
                  fontSize: '14px',
                  outline: 'none',
                  background: darkMode ? '#1a2332' : '#FFF',
                  color: C.text,
                  boxSizing: 'border-box',
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '18px',
                  padding: '4px',
                }}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {error && (
            <div style={{
              padding: '12px',
              borderRadius: '10px',
              background: darkMode ? '#3b1c1c' : '#fef2f2',
              color: '#dc2626',
              fontSize: '13px',
              fontWeight: '500',
              marginBottom: '20px',
              textAlign: 'center',
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '12px',
              border: 'none',
              background: loading ? '#94a3b8' : `linear-gradient(135deg, ${C.primary}, ${C.secondary})`,
              color: '#FFF',
              fontSize: '15px',
              fontWeight: '700',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {loading
              ? (lang === 'fr' ? 'Connexion...' : 'Signing in...')
              : (lang === 'fr' ? 'Se connecter' : lang === 'en' ? 'Sign in' : 'تسجيل الدخول')
            }
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginScreen;
