import React from 'react';
import { PaperFormat } from '@/services/documents/templates.registry';

interface DocumentMetaProps {
  docNumber: string;
  date: string;
  time?: string;
  format?: PaperFormat;
  status?: string;
  customMeta?: Array<{ label: string; value: string }>;
}

export const DocumentMeta: React.FC<DocumentMetaProps> = ({
  docNumber,
  date,
  time,
  format = 'A4',
  status,
  customMeta
}) => {
  const isThermal = format === 'THERMAL_80MM' || format === 'THERMAL_58MM';

  if (isThermal) {
    return (
      <div style={{ fontSize: format === 'THERMAL_58MM' ? '9.5px' : '10.5px', marginBottom: '8px', lineHeight: '1.4' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Doc #: <b>{docNumber}</b></span>
          <span>Date: <b>{date}</b></span>
        </div>
        {time && (
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Time: <b>{time}</b></span>
            {status && <span>Status: <b>{status}</b></span>}
          </div>
        )}
        {customMeta?.map((m, idx) => (
          <div key={idx} style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>{m.label}:</span>
            <span><b>{m.value}</b></span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={{
      background: '#F8FAF9',
      border: '1.5px solid #CBD5E1',
      borderRadius: '12px',
      padding: '12px 18px',
      marginBottom: '20px',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
      gap: '12px',
      fontSize: '12px'
    }}>
      <div>
        <div style={{ color: '#64748B', fontSize: '10.5px', textTransform: 'uppercase', fontWeight: '800' }}>Document Number</div>
        <div style={{ fontWeight: '900', color: '#4E2A18', fontSize: '13.5px' }}>{docNumber}</div>
      </div>
      <div>
        <div style={{ color: '#64748B', fontSize: '10.5px', textTransform: 'uppercase', fontWeight: '800' }}>Issue Date</div>
        <div style={{ fontWeight: '800', color: '#1E293B' }}>{date} {time ? `(${time})` : ''}</div>
      </div>
      {status && (
        <div>
          <div style={{ color: '#64748B', fontSize: '10.5px', textTransform: 'uppercase', fontWeight: '800' }}>Status</div>
          <div style={{
            display: 'inline-block',
            padding: '2px 8px',
            borderRadius: '12px',
            background: status === 'Cleared' || status === 'Paid' || status === 'Active' ? '#D1FAE5' : '#FEF3C7',
            color: status === 'Cleared' || status === 'Paid' || status === 'Active' ? '#065F46' : '#92400E',
            fontWeight: '800',
            fontSize: '11px',
            marginTop: '2px'
          }}>
            {status}
          </div>
        </div>
      )}
      {customMeta?.map((m, idx) => (
        <div key={idx}>
          <div style={{ color: '#64748B', fontSize: '10.5px', textTransform: 'uppercase', fontWeight: '800' }}>{m.label}</div>
          <div style={{ fontWeight: '800', color: '#1E293B' }}>{m.value}</div>
        </div>
      ))}
    </div>
  );
};
