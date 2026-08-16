import React from 'react';
import { useFarm } from '../context/FarmContext';
import {
  LayoutDashboard,
  Users,
  Milk,
  Receipt,
  Sliders,
  DollarSign,
  BarChart3,
  UserCheck,
  FileText,
  ShoppingBag,
  TrendingUp
} from 'lucide-react';

export const Sidebar = ({ activeTab, setActiveTab, onClose }) => {
  const { currentRole } = useFarm();

  const adminNav = [
    { id: 'dashboard', label: 'Admin Dashboard', icon: LayoutDashboard },
    { id: 'farmers', label: 'Farmer Registry', icon: Users },
    { id: 'operators', label: 'Operator Details', icon: UserCheck },
    { id: 'collection', label: 'Milk Collection Log', icon: Milk },
    { id: 'milk-sales', label: 'Profit & Loss Log', icon: TrendingUp },
    { id: 'rate-chart', label: 'Rate Chart Config', icon: Sliders },
    { id: 'payouts', label: 'Payouts & Ledger', icon: DollarSign },
    { id: 'reports', label: 'Analytics & Reports', icon: BarChart3 }
  ];

  const employeeNav = [
    { id: 'dashboard', label: 'Collection Agent Hub', icon: LayoutDashboard },
    { id: 'collection', label: 'Log New Milk Entry', icon: Milk },
    { id: 'farmers', label: 'Farmer Directory', icon: Users },
    { id: 'milk-sales', label: 'Profit & Loss Log', icon: TrendingUp },
    { id: 'rate-chart', label: 'View Rate Matrix', icon: Sliders }
  ];

  const farmerNav = [
    { id: 'dashboard', label: 'My Farm Overview', icon: LayoutDashboard },
    { id: 'collection', label: 'My Supply Passbook', icon: Receipt },
    { id: 'payouts', label: 'My Payout Passbook', icon: DollarSign }
  ];

  let currentNav = adminNav;
  if (currentRole === 'employee') currentNav = employeeNav;
  if (currentRole === 'farmer') currentNav = farmerNav;

  const handleSelect = (id) => {
    setActiveTab(id);
    if (onClose) onClose();
  };

  return (
    <aside className="sidebar">
      <div style={{ padding: '0 8px 12px 8px', fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
        {currentRole === 'admin' ? 'Management Center' : currentRole === 'employee' ? 'Agent Workspace' : 'Farmer Portal'}
      </div>

      {currentNav.map(item => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => handleSelect(item.id)}
            className={`sidebar-link ${isActive ? 'active' : ''}`}
          >
            <Icon size={18} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </aside>
  );
};
