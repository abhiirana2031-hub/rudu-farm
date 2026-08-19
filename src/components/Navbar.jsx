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
        
        <div className="rudu-logo-text" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div className="brand-icon-box" style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontWeight: '800', fontSize: '17px', color: '#FFFFFF' }}>R</span>
          </div>
          <span className="brand-title" style={{ fontSize: '20px', fontWeight: '800', color: '#FFFFFF', letterSpacing: '-0.5px' }}>Rudu</span>
        </div>
      </div>
      
      <div className="right-group">
        <div className="user-profile-pill">
          <div className="user-avatar-circle">
            <User size={16} />
          </div>
          <div className="user-meta-info">
            <div className="user-phone">{details.phoneOrName}</div>
            <div className="user-portal-tag">
              {details.icon}
              <span>{details.label}</span>
            </div>
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
