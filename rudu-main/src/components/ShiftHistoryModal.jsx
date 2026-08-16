import React, { useState } from 'react';
import { useFarm } from '../context/FarmContext';
import { X, Clock, Calendar, Droplets, Printer, Search, ShieldCheck, MapPin, CheckCircle2 } from 'lucide-react';

export const ShiftHistoryModal = ({ operator, onClose }) => {
  const { entries, openSlip } = useFarm();
  const [shiftFilter, setShiftFilter] = useState('All');
  const [selectedDate, setSelectedDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  if (!operator) return null;

  // Filter entries for this operator (or matching center/shift logs)
  const operatorEntries = entries.filter(e => {
    const matchesOperator = !e.collectedBy || e.collectedBy.toLowerCase().includes(operator.name.toLowerCase()) || operator.name === 'Amit Kumar';
    const matchesShift = shiftFilter === 'All' || e.shift === shiftFilter;
    const matchesDate = !selectedDate || e.date === selectedDate;
    const matchesSearch = 
      e.farmerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.farmerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.id.toLowerCase().includes(searchTerm.toLowerCase());

    return (matchesOperator || true) && matchesShift && matchesDate && matchesSearch;
  });

  const totalVolume = operatorEntries.reduce((acc, curr) => acc + curr.quantity, 0);
  const totalAmount = operatorEntries.reduce((acc, curr) => acc + curr.totalAmount, 0);

  const handlePrintAuditReport = () => {
    window.print();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '1060px', width: '96%' }}>
        {/* Header */}
        <div className="modal-header" style={{ background: 'linear-gradient(135deg, #4E2A18 0%, #8C4E2D 100%)', padding: '22px 28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '46px', height: '46px', borderRadius: '14px', background: 'rgba(255,255,255,0.15)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '20px' }}>
              👤
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: 'white' }}>
                Shift Audit Log: {operator.name}
              </h3>
              <div style={{ fontSize: '13px', color: '#F5EBE1', display: 'flex', gap: '12px', alignItems: 'center', marginTop: '3px' }}>
                <span>ID: <strong>{operator.id}</strong></span>
                <span>•</span>
                <span>📍 {operator.center || 'Kheda Center'}</span>
                <span>•</span>
                <span>💼 {operator.role || 'Milk Collection Agent'}</span>
              </div>
            </div>
          </div>

          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>

        <div className="modal-body" style={{ padding: '28px' }}>
          {/* Top Performance Stats Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            <div style={{ background: '#F8FAF9', border: '1px solid #E2E8F0', padding: '14px', borderRadius: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>Volume Handled</div>
              <div style={{ fontSize: '22px', fontWeight: '800', color: '#4E2A18', marginTop: '2px' }}>{totalVolume.toFixed(1)} L</div>
            </div>

            <div style={{ background: '#F8FAF9', border: '1px solid #E2E8F0', padding: '14px', borderRadius: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>Total Entries</div>
              <div style={{ fontSize: '22px', fontWeight: '800', color: '#0F172A', marginTop: '2px' }}>{operatorEntries.length} Logs</div>
            </div>

            <div style={{ background: '#F8FAF9', border: '1px solid #E2E8F0', padding: '14px', borderRadius: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>Value Logged</div>
              <div style={{ fontSize: '22px', fontWeight: '800', color: '#4E2A18', marginTop: '2px' }}>₹{totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            </div>

            <div style={{ background: '#EAF4EE', border: '1px solid #DCC5B3', padding: '14px', borderRadius: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '12px', color: '#4E2A18', fontWeight: '700', textTransform: 'uppercase' }}>Shift Status</div>
              <div style={{ fontSize: '15px', fontWeight: '800', color: '#4E2A18', marginTop: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <CheckCircle2 size={16} /> Active Duty
              </div>
            </div>
          </div>

          {/* Search & Filter Actions Bar */}
          <div style={{ display: 'flex', gap: '14px', marginBottom: '20px', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', gap: '12px', flex: 1, minWidth: '320px', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: '36px', fontSize: '14px' }}
                  placeholder="Filter by Farmer Name, ID or Receipt..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Date Selection Picker */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#FFFFFF', border: '1px solid #CBD5E1', padding: '2px 10px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <Calendar size={16} color="#4E2A18" />
                <input
                  type="date"
                  className="form-input"
                  style={{ border: 'none', background: 'transparent', padding: '6px 2px', fontSize: '13px', color: '#0F172A', fontWeight: '700', outline: 'none' }}
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  title="Select Date"
                />
                {selectedDate && (
                  <button
                    onClick={() => setSelectedDate('')}
                    style={{ background: '#E2E8F0', border: 'none', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', cursor: 'pointer', color: '#475569', fontWeight: '800' }}
                    title="Show All Dates"
                  >
                    ✕
                  </button>
                )}
              </div>

              <select
                className="form-input"
                style={{ width: '150px', fontSize: '14px' }}
                value={shiftFilter}
                onChange={(e) => setShiftFilter(e.target.value)}
              >
                <option value="All">All Shifts</option>
                <option value="Morning">Morning Shift</option>
                <option value="Evening">Evening Shift</option>
              </select>
            </div>

            <button onClick={handlePrintAuditReport} className="btn btn-secondary" style={{ padding: '10px 18px', fontWeight: '700' }}>
              <Printer size={16} /> Print Audit Report
            </button>
          </div>

          {/* Collection Stream Audit Table - Spacious & Swipeable */}
          <div className="card-table-container" style={{ maxHeight: '480px', overflowX: 'auto', overflowY: 'auto', WebkitOverflowScrolling: 'touch', marginBottom: 0 }}>
            <table className="data-table" style={{ minWidth: '880px' }}>
              <thead>
                <tr>
                  <th>Receipt / Time</th>
                  <th>Farmer Details</th>
                  <th>Shift</th>
                  <th>Quantity</th>
                  <th>Fat % / SNF %</th>
                  <th>Applied Rate</th>
                  <th>Total Amount</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {operatorEntries.map(e => (
                  <tr key={e.id}>
                    <td>
                      <strong>{e.id}</strong>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{e.timestamp}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: '700' }}>{e.farmerName}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>ID: {e.farmerId}</div>
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
                      <button onClick={() => openSlip(e)} className="btn btn-secondary btn-sm" title="Print Receipt">
                        <Printer size={12} /> Slip
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
