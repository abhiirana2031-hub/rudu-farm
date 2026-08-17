import React from 'react';
import { DocumentHeader } from '../shared/DocumentHeader';
import { DocumentFooter } from '../shared/DocumentFooter';
import { DocumentMeta } from '../shared/DocumentMeta';
import { SignatureSection } from '../shared/SignatureSection';
import { PaperFormat } from '@/services/documents/templates.registry';

interface LedgerRow {
  date: string;
  reference: string;
  description: string;
  credit?: number;
  debit?: number;
  balance: number;
}

interface FarmerLedgerProps {
  format?: PaperFormat;
  docData: {
    docNumber?: string;
    startDate?: string;
    endDate?: string;
    farmerId?: string;
    farmerName?: string;
    farmerPhone?: string;
    village?: string;
    rows?: LedgerRow[];
    openingBalance?: number;
  };
  tenantInfo?: any;
}

export const FarmerLedgerTemplate: React.FC<FarmerLedgerProps> = ({
  format = 'A4',
  docData,
  tenantInfo
}) => {
  const docNumber = docData.docNumber || 'LEDGER-20260817-001024';
  const startDate = docData.startDate || '2026-08-01';
  const endDate = docData.endDate || '2026-08-17';
  const farmerName = docData.farmerName || 'Ramesh Yadav';
  const farmerId = docData.farmerId || 'RF1024';

  const rows: LedgerRow[] = docData.rows || [
    { date: '2026-08-01', reference: 'ENTRY-1001', description: 'Milk Collection (14.5 L @ ₹49.50)', credit: 717.75, balance: 717.75 },
    { date: '2026-08-02', reference: 'ENTRY-1004', description: 'Milk Collection (15.0 L @ ₹48.80)', credit: 732.00, balance: 1449.75 },
    { date: '2026-08-03', reference: 'ADV-0042', description: 'Cattle Feed Advance Issued', debit: 500.00, balance: 949.75 },
    { date: '2026-08-05', reference: 'ENTRY-1012', description: 'Milk Collection (15.5 L @ ₹50.20)', credit: 778.10, balance: 1727.85 },
    { date: '2026-08-10', reference: 'PAY-8910', description: 'Milk Settlement Payout (UPI)', debit: 1500.00, balance: 227.85 },
  ];

  const totalCredit = rows.reduce((sum, r) => sum + (r.credit || 0), 0);
  const totalDebit = rows.reduce((sum, r) => sum + (r.debit || 0), 0);
  const closingBalance = rows.length > 0 ? rows[rows.length - 1].balance : 0;

  return (
    <div className="document-container" style={{ padding: format === 'A5' ? '16px' : '24px' }}>
      <DocumentHeader title="FARMER LEDGER STATEMENT" subtitle={`Statement Period: ${startDate} to ${endDate}`} format={format} tenantInfo={tenantInfo} />
      <DocumentMeta docNumber={docNumber} date={new Date().toISOString().split('T')[0]} status="Official" format={format} />

      {/* Farmer Details Header */}
      <div style={{ background: '#FFFFFF', border: '1.5px solid #CBD5E1', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', fontSize: '12.5px' }}>
          <div>
            <span style={{ color: '#64748B', fontSize: '11px' }}>Farmer Name:</span><br />
            <strong style={{ color: '#4E2A18', fontSize: '15px' }}>{farmerName}</strong>
          </div>
          <div>
            <span style={{ color: '#64748B', fontSize: '11px' }}>Farmer ID:</span><br />
            <strong>{farmerId}</strong>
          </div>
          <div>
            <span style={{ color: '#64748B', fontSize: '11px' }}>Village:</span><br />
            <strong>{docData.village || 'Kheda'}</strong>
          </div>
        </div>
      </div>

      {/* Ledger Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px', fontSize: '12px' }}>
        <thead>
          <tr style={{ background: '#4E2A18', color: '#FFFFFF', textAlign: 'left' }}>
            <th style={{ padding: '9px 10px', borderRadius: '6px 0 0 6px' }}>Date</th>
            <th style={{ padding: '9px 10px' }}>Ref #</th>
            <th style={{ padding: '9px 10px' }}>Transaction Description</th>
            <th style={{ padding: '9px 10px', textAlign: 'right' }}>Credit (₹)</th>
            <th style={{ padding: '9px 10px', textAlign: 'right' }}>Debit (₹)</th>
            <th style={{ padding: '9px 10px', textAlign: 'right', borderRadius: '0 6px 6px 0' }}>Balance (₹)</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, idx) => (
            <tr key={idx} style={{ borderBottom: '1px solid #E2E8F0', background: idx % 2 === 0 ? '#FFFFFF' : '#F8FAF9' }}>
              <td style={{ padding: '9px 10px', fontWeight: '700' }}>{r.date}</td>
              <td style={{ padding: '9px 10px', color: '#64748B' }}>{r.reference}</td>
              <td style={{ padding: '9px 10px', color: '#1E293B' }}>{r.description}</td>
              <td style={{ padding: '9px 10px', textAlign: 'right', color: '#16A34A', fontWeight: '700' }}>
                {r.credit ? `+₹${r.credit.toFixed(2)}` : '-'}
              </td>
              <td style={{ padding: '9px 10px', textAlign: 'right', color: '#DC2626', fontWeight: '700' }}>
                {r.debit ? `-₹${r.debit.toFixed(2)}` : '-'}
              </td>
              <td style={{ padding: '9px 10px', textAlign: 'right', fontWeight: '900', color: '#4E2A18' }}>
                ₹{r.balance.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Ledger Totals Footer */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '20px' }}>
        <div style={{ background: '#EAF4EE', border: '1px solid #BBF7D0', borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: '11px', color: '#166534', fontWeight: '800' }}>TOTAL CREDIT (EARNED)</div>
          <div style={{ fontSize: '18px', fontWeight: '900', color: '#15803D' }}>₹{totalCredit.toFixed(2)}</div>
        </div>
        <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: '11px', color: '#991B1B', fontWeight: '800' }}>TOTAL DEBIT (PAID/ADVANCE)</div>
          <div style={{ fontSize: '18px', fontWeight: '900', color: '#DC2626' }}>₹{totalDebit.toFixed(2)}</div>
        </div>
        <div style={{ background: '#4E2A18', color: '#FFFFFF', borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: '11px', opacity: 0.9, fontWeight: '800' }}>CLOSING BALANCE</div>
          <div style={{ fontSize: '18px', fontWeight: '900' }}>₹{closingBalance.toFixed(2)}</div>
        </div>
      </div>

      <SignatureSection leftLabel="Farmer Signature" rightLabel="Chief Accountant Signature" format={format} />
      <DocumentFooter format={format} tenantName={tenantInfo?.name} />
    </div>
  );
};
