import React from 'react';
import { useFarm } from '../context/FarmContext';
import { X, Bell, DollarSign, Milk, Sliders, AlertTriangle, CheckCircle2 } from 'lucide-react';

export const NotificationsModal = () => {
  const { activeModal, setActiveModal, currentRole } = useFarm();

  if (activeModal !== 'notifications') return null;

  const getRoleNotifications = () => {
    const adminNotifs = [
      {
        id: 1,
        type: 'payment',
        title: 'Settlement Cleared',
        desc: 'Latest farmer payment settlement has been processed and cleared via direct bank deposit.',
        time: '15 mins ago',
        icon: DollarSign,
        iconColor: '#22C55E',
        bgColor: 'rgba(34, 197, 94, 0.1)'
      },
      {
        id: 2,
        type: 'supply',
        title: 'Peak Milk Collection Logged',
        desc: "Today's morning shift milk entry reached a peak. Check the collection log for full details.",
        time: '1 hour ago',
        icon: Milk,
        iconColor: '#2563EB',
        bgColor: 'rgba(37, 99, 235, 0.1)'
      },
      {
        id: 3,
        type: 'rate',
        title: 'Rate Chart Revision Approved',
        desc: 'Vite system approved base rate bump to ₹45.50/L for Buffalo milk supply.',
        time: '3 hours ago',
        icon: Sliders,
        iconColor: '#FF9F00',
        bgColor: 'rgba(255, 159, 0, 0.1)'
      },
      {
        id: 4,
        type: 'alert',
        title: 'System Database Health Alert',
        desc: 'Daily cloud backup has not been completed. Auto-sync will run at 10:00 PM.',
        time: '5 hours ago',
        icon: AlertTriangle,
        iconColor: '#EF4444',
        bgColor: 'rgba(239, 68, 68, 0.1)'
      }
    ];

    const employeeNotifs = [
      {
        id: 1,
        type: 'supply',
        title: 'New Entry Saved Successfully',
        desc: 'Milk collection entry saved successfully. Slip print request sent.',
        time: '5 mins ago',
        icon: Milk,
        iconColor: '#22C55E',
        bgColor: 'rgba(34, 197, 94, 0.1)'
      },
      {
        id: 2,
        type: 'rate',
        title: 'Rate Rules Table Updated',
        desc: 'Collection rates synchronised with the central server. Check rate sliders for new margins.',
        time: '1 hour ago',
        icon: Sliders,
        iconColor: '#FF9F00',
        bgColor: 'rgba(255, 159, 0, 0.1)'
      }
    ];

    const farmerNotifs = [
      {
        id: 1,
        type: 'payment',
        title: '₹26,162 Payout Disbursed',
        desc: 'Lifetime earnings check: direct deposit settlement of ₹26,162 is now cleared and verified.',
        time: '15 mins ago',
        icon: DollarSign,
        iconColor: '#22C55E',
        bgColor: 'rgba(34, 197, 94, 0.1)'
      },
      {
        id: 2,
        type: 'supply',
        title: 'Morning Shift Logged',
        desc: 'Morning shift milk supply was logged at the Dairy Center. Fat 4.2% | SNF 8.5%.',
        time: '3 hours ago',
        icon: Milk,
        iconColor: '#2563EB',
        bgColor: 'rgba(37, 99, 235, 0.1)'
      },
      {
        id: 3,
        type: 'rate',
        title: 'Milk Fat Bonus Revision',
        desc: 'Rudu Farm announced a bonus of +₹0.20 per unit Fat above standard 4.0%. Check details tab.',
        time: '1 day ago',
        icon: Sliders,
        iconColor: '#FF9F00',
        bgColor: 'rgba(255, 159, 0, 0.1)'
      }
    ];

    if (currentRole === 'farmer') return farmerNotifs;
    if (currentRole === 'employee') return employeeNotifs;
    return adminNotifs;
  };

  const notifs = getRoleNotifications();

  return (
    <div className="modal-overlay" style={{ zIndex: 1200 }}>
      <div className="modal-content" style={{ maxWidth: '440px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bell size={18} />
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800' }}>Inbox Notifications</h3>
          </div>
          <button
            onClick={() => setActiveModal(null)}
            style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        <div className="modal-body" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-light)' }}>
              {notifs.length} NEW MESSAGES
            </span>
            <button
              onClick={() => { alert('Notifications cleared.'); setActiveModal(null); }}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--primary)',
                fontWeight: '800',
                fontSize: '12px',
                cursor: 'pointer',
                padding: 0
              }}
            >
              Clear All
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {notifs.map((n) => {
              const Icon = n.icon;
              return (
                <div
                  key={n.id}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '14px',
                    padding: '16px',
                    borderRadius: '20px',
                    border: '1.5px solid var(--border)',
                    background: '#FFFFFF',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.01)',
                    position: 'relative'
                  }}
                >
                  {/* Icon Circle */}
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      background: n.bgColor,
                      color: n.iconColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    <Icon size={16} strokeWidth={2.5} />
                  </div>

                  {/* Text Details */}
                  <div style={{ textAlign: 'left', flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <strong style={{ fontSize: '13px', fontWeight: '850', color: 'var(--text-main)' }}>{n.title}</strong>
                      <span style={{ fontSize: '10px', color: 'var(--text-light)', fontWeight: '700' }}>{n.time}</span>
                    </div>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0, lineHeight: '1.45' }}>
                      {n.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => setActiveModal(null)}
            className="btn btn-primary"
            style={{ width: '100%', padding: '12px', borderRadius: '30px', justifyContent: 'center', marginTop: '24px' }}
          >
            Close Inbox
          </button>
        </div>
      </div>
    </div>
  );
};
