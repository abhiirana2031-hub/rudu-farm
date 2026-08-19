"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useFarm } from '@/context/FarmContext';
import {
  LayoutDashboard, Users, Milk, Receipt, Sliders, DollarSign,
  BarChart3, UserCheck, TrendingUp, Clock, Building2, MessageSquare, Printer, X
} from 'lucide-react';

export const Sidebar = ({ onClose }) => {
  const { currentRole } = useFarm();
  const pathname = usePathname();

  const adminNav = [
    { href: '/admin', label: 'Admin Dashboard', icon: LayoutDashboard },
    { href: '/admin/farmers', label: 'Farmer Registry', icon: Users },
    { href: '/admin/operators', label: 'Operator Details', icon: UserCheck },
    { href: '/admin/sessions', label: 'Operator Sessions', icon: Clock },
    { href: '/admin/centers', label: 'Collection Centres', icon: Building2 },
    { href: '/admin/collection', label: 'Milk Collection Log', icon: Milk },
    { href: '/admin/documents', label: 'Print & Documents', icon: Printer },
    { href: '/admin/milk-sales', label: 'Profit & Loss Log', icon: TrendingUp },
    { href: '/admin/rate-chart', label: 'Rate Chart Config', icon: Sliders },
    { href: '/admin/payouts', label: 'Payouts & Ledger', icon: DollarSign },
    { href: '/admin/notifications', label: 'SMS & Notifications', icon: MessageSquare },
    { href: '/admin/reports', label: 'Analytics & Reports', icon: BarChart3 }
  ];

  const employeeNav = [
    { href: '/operator', label: 'Collection Agent Hub', icon: LayoutDashboard },
    { href: '/operator/collection', label: 'Log New Milk Entry', icon: Milk },
    { href: '/operator/farmers', label: 'Farmer Directory', icon: Users },
    { href: '/operator/milk-sales', label: 'Profit & Loss Log', icon: TrendingUp },
    { href: '/operator/rate-chart', label: 'View Rate Matrix', icon: Sliders }
  ];

  const farmerNav = [
    { href: '/farmer', label: 'My Farm Overview', icon: LayoutDashboard },
    { href: '/farmer/collection', label: 'My Supply Passbook', icon: Receipt },
    { href: '/farmer/payouts', label: 'My Payout Passbook', icon: DollarSign }
  ];

  let currentNav = adminNav;
  if (currentRole === 'employee') currentNav = employeeNav;
  if (currentRole === 'farmer') currentNav = farmerNav;

  return (
    <aside className="sidebar">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4px 14px 4px', borderBottom: '1px solid var(--border, #EFE2D5)', marginBottom: '12px' }}>
        <div>
          <div style={{ fontSize: '15px', fontWeight: '800', color: 'var(--primary, #4E2A18)' }}>
            Rudu Portal
          </div>
          <div style={{ fontSize: '10.5px', fontWeight: '700', color: 'var(--text-muted, #7C695D)', textTransform: 'uppercase', letterSpacing: '0.8px', marginTop: '1px' }}>
            {currentRole === 'admin' ? 'Management Center' : currentRole === 'employee' ? 'Agent Workspace' : 'Farmer Portal'}
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="sidebar-close-btn"
            title="Close menu"
            style={{
              background: 'var(--bg-subtle, #F9F6F0)',
              border: 'none',
              borderRadius: '50%',
              width: '30px',
              height: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-muted, #7C695D)',
              cursor: 'pointer'
            }}
          >
            <X size={16} />
          </button>
        )}
      </div>

      {currentNav.map(item => {
        const Icon = item.icon;
        const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/admin' && item.href !== '/operator' && item.href !== '/farmer');
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClose}
            className={`sidebar-link ${isActive ? 'active' : ''}`}
          >
            <Icon size={18} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </aside>
  );
};
