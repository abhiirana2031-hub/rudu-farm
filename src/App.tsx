import React, { Component, ErrorInfo, ReactNode, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { LoginScreen } from './components/auth/LoginScreen';
import { RuduLoginWindow } from './components/auth/RuduLoginWindow';
import { DashboardView } from './components/dashboard/DashboardView';
import { MilkCollectionView } from './components/collection/MilkCollectionView';
import { PayoutsSettlementView } from './components/payouts/PayoutsSettlementView';
import { MilkSupplyLedgerView } from './components/ledger/MilkSupplyLedgerView';
import { BankProfileView } from './components/profile/BankProfileView';

// Modals
import { NewMilkEntryModal } from './components/modals/NewMilkEntryModal';
import { MilkSlipModal } from './components/modals/MilkSlipModal';
import { NewPayoutModal } from './components/modals/NewPayoutModal';
import { DailySummaryModal } from './components/modals/DailySummaryModal';
import { VideoModal } from './components/modals/VideoModal';
import { LanguageModal } from './components/modals/LanguageModal';
import { NotificationsDrawer } from './components/modals/NotificationsDrawer';
import { SupportModal } from './components/modals/SupportModal';
import { AddFarmerModal } from './components/modals/AddFarmerModal';
import { EditFarmerModal } from './components/modals/EditFarmerModal';
import { AddDispatchModal } from './components/modals/AddDispatchModal';
import { BroadcastModal } from './components/modals/BroadcastModal';
import { BulkPayoutModal } from './components/modals/BulkPayoutModal';
import { QualityTestModal } from './components/modals/QualityTestModal';
import { GoogleDriveModal } from './components/drive/GoogleDriveModal';
import { MetaTags } from './components/seo/MetaTags';
import { UserRole } from './types';

// ─── Route helper ────────────────────────────────────────────────────────────
function getRouteRole(): UserRole {
  const path = window.location.pathname.replace(/\/+$/, '').toLowerCase();
  if (path === '/admin') return 'admin';
  if (path === '/operator') return 'employee';
  return 'farmer'; // default: /
}

// ─── Error Boundary ──────────────────────────────────────────────────────────
interface ErrorBoundaryProps { children: ReactNode; }
interface ErrorBoundaryState { hasError: boolean; error: Error | null; }

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = { hasError: false, error: null };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary]:', error, errorInfo);
  }

  private handleReset = () => {
    localStorage.clear();
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-emerald-950 text-white flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-800 border-2 border-emerald-400 flex items-center justify-center text-3xl mb-4 shadow-xl">
            🥛
          </div>
          <h1 className="text-2xl font-black text-emerald-300 mb-2">Rudu Farm — Recovery Mode</h1>
          <p className="text-sm text-emerald-100 max-w-md mb-6 leading-relaxed">
            A temporary error occurred. Click below to recover.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all cursor-pointer shadow-md"
            >
              Refresh
            </button>
            <button
              onClick={this.handleReset}
              className="px-5 py-2.5 rounded-2xl bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 border border-emerald-700 font-bold text-xs transition-all cursor-pointer"
            >
              Reset Session
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// ─── Main App Content ─────────────────────────────────────────────────────────
const AppContent: React.FC = () => {
  const { isAuthenticated, currentTab, setUserRole, login, isGoogleDriveModalOpen, setIsGoogleDriveModalOpen } = useApp();

  const routeRole = getRouteRole();

  // Reactive: track localStorage auth flag in state so login redirects immediately
  const [isRoleAuthed, setIsRoleAuthed] = React.useState<boolean>(() => {
    try {
      return localStorage.getItem(`rudu_auth_${routeRole}`) === 'true';
    } catch {
      return false;
    }
  });

  // On mount, enforce role based on URL
  useEffect(() => {
    setUserRole(routeRole);
    // Also sync role auth state on mount (handles refresh scenario)
    try {
      setIsRoleAuthed(localStorage.getItem(`rudu_auth_${routeRole}`) === 'true');
    } catch { /* ignore */ }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-check whenever isAuthenticated changes (e.g. after successful login)
  useEffect(() => {
    try {
      setIsRoleAuthed(localStorage.getItem(`rudu_auth_${routeRole}`) === 'true');
    } catch { /* ignore */ }
  }, [isAuthenticated, routeRole]);

  // --- NOT AUTHENTICATED: show the correct portal login for this specific role ---
  if (!isAuthenticated || !isRoleAuthed) {
    if (routeRole === 'admin') {
      return (
        <>
          <MetaTags title="Admin Console Login | Rudu Dairy" isPrivate={true} />
          <RuduLoginWindow forcedRole="admin" />
        </>
      );
    }
    if (routeRole === 'employee') {
      return (
        <>
          <MetaTags title="Operator Terminal Login | Rudu Dairy" isPrivate={true} />
          <RuduLoginWindow forcedRole="employee" />
        </>
      );
    }
    // Default: / → Public Landing Page with Farmer Login trigger
    return (
      <>
        <LoginScreen />
        <LanguageModal />
      </>
    );
  }

  // --- AUTHENTICATED: full dashboard ---
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-emerald-200 selection:text-emerald-950 relative overflow-x-hidden">
      <MetaTags title="Dashboard & Milk Portal | Rudu Dairy" isPrivate={true} />
      <Header />

      <main className="flex-1 w-full max-w-6xl mx-auto py-3 sm:py-5 px-2 sm:px-4 relative z-10">
        {currentTab === 'dashboard' && <DashboardView />}
        {currentTab === 'collection' && <MilkCollectionView />}
        {currentTab === 'payouts' && <PayoutsSettlementView />}
        {currentTab === 'ledger' && <MilkSupplyLedgerView />}
        {currentTab === 'profile' && <BankProfileView />}
      </main>

      <div className="md:hidden relative z-40">
        <BottomNav />
      </div>

      {/* Global Modals */}
      <NewMilkEntryModal />
      <MilkSlipModal />
      <NewPayoutModal />
      <DailySummaryModal />
      <VideoModal />
      <LanguageModal />
      <NotificationsDrawer />
      <SupportModal />
      <AddFarmerModal />
      <EditFarmerModal />
      <AddDispatchModal />
      <BroadcastModal />
      <BulkPayoutModal />
      <QualityTestModal />
      <GoogleDriveModal
        isOpen={isGoogleDriveModalOpen}
        onClose={() => setIsGoogleDriveModalOpen(false)}
      />
    </div>
  );
};

// ─── Root Export ─────────────────────────────────────────────────────────────
export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </ErrorBoundary>
  );
}
