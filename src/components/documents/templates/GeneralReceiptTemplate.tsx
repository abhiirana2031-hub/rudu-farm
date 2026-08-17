import React from 'react';
import { DocumentHeader } from '../shared/DocumentHeader';
import { DocumentFooter } from '../shared/DocumentFooter';
import { DocumentMeta } from '../shared/DocumentMeta';
import { SignatureSection } from '../shared/SignatureSection';
import { PaperFormat } from '@/services/documents/templates.registry';

interface GeneralReceiptProps {
  format?: PaperFormat;
  docData: {
    docNumber?: string;
    date?: string;
    time?: string;
    receivedFrom?: string;
    amount?: number;
    paymentMode?: string;
    transactionId?: string;
    description?: string;
    notes?: string;
    status?: string;
  };
  tenantInfo?: any;
}

export const GeneralReceiptTemplate: React.FC<GeneralReceiptProps> = ({
  format = 'A4',
  docData,
  tenantInfo
}) => {
  const docNumber = docData.docNumber || 'REC-20260817-001024';
  const date = docData.date || new Date().toISOString().split('T')[0];
  const time = docData.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const amount = docData.amount || 5000;
  const receivedFrom = docData.receivedFrom || 'Ramesh Yadav (RF1024)';

  return (
    <div className="document-container" style={{ padding: format === 'A5' ? '16px' : '24px' }}>
      <DocumentHeader title="GENERAL RECEIPT" subtitle="Payment Acknowledgment" format={format} tenantInfo={tenantInfo} />
      <DocumentMeta docNumber={docNumber} date={date} time={time} status={docData.status || 'Cleared'} format={format} />

      <div style={{ background: '#FFFFFF', border: '1.5px solid #E2E8F0', borderRadius: '14px', padding: '20px', marginBottom: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '13px' }}>
          <div>
            <div style={{ color: '#64748B', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase' }}>Received From</div>
            <div style={{ fontWeight: '900', color: '#4E2A18', fontSize: '15px', marginTop: '2px' }}>{receivedFrom}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ color: '#64748B', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase' }}>Amount Received</div>
            <div style={{ fontWeight: '900', color: '#16A34A', fontSize: '20px', marginTop: '2px' }}>
              ₹{amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid #E2E8F0', marginTop: '16px', paddingTop: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '12.5px' }}>
          <div>
            <span style={{ color: '#64748B', fontWeight: '700' }}>Payment Mode:</span>{' '}
            <span style={{ fontWeight: '800', color: '#1E293B' }}>{docData.paymentMode || 'Direct Bank Transfer (UPI)'}</span>
          </div>
          {docData.transactionId && (
            <div style={{ textAlign: 'right' }}>
              <span style={{ color: '#64748B', fontWeight: '700' }}>Transaction Ref #:</span>{' '}
              <span style={{ fontWeight: '800', color: '#1E293B' }}>{docData.transactionId}</span>
            </div>
          )}
        </div>

        {docData.description && (
          <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px dashed #E2E8F0', fontSize: '12.5px' }}>
            <span style={{ color: '#64748B', fontWeight: '700' }}>Description:</span>{' '}
            <span style={{ color: '#334155' }}>{docData.description}</span>
          </div>
        )}
      </div>

      {docData.notes && (
        <div style={{ background: '#F8FAF9', padding: '12px 16px', borderRadius: '10px', fontSize: '12px', color: '#475569', marginBottom: '20px' }}>
          <b>Notes / Remarks:</b> {docData.notes}
        </div>
      )}

      <SignatureSection leftLabel="Received By (Payer)" rightLabel="Authorized Signatory" format={format} />
      <DocumentFooter format={format} tenantName={tenantInfo?.name} />
    </div>
  );
};
