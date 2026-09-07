import React from 'react';
import { LayoutGrid, Milk, Wallet, User } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const BottomNav: React.FC = () => {
  const { currentTab, setCurrentTab, t } = useApp();

  const tabs: Array<{
    id: 'dashboard' | 'collection' | 'payouts' | 'profile';
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }> = [
    { id: 'dashboard', label: t.dashboard, icon: LayoutGrid },
    { id: 'collection', label: t.collection, icon: Milk },
    { id: 'payouts', label: t.payouts, icon: Wallet },
    { id: 'profile', label: t.profile, icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-emerald-100 px-3 py-1.5 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] max-w-lg mx-auto sm:bottom-3 sm:rounded-full sm:border sm:shadow-lg">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-4 rounded-2xl transition-all cursor-pointer ${
                isActive
                  ? 'bg-emerald-100/70 text-emerald-900 font-bold'
                  : 'text-gray-700 hover:text-emerald-800'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.4] text-emerald-800' : 'stroke-[1.8]'}`} />
              <span className="text-[10px] sm:text-[11px] mt-0.5 whitespace-nowrap tracking-tight font-bold">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
