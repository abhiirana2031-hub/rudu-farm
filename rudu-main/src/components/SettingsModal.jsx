import React, { useState } from 'react';
import { useFarm } from '../context/FarmContext';
import { X, Sliders, Printer, Shield, Save, RotateCcw } from 'lucide-react';

export const SettingsModal = () => {
  const { activeModal, setActiveModal, rateRules, updateRateRules, resetAllData } = useFarm();
  
  // Local settings states
  const [baseRate, setBaseRate] = useState(rateRules.baseRate);
  const [minRate, setMinRate] = useState(rateRules.minRate);
  const [maxRate, setMaxRate] = useState(rateRules.maxRate);
  const [centerName, setCenterName] = useState('Kheda Dairy Center');
  const [autoPrint, setAutoPrint] = useState(true);
  const [doubleCopy, setDoubleCopy] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (activeModal !== 'settings') return null;

  const handleSave = (e) => {
    e.preventDefault();
    updateRateRules({
      baseRate: parseFloat(baseRate) || 45.0,
      minRate: parseFloat(minRate) || 30.0,
      maxRate: parseFloat(maxRate) || 85.0
    });
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setActiveModal(null);
    }, 1200);
  };

  const handleResetSystemData = () => {
    if (window.confirm('Are you absolutely sure you want to reset all supply logs, transactions, and user listings back to factory defaults? This action is irreversible.')) {
      resetAllData();
      alert('System database has been successfully reset.');
      window.location.reload();
    }
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 1200 }}>
      <div className="modal-content" style={{ maxWidth: '460px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sliders size={18} />
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800' }}>System Configurations</h3>
          </div>
          <button
            onClick={() => setActiveModal(null)}
            style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSave} className="modal-body" style={{ padding: '24px' }}>
          {saveSuccess && (
            <div style={{ background: '#D1FAE5', color: '#065F46', padding: '12px', borderRadius: '12px', fontSize: '13px', fontWeight: '800', marginBottom: '16px', textAlign: 'center' }}>
              ✓ Settings saved successfully!
            </div>
          )}

          {/* Section 1: Dairy Center Info */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '10px' }}>
              Dairy Terminal Settings
            </div>
            
            <div className="auth-input-group">
              <label style={{ fontSize: '12.5px', fontWeight: '800' }}>Active Collection Center Name</label>
              <input
                type="text"
                value={centerName}
                onChange={(e) => setCenterName(e.target.value)}
                style={{
                  width: '100%',
                  height: '42px',
                  borderRadius: '12px',
                  border: '1.5px solid var(--border)',
                  padding: '0 12px',
                  fontSize: '13.5px',
                  color: 'var(--text-main)',
                  marginTop: '4px'
                }}
              />
            </div>
          </div>

          {/* Section 2: Rate Rules */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '10px' }}>
              Rate Engine Constants
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: '800' }}>Base Rate (₹)</label>
                <input
                  type="number"
                  step="0.1"
                  value={baseRate}
                  onChange={(e) => setBaseRate(e.target.value)}
                  style={{
                    width: '100%',
                    height: '42px',
                    borderRadius: '12px',
                    border: '1.5px solid var(--border)',
                    padding: '0 8px',
                    fontSize: '13.5px',
                    color: 'var(--text-main)',
                    marginTop: '4px',
                    fontWeight: '800'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: '800' }}>Min Rate (₹)</label>
                <input
                  type="number"
                  step="0.1"
                  value={minRate}
                  onChange={(e) => setMinRate(e.target.value)}
                  style={{
                    width: '100%',
                    height: '42px',
                    borderRadius: '12px',
                    border: '1.5px solid var(--border)',
                    padding: '0 8px',
                    fontSize: '13.5px',
                    color: 'var(--text-main)',
                    marginTop: '4px',
                    fontWeight: '800'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: '800' }}>Max Rate (₹)</label>
                <input
                  type="number"
                  step="0.1"
                  value={maxRate}
                  onChange={(e) => setMaxRate(e.target.value)}
                  style={{
                    width: '100%',
                    height: '42px',
                    borderRadius: '12px',
                    border: '1.5px solid var(--border)',
                    padding: '0 8px',
                    fontSize: '13.5px',
                    color: 'var(--text-main)',
                    marginTop: '4px',
                    fontWeight: '800'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Section 3: Hardware Slips Preferences */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '10px' }}>
              Printing Slip Preferences
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Printer size={16} style={{ color: 'var(--text-muted)' }} />
                  <span style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-main)' }}>Auto-Print on Entry Save</span>
                </div>
                <input
                  type="checkbox"
                  checked={autoPrint}
                  onChange={(e) => setAutoPrint(e.target.checked)}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
              </label>

              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Printer size={16} style={{ color: 'var(--text-muted)' }} />
                  <span style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-main)' }}>Print Double Copy (Producer & Center)</span>
                </div>
                <input
                  type="checkbox"
                  checked={doubleCopy}
                  onChange={(e) => setDoubleCopy(e.target.checked)}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
              </label>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
            <button
              type="submit"
              className="auth-submit-btn"
              style={{ padding: '12px', borderRadius: '30px', width: '100%', justifyContent: 'center' }}
            >
              <Save size={16} />
              <span>Save System Settings</span>
            </button>

            <button
              type="button"
              onClick={handleResetSystemData}
              style={{
                padding: '12px',
                borderRadius: '30px',
                width: '100%',
                border: '1.5px solid #EF4444',
                background: 'transparent',
                color: '#EF4444',
                fontWeight: '800',
                fontSize: '13px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <RotateCcw size={16} />
              <span>Reset Factory Data</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
