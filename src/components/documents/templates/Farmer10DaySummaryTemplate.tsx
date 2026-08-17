import React from 'react';
import { DocumentHeader } from '../shared/DocumentHeader';
import { DocumentFooter } from '../shared/DocumentFooter';
import { DocumentMeta } from '../shared/DocumentMeta';
import { SignatureSection } from '../shared/SignatureSection';
import { PaperFormat } from '@/services/documents/templates.registry';

interface DailyLog {
  date: string;
  shift: string;
  milkType: string;
  quantity: number;
  fat: number;
  snf: number;
  rate: number;
  amount: number;
}

interface Farmer10DaySummaryProps {
  format?: PaperFormat;
  docData: {
    docNumber?: string;
    startDate?: string;
    endDate?: string;
    farmerId?: string;
    farmerName?: string;
    farmerPhone?: string;
    village?: string;
    logs?: DailyLog[];
    previousBalance?: number;
    advancesDeducted?: number;
    adjustments?: number;
  };
  tenantInfo?: any;
}

export const Farmer10DaySummaryTemplate: React.FC<Farmer10DaySummaryProps> = ({
  format = 'A4',
  docData,
  tenantInfo
}) => {
  const docNumber = docData.docNumber || 'SUM10-20260817-001024';
  const startDate = docData.startDate || '2026-08-01';
  const endDate = docData.endDate || '2026-08-10';

  const farmerName = docData.farmerName || 'Ramesh Yadav';
  const farmerId = docData.farmerId || 'RF1024';
  const village = docData.village || 'Kheda';

  const logs: DailyLog[] = docData.logs || [
    { date: '2026-08-01', shift: 'Morning', milkType: 'Cow', quantity: 14.5, fat: 4.2, snf: 8.6, rate: 49.5, amount: 717.75 },
    { date: '2026-08-01', shift: 'Evening', milkType: 'Cow', quantity: 12.0, fat: 4.3, snf: 8.7, rate: 50.2, amount: 602.40 },
    { date: '2026-08-02', shift: 'Morning', milkType: 'Cow', quantity: 15.0, fat: 4.1, snf: 8.5, rate: 48.8, amount: 732.00 },
    { date: '2026-08-02', shift: 'Evening', milkType: 'Cow', quantity: 13.5, fat: 4.2, snf: 8.6, rate: 49.5, amount: 668.25 },
    { date: '2026-08-03', shift: 'Morning', milkType: 'Cow', quantity: 14.0, fat: 4.4, snf: 8.8, rate: 51.0, amount: 714.00 },
    { date: '2026-08-04', shift: 'Morning', milkType: 'Cow', quantity: 16.0, fat: 4.2, snf: 8.6, rate: 49.5, amount: 792.00 },
    { date: '2026-08-05', shift: 'Morning', milkType: 'Cow', quantity: 15.5, fat: 4.3, snf: 8.7, rate: 50.2, amount: 778.10 },
    { date: '2026-08-06', shift: 'Morning', milkType: 'Cow', quantity: 14.8, fat: 4.2, snf: 8.6, rate: 49.5, amount: 732.60 },
    { date: '2026-08-07', shift: 'Morning', milkType: 'Cow', quantity: 15.2, fat: 4.1, snf: 8.5, rate: 48.8, amount: 741.76 },
    { date: '2026-08-08', shift: 'Morning', milkType: 'Cow', quantity: 14.0, fat: 4.3, snf: 8.7, rate: 50.2, amount: 702.80 },
    { date: '2026-08-09', shift: 'Morning', milkType: 'Cow', quantity: 16.2, fat: 4.4, snf: 8.8, rate: 51.0, amount: 826.20 },
    { date: '2026-08-10', shift: 'Morning', milkType: 'Cow', quantity: 15.0, fat: 4.2, snf: 8.6, rate: 49.5, amount: 742.50 },
  ];

  const totalQty = logs.reduce((sum, l) => sum + l.quantity, 0);
  const avgFat = logs.reduce((sum, l) => sum + l.fat, 0) / (logs.length || 1);
  const avgSnf = logs.reduce((sum, l) => sum + l.snf, 0) / (logs.length || 1);
  const totalEarnings = logs.reduce((sum, l) => sum + l.amount, 0);

  const prevBal = docData.previousBalance || 0;
  const advances = docData.advancesDeducted || 1000;
  const adjustments = docData.adjustments || 0;

  const netPayable = totalEarnings + prevBal - advances + adjustments;

  return (
    <div className="document-container" style={{ padding: format === 'A5' ? '16px' : '24px' }}>
      <DocumentHeader title="10-DAY FARMER MILK SUMMARY" subtitle={`Period: ${startDate} to ${endDate}`} format={format} tenantInfo={tenantInfo} />
      <DocumentMeta docNumber={docNumber} date={new Date().toISOString().split('T')[0]} status="Statement" format={format} />

      {/* Farmer Profile */}
      <div style={{ background: '#FFFFFF', border: '1.5px solid #CBD5E1', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', fontSize: '12.5px' }}>
          <div>
            <span style={{ color: '#64748B', fontSize: '11px' }}>Farmer Name:</span><br />
            <strong style={{ color: '#4E2A18', fontSize: '14px' }}>{farmerName}</strong>
          </div>
          <div>
            <span style={{ color: '#64748B', fontSize: '11px' }}>Farmer ID:</span><br />
            <strong>{farmerId}</strong>
          </div>
          <div>
            <span style={{ color: '#64748B', fontSize: '11px' }}>Village:</span><br />
            <strong>{village}</strong>
          </div>
          <div>
            <span style={{ color: '#64748B', fontSize: '11px' }}>Phone:</span><br />
            <strong>{docData.farmerPhone || '+91 98765 43210'}</strong>
          </div>
        </div>
      </div>

      {/* Detailed Milk Logs Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px', fontSize: '12px' }}>
        <thead>
          <tr style={{ background: '#4E2A18', color: '#FFFFFF', textAlign: 'center' }}>
            <th style={{ padding: '8px 10px', borderRadius: '6px 0 0 6px' }}>Date</th>
            <th style={{ padding: '8px 10px' }}>Shift</th>
            <th style={{ padding: '8px 10px' }}>Milk Type</th>
            <th style={{ padding: '8px 10px', textAlign: 'right' }}>Qty (L)</th>
            <th style={{ padding: '8px 10px' }}>FAT %</th>
            <th style={{ padding: '8px 10px' }}>SNF %</th>
            <th style={{ padding: '8px 10px', textAlign: 'right' }}>Rate (₹)</th>
            <th style={{ padding: '8px 10px', textAlign: 'right', borderRadius: '0 6px 6px 0' }}>Amount (₹)</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log, idx) => (
            <tr key={idx} style={{ borderBottom: '1px solid #E2E8F0', background: idx % 2 === 0 ? '#FFFFFF' : '#F8FAF9' }}>
              <td style={{ padding: '8px 10px', textAlign: 'center', fontWeight: '700' }}>{log.date}</td>
              <td style={{ padding: '8px 10px', textAlign: 'center', color: log.shift === 'Morning' ? '#D97706' : '#2563EB', fontWeight: '700' }}>{log.shift}</td>
              <td style={{ padding: '8px 10px', textAlign: 'center' }}>{log.milkType}</td>
              <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: '800' }}>{log.quantity.toFixed(1)} L</td>
              <td style={{ padding: '8px 10px', textAlign: 'center', color: '#2563EB' }}>{log.fat.toFixed(1)}%</td>
              <td style={{ padding: '8px 10px', textAlign: 'center', color: '#2563EB' }}>{log.snf.toFixed(1)}%</td>
              <td style={{ padding: '8px 10px', textAlign: 'right' }}>₹{log.rate.toFixed(2)}</td>
              <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: '800', color: '#4E2A18' }}>
                ₹{log.amount.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Summary Metrics Banner */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px' }}>
        <div style={{ background: '#EAF4EE', border: '1px solid #BBF7D0', borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: '11px', color: '#166534', fontWeight: '800' }}>TOTAL MILK</div>
          <div style={{ fontSize: '18px', fontWeight: '900', color: '#15803D' }}>{totalQty.toFixed(1)} L</div>
        </div>
        <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: '11px', color: '#1E40AF', fontWeight: '800' }}>AVG FAT / SNF</div>
          <div style={{ fontSize: '16px', fontWeight: '900', color: '#1D4ED8' }}>{avgFat.toFixed(1)}% / {avgSnf.toFixed(1)}%</div>
        </div>
        <div style={{ background: '#FEF3C7', border: '1px solid #FDE68A', borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: '11px', color: '#92400E', fontWeight: '800' }}>TOTAL EARNINGS</div>
          <div style={{ fontSize: '18px', fontWeight: '900', color: '#B45309' }}>₹{totalEarnings.toFixed(2)}</div>
        </div>
        <div style={{ background: '#4E2A18', color: '#FFFFFF', borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: '11px', opacity: 0.9, fontWeight: '800' }}>NET PAYABLE</div>
          <div style={{ fontSize: '18px', fontWeight: '900' }}>₹{netPayable.toFixed(2)}</div>
        </div>
      </div>

      <SignatureSection leftLabel="Farmer Signature" rightLabel="Dairy Admin Signature" format={format} />
      <DocumentFooter format={format} tenantName={tenantInfo?.name} />
    </div>
  );
};
