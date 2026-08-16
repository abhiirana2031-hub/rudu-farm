import React from 'react';
import { useFarm } from '../context/FarmContext';
import {
  Menu,
  Bell,
  Droplets,
  Users,
  Wallet,
  Clock,
  UserPlus,
  Milk,
  CreditCard,
  FileText,
  Printer,
  MoreHorizontal,
  Home,
  User,
  Plus
} from 'lucide-react';

import { RuduLogo } from '../components/RuduLogo';

export const HomeScreen = ({ onNavigate }) => {
  const { entries, openSlip, setActiveModal, setSelectedFarmerId } = useFarm();

  // Get first 3 entries for display
  const todayEntries = entries.slice(0, 3);

  const handleFarmerClick = (farmerId) => {
    setSelectedFarmerId(farmerId);
    if (onNavigate) {
      onNavigate('farmerDetails');
    }
  };

  return (
    <div className="phone-home-container">
      {/* Top Header */}
      <div className="home-top-bar">
        <button className="home-top-bar-btn" title="Menu">
          <Menu size={20} strokeWidth={2.5} />
        </button>
        <div className="home-top-bar-logo" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <RuduLogo height={28} />
        </div>
        <button className="home-top-bar-btn" style={{ color: 'var(--primary)' }} title="Notifications">
          <Bell size={20} strokeWidth={2.5} />
        </button>
      </div>

      {/* Admin Greeting */}
      <div className="home-greeting-section">
        <div className="home-greeting-label">Good Morning,</div>
        <div className="home-greeting-admin">Admin</div>
        <div className="home-greeting-sub">Here's what's happening on your farm today.</div>
      </div>

      {/* 2x2 Metric Cards Grid */}
      <div className="home-metrics-grid">
        <div className="home-metric-card">
          <div className="home-metric-card-header">
            <div className="home-metric-icon-box emerald">
              <Droplets size={12} strokeWidth={3} />
            </div>
            <span>Total Milk Collected</span>
          </div>
          <div>
            <div className="home-metric-val">1,248 L</div>
            <div className="home-metric-trend">
              <span>↑ +6.2% vs. yesterday</span>
            </div>
          </div>
        </div>

        <div className="home-metric-card">
          <div className="home-metric-card-header">
            <div className="home-metric-icon-box emerald">
              <Users size={12} strokeWidth={3} />
            </div>
            <span>Active Farmers</span>
          </div>
          <div>
            <div className="home-metric-val">186</div>
            <div className="home-metric-trend">
              <span>↑ +3 this month</span>
            </div>
          </div>
        </div>

        <div className="home-metric-card">
          <div className="home-metric-card-header">
            <div className="home-metric-icon-box emerald">
              <Wallet size={12} strokeWidth={3} />
            </div>
            <span>Total Payout (This Month)</span>
          </div>
          <div>
            <div className="home-metric-val">₹4,82,400</div>
            <div className="home-metric-trend">
              <span>↑ +8.4% vs. last month</span>
            </div>
          </div>
        </div>

        <div className="home-metric-card">
          <div className="home-metric-card-header">
            <div className="home-metric-icon-box amber">
              <Clock size={12} strokeWidth={3} />
            </div>
            <span>Pending Payments</span>
          </div>
          <div>
            <div className="home-metric-val">₹72,600</div>
            <div className="home-metric-trend neutral">
              <span>↑ 12 farmers</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="home-section-heading">Quick Actions</div>
      <div className="home-actions-grid">
        <div className="home-action-card" onClick={() => setActiveModal('addFarmer')}>
          <div className="home-action-icon-box">
            <UserPlus size={16} strokeWidth={2.5} />
          </div>
          <span className="home-action-label">Add Farmer</span>
        </div>

        <div className="home-action-card" onClick={() => onNavigate && onNavigate('milkEntry')}>
          <div className="home-action-icon-box">
            <Milk size={16} strokeWidth={2.5} />
          </div>
          <span className="home-action-label">Milk Entry</span>
        </div>

        <div className="home-action-card" onClick={() => setActiveModal('makePayment')}>
          <div className="home-action-icon-box">
            <CreditCard size={16} strokeWidth={2.5} />
          </div>
          <span className="home-action-label">Payments</span>
        </div>

        <div className="home-action-card" onClick={() => onNavigate && onNavigate('reports')}>
          <div className="home-action-icon-box">
            <FileText size={16} strokeWidth={2.5} />
          </div>
          <span className="home-action-label">Reports</span>
        </div>

        <div className="home-action-card" onClick={() => openSlip(entries[0])}>
          <div className="home-action-icon-box">
            <Printer size={16} strokeWidth={2.5} />
          </div>
          <span className="home-action-label">Print Slip</span>
        </div>

        <div className="home-action-card">
          <div className="home-action-icon-box">
            <MoreHorizontal size={16} strokeWidth={2.5} />
          </div>
          <span className="home-action-label">More</span>
        </div>
      </div>

      {/* Today's Collection List */}
      <div className="home-list-header">
        <div className="home-section-heading" style={{ marginBottom: 0 }}>Today's Collection</div>
        <button className="home-list-view-all" onClick={() => onNavigate && onNavigate('collection')}>
          View All
        </button>
      </div>

      <div style={{ paddingBottom: '16px' }}>
        {todayEntries.map(e => (
          <div
            key={e.id}
            className="home-collection-item"
            onClick={() => handleFarmerClick(e.farmerId)}
            style={{ cursor: 'pointer' }}
          >
            <div className="home-collection-left">
              <div className="home-collection-avatar">👤</div>
              <div>
                <div className="home-collection-name">{e.farmerName}</div>
                <div className="home-collection-time">{e.timestamp}</div>
              </div>
            </div>

            <div className="home-collection-right">
              <div className="home-collection-qty">{e.quantity} L</div>
              <div className="home-collection-amount">₹{Math.round(e.totalAmount).toLocaleString()}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Nav Bar */}
      <nav className="phone-bottom-nav">
        <button className="phone-nav-item active" onClick={() => onNavigate && onNavigate('home')}>
          <Home size={18} strokeWidth={2.5} />
          <span>Home</span>
        </button>
        <button className="phone-nav-item" onClick={() => onNavigate && onNavigate('farmers')}>
          <Users size={18} strokeWidth={2.5} />
          <span>Farmers</span>
        </button>
        <button className="phone-nav-center-btn" onClick={() => onNavigate && onNavigate('milkEntry')} title="Milk Entry">
          <Plus size={20} strokeWidth={3} />
        </button>
        <button className="phone-nav-item" onClick={() => onNavigate && onNavigate('collection')}>
          <Milk size={18} strokeWidth={2.5} />
          <span>Collection</span>
        </button>
        <button className="phone-nav-item" onClick={() => onNavigate && onNavigate('profile')}>
          <User size={18} strokeWidth={2.5} />
          <span>Profile</span>
        </button>
      </nav>
    </div>
  );
};
