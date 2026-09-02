import React, { useState } from 'react';
import { X, FlaskConical, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const QualityTestModal: React.FC = () => {
  const { isQualityTestModalOpen, setIsQualityTestModalOpen, addQualityTest, qualityTests, t } = useApp();

  const [sampleSource, setSampleSource] = useState('Kheda Center Morning Bulk Batch');
  const [mbrtMinutes, setMbrtMinutes] = useState<number>(240);
  const [alcoholTest, setAlcoholTest] = useState<'Negative (Passed)' | 'Positive (Curdled)'>('Negative (Passed)');
  const [cobTest, setCobTest] = useState<'Passed' | 'Failed'>('Passed');
  const [adulterationResult, setAdulterationResult] = useState<'Pure / Clean' | 'Suspect'>('Pure / Clean');
  const [testedBy, setTestedBy] = useState('Lab Tech - Hiren Dave');

  if (!isQualityTestModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

    addQualityTest({
      timestamp: `16 May 2025, ${timeStr}`,
      sampleSource,
      mbrtMinutes: Number(mbrtMinutes),
      alcoholTest,
      cobTest,
      adulterationResult,
      testedBy,
      status: adulterationResult === 'Pure / Clean' ? 'Approved' : 'Rejected',
    });

    setIsQualityTestModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-gray-200 max-h-[92vh] flex flex-col animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="px-5 py-4 bg-sky-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-sky-800 flex items-center justify-center">
              <FlaskConical className="w-4 h-4 text-sky-200" />
            </div>
            <div>
              <h2 className="text-base font-bold">{t.qualityLab}</h2>
              <p className="text-[11px] text-sky-200/80 font-medium">Log MBRT, Alcohol, COB, & Adulteration testing</p>
            </div>
          </div>
          <button
            onClick={() => setIsQualityTestModalOpen(false)}
            className="w-8 h-8 rounded-full bg-sky-800 hover:bg-sky-700 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-3.5 flex-1 text-xs">
          <div>
            <label className="block font-bold text-gray-800 mb-1">Batch / Milk Sample Source</label>
            <input
              type="text"
              required
              value={sampleSource}
              onChange={(e) => setSampleSource(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-medium outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-gray-800 mb-1">MBRT Time (Minutes)</label>
              <input
                type="number"
                min="0"
                max="360"
                value={mbrtMinutes}
                onChange={(e) => setMbrtMinutes(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-bold font-mono outline-none"
              />
              <span className="text-[10px] text-gray-700 mt-0.5 block">&gt; 210 min = Grade A</span>
            </div>

            <div>
              <label className="block font-bold text-gray-800 mb-1">Alcohol Test (68%)</label>
              <select
                value={alcoholTest}
                onChange={(e) => setAlcoholTest(e.target.value as any)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-900 outline-none cursor-pointer"
              >
                <option value="Negative (Passed)">Negative (Passed)</option>
                <option value="Positive (Curdled)">Positive (Curdled - Reject)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-gray-800 mb-1">Clot-on-Boiling (COB)</label>
              <select
                value={cobTest}
                onChange={(e) => setCobTest(e.target.value as any)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-900 outline-none cursor-pointer"
              >
                <option value="Passed">Passed (No Clotting)</option>
                <option value="Failed">Failed (Curdling Occurred)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-gray-800 mb-1">Adulteration Strip Check</label>
              <select
                value={adulterationResult}
                onChange={(e) => setAdulterationResult(e.target.value as any)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-900 outline-none cursor-pointer"
              >
                <option value="Pure / Clean">Pure / Clean (0 Adulterants)</option>
                <option value="Suspect">Suspect (Urea/Starch/Neutralizer)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-gray-800 mb-1">Testing Officer / Technician</label>
            <input
              type="text"
              value={testedBy}
              onChange={(e) => setTestedBy(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-medium outline-none"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 bg-sky-800 hover:bg-sky-900 text-white rounded-2xl font-bold text-xs shadow-md cursor-pointer transition-all flex items-center justify-center gap-1.5"
            >
              <FlaskConical className="w-4 h-4" />
              <span>Record Lab Quality Clearance 🧪</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
