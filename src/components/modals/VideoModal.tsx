import React, { useState } from 'react';
import { X, Play, CheckCircle2, ShieldCheck, Award, HeartHandshake } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const VideoModal: React.FC = () => {
  const { isVideoModalOpen, setIsVideoModalOpen, t } = useApp();
  const [isPlaying, setIsPlaying] = useState(false);

  if (!isVideoModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl border border-gray-200 flex flex-col animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="px-5 py-3.5 bg-gray-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm">🥛</span>
            <span className="text-xs sm:text-sm font-bold">Rudu Farm Story</span>
          </div>
          <button
            onClick={() => {
              setIsPlaying(false);
              setIsVideoModalOpen(false);
            }}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Video Player / Showcase Area */}
        <div className="relative w-full h-56 sm:h-64 bg-gray-900 overflow-hidden">
          {!isPlaying ? (
            <div className="w-full h-full relative group cursor-pointer" onClick={() => setIsPlaying(true)}>
              {/* Graphic Farm Landscape Background */}
              <svg viewBox="0 0 400 220" preserveAspectRatio="xMidYMid slice" className="w-full h-full">
                <defs>
                  <linearGradient id="vidSky" x1="200" y1="0" x2="200" y2="220" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#f3f4f6" />
                    <stop offset="0.6" stopColor="#e5e7eb" />
                    <stop offset="1" stopColor="#9ca3af" />
                  </linearGradient>
                </defs>
                <rect width="400" height="220" fill="url(#vidSky)" />
                <circle cx="200" cy="80" r="45" fill="#d1d5db" opacity="0.8" />
                <path d="M0 140C100 120 200 150 300 130C350 120 400 135 400 130V220H0V140Z" fill="#4b5563" />
                <ellipse cx="260" cy="170" rx="20" ry="12" fill="#ffffff" stroke="#111827" />
                <ellipse cx="252" cy="168" rx="6" ry="7" fill="#111827" />
                <ellipse cx="140" cy="175" rx="22" ry="13" fill="#111827" />
                <ellipse cx="132" cy="173" rx="6" ry="7" fill="#ffffff" />
              </svg>

              {/* Center Play Button Overlay */}
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 flex flex-col items-center justify-center text-white transition-colors">
                <div className="w-14 h-14 rounded-full bg-gray-950/90 group-hover:scale-110 flex items-center justify-center shadow-lg transition-transform border border-white/20">
                  <Play className="w-6 h-6 fill-white ml-1 text-white" />
                </div>
                <span className="text-xs font-semibold mt-2">Watch Farm Story (2:15)</span>
              </div>
            </div>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-950 text-white p-6 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center animate-pulse">
                <HeartHandshake className="w-6 h-6 text-gray-200" />
              </div>
              <h3 className="text-sm font-bold text-gray-100">Empowering 10,000+ Dairy Farmers Across Gujarat</h3>
              <p className="text-xs text-gray-400 max-w-sm">
                "At Rudu Farm, we guarantee 100% transparent milk testing, instant digital receipts, fair Fat/SNF pricing, and weekly direct-to-bank settlements."
              </p>
              <button
                onClick={() => setIsPlaying(false)}
                className="px-3 py-1 bg-white/20 hover:bg-white/30 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Replay Overview
              </button>
            </div>
          )}
        </div>

        {/* Pillars / Key Value Props */}
        <div className="p-5 space-y-3 bg-white">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900">
            Our Core Promises to Farmers
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
            <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-200 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-gray-700 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-gray-950">Zero Tampering</strong>
                <span className="text-[10.5px] text-gray-500">Digital ultrasonic Fat/SNF analyzer readings</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-200 flex items-start gap-2">
              <Award className="w-4 h-4 text-gray-700 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-gray-950">Highest Payouts</strong>
                <span className="text-[10.5px] text-gray-500">Fair transparent rate charts without middlemen</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-200 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-gray-700 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-gray-950">On-Time UPI</strong>
                <span className="text-[10.5px] text-gray-500">Direct settlement credited every Friday</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsVideoModalOpen(false)}
            className="w-full py-2.5 bg-gray-950 text-white rounded-xl text-xs font-semibold hover:bg-gray-800 transition-colors cursor-pointer mt-2"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
