import React, { useState } from 'react';
import { useFarm } from '../context/FarmContext';
import { ViewToggle } from '../components/ViewToggle';
import { Search, Printer, Calendar, Plus } from 'lucide-react';

export const CollectionLogPage = () => {
  const { entries, farmers, openSlip, setActiveModal, currentRole } = useFarm();
  const [searchTerm, setSearchTerm] = useState('');
  const [shiftFilter, setShiftFilter] = useState('All');
  const [selectedDate, setSelectedDate] = useState('');
  const [viewMode, setViewMode] = useState((typeof window !== 'undefined' && window.innerWidth < 768) ? 'card' : 'table');

  const getFarmerVillage = (farmerId) => {
    const farmer = farmers.find(f => f.id === farmerId);
    return farmer?.village || 'Kheda';
  };

  const filteredEntries = entries.filter(e => {
    const village = getFarmerVillage(e.farmerId);
    const matchesSearch =
      e.farmerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.farmerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      village.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesShift = shiftFilter === 'All' || e.shift === shiftFilter;
    const matchesDate = !selectedDate || e.date === selectedDate;
    return matchesSearch && matchesShift && matchesDate;
  });

  return (
    <div>
      <div className="section-title-bar">
        <div>
          <h2 className="section-title">Master Milk Collection Log</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Complete ledger of all milk entries collected at Rudu Farm</p>
        </div>
        {currentRole !== 'farmer' && (
          <button onClick={() => setActiveModal('milkEntry')} className="btn btn-primary" style={{ flexShrink: 0 }}>
            <Plus size={16} /> New Entry
          </button>
        )}
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap', width: '100%', maxWidth: '100%' }}>
        <div style={{ flex: '1 1 240px', minWidth: '200px', position: 'relative', maxWidth: '100%' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '36px', width: '100%', boxSizing: 'border-box' }}
            placeholder="Search Receipt, Farmer, Village..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Date Selection Picker */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#FFFFFF', border: '1px solid #CBD5E1', padding: '2px 10px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', flex: '1 1 auto', minWidth: '150px', maxWidth: '100%', boxSizing: 'border-box', overflow: 'hidden' }}>
          <Calendar size={16} color="#4E2A18" style={{ flexShrink: 0 }} />
          <input
            type="date"
            className="form-input"
            style={{ border: 'none', background: 'transparent', padding: '6px 2px', fontSize: '13px', color: '#0F172A', fontWeight: '700', outline: 'none', flex: 1, minWidth: 0 }}
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            title="Select Date"
          />
          {selectedDate && (
            <button
              onClick={() => setSelectedDate('')}
              style={{ background: '#E2E8F0', border: 'none', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', cursor: 'pointer', color: '#475569', fontWeight: '800', flexShrink: 0 }}
              title="Show All Dates"
            >
              ✕
            </button>
          )}
        </div>

        <select
          className="form-input"
          style={{ width: 'auto', minWidth: '140px', flex: '1 1 auto', maxWidth: '100%', boxSizing: 'border-box' }}
          value={shiftFilter}
          onChange={(e) => setShiftFilter(e.target.value)}
        >
          <option value="All">All Shifts</option>
          <option value="Morning">Morning Shift</option>
          <option value="Evening">Evening Shift</option>
        </select>

        <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
      </div>

      {viewMode === 'card' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
          {filteredEntries.map(e => (
            <div key={e.id} style={{ background: '#FFFFFF', border: '1px solid var(--border)', borderRadius: '16px', padding: '16px', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Receipt: <strong>{e.id}</strong></div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{e.date} {e.timestamp}</div>
                </div>
                <span className={`badge ${e.shift === 'Morning' ? 'badge-info' : 'badge-warning'}`}>{e.shift}</span>
              </div>
              
              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontWeight: '800', fontSize: '15px' }}>{e.farmerName}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>ID: {e.farmerId} • 📍 {getFarmerVillage(e.farmerId)}</div>
              </div>

              <div style={{ background: '#F8FAF9', padding: '12px', borderRadius: '8px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Quantity</div>
                  <div style={{ fontWeight: '800', fontSize: '14px' }}>{e.quantity} L</div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Fat / SNF</div>
                  <div style={{ fontWeight: '800', fontSize: '14px' }}>{e.fat}% / {e.snf}%</div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Applied Rate</div>
                  <div style={{ fontWeight: '700', fontSize: '13px' }}>₹{e.rate.toFixed(2)}/L</div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Total Amount</div>
                  <div style={{ fontWeight: '800', fontSize: '15px', color: '#4E2A18' }}>₹{e.totalAmount.toFixed(2)}</div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className={`badge ${e.status === 'Cleared' ? 'badge-success' : 'badge-warning'}`}>{e.status}</span>
                <button onClick={() => openSlip(e)} className="btn btn-secondary btn-sm" style={{ padding: '6px 12px' }}>
                  <Printer size={12} /> Print Slip
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Receipt / Time</th>
              <th>Farmer Details</th>
              <th>Shift</th>
              <th>Quantity (L)</th>
              <th>Fat % / SNF %</th>
              <th>Temp (°C)</th>
              <th>Applied Rate</th>
              <th>Total Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEntries.map(e => (
              <tr key={e.id}>
                <td>
                  <strong>{e.id}</strong>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{e.date} {e.timestamp}</div>
                </td>
                <td>
                  <div style={{ fontWeight: '700' }}>{e.farmerName}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                    <span>ID: {e.farmerId}</span>
                    <span>•</span>
                    <span style={{ color: '#4E2A18', fontWeight: '700', background: '#EAF4EE', padding: '1px 6px', borderRadius: '4px' }}>
                      📍 {getFarmerVillage(e.farmerId)}
                    </span>
                  </div>
                </td>
                <td>
                  <span className={`badge ${e.shift === 'Morning' ? 'badge-info' : 'badge-warning'}`}>
                    {e.shift}
                  </span>
                </td>
                <td><strong>{e.quantity} L</strong></td>
                <td>{e.fat}% Fat / {e.snf}% SNF</td>
                <td>{e.temperature || 4.0} °C</td>
                <td>₹{e.rate.toFixed(2)}</td>
                <td><strong style={{ color: '#4E2A18' }}>₹{e.totalAmount.toFixed(2)}</strong></td>
                <td>
                  <span className={`badge ${e.status === 'Cleared' ? 'badge-success' : 'badge-warning'}`}>
                    {e.status}
                  </span>
                </td>
                <td>
                  <button onClick={() => openSlip(e)} className="btn btn-secondary btn-sm">
                    <Printer size={12} /> Thermal Slip
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      )}
    </div>
  );
};
