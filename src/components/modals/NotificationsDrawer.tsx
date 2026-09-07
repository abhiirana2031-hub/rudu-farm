import React from 'react';
import { X, Bell, CheckCircle2, Wallet, Milk, TrendingUp, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const NotificationsDrawer: React.FC = () => {
  const {
    isNotificationsOpen,
    setIsNotificationsOpen,
    notifications,
    markNotificationRead,
    setCurrentTab,
  } = useApp();

  if (!isNotificationsOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="px-5 py-4 bg-gray-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-gray-200" />
            <h2 className="text-base font-bold">Farm Notifications</h2>
          </div>
          <button
            onClick={() => setIsNotificationsOpen(false)}
            className="w-8 h-8 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* List of Notifications */}
        <div className="p-4 overflow-y-auto space-y-2.5 flex-1 divide-y divide-gray-100">
          {notifications.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <p className="text-xs font-semibold">No new notifications</p>
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => markNotificationRead(n.id)}
                className={`pt-3 first:pt-0 p-3 rounded-xl transition-colors cursor-pointer ${
                  !n.read ? 'bg-gray-50 border border-gray-200' : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white border border-gray-200 shadow-xs flex items-center justify-center shrink-0">
                    {n.type === 'payout' ? (
                      <Wallet className="w-4 h-4 text-gray-700" />
                    ) : n.type === 'collection' ? (
                      <Milk className="w-4 h-4 text-gray-700" />
                    ) : n.type === 'rate' ? (
                      <TrendingUp className="w-4 h-4 text-gray-700" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-gray-700" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-gray-950">{n.title}</h4>
                      <span className="text-[10px] text-gray-400 font-medium">{n.time}</span>
                    </div>
                    <p className="text-xs text-gray-600 font-medium mt-0.5">{n.message}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex gap-2">
          <button
            onClick={() => {
              notifications.forEach((n) => markNotificationRead(n.id));
            }}
            className="w-full py-2.5 bg-white border border-gray-200 text-gray-800 rounded-xl text-xs font-semibold hover:bg-gray-100 transition-colors cursor-pointer"
          >
            Mark All as Read
          </button>
        </div>
      </div>
    </div>
  );
};
