import React from 'react';
import { DocumentHeader } from '../shared/DocumentHeader';
import { DocumentFooter } from '../shared/DocumentFooter';
import { DocumentMeta } from '../shared/DocumentMeta';
import { SignatureSection } from '../shared/SignatureSection';
import { PaperFormat } from '@/services/documents/templates.registry';

interface FarmerPayoutReceiptProps {
  format?: PaperFormat;
  docData: {
    docNumber?: string;
    date?: string;
    farmerId?: string;
    farmerName?: string;
    farmerPhone?: string;
    village?: string;
    amountPaid?: number;
    paymentMode?: string;
    transactionId?: string;
    previousBalance?: number;
    remainingBalance?: number;
    notes?: string;
  };
  tenantInfo?: any;
}

export const FarmerPayoutReceiptTemplate: React.FC<FarmerPayoutReceiptProps> = ({
  format = 'A4',
  docData,
  tenantInfo
}) => {
  const docNumber = docData.docNumber || 'PAY-20260817-004812';
  const date = docData.date || new Date().toISOString().split('T')[0];
  const farmerName = docData.farmerName || 'Ramesh Yadav';
  const farmerId = docData.farmerId || 'RF1024';

  const amountPaid = docData.amountPaid || 6500;
  const previousBalance = docData.previousBalance !== undefined ? docData.previousBalance : 8200;
  const remainingBalance = docData.remainingBalance !== undefined ? docData.remainingBalance : (previousBalance - amountPaid);

  return (
    <div className="document-container" style={{ padding: format === 'A5' ? '16px' : '24px' }}>
      <DocumentHeader title="FARMER PAYOUT RECEIPT" subtitle="Milk Settlement Payment Receipt" format={format} tenantInfo={tenantInfo} />
      <DocumentMeta docNumber={docNumber} date={date} status="Paid" format={format} />

      {/* Farmer Profile */}
      <div style={{ background: '#FFFFFF', border: '1.5px solid #CBD5E1', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px' }}>
          <div>
            <div style={{ color: '#64748B', fontSize: '11px', textTransform: 'uppercase', fontWeight: '800' }}>Farmer Beneficiary</div>
            <div style={{ fontWeight: '900', color: '#4E2A18', fontSize: '16px', marginTop: '2px' }}>{farmerName}</div>
            <div style={{ fontSize: '12px', color: '#334155' }}>Farmer ID: <b>{farmerId}</b> | Village: {docData.village || 'Kheda'}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ color: '#64748B', fontSize: '11px', textTransform: 'uppercase', fontWeight: '800' }}>Payment Mode</div>
            <div style={{ fontWeight: '800', color: '#1E293B', fontSize: '13.5px', marginTop: '2px' }}>{docData.paymentMode || 'Direct Bank Transfer (UPI)'}</div>
            {docData.transactionId && <div style={{ fontSize: '11.5px', color: '#64748B' }}>Txn Ref #: {docData.transactionId}</div>}
          </div>
        </div>
      </div>

      {/* Financial Breakdown Table */}
      <div style={{ background: '#F8FAF9', border: '1.5px solid #CBD5E1', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px', marginBottom: '10px' }}>
          <span style={{ color: '#64748B' }}>Previous Total Pending Balance:</span>
          <span style={{ fontWeight: '800', color: '#B45309' }}>₹{previousBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '10px', paddingBottom: '10px', borderBottom: '1px solid #E2E8F0' }}>
          <span style={{ color: '#16A34A', fontWeight: '800' }}>Amount Settled & Paid:</span>
          <span style={{ fontWeight: '900', color: '#16A34A', fontSize: '16px' }}>- ₹{amountPaid.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: '900', color: remainingBalance > 0 ? '#DC2626' : '#16A34A' }}>
          <span>Remaining Ledger Balance:</span>
          <span>₹{remainingBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
        </div>
      </div>

      {/* Prominent Paid Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #4E2A18 0%, #7C3A21 100%)',
        color: '#FFFFFF',
        borderRadius: '16px',
        padding: '18px 24px',
        display: 'flex',
        justify: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <div>
          <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px', opacity: 0.9, fontWeight: '700' }}>PAYOUT AMOUNT DISBURSED</div>
          <div style={{ fontSize: '11px', opacity: 0.8 }}>Milk Payout Settlement</div>
        </div>
        <div style={{ fontSize: '28px', fontWeight: '900' }}>
          ₹{amountPaid.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
        </div>
      </div>

      <SignatureSection leftLabel="Farmer Signature" rightLabel="Authorized Accountant Signature" format={format} />
      <DocumentFooter format={format} tenantName={tenantInfo?.name} />
    </div>
  );
};
