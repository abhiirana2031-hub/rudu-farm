"use client";
import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { BottomNav } from '@/components/BottomNav';
import { useFarm } from '@/context/FarmContext';
import { QuickMilkEntryModal } from '@/components/QuickMilkEntryModal';
import { PrintSlipModal } from '@/components/PrintSlipModal';
import { AddFarmerModal } from '@/components/AddFarmerModal';
import { PaymentModal } from '@/components/PaymentModal';
import { AuthModal } from '@/components/AuthModal';
import { AddOperatorModal } from '@/components/AddOperatorModal';
import { OperatorPaymentModal } from '@/components/OperatorPaymentModal';
import { SettingsModal } from '@/components/SettingsModal';
import { HelpModal } from '@/components/HelpModal';
import { NotificationsModal } from '@/components/NotificationsModal';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="dashboard-shell-container">
      <Navbar onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
      
      <div className="main-layout">
        {isMobileMenuOpen && (
          <div className="mobile-drawer-overlay" onClick={() => setIsMobileMenuOpen(false)}>
            <div className="mobile-drawer-sidebar" onClick={(e) => e.stopPropagation()}>
              <Sidebar onClose={() => setIsMobileMenuOpen(false)} />
            </div>
          </div>
        )}

        <Sidebar onClose={() => {}} />
        
        <main className="content-area">
          {children}
        </main>
      </div>

      <BottomNav onOpenMenu={() => setIsMobileMenuOpen(true)} />

      <AuthModal />
      <AddOperatorModal />
      <QuickMilkEntryModal />
      <PrintSlipModal />
      <AddFarmerModal />
      <PaymentModal />
      <OperatorPaymentModal />
      <SettingsModal />
      <HelpModal />
      <NotificationsModal />
    </div>
  );
}
