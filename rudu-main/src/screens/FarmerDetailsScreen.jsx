import React, { useState } from 'react';
import { useFarm } from '../context/FarmContext';
import { ChevronLeft, MoreHorizontal, MapPin, FileText, CreditCard, Plus } from 'lucide-react';

export const FarmerDetailsScreen = ({ onBack, onNavigate }) => {
  const { farmers, selectedFarmerId, entries, setActiveModal } = useFarm();
  const [activeTab, setActiveTab] = useState('Earnings');

  const farmer = farmers.find(f => f.id === selectedFarmerId) || farmers[0];

  // Helper to format phone to +91 98XXXX1024 or similar
  const formatPhone = (phoneStr) => {
    if (!phoneStr) return '+91 98XXXX1024';
    // If it's the default Ramesh Pal phone
    if (phoneStr.includes('98765 43210') || phoneStr.includes('9876543210')) {
      return '+91 98XXXX1024';
    }
    return phoneStr;
  };

  const handleAddEntryClick = () => {
    if (onNavigate) {
      onNavigate('milkEntry');
    }
  };

  const handleMakePaymentClick = () => {
    setActiveModal('makePayment');
  };

  return (
    <div className="phone-screen-container">
      {/* Top Header */}
      <div className="screen-header-bar">
        <button onClick={onBack} className="screen-header-btn" title="Go Back">
          <ChevronLeft size={22} strokeWidth={2.5} />
        </button>
        <h2 className="screen-header-title">Farmer Details</h2>
        <button className="screen-header-btn" title="Options">
          <MoreHorizontal size={20} strokeWidth={2.5} />
        </button>
      </div>

      {/* Farmer Profile Card */}
      <div className="farmer-detail-header-card">
        <div className="farmer-profile-top">
          <div className="farmer-profile-avatar">👤</div>
          <div className="farmer-profile-info">
            <div className="farmer-profile-name-row">
              <h3 className="farmer-profile-name">{farmer.name}</h3>
              <span className="farmer-active-badge">Active</span>
            </div>
            <div className="farmer-profile-id-phone">
              <div>Farmer ID: {farmer.id}</div>
              <div>{formatPhone(farmer.phone)}</div>
            </div>
            <div className="farmer-profile-village">
              <MapPin size={11} strokeWidth={2.5} />
              <span>Village - {farmer.village}</span>
            </div>
          </div>
        </div>

        {/* 3 Stats Columns inside card */}
        <div className="farmer-stats-box">
          <div className="farmer-stats-col">
            <span className="farmer-stats-label">Total Supply</span>
            <span className="farmer-stats-val emerald">{Math.round(farmer.totalSupplied || 1248).toLocaleString()} L</span>
          </div>
          <div className="farmer-stats-col">
            <span className="farmer-stats-label">This Month</span>
            <span className="farmer-stats-val emerald">{Math.round(farmer.thisMonthSupplied || 476).toLocaleString()} L</span>
          </div>
          <div className="farmer-stats-col">
            <span className="farmer-stats-label">Member Since</span>
            <span className="farmer-stats-val">Jan 2024</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="detail-tabs-list">
        {['Earnings', 'Supply History', 'Details'].map(tab => (
          <button
            key={tab}
            className={`detail-tab-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Earnings Grid */}
      {activeTab === 'Earnings' && (
        <>
          <div className="earnings-grid">
            <div className="earning-card earned">
              <span className="earning-card-label">Total Earned</span>
              <span className="earning-card-val">₹{Math.round(farmer.totalEarned || 26162).toLocaleString()}</span>
            </div>

            <div className="earning-card cleared">
              <span className="earning-card-label">Cleared</span>
              <span className="earning-card-val">₹{Math.round(farmer.clearedPayout || 21400).toLocaleString()}</span>
            </div>

            <div className="earning-card pending">
              <span className="earning-card-label">Pending</span>
              <span className="earning-card-val">₹{Math.round(farmer.pendingPayout || 3562).toLocaleString()}</span>
            </div>

            <div className="earning-card stroke advance">
              <span className="earning-card-label">Advance</span>
              <span className="earning-card-val">₹{Math.round(farmer.advanceBalance || 1200).toLocaleString()}</span>
            </div>
          </div>

          {/* Recent Transactions List Header */}
          <div className="home-list-header">
            <div className="home-section-heading" style={{ marginBottom: 0 }}>Recent Transactions</div>
            <button className="home-list-view-all">
              View All
            </button>
          </div>

          {/* Transactions List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', paddingBottom: '16px' }}>
            <div className="transaction-row">
              <div className="transaction-left">
                <div className="transaction-icon-box">
                  <FileText size={14} strokeWidth={2.5} />
                </div>
                <div>
                  <div className="transaction-date">22 Jul 2026</div>
                  <div className="transaction-details">Milk Supply - 42.5 L</div>
                </div>
              </div>
              <div className="transaction-right">
                <div className="transaction-amount">+ ₹2,333</div>
                <span className="transaction-status-tag cleared">Cleared</span>
              </div>
            </div>

            <div className="transaction-row">
              <div className="transaction-left">
                <div className="transaction-icon-box">
                  <FileText size={14} strokeWidth={2.5} />
                </div>
                <div>
                  <div className="transaction-date">21 Jul 2026</div>
                  <div className="transaction-details">Milk Supply - 38.0 L</div>
                </div>
              </div>
              <div className="transaction-right">
                <div className="transaction-amount">+ ₹2,090</div>
                <span className="transaction-status-tag cleared">Cleared</span>
              </div>
            </div>

            <div className="transaction-row">
              <div className="transaction-left">
                <div className="transaction-icon-box">
                  <FileText size={14} strokeWidth={2.5} />
                </div>
                <div>
                  <div className="transaction-date">20 Jul 2026</div>
                  <div className="transaction-details">Milk Supply - 40.0 L</div>
                </div>
              </div>
              <div className="transaction-right">
                <div className="transaction-amount pending">+ ₹2,196</div>
                <span className="transaction-status-tag pending">Pending</span>
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === 'Supply History' && (
        <div style={{ padding: '12px', fontSize: '12px', color: '#64748b', textAlign: 'center', background: '#ffffff', borderRadius: '14px', border: '1px solid #f1f5f9' }}>
          Supply history entries will list here.
        </div>
      )}

      {activeTab === 'Details' && (
        <div style={{ padding: '12px', fontSize: '12px', color: '#64748b', textAlign: 'center', background: '#ffffff', borderRadius: '14px', border: '1px solid #f1f5f9' }}>
          Registered Bank Acc: {farmer.bankName} <br />
          Aadhaar: XXXX-XXXX-5912
        </div>
      )}

      {/* Bottom Action Buttons side-by-side */}
      <div className="details-actions-row">
        <button onClick={handleAddEntryClick} className="details-action-btn-outline" title="Add Entry">
          <Plus size={14} strokeWidth={3} />
          <span>Add Entry</span>
        </button>

        <button onClick={handleMakePaymentClick} className="details-action-btn-filled" title="Make Payment">
          <CreditCard size={14} strokeWidth={2.5} />
          <span>Make Payment</span>
        </button>
      </div>
    </div>
  );
};
