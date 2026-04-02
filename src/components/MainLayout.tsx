import { useState, lazy, Suspense } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { theme } from '../utils/colors';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';

const ProjectsList = lazy(() => import('./ProjectsList'));
const PlanningView = lazy(() => import('./PlanningView'));
const TeamList = lazy(() => import('./TeamList'));
const ClientsList = lazy(() => import('./ClientsList'));
const InvoicesList = lazy(() => import('./InvoicesList'));
const MessagesView = lazy(() => import('./MessagesView'));
const SettingsView = lazy(() => import('./SettingsView'));

function LoadingFallback() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        color: theme.textSecondary,
        fontSize: '14px',
      }}
    >
      <div
        style={{
          width: '28px',
          height: '28px',
          border: `3px solid ${theme.border}`,
          borderTop: `3px solid ${theme.primary}`,
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }}
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default function MainLayout() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'projects':
        return <ProjectsList />;
      case 'planning':
        return <PlanningView />;
      case 'team':
        return <TeamList />;
      case 'clients':
        return <ClientsList />;
      case 'invoices':
        return <InvoicesList />;
      case 'messages':
        return <MessagesView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', background: theme.bg, overflow: 'hidden' }}>
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <main style={{ flex: 1, overflow: 'auto' }}>
        <Suspense fallback={<LoadingFallback />}>{renderContent()}</Suspense>
      </main>
    </div>
  );
}
