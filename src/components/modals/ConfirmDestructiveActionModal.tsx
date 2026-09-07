import React, { useState } from 'react';
import { AlertTriangle, X, ShieldAlert, Check } from 'lucide-react';
import { logAuditEvent } from '../../lib/firebase/audit';
import { DEFAULT_TENANT_ID } from '../../lib/firebase/firestore';

interface ConfirmDestructiveActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => Promise<void> | void;
  title: string;
  actionName: string;
  entityType: string;
  entityId: string;
  oldValue?: any;
  newValue?: any;
  actorId?: string;
  actorName?: string;
  warningMessage?: string;
}

export const ConfirmDestructiveActionModal: React.FC<ConfirmDestructiveActionModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  actionName,
  entityType,
  entityId,
  oldValue,
  newValue,
  actorId = 'ADMIN_SUPER',
  actorName = 'Administrator',
  warningMessage = 'This destructive action is non-reversible and will be recorded in the immutable audit log.',
}) => {
  const [reason, setReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleExecute = async () => {
    if (!reason.trim()) {
      alert('Please provide an operational justification / reason for this action.');
      return;
    }

    setIsProcessing(true);
    try {
      // 1. Mandatory immutable audit logging: Who → What → When → Old Value → New Value
      await logAuditEvent({
        tenantId: DEFAULT_TENANT_ID,
        actorId,
        actorRole: 'ADMIN',
        action: actionName,
        entityType,
        entityId,
        metadata: {
          actorName,
          reason: reason.trim(),
          oldValue: oldValue || null,
          newValue: newValue || null,
          timestamp: new Date().toISOString(),
        },
      });

      // 2. Perform the destructive action callback
      await onConfirm(reason.trim());
      onClose();
    } catch (err: any) {
      console.error('[DestructiveAction] Execution failed:', err);
      alert(err.message || 'Action failed to execute.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-red-200 flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 bg-red-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center text-red-200">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm">{title}</h3>
              <p className="text-[11px] text-red-200">Audited High-Impact Operation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs">
          <div className="p-3 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-2.5 text-red-900">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <p className="text-[11px] font-medium leading-relaxed">{warningMessage}</p>
          </div>

          {/* Audit Diff Info */}
          <div className="p-3 bg-gray-50 border border-gray-200 rounded-2xl space-y-2">
            <div className="text-[10px] font-black text-gray-500 uppercase tracking-wider">
              Audit Event Details
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 font-bold">Action:</span>
              <span className="font-mono font-bold text-red-900">{actionName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 font-bold">Entity:</span>
              <span className="font-mono text-gray-900">{entityType} (#{entityId})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 font-bold">Authorized Actor:</span>
              <span className="font-bold text-gray-900">{actorName} (👑 Admin)</span>
            </div>
          </div>

          {/* Reason Input */}
          <div>
            <label className="block text-[11px] font-bold text-gray-700 mb-1">
              Operational Reason / Justification <span className="text-red-500">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Disputed test results corrected upon re-sampling..."
              rows={3}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-red-500 text-xs"
              required
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex justify-end gap-2">
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold text-xs cursor-pointer"
          >
            Cancel
          </button>

          <button
            onClick={handleExecute}
            disabled={isProcessing || !reason.trim()}
            className="px-4 py-2 rounded-xl bg-red-800 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50"
          >
            <Check className="w-3.5 h-3.5" />
            <span>{isProcessing ? 'Auditing & Executing...' : 'Confirm & Execute'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
