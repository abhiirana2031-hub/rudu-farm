import React, { useState } from 'react';
import { X, Truck, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AddDispatchModal: React.FC = () => {
  const { isAddDispatchModalOpen, setIsAddDispatchModalOpen, addTankerDispatch, t } = useApp();

  const [tankerNumber, setTankerNumber] = useState('GJ-07-TK-' + Math.floor(1000 + Math.random() * 9000));
  const [driverName, setDriverName] = useState('Gopalbhai Rabari');
  const [driverPhone, setDriverPhone] = useState('+91 98254 99120');
  const [destination, setDestination] = useState('Central Chilling Dairy Plant, Anand');
  const [quantityLiters, setQuantityLiters] = useState<number>(1200);
  const [temperatureCelsius, setTemperatureCelsius] = useState<number>(3.8);
  const [sealNumber, setSealNumber] = useState(`SEAL-RF-${Math.floor(1000 + Math.random() * 9000)}`);
  const [testedFat, setTestedFat] = useState<number>(4.35);
  const [testedSnf, setTestedSnf] = useState<number>(8.68);

  if (!isAddDispatchModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

    addTankerDispatch({
      tankerNumber,
      driverName,
      driverPhone,
      destination,
      dispatchTime: `16 May 2025, ${timeStr}`,
      quantityLiters: Number(quantityLiters),
      temperatureCelsius: Number(temperatureCelsius),
      sealNumber,
      testedFat: Number(testedFat),
      testedSnf: Number(testedSnf),
      adulterationStatus: 'Pass',
      status: 'In Transit',
      notes: 'Logged via Operator Intake Terminal.',
    });

    setIsAddDispatchModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-gray-200 max-h-[92vh] flex flex-col animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="px-5 py-4 bg-emerald-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-800 flex items-center justify-center">
              <Truck className="w-4 h-4 text-emerald-200" />
            </div>
            <div>
              <h2 className="text-base font-bold">{t.tankerDispatch}</h2>
              <p className="text-[11px] text-emerald-200/80 font-medium">Log outgoing bulk milk tanker & temperature</p>
            </div>
          </div>
          <button
            onClick={() => setIsAddDispatchModalOpen(false)}
            className="w-8 h-8 rounded-full bg-emerald-800 hover:bg-emerald-700 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-3.5 flex-1 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-gray-800 mb-1">Tanker Registration #</label>
              <input
                type="text"
                required
                value={tankerNumber}
                onChange={(e) => setTankerNumber(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-bold font-mono text-gray-900 outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-800 mb-1">Security Seal #</label>
              <input
                type="text"
                required
                value={sealNumber}
                onChange={(e) => setSealNumber(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-bold font-mono text-emerald-900 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-gray-800 mb-1">Driver Name</label>
              <input
                type="text"
                value={driverName}
                onChange={(e) => setDriverName(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-medium outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-800 mb-1">Driver Phone</label>
              <input
                type="text"
                value={driverPhone}
                onChange={(e) => setDriverPhone(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-medium outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-gray-800 mb-1">Destination Processing Dairy</label>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-medium outline-none"
            />
          </div>

          <div className="p-3 bg-amber-50/70 rounded-2xl border border-amber-200 space-y-2">
            <span className="font-bold text-amber-950 block">Volume & Cold-Chain Parameters</span>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-gray-700 mb-1">Quantity (Liters)</label>
                <input
                  type="number"
                  step="50"
                  value={quantityLiters}
                  onChange={(e) => setQuantityLiters(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-xl font-bold font-mono text-gray-900"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-gray-700 mb-1">Temperature (°C)</label>
                <input
                  type="number"
                  step="0.1"
                  value={temperatureCelsius}
                  onChange={(e) => setTemperatureCelsius(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-xl font-bold font-mono text-sky-800"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-gray-800 mb-1">Tested Batch Fat %</label>
              <input
                type="number"
                step="0.05"
                value={testedFat}
                onChange={(e) => setTestedFat(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-bold font-mono outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-800 mb-1">Tested Batch SNF %</label>
              <input
                type="number"
                step="0.05"
                value={testedSnf}
                onChange={(e) => setTestedSnf(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-bold font-mono outline-none"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-2xl font-bold text-xs shadow-md cursor-pointer transition-all flex items-center justify-center gap-1.5"
            >
              <Truck className="w-4 h-4" />
              <span>Confirm Tanker Dispatch & Seal 🚚</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
