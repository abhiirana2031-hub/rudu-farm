import React from 'react';
import { PaperFormat } from '@/services/documents/templates.registry';

interface TotalsSectionProps {
  subtotal?: number;
  discount?: number;
  tax?: number;
  grandTotal: number;
  paidAmount?: number;
  balance?: number;
  format?: PaperFormat;
  currency?: string;
  notes?: string;
  paymentMode?: string;
}

export const TotalsSection: React.FC<TotalsSectionProps> = ({
  subtotal,
  discount,
  tax,
  grandTotal,
  paidAmount,
  balance,
  format = 'A4',
  currency = '₹',
  notes,
  paymentMode
}) => {
  const isThermal = format === 'THERMAL_80MM' || format === 'THERMAL_58MM';

  if (isThermal) {
    return (
      <div style={{ marginTop: '8px', borderTop: '1px dashed #000', paddingTop: '6px', fontSize: format === 'THERMAL_58MM' ? '10px' : '11px' }}>
        {subtotal !== undefined && (
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Subtotal:</span>
            <span>{currency}{subtotal.toFixed(2)}</span>
          </div>
        )}
        {discount !== undefined && discount > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Discount:</span>
            <span>-{currency}{discount.toFixed(2)}</span>
          </div>
        )}
        {tax !== undefined && tax > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Tax (GST):</span>
            <span>+{currency}{tax.toFixed(2)}</span>
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '900', fontSize: format === 'THERMAL_58MM' ? '12px' : '14px', borderTop: '1px solid #000', marginTop: '4px', paddingTop: '4px' }}>
          <span>GRAND TOTAL:</span>
          <span>{currency}{grandTotal.toFixed(2)}</span>
        </div>
        {paidAmount !== undefined && (
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2px' }}>
            <span>Paid Amount:</span>
            <span>{currency}{paidAmount.toFixed(2)}</span>
          </div>
        )}
        {balance !== undefined && (
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '800', marginTop: '2px' }}>
            <span>Balance Due:</span>
            <span>{currency}{balance.toFixed(2)}</span>
          </div>
        )}
        {paymentMode && (
          <div style={{ fontSize: '9px', marginTop: '4px' }}>Mode: <b>{paymentMode}</b></div>
        )}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: '20px', gap: '24px' }}>
      <div style={{ flex: 1, fontSize: '11.5px', color: '#475569' }}>
        {paymentMode && (
          <div style={{ marginBottom: '6px' }}>
            <span style={{ fontWeight: '700', color: '#1E293B' }}>Payment Mode:</span> {paymentMode}
          </div>
        )}
        {notes && (
          <div style={{ background: '#F8FAF9', border: '1px solid #E2E8F0', padding: '10px 14px', borderRadius: '10px', marginTop: '6px' }}>
            <span style={{ fontWeight: '800', color: '#4E2A18' }}>Notes / Remarks:</span> {notes}
          </div>
        )}
      </div>

      <div style={{ width: '260px', background: '#F8FAF9', border: '1.5px solid #CBD5E1', borderRadius: '12px', padding: '14px 18px' }}>
        {subtotal !== undefined && (
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', color: '#475569', marginBottom: '6px' }}>
            <span>Subtotal:</span>
            <span>{currency}{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
          </div>
        )}
        {discount !== undefined && discount > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', color: '#16A34A', marginBottom: '6px' }}>
            <span>Discount:</span>
            <span>-{currency}{discount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
          </div>
        )}
        {tax !== undefined && tax > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', color: '#475569', marginBottom: '6px' }}>
            <span>Tax / GST:</span>
            <span>+{currency}{tax.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
          </div>
        )}

        <div style={{
          display: 'flex',
          justify: 'space-between',
          fontSize: '15px',
          fontWeight: '900',
          color: '#4E2A18',
          borderTop: '2px solid #CBD5E1',
          paddingTop: '8px',
          marginTop: '6px'
        }}>
          <span>Grand Total:</span>
          <span>{currency}{grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
        </div>

        {paidAmount !== undefined && (
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', color: '#2563EB', marginTop: '6px', fontWeight: '700' }}>
            <span>Amount Paid:</span>
            <span>{currency}{paidAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
          </div>
        )}

        {balance !== undefined && (
          <div style={{
            display: 'flex',
            justify: 'space-between',
            fontSize: '13px',
            fontWeight: '900',
            color: balance > 0 ? '#DC2626' : '#16A34A',
            marginTop: '4px',
            paddingTop: '4px',
            borderTop: '1px dashed #CBD5E1'
          }}>
            <span>Balance Due:</span>
            <span>{currency}{balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
          </div>
        )}
      </div>
    </div>
  );
};
