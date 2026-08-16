import { RuduLogo } from './RuduLogo';
import React, { useState } from 'react';
import { useFarm } from '../context/FarmContext';
import { X, Calculator, Printer, CheckCircle } from 'lucide-react';

export const QuickMilkEntryModal = () => {
  const {
    farmers,
    employees,
    currentRole,
    activeModal,
    setActiveModal,
    calculateRate,
    addMilkEntry,
    openSlip,
    rateRules
  } = useFarm();

  const farmerList = farmers || [];
  const empList = employees || [];
  const initialFarmer = farmerList[0];
  const [farmerId, setFarmerId] = useState(initialFarmer?.id || '');
  const [farmerQuery, setFarmerQuery] = useState(initialFarmer ? `${initialFarmer.name} (${initialFarmer.id})` : '');
  const [collectedBy, setCollectedBy] = useState(empList[0]?.name || '');
  const [shift, setShift] = useState('Morning');
  const [quantity, setQuantity] = useState('42.5');
  const [fat, setFat] = useState('4.2');
  const [snf, setSnf] = useState('8.6');
  const [temperature, setTemperature] = useState('4.0');
  const [generateSlipCheck, setGenerateSlipCheck] = useState(true);

  if (activeModal !== 'milkEntry') return null;

  const currentRate = calculateRate(fat, snf);
  const qtyVal = parseFloat(quantity) || 0;
  const totalAmount = (qtyVal * currentRate).toFixed(2);
  const selectedFarmer = farmerList.find(f => f?.id === farmerId) || farmerList[0] || {};

  const handleFarmerQueryChange = (queryVal) => {
    setFarmerQuery(queryVal);
    const matched = farmerList.find(f => 
      f && (
        `${f.name} (${f.id})`.toLowerCase().includes(queryVal.toLowerCase()) ||
        (f.name || '').toLowerCase().includes(queryVal.toLowerCase()) ||
        (f.id || '').toLowerCase().includes(queryVal.toLowerCase())
      )
    );
    if (matched) {
      setFarmerId(matched.id);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!farmerId || !quantity) return;

    const newEntry = addMilkEntry({
      farmerId,
      farmerName: selectedFarmer?.name,
      collectedBy,
      shift,
      quantity,
      fat,
      snf,
      temperature
    });

    setActiveModal(null);
    if (generateSlipCheck && newEntry) {
      openSlip(newEntry);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '20px' }}></span>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800' }}>New Milk Entry</h3>
          </div>
          <button
            onClick={() => setActiveModal(null)}
            style={{ background: 'none', border: 'none', color: 'white' }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          {/* Admin Only: Operator Selection */}
          {currentRole === 'admin' && (
            <div className="form-group" style={{ background: '#F0F9FF', border: '1px solid #BAE6FD', padding: '12px', borderRadius: '12px', marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontWeight: '700', fontSize: '13px', color: '#0369A1' }}>Collected By Operator</label>
                <span style={{ fontSize: '11px', background: '#0284C7', color: '#FFFFFF', fontWeight: '800', padding: '2px 8px', borderRadius: '10px' }}>
                   Admin Access Only
                </span>
              </div>
              <select
                className="form-input"
                value={collectedBy}
                onChange={(e) => setCollectedBy(e.target.value)}
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

          {/* Farmer Selection */}
          <div className="form-group">
            <label style={{ fontWeight: '700', fontSize: '13px' }}>Select Farmer</label>
            <input
              type="text"
              list="milk-entry-farmer-datalist"
              className="form-input"
              value={farmerQuery}
              onChange={(e) => handleFarmerQueryChange(e.target.value)}
              placeholder="Search by farmer name or ID (e.g. Ramesh Yadav / RF1024)..."
              style={{ fontWeight: '700', fontSize: '14px' }}
              autoComplete="off"
              required
            />
            <datalist id="milk-entry-farmer-datalist">
              {farmers.map(f => (
                <option key={f.id} value={`${f.name} (${f.id}) — ${f.village}`} />
              ))}
            </datalist>
          </div>

          {/* Shift Toggle */}
          <div className="form-group">
            <label>Collection Shift</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              {['Morning', 'Evening'].map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setShift(s)}
                  style={{
                    flex: 1,
                    padding: '8px',
                    borderRadius: '8px',
                    border: shift === s ? '2px solid #4E2A18' : '1px solid #E2E8F0',
                    background: shift === s ? '#F5EBE1' : '#FFFFFF',
                    fontWeight: '700',
                    color: shift === s ? '#4E2A18' : '#64748B'
                  }}
                >
                  {s === 'Morning' ? 'Morning' : 'Evening'}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity & Testing Inputs */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label>Weight / Quantity (L)</label>
              <input
                type="number"
                step="0.1"
                className="form-input"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="42.5"
                required
              />
            </div>

            <div className="form-group">
              <label>Fat %</label>
              <input
                type="number"
                step="0.1"
                className="form-input"
                value={fat}
                onChange={(e) => setFat(e.target.value)}
                placeholder="4.2"
                required
              />
            </div>

            <div className="form-group">
              <label>SNF %</label>
              <input
                type="number"
                step="0.1"
                className="form-input"
                value={snf}
                onChange={(e) => setSnf(e.target.value)}
                placeholder="8.6"
                required
              />
            </div>

            <div className="form-group">
              <label>Temperature (°C)</label>
              <input
                type="number"
                step="0.1"
                className="form-input"
                value={temperature}
                onChange={(e) => setTemperature(e.target.value)}
                placeholder="4.0"
              />
            </div>
          </div>

          {/* Dynamic Rate Calculation Box */}
          <div style={{ background: '#F5EBE1', border: '1px solid #DCC5B3', borderRadius: '12px', padding: '14px', margin: '14px 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: '700', color: '#4E2A18', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Calculator size={14} /> Rate Calculation Matrix
              </span>
              <span style={{ fontSize: '11px', color: '#64748B' }}>
                Base: ₹{rateRules.baseRate.toFixed(2)}/L
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <div>
                <div style={{ fontSize: '12px', color: '#64748B' }}>Calculated Rate / L:</div>
                <div style={{ fontSize: '20px', fontWeight: '800', color: '#4E2A18' }}>₹{currentRate.toFixed(2)} / L</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '12px', color: '#64748B' }}>Total Amount:</div>
                <div style={{ fontSize: '22px', fontWeight: '800', color: '#B28461' }}>₹{totalAmount}</div>
              </div>
            </div>
          </div>

          {/* Checkbox options */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <input
              type="checkbox"
              id="genSlip"
              checked={generateSlipCheck}
              onChange={(e) => setGenerateSlipCheck(e.target.checked)}
            />
            <label htmlFor="genSlip" style={{ fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
              Auto-generate & print receipt slip upon saving
            </label>
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px' }}>
            <Printer size={18} /> Save Entry & Print Slip
          </button>
        </form>
      </div>
    </div>
  );
};
