import React from 'react';
import { useFarm } from '../context/FarmContext';
import { LogOut, User, ShieldCheck, UserCheck, HeartHandshake, Menu, Bell, Settings } from 'lucide-react';

export const Navbar = ({ onToggleMobileMenu }) => {
  const {
    currentUser,
    currentRole,
    logoutUser,
    setActiveModal
  } = useFarm();

  const getRoleHeaderDetails = () => {
    if (currentRole === 'admin') {
      return {
        label: 'Admin Portal',
        phoneOrName: currentUser?.name || 'Rajesh Sharma',
        icon: <ShieldCheck size={9} />
      };
    }
    if (currentRole === 'employee') {
      return {
        label: 'Operator Hub',
        phoneOrName: currentUser?.name || 'Amit Kumar',
        icon: <UserCheck size={9} />
      };
    }
    return {
      label: 'Farmer Portal',
      phoneOrName: currentUser?.phone || currentUser?.name || 'Farmer',
      icon: <HeartHandshake size={9} />
    };
  };

  const details = getRoleHeaderDetails();

  return (
    <header className="farmer-portal-header top-navbar">
      <div className="left-nav-group" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button 
          onClick={onToggleMobileMenu} 
          className="menu-btn" 
          title="Toggle Navigation Menu"
          aria-label="Toggle Navigation Menu"
        >
          <Menu size={22} />
        </button>
        
        <div className="rudu-logo-text" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div className="brand-icon-box" style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#EBF7EE', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
            <span style={{ fontWeight: '900', fontSize: '18px', color: '#16A34A' }}>R</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span className="brand-title" style={{ fontSize: '20px', fontWeight: '900', color: '#FFFFFF', letterSpacing: '-0.5px', lineHeight: 1 }}>Rudu Farm</span>
            <span className="brand-subtitle" style={{ fontSize: '10px', color: '#A7F3D0', fontWeight: '700', marginTop: '2px' }}>Smart Dairy</span>
          </div>
        </div>

        {/* Global Language Switcher */}
        {typeof window !== 'undefined' && (
          <button
            onClick={() => {
              const currentLang = localStorage.getItem('rudu_lang') || 'en';
              const nextLang = currentLang === 'en' ? 'hi' : 'en';
              localStorage.setItem('rudu_lang', nextLang);
              window.dispatchEvent(new Event('rudu_lang_change'));
              // force re-render in Navbar if needed by just reloading or state, but it handles well.
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(255, 255, 255, 0.2)',
              border: '1px solid rgba(255, 255, 255, 0.4)',
              color: '#FFFFFF',
              padding: '6px 12px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: '800',
              cursor: 'pointer',
              marginLeft: '8px',
              whiteSpace: 'nowrap'
            }}
            title="Switch Language / भाषा बदलें"
          >
            <span style={{ fontSize: '14px' }}>🌐</span>
            <span>EN / हिंदी</span>
          </button>
        )}
      </div>
      
      <div className="right-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div className="user-profile-pill" style={{ background: 'rgba(255, 255, 255, 0.15)', border: '1px solid rgba(255, 255, 255, 0.25)', padding: '4px 12px', borderRadius: '25px', color: '#FFFFFF' }}>
          <div className="user-avatar-circle" style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#EBF7EE', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <User size={16} />
          </div>
          <div className="user-meta-info" style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="user-phone" style={{ fontSize: '12.5px', fontWeight: '800', color: '#FFFFFF' }}>{details.phoneOrName}</div>
          </div>
        </div>

        {/* Notifications Bell */}
        <button 
          onClick={() => setActiveModal('notifications')} 
          className="logout-btn-header" 
          title="Notifications"
          style={{ position: 'relative' }}
        >
          <Bell size={15} />
          <span style={{ position: 'absolute', top: '5px', right: '5px', width: '6px', height: '6px', background: '#EF4444', borderRadius: '50%', border: '1px solid #4E2A18' }} />
        </button>

        {/* Settings */}
        <button onClick={() => setActiveModal('settings')} className="logout-btn-header" title="Settings">
          <Settings size={15} />
        </button>

        {/* Logout */}
        <button onClick={() => logoutUser()} className="logout-btn-header" title="Sign Out">
          <LogOut size={15} />
        </button>
      </div>
    </header>
  );
};
