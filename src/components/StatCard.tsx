import { theme } from '../utils/colors';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: string;
  color: string;
  subtitle?: string;
}

export default function StatCard({ label, value, icon, color, subtitle }: StatCardProps) {
  return (
    <div
      style={{
        background: theme.card,
        borderRadius: '14px',
        padding: '20px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        border: `1px solid ${theme.border}`,
        display: 'flex',
        alignItems: 'flex-start',
        gap: '16px',
        transition: 'transform 0.15s, box-shadow 0.15s',
        cursor: 'default',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.06)';
      }}
    >
      <div
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          background: `${color}15`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '22px',
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div>
        <div style={{ fontSize: '13px', color: theme.textSecondary, marginBottom: '4px' }}>
          {label}
        </div>
        <div style={{ fontSize: '26px', fontWeight: 700, color: theme.text, lineHeight: 1.1 }}>
          {value}
        </div>
        {subtitle && (
          <div style={{ fontSize: '12px', color: theme.textSecondary, marginTop: '4px' }}>
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
}
