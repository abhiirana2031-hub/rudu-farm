import React, { useState } from 'react';
import { useFarm } from '../context/FarmContext';
import { X, Briefcase, CheckCircle2, Landmark, Wallet, UserCheck } from 'lucide-react';

const UpiLogo = ({ size = 20, isSelected = false, brandColor = '#0284C7' }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={{ display: 'inline-block' }}>
    <rect width="32" height="32" rx="7" fill={isSelected ? brandColor : '#E0F2FE'} />
    <path d="M19.5 8L13.5 24H10.5L16.5 8H19.5Z" fill={isSelected ? '#FFFFFF' : brandColor} />
    <path d="M22.5 8L16.5 24H19.5L25.5 8H22.5Z" fill={isSelected ? '#F5EBE1' : '#4E2A18'} />
    <path d="M7 16L13 10H17L11 16H7Z" fill={isSelected ? '#FFFFFF' : brandColor} />
  </svg>
);

export const OperatorPaymentModal = () => {
  const { activeModal, setActiveModal, employees, processOperatorPayment } = useFarm();

  const initialEmp = employees[0];
  const [empId, setEmpId] = useState(initialEmp?.id || '');
  const [empQuery, setEmpQuery] = useState(initialEmp ? `${initialEmp.name} (${initialEmp.id})` : '');
  const [amount, setAmount] = useState('18000');
  const [payCategory, setPayCategory] = useState('Monthly Salary Settlement');
  const [method, setMethod] = useState('Direct UPI Transfer');
  const [selectedUpiApp, setSelectedUpiApp] = useState('PhonePe');
  const [showUpiPopup, setShowUpiPopup] = useState(false);
  const [notes, setNotes] = useState('Monthly Salary Disbursement for July 2026');

  if (activeModal !== 'makeOperatorPayment') return null;

  const selectedEmp = employees.find(e => e.id === empId) || employees[0];

  const handleEmpQueryChange = (queryVal) => {
    setEmpQuery(queryVal);
    const matched = employees.find(e => 
      `${e.name} (${e.id})`.toLowerCase().includes(queryVal.toLowerCase()) ||
      e.name.toLowerCase().includes(queryVal.toLowerCase()) ||
      e.id.toLowerCase().includes(queryVal.toLowerCase())
    );
    if (matched) {
      setEmpId(matched.id);
      const salaryVal = matched.salary ? matched.salary.replace(/\D/g, '') : '18000';
      if (salaryVal) setAmount(salaryVal);
    }
  };

  const handleFullSalary = () => {
    const salaryVal = selectedEmp?.salary ? selectedEmp.salary.replace(/\D/g, '') : '18000';
    setAmount(salaryVal || '18000');
  };

  const handleHalfSalary = () => {
    const salaryVal = selectedEmp?.salary ? parseFloat(selectedEmp.salary.replace(/\D/g, '')) : 18000;
    setAmount(Math.round((salaryVal || 18000) / 2).toString());
  };

  const handleSelectMethod = (methodName) => {
    setMethod(methodName);
    if (methodName.includes('UPI')) {
      setShowUpiPopup(true);
    }
  };

  const handleSelectUpiApp = (appName) => {
    setSelectedUpiApp(appName);
    setShowUpiPopup(false);
    const randomTx = Math.floor(10000000 + Math.random() * 90000000);
    setNotes(`[${payCategory}] Paid via ${appName} (UPI/${appName.toUpperCase().replace(/\s+/g, '')}/${randomTx})`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!empId || !amount) return;

    processOperatorPayment({
      empId,
      empName: selectedEmp?.name || 'Operator Staff',
      amount,
      method: method.includes('UPI') ? `Direct UPI (${selectedUpiApp})` : method,
      notes,
      reference: method.includes('UPI') ? `SALARY-UPI/${selectedUpiApp.toUpperCase().replace(/\s+/g, '')}/${Math.floor(10000000 + Math.random() * 90000000)}` : undefined
    });

    setActiveModal(null);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '540px' }}>
        {/* Modal Header */}
        <div className="modal-header" style={{ background: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)', padding: '20px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(255,255,255,0.18)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Briefcase size={22} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: 'white' }}>Disburse Operator Salary</h3>
              <p style={{ margin: 0, fontSize: '12px', color: '#BAE6FD' }}>Staff salary disbarment & operational payroll</p>
            </div>
          </div>
          <button
            onClick={() => setActiveModal(null)}
            style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
          >
            <X size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body" style={{ padding: '24px' }}>
          {/* Select Operator */}
          <div className="form-group">
            <label style={{ fontWeight: '700', fontSize: '13px' }}>Select Operator Staff</label>
            <input
              type="text"
              list="operator-payroll-datalist"
              className="form-input"
              value={empQuery}
              onChange={(e) => handleEmpQueryChange(e.target.value)}
              placeholder="Search by operator name or ID (e.g. sagar / EMP956)..."
              style={{ fontWeight: '700', fontSize: '14px' }}
              autoComplete="off"
              required
            />
            <datalist id="operator-payroll-datalist">
              {employees.map(emp => (
                <option key={emp.id} value={`${emp.name} (${emp.id}) — ${emp.center || 'Kheda Center'}`} />
              ))}
            </datalist>
          </div>

          {/* Operator Info Banner Card */}
          <div style={{ background: '#F0F9FF', border: '1px solid #BAE6FD', padding: '14px 16px', borderRadius: '14px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: '800', color: '#0369A1' }}>
                  <UserCheck size={16} /> {selectedEmp?.name || 'Operator'}
                </div>
                <div style={{ fontSize: '12px', color: '#0284C7', marginTop: '2px', fontWeight: '600' }}>
                  Role: <strong>{selectedEmp?.role || 'Milk Collection Agent'}</strong>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>Monthly Salary</div>
                <div style={{ fontSize: '18px', fontWeight: '800', color: '#0369A1' }}>
                  {selectedEmp?.salary || '₹18,000 / mo'}
                </div>
              </div>
            </div>
          </div>

          {/* Payment Category Pills */}
          <div className="form-group">
            <label style={{ fontWeight: '700', fontSize: '13px' }}>Disbursement Category</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginTop: '4px' }}>
              {['Monthly Salary Settlement', 'Shift Allowance', 'Bonus Incentive'].map(cat => {
                const isSelected = payCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setPayCategory(cat)}
                    style={{
                      padding: '8px 4px',
                      borderRadius: '8px',
                      border: isSelected ? '2px solid #0284C7' : '1px solid #E2E8F0',
                      background: isSelected ? '#F0F9FF' : '#FFFFFF',
                      color: isSelected ? '#0369A1' : '#64748B',
                      fontWeight: '700',
                      fontSize: '11px',
                      cursor: 'pointer',
                      textAlign: 'center'
                    }}
                  >
                    {cat.split(' ')[0]} {cat.split(' ')[1] || ''}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Amount & Quick Settlement Chips */}
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <label style={{ fontWeight: '700', fontSize: '13px' }}>Salary Amount (₹)</label>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  type="button"
                  onClick={handleFullSalary}
                  style={{ background: '#0284C7', color: '#FFFFFF', border: 'none', borderRadius: '6px', padding: '3px 8px', fontSize: '11px', fontWeight: '700', cursor: 'pointer' }}
                >
                  100% Full Salary
                </button>
                <button
                  type="button"
                  onClick={handleHalfSalary}
                  style={{ background: '#F0F9FF', color: '#0284C7', border: '1px solid #BAE6FD', borderRadius: '6px', padding: '3px 8px', fontSize: '11px', fontWeight: '700', cursor: 'pointer' }}
                >
                  50% Advance
                </button>
              </div>
            </div>

            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontWeight: '800', fontSize: '16px', color: '#0284C7' }}>
                ₹
              </span>
              <input
                type="number"
                className="form-input"
                style={{ paddingLeft: '32px', fontSize: '16px', fontWeight: '800', color: '#0F172A' }}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="18000"
                required
              />
            </div>
          </div>

          {/* Payment Method Selector Pills */}
          <div className="form-group">
            <label style={{ fontWeight: '700', fontSize: '13px' }}>Payment Transfer Method</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginTop: '6px' }}>
              {[
                { id: 'upi', name: 'Direct UPI Transfer', label: 'Direct UPI', isUpi: true },
                { id: 'cash', name: 'Cash Disbursement', label: 'Cash', icon: Wallet },
                { id: 'bank', name: 'Direct Bank Transfer', label: 'Bank Transfer', icon: Landmark }
              ].map(m => {
                const isSelected = method === m.name;
                const IconComp = m.icon;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => handleSelectMethod(m.name)}
                    style={{
                      padding: '12px 8px',
                      borderRadius: '12px',
                      border: isSelected ? '2px solid #0284C7' : '1px solid #CBD5E1',
                      background: isSelected ? '#F0F9FF' : '#FFFFFF',
                      color: isSelected ? '#0369A1' : '#64748B',
                      fontWeight: '800',
                      fontSize: '12px',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '6px',
                      textAlign: 'center',
                      boxShadow: isSelected ? '0 4px 12px rgba(2, 132, 199, 0.18)' : 'none',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {m.isUpi ? (
                      <UpiLogo size={22} isSelected={isSelected} brandColor="#0284C7" />
                    ) : (
                      <IconComp size={20} color={isSelected ? '#0284C7' : '#64748B'} />
                    )}
                    <span>{m.label}</span>
                  </button>
                );
              })}
            </div>

            {/* UPI Payment Apps Quick Gateway Selector */}
            {method.includes('UPI') && (
              <div style={{ marginTop: '10px', background: '#F0F9FF', border: '1px solid #BAE6FD', padding: '12px', borderRadius: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '11px', fontWeight: '800', color: '#0369A1', textTransform: 'uppercase' }}>
                    ⚡ Select Staff UPI App Gateway
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowUpiPopup(true)}
                    style={{ background: 'none', border: 'none', color: '#0369A1', fontWeight: '800', fontSize: '11px', cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    View Popup Modal ↗
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
                  {[
                    { name: 'PhonePe', color: '#5f259f', bg: '#F3E8FF', badge: '🟪 PhonePe' },
                    { name: 'Paytm', color: '#002E6E', bg: '#E0F2FE', badge: '🟦 Paytm' },
                    { name: 'Google Pay', color: '#1F2937', bg: '#F3F4F6', badge: 'GPay' },
                    { name: 'BHIM UPI', color: '#007934', bg: '#F5EBE1', badge: '🟩 BHIM' }
                  ].map(app => {
                    const isAppSelected = selectedUpiApp === app.name;
                    return (
                      <button
                        key={app.name}
                        type="button"
                        onClick={() => handleSelectUpiApp(app.name)}
                        style={{
                          padding: '8px 4px',
                          borderRadius: '8px',
                          border: isAppSelected ? `2px solid ${app.color}` : '1px solid #E2E8F0',
                          background: isAppSelected ? app.bg : '#FFFFFF',
                          color: app.color,
                          fontWeight: '800',
                          fontSize: '11px',
                          cursor: 'pointer',
                          textAlign: 'center'
                        }}
                      >
                        {app.badge}
                      </button>
                    );
                  })}
                </div>

                <div style={{ marginTop: '8px', fontSize: '11px', fontWeight: '700', color: '#0369A1', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span>✓ Transferring to Staff VPA via <strong>{selectedUpiApp}</strong> ({selectedEmp?.name ? selectedEmp.name.toLowerCase().replace(/\s+/g, '') + '@okaxis' : 'staff@upi'})</span>
                </div>
              </div>
            )}
          </div>

          {/* Reference Notes */}
          <div className="form-group">
            <label style={{ fontWeight: '700', fontSize: '13px' }}>Payroll Reference / Period</label>
            <input
              type="text"
              className="form-input"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. July 2026 Monthly Staff Salary Settlement"
            />
          </div>

          {/* Action Button */}
          <button
            type="submit"
            className="btn btn-primary"
            style={{
              width: '100%',
              justify: 'center',
              background: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)',
              boxShadow: '0 4px 14px rgba(2, 132, 199, 0.3)',
              padding: '12px',
              fontWeight: '800',
              fontSize: '15px',
              marginTop: '12px'
            }}
          >
            <CheckCircle2 size={18} /> Confirm & Process Staff Salary (₹{parseFloat(amount || 0).toLocaleString()})
          </button>
        </form>
      </div>

      {/* UPI Payment Apps Popup Modal */}
      {showUpiPopup && (
        <div className="modal-overlay" style={{ zIndex: 1200 }}>
          <div className="modal-content" style={{ maxWidth: '440px', padding: 0, borderRadius: '20px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
            <div style={{ background: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)', padding: '20px 24px', color: '#FFFFFF', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(255,255,255,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
                  ⚡
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: '#FFFFFF' }}>Select UPI Payment App</h4>
                  <p style={{ margin: 0, fontSize: '11px', color: '#BAE6FD' }}>Disburse ₹{parseFloat(amount || 0).toLocaleString()} to {selectedEmp?.name || 'Staff'}</p>
                </div>
              </div>
              <button onClick={() => setShowUpiPopup(false)} style={{ background: 'none', border: 'none', color: '#FFFFFF', cursor: 'pointer' }}>
                <X size={22} />
              </button>
            </div>

            <div style={{ padding: '20px' }}>
              <div style={{ background: '#F0F9FF', padding: '12px 16px', borderRadius: '12px', border: '1px solid #BAE6FD', marginBottom: '16px', fontSize: '12px', color: '#0369A1' }}>
                <div>Recipient Staff VPA: <strong>{selectedEmp?.name ? selectedEmp.name.toLowerCase().replace(/\s+/g, '') + '@okaxis' : 'staff@upi'}</strong></div>
                <div style={{ marginTop: '2px' }}>Salary Amount: <strong style={{ fontSize: '15px' }}>₹{parseFloat(amount || 0).toLocaleString()}</strong></div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {/* PhonePe */}
                <button
                  type="button"
                  onClick={() => handleSelectUpiApp('PhonePe')}
                  style={{
                    background: '#5f259f',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '14px',
                    padding: '16px 12px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px',
                    fontWeight: '800',
                    fontSize: '13px',
                    boxShadow: '0 4px 12px rgba(95, 37, 159, 0.3)'
                  }}
                >
                  <div style={{ background: '#FFFFFF', color: '#5f259f', padding: '4px 12px', borderRadius: '8px', fontWeight: '900', fontSize: '13px' }}>
                    🟪 PhonePe
                  </div>
                  <span style={{ fontSize: '11px', opacity: 0.9 }}>Open PhonePe App</span>
                </button>

                {/* Paytm */}
                <button
                  type="button"
                  onClick={() => handleSelectUpiApp('Paytm')}
                  style={{
                    background: '#002E6E',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '14px',
                    padding: '16px 12px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px',
                    fontWeight: '800',
                    fontSize: '13px',
                    boxShadow: '0 4px 12px rgba(0, 46, 110, 0.3)'
                  }}
                >
                  <div style={{ background: '#00BAF2', color: '#002E6E', padding: '4px 12px', borderRadius: '8px', fontWeight: '900', fontSize: '13px' }}>
                    🟦 Paytm
                  </div>
                  <span style={{ fontSize: '11px', opacity: 0.9 }}>Open Paytm Wallet</span>
                </button>

                {/* Google Pay */}
                <button
                  type="button"
                  onClick={() => handleSelectUpiApp('Google Pay')}
                  style={{
                    background: '#FFFFFF',
                    color: '#1F2937',
                    border: '2px solid #E5E7EB',
                    borderRadius: '14px',
                    padding: '16px 12px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px',
                    fontWeight: '800',
                    fontSize: '13px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
                  }}
                >
                  <div style={{ background: '#F3F4F6', color: '#1F2937', padding: '4px 12px', borderRadius: '8px', fontWeight: '900', fontSize: '13px' }}>
                    🔴🟢🔵 GPay
                  </div>
                  <span style={{ fontSize: '11px', color: '#6B7280' }}>Open Google Pay</span>
                </button>

                {/* BHIM UPI */}
                <button
                  type="button"
                  onClick={() => handleSelectUpiApp('BHIM UPI')}
                  style={{
                    background: '#007934',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '14px',
                    padding: '16px 12px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px',
                    fontWeight: '800',
                    fontSize: '13px',
                    boxShadow: '0 4px 12px rgba(0, 121, 52, 0.3)'
                  }}
                >
                  <div style={{ background: '#FFFFFF', color: '#007934', padding: '4px 12px', borderRadius: '8px', fontWeight: '900', fontSize: '13px' }}>
                    🟩 BHIM UPI
                  </div>
                  <span style={{ fontSize: '11px', opacity: 0.9 }}>Open BHIM App</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
