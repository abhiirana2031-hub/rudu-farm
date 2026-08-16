import React, { useState } from 'react';
import { useFarm } from '../context/FarmContext';
import { Sliders, Calculator, Save, RefreshCw } from 'lucide-react';

export const RateChartPage = () => {
  const { rateRules, updateRateRules, calculateRate } = useFarm();

  const [baseRate, setBaseRate] = useState(rateRules.baseRate);
  const [standardFat, setStandardFat] = useState(rateRules.standardFat);
  const [standardSNF, setStandardSNF] = useState(rateRules.standardSNF);
  const [fatBonusPerUnit, setFatBonusPerUnit] = useState(rateRules.fatBonusPerUnit);
  const [snfBonusPerUnit, setSnfBonusPerUnit] = useState(rateRules.snfBonusPerUnit);

  // Simulator test values
  const [testFat, setTestFat] = useState(4.2);
  const [testSNF, setTestSNF] = useState(8.6);
  const [testQty, setTestQty] = useState(40);

  const simulatedRate = calculateRate(testFat, testSNF);
  const simulatedTotal = (testQty * simulatedRate).toFixed(2);

  const handleSave = (e) => {
    e.preventDefault();
    updateRateRules({
      baseRate: parseFloat(baseRate),
      standardFat: parseFloat(standardFat),
      standardSNF: parseFloat(standardSNF),
      fatBonusPerUnit: parseFloat(fatBonusPerUnit),
      snfBonusPerUnit: parseFloat(snfBonusPerUnit)
    });
    alert('Milk Rate Rules Updated Successfully!');
  };

  return (
    <div>
      <div className="section-title-bar">
        <div>
          <h2 className="section-title">Rate Chart Configurator</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Set up standard fat/SNF pricing formulas for transparent payout calculation</p>
        </div>
      </div>

      <div className="grid-2col-responsive">
        {/* Form Configurator */}
        <form onSubmit={handleSave} style={{ background: '#ffffff', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sliders size={18} /> Pricing Formula Tokens
          </h3>

          <div className="form-group">
            <label>Base Price per Liter (₹)</label>
            <input
              type="number"
              step="0.5"
              className="form-input"
              value={baseRate}
              onChange={(e) => setBaseRate(e.target.value)}
              required
            />
          </div>

          <div className="grid-2col-responsive" style={{ gap: "12px" }}>
            <div className="form-group">
              <label>Standard Fat %</label>
              <input
                type="number"
                step="0.1"
                className="form-input"
                value={standardFat}
                onChange={(e) => setStandardFat(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Standard SNF %</label>
              <input
                type="number"
                step="0.1"
                className="form-input"
                value={standardSNF}
                onChange={(e) => setStandardSNF(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Fat Bonus / 0.1% Fat (₹)</label>
              <input
                type="number"
                step="0.1"
                className="form-input"
                value={fatBonusPerUnit}
                onChange={(e) => setFatBonusPerUnit(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>SNF Bonus / 0.1% SNF (₹)</label>
              <input
                type="number"
                step="0.1"
                className="form-input"
                value={snfBonusPerUnit}
                onChange={(e) => setSnfBonusPerUnit(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '12px' }}>
            <Save size={16} /> Save Pricing Rules
          </button>
        </form>

        {/* Live Simulator */}
        <div style={{ background: '#ffffff', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calculator size={18} /> Interactive Rate Simulator
          </h3>

          <div className="form-group">
            <label>Test Fat %: <strong>{testFat}%</strong></label>
            <input
              type="range"
              min="3.0"
              max="6.0"
              step="0.1"
              value={testFat}
              onChange={(e) => setTestFat(parseFloat(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>

          <div className="form-group">
            <label>Test SNF %: <strong>{testSNF}%</strong></label>
            <input
              type="range"
              min="7.5"
              max="9.5"
              step="0.1"
              value={testSNF}
              onChange={(e) => setTestSNF(parseFloat(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>

          <div className="form-group">
            <label>Test Quantity (L): <strong>{testQty} L</strong></label>
            <input
              type="range"
              min="5"
              max="100"
              step="5"
              value={testQty}
              onChange={(e) => setTestQty(parseInt(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ background: '#F5EBE1', border: '1px solid #DCC5B3', borderRadius: '16px', padding: '20px', marginTop: '20px' }}>
            <div style={{ fontSize: '12px', color: '#4E2A18', fontWeight: '700' }}>Formula Output</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '8px' }}>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Price per Liter</div>
                <div style={{ fontSize: '24px', fontWeight: '800', color: '#4E2A18' }}>₹{simulatedRate.toFixed(2)} / L</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Estimated Payout</div>
                <div style={{ fontSize: '26px', fontWeight: '800', color: '#B28461' }}>₹{simulatedTotal}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
