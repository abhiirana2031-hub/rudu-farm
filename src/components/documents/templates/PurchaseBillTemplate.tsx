import React from 'react';
import { DocumentHeader } from '../shared/DocumentHeader';
import { DocumentFooter } from '../shared/DocumentFooter';
import { DocumentMeta } from '../shared/DocumentMeta';
import { TotalsSection } from '../shared/TotalsSection';
import { SignatureSection } from '../shared/SignatureSection';
import { PaperFormat } from '@/services/documents/templates.registry';

interface PurchaseBillProps {
  format?: PaperFormat;
  docData: {
    docNumber?: string;
    date?: string;
    supplierName?: string;
    supplierPhone?: string;
    supplierGstin?: string;
    items?: Array<{ description: string; quantity: number; unit: string; rate: number; amount: number }>;
    paymentMode?: string;
    amountPaid?: number;
    notes?: string;
  };
  tenantInfo?: any;
}

export const PurchaseBillTemplate: React.FC<PurchaseBillProps> = ({
  format = 'A4',
  docData,
  tenantInfo
}) => {
  const docNumber = docData.docNumber || 'PUR-20260817-009182';
  const date = docData.date || new Date().toISOString().split('T')[0];
  const items = docData.items || [
    { description: 'High-Protein Cattle Feed (50kg Bags)', quantity: 40, unit: 'Bags', rate: 1450, amount: 58000 },
    { description: 'Mineral Mixture & Calcium Supplements', quantity: 15, unit: 'Packs', rate: 850, amount: 12750 },
    { description: 'Sanitizing Solution for Milking Machines', quantity: 5, unit: 'Cans', rate: 1200, amount: 6000 }
  ];

  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const tax = subtotal * 0.05; // 5% GST
  const grandTotal = subtotal + tax;
  const paid = docData.amountPaid !== undefined ? docData.amountPaid : grandTotal;
  const balance = grandTotal - paid;

  return (
    <div className="document-container" style={{ padding: format === 'A5' ? '16px' : '24px' }}>
      <DocumentHeader title="PURCHASE BILL / INVOICE" subtitle="Supplier Procurement Record" format={format} tenantInfo={tenantInfo} />
      <DocumentMeta docNumber={docNumber} date={date} status={balance <= 0 ? 'Paid' : 'Pending'} format={format} />

      {/* Supplier Info */}
      <div style={{ background: '#FFFFFF', border: '1.5px solid #CBD5E1', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
        <div style={{ color: '#64748B', fontSize: '10.5px', textTransform: 'uppercase', fontWeight: '800', marginBottom: '4px' }}>Supplier / Vendor Information</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px' }}>
          <div>
            <div style={{ fontWeight: '900', color: '#4E2A18', fontSize: '15px' }}>{docData.supplierName || 'Kheda Feed & Agri Supplies Ltd.'}</div>
            <div style={{ color: '#475569', fontSize: '12px', marginTop: '2px' }}>GSTIN: {docData.supplierGstin || '07BBBBB1111B1Z2'}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ color: '#334155', fontWeight: '700' }}>Contact: {docData.supplierPhone || '+91 98111 22233'}</div>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px', fontSize: '12.5px' }}>
        <thead>
          <tr style={{ background: '#4E2A18', color: '#FFFFFF', textAlign: 'left' }}>
            <th style={{ padding: '10px 12px', borderRadius: '8px 0 0 8px' }}>Procured Item</th>
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
        tax={tax}
        grandTotal={grandTotal}
        paidAmount={paid}
        balance={balance}
        format={format}
        paymentMode={docData.paymentMode || 'NEFT / RTGS'}
        notes={docData.notes}
      />

      <SignatureSection leftLabel="Supplier Representative" rightLabel="Procurement Manager" format={format} />
      <DocumentFooter format={format} tenantName={tenantInfo?.name} />
    </div>
  );
};
