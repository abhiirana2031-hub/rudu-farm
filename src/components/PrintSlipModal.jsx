import { RuduLogo } from './RuduLogo';
import React, { useState } from 'react';
import { useFarm } from '../context/FarmContext';
import { X, Printer, Check, MessageSquare } from 'lucide-react';

const WhatsAppIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347z"/>
    <path d="M12 2C6.477 2 2 6.477 2 12c0 2.14.673 4.12 1.823 5.75L2 22l4.388-1.782A9.957 9.957 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a7.96 7.96 0 0 1-4.061-1.111l-.291-.173-2.6 1.056.903-2.527-.19-.303A7.956 7.956 0 0 1 4 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z"/>
  </svg>
);

export const PrintSlipModal = () => {
  const { activeModal, setActiveModal, selectedSlipEntry, farmers, fast2smsApiKey } = useFarm();
  const [copied, setCopied] = useState(false);
  const [smsStatus, setSmsStatus] = useState('');
  const [sendingSms, setSendingSms] = useState(false);

  if (activeModal !== 'printSlip' || !selectedSlipEntry) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsAppShare = () => {
    const farmer = farmers.find(f => f.id === selectedSlipEntry.farmerId);
    const rawPhone = farmer?.phone || selectedSlipEntry.phone || '9876543210';
    const cleanPhone = rawPhone.replace(/[^\d]/g, '');

    const receiptMessage = `* RUDU FARM - OFFICIAL MILK RECEIPT*
----------------------------------------
*Receipt No:* ${selectedSlipEntry.id}
*Date / Time:* ${selectedSlipEntry.date} ${selectedSlipEntry.timestamp || ''}
*Shift:* ${selectedSlipEntry.shift} Shift

*Farmer Name:* ${selectedSlipEntry.farmerName}
*Farmer ID:* ${selectedSlipEntry.farmerId}
----------------------------------------
*Quantity:* ${selectedSlipEntry.quantity} Liters
*Fat %:* ${selectedSlipEntry.fat}%
*SNF %:* ${selectedSlipEntry.snf}%
*Temp:* ${selectedSlipEntry.temperature || '4.0'} °C
*Rate:* ₹${selectedSlipEntry.rate.toFixed(2)} / L

*TOTAL PAYABLE:* ₹${selectedSlipEntry.totalAmount.toFixed(2)}
----------------------------------------
Thank you for trusting Rudu Farm! 🌱
_Better Dairy. Better Tomorrow._`;

    // Copy to clipboard as backup
    try {
      navigator.clipboard.writeText(receiptMessage);
    } catch (err) {}

    setCopied(true);
    setTimeout(() => setCopied(false), 2500);

    // Formulate WhatsApp Web / App Direct URL
    const encodedMessage = encodeURIComponent(receiptMessage);
    const whatsappUrl = cleanPhone.length >= 10
      ? `https://wa.me/${cleanPhone.startsWith('91') ? cleanPhone : '91' + cleanPhone}?text=${encodedMessage}`
      : `https://api.whatsapp.com/send?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');
  };

  const handleSmsSend = async () => {
    const farmer = farmers.find(f => f.id === selectedSlipEntry.farmerId);
    const phone = farmer?.phone || selectedSlipEntry.phone;

    if (!phone) {
      setSmsStatus('❌ Farmer phone number is missing.');
      setTimeout(() => setSmsStatus(''), 3500);
      return;
    }

    setSendingSms(true);
    setSmsStatus('Sending SMS...');

    try {
      const smsMessage = `RUDU FARM MILK RECEIPT\nNo: ${selectedSlipEntry.id}\nFarmer: ${selectedSlipEntry.farmerName}\nQty: ${selectedSlipEntry.quantity}L | Fat: ${selectedSlipEntry.fat}%\nRate: Rs.${selectedSlipEntry.rate.toFixed(2)}/L\nTotal: Rs.${selectedSlipEntry.totalAmount.toFixed(2)}\nThank you!`;

      const res = await fetch('/api/sms/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          numbers: phone,
          message: smsMessage,
          apiKey: fast2smsApiKey || undefined,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setSmsStatus('✅ SMS Sent Successfully!');
      } else {
        setSmsStatus(`❌ Failed: ${data.error}`);
      }
    } catch (err) {
      setSmsStatus(`❌ Error: ${err.message || 'SMS failed'}`);
    } finally {
      setSendingSms(false);
      setTimeout(() => setSmsStatus(''), 4000);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '440px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Printer size={18} />
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800' }}>Thermal Slip Preview</h3>
          </div>
          <button
            onClick={() => setActiveModal(null)}
            style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        <div className="modal-body" style={{ background: '#F8FAF9', padding: '20px' }}>
          {/* Thermal Slip Container */}
          <div className="thermal-slip printable-area">
            <div className="header">
              <RuduLogo height={32} />
              <h2>RUDU FARM</h2>
              <div style={{ fontSize: '11px' }}>Smart Dairy Collection Center</div>
              <div style={{ fontSize: '10px', marginTop: '4px' }}>Rudu Dairy Center</div>
            </div>

            <div className="line-item">
              <span>Receipt No:</span>
              <strong>{selectedSlipEntry.id}</strong>
            </div>
            <div className="line-item">
              <span>Date / Time:</span>
              <span>{selectedSlipEntry.date} {selectedSlipEntry.timestamp}</span>
            </div>
            <div className="line-item">
              <span>Shift:</span>
              <strong>{selectedSlipEntry.shift}</strong>
            </div>

            <hr style={{ border: 'none', borderTop: '1px dashed #000', margin: '8px 0' }} />

            <div className="line-item">
              <span>Farmer Name:</span>
              <strong>{selectedSlipEntry.farmerName}</strong>
            </div>
            <div className="line-item">
              <span>Farmer ID:</span>
              <strong>{selectedSlipEntry.farmerId}</strong>
            </div>

            <hr style={{ border: 'none', borderTop: '1px dashed #000', margin: '8px 0' }} />

            <div className="line-item">
              <span>Quantity (Liters):</span>
              <strong>{selectedSlipEntry.quantity} L</strong>
            </div>
            <div className="line-item">
              <span>Fat %:</span>
              <span>{selectedSlipEntry.fat}%</span>
            </div>
            <div className="line-item">
              <span>SNF %:</span>
              <span>{selectedSlipEntry.snf}%</span>
            </div>
            <div className="line-item">
              <span>Temperature:</span>
              <span>{selectedSlipEntry.temperature || '4.0'} °C</span>
            </div>

            <div className="line-item" style={{ marginTop: '6px' }}>
              <span>Applied Rate:</span>
              <strong>₹{selectedSlipEntry.rate.toFixed(2)} / L</strong>
            </div>

            <div className="total-box">
              <span>TOTAL PAYABLE:</span>
              <span>₹{selectedSlipEntry.totalAmount.toFixed(2)}</span>
            </div>

            {/* QR Code Slip Generator */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', margin: '14px 0' }}>
              <div style={{ textAlign: 'center' }}>
                <svg width="70" height="70" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', margin: '0 auto' }}>
                  <rect width="100" height="100" rx="6" fill="#FFFFFF" stroke="#EFE2D5" strokeWidth="1.5" />
                  <rect x="8" y="8" width="22" height="22" fill="#3C1F10" />
                  <rect x="12" y="12" width="14" height="14" fill="#FFFFFF" />
                  <rect x="15" y="15" width="8" height="8" fill="#3C1F10" />
                  <rect x="70" y="8" width="22" height="22" fill="#3C1F10" />
                  <rect x="74" y="12" width="14" height="14" fill="#FFFFFF" />
                  <rect x="77" y="15" width="8" height="8" fill="#3C1F10" />
                  <rect x="8" y="70" width="22" height="22" fill="#3C1F10" />
                  <rect x="12" y="74" width="14" height="14" fill="#FFFFFF" />
                  <rect x="15" y="77" width="8" height="8" fill="#3C1F10" />
                  <rect x="76" y="76" width="10" height="10" fill="#3C1F10" />
                  <rect x="36" y="8" width="4" height="4" fill="#3C1F10" />
                  <rect x="44" y="8" width="8" height="4" fill="#3C1F10" />
                  <rect x="56" y="8" width="4" height="4" fill="#3C1F10" />
                  <rect x="36" y="16" width="8" height="4" fill="#3C1F10" />
                  <rect x="48" y="12" width="4" height="8" fill="#3C1F10" />
                  <rect x="56" y="16" width="8" height="4" fill="#3C1F10" />
                  <rect x="8" y="36" width="4" height="8" fill="#3C1F10" />
                  <rect x="18" y="40" width="12" height="4" fill="#3C1F10" />
                  <rect x="36" y="36" width="4" height="4" fill="#3C1F10" />
                  <rect x="44" y="36" width="8" height="4" fill="#3C1F10" />
                  <rect x="56" y="36" width="4" height="8" fill="#3C1F10" />
                  <rect x="68" y="36" width="12" height="4" fill="#3C1F10" />
                  <rect x="8" y="48" width="8" height="4" fill="#3C1F10" />
                  <rect x="22" y="48" width="4" height="4" fill="#3C1F10" />
                  <rect x="30" y="44" width="4" height="8" fill="#3C1F10" />
                  <rect x="38" y="48" width="12" height="4" fill="#3C1F10" />
                  <rect x="56" y="48" width="4" height="4" fill="#3C1F10" />
                  <rect x="64" y="44" width="8" height="4" fill="#3C1F10" />
                  <rect x="76" y="48" width="12" height="4" fill="#3C1F10" />
                  <rect x="8" y="56" width="4" height="4" fill="#3C1F10" />
                  <rect x="18" y="56" width="8" height="4" fill="#3C1F10" />
                  <rect x="30" y="56" width="12" height="4" fill="#3C1F10" />
                  <rect x="48" y="56" width="4" height="8" fill="#3C1F10" />
                  <rect x="56" y="56" width="12" height="4" fill="#3C1F10" />
                  <rect x="72" y="56" width="4" height="4" fill="#3C1F10" />
                  <rect x="80" y="56" width="8" height="4" fill="#3C1F10" />
                  <rect x="36" y="68" width="8" height="4" fill="#3C1F10" />
                  <rect x="48" y="68" width="4" height="12" fill="#3C1F10" />
                  <rect x="56" y="68" width="12" height="4" fill="#3C1F10" />
                  <rect x="36" y="80" width="4" height="8" fill="#3C1F10" />
                  <rect x="44" y="84" width="12" height="4" fill="#3C1F10" />
                  <rect x="60" y="80" width="8" height="8" fill="#3C1F10" />
                  <rect x="8" y="90" width="12" height="4" fill="#3C1F10" />
                  <rect x="26" y="90" width="4" height="4" fill="#3C1F10" />
                  <rect x="36" y="90" width="8" height="4" fill="#3C1F10" />
                  <rect x="48" y="90" width="16" height="4" fill="#3C1F10" />
                  <rect x="68" y="90" width="4" height="4" fill="#3C1F10" />
                  <rect x="76" y="90" width="12" height="4" fill="#3C1F10" />
                </svg>
                <div style={{ fontSize: '7px', fontWeight: '800', marginTop: '4px', letterSpacing: '0.2px', color: 'var(--text-muted)' }}>SCAN RECEIPT FOR INFO</div>
              </div>

              <div style={{ flex: 1, borderLeft: '1px dashed var(--border)', paddingLeft: '16px', textTransform: 'uppercase', fontSize: '9px', textAlign: 'center' }}>
                <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '1px' }}>||||| | |||||</div>
                <div style={{ marginTop: '2px', fontFamily: 'monospace' }}>{selectedSlipEntry.id}</div>
              </div>
            </div>

            <div className="footer">
              Thank you for trusting Rudu Farm!<br />
              Better Dairy. Better Tomorrow.
            </div>
          </div>

          {smsStatus && (
            <div style={{
              marginTop: '12px',
              padding: '8px 12px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: '700',
              textAlign: 'center',
              background: smsStatus.startsWith('✅') ? '#D1FAE5' : '#FEE2E2',
              color: smsStatus.startsWith('✅') ? '#065F46' : '#991B1B'
            }}>
              {smsStatus}
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
            <button onClick={handlePrint} className="btn btn-primary" style={{ flex: 1, justifyContent: 'center', padding: '10px 6px', fontSize: '12px' }}>
              <Printer size={15} /> Print
            </button>
            <button
              onClick={handleWhatsAppShare}
              className="btn btn-primary"
              style={{ flex: 1, justifyContent: 'center', padding: '10px 6px', fontSize: '12px', background: '#25D366', borderColor: '#25D366' }}
            >
              {copied ? <Check size={15} color="#FFFFFF" /> : <WhatsAppIcon size={15} />}
              {copied ? 'Copied!' : 'WhatsApp'}
            </button>
            <button
              onClick={handleSmsSend}
              disabled={sendingSms}
              className="btn btn-primary"
              style={{ flex: 1, justifyContent: 'center', padding: '10px 6px', fontSize: '12px', background: '#2563EB', borderColor: '#2563EB', opacity: sendingSms ? 0.7 : 1 }}
            >
              <MessageSquare size={15} />
              {sendingSms ? 'Sending...' : 'SMS'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
