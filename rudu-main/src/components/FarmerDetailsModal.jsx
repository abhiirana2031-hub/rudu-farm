import React, { useState } from 'react';
import { useFarm } from '../context/FarmContext';
import { X, Phone, MapPin, Calendar, CreditCard, Printer, Plus, Droplets, ArrowUpRight, CheckCircle2, Building } from 'lucide-react';

export const FarmerDetailsModal = ({ farmer, onClose }) => {
  const { entries, openSlip, setActiveModal, setSelectedFarmerId } = useFarm();
  const [activeTab, setActiveTab] = useState('supply'); // 'supply' | 'bank'

  if (!farmer) return null;

  // Filter entries for this farmer
  const farmerEntries = entries.filter(e => e.farmerId === farmer.id);

  const handleAddMilk = () => {
    setSelectedFarmerId(farmer.id);
    onClose();
    setActiveModal('milkEntry');
  };

  const handleProcessPayment = () => {
    setSelectedFarmerId(farmer.id);
    onClose();
    setActiveModal('makePayment');
  };

  const handlePrintStatement = () => {
    window.print();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '1060px', width: '96%' }}>
        {/* Header Banner */}
        <div className="modal-header" style={{ background: 'linear-gradient(135deg, #4E2A18 0%, #8C4E2D 100%)', padding: '24px 30px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '16px', background: 'rgba(255,255,255,0.15)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '24px' }}>
              👤
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <h3 style={{ margin: 0, fontSize: '22px', fontWeight: '800', color: 'white' }}>
                  {farmer.name}
                </h3>
                <span style={{ background: '#B28461', color: 'white', fontSize: '12px', fontWeight: '800', padding: '3px 10px', borderRadius: '12px' }}>
                  {farmer.status || 'Active'}
                </span>
              </div>
              <div style={{ fontSize: '13px', color: '#F5EBE1', display: 'flex', gap: '14px', alignItems: 'center', marginTop: '4px' }}>
                <span>ID: <strong>{farmer.id}</strong></span>
                <span>•</span>
                <span>📍 Village: {farmer.village}</span>
                <span>•</span>
                <span>📞 {farmer.phone}</span>
              </div>
            </div>
          </div>

          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
            <X size={26} />
          </button>
        </div>

        <div className="modal-body" style={{ padding: '30px' }}>
          {/* Top Performance Metric Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            <div style={{ background: '#F8FAF9', border: '1px solid #E2E8F0', padding: '16px', borderRadius: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>Total Milk Supply</div>
              <div style={{ fontSize: '22px', fontWeight: '800', color: '#4E2A18', marginTop: '2px' }}>{farmer.totalSupplied || 1291} L</div>
            </div>

            <div style={{ background: '#F8FAF9', border: '1px solid #E2E8F0', padding: '16px', borderRadius: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>Total Earned</div>
              <div style={{ fontSize: '22px', fontWeight: '800', color: '#0F172A', marginTop: '2px' }}>₹{(farmer.totalEarned || 72400).toLocaleString()}</div>
            </div>

            <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', padding: '16px', borderRadius: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '12px', color: '#B45309', fontWeight: '700', textTransform: 'uppercase' }}>Pending Payout</div>
              <div style={{ fontSize: '22px', fontWeight: '800', color: '#B45309', marginTop: '2px' }}>₹{(farmer.pendingPayout || 16085).toLocaleString()}</div>
            </div>

            <div style={{ background: '#EAF4EE', border: '1px solid #DCC5B3', padding: '16px', borderRadius: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '12px', color: '#4E2A18', fontWeight: '700', textTransform: 'uppercase' }}>Livestock Registered</div>
              <div style={{ fontSize: '15px', fontWeight: '800', color: '#4E2A18', marginTop: '4px' }}>
                 {farmer.cowsCount || 6} Cows |  {farmer.buffalosCount || 4} Buffalos
              </div>
            </div>
          </div>

          {/* Navigation Tab Switcher */}
          <div style={{ display: 'flex', gap: '12px', borderBottom: '1px solid #E2E8F0', paddingBottom: '14px', marginBottom: '24px' }}>
            <button
              onClick={() => setActiveTab('supply')}
              style={{
                background: activeTab === 'supply' ? '#4E2A18' : '#F1F5F9',
                color: activeTab === 'supply' ? '#FFFFFF' : '#475569',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
               Milk Collection History ({farmerEntries.length})
            </button>
            <button
              onClick={() => setActiveTab('bank')}
              style={{
                background: activeTab === 'bank' ? '#4E2A18' : '#F1F5F9',
                color: activeTab === 'bank' ? '#FFFFFF' : '#475569',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              🏦 Bank & Profile Details
            </button>
          </div>

          {/* Tab 1: Milk Supply Stream Table */}
          {activeTab === 'supply' && (
            <div className="card-table-container" style={{ maxHeight: '460px', overflowX: 'auto', overflowY: 'auto', WebkitOverflowScrolling: 'touch', marginBottom: '24px' }}>
              <table className="data-table" style={{ minWidth: '880px' }}>
                <thead>
                  <tr>
                    <th>Receipt No / Time</th>
                    <th>Shift</th>
                    <th>Quantity (L)</th>
                    <th>Fat % / SNF %</th>
                    <th>Rate / Liter</th>
                    <th>Total Payable</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {farmerEntries.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                        No milk collection entries recorded yet.
                      </td>
                    </tr>
                  ) : (
                    farmerEntries.map(e => (
                      <tr key={e.id}>
                        <td>
                          <strong>{e.id}</strong>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{e.date} • {e.timestamp}</div>
                        </td>
                        <td>
                          <span className={`badge ${e.shift === 'Morning' ? 'badge-info' : 'badge-warning'}`}>
                            {e.shift}
                          </span>
                        </td>
                        <td><strong>{e.quantity} L</strong></td>
                        <td>{e.fat}% / {e.snf}%</td>
                        <td>₹{e.rate.toFixed(2)}</td>
                        <td><strong style={{ color: '#4E2A18' }}>₹{e.totalAmount.toFixed(2)}</strong></td>
                        <td>
                          <button onClick={() => openSlip(e)} className="btn btn-secondary btn-sm" title="Print Slip">
                            <Printer size={12} /> Thermal Slip
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Tab 2: Bank & Profile Details Card */}
          {activeTab === 'bank' && (
            <div style={{ background: '#F8FAF9', border: '1px solid #E2E8F0', padding: '20px', borderRadius: '16px', marginBottom: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700' }}>Aadhaar Card Number (Govt KYC)</div>
                  <strong style={{ fontSize: '15px', color: '#4E2A18' }}> {farmer.aadhaarNumber || '9842 1048 5912'}</strong>
                </div>

                <div>
                  <div style={{ fontSize: '12px', color: '#0284C7', fontWeight: '700' }}>Farmer UPI ID (For Direct Payouts)</div>
                  <strong style={{ fontSize: '15px', color: '#0284C7' }}>⚡ {farmer.upiId || `${farmer.name.toLowerCase().replace(/\s+/g, '')}@upi`}</strong>
                </div>

                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700' }}>Bank Name & Account Number</div>
                  <strong style={{ fontSize: '15px', color: '#0F172A' }}>🏦 {farmer.bankName || 'State Bank of India'} ({farmer.accountNumber || farmer.accNumber || 'XXXX-4910'})</strong>
                </div>

                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700' }}>IFSC Code & Branch Name</div>
                  <strong style={{ fontSize: '15px', color: '#0F172A' }}>{farmer.ifsc || 'SBIN0001024'} • {farmer.branchName || 'Kheda Main Branch'}</strong>
                </div>

                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700' }}>Registered Phone</div>
                  <strong style={{ fontSize: '15px', color: '#0F172A' }}>📞 {farmer.phone}</strong>
                </div>

                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700' }}>Village / Center</div>
                  <strong style={{ fontSize: '15px', color: '#0F172A' }}>📍 {farmer.village} Village ({farmer.address || 'Local Dairy Supplier'})</strong>
                </div>

                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700' }}>Member Registration Date</div>
                  <strong style={{ fontSize: '15px', color: '#0F172A' }}>🗓️ {farmer.joinedDate || '15 Jan 2024'}</strong>
                </div>

                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700' }}>Account Status</div>
                  <span className="badge badge-success">Verified Supplier</span>
                </div>
              </div>
            </div>
          )}

          {/* Action Footer Bar */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
            <button onClick={handlePrintStatement} className="btn btn-secondary" style={{ padding: '10px 16px', fontWeight: '700' }}>
              <Printer size={16} /> Print Farmer Statement
            </button>
            <button onClick={handleAddMilk} className="btn btn-secondary" style={{ padding: '10px 16px', fontWeight: '700', background: '#EAF4EE', color: '#4E2A18', border: '1px solid #DCC5B3' }}>
              <Plus size={16} /> Add Milk Entry
            </button>
            <button onClick={handleProcessPayment} className="btn btn-primary" style={{ padding: '10px 20px', fontWeight: '700' }}>
              <CreditCard size={16} /> Process Payout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
