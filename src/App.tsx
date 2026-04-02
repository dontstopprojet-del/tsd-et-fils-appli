import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginScreen from './components/LoginScreen';
import MainLayout from './components/MainLayout';
import { theme } from './utils/colors';

function AppContent() {
  const { session, user, loading } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: theme.bg,
        }}
      >
        <div
          style={{
            width: '40px',
            height: '40px',
            border: `4px solid ${theme.border}`,
            borderTop: `4px solid ${theme.primary}`,
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!session || !user) {
    return <LoginScreen />;
  }

  return <MainLayout />;
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
