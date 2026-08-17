import React from 'react';
import { DocumentHeader } from '../shared/DocumentHeader';
import { DocumentFooter } from '../shared/DocumentFooter';
import { DocumentMeta } from '../shared/DocumentMeta';
import { TotalsSection } from '../shared/TotalsSection';
import { SignatureSection } from '../shared/SignatureSection';
import { PaperFormat } from '@/services/documents/templates.registry';

interface MiscBillProps {
  format?: PaperFormat;
  docData: {
    docNumber?: string;
    date?: string;
    recipientName?: string;
    recipientPhone?: string;
    items?: Array<{ description: string; quantity: number; unit: string; rate: number; amount: number }>;
    paymentMode?: string;
    notes?: string;
  };
  tenantInfo?: any;
}

export const MiscBillTemplate: React.FC<MiscBillProps> = ({
  format = 'A4',
  docData,
  tenantInfo
}) => {
  const docNumber = docData.docNumber || 'MISC-20260817-002910';
  const date = docData.date || new Date().toISOString().split('T')[0];
  const items = docData.items || [
    { description: 'Sample Testing Service', quantity: 1, unit: 'Job', rate: 450, amount: 450 },
    { description: 'Milk Transportation Charges', quantity: 2, unit: 'Trips', rate: 1200, amount: 2400 }
  ];

  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const grandTotal = subtotal;

  return (
    <div className="document-container" style={{ padding: format === 'A5' ? '16px' : '24px' }}>
      <DocumentHeader title="MISCELLANEOUS BILL" subtitle="Ad-Hoc Services & Supplies Record" format={format} tenantInfo={tenantInfo} />
      <DocumentMeta docNumber={docNumber} date={date} status="Issued" format={format} />

      <div style={{ background: '#FFFFFF', border: '1.5px solid #CBD5E1', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
        <div style={{ color: '#64748B', fontSize: '10.5px', textTransform: 'uppercase', fontWeight: '800', marginBottom: '4px' }}>Issued To / Recipient</div>
        <div style={{ fontWeight: '900', color: '#4E2A18', fontSize: '15px' }}>{docData.recipientName || 'General Dairy Service Client'}</div>
        {docData.recipientPhone && <div style={{ color: '#475569', fontSize: '12px' }}>Ph: {docData.recipientPhone}</div>}
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px', fontSize: '12.5px' }}>
        <thead>
          <tr style={{ background: '#4E2A18', color: '#FFFFFF', textAlign: 'left' }}>
            <th style={{ padding: '10px 12px', borderRadius: '8px 0 0 8px' }}>Description</th>
            <th style={{ padding: '10px 12px', textAlign: 'center' }}>Qty</th>
            <th style={{ padding: '10px 12px', textAlign: 'center' }}>Unit</th>
            <th style={{ padding: '10px 12px', textAlign: 'right' }}>Rate (₹)</th>
            <th style={{ padding: '10px 12px', textAlign: 'right', borderRadius: '0 8px 8px 0' }}>Total (₹)</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, idx) => (
            <tr key={idx} style={{ borderBottom: '1px solid #E2E8F0', background: idx % 2 === 0 ? '#FFFFFF' : '#F8FAF9' }}>
              <td style={{ padding: '10px 12px', fontWeight: '700', color: '#1E293B' }}>{item.description}</td>
              <td style={{ padding: '10px 12px', textAlign: 'center', fontWeight: '700' }}>{item.quantity}</td>
              <td style={{ padding: '10px 12px', textAlign: 'center', color: '#64748B' }}>{item.unit}</td>
              <td style={{ padding: '10px 12px', textAlign: 'right' }}>₹{item.rate.toFixed(2)}</td>
              <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: '800', color: '#4E2A18' }}>
                ₹{item.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <TotalsSection
        subtotal={subtotal}
        grandTotal={grandTotal}
        paidAmount={grandTotal}
        balance={0}
        format={format}
        paymentMode={docData.paymentMode || 'Cash'}
        notes={docData.notes}
      />

      <SignatureSection leftLabel="Recipient Signature" rightLabel="Issuer Signature" format={format} />
      <DocumentFooter format={format} tenantName={tenantInfo?.name} />
    </div>
  );
};
