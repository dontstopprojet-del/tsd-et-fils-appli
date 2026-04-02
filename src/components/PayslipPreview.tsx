const MONTHS = [
  'Janvier', 'Fevrier', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Aout', 'Septembre', 'Octobre', 'Novembre', 'Decembre',
];

interface PayslipData {
  employe: {
    name: string;
    echelon: string | null;
    email: string;
    phone: string | null;
    contract_number: string | null;
    contract_date: string | null;
  };
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
}

interface PayslipPreviewProps {
  payslip: PayslipData;
  onClose: () => void;
}

const PayslipPreview = ({ payslip, onClose }: PayslipPreviewProps) => {
  const handlePrint = () => {
    const printContent = document.getElementById('payslip-print-area');
    if (!printContent) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Fiche de Paie - ${payslip.employe.name}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Inter', sans-serif; padding: 40px; color: #0f172a; }
          @media print { body { padding: 20px; } }
        </style>
      </head>
      <body>${printContent.innerHTML}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.print();
    };
  };

  const fmt = (n: number) => n.toLocaleString('fr-FR');

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      backdropFilter: 'blur(4px)',
      padding: '20px',
    }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#FFF',
          borderRadius: '20px',
          width: '100%',
          maxWidth: '700px',
          maxHeight: '90vh',
          overflow: 'auto',
          boxShadow: '0 25px 80px rgba(0,0,0,0.3)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{
          padding: '20px 28px',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          background: '#FFF',
          borderRadius: '20px 20px 0 0',
          zIndex: 1,
        }}>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700' }}>Apercu Fiche de Paie</h3>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={handlePrint}
              style={{
                padding: '10px 20px',
                borderRadius: '10px',
                border: 'none',
                background: 'linear-gradient(135deg, #0891b2, #06b6d4)',
                color: '#FFF',
                fontSize: '13px',
                fontWeight: '700',
                cursor: 'pointer',
              }}
            >
              Imprimer
            </button>
            <button
              onClick={onClose}
              style={{
                padding: '10px 20px',
                borderRadius: '10px',
                border: '2px solid #e2e8f0',
                background: '#FFF',
                color: '#475569',
                fontSize: '13px',
                fontWeight: '700',
                cursor: 'pointer',
              }}
            >
              Fermer
            </button>
          </div>
        </div>

        <div id="payslip-print-area" style={{ padding: '40px' }}>
          <div style={{
            border: '2px solid #0f172a',
            borderRadius: '4px',
            padding: '32px',
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '32px',
              paddingBottom: '20px',
              borderBottom: '2px solid #0f172a',
            }}>
              <div>
                <div style={{ fontSize: '22px', fontWeight: '900', color: '#0f172a' }}>TSD ET FILS</div>
                <div style={{ fontSize: '12px', color: '#475569', marginTop: '4px' }}>
                  Entreprise de Services Techniques
                </div>
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                  Conakry, Republique de Guinee
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{
                  fontSize: '16px',
                  fontWeight: '800',
                  color: '#0f172a',
                  textTransform: 'uppercase',
                  letterSpacing: '2px',
                }}>
                  Fiche de Paie
                </div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#0891b2', marginTop: '4px' }}>
                  {MONTHS[payslip.mois - 1]} {payslip.annee}
                </div>
              </div>
            </div>

            <div style={{
              padding: '16px 20px',
              background: '#f8fafc',
              borderRadius: '4px',
              marginBottom: '24px',
              border: '1px solid #e2e8f0',
            }}>
              <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px', color: '#64748b', marginBottom: '6px' }}>
                Employe
              </div>
              <div style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', marginBottom: '2px' }}>
                {payslip.employe.name.toUpperCase()}
              </div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#0891b2' }}>
                {payslip.employe.echelon || '-'}
              </div>
              {payslip.employe.contract_number && (
                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '6px' }}>
                  Contrat N: {payslip.employe.contract_number}
                </div>
              )}
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '24px' }}>
              <thead>
                <tr>
                  <th style={printTh}>Designation</th>
                  <th style={{ ...printTh, textAlign: 'right' }}>Montant</th>
                </tr>
              </thead>
              <tbody>
                <tr style={printTrBorder}>
                  <td style={printTd}>Heures totales travaillees</td>
                  <td style={{ ...printTd, textAlign: 'right', fontWeight: '600' }}>
                    {payslip.totalHeures} h
                  </td>
                </tr>
                <tr style={printTrBorder}>
                  <td style={printTd}>Tarif horaire</td>
                  <td style={{ ...printTd, textAlign: 'right', fontWeight: '600' }}>
                    {fmt(payslip.tarifHoraire)} GNF/h
                  </td>
                </tr>
                <tr style={{ ...printTrBorder, background: '#f8fafc' }}>
                  <td style={{ ...printTd, fontWeight: '700' }}>SALAIRE BRUT</td>
                  <td style={{ ...printTd, textAlign: 'right', fontWeight: '800', fontSize: '15px' }}>
                    {fmt(payslip.salaireBrut)} GNF
                  </td>
                </tr>
                <tr style={printTrBorder}>
                  <td style={{ ...printTd, color: '#dc2626' }}>Retenue 18%</td>
                  <td style={{ ...printTd, textAlign: 'right', color: '#dc2626', fontWeight: '600' }}>
                    - {fmt(payslip.retenue18)} GNF
                  </td>
                </tr>
                <tr style={{ ...printTrBorder, background: '#f0fdfa' }}>
                  <td style={{ ...printTd, fontWeight: '700', color: '#0891b2' }}>SALAIRE NET</td>
                  <td style={{ ...printTd, textAlign: 'right', fontWeight: '800', fontSize: '15px', color: '#0891b2' }}>
                    {fmt(payslip.salaireNet)} GNF
                  </td>
                </tr>
                {payslip.primes > 0 && (
                  <tr style={printTrBorder}>
                    <td style={{ ...printTd, color: '#059669' }}>Primes</td>
                    <td style={{ ...printTd, textAlign: 'right', color: '#059669', fontWeight: '600' }}>
                      + {fmt(payslip.primes)} GNF
                    </td>
                  </tr>
                )}
                {payslip.avances > 0 && (
                  <tr style={printTrBorder}>
                    <td style={{ ...printTd, color: '#dc2626' }}>Avance sur salaire</td>
                    <td style={{ ...printTd, textAlign: 'right', color: '#dc2626', fontWeight: '600' }}>
                      - {fmt(payslip.avances)} GNF
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                <tr style={{ background: '#0f172a' }}>
                  <td style={{ ...printTd, color: '#FFF', fontWeight: '800', fontSize: '15px' }}>
                    NET A PAYER
                  </td>
                  <td style={{ ...printTd, textAlign: 'right', color: '#FFF', fontWeight: '900', fontSize: '18px' }}>
                    {fmt(payslip.netAPayer)} GNF
                  </td>
                </tr>
              </tfoot>
            </table>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '48px',
              paddingTop: '20px',
              borderTop: '1px solid #e2e8f0',
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '40px' }}>
                  Signature de l'employe
                </div>
                <div style={{ borderTop: '1px solid #0f172a', width: '180px', paddingTop: '4px', fontSize: '11px', color: '#64748b' }}>
                  {payslip.employe.name}
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '40px' }}>
                  Signature de l'employeur
                </div>
                <div style={{ borderTop: '1px solid #0f172a', width: '180px', paddingTop: '4px', fontSize: '11px', color: '#64748b' }}>
                  TSD et Fils
                </div>
              </div>
            </div>

            <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '10px', color: '#94a3b8' }}>
              Document genere le {new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const printTh: React.CSSProperties = {
  padding: '12px 16px',
  fontSize: '11px',
  fontWeight: '700',
  color: '#64748b',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  textAlign: 'left',
  borderBottom: '2px solid #0f172a',
};

const printTd: React.CSSProperties = {
  padding: '12px 16px',
  fontSize: '13px',
  color: '#0f172a',
};

const printTrBorder: React.CSSProperties = {
  borderBottom: '1px solid #e2e8f0',
};

export default PayslipPreview;
