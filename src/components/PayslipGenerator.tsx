import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { AppUser, TarifHoraire, HeuresTravail } from '../types';
import PayslipPreview from './PayslipPreview';

interface PayslipGeneratorProps {
  currentUser: AppUser;
}

interface ComputedPayslip {
  employe: AppUser;
  mois: number;
  annee: number;
  totalHeures: number;
  tarifHoraire: number;
  salaireBrut: number;
  retenue18: number;
  salaireNet: number;
  primes: number;
  avances: number;
  netAPayer: number;
  heuresDetail: HeuresTravail[];
}

const MONTHS = [
  'Janvier', 'Fevrier', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Aout', 'Septembre', 'Octobre', 'Novembre', 'Decembre',
];

const PayslipGenerator = ({ currentUser }: PayslipGeneratorProps) => {
  const [employees, setEmployees] = useState<AppUser[]>([]);
  const [tarifs, setTarifs] = useState<TarifHoraire[]>([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [primes, setPrimes] = useState(0);
  const [avances, setAvances] = useState(0);
  const [computedPayslip, setComputedPayslip] = useState<ComputedPayslip | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    loadEmployees();
    loadTarifs();
  }, []);

  const loadEmployees = async () => {
    const { data } = await supabase
      .from('app_users')
      .select('*')
      .in('role', ['tech', 'office_employee'])
      .order('name');
    if (data) setEmployees(data);
  };

  const loadTarifs = async () => {
    const { data } = await supabase
      .from('tarifs_horaires')
      .select('*')
      .order('categorie', { ascending: true });
    if (data) setTarifs(data);
  };

  const findTarifForEmployee = useCallback((employee: AppUser): number => {
    if (!employee.echelon) return 0;

    const echelonLower = employee.echelon.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    for (const tarif of tarifs) {
      const tarifRole = tarif.role.toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '');

      if (echelonLower.includes(tarifRole) || tarifRole.includes(echelonLower)) {
        return Number(tarif.salaire_horaire_gnf);
      }

      const echelonWords = echelonLower.split(/[\s'_]+/).filter(w => w.length > 2);
      const tarifWords = tarifRole.split(/[\s'_]+/).filter(w => w.length > 2);
      const matchCount = echelonWords.filter(w => tarifWords.some(tw => tw.includes(w) || w.includes(tw))).length;
      if (matchCount >= 2 || (matchCount >= 1 && echelonWords.length <= 2)) {
        return Number(tarif.salaire_horaire_gnf);
      }
    }

    return 0;
  }, [tarifs]);

  const computePayslip = useCallback(async () => {
    if (!selectedEmployeeId) return;

    setLoading(true);
    setSaveSuccess(false);

    const employee = employees.find(e => e.id === selectedEmployeeId);
    if (!employee) {
      setLoading(false);
      return;
    }

    const startDate = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-01`;
    const endMonth = selectedMonth === 12 ? 1 : selectedMonth + 1;
    const endYear = selectedMonth === 12 ? selectedYear + 1 : selectedYear;
    const endDate = `${endYear}-${String(endMonth).padStart(2, '0')}-01`;

    const { data: heures } = await supabase
      .from('heures_travail')
      .select('*')
      .eq('employe_id', employee.id)
      .gte('date', startDate)
      .lt('date', endDate)
      .order('date');

    const heuresDetail = heures || [];
    const totalHeures = heuresDetail.reduce((sum, h) => sum + Number(h.nombre_heures), 0);

    const tarifHoraire = findTarifForEmployee(employee);
    const salaireBrut = totalHeures * tarifHoraire;
    const retenue18 = Math.round(salaireBrut * 0.18);
    const salaireNet = salaireBrut - retenue18;
    const netAPayer = salaireNet + primes - avances;

    setComputedPayslip({
      employe: employee,
      mois: selectedMonth,
      annee: selectedYear,
      totalHeures,
      tarifHoraire,
      salaireBrut,
      retenue18,
      salaireNet,
      primes,
      avances,
      netAPayer,
      heuresDetail,
    });

    setLoading(false);
  }, [selectedEmployeeId, selectedMonth, selectedYear, primes, avances, employees, findTarifForEmployee]);

  useEffect(() => {
    if (selectedEmployeeId) {
      computePayslip();
    } else {
      setComputedPayslip(null);
    }
  }, [selectedEmployeeId, selectedMonth, selectedYear, computePayslip]);

  useEffect(() => {
    if (computedPayslip) {
      const salaireNet = computedPayslip.salaireBrut - computedPayslip.retenue18;
      const netAPayer = salaireNet + primes - avances;
      setComputedPayslip(prev => prev ? {
        ...prev,
        primes,
        avances,
        salaireNet,
        netAPayer,
      } : null);
    }
  }, [primes, avances]);

  const savePayslip = async () => {
    if (!computedPayslip) return;

    setSaving(true);
    const { error } = await supabase
      .from('fiches_paie')
      .upsert({
        employe_id: computedPayslip.employe.id,
        mois: computedPayslip.mois,
        annee: computedPayslip.annee,
        total_heures: computedPayslip.totalHeures,
        salaire_brut: computedPayslip.salaireBrut,
        retenue_18_pourcent: computedPayslip.retenue18,
        salaire_net: computedPayslip.netAPayer,
        primes: computedPayslip.primes,
        avances: computedPayslip.avances,
      }, {
        onConflict: 'employe_id,mois,annee',
      });

    setSaving(false);
    if (!error) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  const selectedEmployee = employees.find(e => e.id === selectedEmployeeId);

  return (
    <div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '24px',
      }}>
        <div style={{
          background: '#FFF',
          borderRadius: '20px',
          padding: '32px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        }}>
          <h2 style={{ margin: '0 0 24px', fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>
            Selection de l'employe
          </h2>

          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Employe</label>
            <select
              value={selectedEmployeeId}
              onChange={(e) => {
                setSelectedEmployeeId(e.target.value);
                setPrimes(0);
                setAvances(0);
                setSaveSuccess(false);
              }}
              style={selectStyle}
            >
              <option value="">-- Selectionner un employe --</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name.toUpperCase()} {emp.echelon ? `- ${emp.echelon}` : ''}
                </option>
              ))}
            </select>
          </div>

          {selectedEmployee && (
            <div style={{
              padding: '20px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #f0fdfa, #ecfdf5)',
              border: '1px solid #99f6e4',
              marginBottom: '20px',
            }}>
              <div style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', marginBottom: '4px' }}>
                {selectedEmployee.name.toUpperCase()}
              </div>
              <div style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#0891b2',
                marginBottom: '12px',
                padding: '4px 12px',
                background: '#cffafe',
                borderRadius: '20px',
                display: 'inline-block',
              }}>
                {selectedEmployee.echelon || 'Echelon non defini'}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '13px', color: '#475569' }}>
                <div>Email: {selectedEmployee.email}</div>
                <div>Tel: {selectedEmployee.phone || '-'}</div>
                <div>Contrat: {selectedEmployee.contract_number || '-'}</div>
                <div>Date contrat: {selectedEmployee.contract_date || '-'}</div>
              </div>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
            <div>
              <label style={labelStyle}>Mois</label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                style={selectStyle}
              >
                {MONTHS.map((m, i) => (
                  <option key={i} value={i + 1}>{m}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Annee</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                style={selectStyle}
              >
                {[2024, 2025, 2026, 2027].map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Primes (GNF)</label>
              <input
                type="number"
                value={primes}
                onChange={(e) => setPrimes(Number(e.target.value) || 0)}
                min={0}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Avance sur salaire (GNF)</label>
              <input
                type="number"
                value={avances}
                onChange={(e) => setAvances(Number(e.target.value) || 0)}
                min={0}
                style={inputStyle}
              />
            </div>
          </div>
        </div>

        <div style={{
          background: '#FFF',
          borderRadius: '20px',
          padding: '32px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        }}>
          <h2 style={{ margin: '0 0 24px', fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>
            Fiche de Paie
          </h2>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
              Calcul en cours...
            </div>
          ) : !computedPayslip ? (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              color: '#94a3b8',
            }}>
              <div style={{ fontSize: '48px', marginBottom: '12px', opacity: 0.4 }}>
                {'\u{1F4C4}'}
              </div>
              <div style={{ fontSize: '15px', fontWeight: '600' }}>
                Selectionnez un employe pour generer la fiche de paie
              </div>
            </div>
          ) : (
            <div>
              <div style={{
                padding: '16px 20px',
                borderRadius: '14px',
                background: '#0f172a',
                color: '#FFF',
                marginBottom: '20px',
              }}>
                <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: '#94a3b8', marginBottom: '4px' }}>
                  Employe
                </div>
                <div style={{ fontSize: '18px', fontWeight: '800' }}>
                  {computedPayslip.employe.name.toUpperCase()}
                </div>
                <div style={{ fontSize: '13px', color: '#06b6d4', fontWeight: '600' }}>
                  {computedPayslip.employe.echelon || '-'}
                </div>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
                  {MONTHS[computedPayslip.mois - 1]} {computedPayslip.annee}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <PayslipRow
                  label="Heures Totales"
                  value={`${computedPayslip.totalHeures} h`}
                  highlight={false}
                />
                <PayslipRow
                  label={`Tarif horaire`}
                  value={`${computedPayslip.tarifHoraire.toLocaleString('fr-FR')} GNF/h`}
                  highlight={false}
                />

                <div style={{ height: '1px', background: '#e2e8f0', margin: '4px 0' }} />

                <PayslipRow
                  label="Salaire Brut"
                  value={`${computedPayslip.salaireBrut.toLocaleString('fr-FR')} GNF`}
                  highlight
                  color="#0f172a"
                />
                <PayslipRow
                  label="Retenue 18%"
                  value={`- ${computedPayslip.retenue18.toLocaleString('fr-FR')} GNF`}
                  highlight={false}
                  color="#dc2626"
                />

                <div style={{ height: '1px', background: '#e2e8f0', margin: '4px 0' }} />

                <PayslipRow
                  label="Salaire Net"
                  value={`${computedPayslip.salaireNet.toLocaleString('fr-FR')} GNF`}
                  highlight
                  color="#0891b2"
                />
                <PayslipRow
                  label="Primes"
                  value={`+ ${computedPayslip.primes.toLocaleString('fr-FR')} GNF`}
                  highlight={false}
                  color="#059669"
                />
                <PayslipRow
                  label="Avance sur Salaire"
                  value={`- ${computedPayslip.avances.toLocaleString('fr-FR')} GNF`}
                  highlight={false}
                  color="#dc2626"
                />

                <div style={{
                  padding: '16px 20px',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, #059669, #10b981)',
                  color: '#FFF',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: '8px',
                }}>
                  <span style={{ fontSize: '15px', fontWeight: '700' }}>NET A PAYER</span>
                  <span style={{ fontSize: '22px', fontWeight: '900' }}>
                    {computedPayslip.netAPayer.toLocaleString('fr-FR')} GNF
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button
                  onClick={savePayslip}
                  disabled={saving}
                  style={{
                    flex: 1,
                    padding: '14px',
                    borderRadius: '12px',
                    border: 'none',
                    background: saveSuccess
                      ? 'linear-gradient(135deg, #059669, #10b981)'
                      : 'linear-gradient(135deg, #0891b2, #06b6d4)',
                    color: '#FFF',
                    fontSize: '14px',
                    fontWeight: '700',
                    cursor: saving ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  {saving ? 'Enregistrement...' : saveSuccess ? 'Enregistre !' : 'Enregistrer la fiche'}
                </button>
                <button
                  onClick={() => setShowPreview(true)}
                  style={{
                    flex: 1,
                    padding: '14px',
                    borderRadius: '12px',
                    border: '2px solid #e2e8f0',
                    background: '#FFF',
                    color: '#0f172a',
                    fontSize: '14px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  Apercu / Imprimer
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {computedPayslip && computedPayslip.heuresDetail.length > 0 && (
        <div style={{
          marginTop: '24px',
          background: '#FFF',
          borderRadius: '20px',
          padding: '32px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        }}>
          <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>
            Detail des heures travaillees - {MONTHS[computedPayslip.mois - 1]} {computedPayslip.annee}
          </h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                <th style={thStyle}>Date</th>
                <th style={thStyle}>Heures</th>
                <th style={thStyle}>Tarif (GNF/h)</th>
                <th style={thStyle}>Total (GNF)</th>
              </tr>
            </thead>
            <tbody>
              {computedPayslip.heuresDetail.map((h) => (
                <tr key={h.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={tdStyle}>
                    {new Date(h.date).toLocaleDateString('fr-FR', { weekday: 'short', day: '2-digit', month: 'short' })}
                  </td>
                  <td style={{ ...tdStyle, textAlign: 'center' }}>{Number(h.nombre_heures)} h</td>
                  <td style={{ ...tdStyle, textAlign: 'right' }}>
                    {Number(h.tarif_horaire_gnf).toLocaleString('fr-FR')}
                  </td>
                  <td style={{ ...tdStyle, textAlign: 'right', fontWeight: '600' }}>
                    {(Number(h.total_gnf) || Number(h.nombre_heures) * Number(h.tarif_horaire_gnf)).toLocaleString('fr-FR')}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ borderTop: '2px solid #0f172a' }}>
                <td style={{ ...tdStyle, fontWeight: '800' }}>Total</td>
                <td style={{ ...tdStyle, fontWeight: '800', textAlign: 'center' }}>
                  {computedPayslip.totalHeures} h
                </td>
                <td style={tdStyle}></td>
                <td style={{ ...tdStyle, fontWeight: '800', textAlign: 'right' }}>
                  {computedPayslip.salaireBrut.toLocaleString('fr-FR')} GNF
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}

      {showPreview && computedPayslip && (
        <PayslipPreview
          payslip={computedPayslip}
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  );
};

const PayslipRow = ({
  label,
  value,
  highlight,
  color,
}: {
  label: string;
  value: string;
  highlight: boolean;
  color?: string;
}) => (
  <div style={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: highlight ? '12px 16px' : '6px 16px',
    borderRadius: highlight ? '10px' : '0',
    background: highlight ? '#f8fafc' : 'transparent',
  }}>
    <span style={{
      fontSize: '13px',
      fontWeight: highlight ? '700' : '500',
      color: '#475569',
    }}>
      {label}
    </span>
    <span style={{
      fontSize: highlight ? '16px' : '14px',
      fontWeight: highlight ? '800' : '600',
      color: color || '#0f172a',
    }}>
      {value}
    </span>
  </div>
);

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '13px',
  fontWeight: '600',
  color: '#374151',
  marginBottom: '6px',
};

const selectStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 16px',
  borderRadius: '12px',
  border: '2px solid #e2e8f0',
  fontSize: '14px',
  outline: 'none',
  background: '#FFF',
  color: '#0f172a',
  boxSizing: 'border-box',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 16px',
  borderRadius: '12px',
  border: '2px solid #e2e8f0',
  fontSize: '14px',
  outline: 'none',
  background: '#FFF',
  color: '#0f172a',
  boxSizing: 'border-box',
};

const thStyle: React.CSSProperties = {
  padding: '12px 16px',
  fontSize: '12px',
  fontWeight: '700',
  color: '#64748b',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  textAlign: 'left',
};

const tdStyle: React.CSSProperties = {
  padding: '12px 16px',
  fontSize: '14px',
  color: '#0f172a',
};

export default PayslipGenerator;
