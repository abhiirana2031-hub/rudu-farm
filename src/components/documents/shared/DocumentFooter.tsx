import React from 'react';
import { PaperFormat } from '@/services/documents/templates.registry';

interface DocumentFooterProps {
  terms?: string;
  note?: string;
  format?: PaperFormat;
  tenantName?: string;
}

export const DocumentFooter: React.FC<DocumentFooterProps> = ({
  terms,
  note = 'This is a computer-generated official document. No manual signature required.',
  format = 'A4',
  tenantName = 'Rudu Farm ERP'
}) => {
  const isThermal = format === 'THERMAL_80MM' || format === 'THERMAL_58MM';

  if (isThermal) {
    return (
      <div style={{
        marginTop: '12px',
        paddingTop: '6px',
        borderTop: '1px dashed #000',
        textAlign: 'center',
        fontSize: format === 'THERMAL_58MM' ? '8.5px' : '9.5px',
        lineHeight: '1.3'
      }}>
        {terms && <div style={{ fontWeight: '700', marginBottom: '3px' }}>{terms}</div>}
        <div>*** Thank You For Dairy Partnering ***</div>
        <div style={{ fontSize: '8px', color: '#333', marginTop: '2px' }}>{note}</div>
      </div>
    );
  }

  return (
    <div style={{
      marginTop: '28px',
      paddingTop: '12px',
      borderTop: '1.5px solid #CBD5E1',
      fontSize: '11px',
      color: '#64748B',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: '16px'
    }}>
      <div>
        <div style={{ fontWeight: '700', color: '#334155' }}>
          {terms || 'Terms & Conditions: All disputes subject to local jurisdiction. Goods/Services once sold are non-refundable.'}
        </div>
        <div style={{ fontSize: '10px', color: '#94A3B8', marginTop: '2px' }}>
          {note}
        </div>
      </div>
      <div style={{ textAlign: 'right', flexShrink: 0, fontSize: '10px', color: '#94A3B8' }}>
        <div>Generated via {tenantName} System</div>
        <div>Page 1 of 1</div>
      </div>
    </div>
  );
};
