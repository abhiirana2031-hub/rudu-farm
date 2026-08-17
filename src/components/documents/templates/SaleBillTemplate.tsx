import React from 'react';
import { DocumentHeader } from '../shared/DocumentHeader';
import { DocumentFooter } from '../shared/DocumentFooter';
import { DocumentMeta } from '../shared/DocumentMeta';
import { TotalsSection } from '../shared/TotalsSection';
import { SignatureSection } from '../shared/SignatureSection';
import { PaperFormat } from '@/services/documents/templates.registry';

interface SaleBillProps {
  format?: PaperFormat;
  docData: {
    docNumber?: string;
    date?: string;
    customerName?: string;
    customerPhone?: string;
    customerAddress?: string;
    items?: Array<{ description: string; quantity: number; unit: string; rate: number; amount: number }>;
    paymentMode?: string;
    amountPaid?: number;
    notes?: string;
  };
  tenantInfo?: any;
}

export const SaleBillTemplate: React.FC<SaleBillProps> = ({
  format = 'A4',
  docData,
  tenantInfo
}) => {
  const docNumber = docData.docNumber || 'SALE-20260817-003810';
  const date = docData.date || new Date().toISOString().split('T')[0];
  const items = docData.items || [
    { description: 'Bulk Raw Cow Milk (Chilled - 4.2 FAT)', quantity: 350, unit: 'Liters', rate: 50, amount: 17500 },
    { description: 'Pasteurized Toned Milk (Pouch 500ml)', quantity: 100, unit: 'Pouches', rate: 30, amount: 3000 }
  ];

  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const discount = 500;
  const grandTotal = subtotal - discount;
  const paid = docData.amountPaid !== undefined ? docData.amountPaid : grandTotal;
  const balance = grandTotal - paid;

  return (
    <div className="document-container" style={{ padding: format === 'A5' ? '16px' : '24px' }}>
      <DocumentHeader title="COMMERCIAL SALE BILL" subtitle="Bulk Milk & Product Sales" format={format} tenantInfo={tenantInfo} />
      <DocumentMeta docNumber={docNumber} date={date} status={balance <= 0 ? 'Cleared' : 'Pending'} format={format} />

      <div style={{ background: '#FFFFFF', border: '1.5px solid #CBD5E1', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
        <div style={{ color: '#64748B', fontSize: '10.5px', textTransform: 'uppercase', fontWeight: '800', marginBottom: '4px' }}>Customer / Client Details</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px' }}>
          <div>
            <div style={{ fontWeight: '900', color: '#4E2A18', fontSize: '15px' }}>{docData.customerName || 'Madhusudan Dairy Processing Plant'}</div>
            <div style={{ color: '#475569', fontSize: '12px', marginTop: '2px' }}>{docData.customerAddress || 'Industrial Area, Phase 2, Kheda'}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ color: '#334155', fontWeight: '700' }}>Contact: {docData.customerPhone || '+91 99000 44556'}</div>
          </div>
        </div>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px', fontSize: '12.5px' }}>
        <thead>
          <tr style={{ background: '#4E2A18', color: '#FFFFFF', textAlign: 'left' }}>
            <th style={{ padding: '10px 12px', borderRadius: '8px 0 0 8px' }}>Product</th>
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
        discount={discount}
        grandTotal={grandTotal}
        paidAmount={paid}
        balance={balance}
        format={format}
        paymentMode={docData.paymentMode || 'Online UPI / Bank'}
        notes={docData.notes}
      />

      <SignatureSection leftLabel="Customer Acknowledgment" rightLabel="Sales Incharge Signature" format={format} />
      <DocumentFooter format={format} tenantName={tenantInfo?.name} />
    </div>
  );
};
