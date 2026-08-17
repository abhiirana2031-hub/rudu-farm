import React from 'react';
import { DocumentHeader } from '../shared/DocumentHeader';
import { DocumentFooter } from '../shared/DocumentFooter';
import { DocumentMeta } from '../shared/DocumentMeta';
import { SignatureSection } from '../shared/SignatureSection';
import { PaperFormat } from '@/services/documents/templates.registry';

interface MonthlyMilkReportProps {
  format?: PaperFormat;
  docData: {
    docNumber?: string;
    monthYear?: string;
    totalFarmers?: number;
    totalLiters?: number;
    cowLiters?: number;
    buffaloLiters?: number;
    avgFat?: number;
    avgSnf?: number;
    totalAmount?: number;
    dailyRows?: Array<{ date: string; cowLiters: number; buffaloLiters: number; totalLiters: number; avgFat: number; avgSnf: number; totalAmount: number }>;
  };
  tenantInfo?: any;
}

export const MonthlyMilkReportTemplate: React.FC<MonthlyMilkReportProps> = ({
  format = 'A4',
  docData,
  tenantInfo
}) => {
  const docNumber = docData.docNumber || 'MREP-202608-001';
  const monthYear = docData.monthYear || 'August 2026';

  const dailyRows = docData.dailyRows || [
    { date: '2026-08-01', cowLiters: 450, buffaloLiters: 320, totalLiters: 770, avgFat: 4.3, avgSnf: 8.6, totalAmount: 38115 },
    { date: '2026-08-02', cowLiters: 462, buffaloLiters: 310, totalLiters: 772, avgFat: 4.2, avgSnf: 8.5, totalAmount: 38214 },
    { date: '2026-08-03', cowLiters: 440, buffaloLiters: 340, totalLiters: 780, avgFat: 4.4, avgSnf: 8.7, totalAmount: 39390 },
    { date: '2026-08-04', cowLiters: 480, buffaloLiters: 330, totalLiters: 810, avgFat: 4.3, avgSnf: 8.6, totalAmount: 40500 },
  ];

  const grandLiters = docData.totalLiters || dailyRows.reduce((s, r) => s + r.totalLiters, 0);
  const grandAmount = docData.totalAmount || dailyRows.reduce((s, r) => s + r.totalAmount, 0);

  return (
    <div className="document-container" style={{ padding: format === 'A5' ? '16px' : '24px' }}>
      <DocumentHeader title="MONTHLY MILK COLLECTION AUDIT REPORT" subtitle={`Month: ${monthYear}`} format={format} tenantInfo={tenantInfo} />
      <DocumentMeta docNumber={docNumber} date={new Date().toISOString().split('T')[0]} status="Audited" format={format} />

      {/* Monthly Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px' }}>
        <div style={{ background: '#F8FAF9', border: '1.5px solid #CBD5E1', borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: '10.5px', color: '#64748B', fontWeight: '800' }}>TOTAL ACTIVE FARMERS</div>
          <div style={{ fontSize: '18px', fontWeight: '900', color: '#4E2A18' }}>{docData.totalFarmers || 148}</div>
        </div>
        <div style={{ background: '#EAF4EE', border: '1.5px solid #BBF7D0', borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: '10.5px', color: '#166534', fontWeight: '800' }}>MONTHLY VOLUME</div>
          <div style={{ fontSize: '18px', fontWeight: '900', color: '#15803D' }}>{grandLiters.toLocaleString()} L</div>
        </div>
        <div style={{ background: '#EFF6FF', border: '1.5px solid #BFDBFE', borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: '10.5px', color: '#1E40AF', fontWeight: '800' }}>AVG QUALITY (FAT/SNF)</div>
          <div style={{ fontSize: '16px', fontWeight: '900', color: '#1D4ED8' }}>4.3% / 8.6%</div>
        </div>
        <div style={{ background: '#4E2A18', color: '#FFFFFF', borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: '10.5px', opacity: 0.9, fontWeight: '800' }}>TOTAL PAYOUT VALUE</div>
          <div style={{ fontSize: '18px', fontWeight: '900' }}>₹{grandAmount.toLocaleString()}</div>
        </div>
      </div>

      {/* Daily Breakdown Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px', fontSize: '12px' }}>
        <thead>
          <tr style={{ background: '#4E2A18', color: '#FFFFFF', textAlign: 'left' }}>
            <th style={{ padding: '9px 10px', borderRadius: '6px 0 0 6px' }}>Date</th>
            <th style={{ padding: '9px 10px', textAlign: 'right' }}>Cow Milk (L)</th>
            <th style={{ padding: '9px 10px', textAlign: 'right' }}>Buffalo Milk (L)</th>
            <th style={{ padding: '9px 10px', textAlign: 'right' }}>Total Volume (L)</th>
            <th style={{ padding: '9px 10px', textAlign: 'center' }}>Avg FAT / SNF</th>
            <th style={{ padding: '9px 10px', textAlign: 'right', borderRadius: '0 6px 6px 0' }}>Daily Amount (₹)</th>
          </tr>
        </thead>
        <tbody>
          {dailyRows.map((r, idx) => (
            <tr key={idx} style={{ borderBottom: '1px solid #E2E8F0', background: idx % 2 === 0 ? '#FFFFFF' : '#F8FAF9' }}>
              <td style={{ padding: '9px 10px', fontWeight: '700' }}>{r.date}</td>
              <td style={{ padding: '9px 10px', textAlign: 'right', color: '#D97706' }}>{r.cowLiters} L</td>
              <td style={{ padding: '9px 10px', textAlign: 'right', color: '#2563EB' }}>{r.buffaloLiters} L</td>
              <td style={{ padding: '9px 10px', textAlign: 'right', fontWeight: '900', color: '#4E2A18' }}>{r.totalLiters} L</td>
              <td style={{ padding: '9px 10px', textAlign: 'center', color: '#64748B' }}>{r.avgFat}% / {r.avgSnf}%</td>
              <td style={{ padding: '9px 10px', textAlign: 'right', fontWeight: '900', color: '#16A34A' }}>₹{r.totalAmount.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <SignatureSection leftLabel="Dairy Operation Head Signature" rightLabel="Chief Financial Officer Signature" format={format} />
      <DocumentFooter format={format} tenantName={tenantInfo?.name} />
    </div>
  );
};
