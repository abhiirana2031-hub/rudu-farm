import React, { useState, useEffect } from 'react';
import { X, Edit2, ShieldCheck, Key, Phone, User, Building2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { OperatorUser } from '../../types';

interface EditOperatorModalProps {
  operator: OperatorUser | null;
  onClose: () => void;
}

export const EditOperatorModal: React.FC<EditOperatorModalProps> = ({ operator, onClose }) => {
  const { updateOperator, centers } = useApp();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const [centerId, setCenterId] = useState('');
  const [status, setStatus] = useState<'Active' | 'Inactive'>('Active');
  const [shiftAssigned, setShiftAssigned] = useState<'Morning' | 'Evening' | 'Both'>('Both');

  useEffect(() => {
    if (operator) {
      setName(operator.name || '');
      setPhone(operator.phone || '');
      setPin((operator as any).pin || (operator as any).password || '1234');
      setCenterId(operator.centerId || '');
      setStatus(operator.status || 'Active');
      setShiftAssigned(operator.shiftAssigned || 'Both');
    }
  }, [operator]);

  if (!operator) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const matchedCenter = centers.find((c) => c.id === centerId);

    updateOperator(operator.id, {
      name: name.trim(),
      phone: phone.trim(),
      pin: pin.trim(),
      password: pin.trim(),
      centerId,
      centerName: matchedCenter ? matchedCenter.name : operator.centerName,
      status,
      shiftAssigned,
    } as any);

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-gray-200 animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="px-5 py-4 bg-amber-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-700 flex items-center justify-center">
              <Edit2 className="w-4 h-4 text-amber-200" />
            </div>
            <div>
              <h2 className="text-base font-bold">Edit Operator: {operator.employeeCode}</h2>
              <p className="text-[11px] text-amber-200/80 font-medium">Update operator phone, login PIN, & assigned center</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-amber-700 hover:bg-amber-600 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-gray-800 mb-1 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-amber-700" />
                <span>Full Name</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-800 outline-none focus:border-amber-600"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-800 mb-1 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-amber-700" />
                <span>Mobile Number</span>
              </label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-800 outline-none focus:border-amber-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-gray-800 mb-1 flex items-center gap-1">
                <Key className="w-3.5 h-3.5 text-amber-700" />
                <span>Login PIN / Passcode</span>
              </label>
              <input
                type="text"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-bold font-mono text-gray-800 outline-none focus:border-amber-600"
                placeholder="1234"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-800 mb-1 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-amber-700" />
                <span>Assigned Center</span>
              </label>
              <select
                value={centerId}
                onChange={(e) => setCenterId(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-medium outline-none focus:border-amber-600 cursor-pointer"
              >
                <option value="">Select Center...</option>
                {centers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.code})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-gray-800 mb-1">Account Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-800 outline-none cursor-pointer"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-gray-800 mb-1">Shift Assigned</label>
              <select
                value={shiftAssigned}
                onChange={(e) => setShiftAssigned(e.target.value as any)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-medium outline-none cursor-pointer"
              >
                <option value="Both">Morning & Evening</option>
                <option value="Morning">Morning Shift Only</option>
                <option value="Evening">Evening Shift Only</option>
              </select>
            </div>
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold shadow-md cursor-pointer"
            >
              Save Operator
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
