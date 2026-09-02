import React, { useState } from 'react';
import { X, Building2, MapPin, User, Milk, Users } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface AddCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddCenterModal: React.FC<AddCenterModalProps> = ({ isOpen, onClose }) => {
  const { addCenter, operators } = useApp();

  const [name, setName] = useState('');
  const [village, setVillage] = useState('');
  const [district, setDistrict] = useState('');
  const [assignedOperator, setAssignedOperator] = useState('');
  const [activeFarmers, setActiveFarmers] = useState<number>(25);
  const [dailyIntakeAvg, setDailyIntakeAvg] = useState<number>(850);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addCenter({
      name: name.trim(),
      village: village.trim() || 'Central',
      district: district.trim() || 'Dairy Belt',
      assignedOperator: assignedOperator || (operators[0]?.name || 'Unassigned'),
      activeFarmers: Number(activeFarmers) || 0,
      dailyIntakeAvg: Number(dailyIntakeAvg) || 0,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-purple-100 animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="px-5 py-4 bg-purple-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-800 flex items-center justify-center">
              <Building2 className="w-4 h-4 text-purple-200" />
            </div>
            <div>
              <h2 className="text-base font-bold">Add Collection Center / BMC</h2>
              <p className="text-[11px] text-purple-200/80 font-medium">Create a new village milk collection hub</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-purple-800 hover:bg-purple-700 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
          <div>
            <label className="block font-bold text-gray-800 mb-1 flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-purple-700" />
              <span>Center Name</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-800 outline-none focus:border-purple-600"
              placeholder="e.g. Kheda Central BMC Hub"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-gray-800 mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-purple-700" />
                <span>Village</span>
              </label>
              <input
                type="text"
                required
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-medium outline-none focus:border-purple-600"
                placeholder="e.g. Kheda"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-800 mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-purple-700" />
                <span>District</span>
              </label>
              <input
                type="text"
                required
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-medium outline-none focus:border-purple-600"
                placeholder="e.g. Anand"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-gray-800 mb-1 flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-purple-700" />
              <span>Assigned Operator</span>
            </label>
            <input
              type="text"
              value={assignedOperator}
              onChange={(e) => setAssignedOperator(e.target.value)}
              className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl font-medium outline-none focus:border-purple-600"
              placeholder="e.g. Ramesh Patel"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-gray-800 mb-1 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-purple-700" />
                <span>Active Farmers</span>
              </label>
              <input
                type="number"
                min="0"
                value={activeFarmers}
                onChange={(e) => setActiveFarmers(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-bold font-mono"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-800 mb-1 flex items-center gap-1">
                <Milk className="w-3.5 h-3.5 text-purple-700" />
                <span>Daily Intake (L)</span>
              </label>
              <input
                type="number"
                min="0"
                value={dailyIntakeAvg}
                onChange={(e) => setDailyIntakeAvg(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-bold font-mono"
              />
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
              className="flex-1 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold shadow-md cursor-pointer"
            >
              Add Center
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
