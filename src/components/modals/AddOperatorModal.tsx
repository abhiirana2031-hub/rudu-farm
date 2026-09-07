import React, { useState } from 'react';
import { X, UserCheck, Shield, Phone, Building, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { NotificationService } from '../../services/notification/notification.service';

interface AddOperatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddOperatorModal: React.FC<AddOperatorModalProps> = ({ isOpen, onClose }) => {
  const { addOperator, centers } = useApp();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+91 ');
  const [centerId, setCenterId] = useState(centers[0]?.id || 'c1');
  const [shiftAssigned, setShiftAssigned] = useState<'Morning' | 'Evening' | 'Both'>('Both');
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    const chosenCenter = centers.find((c) => c.id === centerId) || centers[0];
    const opId = `OP-${Math.floor(1000 + Math.random() * 9000)}`;

    addOperator({
      name: name.trim(),
      phone: phone.trim(),
      centerId: chosenCenter.id,
      centerName: chosenCenter.name,
      status: 'Active',
      shiftAssigned,
      pin: pin.trim() || '1234',
      password: pin.trim() || '1234',
      joinDate: new Date().toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }),
    });

    // Asynchronously dispatch Operator Account Created SMS
    NotificationService.sendAccountCreatedSMS({
      phone: phone.trim(),
      userId: `${name.trim()} (${opId})`,
      isOperator: true,
    }).catch(console.warn);

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-gray-200 flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-emerald-800 to-teal-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center text-emerald-300">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Register Collection Operator</h3>
              <p className="text-[11px] text-emerald-200">Deploy staff to physical milk intake hub</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-800">Operator Full Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Vikram Rabari"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 focus:bg-white focus:border-emerald-600 focus:outline-hidden"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-800">Mobile Phone Number</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                required
                placeholder="+91 98000 00000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 focus:bg-white focus:border-emerald-600 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-800">Assigned Collection Hub</label>
            <div className="relative">
              <Building className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <select
                value={centerId}
                onChange={(e) => setCenterId(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 focus:bg-white focus:border-emerald-600 focus:outline-hidden cursor-pointer"
              >
                {centers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.village})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-800">Shift Authorization</label>
            <div className="grid grid-cols-3 gap-2">
              {(['Morning', 'Evening', 'Both'] as const).map((shift) => (
                <button
                  key={shift}
                  type="button"
                  onClick={() => setShiftAssigned(shift)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    shiftAssigned === shift
                      ? 'bg-emerald-800 text-white border-emerald-800 shadow-xs'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {shift}
                </button>
              ))}
            </div>
          </div>

          <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-start gap-2.5 text-xs text-emerald-950 font-medium">
            <Shield className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <p>
              Operator will receive rapid milk logging permissions and shift reconciliation access for their assigned center.
            </p>
          </div>

          {/* Login PIN */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-800">Login PIN / Password</label>
            <div className="relative">
              <input
                type={showPin ? 'text' : 'password'}
                placeholder="Set a 4-digit PIN (default: 1234)"
                value={pin}
                maxLength={8}
                onChange={(e) => setPin(e.target.value)}
                className="w-full px-3.5 py-2.5 pr-10 bg-gray-50 border border-gray-200 rounded-xl text-sm font-mono font-bold text-gray-900 focus:bg-white focus:border-emerald-600 focus:outline-hidden"
              />
              <button
                type="button"
                onClick={() => setShowPin((p) => !p)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[10px] text-gray-500 font-medium">Operator uses this PIN to log in. Leave blank to use default PIN: <strong>1234</strong></p>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Create Operator</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
