import React from 'react';
import { PaperFormat } from '@/services/documents/templates.registry';

interface DocumentHeaderProps {
  title: string;
  subtitle?: string;
  format?: PaperFormat;
  tenantInfo?: {
    name?: string;
    logo?: string;
    address?: string;
    phone?: string;
    email?: string;
    gstin?: string;
  };
}

export const DocumentHeader: React.FC<DocumentHeaderProps> = ({
  title,
  subtitle,
  format = 'A4',
  tenantInfo
}) => {
  const isThermal = format === 'THERMAL_80MM' || format === 'THERMAL_58MM';
  
  const businessName = tenantInfo?.name || 'RUDU DAIRY & LIVESTOCK FARM';
  const address = tenantInfo?.address || 'Village Road, Main Collection Hub, Sector 4, Kheda';
  const phone = tenantInfo?.phone || '+91 98765 43210 / 88591 71700';
  const email = tenantInfo?.email || 'support@rudufarm.com';
  const gstin = tenantInfo?.gstin || '07AAAAA0000A1Z5';
  const logoUrl = tenantInfo?.logo;

  if (isThermal) {
    return (
      <div style={{ textAlign: 'center', marginBottom: '8px', borderBottom: '1px dashed #000', paddingBottom: '6px' }}>
        <h2 style={{ fontSize: format === 'THERMAL_58MM' ? '13px' : '15px', fontWeight: '900', margin: 0, textTransform: 'uppercase' }}>
          {businessName}
        </h2>
        <div style={{ fontSize: format === 'THERMAL_58MM' ? '9px' : '10px', marginTop: '2px' }}>
          {address}
        </div>
        <div style={{ fontSize: format === 'THERMAL_58MM' ? '9px' : '10px' }}>
          Ph: {phone}
        </div>
        {gstin && <div style={{ fontSize: '9px', fontWeight: '700' }}>GSTIN: {gstin}</div>}
        <div style={{
          marginTop: '6px',
          padding: '3px 0',
          background: '#000',
          color: '#fff',
          fontWeight: '900',
          fontSize: format === 'THERMAL_58MM' ? '10px' : '12px',
          letterSpacing: '0.5px',
          textTransform: 'uppercase'
        }}>
          {title}
        </div>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      paddingBottom: '16px',
      borderBottom: '2.5px solid #4E2A18',
      marginBottom: '20px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {logoUrl ? (
          <img src={logoUrl} alt="Logo" style={{ height: '54px', maxWidth: '120px', objectFit: 'contain' }} />
        ) : (
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #4E2A18 0%, #7C3A21 100%)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '900',
            fontSize: '22px',
            boxShadow: '0 4px 10px rgba(78,42,24,0.2)'
          }}>
            🐄
          </div>
        )}
        <div>
          <h1 style={{ margin: 0, fontSize: '19px', fontWeight: '900', color: '#4E2A18', letterSpacing: '-0.3px' }}>
            {businessName}
          </h1>
          <div style={{ fontSize: '11.5px', color: '#475569', marginTop: '2px', lineHeight: '1.4' }}>
            {address}
          </div>
          <div style={{ fontSize: '11.5px', color: '#475569', display: 'flex', gap: '12px', marginTop: '1px' }}>
            <span><b>Tel:</b> {phone}</span>
            <span><b>Email:</b> {email}</span>
            {gstin && <span><b>GSTIN:</b> {gstin}</span>}
          </div>
        </div>
      </div>

      <div style={{ textAlign: 'right' }}>
        <div style={{
          fontSize: '18px',
          fontWeight: '900',
          color: '#4E2A18',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          {title}
        </div>
        {subtitle && (
          <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '2px', fontWeight: '600' }}>
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
};
