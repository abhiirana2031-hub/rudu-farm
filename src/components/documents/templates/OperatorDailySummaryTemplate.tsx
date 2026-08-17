import React from 'react';
import { DocumentHeader } from '../shared/DocumentHeader';
import { DocumentFooter } from '../shared/DocumentFooter';
import { DocumentMeta } from '../shared/DocumentMeta';
import { SignatureSection } from '../shared/SignatureSection';
import { PaperFormat } from '@/services/documents/templates.registry';

interface OperatorDailySummaryProps {
  format?: PaperFormat;
  docData: {
    docNumber?: string;
    date?: string;
    operatorName?: string;
    centerName?: string;
    loginTime?: string;
    logoutTime?: string;
    duration?: string;
    totalEntries?: number;
    farmersServed?: number;
    totalLiters?: number;
    totalAmount?: number;
  };
  tenantInfo?: any;
}

export const OperatorDailySummaryTemplate: React.FC<OperatorDailySummaryProps> = ({
  format = 'A4',
  docData,
  tenantInfo
}) => {
  const docNumber = docData.docNumber || 'OPREP-20260817-089';
  const date = docData.date || new Date().toISOString().split('T')[0];
  const operatorName = docData.operatorName || 'Amit Kumar';

  return (
    <div className="document-container" style={{ padding: format === 'A5' ? '16px' : '24px' }}>
      <DocumentHeader title="OPERATOR SHIFT AUDIT SUMMARY" subtitle={`Operator: ${operatorName}`} format={format} tenantInfo={tenantInfo} />
      <DocumentMeta docNumber={docNumber} date={date} status="Completed" format={format} />

      {/* Operator Session Info */}
      <div style={{ background: '#FFFFFF', border: '1.5px solid #CBD5E1', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', fontSize: '12.5px' }}>
          <div>
            <span style={{ color: '#64748B', fontSize: '11px' }}>Operator Name:</span><br />
            <strong style={{ color: '#4E2A18', fontSize: '14px' }}>{operatorName}</strong>
          </div>
          <div>
            <span style={{ color: '#64748B', fontSize: '11px' }}>Assigned Center:</span><br />
            <strong>{docData.centerName || 'Kheda Main Center'}</strong>
          </div>
          <div>
            <span style={{ color: '#64748B', fontSize: '11px' }}>Shift Session:</span><br />
            <strong>{docData.loginTime || '06:00 AM'} - {docData.logoutTime || '11:00 AM'}</strong>
          </div>
          <div>
            <span style={{ color: '#64748B', fontSize: '11px' }}>Session Duration:</span><br />
            <strong>{docData.duration || '5 Hours 0 Mins'}</strong>
          </div>
        </div>
      </div>

      {/* Shift Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px' }}>
        <div style={{ background: '#F8FAF9', border: '1.5px solid #CBD5E1', borderRadius: '12px', padding: '14px', textAlign: 'center' }}>
          <div style={{ fontSize: '10.5px', color: '#64748B', fontWeight: '800' }}>ENTRIES LOGGED</div>
          <div style={{ fontSize: '20px', fontWeight: '900', color: '#4E2A18' }}>{docData.totalEntries || 42}</div>
        </div>
        <div style={{ background: '#EAF4EE', border: '1.5px solid #BBF7D0', borderRadius: '12px', padding: '14px', textAlign: 'center' }}>
          <div style={{ fontSize: '10.5px', color: '#166534', fontWeight: '800' }}>FARMERS SERVED</div>
          <div style={{ fontSize: '20px', fontWeight: '900', color: '#15803D' }}>{docData.farmersServed || 38}</div>
        </div>
        <div style={{ background: '#EFF6FF', border: '1.5px solid #BFDBFE', borderRadius: '12px', padding: '14px', textAlign: 'center' }}>
          <div style={{ fontSize: '10.5px', color: '#1E40AF', fontWeight: '800' }}>TOTAL MILK COLLECTED</div>
          <div style={{ fontSize: '20px', fontWeight: '900', color: '#1D4ED8' }}>{(docData.totalLiters || 542.5).toFixed(1)} L</div>
        </div>
        <div style={{ background: '#4E2A18', color: '#FFFFFF', borderRadius: '12px', padding: '14px', textAlign: 'center' }}>
          <div style={{ fontSize: '10.5px', opacity: 0.9, fontWeight: '800' }}>TOTAL COLLECTION VALUE</div>
          <div style={{ fontSize: '20px', fontWeight: '900' }}>₹{(docData.totalAmount || 26850).toFixed(2)}</div>
        </div>
      </div>

      <SignatureSection leftLabel="Operator Signature" rightLabel="Shift Supervisor Signature" format={format} />
      <DocumentFooter format={format} tenantName={tenantInfo?.name} />
    </div>
  );
};
