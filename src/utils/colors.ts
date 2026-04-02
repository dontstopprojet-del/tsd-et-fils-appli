export const theme = {
  primary: '#0F766E',
  primaryLight: '#14B8A6',
  primaryDark: '#0D5F59',
  secondary: '#1E3A5F',
  secondaryLight: '#2D5A8E',
  accent: '#F59E0B',
  accentLight: '#FCD34D',
  success: '#16A34A',
  warning: '#EA580C',
  error: '#DC2626',
  bg: '#F8FAFC',
  card: '#FFFFFF',
  text: '#1E293B',
  textSecondary: '#64748B',
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
};

export function getRoleColor(role: string): string {
  switch (role) {
    case 'admin': return '#0F766E';
    case 'office': return '#1E3A5F';
    case 'tech': return '#EA580C';
    case 'client': return '#7C3AED';
    default: return '#64748B';
  }
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'planned': return '#3B82F6';
    case 'inProgress': return '#F59E0B';
    case 'completed': return '#16A34A';
    case 'interrupted': return '#EA580C';
    case 'abandoned': return '#DC2626';
    default: return '#64748B';
  }
}
