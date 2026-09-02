import React, { useState, useEffect } from 'react';
import { X, Edit2, ShieldCheck, Key, Phone, User, MapPin } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const EditFarmerModal: React.FC = () => {
  const { editingFarmer, setEditingFarmer, updateFarmer } = useApp();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const [village, setVillage] = useState('');
  const [cowCount, setCowCount] = useState<number>(0);
  const [buffaloCount, setBuffaloCount] = useState<number>(0);
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [upiId, setUpiId] = useState('');
  const [kycStatus, setKycStatus] = useState<'Verified' | 'Pending'>('Verified');

  useEffect(() => {
    if (editingFarmer) {
      setName(editingFarmer.name || '');
      setPhone(editingFarmer.phone || '');
      setPin((editingFarmer as any).pin || (editingFarmer as any).password || '1307');
      setVillage(editingFarmer.village || '');
      setCowCount(editingFarmer.cowCount || 0);
      setBuffaloCount(editingFarmer.buffaloCount || 0);
      setBankName(editingFarmer.bankDetails?.bankName || '');
      setAccountNumber(editingFarmer.bankDetails?.accountNumber || '');
      setIfscCode(editingFarmer.bankDetails?.ifscCode || '');
      setUpiId(editingFarmer.bankDetails?.upiId || '');
      setKycStatus(editingFarmer.bankDetails?.kycStatus || 'Verified');
    }
  }, [editingFarmer]);

  if (!editingFarmer) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    updateFarmer(editingFarmer.id, {
      name: name.trim(),
      phone: phone.trim(),
      village: village.trim(),
      cattleCount: Number(cowCount) + Number(buffaloCount),
      cowCount: Number(cowCount),
      buffaloCount: Number(buffaloCount),
      pin: pin.trim(),
      password: pin.trim(),
      bankDetails: {
        ...editingFarmer.bankDetails,
        accountHolder: name.trim(),
        bankName,
        accountNumber,
        ifscCode,
        upiId,
        kycStatus,
      },
    } as any);

    setEditingFarmer(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-gray-200 max-h-[92vh] flex flex-col animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="px-5 py-4 bg-emerald-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-800 flex items-center justify-center">
              <Edit2 className="w-4 h-4 text-emerald-200" />
            </div>
            <div>
              <h2 className="text-base font-bold">Edit Farmer: {editingFarmer.farmerCode}</h2>
              <p className="text-[11px] text-emerald-200/80 font-medium">Update mobile number, login PIN, & bank details</p>
            </div>
          </div>
          <button
            onClick={() => setEditingFarmer(null)}
            className="w-8 h-8 rounded-full bg-emerald-800 hover:bg-emerald-700 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-3.5 flex-1 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-gray-800 mb-1 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-emerald-700" />
                <span>Farmer Full Name</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-800 outline-none focus:border-emerald-600"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-800 mb-1 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-emerald-700" />
                <span>Mobile Number</span>
              </label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-800 outline-none focus:border-emerald-600"
                placeholder="6396941307"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-gray-800 mb-1 flex items-center gap-1">
                <Key className="w-3.5 h-3.5 text-emerald-700" />
                <span>Login PIN / Passcode</span>
              </label>
              <input
                type="text"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-bold font-mono text-emerald-950 outline-none focus:border-emerald-600"
                placeholder="e.g. 1307"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-800 mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                <span>Village Hub</span>
              </label>
              <input
                type="text"
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-medium outline-none focus:border-emerald-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <div>
              <label className="block font-bold text-gray-800 mb-1">KYC Status</label>
              <select
                value={kycStatus}
                onChange={(e) => setKycStatus(e.target.value as any)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-bold text-emerald-950 outline-none cursor-pointer"
              >
                <option value="Verified">Verified</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
          </div>

          <div className="p-3 bg-emerald-50/70 rounded-2xl border border-emerald-200 space-y-2">
            <span className="font-bold text-emerald-950 block">Herd Details</span>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-gray-700 mb-1">🐄 Cow Count</label>
                <input
                  type="number"
                  min="0"
                  value={cowCount}
                  onChange={(e) => setCowCount(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-xl font-bold font-mono"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-gray-700 mb-1">🐃 Buffalo Count</label>
                <input
                  type="number"
                  min="0"
                  value={buffaloCount}
                  onChange={(e) => setBuffaloCount(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-xl font-bold font-mono"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2.5">
            <span className="font-bold text-gray-900 block">Bank Account Details</span>
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
                <label className="block text-[11px] font-medium text-gray-700 mb-1">Account Number</label>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-medium outline-none"
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
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-medium outline-none uppercase font-mono"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-gray-700 mb-1">UPI ID (VPA)</label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-medium outline-none"
                />
              </div>
            </div>
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={() => setEditingFarmer(null)}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold shadow-md cursor-pointer"
            >
              Save Farmer Details
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
