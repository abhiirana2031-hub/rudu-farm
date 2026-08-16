import React, { useState } from 'react';
import { useFarm } from '../context/FarmContext';
import { ChevronLeft, FileSpreadsheet, IndianRupee, Printer, Check } from 'lucide-react';

export const MilkEntryScreen = ({ onBack }) => {
  const { farmers, calculateRate, addMilkEntry, openSlip, rateRules } = useFarm();

  const [farmerId, setFarmerId] = useState(farmers[0]?.id || 'RF1024');
  const [quantity, setQuantity] = useState('42.5');
  const [fat, setFat] = useState('4.2');
  const [snf, setSnf] = useState('8.6');
  const [temperature, setTemperature] = useState('4.0');
  const [generateSlip, setGenerateSlip] = useState(true);

  const selectedFarmer = farmers.find(f => f.id === farmerId) || farmers[0];
  const rateVal = calculateRate(fat, snf);
  const totalVal = (parseFloat(quantity || 0) * rateVal).toFixed(2);

  const handleSave = () => {
    const newEntry = addMilkEntry({
      farmerId,
      farmerName: selectedFarmer?.name,
      shift: 'Morning',
      quantity,
      fat,
      snf,
      temperature
    });

    if (generateSlip && newEntry) {
      openSlip(newEntry);
    } else {
      alert(`Milk Entry Saved Successfully!\nQty: ${quantity} L\nAmount: ₹${totalVal}`);
    }
  };

  return (
    <div className="phone-screen-container">
      {/* Top Header */}
      <div className="screen-header-bar">
        <button onClick={onBack} className="screen-header-btn" title="Go Back">
          <ChevronLeft size={22} strokeWidth={2.5} />
        </button>
        <h2 className="screen-header-title">Milk Entry</h2>
        <button className="screen-header-btn" title="History">
          <FileSpreadsheet size={20} strokeWidth={2.5} />
        </button>
      </div>

      {/* Selected Farmer Card */}
      <div className="farmer-select-card">
        <div className="farmer-select-left">
          <div className="farmer-select-avatar">👤</div>
          <div>
            <div className="farmer-select-name">{selectedFarmer?.name}</div>
            <div className="farmer-select-id">Farmer ID: {selectedFarmer?.id}</div>
          </div>
        </div>

        <button className="farmer-select-change-btn">
          Change
        </button>
      </div>

      {/* Section Title */}
      <div className="home-section-heading">Milk Testing Details</div>

      {/* 2x2 Input Grid */}
      <div className="testing-inputs-grid">
        <div className="testing-input-box">
          <label>Weight / Quantity</label>
          <div className="testing-input-wrapper">
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="0.0"
            />
            <span className="testing-input-unit">Liters</span>
          </div>
        </div>

        <div className="testing-input-box">
          <label>Fat %</label>
          <div className="testing-input-wrapper">
            <input
              type="number"
              value={fat}
              onChange={(e) => setFat(e.target.value)}
              placeholder="0.0"
            />
            <span className="testing-input-unit">%</span>
          </div>
        </div>

        <div className="testing-input-box">
          <label>SNF %</label>
          <div className="testing-input-wrapper">
            <input
              type="number"
              value={snf}
              onChange={(e) => setSnf(e.target.value)}
              placeholder="0.0"
            />
            <span className="testing-input-unit">%</span>
          </div>
        </div>

        <div className="testing-input-box">
          <label>Temperature</label>
          <div className="testing-input-wrapper">
            <input
              type="number"
              value={temperature}
              onChange={(e) => setTemperature(e.target.value)}
              placeholder="0.0"
            />
            <span className="testing-input-unit">°C</span>
          </div>
        </div>
      </div>

      {/* Rate Calculation Green Box */}
      <div className="mint-rate-box">
        <div className="mint-rate-top">
          <div className="mint-rate-label-box">
            <div className="mint-rate-title">
              <IndianRupee size={12} strokeWidth={3} /> Rate Calculation
            </div>
            <div className="mint-rate-formula">
              Base: ₹{rateRules.baseRate.toFixed(2)}/L + Fat/SNF Bonus
            </div>
          </div>
          <div className="mint-rate-val">
            ₹{rateVal.toFixed(2)} / L
          </div>
        </div>

        <hr className="mint-rate-divider" />

        <div className="mint-summary-row">
          <span>Quantity</span>
          <strong>{quantity ? parseFloat(quantity).toFixed(1) : '0.0'} L</strong>
        </div>
        <div className="mint-summary-row">
          <span>Rate</span>
          <strong>₹{rateVal.toFixed(2)} / L</strong>
        </div>
        <div className="mint-summary-row total-row">
          <span>Total Amount</span>
          <strong>₹{parseFloat(totalVal).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
        </div>
      </div>

      {/* Checkbox */}
      <div className="custom-checkbox-row" onClick={() => setGenerateSlip(!generateSlip)}>
        <div className={`custom-checkbox-box ${generateSlip ? 'checked' : ''}`}>
          {generateSlip && <Check size={12} strokeWidth={3} />}
        </div>
        <span className="custom-checkbox-label">Generate Slip</span>
      </div>

      {/* Action Button at Bottom */}
      <div className="screen-action-btn-container">
        <button onClick={handleSave} className="details-action-btn-filled" style={{ width: '100%', padding: '14px', borderRadius: '14px', fontSize: '13px' }}>
          <Printer size={16} strokeWidth={2.5} /> Save & Print Slip
        </button>
      </div>
    </div>
  );
};
