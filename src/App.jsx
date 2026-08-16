import React, { useState, useEffect } from 'react';
import { FarmProvider, useFarm } from './context/FarmContext';
import { Smartphone, Monitor } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { BottomNav } from './components/BottomNav';
import { QuickMilkEntryModal } from './components/QuickMilkEntryModal';
import { PrintSlipModal } from './components/PrintSlipModal';
import { AddFarmerModal } from './components/AddFarmerModal';
import { PaymentModal } from './components/PaymentModal';
import { AuthModal } from './components/AuthModal';
import { AddOperatorModal } from './components/AddOperatorModal';
import { OperatorPaymentModal } from './components/OperatorPaymentModal';
import { SettingsModal } from './components/SettingsModal';
import { HelpModal } from './components/HelpModal';
import { NotificationsModal } from './components/NotificationsModal';

import { AdminDashboard } from './views/AdminDashboard';
import { EmployeeDashboard } from './views/EmployeeDashboard';
import { FarmerDashboard } from './views/FarmerDashboard';
import { FarmersPage } from './views/FarmersPage';
import { OperatorsPage } from './views/OperatorsPage';
import { CollectionLogPage } from './views/CollectionLogPage';
import { RateChartPage } from './views/RateChartPage';
import { PayoutsPage } from './views/PayoutsPage';
import { ReportsPage } from './views/ReportsPage';
import { LandingPage } from './views/LandingPage';
import { MilkSalesPage } from './views/MilkSalesPage';
import { OperatorSessionsPage } from './views/OperatorSessionsPage';

// Unified responsive Dashboard Layout Shell for authenticated sessions
const DashboardShell = () => {
  const { currentRole } = useFarm();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const renderPage = () => {
    if (currentRole === 'farmer') {
      if (activeTab === 'collection') return <CollectionLogPage />;
      if (activeTab === 'payouts') return <FarmerDashboard />;
      return <FarmerDashboard />;
    }

    if (currentRole === 'employee') {
      if (activeTab === 'collection') return <CollectionLogPage />;
      if (activeTab === 'farmers') return <FarmersPage />;
      if (activeTab === 'rate-chart') return <RateChartPage />;
      if (activeTab === 'milk-sales') return <MilkSalesPage />;
      return <EmployeeDashboard />;
    }

    switch (activeTab) {
      case 'dashboard': return <AdminDashboard setActiveTab={setActiveTab} />;
      case 'farmers': return <FarmersPage />;
      case 'operators': return <OperatorsPage />;
      case 'operator-sessions': return <OperatorSessionsPage />;
      case 'collection': return <CollectionLogPage />;
      case 'milk-sales': return <MilkSalesPage />;
      case 'rate-chart': return <RateChartPage />;
      case 'payouts': return <PayoutsPage />;
      case 'reports': return <ReportsPage />;
      default: return <AdminDashboard setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="dashboard-shell-container">
      {/* Navbar for desktop, simplified for mobile */}
      <Navbar onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
      
      <div className="main-layout">
        {/* Slide-out Menu Drawer for Mobile Screen Sizes (Triggered by Bottom Nav "Menu") */}
        {isMobileMenuOpen && (
          <div className="mobile-drawer-overlay" onClick={() => setIsMobileMenuOpen(false)}>
            <div className="mobile-drawer-sidebar" onClick={(e) => e.stopPropagation()}>
              <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onClose={() => setIsMobileMenuOpen(false)} />
            </div>
          </div>
        )}

        {/* Regular Sidebar (visible on desktop, hidden on mobile via CSS) */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        {/* Core application content area */}
        <main className="content-area">
          {renderPage()}
        </main>
      </div>

      {/* Bottom Navigation for Mobile */}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} onOpenMenu={() => setIsMobileMenuOpen(true)} />
    </div>
  );
};

import { SplashScreen } from './screens/SplashScreen';

const AppContent = () => {
  const { currentUser, currentRole, activeSession, endSession, logoutUser } = useFarm();
  const [showSplash, setShowSplash] = useState(false);
  const [warningRemaining, setWarningRemaining] = useState(null); // seconds

  useEffect(() => {
    if (currentRole === 'employee' && activeSession) {
      const checkTimer = setInterval(() => {
        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
        
        // Convert activeSession.scheduledEnd to a Date object today for accurate subtraction
        const [endHour, endMin] = activeSession.scheduledEnd.split(':').map(Number);
        const endDate = new Date(now);
        endDate.setHours(endHour, endMin, 0, 0);

        const diffSeconds = Math.floor((endDate.getTime() - now.getTime()) / 1000);

        if (diffSeconds <= 0) {
          endSession('Auto Logout');
          logoutUser();
        } else if (diffSeconds <= 300) {
          setWarningRemaining(diffSeconds);
        } else {
          setWarningRemaining(null);
        }
      }, 1000);
      return () => clearInterval(checkTimer);
    }
  }, [currentRole, activeSession, endSession, logoutUser]);

  if (showSplash) {
    return <SplashScreen onGetStarted={() => setShowSplash(false)} />;
  }

  return (
    <div className="app-wrapper">
      {warningRemaining !== null && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, background: '#E53E3E', color: 'white', padding: '10px', textAlign: 'center', fontWeight: 'bold', zIndex: 9999 }}>
          Warning: Your operator session will expire in {Math.floor(warningRemaining / 60)}m {warningRemaining % 60}s. Please save any pending collection.
        </div>
      )}

      {currentUser ? (
        <DashboardShell />
      ) : (
        <LandingPage />
      )}

      {/* Global Action Modals */}
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
};

export default function App() {
  return (
    <FarmProvider>
      <AppContent />
    </FarmProvider>
  );
}
