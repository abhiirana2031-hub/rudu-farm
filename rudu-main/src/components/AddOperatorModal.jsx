import React, { useState } from 'react';
import { useFarm } from '../context/FarmContext';
import { X, UserCheck, Save, ShieldCheck, MapPin, Phone, Briefcase } from 'lucide-react';

export const AddOperatorModal = () => {
  const { activeModal, setActiveModal, addEmployee } = useFarm();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [center, setCenter] = useState('Kheda Center');
  const [role, setRole] = useState('Milk Collection Agent');
  const [shift, setShift] = useState('Morning & Evening');
  const [salary, setSalary] = useState('18000');
  const [aadhaarNumber, setAadhaarNumber] = useState('');

  if (activeModal !== 'addOperator') return null;

  const handleAadhaarChange = (e) => {
    const rawVal = e.target.value.replace(/\D/g, '').slice(0, 12);
    const formatted = rawVal.match(/.{1,4}/g)?.join(' ') || rawVal;
    setAadhaarNumber(formatted);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) return;

    addEmployee({
      name,
      phone,
      center,
      role,
      shift,
      aadhaarNumber: aadhaarNumber || '9842 1048 5912',
      salary: salary ? `₹${parseInt(salary).toLocaleString()} / mo` : '₹18,000 / mo'
    });

    // Reset & Close
    setName('');
    setPhone('');
    setAadhaarNumber('');
    setActiveModal(null);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header" style={{ background: 'linear-gradient(135deg, #4E2A18 0%, #8C4E2D 100%)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <UserCheck size={20} color="#F5EBE1" />
            <div>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: 'white' }}>Add New Dairy Operator</h3>
              <p style={{ margin: 0, fontSize: '11px', color: '#F5EBE1' }}>Register collection staff & assign center permissions</p>
            </div>
          </div>
          <button
            onClick={() => setActiveModal(null)}
            style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-group">
            <label>Operator Full Name</label>
            <input
              type="text"
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Suresh Kumar"
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="text"
                className="form-input"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
              />
            </div>

            <div className="form-group">
              <label>Assigned Center</label>
              <select
                className="form-input"
                value={center}
                onChange={(e) => setCenter(e.target.value)}
              >
                <option value="Kheda Center">Kheda Center</option>
                <option value="Rampur Center">Rampur Center</option>
                <option value="Sundarpur Center">Sundarpur Center</option>
              </select>
            </div>

            <div className="form-group">
              <label>Role / Designation</label>
              <select
                className="form-input"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="Milk Collection Agent">Milk Collection Agent</option>
                <option value="Quality Inspector & Agent">Quality Inspector & Staff</option>
                <option value="Dairy Center Supervisor">Dairy Center Supervisor</option>
              </select>
            </div>

            <div className="form-group">
              <label>Work Shift</label>
              <select
                className="form-input"
                value={shift}
                onChange={(e) => setShift(e.target.value)}
              >
                <option value="Morning & Evening">Morning & Evening</option>
                <option value="Morning Shift Only">Morning Shift Only</option>
                <option value="Evening Shift Only">Evening Shift Only</option>
              </select>
            </div>
          </div>

          {/* Aadhaar Card Number KYC Field */}
          <div className="form-group">
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

          <div className="form-group">
            <label>Monthly Salary / Stipend (₹)</label>
            <input
              type="number"
              className="form-input"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              placeholder="18000"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', marginTop: '8px', padding: '12px', fontSize: '14px', fontWeight: '800' }}
          >
            <Save size={16} /> Register Operator & Issue Credentials
          </button>
        </form>
      </div>
    </div>
  );
};
