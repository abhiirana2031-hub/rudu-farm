import React from 'react';
import { DocumentHeader } from '../shared/DocumentHeader';
import { DocumentFooter } from '../shared/DocumentFooter';
import { DocumentMeta } from '../shared/DocumentMeta';
import { SignatureSection } from '../shared/SignatureSection';
import { PaperFormat } from '@/services/documents/templates.registry';

interface ExpenseBillProps {
  format?: PaperFormat;
  docData: {
    docNumber?: string;
    date?: string;
    category?: string;
    paidTo?: string;
    amount?: number;
    paymentMode?: string;
    referenceId?: string;
    description?: string;
    approvedBy?: string;
    notes?: string;
  };
  tenantInfo?: any;
}

export const ExpenseBillTemplate: React.FC<ExpenseBillProps> = ({
  format = 'A4',
  docData,
  tenantInfo
}) => {
  const docNumber = docData.docNumber || 'EXP-20260817-005120';
  const date = docData.date || new Date().toISOString().split('T')[0];
  const amount = docData.amount || 3200;

  return (
    <div className="document-container" style={{ padding: format === 'A5' ? '16px' : '24px' }}>
      <DocumentHeader title="EXPENSE VOUCHER" subtitle="Internal Operational Expense Record" format={format} tenantInfo={tenantInfo} />
      <DocumentMeta docNumber={docNumber} date={date} status="Approved" format={format} />

      <div style={{ background: '#FFFFFF', border: '1.5px solid #CBD5E1', borderRadius: '12px', padding: '18px', marginBottom: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '13px' }}>
          <div>
            <div style={{ color: '#64748B', fontSize: '10.5px', textTransform: 'uppercase', fontWeight: '800' }}>Paid To / Vendor</div>
            <div style={{ fontWeight: '900', color: '#4E2A18', fontSize: '15.5px', marginTop: '2px' }}>{docData.paidTo || 'Sharma Electricals & Repair Shop'}</div>
            <div style={{ color: '#475569', fontSize: '12px', marginTop: '4px' }}>Category: <b>{docData.category || 'Machinery Maintenance & Repair'}</b></div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ color: '#64748B', fontSize: '10.5px', textTransform: 'uppercase', fontWeight: '800' }}>Total Expense Amount</div>
            <div style={{ fontWeight: '900', color: '#DC2626', fontSize: '22px', marginTop: '2px' }}>
              ₹{amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid #E2E8F0', marginTop: '16px', paddingTop: '16px', fontSize: '12.5px' }}>
          <div style={{ marginBottom: '8px' }}>
            <span style={{ color: '#64748B', fontWeight: '700' }}>Description of Work:</span>{' '}
            <span>{docData.description || 'Chilling plant compressor belt replacement and monthly electrical servicing.'}</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '10px' }}>
            <div>
              <span style={{ color: '#64748B', fontWeight: '700' }}>Payment Mode:</span>{' '}
              <span style={{ fontWeight: '800' }}>{docData.paymentMode || 'Cash / Petty Cash'}</span>
            </div>
            {docData.referenceId && (
              <div style={{ textAlign: 'right' }}>
                <span style={{ color: '#64748B', fontWeight: '700' }}>Ref #:</span>{' '}
                <span style={{ fontWeight: '800' }}>{docData.referenceId}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <SignatureSection leftLabel="Prepared By" rightLabel="Approved By (Admin)" format={format} />
      <DocumentFooter format={format} tenantName={tenantInfo?.name} />
    </div>
  );
};
