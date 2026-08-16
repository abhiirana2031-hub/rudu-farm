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
    <header className="farmer-portal-header">
      <button onClick={onToggleMobileMenu} className="menu-btn" title="Toggle Menu">
        <Menu size={22} />
      </button>
      
      <div className="rudu-logo-text">Rudu</div>
      
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
          <Bell size={14} />
          <span style={{ position: 'absolute', top: '5px', right: '5px', width: '6px', height: '6px', background: '#EF4444', borderRadius: '50%' }} />
        </button>

        {/* Settings */}
        <button onClick={() => setActiveModal('settings')} className="logout-btn-header" title="Settings">
          <Settings size={14} />
        </button>

        {/* Logout */}
        <button onClick={() => logoutUser()} className="logout-btn-header" title="Sign Out">
          <LogOut size={14} />
        </button>
      </div>
    </header>
  );
};
