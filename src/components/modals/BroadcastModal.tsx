import React, { useState } from 'react';
import { X, Megaphone, Send, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const BroadcastModal: React.FC = () => {
  const { isBroadcastModalOpen, setIsBroadcastModalOpen, broadcastAnnouncement, t } = useApp();

  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState<'rate' | 'announcement' | 'payout'>('announcement');

  if (!isBroadcastModalOpen) return null;

  const presets = [
    {
      title: '📈 Rate Revision Effective Tomorrow',
      message: 'Base milk rates have been revised upwards by ₹1.50/L across all quality brackets.',
      type: 'rate' as const,
    },
    {
      title: '🩺 Free Veterinary & Deworming Camp',
      message: 'Mobile veterinary camp arriving at Kheda Center on Sunday 08:00 AM. Free vaccination.',
      type: 'announcement' as const,
    },
    {
      title: '💰 Fortnightly Payouts Disbursed',
      message: 'Milk settlements for the period 01 May - 15 May have been processed directly to UPI accounts.',
      type: 'payout' as const,
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    broadcastAnnouncement(title.trim(), message.trim(), type);
    setIsBroadcastModalOpen(false);
    setTitle('');
    setMessage('');
  };

  const handleApplyPreset = (p: typeof presets[0]) => {
    setTitle(p.title);
    setMessage(p.message);
    setType(p.type);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-gray-200 max-h-[92vh] flex flex-col animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="px-5 py-4 bg-emerald-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-800 flex items-center justify-center">
              <Megaphone className="w-4 h-4 text-emerald-200" />
            </div>
            <div>
              <h2 className="text-base font-bold">{t.broadcastAlert}</h2>
              <p className="text-[11px] text-emerald-200/80 font-medium">Send push alerts & news to all registered farmers</p>
            </div>
          </div>
          <button
            onClick={() => setIsBroadcastModalOpen(false)}
            className="w-8 h-8 rounded-full bg-emerald-800 hover:bg-emerald-700 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-3.5 flex-1 text-xs">
          {/* Quick Presets */}
          <div>
            <label className="block font-bold text-gray-800 mb-1.5">Quick Announcement Presets</label>
            <div className="space-y-1.5">
              {presets.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyPreset(p)}
                  className="w-full p-2.5 rounded-xl border border-gray-200 bg-gray-50/70 hover:bg-emerald-50 hover:border-emerald-300 text-left transition-all cursor-pointer"
                >
                  <div className="font-bold text-gray-900 truncate">{p.title}</div>
                  <div className="text-[10px] text-gray-700 truncate">{p.message}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-bold text-gray-800 mb-1">Announcement Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Center Timing Update..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-900 outline-none focus:border-emerald-600 focus:bg-white"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-800 mb-1">Message Content *</label>
            <textarea
              required
              rows={3}
              placeholder="Write the message that will appear on farmers' phones..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-medium text-gray-900 outline-none focus:border-emerald-600 focus:bg-white"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-800 mb-1">Notification Category</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setType('announcement')}
                className={`py-2 rounded-xl font-bold border transition-all cursor-pointer ${
                  type === 'announcement'
                    ? 'bg-emerald-800 text-white border-emerald-800 shadow-xs'
                    : 'bg-gray-50 text-gray-700 border-gray-200'
                }`}
              >
                📢 Notice
              </button>
              <button
                type="button"
                onClick={() => setType('rate')}
                className={`py-2 rounded-xl font-bold border transition-all cursor-pointer ${
                  type === 'rate'
                    ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                    : 'bg-gray-50 text-gray-700 border-gray-200'
                }`}
              >
                📈 Rate Update
              </button>
              <button
                type="button"
                onClick={() => setType('payout')}
                className={`py-2 rounded-xl font-bold border transition-all cursor-pointer ${
                  type === 'payout'
                    ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                    : 'bg-gray-50 text-gray-700 border-gray-200'
                }`}
              >
                💰 Payment
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-2xl font-bold text-xs shadow-md cursor-pointer transition-all flex items-center justify-center gap-1.5"
            >
              <Send className="w-4 h-4" />
              <span>Broadcast to All Farmers 📢</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
