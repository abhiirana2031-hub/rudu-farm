import React, { useState, useEffect } from 'react';
import { FarmProvider, useFarm } from './context/FarmContext';
import { Smartphone, Monitor } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
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

import { AdminDashboard } from './pages/AdminDashboard';
import { EmployeeDashboard } from './pages/EmployeeDashboard';
import { FarmerDashboard } from './pages/FarmerDashboard';
import { FarmersPage } from './pages/FarmersPage';
import { OperatorsPage } from './pages/OperatorsPage';
import { CollectionLogPage } from './pages/CollectionLogPage';
import { RateChartPage } from './pages/RateChartPage';
import { PayoutsPage } from './pages/PayoutsPage';
import { ReportsPage } from './pages/ReportsPage';
import { LandingPage } from './pages/LandingPage';
import { MilkSalesPage } from './pages/MilkSalesPage';

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
      {/* Navbar toggles the sidebar drawer in mobile mode */}
      <Navbar onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
      
      <div className="main-layout">
        {/* Slide-out Menu Drawer for Mobile Screen Sizes */}
        {isMobileMenuOpen && (
          <div className="mobile-drawer-overlay" onClick={() => setIsMobileMenuOpen(false)}>
            <div className="mobile-drawer-sidebar" onClick={(e) => e.stopPropagation()}>
              <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onClose={() => setIsMobileMenuOpen(false)} />
            </div>
          </div>
        )}

        {/* Regular Sidebar (always visible on desktop, hidden in mobile CSS) */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        {/* Core application content area */}
        <main className="content-area">
          {renderPage()}
        </main>
      </div>
    </div>
  );
};

import { SplashScreen } from './screens/SplashScreen';

const AppContent = () => {
  const { currentUser } = useFarm();
  const [showSplash, setShowSplash] = useState(false);

  if (showSplash) {
    return <SplashScreen onGetStarted={() => setShowSplash(false)} />;
  }

  return (
    <div className="app-wrapper">
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
