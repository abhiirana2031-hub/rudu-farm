import React, { useState, useEffect } from 'react';
import {
  X,
  Cloud,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  FileText,
  Trash2,
  ExternalLink,
  RefreshCw,
  Upload,
  HardDrive,
  Check,
  Folder,
  Shield,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { User } from 'firebase/auth';
import { useApp } from '../../context/AppContext';
import {
  googleSignIn,
  logout,
  initAuth,
  uploadFileToDrive,
  listDairyDriveFiles,
  deleteDriveFile,
  getOrCreateDairyFolder,
  DriveFileItem,
} from '../../services/googleDriveService';

interface GoogleDriveModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GoogleDriveModal: React.FC<GoogleDriveModalProps> = ({ isOpen, onClose }) => {
  const {
    milkEntries,
    farmers,
    payouts,
    rateChart,
    tankerDispatches,
    qualityTests,
    broadcastAnnouncement,
    triggerCelebration,
  } = useApp();

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const [files, setFiles] = useState<DriveFileItem[]>([]);
  const [folderId, setFolderId] = useState<string | null>(null);
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState<string | null>(null);

  // Destructive deletion confirmation state
  const [fileToDelete, setFileToDelete] = useState<DriveFileItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const unsubscribe = initAuth(
      (user, token) => {
        setCurrentUser(user);
        setAccessToken(token);
      },
      () => {
        setCurrentUser(null);
        setAccessToken(null);
      }
    );
    return () => unsubscribe();
  }, []);

  // Fetch files whenever user is connected and modal opens
  useEffect(() => {
    if (isOpen && accessToken) {
      loadDriveFiles();
    }
  }, [isOpen, accessToken]);

  const loadDriveFiles = async () => {
    if (!accessToken) return;
    setIsLoadingFiles(true);
    try {
      const fId = await getOrCreateDairyFolder(accessToken);
      setFolderId(fId);
      const driveFiles = await listDairyDriveFiles(accessToken, fId);
      setFiles(driveFiles);
    } catch (err: any) {
      console.error('Error loading files:', err);
    } finally {
      setIsLoadingFiles(false);
    }
  };

  const handleSignIn = async () => {
    setIsAuthenticating(true);
    setAuthError(null);
    try {
      const res = await googleSignIn();
      if (res) {
        setCurrentUser(res.user);
        setAccessToken(res.accessToken);
        triggerCelebration();
        // Load files immediately
        const fId = await getOrCreateDairyFolder(res.accessToken);
        setFolderId(fId);
        const driveFiles = await listDairyDriveFiles(res.accessToken, fId);
        setFiles(driveFiles);
      }
    } catch (err: any) {
      console.error('Sign-in error:', err);
      setAuthError(err.message || 'Failed to sign in with Google');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleSignOut = async () => {
    await logout();
    setCurrentUser(null);
    setAccessToken(null);
    setFiles([]);
    setFolderId(null);
  };

  // 1-Click Backup Handlers
  const handleBackupShiftLedger = async () => {
    if (!accessToken || !folderId) return;
    setIsUploading(true);
    setUploadSuccessMsg(null);
    try {
      const dateStr = new Date().toISOString().slice(0, 10);
      const fileName = `Rudu_Farm_Daily_Shift_Ledger_${dateStr}.csv`;
      
      const csvHeader = 'Entry ID,Date,Shift,Farmer ID,Farmer Name,Milk Type,Quantity (L),Fat %,SNF %,CLR,Rate (INR),Total Amount (INR),Payment Status\n';
      const csvRows = milkEntries
        .map((e) =>
          `"${e.receiptId}","${e.date}","${e.shift}","${e.farmerCode}","${e.farmerName}","${e.milkType}",${e.quantityLiters},${e.fatPercentage},${e.snfPercentage},${e.clrReading},${e.ratePerLiter},${e.totalAmount},"${e.status}"`
        )
        .join('\n');

      const file = await uploadFileToDrive(
        accessToken,
        fileName,
        'text/csv',
        csvHeader + csvRows,
        folderId
      );

      setFiles((prev) => [file, ...prev]);
      setUploadSuccessMsg(`Saved "${fileName}" to Google Drive folder "Rudu Farm Dairy Archives"!`);
      triggerCelebration();
      broadcastAnnouncement('Google Drive Synced ☁️', `Daily Shift Ledger backup uploaded to Google Drive.`, 'announcement');
    } catch (err: any) {
      alert(`Upload failed: ${err.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleBackupPnLReport = async () => {
    if (!accessToken || !folderId) return;
    setIsUploading(true);
    setUploadSuccessMsg(null);
    try {
      const dateStr = new Date().toISOString().slice(0, 10);
      const fileName = `Rudu_Farm_PnL_Financial_Audit_${dateStr}.json`;

      const cowVolume = milkEntries.filter((e) => e.milkType === 'cow').reduce((s, e) => s + e.quantityLiters, 0);
      const buffVolume = milkEntries.filter((e) => e.milkType === 'buffalo').reduce((s, e) => s + e.quantityLiters, 0);
      const totalVolume = cowVolume + buffVolume;
      const totalMilkValue = milkEntries.reduce((s, e) => s + e.totalAmount, 0);
      const wholesaleRevenue = Math.round(cowVolume * 67.5 + buffVolume * 86.0);
      const logisticsCost = Math.round(totalVolume * 2.2);
      const netProfit = wholesaleRevenue - totalMilkValue - logisticsCost;

      const pnlReport = {
        title: 'Rudu Farm Smart Dairy - Profit & Loss and Accounting Audit',
        generatedAt: new Date().toISOString(),
        reportingPeriod: '01 May 2025 - 16 May 2025',
        currency: 'INR (₹)',
        metrics: {
          totalIntakeLiters: totalVolume,
          cowMilkLiters: cowVolume,
          buffaloMilkLiters: buffVolume,
          grossWholesaleRevenue: wholesaleRevenue,
          farmerProcurementPayables: totalMilkValue,
          coldChainFreightCost: logisticsCost,
          netOperatingProfit: netProfit,
          profitMarginPercentage: `${((netProfit / (wholesaleRevenue || 1)) * 100).toFixed(1)}%`,
        },
        rateMatrix: rateChart,
        settlements: payouts,
      };

      const file = await uploadFileToDrive(
        accessToken,
        fileName,
        'application/json',
        JSON.stringify(pnlReport, null, 2),
        folderId
      );

      setFiles((prev) => [file, ...prev]);
      setUploadSuccessMsg(`Saved "${fileName}" to Google Drive folder!`);
      triggerCelebration();
    } catch (err: any) {
      alert(`Upload failed: ${err.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleBackupFarmerDirectory = async () => {
    if (!accessToken || !folderId) return;
    setIsUploading(true);
    setUploadSuccessMsg(null);
    try {
      const dateStr = new Date().toISOString().slice(0, 10);
      const fileName = `Rudu_Farm_Farmer_Master_Directory_${dateStr}.csv`;

      const csvHeader = 'Farmer Code,Full Name,Village,Phone,Cattle Count,Cows,Buffaloes,Bank Name,Account/UPI,KYC Status\n';
      const csvRows = farmers
        .map((f) =>
          `"${f.farmerCode}","${f.name}","${f.village}","${f.phone}",${f.cattleCount},${f.cowCount},${f.buffaloCount},"${f.bankDetails.bankName}","${f.bankDetails.upiId || f.bankDetails.accountNumber}","${f.bankDetails.kycStatus}"`
        )
        .join('\n');

      const file = await uploadFileToDrive(
        accessToken,
        fileName,
        'text/csv',
        csvHeader + csvRows,
        folderId
      );

      setFiles((prev) => [file, ...prev]);
      setUploadSuccessMsg(`Saved "${fileName}" to Google Drive folder!`);
      triggerCelebration();
    } catch (err: any) {
      alert(`Upload failed: ${err.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  // Mandatory Explicit Confirmation for Destructive Deletion
  const confirmDeleteFile = async () => {
    if (!accessToken || !fileToDelete) return;
    setIsDeleting(true);
    try {
      await deleteDriveFile(accessToken, fileToDelete.id);
      setFiles((prev) => prev.filter((f) => f.id !== fileToDelete.id));
      setFileToDelete(null);
    } catch (err: any) {
      alert(`Failed to delete: ${err.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl border border-gray-200 flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-white/15 flex items-center justify-center text-teal-300">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base flex items-center gap-1.5">
                <span>Google Drive Cloud Vault</span>
                <span className="px-2 py-0.5 bg-emerald-500/30 text-emerald-300 border border-emerald-400/30 text-[10px] font-black rounded-full uppercase">
                  Connected
                </span>
              </h3>
              <p className="text-[11px] text-teal-200">
                Securely store, sync, and audit dairy ledgers, P&L reports, and receipts
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {/* Sign-in / Connection Bar */}
          {!currentUser ? (
            <div className="p-5 bg-gradient-to-br from-blue-50 to-emerald-50 rounded-3xl border border-blue-200 text-center space-y-3.5">
              <div className="w-12 h-12 rounded-2xl bg-white shadow-xs mx-auto flex items-center justify-center text-blue-600">
                <HardDrive className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-gray-950 text-sm">Connect your Google Drive</h4>
                <p className="text-xs text-gray-600 max-w-md mx-auto">
                  Sign in to automatically sync milk intake logs, profit & loss statements, and digital farmer receipts into your Google Drive storage with your permission.
                </p>
              </div>

              {authError && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center gap-2 justify-center">
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                  <span>{authError}</span>
                </div>
              )}

              {/* Official Sign in with Google Button */}
              <div className="flex justify-center pt-1">
                <button
                  onClick={handleSignIn}
                  disabled={isAuthenticating}
                  className="inline-flex items-center gap-3 px-5 py-2.5 bg-white hover:bg-gray-50 text-gray-800 font-bold text-xs rounded-2xl border border-gray-300 shadow-sm transition-all cursor-pointer disabled:opacity-50"
                >
                  <svg className="w-4 h-4" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                    <path fill="none" d="M0 0h48v48H0z" />
                  </svg>
                  <span>{isAuthenticating ? 'Connecting...' : 'Sign in with Google'}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt={currentUser.displayName || 'Google User'}
                    className="w-10 h-10 rounded-full border-2 border-emerald-400"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center">
                    {(currentUser.displayName || currentUser.email || 'U').charAt(0)}
                  </div>
                )}
                <div>
                  <div className="font-bold text-gray-950 text-xs flex items-center gap-1.5">
                    <span>{currentUser.displayName || 'Google Drive Connected'}</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                  </div>
                  <div className="text-[11px] text-gray-600 font-mono">{currentUser.email}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={loadDriveFiles}
                  disabled={isLoadingFiles}
                  className="p-2 bg-white hover:bg-emerald-100 text-emerald-800 rounded-xl border border-emerald-300 transition-colors text-xs font-bold cursor-pointer flex items-center gap-1"
                  title="Refresh Drive Files"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingFiles ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>
                <button
                  onClick={handleSignOut}
                  className="p-2 bg-white hover:bg-rose-50 text-rose-700 rounded-xl border border-rose-200 transition-colors text-xs font-bold cursor-pointer flex items-center gap-1"
                  title="Disconnect Google Drive"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Disconnect</span>
                </button>
              </div>
            </div>
          )}

          {uploadSuccessMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-2xl text-xs font-bold text-emerald-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>{uploadSuccessMsg}</span>
            </div>
          )}

          {/* Quick 1-Click Cloud Backup Actions */}
          <div className="space-y-2">
            <h4 className="text-xs font-black text-gray-950 uppercase tracking-wider flex items-center gap-1.5">
              <Upload className="w-3.5 h-3.5 text-emerald-800" />
              <span>1-Click Cloud Backup Presets</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                onClick={handleBackupShiftLedger}
                disabled={!currentUser || isUploading}
                className="p-3 bg-gray-50 hover:bg-emerald-50 border border-gray-200 hover:border-emerald-300 rounded-2xl text-left transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed group"
              >
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-2 group-hover:bg-emerald-800 group-hover:text-white transition-colors">
                  <FileSpreadsheet className="w-4 h-4" />
                </div>
                <div className="font-bold text-xs text-gray-900">Shift Intake Ledger</div>
                <div className="text-[10px] text-gray-600">CSV of all milk entries & quality</div>
              </button>

              <button
                onClick={handleBackupPnLReport}
                disabled={!currentUser || isUploading}
                className="p-3 bg-gray-50 hover:bg-purple-50 border border-gray-200 hover:border-purple-300 rounded-2xl text-left transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed group"
              >
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center mb-2 group-hover:bg-purple-800 group-hover:text-white transition-colors">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="font-bold text-xs text-gray-900">Profit & Loss Report</div>
                <div className="text-[10px] text-gray-600">JSON snapshot of wholesale vs costs</div>
              </button>

              <button
                onClick={handleBackupFarmerDirectory}
                disabled={!currentUser || isUploading}
                className="p-3 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-2xl text-left transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed group"
              >
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center mb-2 group-hover:bg-blue-800 group-hover:text-white transition-colors">
                  <HardDrive className="w-4 h-4" />
                </div>
                <div className="font-bold text-xs text-gray-900">Farmer Directory & KYC</div>
                <div className="text-[10px] text-gray-600">CSV of registered suppliers & banks</div>
              </button>
            </div>
          </div>

          {/* Stored Files in Google Drive Explorer */}
          <div className="space-y-2.5 pt-2 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black text-gray-950 uppercase tracking-wider flex items-center gap-1.5">
                <Folder className="w-3.5 h-3.5 text-amber-600" />
                <span>Rudu Farm Cloud Folder ({files.length} Files)</span>
              </h4>
              {folderId && (
                <span className="text-[10px] font-mono text-gray-600">Folder ID: {folderId.slice(0, 8)}...</span>
              )}
            </div>

            {isLoadingFiles ? (
              <div className="p-8 text-center text-xs text-gray-600 flex items-center justify-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin text-emerald-800" />
                <span>Loading files from Google Drive...</span>
              </div>
            ) : files.length === 0 ? (
              <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200 text-center space-y-1">
                <p className="text-xs font-bold text-gray-700">No backup files yet in Google Drive</p>
                <p className="text-[11px] text-gray-600">
                  Click any of the backup presets above to save your first cloud ledger!
                </p>
              </div>
            ) : (
              <div className="space-y-1.5 max-h-56 overflow-y-auto">
                {files.map((file) => (
                  <div
                    key={file.id}
                    className="p-2.5 bg-gray-50 hover:bg-emerald-50/50 rounded-xl border border-gray-200 flex items-center justify-between gap-3 text-xs transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                        {file.name.endsWith('.csv') ? (
                          <FileSpreadsheet className="w-3.5 h-3.5" />
                        ) : (
                          <FileText className="w-3.5 h-3.5" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-gray-900 truncate">{file.name}</div>
                        <div className="text-[10px] text-gray-600">
                          {file.createdTime ? new Date(file.createdTime).toLocaleString() : 'Synced'}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {file.webViewLink && (
                        <a
                          href={file.webViewLink}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-lg bg-white hover:bg-emerald-100 text-emerald-800 border border-gray-200 transition-colors"
                          title="Open in Google Drive"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                      <button
                        onClick={() => setFileToDelete(file)}
                        className="p-1.5 rounded-lg bg-white hover:bg-rose-50 text-rose-700 border border-gray-200 transition-colors cursor-pointer"
                        title="Delete from Drive"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-gray-600">
            <Shield className="w-3.5 h-3.5 text-emerald-700" />
            <span>OAuth protected Google Drive API</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-gray-200 hover:bg-gray-300 font-bold rounded-xl text-gray-800 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>

      {/* Mandatory Destructive Deletion Confirmation Modal */}
      {fileToDelete && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full space-y-4 shadow-2xl border border-gray-200">
            <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center mx-auto">
              <Trash2 className="w-5 h-5" />
            </div>
            <div className="text-center space-y-1">
              <h4 className="font-bold text-gray-950 text-sm">Delete file from Google Drive?</h4>
              <p className="text-xs text-gray-600">
                Are you sure you want to permanently delete <strong className="text-gray-900">{fileToDelete.name}</strong> from your Google Drive storage? This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setFileToDelete(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteFile}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Delete File'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
