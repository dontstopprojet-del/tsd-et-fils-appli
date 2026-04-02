import { useState } from 'react';
import type { AppUser } from '../types';
import PayslipGenerator from './PayslipGenerator';
import PayslipHistory from './PayslipHistory';

interface DashboardProps {
  currentUser: AppUser;
  onLogout: () => void;
}

const Dashboard = ({ currentUser, onLogout }: DashboardProps) => {
  const [activeTab, setActiveTab] = useState<'generate' | 'history'>('generate');

  const tabs = [
    { id: 'generate' as const, label: 'Generer Fiche de Paie', icon: '+' },
    { id: 'history' as const, label: 'Historique', icon: '\u{1F4CB}' },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f8fafc',
      fontFamily: 'Inter, system-ui, sans-serif',
    }}>
      <header style={{
        background: 'linear-gradient(135deg, #0f172a, #1e293b)',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #0891b2, #06b6d4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
            fontWeight: '900',
            color: '#FFF',
          }}>
            T
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#FFF' }}>
              TSD et Fils
            </h1>
            <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>
              Gestion de la Paie
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontSize: '13px', color: '#94a3b8' }}>{currentUser.name}</span>
          <button
            onClick={onLogout}
            style={{
              padding: '8px 16px',
              borderRadius: '10px',
              border: '1px solid #334155',
              background: 'transparent',
              color: '#94a3b8',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#334155';
              e.currentTarget.style.color = '#FFF';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '#94a3b8';
            }}
          >
            Deconnexion
          </button>
        </div>
      </header>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '24px',
          background: '#FFF',
          padding: '6px',
          borderRadius: '14px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                padding: '12px 20px',
                borderRadius: '10px',
                border: 'none',
                background: activeTab === tab.id ? 'linear-gradient(135deg, #0891b2, #06b6d4)' : 'transparent',
                color: activeTab === tab.id ? '#FFF' : '#64748b',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'generate' && <PayslipGenerator currentUser={currentUser} />}
        {activeTab === 'history' && <PayslipHistory />}
      </div>
    </div>
  );
};

export default Dashboard;
