import React, { useState, useEffect } from 'react';
import { useFarm } from '../context/FarmContext';
import { X, Sliders, Printer, Save, RotateCcw, User, Lock, Mail } from 'lucide-react';
import { updateProfile, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase/client';

export const SettingsModal = () => {
  const { activeModal, setActiveModal, rateRules, updateRateRules, sessionConfig, updateSessionConfig, resetAllData, currentUser, setCurrentUser, fast2smsApiKey, setFast2smsApiKey } = useFarm();
  
  // Local settings states
  const [baseRate, setBaseRate] = useState(rateRules.baseRate);
  const [minRate, setMinRate] = useState(rateRules.minRate);
  const [maxRate, setMaxRate] = useState(rateRules.maxRate);
  const [centerName, setCenterName] = useState('Kheda Dairy Center');
  const [autoPrint, setAutoPrint] = useState(true);
  const [doubleCopy, setDoubleCopy] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [smsApiKey, setSmsApiKey] = useState(fast2smsApiKey || '');
  const [smsTestPhone, setSmsTestPhone] = useState('');
  const [smsSending, setSmsSending] = useState(false);
  const [smsStatus, setSmsStatus] = useState('');
  const [notifToggles, setNotifToggles] = useState({
    smsEnabled: true,
    milkCollectionSms: true,
    paymentSms: true,
    advanceSms: true,
    monthlyStatementSms: true,
    otpSms: true,
  });
  const [smsLogs, setSmsLogs] = useState([]);
  const [activeSettingsTab, setActiveSettingsTab] = useState('config'); // 'config' | 'logs'

  useEffect(() => {
    if (activeModal === 'settings') {
      // Fetch Notification Settings
      fetch('/api/admin/notifications/settings?tenantId=default')
        .then(res => res.json())
        .then(data => { if (data.success && data.settings) setNotifToggles(data.settings); })
        .catch(() => {});

      // Fetch SMS Logs
      fetch('/api/admin/notifications/logs?tenantId=default')
        .then(res => res.json())
        .then(data => { if (data.success && data.logs) setSmsLogs(data.logs); })
        .catch(() => {});
    }
  }, [activeModal]);

  // Profile editing states
  const [profileName, setProfileName] = useState(currentUser?.name || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');

  // Shift settings
  const [morningStart, setMorningStart] = useState(sessionConfig.find(s => s.shift === 'Morning')?.start || '05:00');
  const [morningEnd, setMorningEnd] = useState(sessionConfig.find(s => s.shift === 'Morning')?.end || '08:00');
  const [eveningStart, setEveningStart] = useState(sessionConfig.find(s => s.shift === 'Evening')?.start || '17:00');
  const [eveningEnd, setEveningEnd] = useState(sessionConfig.find(s => s.shift === 'Evening')?.end || '20:00');

  if (activeModal !== 'settings') return null;

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileError('');
    setProfileSuccess('');

    try {
      const firebaseUser = auth.currentUser;
      if (!firebaseUser) throw new Error('Not authenticated.');

      // Re-authenticate if changing password
      if (newPassword) {
        if (!currentPassword) {
          setProfileError('Please enter your current password to set a new one.');
          setProfileLoading(false);
          return;
        }
        const credential = EmailAuthProvider.credential(firebaseUser.email, currentPassword);
        await reauthenticateWithCredential(firebaseUser, credential);
        await updatePassword(firebaseUser, newPassword);
      }

      // Update display name in Firebase Auth
      if (profileName && profileName !== firebaseUser.displayName) {
        await updateProfile(firebaseUser, { displayName: profileName });
      }

      // Update Firestore user doc
      await setDoc(doc(db, 'users', firebaseUser.uid), {
        name: profileName,
        email: firebaseUser.email,
      }, { merge: true });

      // Update local context so navbar reflects change immediately
      setCurrentUser(prev => ({ ...prev, name: profileName }));

      setCurrentPassword('');
      setNewPassword('');
      setProfileSuccess('Profile updated successfully!');
      setTimeout(() => setProfileSuccess(''), 3000);
    } catch (err) {
      console.error('Profile update error:', err);
      if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setProfileError('Current password is incorrect.');
      } else if (err.code === 'auth/weak-password') {
        setProfileError('New password must be at least 6 characters.');
      } else {
        setProfileError(err.message || 'Failed to update profile.');
      }
    } finally {
      setProfileLoading(false);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    setFast2smsApiKey(smsApiKey);
    
    // Save Notification Toggles to Firestore
    fetch('/api/admin/notifications/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tenantId: 'default', settings: notifToggles })
    }).catch(() => {});

    updateRateRules({
      baseRate: parseFloat(baseRate) || 45.0,
      minRate: parseFloat(minRate) || 30.0,
      maxRate: parseFloat(maxRate) || 85.0
    });
    
    updateSessionConfig([
      { shift: 'Morning', start: morningStart, end: morningEnd },
      { shift: 'Evening', start: eveningStart, end: eveningEnd }
    ]);

    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setActiveModal(null);
    }, 1200);
  };

  const handleTestSms = async () => {
    if (!smsTestPhone) {
      setSmsStatus('❌ Please enter a 10-digit mobile number for test SMS.');
      return;
    }
    setSmsSending(true);
    setSmsStatus('Sending test SMS...');
    try {
      const res = await fetch('/api/admin/notifications/test-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: smsTestPhone,
          tenantId: 'default'
        })
      });
      const data = await res.json();
      if (data.success) {
        setSmsStatus('✅ Test SMS sent successfully!');
        // Refresh logs
        fetch('/api/admin/notifications/logs?tenantId=default')
          .then(r => r.json())
          .then(d => { if (d.success && d.logs) setSmsLogs(d.logs); })
          .catch(() => {});
      } else {
        setSmsStatus(`❌ ${data.error || 'Failed to send test SMS.'}`);
      }
    } catch (err) {
      setSmsStatus(`❌ Error sending SMS: ${err.message}`);
    } finally {
      setSmsSending(false);
    }
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

        <div className="modal-body" style={{ padding: '24px' }}>

          {/* ── Profile Section ── */}
          <form onSubmit={handleProfileSave}>
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <User size={12} /> My Profile
              </div>

              {profileError && (
                <div style={{ background: '#FEE2E2', color: '#991B1B', padding: '10px 12px', borderRadius: '10px', fontSize: '12.5px', fontWeight: '700', marginBottom: '12px' }}>
                  {profileError}
                </div>
              )}
              {profileSuccess && (
                <div style={{ background: '#D1FAE5', color: '#065F46', padding: '10px 12px', borderRadius: '10px', fontSize: '12.5px', fontWeight: '700', marginBottom: '12px' }}>
                  ✓ {profileSuccess}
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '11.5px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '4px' }}>
                    <User size={11} /> Display Name
                  </label>
                  <input
                    type="text"
                    value={profileName}
                    onChange={e => setProfileName(e.target.value)}
                    placeholder="Your full name"
                    style={{ width: '100%', height: '40px', borderRadius: '10px', border: '1.5px solid var(--border)', padding: '0 12px', fontSize: '13px', color: 'var(--text-main)', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '11.5px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '4px' }}>
                    <Mail size={11} /> Email (read-only)
                  </label>
                  <input
                    type="email"
                    value={currentUser?.email || ''}
                    readOnly
                    style={{ width: '100%', height: '40px', borderRadius: '10px', border: '1.5px solid var(--border)', padding: '0 12px', fontSize: '13px', color: 'var(--text-muted)', background: 'var(--surface-2, #f5f5f5)', boxSizing: 'border-box', cursor: 'not-allowed' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ fontSize: '11.5px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '4px' }}>
                      <Lock size={11} /> Current Password
                    </label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={e => setCurrentPassword(e.target.value)}
                      placeholder="Required to change"
                      style={{ width: '100%', height: '40px', borderRadius: '10px', border: '1.5px solid var(--border)', padding: '0 12px', fontSize: '13px', color: 'var(--text-main)', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '11.5px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '4px' }}>
                      <Lock size={11} /> New Password
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      placeholder="Leave blank to keep"
                      style={{ width: '100%', height: '40px', borderRadius: '10px', border: '1.5px solid var(--border)', padding: '0 12px', fontSize: '13px', color: 'var(--text-main)', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={profileLoading}
                style={{
                  marginTop: '14px',
                  width: '100%',
                  height: '40px',
                  borderRadius: '30px',
                  background: 'var(--primary)',
                  color: 'white',
                  fontWeight: '800',
                  fontSize: '13px',
                  border: 'none',
                  cursor: profileLoading ? 'not-allowed' : 'pointer',
                  opacity: profileLoading ? 0.7 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <Save size={14} />
                {profileLoading ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </form>

          <div style={{ borderTop: '1px solid var(--border)', marginBottom: '20px' }} />

        <form onSubmit={handleSave}>
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

          {/* Sub-tab Navigation */}
          <div style={{ display: 'flex', borderBottom: '1.5px solid var(--border)', marginBottom: '20px', gap: '16px' }}>
            <button
              type="button"
              onClick={() => setActiveSettingsTab('config')}
              style={{
                background: 'none',
                border: 'none',
                padding: '8px 4px',
                fontSize: '13px',
                fontWeight: '800',
                color: activeSettingsTab === 'config' ? 'var(--primary)' : 'var(--text-muted)',
                borderBottom: activeSettingsTab === 'config' ? '2px solid var(--primary)' : '2px solid transparent',
                cursor: 'pointer'
              }}
            >
              System Configurations
            </button>
            <button
              type="button"
              onClick={() => setActiveSettingsTab('logs')}
              style={{
                background: 'none',
                border: 'none',
                padding: '8px 4px',
                fontSize: '13px',
                fontWeight: '800',
                color: activeSettingsTab === 'logs' ? 'var(--primary)' : 'var(--text-muted)',
                borderBottom: activeSettingsTab === 'logs' ? '2px solid var(--primary)' : '2px solid transparent',
                cursor: 'pointer'
              }}
            >
              SMS Audit Logs ({smsLogs.length})
            </button>
          </div>

          {activeSettingsTab === 'logs' ? (
            <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
              <div style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '10px' }}>
                Recent SMS Deliveries (Tenant Isolated)
              </div>
              {smsLogs.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)', fontSize: '13px' }}>
                  No SMS logs recorded yet.
                </div>
              ) : (
                <table style={{ width: '100%', fontSize: '11.5px', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#F8FAF9', textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
                      <th style={{ padding: '8px' }}>Recipient</th>
                      <th style={{ padding: '8px' }}>Type</th>
                      <th style={{ padding: '8px' }}>Status</th>
                      <th style={{ padding: '8px' }}>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {smsLogs.map(log => (
                      <tr key={log.id} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '8px', fontWeight: '700' }}>{log.recipient}</td>
                        <td style={{ padding: '8px' }}>{log.type}</td>
                        <td style={{ padding: '8px' }}>
                          <span style={{
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontWeight: '800',
                            fontSize: '10px',
                            background: log.status === 'SENT' || log.status === 'DELIVERED' ? '#D1FAE5' : '#FEE2E2',
                            color: log.status === 'SENT' || log.status === 'DELIVERED' ? '#065F46' : '#991B1B'
                          }}>
                            {log.status}
                          </span>
                          {log.failureReason && (
                            <div style={{ fontSize: '9.5px', color: '#DC2626', marginTop: '2px' }}>{log.failureReason}</div>
                          )}
                        </td>
                        <td style={{ padding: '8px', color: 'var(--text-muted)' }}>
                          {log.createdAt ? new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          ) : (
            <>
          {/* Section: SMS Gateway (Fast2SMS) */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '10px' }}>
              SMS Gateway (Fast2SMS API)
            </div>
            
            <div className="auth-input-group" style={{ marginBottom: '10px' }}>
              <label style={{ fontSize: '12px', fontWeight: '800' }}>Fast2SMS API Key (Server Environment Encrypted)</label>
              <input
                type="password"
                value={smsApiKey}
                onChange={(e) => setSmsApiKey(e.target.value)}
                placeholder="Managed in server environment"
                style={{
                  width: '100%',
                  height: '40px',
                  borderRadius: '10px',
                  border: '1.5px solid var(--border)',
                  padding: '0 12px',
                  fontSize: '13px',
                  marginTop: '4px'
                }}
              />
            </div>

            {/* Notification Event Toggles */}
            <div style={{ marginTop: '12px', background: '#F8FAF9', padding: '12px', borderRadius: '12px', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '11px', fontWeight: '800', marginBottom: '8px', color: 'var(--text-main)' }}>Event Triggers:</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12px', fontWeight: '700' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={notifToggles.smsEnabled} onChange={e => setNotifToggles(p => ({ ...p, smsEnabled: e.target.checked }))} />
                  <span>SMS System Active</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={notifToggles.milkCollectionSms} onChange={e => setNotifToggles(p => ({ ...p, milkCollectionSms: e.target.checked }))} />
                  <span>Milk Collection SMS</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={notifToggles.paymentSms} onChange={e => setNotifToggles(p => ({ ...p, paymentSms: e.target.checked }))} />
                  <span>Payment SMS</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={notifToggles.advanceSms} onChange={e => setNotifToggles(p => ({ ...p, advanceSms: e.target.checked }))} />
                  <span>Advance SMS</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={notifToggles.monthlyStatementSms} onChange={e => setNotifToggles(p => ({ ...p, monthlyStatementSms: e.target.checked }))} />
                  <span>Monthly Statement</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={notifToggles.otpSms} onChange={e => setNotifToggles(p => ({ ...p, otpSms: e.target.checked }))} />
                  <span>OTP SMS</span>
                </label>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '12px' }}>
              <input
                type="tel"
                value={smsTestPhone}
                onChange={(e) => setSmsTestPhone(e.target.value)}
                placeholder="Test Mobile No (e.g. 9876543210)"
                style={{
                  flex: 1,
                  height: '36px',
                  borderRadius: '8px',
                  border: '1px solid var(--border)',
                  padding: '0 10px',
                  fontSize: '12.5px'
                }}
              />
              <button
                type="button"
                onClick={handleTestSms}
                disabled={smsSending}
                style={{
                  height: '36px',
                  padding: '0 14px',
                  borderRadius: '8px',
                  background: '#2563EB',
                  color: 'white',
                  fontWeight: '700',
                  fontSize: '12px',
                  border: 'none',
                  cursor: smsSending ? 'not-allowed' : 'pointer'
                }}
              >
                {smsSending ? 'Sending...' : 'Test SMS'}
              </button>
            </div>

            {smsStatus && (
              <div style={{ fontSize: '11.5px', marginTop: '6px', fontWeight: '700', color: smsStatus.startsWith('✅') ? '#059669' : '#DC2626' }}>
                {smsStatus}
              </div>
            )}
          </div>

          {/* Section: Shift Configuration */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '10px' }}>
              Operator Shift Schedule
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '80px', fontSize: '13px', fontWeight: '800' }}>Morning</div>
                <input type="time" value={morningStart} onChange={e => setMorningStart(e.target.value)} style={{ flex: 1, height: '36px', borderRadius: '8px', border: '1px solid var(--border)', padding: '0 8px', fontSize: '13px' }} />
                <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>to</span>
                <input type="time" value={morningEnd} onChange={e => setMorningEnd(e.target.value)} style={{ flex: 1, height: '36px', borderRadius: '8px', border: '1px solid var(--border)', padding: '0 8px', fontSize: '13px' }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '80px', fontSize: '13px', fontWeight: '800' }}>Evening</div>
                <input type="time" value={eveningStart} onChange={e => setEveningStart(e.target.value)} style={{ flex: 1, height: '36px', borderRadius: '8px', border: '1px solid var(--border)', padding: '0 8px', fontSize: '13px' }} />
                <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>to</span>
                <input type="time" value={eveningEnd} onChange={e => setEveningEnd(e.target.value)} style={{ flex: 1, height: '36px', borderRadius: '8px', border: '1px solid var(--border)', padding: '0 8px', fontSize: '13px' }} />
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
            </button>
          </div>
          </>
          )}
        </form>
        </div>
      </div>
    </div>
  );
};
