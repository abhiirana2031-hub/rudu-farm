"use client";
import React, { useState } from 'react';
import { useFarm } from '@/context/FarmContext';
import {
  Building2, Plus, Edit2, Trash2, MapPin, Phone,
  CheckCircle2, XCircle, Save, X, Gauge
} from 'lucide-react';

const EMPTY_FORM = { name: '', location: '', capacity: '', contact: '', status: 'Active' };

export default function CollectionCentersPage() {
  const { collectionCenters, addCollectionCenter, updateCollectionCenter, deleteCollectionCenter } = useFarm();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState('');

  const openAdd = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (center: any) => {
    setForm({ name: center.name, location: center.location, capacity: center.capacity, contact: center.contact, status: center.status });
    setEditingId(center.id);
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateCollectionCenter(editingId, { ...form, capacity: parseInt(form.capacity) || 0 });
      setSaveSuccess('Center updated successfully!');
    } else {
      addCollectionCenter(form);
      setSaveSuccess('Center added successfully!');
    }
    setShowForm(false);
    setEditingId(null);
    setTimeout(() => setSaveSuccess(''), 3000);
  };

  const handleDelete = (id: any) => {
    deleteCollectionCenter(id);
    setConfirmDeleteId(null);
    setSaveSuccess('Center deleted.');
    setTimeout(() => setSaveSuccess(''), 2000);
  };

  const activeCount = collectionCenters.filter((c: any) => c.status === 'Active').length;
  const totalCapacity = collectionCenters.reduce((a: number, c: any) => a + (parseInt(c.capacity) || 0), 0);

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto', paddingBottom: '40px' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Building2 size={22} /> Collection Centres
          </h1>
          <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', margin: '4px 0 0' }}>
            Manage your dairy collection centre network
          </p>
        </div>
        <button
          onClick={openAdd}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            background: 'var(--primary)', color: 'white',
            border: 'none', borderRadius: '30px', padding: '10px 18px',
            fontWeight: '800', fontSize: '13px', cursor: 'pointer'
          }}
        >
          <Plus size={15} /> Add Centre
        </button>
      </div>

      {/* Success Banner */}
      {saveSuccess && (
        <div style={{ background: '#D1FAE5', color: '#065F46', padding: '12px 16px', borderRadius: '12px', fontWeight: '700', fontSize: '13px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle2 size={16} /> {saveSuccess}
        </div>
      )}

      {/* Summary Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px', marginBottom: '20px' }}>
        {[
          { label: 'Total Centres', value: collectionCenters.length, color: '#4E2A18' },
          { label: 'Active Centres', value: activeCount, color: '#22C55E' },
          { label: 'Total Capacity', value: `${totalCapacity.toLocaleString()} L/day`, color: '#2563EB' },
        ].map(s => (
          <div key={s.label} style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: '16px', padding: '16px', textAlign: 'center' }}>
            <div style={{ fontSize: '22px', fontWeight: '800', color: s.color }}>{s.value}</div>
            <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', fontWeight: '600', marginTop: '2px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Centres List */}
      {collectionCenters.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
          <Building2 size={40} style={{ opacity: 0.3, marginBottom: '12px' }} />
          <p style={{ fontWeight: '700' }}>No collection centres yet.</p>
          <p style={{ fontSize: '13px' }}>Click "Add Centre" to create your first one.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {collectionCenters.map((center: any) => (
            <div key={center.id} style={{
              background: 'var(--surface)', border: '1.5px solid var(--border)',
              borderRadius: '16px', padding: '18px 20px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              gap: '12px', flexWrap: 'wrap'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{
                  width: '48px', height: '48px', borderRadius: '14px',
                  background: center.status === 'Active' ? '#EAF4EE' : '#FEE2E2',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                }}>
                  <Building2 size={22} color={center.status === 'Active' ? '#22C55E' : '#EF4444'} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-main)' }}>{center.name}</span>
                    <span style={{
                      fontSize: '10px', fontWeight: '700', padding: '2px 8px', borderRadius: '20px',
                      background: center.status === 'Active' ? '#D1FAE5' : '#FEE2E2',
                      color: center.status === 'Active' ? '#065F46' : '#991B1B'
                    }}>{center.status}</span>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '3px', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {center.location && <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}><MapPin size={11} />{center.location}</span>}
                    {center.contact && <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}><Phone size={11} />{center.contact}</span>}
                    {center.capacity > 0 && <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}><Gauge size={11} />{Number(center.capacity).toLocaleString()} L/day</span>}
                  </div>
                  <div style={{ fontSize: '10.5px', color: 'var(--text-muted)', marginTop: '2px' }}>ID: {center.id}</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => openEdit(center)}
                  style={{ background: '#EAF4EE', border: 'none', borderRadius: '10px', padding: '8px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '700', fontSize: '12px', color: '#065F46' }}
                >
                  <Edit2 size={13} /> Edit
                </button>
                <button
                  onClick={() => setConfirmDeleteId(center.id)}
                  style={{ background: '#FEE2E2', border: 'none', borderRadius: '10px', padding: '8px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '700', fontSize: '12px', color: '#991B1B' }}
                >
                  <Trash2 size={13} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {showForm && (
        <div className="modal-overlay" style={{ zIndex: 1200 }}>
          <div className="modal-content" style={{ maxWidth: '460px' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Building2 size={18} />
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800' }}>
                  {editingId ? 'Edit Centre' : 'Add New Centre'}
                </h3>
              </div>
              <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="modal-body" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="auth-input-group">
                <label style={{ fontSize: '12px', fontWeight: '800' }}>Centre Name *</label>
                <input
                  type="text" required
                  value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  placeholder="e.g. Rudu North Center"
                  className="form-input"
                />
              </div>
              <div className="auth-input-group">
                <label style={{ fontSize: '12px', fontWeight: '800' }}>Location / Address</label>
                <input
                  type="text"
                  value={form.location}
                  onChange={e => setForm(p => ({ ...p, location: e.target.value }))}
                  placeholder="e.g. Village Road, Ward 4"
                  className="form-input"
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="auth-input-group">
                  <label style={{ fontSize: '12px', fontWeight: '800' }}>Daily Capacity (L)</label>
                  <input
                    type="number" min="0"
                    value={form.capacity}
                    onChange={e => setForm(p => ({ ...p, capacity: e.target.value }))}
                    placeholder="e.g. 5000"
                    className="form-input"
                  />
                </div>
                <div className="auth-input-group">
                  <label style={{ fontSize: '12px', fontWeight: '800' }}>Contact Number</label>
                  <input
                    type="tel"
                    value={form.contact}
                    onChange={e => setForm(p => ({ ...p, contact: e.target.value }))}
                    placeholder="+91 98765 43210"
                    className="form-input"
                  />
                </div>
              </div>
              <div className="auth-input-group">
                <label style={{ fontSize: '12px', fontWeight: '800' }}>Status</label>
                <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))} className="form-input">
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Under Maintenance">Under Maintenance</option>
                </select>
              </div>
              <button type="submit" className="auth-submit-btn" style={{ marginTop: '4px', justifyContent: 'center', borderRadius: '30px' }}>
                <Save size={15} />
                {editingId ? 'Update Centre' : 'Save Centre'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm Dialog */}
      {confirmDeleteId && (
        <div className="modal-overlay" style={{ zIndex: 1300 }}>
          <div className="modal-content" style={{ maxWidth: '380px' }}>
            <div className="modal-header" style={{ background: '#EF4444' }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800' }}>Delete Centre?</h3>
              <button onClick={() => setConfirmDeleteId(null)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body" style={{ padding: '24px', textAlign: 'center' }}>
              <XCircle size={36} color="#EF4444" style={{ marginBottom: '12px' }} />
              <p style={{ fontWeight: '700', fontSize: '14px', margin: '0 0 8px' }}>This will permanently remove the collection centre.</p>
              <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', margin: '0 0 20px' }}>Operators assigned to this centre won't be automatically reassigned.</p>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <button onClick={() => setConfirmDeleteId(null)} style={{ padding: '10px 20px', borderRadius: '30px', border: '1.5px solid var(--border)', background: 'transparent', fontWeight: '700', cursor: 'pointer' }}>Cancel</button>
                <button onClick={() => handleDelete(confirmDeleteId)} style={{ padding: '10px 20px', borderRadius: '30px', background: '#EF4444', color: 'white', border: 'none', fontWeight: '800', cursor: 'pointer' }}>Yes, Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
