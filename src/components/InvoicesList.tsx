import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { theme } from '../utils/colors';
import { t } from '../utils/translations';
import { formatDate, formatCurrency } from '../utils/format';

export default function InvoicesList() {
  const { lang } = useAuth();
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInvoices();
  }, []);

  async function loadInvoices() {
    const { data } = await supabase
      .from('invoices')
      .select('*')
      .order('created_at', { ascending: false });
    setInvoices(data || []);
    setLoading(false);
  }

  const getInvoiceStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return theme.success;
      case 'pending': return theme.accent;
      case 'overdue': return theme.error;
      case 'cancelled': return theme.textSecondary;
      default: return theme.textSecondary;
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: theme.textSecondary }}>
        {t('loading', lang)}
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', maxWidth: '1000px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 700, color: theme.text, margin: '0 0 20px' }}>
        {t('invoices', lang)}
      </h1>

      {invoices.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: theme.textSecondary }}>
          {t('noData', lang)}
        </div>
      ) : (
        <div
          style={{
            background: theme.card,
            borderRadius: '14px',
            border: `1px solid ${theme.border}`,
            overflow: 'hidden',
          }}
        >
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['#', lang === 'fr' ? 'Client' : 'Client', t('date', lang), t('total', lang), t('status', lang)].map((h, i) => (
                    <th
                      key={i}
                      style={{
                        textAlign: 'left',
                        padding: '12px 16px',
                        fontSize: '12px',
                        fontWeight: 600,
                        color: theme.textSecondary,
                        textTransform: 'uppercase',
                        borderBottom: `1px solid ${theme.border}`,
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => (
                  <tr
                    key={inv.id}
                    style={{ transition: 'background 0.1s' }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = theme.borderLight)}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <td style={{ padding: '12px 16px', fontWeight: 600, color: theme.primary, fontSize: '14px' }}>
                      {inv.invoice_number || inv.id?.slice(0, 8)}
                    </td>
                    <td style={{ padding: '12px 16px', color: theme.text, fontSize: '14px' }}>
                      {inv.client_name || '-'}
                    </td>
                    <td style={{ padding: '12px 16px', color: theme.textSecondary, fontSize: '13px' }}>
                      {formatDate(inv.created_at, lang)}
                    </td>
                    <td style={{ padding: '12px 16px', fontWeight: 600, color: theme.text, fontSize: '14px' }}>
                      {formatCurrency(inv.total_amount || inv.amount)}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span
                        style={{
                          padding: '3px 10px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: 600,
                          background: `${getInvoiceStatusColor(inv.status)}15`,
                          color: getInvoiceStatusColor(inv.status),
                        }}
                      >
                        {inv.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
