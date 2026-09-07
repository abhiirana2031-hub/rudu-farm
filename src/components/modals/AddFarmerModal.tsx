import React, { useState } from 'react';
import { X, UserPlus, Eye, EyeOff } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { NotificationService } from '../../services/notification/notification.service';

export const AddFarmerModal: React.FC = () => {
  const { isAddFarmerModalOpen, setIsAddFarmerModalOpen, addFarmer, t } = useApp();

  const [name, setName] = useState('');
  const [farmerCode, setFarmerCode] = useState(`RF${Math.floor(1000 + Math.random() * 9000)}`);
  const [phone, setPhone] = useState('+91 98');
  const [village, setVillage] = useState('Kheda');
  const [cowCount, setCowCount] = useState<number>(4);
  const [buffaloCount, setBuffaloCount] = useState<number>(2);
  const [bankName, setBankName] = useState('State Bank of India');
  const [accountNumber, setAccountNumber] = useState('•••• •••• ' + Math.floor(1000 + Math.random() * 9000));
  const [ifscCode, setIfscCode] = useState('SBIN0001842');
  const [upiId, setUpiId] = useState('');
  const [kycStatus, setKycStatus] = useState<'Verified' | 'Pending'>('Verified');
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);

  if (!isAddFarmerModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addFarmer({
      name: name.trim(),
      farmerCode: farmerCode.trim(),
      phone: phone.trim(),
      village: village.trim(),
      district: 'Anand, Gujarat',
      cattleCount: Number(cowCount) + Number(buffaloCount),
      cowCount: Number(cowCount),
      buffaloCount: Number(buffaloCount),
      memberSince: 'May 2025',
      pin: pin.trim() || '1234',
      password: pin.trim() || '1234',
      bankDetails: {
        accountHolder: name.trim(),
        bankName,
        accountNumber,
        ifscCode,
        upiId: upiId || `${phone.replace(/\D/g, '').slice(-10)}@upi`,
        kycStatus,
      },
    });

    // Asynchronously dispatch Account Created SMS
    if (phone.trim()) {
      NotificationService.sendAccountCreatedSMS({
        phone: phone.trim(),
        userId: farmerCode.trim(),
        isOperator: false,
      }).catch(console.warn);
    }

    setIsAddFarmerModalOpen(false);
    // reset
    setName('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-gray-200 max-h-[92vh] flex flex-col animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="px-5 py-4 bg-emerald-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-800 flex items-center justify-center">
              <UserPlus className="w-4 h-4 text-emerald-200" />
            </div>
            <div>
              <h2 className="text-base font-bold">{t.addFarmer}</h2>
              <p className="text-[11px] text-emerald-200/80 font-medium">Register farmer & configure KYC passbook</p>
            </div>
          </div>
          <button
            onClick={() => setIsAddFarmerModalOpen(false)}
            className="w-8 h-8 rounded-full bg-emerald-800 hover:bg-emerald-700 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-3.5 flex-1 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-gray-800 mb-1">Farmer Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Ramesh Patel"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-medium outline-none focus:border-emerald-600 focus:bg-white"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-800 mb-1">Farmer Code</label>
              <input
                type="text"
                value={farmerCode}
                onChange={(e) => setFarmerCode(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-bold font-mono text-emerald-900 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-gray-800 mb-1">Mobile Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-medium outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-800 mb-1">Village Center</label>
              <input
                type="text"
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-medium outline-none"
              />
            </div>
          </div>

          {/* Cattle Count */}
          <div className="p-3 bg-emerald-50/70 rounded-2xl border border-emerald-200 space-y-2">
            <span className="font-bold text-emerald-950 block">Herd Size Information</span>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-gray-700 mb-1">🐄 Cow Count</label>
                <input
                  type="number"
                  min="0"
                  value={cowCount}
                  onChange={(e) => setCowCount(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-xl font-bold font-mono text-gray-900"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-gray-700 mb-1">🐃 Buffalo Count</label>
                <input
                  type="number"
                  min="0"
                  value={buffaloCount}
                  onChange={(e) => setBuffaloCount(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-xl font-bold font-mono text-gray-900"
                />
              </div>
            </div>
          </div>

          {/* Bank & KYC */}
          <div className="space-y-2.5">
            <span className="font-bold text-gray-900 block">Bank Account & Settlement</span>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-gray-700 mb-1">Bank Name</label>
                <input
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-medium outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-gray-700 mb-1">UPI ID (Optional)</label>
                <input
                  type="text"
                  placeholder="name@upi"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-mono outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-gray-700 mb-1">IFSC Code</label>
                <input
                  type="text"
                  value={ifscCode}
                  onChange={(e) => setIfscCode(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-mono outline-none uppercase"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-gray-700 mb-1">KYC Status</label>
                <select
                  value={kycStatus}
                  onChange={(e) => setKycStatus(e.target.value as any)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-bold text-emerald-950 outline-none cursor-pointer"
                >
                  <option value="Verified">Verified (Instant Settlement)</option>
                  <option value="Pending">Pending Verification</option>
                </select>
              </div>
            </div>
          </div>

          {/* Login PIN */}
          <div className="space-y-1.5">
            <label className="block font-bold text-gray-800 mb-1">Login PIN / Password</label>
            <div className="relative">
              <input
                type={showPin ? 'text' : 'password'}
                placeholder="Set a 4-digit PIN (default: 1234)"
                value={pin}
                maxLength={8}
                onChange={(e) => setPin(e.target.value)}
                className="w-full px-3 py-2 pr-10 bg-gray-50 border border-gray-200 rounded-xl font-mono font-bold text-gray-900 outline-none focus:border-emerald-600 focus:bg-white"
              />
              <button
                type="button"
                onClick={() => setShowPin((p) => !p)}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[10px] text-gray-500 font-medium">Farmer uses this PIN to log in. Leave blank to use default PIN: <strong>1234</strong></p>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-2xl font-bold text-xs shadow-md cursor-pointer transition-all flex items-center justify-center gap-1.5"
            >
              <UserPlus className="w-4 h-4" />
              <span>Register Farmer in Cooperative</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
