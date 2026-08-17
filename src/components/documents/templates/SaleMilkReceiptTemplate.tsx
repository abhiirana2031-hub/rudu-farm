import React from 'react';
import { DocumentHeader } from '../shared/DocumentHeader';
import { DocumentFooter } from '../shared/DocumentFooter';
import { DocumentMeta } from '../shared/DocumentMeta';
import { SignatureSection } from '../shared/SignatureSection';
import { PaperFormat } from '@/services/documents/templates.registry';

interface SaleMilkReceiptProps {
  format?: PaperFormat;
  docData: {
    docNumber?: string;
    date?: string;
    time?: string;
    shift?: string;
    farmerId?: string;
    farmerName?: string;
    farmerPhone?: string;
    village?: string;
    centerName?: string;
    operatorName?: string;
    milkType?: string;
    quantity?: number;
    fat?: number;
    snf?: number;
    rate?: number;
    totalAmount?: number;
  };
  tenantInfo?: any;
}

export const SaleMilkReceiptTemplate: React.FC<SaleMilkReceiptProps> = ({
  format = 'THERMAL_80MM',
  docData,
  tenantInfo
}) => {
  const isThermal = format === 'THERMAL_80MM' || format === 'THERMAL_58MM';
  const is58mm = format === 'THERMAL_58MM';

  const docNumber = docData.docNumber || 'MILK-20260817-4829';
  const date = docData.date || new Date().toISOString().split('T')[0];
  const time = docData.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const shift = docData.shift || 'Morning';

  const farmerName = docData.farmerName || 'Ramesh Yadav';
  const farmerId = docData.farmerId || 'RF1024';
  const village = docData.village || 'Kheda';

  const qty = docData.quantity || 12.5;
  const fat = docData.fat || 4.2;
  const snf = docData.snf || 8.6;
  const rate = docData.rate || 49.50;
  const totalAmount = docData.totalAmount !== undefined ? docData.totalAmount : Math.round(qty * rate * 100) / 100;

  if (isThermal) {
    return (
      <div className="thermal-receipt-container" style={{
        fontFamily: 'monospace',
        fontSize: is58mm ? '10px' : '11px',
        maxWidth: is58mm ? '58mm' : '80mm',
        margin: '0 auto',
        padding: '4px',
        color: '#000000',
        lineHeight: '1.3'
      }}>
        <DocumentHeader title="MILK COLLECTION RECEIPT" format={format} tenantInfo={tenantInfo} />
        
        <div style={{ fontSize: is58mm ? '9px' : '10px', borderBottom: '1px dashed #000', paddingBottom: '4px', marginBottom: '6px' }}>
          <div>No: <b>{docNumber}</b></div>
          <div>Date: {date} ({shift})</div>
          <div>Time: {time}</div>
          <div>Center: {docData.centerName || 'Rudu Main Center'}</div>
          <div>Agent: {docData.operatorName || 'Amit Kumar'}</div>
        </div>

        <div style={{ borderBottom: '1px dashed #000', paddingBottom: '6px', marginBottom: '6px' }}>
          <div>Farmer: <b>{farmerName}</b></div>
          <div>ID: <b>{farmerId}</b> | Village: {village}</div>
        </div>

        <table style={{ width: '100%', fontSize: is58mm ? '9px' : '10.5px', marginBottom: '6px', textAlign: 'left' }}>
          <tbody>
            <tr>
              <td>Milk Type:</td>
              <td style={{ textAlign: 'right', fontWeight: '800' }}>{docData.milkType || 'Cow Milk'}</td>
            </tr>
            <tr>
              <td>Quantity:</td>
              <td style={{ textAlign: 'right', fontWeight: '800' }}>{qty.toFixed(1)} Liters</td>
            </tr>
            <tr>
              <td>FAT %:</td>
              <td style={{ textAlign: 'right', fontWeight: '800' }}>{fat.toFixed(1)}%</td>
            </tr>
            <tr>
              <td>SNF %:</td>
              <td style={{ textAlign: 'right', fontWeight: '800' }}>{snf.toFixed(1)}%</td>
            </tr>
            <tr>
              <td>Rate/Liter:</td>
              <td style={{ textAlign: 'right', fontWeight: '800' }}>₹{rate.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>

        <div style={{
          borderTop: '2px solid #000',
          borderBottom: '2px solid #000',
          padding: '6px 0',
          textAlign: 'center',
          margin: '6px 0'
        }}>
          <div style={{ fontSize: is58mm ? '9px' : '10px', fontWeight: '700' }}>TOTAL AMOUNT PAYABLE</div>
          <div style={{ fontSize: is58mm ? '16px' : '19px', fontWeight: '900' }}>
            ₹{totalAmount.toFixed(2)}
          </div>
        </div>

        <SignatureSection leftLabel="Farmer Sig" rightLabel="Agent Sig" format={format} />
        <DocumentFooter format={format} tenantName={tenantInfo?.name} />
      </div>
    );
  }

  return (
    <div className="document-container" style={{ padding: format === 'A5' ? '16px' : '24px' }}>
      <DocumentHeader title="SALE MILK RECEIPT" subtitle="Official Milk Collection Receipt" format={format} tenantInfo={tenantInfo} />
      <DocumentMeta
        docNumber={docNumber}
        date={date}
        time={time}
        status="Recorded"
        format={format}
        customMeta={[
          { label: 'Shift', value: shift },
          { label: 'Collection Center', value: docData.centerName || 'Rudu Main Center' }
        ]}
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
        <div style={{ background: '#FFFFFF', border: '1.5px solid #CBD5E1', borderRadius: '12px', padding: '16px' }}>
          <div style={{ color: '#64748B', fontSize: '10.5px', textTransform: 'uppercase', fontWeight: '800', marginBottom: '4px' }}>Farmer Details</div>
          <div style={{ fontWeight: '900', color: '#4E2A18', fontSize: '16px' }}>{farmerName}</div>
          <div style={{ fontSize: '12.5px', color: '#334155', marginTop: '2px' }}>Farmer ID: <b>{farmerId}</b></div>
          <div style={{ fontSize: '12.5px', color: '#64748B' }}>Village: {village}</div>
        </div>

        <div style={{ background: '#FFFFFF', border: '1.5px solid #CBD5E1', borderRadius: '12px', padding: '16px' }}>
          <div style={{ color: '#64748B', fontSize: '10.5px', textTransform: 'uppercase', fontWeight: '800', marginBottom: '4px' }}>Collection Session Info</div>
          <div style={{ fontSize: '12.5px', color: '#334155' }}>Collected By: <b>{docData.operatorName || 'Amit Kumar'}</b></div>
          <div style={{ fontSize: '12.5px', color: '#334155', marginTop: '2px' }}>Shift: <b>{shift}</b></div>
          <div style={{ fontSize: '12.5px', color: '#334155', marginTop: '2px' }}>Milk Type: <b>{docData.milkType || 'Cow Milk'}</b></div>
        </div>
      </div>

      {/* Milk Metrics Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px', fontSize: '13px' }}>
        <thead>
          <tr style={{ background: '#4E2A18', color: '#FFFFFF', textAlign: 'center' }}>
            <th style={{ padding: '12px', borderRadius: '8px 0 0 8px' }}>Volume (L)</th>
            <th style={{ padding: '12px' }}>FAT %</th>
            <th style={{ padding: '12px' }}>SNF %</th>
            <th style={{ padding: '12px' }}>Rate per Litre</th>
            <th style={{ padding: '12px', borderRadius: '0 8px 8px 0' }}>Total Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ textAlign: 'center', background: '#F8FAF9', fontSize: '15px', fontWeight: '800' }}>
            <td style={{ padding: '16px', color: '#4E2A18' }}>{qty.toFixed(1)} L</td>
            <td style={{ padding: '16px', color: '#2563EB' }}>{fat.toFixed(1)}%</td>
            <td style={{ padding: '16px', color: '#2563EB' }}>{snf.toFixed(1)}%</td>
            <td style={{ padding: '16px' }}>₹{rate.toFixed(2)}</td>
            <td style={{ padding: '16px', color: '#16A34A', fontSize: '18px', fontWeight: '900' }}>
              ₹{totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Total Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #16A34A 0%, #15803D 100%)',
        color: '#FFFFFF',
        borderRadius: '16px',
        padding: '18px 24px',
        display: 'flex',
        justify: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <div>
          <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '700' }}>TOTAL AMOUNT CREDITED TO FARMER LEDGER</div>
          <div style={{ fontSize: '11px', opacity: 0.9 }}>Calculation: {qty} L × ₹{rate} / L</div>
        </div>
        <div style={{ fontSize: '28px', fontWeight: '900' }}>
          ₹{totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
        </div>
      </div>

      <SignatureSection leftLabel="Farmer Signature" rightLabel="Collection Agent Signature" format={format} />
      <DocumentFooter format={format} tenantName={tenantInfo?.name} />
    </div>
  );
};
