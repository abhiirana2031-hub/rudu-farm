import React, { useState } from 'react';
import { useFarm } from '../context/FarmContext';
import { ShiftHistoryModal } from '../components/ShiftHistoryModal';
import { ViewToggle } from '../components/ViewToggle';
import { Search, UserCheck, Phone, MapPin, Plus, ShieldCheck, Clock, Award, Droplets, LayoutGrid, Table, CheckCircle2, History, Trash2, AlertTriangle, X, Briefcase } from 'lucide-react';

export const OperatorsPage = () => {
  const { employees, deleteEmployee, setActiveModal, entries, collectionCenters } = useFarm();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCenter, setSelectedCenter] = useState('All');
  const [viewMode, setViewMode] = useState((typeof window !== 'undefined' && window.innerWidth < 768) ? 'card' : 'table');
  const [selectedOperatorForShift, setSelectedOperatorForShift] = useState(null);
  const [operatorToDelete, setOperatorToDelete] = useState(null);

  const employeeList = employees || [];
  const filteredEmployees = employeeList.filter(emp => {
    if (!emp) return false;
    const searchStr = searchTerm.toLowerCase();
    const matchesSearch =
      (emp.name || '').toLowerCase().includes(searchStr) ||
      (emp.id || '').toLowerCase().includes(searchStr) ||
      (emp.role && emp.role.toLowerCase().includes(searchStr)) ||
      (emp.phone && emp.phone.includes(searchTerm));
    const matchesCenter = selectedCenter === 'All' || emp.center === selectedCenter;
    return matchesSearch && matchesCenter;
  });

  // Calculate live stats
  const totalVolumeLogged = entries.reduce((acc, curr) => acc + curr.quantity, 0);

  const handleConfirmDeleteOperator = () => {
    if (operatorToDelete) {
      deleteEmployee(operatorToDelete.id);
      setOperatorToDelete(null);
    }
  };

  return (
    <div>
      {/* Header Banner */}
      <div className="section-title-bar">
        <div>
          <h2 className="section-title">Operator Details & Directory</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Manage collection center staff, shift schedules, and operational performance</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => setActiveModal('makeOperatorPayment')} className="btn btn-secondary" style={{ background: '#F0F9FF', color: '#0284C7', border: '1px solid #BAE6FD', fontWeight: '800' }}>
            <Briefcase size={16} /> Pay Staff Salary
          </button>
          <button onClick={() => setActiveModal('addOperator')} className="btn btn-primary">
            <Plus size={16} /> Add New Operator
          </button>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div style={{ background: '#FFFFFF', border: '1px solid var(--border)', padding: '18px', borderRadius: '16px', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Operators</span>
            <div style={{ background: '#EAF4EE', color: '#4E2A18', padding: '8px', borderRadius: '10px' }}>
              <UserCheck size={18} />
            </div>
          </div>
          <div style={{ fontSize: '26px', fontWeight: '800', margin: '8px 0 2px', color: '#0F172A' }}>
            {employees.length} Staff
          </div>
          <div style={{ fontSize: '12px', color: '#4E2A18', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <CheckCircle2 size={13} /> 100% Active Duty
          </div>
        </div>

        <div style={{ background: '#FFFFFF', border: '1px solid var(--border)', padding: '18px', borderRadius: '16px', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Collection Centers</span>
            <div style={{ background: '#EAF4EE', color: '#4E2A18', padding: '8px', borderRadius: '10px' }}>
              <MapPin size={18} />
            </div>
          </div>
          <div style={{ fontSize: '26px', fontWeight: '800', margin: '8px 0 2px', color: '#0F172A' }}>
            {collectionCenters.length} {collectionCenters.length === 1 ? 'Center' : 'Centers'}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600' }}>
            {collectionCenters.length === 0
              ? 'No centres added yet'
              : collectionCenters.map(c => c.name).join(', ')}
          </div>
        </div>

        <div style={{ background: '#FFFFFF', border: '1px solid var(--border)', padding: '18px', borderRadius: '16px', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Volume Handled Today</span>
            <div style={{ background: '#E0F2FE', color: '#0284C7', padding: '8px', borderRadius: '10px' }}>
              <Droplets size={18} />
            </div>
          </div>
          <div style={{ fontSize: '26px', fontWeight: '800', margin: '8px 0 2px', color: '#4E2A18' }}>
            {totalVolumeLogged.toFixed(1)} L
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600' }}>
            Across all active shifts
          </div>
        </div>

        <div style={{ background: '#FFFFFF', border: '1px solid var(--border)', padding: '18px', borderRadius: '16px', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Shift Coverage</span>
            <div style={{ background: '#FEF3C7', color: '#D97706', padding: '8px', borderRadius: '10px' }}>
              <Clock size={18} />
            </div>
          </div>
          <div style={{ fontSize: '20px', fontWeight: '800', margin: '8px 0 2px', color: '#0F172A' }}>
            Morning & Evening
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600' }}>
            Full 2-Shift Operations
          </div>
        </div>
      </div>

      {/* Filter & View Switcher Bar */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: '10px', flex: 1, minWidth: '280px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '36px' }}
              placeholder="Search by Operator Name, ID, Role or Phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="form-input"
            style={{ width: '160px' }}
            value={selectedCenter}
            onChange={(e) => setSelectedCenter(e.target.value)}
          >
            <option value="All">All Centers</option>
            {collectionCenters.map(c => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* View Switcher Buttons */}
        <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
      </div>

      {/* Cards View */}
      {viewMode === 'card' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {filteredEmployees.map(emp => (
            <div
              key={emp.id}
              style={{
                background: '#FFFFFF',
                border: '1px solid var(--border)',
                borderRadius: '18px',
                padding: '22px',
                boxShadow: '0 2px 10px rgba(15, 23, 42, 0.04)',
                display: 'flex',
                flexDirection: 'column',
                justify: 'space-between'
              }}
            >
              <div>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#EAF4EE', color: '#4E2A18', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800' }}>
                      👤
                    </div>
                    <div>
                      <h3 style={{ fontSize: '17px', fontWeight: '800', margin: 0, color: '#0F172A' }}>{emp.name}</h3>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>ID: <strong>{emp.id}</strong></div>
                    </div>
                  </div>
                  <span className="badge badge-success">{emp.status || 'Active'}</span>
                </div>

                {/* Details List */}
                <div style={{ background: '#F8FAF9', padding: '14px', borderRadius: '12px', fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ShieldCheck size={14} color="#4E2A18" />
                    <span>Role: <strong>{emp.role || 'Milk Collection Agent'}</strong></span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MapPin size={14} color="#4E2A18" />
                    <span>Center: <strong>{emp.center || 'Kheda Center'}</strong></span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Phone size={14} color="#4E2A18" />
                    <span>Phone: <strong>{emp.phone || '+91 98765 43210'}</strong></span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '13px' }}></span>
                    <span>Aadhaar KYC: <strong>{emp.aadhaarNumber || '9842 1048 5912'}</strong></span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Clock size={14} color="#4E2A18" />
                    <span>Shift: <strong>{emp.shift || 'Morning & Evening'}</strong></span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                <button
                  onClick={() => setSelectedOperatorForShift(emp)}
                  className="btn btn-secondary btn-sm"
                  style={{ flex: 1, justifyContent: 'center', background: '#EAF4EE', color: '#4E2A18', border: '1px solid #DCC5B3', fontWeight: '800' }}
                >
                  <History size={14} /> View Shift History
                </button>
                <button
                  onClick={() => setActiveModal('makeOperatorPayment')}
                  className="btn btn-primary btn-sm"
                  style={{ background: '#0284C7', padding: '6px 10px', fontWeight: '800' }}
                  title="Disburse Operator Salary"
                >
                  <Briefcase size={13} /> Pay
                </button>
                <button
                  onClick={() => alert(`Calling ${emp.name}`)}
                  className="btn btn-primary btn-sm"
                  style={{ background: '#4E2A18', padding: '6px 10px' }}
                  title="Call Operator"
                >
                  <Phone size={13} />
                </button>
                <button
                  onClick={() => setOperatorToDelete(emp)}
                  className="btn btn-secondary btn-sm"
                  style={{ color: '#EF4444', borderColor: '#FCA5A5', background: '#FEF2F2', padding: '6px 10px', fontWeight: '700' }}
                  title="Remove Operator"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="card-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Operator Name & ID</th>
                <th>Designation / Role</th>
                <th>Assigned Center</th>
                <th>Shift Schedule</th>
                <th>Contact Info</th>
                <th>Today's Volume</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map(emp => (
                <tr key={emp.id}>
                  <td>
                    <div style={{ fontWeight: '800', color: '#0F172A' }}>{emp.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>ID: {emp.id}</div>
                  </td>
                  <td><span style={{ fontWeight: '700', color: '#4E2A18' }}>{emp.role || 'Milk Collection Agent'}</span></td>
                  <td><span style={{ background: '#EAF4EE', color: '#4E2A18', padding: '3px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: '700' }}>📍 {emp.center || 'Kheda Center'}</span></td>
                  <td>{emp.shift || 'Morning & Evening'}</td>
                  <td>{emp.phone || '+91 98765 43210'}</td>
                  <td><strong style={{ color: '#4E2A18' }}>{emp.todayVolumeLogged || 145} L</strong></td>
                  <td><span className="badge badge-success">{emp.status || 'Active'}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        onClick={() => setSelectedOperatorForShift(emp)}
                        className="btn btn-secondary btn-sm"
                        style={{ fontSize: '11px', fontWeight: '700', background: '#EAF4EE', color: '#4E2A18', border: '1px solid #DCC5B3' }}
                      >
                        <History size={12} /> Shift Log
                      </button>
                      <button
                        onClick={() => setOperatorToDelete(emp)}
                        className="btn btn-secondary btn-sm"
                        style={{ color: '#EF4444', borderColor: '#FCA5A5', background: '#FEF2F2', padding: '4px 8px', fontWeight: '700', fontSize: '11px' }}
                        title="Remove Operator"
                      >
                        <Trash2 size={12} /> Remove
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Shift Audit Log Modal */}
      {selectedOperatorForShift && (
        <ShiftHistoryModal
          operator={selectedOperatorForShift}
          onClose={() => setSelectedOperatorForShift(null)}
        />
      )}

      {/* Remove Operator Confirmation Modal */}
      {operatorToDelete && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '420px' }}>
            <div className="modal-header" style={{ background: '#DC2626', color: 'white' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <AlertTriangle size={20} />
                <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '800', color: 'white' }}>Remove Operator Record</h3>
              </div>
              <button onClick={() => setOperatorToDelete(null)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body" style={{ padding: '20px' }}>
              <p style={{ fontSize: '14px', color: '#1E293B', margin: '0 0 12px 0', lineHeight: 1.5 }}>
                Are you sure you want to remove operator <strong>{operatorToDelete.name} ({operatorToDelete.id})</strong> from collection staff records?
              </p>

              <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', padding: '12px', borderRadius: '12px', fontSize: '12px', color: '#991B1B', marginBottom: '16px' }}>
                <strong>Operator Details:</strong><br />
                • Role: {operatorToDelete.role || 'Milk Collection Agent'}<br />
                • Assigned Center: {operatorToDelete.center || 'Kheda Center'}<br />
                • Monthly Salary: {operatorToDelete.salary || '₹18,000 / mo'}
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => setOperatorToDelete(null)}
                  className="btn btn-secondary"
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDeleteOperator}
                  className="btn"
                  style={{ flex: 1, justifyContent: 'center', background: '#DC2626', color: '#FFFFFF', fontWeight: '800' }}
                >
                  <Trash2 size={16} /> Yes, Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
