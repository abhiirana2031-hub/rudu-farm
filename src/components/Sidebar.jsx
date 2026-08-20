"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useFarm } from '@/context/FarmContext';
import {
  LayoutDashboard, Users, Milk, Receipt, Sliders, DollarSign,
  BarChart3, UserCheck, TrendingUp, Clock, Building2, MessageSquare, Printer, X,
  Globe, Headphones, ArrowRight, Droplets, BookOpen, Wallet, User, FileText
} from 'lucide-react';

export const Sidebar = ({ onClose }) => {
  const { currentRole } = useFarm();
  const pathname = usePathname();
  const [lang, setLang] = useState('en');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setLang(localStorage.getItem('rudu_lang') || 'en');
      const handleLangChange = () => {
        setLang(localStorage.getItem('rudu_lang') || 'en');
      };
      window.addEventListener('rudu_lang_change', handleLangChange);
      return () => window.removeEventListener('rudu_lang_change', handleLangChange);
    }
  }, []);

  const toggleLanguage = () => {
    const nextLang = lang === 'en' ? 'hi' : 'en';
    setLang(nextLang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('rudu_lang', nextLang);
      window.dispatchEvent(new Event('rudu_lang_change'));
    }
  };

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

  // Farmer Navigation matching exact reference screenshot UI
  const farmerNav = [
    { href: '/farmer', label: lang === 'hi' ? 'मेरा डैशबोर्ड' : 'My Dashboard', icon: LayoutDashboard },
    { href: '/farmer/collection', label: lang === 'hi' ? 'दूध संग्रह लॉग' : 'Milk Collection Log', icon: Receipt },
    { href: '/farmer/payouts', label: lang === 'hi' ? 'भुगतान एवं निपटान' : 'Payouts & Settlements', icon: Wallet },
    { href: '/farmer/ledger', label: lang === 'hi' ? 'दूध आपूर्ति बहीखाता' : 'Milk Supply Ledger', icon: BookOpen },
    { href: '/farmer/profile', label: lang === 'hi' ? 'मेरी प्रोफ़ाइल' : 'My Profile', icon: User }
  ];

  let currentNav = adminNav;
  if (currentRole === 'employee') currentNav = employeeNav;
  if (currentRole === 'farmer') currentNav = farmerNav;

  return (
    <aside className="sidebar" style={{
      background: '#152D1C',
      color: '#FFFFFF',
      width: '290px',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      padding: '20px 16px',
      boxShadow: '4px 0 25px rgba(0,0,0,0.2)',
      overflowY: 'auto'
    }}>
      {/* 1. Header with Logo & Close Button */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyCenter: 'center' }}>
            <Droplets size={22} color="#A7F3D0" fill="#A7F3D0" />
          </div>
          <div>
            <div style={{ fontSize: '18px', fontWeight: '900', color: '#FFFFFF', letterSpacing: '-0.3px', lineHeight: 1 }}>RUDU FARM</div>
            <div style={{ fontSize: '10.5px', color: '#A7F3D0', fontWeight: '700', marginTop: '3px' }}>Smart Dairy Management</div>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            title="Close menu"
            style={{
              background: 'rgba(255,255,255,0.15)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* 2. Embedded Language Switcher Button inside Sidebar Menu */}
      <div style={{ marginBottom: '18px' }}>
        <button
          onClick={toggleLanguage}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(255,255,255,0.08)',
            border: '1.5px solid rgba(167, 243, 208, 0.3)',
            borderRadius: '16px',
            padding: '10px 14px',
            color: '#FFFFFF',
            fontSize: '13px',
            fontWeight: '800',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Globe size={16} color="#A7F3D0" />
            <span>Language / भाषा</span>
          </div>
          <span style={{ background: '#A7F3D0', color: '#152D1C', padding: '3px 10px', borderRadius: '12px', fontSize: '11.5px', fontWeight: '900' }}>
            {lang === 'en' ? 'EN ➔ हिंदी' : 'हिंदी ➔ EN'}
          </span>
        </button>
      </div>

      {/* 3. Navigation Links matching Reference Screenshot */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
        {currentNav.map((item, idx) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/admin' && item.href !== '/operator' && item.href !== '/farmer');
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '13px 16px',
                borderRadius: '18px',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: isActive ? '900' : '700',
                background: isActive ? '#FFFDF5' : 'transparent',
                color: isActive ? '#3C1F10' : 'rgba(255,255,255,0.85)',
                boxShadow: isActive ? '0 4px 15px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <Icon size={19} color={isActive ? '#3C1F10' : '#A7F3D0'} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* 4. Bottom Reference Card 1 ("Who We Are") matching Screenshot */}
      <div style={{ background: '#FFFDF9', borderRadius: '20px', padding: '14px', margin: '16px 0 12px 0', border: '1px solid rgba(255,255,255,0.2)', color: '#3B2214' }}>
        <div style={{ borderRadius: '12px', overflow: 'hidden', height: '85px', marginBottom: '10px' }}>
          <img src="/images/rudu_hero_farmer.jpg" alt="Who We Are" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.currentTarget.src = '/images/rudu_farmer_clean.jpg'; }} />
        </div>
        <h4 style={{ fontSize: '13.5px', fontWeight: '900', color: '#3C1F10', margin: '0 0 4px 0' }}>Who We Are</h4>
        <p style={{ fontSize: '11px', color: '#6E5B50', lineHeight: '1.4', margin: '0 0 10px 0' }}>
          Rudu Farm is dedicated to empowering farmers with transparent, technology-driven dairy management.
        </p>
        <button style={{ width: '100%', background: '#FDF8F3', border: '1px solid #EFE2D5', borderRadius: '12px', padding: '7px', fontSize: '11.5px', fontWeight: '800', color: '#3C1F10', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
          <span>Learn More</span>
          <ArrowRight size={13} />
        </button>
      </div>

      {/* 5. Bottom Reference Card 2 ("Need Help?") matching Screenshot */}
      <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '18px', padding: '14px', border: '1px solid rgba(255,255,255,0.12)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(167, 243, 208, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Headphones size={17} color="#A7F3D0" />
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: '800', color: '#FFFFFF' }}>Need Help?</div>
            <div style={{ fontSize: '10.5px', color: 'rgba(255,255,255,0.7)' }}>We're here to support you</div>
          </div>
        </div>
        <button style={{ width: '100%', background: 'transparent', border: '1px solid rgba(255,255,255,0.25)', borderRadius: '12px', padding: '8px', fontSize: '12px', fontWeight: '800', color: '#FFFFFF', cursor: 'pointer' }}>
          Contact Support
        </button>
      </div>

    </aside>
  );
};
