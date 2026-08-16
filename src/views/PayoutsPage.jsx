import React, { useState } from 'react';
import { useFarm } from '../context/FarmContext';
import { ViewToggle } from '../components/ViewToggle';
import { CreditCard, Briefcase, CheckCircle2, Clock, Plus, ArrowUpRight, Users, Layers, Calendar } from 'lucide-react';

export const PayoutsPage = () => {
  const { farmers, payouts, setActiveModal, currentRole } = useFarm();
  const [activeTab, setActiveTab] = useState('farmers'); // 'farmers' | 'operators' | 'all'
  const [selectedDate, setSelectedDate] = useState('');
  const [viewMode, setViewMode] = useState((typeof window !== 'undefined' && window.innerWidth < 768) ? 'card' : 'table');

  const isAdmin = currentRole === 'admin';

  const payoutList = payouts || [];
  const farmerList = farmers || [];

  // Filter payouts into Farmer vs Operator transactions
  const farmerPayouts = payoutList.filter(p => p && p.type !== 'Operator Salary' && (!p.id || !p.id.startsWith('OP-PAY')) && (!p.farmerName || !p.farmerName.startsWith('Staff:')));
  const operatorPayouts = payoutList.filter(p => p && (p.type === 'Operator Salary' || (p.id && p.id.startsWith('OP-PAY')) || (p.farmerName && p.farmerName.startsWith('Staff:'))));

  const totalFarmerCleared = farmerPayouts.reduce((acc, p) => acc + (p.amount || 0), 0);
  const totalOperatorDisbursed = operatorPayouts.reduce((acc, p) => acc + (p.amount || 0), 0);
  const totalPendingFarmer = farmerList.reduce((acc, f) => acc + (f?.pendingPayout || 0), 0);

  const basePayouts = activeTab === 'farmers'
    ? farmerPayouts
    : activeTab === 'operators'
    ? operatorPayouts
    : payouts;

  const displayedPayouts = basePayouts.filter(p => !selectedDate || p.date === selectedDate);

  return (
    <div>
      {/* Header Banner */}
      <div className="section-title-bar">
        <div>
          <h2 className="section-title">Financial Payouts & Settlement Ledger</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Track cleared payments, pending balances, and issue direct payouts to farmers & staff</p>
        </div>
        {isAdmin && (
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setActiveModal('makeOperatorPayment')}
              className="btn btn-secondary"
              style={{
                background: '#F0F9FF',
                color: '#0284C7',
                border: '1px solid #BAE6FD',
                padding: '11px 18px',
                fontWeight: '800',
                fontSize: '14px'
              }}
            >
              <Briefcase size={17} /> + Process Operator Payment
            </button>

            <button
              onClick={() => setActiveModal('makePayment')}
              className="btn btn-primary"
              style={{
                background: 'linear-gradient(135deg, #4E2A18 0%, #046C4E 100%)',
                boxShadow: '0 4px 14px rgba(6, 78, 59, 0.3)',
                padding: '11px 20px',
                fontWeight: '800',
                fontSize: '14px'
              }}
            >
              <CreditCard size={17} /> + Process Farmer Payment
            </button>
          </div>
        )}
      </div>

      {/* Metric Cards Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div style={{ background: '#FFFFFF', border: '1px solid var(--border)', padding: '18px', borderRadius: '16px', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Farmer Cleared Payouts</span>
            <div style={{ background: '#EAF4EE', color: '#4E2A18', padding: '8px', borderRadius: '10px' }}>
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div style={{ fontSize: '26px', fontWeight: '800', margin: '8px 0 2px', color: '#4E2A18' }}>
            ₹{totalFarmerCleared.toLocaleString()}
          </div>
          <div style={{ fontSize: '11px', color: '#4E2A18', fontWeight: '700' }}>
            {farmerPayouts.length} Settled Transactions
          </div>
        </div>

        <div style={{ background: '#FFFFFF', border: '1px solid var(--border)', padding: '18px', borderRadius: '16px', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Staff Salary Disbursed</span>
            <div style={{ background: '#F0F9FF', color: '#0284C7', padding: '8px', borderRadius: '10px' }}>
              <Briefcase size={18} />
            </div>
          </div>
          <div style={{ fontSize: '26px', fontWeight: '800', margin: '8px 0 2px', color: '#0284C7' }}>
            ₹{totalOperatorDisbursed.toLocaleString()}
          </div>
          <div style={{ fontSize: '11px', color: '#0284C7', fontWeight: '700' }}>
            {operatorPayouts.length} Staff Salary Transfers
          </div>
        </div>

        <div style={{ background: '#FFFFFF', border: '1px solid var(--border)', padding: '18px', borderRadius: '16px', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Pending Farmer Balance</span>
              <div style={{ background: '#FEF3C7', color: '#D97706', padding: '8px', borderRadius: '10px' }}>
                <Clock size={18} />
              </div>
            </div>
            <div style={{ fontSize: '26px', fontWeight: '800', margin: '8px 0 2px', color: '#B45309' }}>
              ₹{totalPendingFarmer.toLocaleString()}
            </div>
          </div>
          <div style={{ marginTop: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600' }}>Across active suppliers</span>
            {isAdmin && (
              <button
                onClick={() => setActiveModal('makePayment')}
                className="btn btn-secondary btn-sm"
                style={{ background: '#FEF3C7', color: '#B45309', border: '1px solid #FDE68A', fontWeight: '800', padding: '4px 10px', fontSize: '11px' }}
              >
                Pay Balance <ArrowUpRight size={12} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Payout History Table Container */}
      <div className="card-table-container">
        {/* Sub-Header & Tab Navigation */}
        <div style={{ padding: '18px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h3 style={{ fontSize: '17px', fontWeight: '800', margin: 0, color: '#0F172A' }}>Settlement History & Payroll Ledger</h3>
            <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>Real-time audit stream of farmer payouts and staff salary disbursements</p>
          </div>

          {/* Filter Controls: Date Selector + Tabs */}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
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

            {/* Interactive Separate Payment Tabs */}
            <div style={{ display: 'flex', background: '#F1F5F9', padding: '4px', borderRadius: '12px', gap: '4px' }}>
              <button
                onClick={() => setActiveTab('farmers')}
                style={{
                  padding: '7px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '12px',
                  fontWeight: '800',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: activeTab === 'farmers' ? '#FFFFFF' : 'transparent',
                  color: activeTab === 'farmers' ? '#4E2A18' : 'var(--text-muted)',
                  boxShadow: activeTab === 'farmers' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                }}
              >
                 Farmer Payouts ({farmerPayouts.length})
              </button>

              <button
                onClick={() => setActiveTab('operators')}
                style={{
                  padding: '7px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '12px',
                  fontWeight: '800',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: activeTab === 'operators' ? '#FFFFFF' : 'transparent',
                  color: activeTab === 'operators' ? '#0284C7' : 'var(--text-muted)',
                  boxShadow: activeTab === 'operators' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                }}
              >
                💼 Operator Payroll ({operatorPayouts.length})
              </button>

              <button
                onClick={() => setActiveTab('all')}
                style={{
                  padding: '7px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '12px',
                  fontWeight: '800',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: activeTab === 'all' ? '#FFFFFF' : 'transparent',
                  color: activeTab === 'all' ? '#0F172A' : 'var(--text-muted)',
                  boxShadow: activeTab === 'all' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                }}
              >
                📜 All Ledger ({payouts.length})
              </button>
            </div>
            
            <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
          </div>
        </div>

        {/* Content View */}
        {viewMode === 'card' ? (
          <div style={{ padding: '16px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
            {displayedPayouts.map(p => {
              const isOperatorPay = p.type === 'Operator Salary' || p.id.startsWith('OP-PAY') || p.farmerName.startsWith('Staff:');
              return (
                <div key={p.id} style={{ background: '#FFFFFF', border: '1px solid var(--border)', borderRadius: '16px', padding: '16px', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>TXN: <strong>{p.id}</strong></div>
                      {isOperatorPay && <span style={{ fontSize: '10px', background: '#E0F2FE', color: '#0369A1', fontWeight: '800', padding: '2px 6px', borderRadius: '4px', display: 'inline-block', marginTop: '4px' }}>Staff Payroll</span>}
                    </div>
                    <span className="badge badge-success">{p.status}</span>
                  </div>

                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ fontWeight: '800', fontSize: '15px', color: isOperatorPay ? '#0284C7' : '#0F172A' }}>{p.farmerName}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>ID: {p.farmerId}</div>
                  </div>

                  <div style={{ background: '#F8FAF9', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Settlement Date</span>
                      <strong style={{ fontSize: '12px' }}>{p.date}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Transfer Method</span>
                      <strong style={{ fontSize: '12px', color: isOperatorPay ? '#0369A1' : '#4E2A18' }}>{p.method}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Reference</span>
                      <strong style={{ fontSize: '11px', fontFamily: 'monospace' }}>{p.reference}</strong>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{isOperatorPay ? 'Salary Settled' : 'Amount Settled'}</div>
                      <div style={{ fontWeight: '800', fontSize: '18px', color: isOperatorPay ? '#0284C7' : '#4E2A18' }}>₹{p.amount.toLocaleString()}</div>
                    </div>
                    {isAdmin ? (
                      <button
                        onClick={() => setActiveModal(isOperatorPay ? 'makeOperatorPayment' : 'makePayment')}
                        className="btn btn-secondary btn-sm"
                        style={{
                          fontSize: '11px',
                          fontWeight: '700',
                          background: isOperatorPay ? '#F0F9FF' : '#EAF4EE',
                          color: isOperatorPay ? '#0284C7' : '#4E2A18',
                          border: isOperatorPay ? '1px solid #BAE6FD' : '1px solid #DCC5B3'
                        }}
                      >
                        {isOperatorPay ? 'Repeat Payroll' : 'Repeat Payout'}
                      </button>
                    ) : (
                      <span style={{ fontSize: '11px', color: '#4E2A18', fontWeight: '700' }}>✓ Verified</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <table className="data-table">
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>{activeTab === 'operators' ? 'Operator Staff & ID' : activeTab === 'farmers' ? 'Farmer Name & ID' : 'Recipient Name & ID'}</th>
              <th>Settlement Date</th>
              <th>Transfer Method</th>
              <th>Reference Code</th>
              <th>{activeTab === 'operators' ? 'Salary Settled' : 'Amount Settled'}</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {displayedPayouts.map(p => {
              const isOperatorPay = p.type === 'Operator Salary' || p.id.startsWith('OP-PAY') || p.farmerName.startsWith('Staff:');
              return (
                <tr key={p.id}>
                  <td>
                    <strong>{p.id}</strong>
                    {isOperatorPay && <span style={{ marginLeft: '6px', fontSize: '10px', background: '#E0F2FE', color: '#0369A1', fontWeight: '800', padding: '1px 6px', borderRadius: '4px' }}>Staff Payroll</span>}
                  </td>
                  <td>
                    <div style={{ fontWeight: '700', color: isOperatorPay ? '#0284C7' : '#0F172A' }}>
                      {p.farmerName}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>ID: {p.farmerId}</div>
                  </td>
                  <td>{p.date}</td>
                  <td>
                    <span style={{ fontWeight: '700', color: isOperatorPay ? '#0369A1' : '#4E2A18' }}>{p.method}</span>
                  </td>
                  <td style={{ fontFamily: 'monospace', fontSize: '12px', color: '#475569' }}>{p.reference}</td>
                  <td>
                    <strong style={{ color: isOperatorPay ? '#0284C7' : '#4E2A18', fontSize: '15px' }}>
                      ₹{p.amount.toLocaleString()}
                    </strong>
                  </td>
                  <td><span className="badge badge-success">{p.status}</span></td>
                  <td>
                    {isAdmin ? (
                      <button
                        onClick={() => setActiveModal(isOperatorPay ? 'makeOperatorPayment' : 'makePayment')}
                        className="btn btn-secondary btn-sm"
                        style={{
                          fontSize: '11px',
                          fontWeight: '700',
                          background: isOperatorPay ? '#F0F9FF' : '#EAF4EE',
                          color: isOperatorPay ? '#0284C7' : '#4E2A18',
                          border: isOperatorPay ? '1px solid #BAE6FD' : '1px solid #DCC5B3'
                        }}
                      >
                        {isOperatorPay ? 'Repeat Payroll' : 'Repeat Payout'}
                      </button>
                    ) : (
                      <span style={{ fontSize: '11px', color: '#4E2A18', fontWeight: '700' }}>✓ Verified</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        )}
      </div>
    </div>
  );
};
