"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useFarm } from '@/context/FarmContext';
import { Home, Users, Milk, Menu, PlusCircle, TrendingUp, Sliders, DollarSign, LayoutDashboard } from 'lucide-react';

export const BottomNav = ({ onOpenMenu }) => {
  const { currentRole, setActiveModal } = useFarm();
  const pathname = usePathname();

  const handleFabClick = () => {
    setActiveModal('milkEntry');
  };

  const navItems = {
    admin: [
      { href: '/admin', icon: Home, label: 'Home' },
      { href: '/admin/farmers', icon: Users, label: 'Farmers' },
      { type: 'fab', icon: PlusCircle, label: 'Add Entry', onClick: handleFabClick },
      { href: '/admin/reports', icon: TrendingUp, label: 'Reports' },
      { type: 'menu', icon: Menu, label: 'Menu', onClick: onOpenMenu }
    ],
    employee: [
      { href: '/operator', icon: Home, label: 'Home' },
      { href: '/operator/farmers', icon: Users, label: 'Farmers' },
      { type: 'fab', icon: PlusCircle, label: 'Add Entry', onClick: handleFabClick },
      { href: '/operator/rate-chart', icon: Sliders, label: 'Rates' },
      { type: 'menu', icon: Menu, label: 'Menu', onClick: onOpenMenu }
    ],
    farmer: [
      { href: '/farmer', icon: LayoutDashboard, label: 'Dashboard' },
      { href: '/farmer/collection', icon: Milk, label: 'Milk' },
      { type: 'fab', icon: DollarSign, label: 'Payments', onClick: () => window.location.href = '/farmer/payouts' },
      { type: 'menu', icon: Menu, label: 'Menu', onClick: onOpenMenu }
    ]
  };

  const items = navItems[currentRole] || navItems.admin;

  return (
    <nav className="mobile-bottom-nav">
      {items.map((item, index) => {
        const Icon = item.icon;
        
        if (item.type === 'fab') {
          return (
            <div key={index} className="mobile-nav-item" onClick={item.onClick} style={{ cursor: 'pointer' }}>
              <div className="mobile-nav-center-btn">
                <Icon size={24} />
              </div>
              <span style={{ marginTop: '4px' }}>{item.label}</span>
            </div>
          );
        }

        if (item.type === 'menu') {
          return (
            <div key={index} className="mobile-nav-item" onClick={item.onClick} style={{ cursor: 'pointer' }}>
              <Icon size={22} />
              <span>{item.label}</span>
            </div>
          );
        }

        const isActive = pathname === item.href;

        return (
          <Link key={item.href} href={item.href} className={`mobile-nav-item ${isActive ? 'active' : ''}`} style={{ textDecoration: 'none' }}>
            <Icon size={22} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};
