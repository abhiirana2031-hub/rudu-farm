import React, { useState } from 'react';
import { useFarm } from '../context/FarmContext';
import { FarmerDetailsModal } from '../components/FarmerDetailsModal';
import { ViewToggle } from '../components/ViewToggle';
import { Search, UserPlus, Phone, MapPin, Eye, Trash2, AlertTriangle, X, CreditCard } from 'lucide-react';

export const FarmersPage = () => {
  const { farmers, deleteFarmer, setActiveModal } = useFarm();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVillage, setSelectedVillage] = useState('All');
  const [farmerToDelete, setFarmerToDelete] = useState(null);
  const [selectedFarmerForDetails, setSelectedFarmerForDetails] = useState(null);
  const [viewMode, setViewMode] = useState((typeof window !== 'undefined' && window.innerWidth < 768) ? 'card' : 'table');

  const availableVillages = Array.from(new Set(farmers.map(f => f.village).filter(Boolean)));

  const filteredFarmers = farmers.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(searchTerm.toLowerCase()) || f.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesVillage = selectedVillage === 'All' || f.village === selectedVillage;
    return matchesSearch && matchesVillage;
  });

  const handleConfirmDelete = () => {
    if (farmerToDelete) {
      deleteFarmer(farmerToDelete.id);
      setFarmerToDelete(null);
    }
  };

  return (
    <div>
      <div className="section-title-bar">
        <div>
          <h2 className="section-title">Farmer Registry</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Manage registered dairy suppliers across all centers</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => setActiveModal('makePayment')} className="btn btn-secondary" style={{ background: '#EAF4EE', color: '#4E2A18', border: '1px solid #DCC5B3', fontWeight: '800' }}>
            <CreditCard size={16} /> Issue Payment
          </button>
          <button onClick={() => setActiveModal('addFarmer')} className="btn btn-primary">
            <UserPlus size={16} /> Register New Farmer
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '36px' }}
            placeholder="Search by Farmer Name or ID (e.g. Ramesh Yadav / RF1024)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          className="form-input"
          style={{ width: '180px' }}
          value={selectedVillage}
          onChange={(e) => setSelectedVillage(e.target.value)}
        >
          <option value="All">All Villages</option>
          {availableVillages.map(v => (
            <option key={v} value={v}>{v}</option>
          ))}
        </select>

        <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
      </div>

      {viewMode === 'card' ? (
        <div className="grid-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {filteredFarmers.map(f => (
            <div key={f.id} className="card-item" style={{ background: '#ffffff', border: '1px solid var(--border)', borderRadius: '16px', padding: '20px', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800' }}>{f.name}</h3>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>ID: {f.id}</span>
                </div>
                <span className="badge badge-success">{f.status}</span>
              </div>

              <div style={{ fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Phone size={14} color="var(--text-muted)" />
                  <span>{f.phone}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin size={14} color="var(--text-muted)" />
                  <span>{f.village} Village</span>
                </div>
              </div>

              <div style={{ background: '#F8FAF9', padding: '10px 12px', borderRadius: '10px', fontSize: '12px', display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ color: 'var(--text-muted)' }}>Total Supply</div>
                  <strong>{f.totalSupplied} L</strong>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: 'var(--text-muted)' }}>Pending Payout</div>
                  <strong style={{ color: '#B45309' }}>₹{f.pendingPayout.toLocaleString()}</strong>
                </div>
              </div>
            </div>

            {/* Actions Footer */}
            <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
              <button
                onClick={() => setSelectedFarmerForDetails(f)}
                className="btn btn-secondary btn-sm"
                style={{ flex: 1, justifyContent: 'center', background: '#EAF4EE', color: '#4E2A18', border: '1px solid #DCC5B3', fontWeight: '800' }}
              >
                <Eye size={14} /> See Details
              </button>
              <button
                onClick={() => setActiveModal('makePayment')}
                className="btn btn-primary btn-sm"
                style={{ background: '#4E2A18', color: '#FFFFFF', padding: '6px 12px', fontWeight: '800' }}
                title="Issue Payment Settlement"
              >
                <CreditCard size={14} /> Pay
              </button>
              <button
                onClick={() => setFarmerToDelete(f)}
                className="btn btn-secondary btn-sm"
                style={{ color: '#EF4444', borderColor: '#FCA5A5', background: '#FEF2F2', padding: '6px 10px', fontWeight: '700' }}
                title="Remove Farmer"
              >
                <Trash2 size={14} />
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
                <th>Farmer ID</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Village</th>
                <th>Total Supply (L)</th>
                <th>Pending Payout</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredFarmers.map(f => (
                <tr key={f.id}>
                  <td><strong>{f.id}</strong></td>
                  <td><strong>{f.name}</strong></td>
                  <td>{f.phone}</td>
                  <td>{f.village}</td>
                  <td>{f.totalSupplied} L</td>
                  <td style={{ color: '#B45309', fontWeight: '800' }}>₹{f.pendingPayout.toLocaleString()}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => setSelectedFarmerForDetails(f)} className="btn btn-secondary btn-sm" style={{ background: '#EAF4EE', color: '#4E2A18', border: '1px solid #DCC5B3' }}>
                        <Eye size={14} /> Details
                      </button>
                      <button onClick={() => setActiveModal('makePayment')} className="btn btn-primary btn-sm" style={{ padding: '6px 12px' }}>
                        <CreditCard size={14} /> Pay
                      </button>
                      <button onClick={() => setFarmerToDelete(f)} className="btn btn-secondary btn-sm" style={{ color: '#EF4444', borderColor: '#FCA5A5', background: '#FEF2F2' }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Farmer Details Admin Modal */}
      {selectedFarmerForDetails && (
        <FarmerDetailsModal
          farmer={selectedFarmerForDetails}
          onClose={() => setSelectedFarmerForDetails(null)}
        />
      )}

      {/* Remove Confirmation Modal */}
      {farmerToDelete && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '420px' }}>
            <div className="modal-header" style={{ background: '#DC2626', color: 'white' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <AlertTriangle size={20} />
                <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '800', color: 'white' }}>Remove Farmer Record</h3>
              </div>
              <button onClick={() => setFarmerToDelete(null)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body" style={{ padding: '20px' }}>
              <p style={{ fontSize: '14px', color: '#1E293B', margin: '0 0 12px 0', lineHeight: 1.5 }}>
                Are you sure you want to remove farmer <strong>{farmerToDelete.name} ({farmerToDelete.id})</strong> from the active dairy supplier registry?
              </p>

              <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', padding: '12px', borderRadius: '12px', fontSize: '12px', color: '#991B1B', marginBottom: '16px' }}>
                <strong>Farmer Summary:</strong><br />
                • Village: {farmerToDelete.village}<br />
                • Total Milk Supplied: {farmerToDelete.totalSupplied} L<br />
                • Pending Payout Balance: ₹{farmerToDelete.pendingPayout.toLocaleString()}
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => setFarmerToDelete(null)}
                  className="btn btn-secondary"
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
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
