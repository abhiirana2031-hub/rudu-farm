import React from 'react';
import { PaperFormat } from '@/services/documents/templates.registry';

interface SignatureSectionProps {
  leftLabel?: string;
  rightLabel?: string;
  format?: PaperFormat;
}

export const SignatureSection: React.FC<SignatureSectionProps> = ({
  leftLabel = 'Customer / Farmer Signature',
  rightLabel = 'Authorized Signatory',
  format = 'A4'
}) => {
  const isThermal = format === 'THERMAL_80MM' || format === 'THERMAL_58MM';

  if (isThermal) {
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', fontSize: format === 'THERMAL_58MM' ? '8.5px' : '9.5px' }}>
        <div style={{ textAlign: 'center' }}>
          <div>__________________</div>
          <div style={{ marginTop: '2px', fontWeight: '700' }}>{leftLabel}</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div>__________________</div>
          <div style={{ marginTop: '2px', fontWeight: '700' }}>{rightLabel}</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '36px', paddingTop: '10px' }}>
      <div style={{ textAlign: 'center', width: '200px' }}>
        <div style={{ borderBottom: '1.5px solid #64748B', height: '36px', marginBottom: '6px' }}></div>
        <div style={{ fontSize: '11.5px', fontWeight: '800', color: '#334155' }}>{leftLabel}</div>
      </div>

      <div style={{ textAlign: 'center', width: '220px' }}>
        <div style={{ borderBottom: '1.5px solid #64748B', height: '36px', marginBottom: '6px', position: 'relative' }}>
          <span style={{
            position: 'absolute',
            bottom: '4px',
            right: '10px',
            fontSize: '9px',
            color: '#94A3B8',
            fontStyle: 'italic',
            fontWeight: '600'
          }}>
            [ Rudu Dairy Stamp ]
          </span>
        </div>
        <div style={{ fontSize: '11.5px', fontWeight: '800', color: '#4E2A18' }}>{rightLabel}</div>
        <div style={{ fontSize: '10px', color: '#64748B' }}>For Rudu Farm Management</div>
      </div>
    </div>
  );
};
