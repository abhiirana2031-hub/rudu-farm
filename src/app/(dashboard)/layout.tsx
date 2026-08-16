"use client";
import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
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
import { ShieldAlert, Lock, LogIn, Loader2 } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { currentUser, currentRole, authLoading, setIsAuthModalOpen } = useFarm();

  // 1. Auth Loading State
  if (authLoading) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        minHeight: '100vh', background: 'var(--background, #F8FAF9)', color: 'var(--primary, #4E2A18)'
      }}>
        <Loader2 size={40} className="animate-spin" style={{ marginBottom: '16px', color: '#22C55E' }} />
        <h3 style={{ fontSize: '16px', fontWeight: '800', margin: 0 }}>Rudu Farm Management System</h3>
        <p style={{ fontSize: '13px', color: '#64748B', margin: '4px 0 0' }}>Verifying secure authentication session...</p>
      </div>
    );
  }

  // 2. Unauthenticated User Guard
  if (!currentUser) {
    return (
      <div className="dashboard-shell-container">
        <Navbar onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
        <div style={{
          maxWidth: '480px', margin: '60px auto 40px', padding: '36px 24px',
          background: '#FFFFFF', borderRadius: '24px', border: '1.5px solid #E2E8F0',
          textAlign: 'center', boxShadow: '0 12px 32px rgba(0,0,0,0.06)'
        }}>
          <div style={{
            width: '64px', height: '64px', borderRadius: '20px', background: '#FEF3C7',
            color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px'
          }}>
            <Lock size={32} />
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#4E2A18', margin: '0 0 8px' }}>
            Authentication Required
          </h2>
          <p style={{ fontSize: '13.5px', color: '#64748B', margin: '0 0 24px', lineHeight: '1.5' }}>
            Please log in with your credentials to access the Rudu Farm Management Portal.
          </p>
          <button
            onClick={() => setIsAuthModalOpen(true)}
            style={{
              background: '#4E2A18', color: '#FFFFFF', border: 'none', borderRadius: '30px',
              padding: '12px 28px', fontSize: '14px', fontWeight: '800', cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', gap: '8px', width: '100%', justifyContent: 'center'
            }}
          >
            <LogIn size={18} /> Log In to Access Portal
          </button>
        </div>
        <AuthModal />
      </div>
    );
  }

  // 3. Admin Route Access Guard
  const isAdminRoute = Boolean(pathname && pathname.startsWith('/admin'));
  if (isAdminRoute && currentRole !== 'admin') {
    return (
      <div className="dashboard-shell-container">
        <Navbar onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
        <div style={{
          maxWidth: '480px', margin: '60px auto 40px', padding: '36px 24px',
          background: '#FFFFFF', borderRadius: '24px', border: '1.5px solid #FEE2E2',
          textAlign: 'center', boxShadow: '0 12px 32px rgba(0,0,0,0.06)'
        }}>
          <div style={{
            width: '64px', height: '64px', borderRadius: '20px', background: '#FEE2E2',
            color: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px'
          }}>
            <ShieldAlert size={32} />
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#991B1B', margin: '0 0 8px' }}>
            Access Restricted
          </h2>
          <p style={{ fontSize: '13.5px', color: '#64748B', margin: '0 0 24px', lineHeight: '1.5' }}>
            Admin privileges are required to access this page. You are currently logged in as <b>{currentUser.name}</b> ({currentRole}).
          </p>
          <button
            onClick={() => setIsAuthModalOpen(true)}
            style={{
              background: '#DC2626', color: '#FFFFFF', border: 'none', borderRadius: '30px',
              padding: '12px 28px', fontSize: '14px', fontWeight: '800', cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', gap: '8px', width: '100%', justifyContent: 'center'
            }}
          >
            <LogIn size={18} /> Switch / Log In as Admin
          </button>
        </div>
        <AuthModal />
      </div>
    );
  }

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
