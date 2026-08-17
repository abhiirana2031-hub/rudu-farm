import React from 'react';
import { DocumentHeader } from '../shared/DocumentHeader';
import { DocumentFooter } from '../shared/DocumentFooter';
import { DocumentMeta } from '../shared/DocumentMeta';
import { TotalsSection } from '../shared/TotalsSection';
import { SignatureSection } from '../shared/SignatureSection';
import { PaperFormat } from '@/services/documents/templates.registry';

interface LineItem {
  description: string;
  quantity: number;
  unit: string;
  rate: number;
  discount?: number;
  taxPercent?: number;
  amount: number;
}

interface BillPrintProps {
  format?: PaperFormat;
  docData: {
    docNumber?: string;
    date?: string;
    customerName?: string;
    customerPhone?: string;
    customerAddress?: string;
    items?: LineItem[];
    paymentMode?: string;
    amountPaid?: number;
    notes?: string;
  };
  tenantInfo?: any;
}

export const BillPrintTemplate: React.FC<BillPrintProps> = ({
  format = 'A4',
  docData,
  tenantInfo
}) => {
  const docNumber = docData.docNumber || 'INV-20260817-004829';
  const date = docData.date || new Date().toISOString().split('T')[0];
  const items: LineItem[] = docData.items || [
    { description: 'Fresh Whole Cow Milk (Chilled)', quantity: 150, unit: 'Liters', rate: 52, amount: 7800 },
    { description: 'Pure A2 Desi Buffalo Ghee', quantity: 5, unit: 'Kg', rate: 1200, amount: 6000 },
    { description: 'Fresh Organic Paneer', quantity: 10, unit: 'Kg', rate: 380, amount: 3800 }
  ];

  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
  const discountTotal = items.reduce((sum, item) => sum + (item.discount || 0), 0);
  const taxTotal = items.reduce((sum, item) => {
    const itemSub = (item.quantity * item.rate) - (item.discount || 0);
    return sum + (item.taxPercent ? itemSub * (item.taxPercent / 100) : 0);
  }, 0);

  const grandTotal = subtotal - discountTotal + taxTotal;
  const amountPaid = docData.amountPaid !== undefined ? docData.amountPaid : grandTotal;
  const balance = grandTotal - amountPaid;

  return (
    <div className="document-container" style={{ padding: format === 'A5' ? '16px' : '24px' }}>
      <DocumentHeader title="TAX INVOICE / BILL" subtitle="Commercial Sale Invoice" format={format} tenantInfo={tenantInfo} />
      <DocumentMeta docNumber={docNumber} date={date} status={balance <= 0 ? 'Paid' : 'Partial'} format={format} />

      {/* Customer Info Box */}
      <div style={{ background: '#FFFFFF', border: '1.5px solid #CBD5E1', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
        <div style={{ color: '#64748B', fontSize: '10.5px', textTransform: 'uppercase', fontWeight: '800', marginBottom: '4px' }}>Billed To (Customer Details)</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px' }}>
          <div>
            <div style={{ fontWeight: '900', color: '#4E2A18', fontSize: '15px' }}>{docData.customerName || 'Kheda Local Dairy Mart'}</div>
            {docData.customerAddress && <div style={{ color: '#475569', fontSize: '12px', marginTop: '2px' }}>{docData.customerAddress}</div>}
          </div>
          <div style={{ textAlign: 'right' }}>
            {docData.customerPhone && <div style={{ color: '#334155', fontWeight: '700' }}>Ph: {docData.customerPhone}</div>}
          </div>
        </div>
      </div>

      {/* Line Items Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px', fontSize: '12.5px' }}>
        <thead>
          <tr style={{ background: '#4E2A18', color: '#FFFFFF', textAlign: 'left' }}>
            <th style={{ padding: '10px 12px', borderRadius: '8px 0 0 8px' }}>Item Description</th>
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
        discount={discountTotal}
        tax={taxTotal}
        grandTotal={grandTotal}
        paidAmount={amountPaid}
        balance={balance}
        format={format}
        paymentMode={docData.paymentMode || 'Bank Transfer'}
        notes={docData.notes}
      />

      <SignatureSection leftLabel="Customer Signature" rightLabel="Authorized Signatory" format={format} />
      <DocumentFooter format={format} tenantName={tenantInfo?.name} />
    </div>
  );
};
