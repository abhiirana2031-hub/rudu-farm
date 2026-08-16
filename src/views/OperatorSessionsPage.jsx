import React, { useState } from 'react';
import { useFarm } from '../context/FarmContext';
import { ViewToggle } from '../components/ViewToggle';
import { Search, Clock, LogOut, CheckCircle2, Sliders, X } from 'lucide-react';

export const OperatorSessionsPage = () => {
  const { sessions, forceLogoutOperator, updateSessionTimes, setActiveModal } = useFarm();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingSession, setEditingSession] = useState(null); // { id, currentStart, currentEnd }
  const [newStart, setNewStart] = useState('');
  const [newEnd, setNewEnd] = useState('');
  const [reason, setReason] = useState('');
  const [viewMode, setViewMode] = useState((typeof window !== 'undefined' && window.innerWidth < 768) ? 'card' : 'table');

  const filteredSessions = sessions.filter(s => 
    s.operatorName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.operatorId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleForceLogout = (sessionId) => {
    if (window.confirm('Are you sure you want to force logout this operator?')) {
      forceLogoutOperator(sessionId);
    }
  };

  const handleEditTime = (sessionId, currentStart, currentEnd) => {
    setEditingSession({ id: sessionId, currentStart, currentEnd });
    setNewStart(currentStart);
    setNewEnd(currentEnd);
    setReason('');
  };

  const submitTimeEdit = (e) => {
    e.preventDefault();
    if (editingSession && newStart && newEnd) {
      updateSessionTimes(editingSession.id, newStart, newEnd, reason || 'Time Adjusted by Admin');
      setEditingSession(null);
    }
  };

  return (
    <div>
      <div className="section-title-bar">
        <div>
          <h2 className="section-title">Operator Sessions</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Monitor active and past operator logins</p>
        </div>
        <button onClick={() => setActiveModal('settings')} className="btn btn-secondary">
          <Sliders size={16} /> Manage Shift Timings
        </button>
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '280px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '36px', width: '100%', boxSizing: 'border-box' }}
            placeholder="Search Operator..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
      </div>

      {viewMode === 'card' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {filteredSessions.map(s => (
            <div key={s.id} style={{ background: '#FFFFFF', border: '1px solid var(--border)', borderRadius: '16px', padding: '16px', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <div style={{ fontWeight: '800', fontSize: '15px' }}>{s.operatorName}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>ID: {s.operatorId}</div>
                </div>
                {s.status === 'Active' ? (
                  <span className="badge badge-success" style={{ background: '#DEF7EC', color: '#03543F' }}>🟢 Active</span>
                ) : (
                  <span className="badge" style={{ background: '#F1F5F9', color: '#475569' }}>⚪ {s.logoutReason || 'Completed'}</span>
                )}
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span className={`badge ${s.shift === 'Morning' ? 'badge-info' : 'badge-warning'}`}>{s.shift}</span>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{s.date}</div>
              </div>

              <div style={{ background: '#F8FAF9', padding: '10px', borderRadius: '8px', fontSize: '12px', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                  <Clock size={14} color="var(--text-muted)" />
                  <strong>{s.actualLogin || s.scheduledStart} - {s.actualLogout || s.scheduledEnd}</strong>
                </div>
                {s.extended && <div style={{ color: '#D97706', fontWeight: '700' }}>Extended: {s.extensionReason}</div>}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '16px' }}>
                <div>Entries: <strong>{s.entriesCount}</strong></div>
                <div>Volume: <strong>{s.volumeLogged} L</strong></div>
              </div>

              {s.status === 'Active' ? (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => handleEditTime(s.id, s.actualLogin || s.scheduledStart, s.scheduledEnd)} className="btn btn-secondary" style={{ flex: 1, padding: '8px', fontSize: '12px' }}>
                    Edit Time
                  </button>
                  <button onClick={() => handleForceLogout(s.id)} className="btn btn-danger" style={{ flex: 1, padding: '8px', fontSize: '12px' }}>
                    <LogOut size={14} /> Force
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--text-muted)' }}>
                  <CheckCircle2 size={14} /> Session Closed
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="card-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Operator</th>
              <th>Shift / Date</th>
              <th>Time Window</th>
              <th>Entries / Volume</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSessions.map(s => (
              <tr key={s.id}>
                <td>
                  <div style={{ fontWeight: '700' }}>{s.operatorName}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>ID: {s.operatorId}</div>
                </td>
                <td>
                  <span className={`badge ${s.shift === 'Morning' ? 'badge-info' : 'badge-warning'}`}>
                    {s.shift}
                  </span>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>{s.date}</div>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px' }}>
                    <Clock size={12} color="var(--text-muted)" />
                    {s.actualLogin || s.scheduledStart} - {s.actualLogout || s.scheduledEnd}
                  </div>
                  {s.extended && (
                    <div style={{ fontSize: '11px', color: '#D97706', marginTop: '2px', fontWeight: '700' }}>
                      Extended: {s.extensionReason}
                    </div>
                  )}
                </td>
                <td>
                  <div style={{ fontWeight: '700' }}>{s.entriesCount} entries</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{s.volumeLogged} L (₹{s.collectionValue})</div>
                </td>
                <td>
                  {s.status === 'Active' ? (
                    <span className="badge badge-success" style={{ background: '#DEF7EC', color: '#03543F' }}>
                      🟢 Active
                    </span>
                  ) : (
                    <span className="badge" style={{ background: '#F1F5F9', color: '#475569' }}>
                      ⚪ {s.logoutReason || 'Completed'}
                    </span>
                  )}
                </td>
                <td>
                  {s.status === 'Active' ? (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => handleEditTime(s.id, s.actualLogin || s.scheduledStart, s.scheduledEnd)} className="btn btn-secondary btn-sm" style={{ padding: '4px 8px', fontSize: '11px' }}>
                        Edit Time
                      </button>
                      <button onClick={() => handleForceLogout(s.id)} className="btn btn-danger btn-sm" style={{ padding: '4px 8px', fontSize: '11px' }}>
                        <LogOut size={12} /> Force
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--text-muted)' }}>
                      <CheckCircle2 size={12} /> Closed
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      )}

      {editingSession && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '400px' }}>
            <div className="modal-header">
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800' }}>Edit Session Times</h3>
              <button onClick={() => setEditingSession(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={submitTimeEdit} className="modal-body" style={{ padding: '20px' }}>
              <div className="auth-input-group" style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '13px', fontWeight: '800' }}>Adjust Login / Start Time</label>
                <input
                  type="time"
                  required
                  value={newStart}
                  onChange={e => setNewStart(e.target.value)}
                  style={{ width: '100%', height: '40px', borderRadius: '8px', border: '1px solid var(--border)', padding: '0 12px' }}
                />
              </div>
              <div className="auth-input-group" style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '13px', fontWeight: '800' }}>Adjust Shift End Time</label>
                <input
                  type="time"
                  required
                  value={newEnd}
                  onChange={e => setNewEnd(e.target.value)}
                  style={{ width: '100%', height: '40px', borderRadius: '8px', border: '1px solid var(--border)', padding: '0 12px' }}
                />
              </div>
              <div className="auth-input-group" style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '13px', fontWeight: '800' }}>Reason for Change (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Started early, or late collection truck"
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  style={{ width: '100%', height: '40px', borderRadius: '8px', border: '1px solid var(--border)', padding: '0 12px' }}
                />
              </div>
              <button type="submit" className="auth-submit-btn" style={{ width: '100%', justifyContent: 'center', padding: '10px', borderRadius: '30px' }}>
                Confirm Adjustments
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
