import React from 'react';
import { DocumentHeader } from '../shared/DocumentHeader';
import { DocumentFooter } from '../shared/DocumentFooter';
import { DocumentMeta } from '../shared/DocumentMeta';
import { SignatureSection } from '../shared/SignatureSection';
import { PaperFormat } from '@/services/documents/templates.registry';

interface CenterDailySummaryProps {
  format?: PaperFormat;
  docData: {
    docNumber?: string;
    date?: string;
    centerName?: string;
    operatorName?: string;
    totalFarmers?: number;
    totalLiters?: number;
    cowLiters?: number;
    buffaloLiters?: number;
    avgFat?: number;
    avgSnf?: number;
    totalAmount?: number;
    entries?: Array<{ time: string; farmer: string; milkType: string; qty: number; fat: number; snf: number; amount: number; operator: string }>;
  };
  tenantInfo?: any;
}

export const CenterDailySummaryTemplate: React.FC<CenterDailySummaryProps> = ({
  format = 'A4',
  docData,
  tenantInfo
}) => {
  const docNumber = docData.docNumber || 'CCREP-20260817-001';
  const date = docData.date || new Date().toISOString().split('T')[0];
  const centerName = docData.centerName || 'Rudu Main Collection Center';

  const entries = docData.entries || [
    { time: '06:30 AM', farmer: 'Ramesh Yadav (RF1024)', milkType: 'Cow', qty: 14.5, fat: 4.2, snf: 8.6, amount: 717.75, operator: 'Amit Kumar' },
    { time: '06:45 AM', farmer: 'Suresh Chaudhary (RF1025)', milkType: 'Buffalo', qty: 18.0, fat: 6.8, snf: 9.1, amount: 1152.00, operator: 'Amit Kumar' },
    { time: '07:10 AM', farmer: 'Vikram Singh (RF1026)', milkType: 'Cow', qty: 22.5, fat: 4.4, snf: 8.7, amount: 1147.50, operator: 'Amit Kumar' },
  ];

  const totalLiters = docData.totalLiters || entries.reduce((s, e) => s + e.qty, 0);
  const totalAmount = docData.totalAmount || entries.reduce((s, e) => s + e.amount, 0);

  return (
    <div className="document-container" style={{ padding: format === 'A5' ? '16px' : '24px' }}>
      <DocumentHeader title="COLLECTION CENTER DAILY SUMMARY" subtitle={`Center: ${centerName}`} format={format} tenantInfo={tenantInfo} />
      <DocumentMeta docNumber={docNumber} date={date} status="Verified" format={format} />

      {/* Summary Header */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px' }}>
        <div style={{ background: '#F8FAF9', border: '1.5px solid #CBD5E1', borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: '10.5px', color: '#64748B', fontWeight: '800' }}>TOTAL FARMERS</div>
          <div style={{ fontSize: '18px', fontWeight: '900', color: '#4E2A18' }}>{docData.totalFarmers || entries.length}</div>
        </div>
        <div style={{ background: '#EAF4EE', border: '1.5px solid #BBF7D0', borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: '10.5px', color: '#166534', fontWeight: '800' }}>TOTAL MILK LOGGED</div>
          <div style={{ fontSize: '18px', fontWeight: '900', color: '#15803D' }}>{totalLiters.toFixed(1)} L</div>
        </div>
        <div style={{ background: '#EFF6FF', border: '1.5px solid #BFDBFE', borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: '10.5px', color: '#1E40AF', fontWeight: '800' }}>AVG FAT / SNF</div>
          <div style={{ fontSize: '16px', fontWeight: '900', color: '#1D4ED8' }}>4.3% / 8.6%</div>
        </div>
        <div style={{ background: '#4E2A18', color: '#FFFFFF', borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: '10.5px', opacity: 0.9, fontWeight: '800' }}>TOTAL VALUE</div>
          <div style={{ fontSize: '18px', fontWeight: '900' }}>₹{totalAmount.toFixed(2)}</div>
        </div>
      </div>

      {/* Detailed Entries Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px', fontSize: '12px' }}>
        <thead>
          <tr style={{ background: '#4E2A18', color: '#FFFFFF', textAlign: 'left' }}>
            <th style={{ padding: '9px 10px', borderRadius: '6px 0 0 6px' }}>Time</th>
            <th style={{ padding: '9px 10px' }}>Farmer</th>
            <th style={{ padding: '9px 10px' }}>Type</th>
            <th style={{ padding: '9px 10px', textAlign: 'right' }}>Qty (L)</th>
            <th style={{ padding: '9px 10px', textAlign: 'center' }}>FAT</th>
            <th style={{ padding: '9px 10px', textAlign: 'center' }}>SNF</th>
            <th style={{ padding: '9px 10px', textAlign: 'right', borderRadius: '0 6px 6px 0' }}>Amount (₹)</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((e, idx) => (
            <tr key={idx} style={{ borderBottom: '1px solid #E2E8F0', background: idx % 2 === 0 ? '#FFFFFF' : '#F8FAF9' }}>
              <td style={{ padding: '9px 10px', fontWeight: '700', color: '#64748B' }}>{e.time}</td>
              <td style={{ padding: '9px 10px', fontWeight: '800', color: '#4E2A18' }}>{e.farmer}</td>
              <td style={{ padding: '9px 10px' }}>{e.milkType}</td>
              <td style={{ padding: '9px 10px', textAlign: 'right', fontWeight: '800' }}>{e.qty.toFixed(1)} L</td>
              <td style={{ padding: '9px 10px', textAlign: 'center', color: '#2563EB' }}>{e.fat}%</td>
              <td style={{ padding: '9px 10px', textAlign: 'center', color: '#2563EB' }}>{e.snf}%</td>
              <td style={{ padding: '9px 10px', textAlign: 'right', fontWeight: '900', color: '#16A34A' }}>₹{e.amount.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <SignatureSection leftLabel="Center Incharge Signature" rightLabel="Audit Supervisor Signature" format={format} />
      <DocumentFooter format={format} tenantName={tenantInfo?.name} />
    </div>
  );
};
