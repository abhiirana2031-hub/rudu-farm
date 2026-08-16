import React, { useState } from 'react';
import { useFarm } from '../context/FarmContext';
import { X, UserPlus, Save, Building } from 'lucide-react';

export const AddFarmerModal = () => {
  const { activeModal, setActiveModal, addFarmer, farmers, employees, currentRole } = useFarm();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [village, setVillage] = useState('Kheda');
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [upiId, setUpiId] = useState('');
  const [assignedOperator, setAssignedOperator] = useState(employees ? employees[0]?.name || '' : '');
  const [cowsCount, setCowsCount] = useState('4');
  const [buffalosCount, setBuffalosCount] = useState('2');
  const [bankName, setBankName] = useState('State Bank of India');
  const [accNumber, setAccNumber] = useState('');
  const [ifsc, setIfsc] = useState('');
  const [branchName, setBranchName] = useState('');

  // Extract unique existing villages for auto-suggest list
  const defaultVillages = ['Kheda', 'Rampur', 'Sundarpur', 'Shivpur', 'Anandpur'];
  const existingVillages = farmers ? farmers.map(f => f.village).filter(Boolean) : [];
  const villageSuggestions = Array.from(new Set([...defaultVillages, ...existingVillages]));

  // Auto-Suggestions for Bank Name, IFSC Code, and Branch Name
  const defaultBankNames = ['State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Bank of Baroda', 'Punjab National Bank', 'Union Bank of India', 'Canara Bank', 'Axis Bank'];
  const existingBankNames = farmers ? farmers.map(f => f.bankName).filter(Boolean) : [];
  const bankNameSuggestions = Array.from(new Set([...defaultBankNames, ...existingBankNames]));

  const defaultIfscCodes = ['SBIN0001024', 'SBIN0004829', 'HDFC0004321', 'ICIC0000123', 'PUNB0123400', 'BARB0KHEDA'];
  const existingIfscCodes = farmers ? farmers.map(f => f.ifsc).filter(Boolean) : [];
  const ifscSuggestions = Array.from(new Set([...defaultIfscCodes, ...existingIfscCodes]));

  const defaultBranchNames = ['Kheda Main Branch', 'Rampur Dairy Branch', 'Anand District Branch', 'Sundarpur Center Branch', 'Shivpur Town Branch'];
  const existingBranchNames = farmers ? farmers.map(f => f.branchName).filter(Boolean) : [];
  const branchSuggestions = Array.from(new Set([...defaultBranchNames, ...existingBranchNames]));

  if (activeModal !== 'addFarmer') return null;

  const handleAadhaarChange = (e) => {
    const rawVal = e.target.value.replace(/\D/g, '').slice(0, 12);
    const formatted = rawVal.match(/.{1,4}/g)?.join(' ') || rawVal;
    setAadhaarNumber(formatted);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) return;

    addFarmer({
      name,
      phone,
      village,
      aadhaarNumber: aadhaarNumber || '9842 1048 5912',
      assignedOperator,
      cowsCount,
      buffalosCount,
      bankName,
      accNumber,
      ifsc: ifsc || 'SBIN0001024',
      branchName: branchName || 'Kheda Main Branch',
      upiId: upiId || `${name.toLowerCase().replace(/\s+/g, '')}@upi`
    });

    setActiveModal(null);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '560px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <UserPlus size={18} />
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800' }}>Register New Farmer</h3>
          </div>
          <button
            onClick={() => setActiveModal(null)}
            style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body" style={{ padding: '24px' }}>
          <div className="form-group">
            <label style={{ fontWeight: '700', fontSize: '13px' }}>Full Name</label>
            <input
              type="text"
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Ramesh Yadav"
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group">
              <label style={{ fontWeight: '700', fontSize: '13px' }}>Phone Number</label>
              <input
                type="text"
                className="form-input"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
              />
            </div>

            <div className="form-group">
              <label style={{ fontWeight: '700', fontSize: '13px' }}>Village / Center</label>
              <input
                type="text"
                list="village-suggestions-list"
                className="form-input"
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                placeholder="e.g. Kheda"
                autoComplete="off"
                required
              />
              <datalist id="village-suggestions-list">
                {villageSuggestions.map(v => (
                  <option key={v} value={v} />
                ))}
              </datalist>
            </div>
          </div>

          {/* Admin Only: Assign Collection Operator */}
          {currentRole === 'admin' && (
            <div className="form-group" style={{ marginTop: '4px', background: '#F0F9FF', border: '1px solid #BAE6FD', padding: '12px', borderRadius: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontWeight: '700', fontSize: '13px', color: '#0369A1' }}>Assign Collection Operator</label>
                <span style={{ fontSize: '11px', background: '#0284C7', color: '#FFFFFF', fontWeight: '800', padding: '2px 8px', borderRadius: '10px' }}>
                   Admin Control
                </span>
              </div>
              <select
                className="form-input"
                value={assignedOperator}
                onChange={(e) => setAssignedOperator(e.target.value)}
                style={{ fontWeight: '700', color: '#0F172A', background: '#FFFFFF' }}
              >
                {employees && employees.map(emp => (
                  <option key={emp.id} value={emp.name}>
                    👤 {emp.name} ({emp.center || 'Kheda Center'}) — {emp.role || 'Milk Operator'}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Aadhaar Card KYC Section */}
          <div className="form-group" style={{ marginTop: '4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <label style={{ fontWeight: '700', fontSize: '13px' }}>Aadhaar Card Number (KYC Verification)</label>
              <span style={{ fontSize: '11px', color: '#4E2A18', fontWeight: '700' }}> 12-Digit Govt ID</span>
            </div>
            <input
              type="text"
              className="form-input"
              value={aadhaarNumber}
              onChange={handleAadhaarChange}
              placeholder="e.g. 9842 1048 5912"
              maxLength="14"
              style={{ letterSpacing: '1px', fontWeight: '700' }}
            />
          </div>

          {/* Farmer UPI ID Section */}
          <div className="form-group" style={{ marginTop: '4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <label style={{ fontWeight: '700', fontSize: '13px' }}>Farmer UPI ID (For Direct Payouts)</label>
              <span style={{ fontSize: '11px', color: '#0284C7', fontWeight: '800' }}>⚡ Instant UPI Transfer</span>
            </div>
            <input
              type="text"
              className="form-input"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              placeholder="e.g. ramesh.yadav@upi / 9876543210@paytm"
              style={{ fontWeight: '700' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group">
              <label style={{ fontWeight: '700', fontSize: '13px' }}>Cows Count</label>
              <input
                type="number"
                className="form-input"
                value={cowsCount}
                onChange={(e) => setCowsCount(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label style={{ fontWeight: '700', fontSize: '13px' }}>Buffalos Count</label>
              <input
                type="number"
                className="form-input"
                value={buffalosCount}
                onChange={(e) => setBuffalosCount(e.target.value)}
              />
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '14px 0' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
            <Building size={16} color="var(--primary)" />
            <h4 style={{ fontSize: '13px', fontWeight: '800', margin: 0, color: 'var(--primary)' }}>
              Bank Account & Branch Details (For Payouts)
            </h4>
          </div>

          {/* Typeable + Auto-Suggest Bank Details (Except Account Number) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group">
              <label style={{ fontWeight: '700', fontSize: '13px' }}>Bank Name</label>
              <input
                type="text"
                list="bank-name-suggestions-list"
                className="form-input"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                placeholder="e.g. State Bank of India"
                autoComplete="off"
              />
              <datalist id="bank-name-suggestions-list">
                {bankNameSuggestions.map(b => (
                  <option key={b} value={b} />
                ))}
              </datalist>
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <label style={{ fontWeight: '700', fontSize: '13px' }}>Account Number</label>
                <span style={{ fontSize: '11px', color: '#4E2A18', fontWeight: '700' }}>🔢 Digits Only</span>
              </div>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                className="form-input"
                value={accNumber}
                onChange={(e) => setAccNumber(e.target.value.replace(/\D/g, ''))}
                placeholder="e.g. 1234567890"
                maxLength={18}
                style={{ fontWeight: '700', letterSpacing: '0.5px' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginTop: '6px' }}>
            <div className="form-group">
              <label style={{ fontWeight: '700', fontSize: '13px' }}>IFSC Code</label>
              <input
                type="text"
                list="ifsc-suggestions-list"
                className="form-input"
                value={ifsc}
                onChange={(e) => setIfsc(e.target.value.toUpperCase())}
                placeholder="e.g. SBIN0001024"
                autoComplete="off"
                style={{ textTransform: 'uppercase', fontWeight: '700' }}
              />
              <datalist id="ifsc-suggestions-list">
                {ifscSuggestions.map(code => (
                  <option key={code} value={code} />
                ))}
              </datalist>
            </div>

            <div className="form-group">
              <label style={{ fontWeight: '700', fontSize: '13px' }}>Branch Name</label>
              <input
                type="text"
                list="branch-name-suggestions-list"
                className="form-input"
                value={branchName}
                onChange={(e) => setBranchName(e.target.value)}
                placeholder="e.g. Kheda Main Branch"
                autoComplete="off"
              />
              <datalist id="branch-name-suggestions-list">
                {branchSuggestions.map(br => (
                  <option key={br} value={br} />
                ))}
              </datalist>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '16px', padding: '12px' }}>
            <Save size={16} /> Register Farmer Record
          </button>
        </form>
      </div>
    </div>
  );
};
