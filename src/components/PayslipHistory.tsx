import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const MONTHS = [
  'Janvier', 'Fevrier', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Aout', 'Septembre', 'Octobre', 'Novembre', 'Decembre',
];

interface FichePaieRow {
  id: string;
  employe_id: string;
  mois: number;
  annee: number;
  total_heures: number;
  salaire_brut: number;
  retenue_18_pourcent: number;
  salaire_net: number;
  primes: number;
  avances: number;
  created_at: string;
  employe_name?: string;
  employe_echelon?: string;
}

const PayslipHistory = () => {
  const [fiches, setFiches] = useState<FichePaieRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterMonth, setFilterMonth] = useState(0);
  const [filterYear, setFilterYear] = useState(new Date().getFullYear());

  useEffect(() => {
    loadHistory();
  }, [filterMonth, filterYear]);

  const loadHistory = async () => {
    setLoading(true);
    let query = supabase
      .from('fiches_paie')
      .select('*')
      .eq('annee', filterYear)
      .order('mois', { ascending: false });

    if (filterMonth > 0) {
      query = query.eq('mois', filterMonth);
    }

    const { data } = await query;

    if (data) {
      const employeIds = [...new Set(data.map(f => f.employe_id))];
      const { data: users } = await supabase
        .from('app_users')
        .select('id, name, echelon')
        .in('id', employeIds);

      const userMap = new Map(users?.map(u => [u.id, u]) || []);

      setFiches(data.map(f => ({
        ...f,
        employe_name: userMap.get(f.employe_id)?.name || 'Inconnu',
        employe_echelon: userMap.get(f.employe_id)?.echelon || '-',
      })));
    }

    setLoading(false);
  };

  const fmt = (n: number) => Number(n).toLocaleString('fr-FR');

  return (
    <div style={{
      background: '#FFF',
      borderRadius: '20px',
      padding: '32px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
      }}>
        <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>
          Historique des Fiches de Paie
        </h2>
        <div style={{ display: 'flex', gap: '12px' }}>
          <select
            value={filterMonth}
            onChange={(e) => setFilterMonth(Number(e.target.value))}
            style={{
              padding: '8px 16px',
              borderRadius: '10px',
              border: '2px solid #e2e8f0',
              fontSize: '13px',
              outline: 'none',
            }}
          >
            <option value={0}>Tous les mois</option>
            {MONTHS.map((m, i) => (
              <option key={i} value={i + 1}>{m}</option>
            ))}
          </select>
          <select
            value={filterYear}
            onChange={(e) => setFilterYear(Number(e.target.value))}
            style={{
              padding: '8px 16px',
              borderRadius: '10px',
              border: '2px solid #e2e8f0',
              fontSize: '13px',
              outline: 'none',
            }}
          >
            {[2024, 2025, 2026, 2027].map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>Chargement...</div>
      ) : fiches.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px', opacity: 0.4 }}>{'\u{1F4C2}'}</div>
          <div style={{ fontSize: '15px', fontWeight: '600' }}>Aucune fiche de paie trouvee</div>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                <th style={thStyle}>Employe</th>
                <th style={thStyle}>Echelon</th>
                <th style={thStyle}>Periode</th>
                <th style={{ ...thStyle, textAlign: 'center' }}>Heures</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>Brut</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>Retenue 18%</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>Primes</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>Avances</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>Net a Payer</th>
              </tr>
            </thead>
            <tbody>
              {fiches.map((fiche) => (
                <tr key={fiche.id} style={{
                  borderBottom: '1px solid #f1f5f9',
                  transition: 'background 0.15s',
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#f8fafc'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                >
                  <td style={{ ...tdStyle, fontWeight: '700' }}>
                    {fiche.employe_name?.toUpperCase()}
                  </td>
                  <td style={{ ...tdStyle, fontSize: '12px', color: '#0891b2' }}>
                    {fiche.employe_echelon}
                  </td>
                  <td style={tdStyle}>
                    {MONTHS[fiche.mois - 1]} {fiche.annee}
                  </td>
                  <td style={{ ...tdStyle, textAlign: 'center' }}>
                    {fmt(fiche.total_heures)} h
                  </td>
                  <td style={{ ...tdStyle, textAlign: 'right' }}>
                    {fmt(fiche.salaire_brut)}
                  </td>
                  <td style={{ ...tdStyle, textAlign: 'right', color: '#dc2626' }}>
                    -{fmt(fiche.retenue_18_pourcent)}
                  </td>
                  <td style={{ ...tdStyle, textAlign: 'right', color: '#059669' }}>
                    +{fmt(fiche.primes)}
                  </td>
                  <td style={{ ...tdStyle, textAlign: 'right', color: '#dc2626' }}>
                    -{fmt(fiche.avances)}
                  </td>
                  <td style={{ ...tdStyle, textAlign: 'right', fontWeight: '800', color: '#059669' }}>
                    {fmt(fiche.salaire_net)} GNF
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const thStyle: React.CSSProperties = {
  padding: '12px 16px',
  fontSize: '11px',
  fontWeight: '700',
  color: '#64748b',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  textAlign: 'left',
  whiteSpace: 'nowrap',
};

const tdStyle: React.CSSProperties = {
  padding: '12px 16px',
  fontSize: '13px',
  color: '#0f172a',
  whiteSpace: 'nowrap',
};

export default PayslipHistory;
