import React, { useState, useEffect } from 'react';
import { X, Sparkles, Copy, Check, ShieldCheck, Clock, Truck, Gift, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ProductOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClaimOffer?: (couponCode: string) => void;
}

export const ProductOfferModal: React.FC<ProductOfferModalProps> = ({
  isOpen,
  onClose,
  onClaimOffer,
}) => {
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes in seconds
  const couponCode = 'RUDU25';

  // Countdown timer
  useEffect(() => {
    if (!isOpen) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 15 * 60));
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  // Trigger celebration confetti on modal open
  useEffect(() => {
    if (isOpen) {
      try {
        confetti({
          particleCount: 50,
          spread: 65,
          origin: { y: 0.6 },
          colors: ['#dc2626', '#f59e0b', '#10b981', '#ffffff'],
        });
      } catch {
        /* ignore */
      }
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleCopy = () => {
    navigator.clipboard?.writeText(couponCode);
    setCopied(true);
    try {
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.5 },
        colors: ['#dc2626', '#f59e0b', '#22c55e'],
      });
    } catch {
      /* ignore */
    }
    setTimeout(() => setCopied(false), 2500);
  };

  const handleClaim = () => {
    handleCopy();
    if (onClaimOffer) {
      onClaimOffer(couponCode);
    }
    setTimeout(() => {
      onClose();
    }, 400);
  };

  return (
    <div 
      className="fixed inset-0 z-[99999] flex items-center justify-center p-3.5 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="offer-title"
    >
      <div 
        className="relative w-full max-w-[430px] rounded-[32px] sm:rounded-[36px] bg-gradient-to-b from-[#FFFDF9] via-[#FAF6EE] to-[#FFF4E6] border border-amber-200/80 shadow-[0_25px_70px_rgba(0,0,0,0.35),0_0_35px_rgba(220,38,38,0.18)] overflow-hidden animate-scaleUp"
      >
        {/* Subtle decorative glowing background blur circles */}
        <div className="absolute -top-16 -right-16 w-44 h-44 rounded-full bg-red-500/15 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-44 h-44 rounded-full bg-amber-400/20 blur-2xl pointer-events-none" />

        {/* 1. Close (Cross) Button */}
        <button
          onClick={onClose}
          aria-label="Close offer popup"
          className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 z-30 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/95 hover:bg-red-50 text-slate-500 hover:text-red-600 border border-slate-200/80 shadow-md flex items-center justify-center transition-all duration-300 hover:rotate-90 hover:scale-105 cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-400"
        >
          <X size={19} strokeWidth={2.5} />
        </button>

        {/* 2. Top Header Ribbon / Decorative Banner */}
        <div className="bg-gradient-to-r from-red-600 via-red-500 to-amber-500 text-white px-6 pt-5 pb-4 text-center relative overflow-hidden">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/20 backdrop-blur-sm text-[11px] font-extrabold uppercase tracking-wider text-amber-100 mb-2 border border-white/30 shadow-xs">
            <Sparkles size={12} className="text-amber-200 animate-pulse" />
            <span>Exclusive Welcome Offer</span>
          </div>

          <h2 id="offer-title" className="text-2xl sm:text-3xl font-black tracking-tight leading-tight drop-shadow-sm">
            FLAT <span className="text-yellow-300">25% OFF</span>
          </h2>
          <p className="text-xs sm:text-sm font-medium text-red-100 mt-1">
            On Your 1st Fresh Dairy Order
          </p>

          {/* Dairy Product Pills */}
          <div className="flex items-center justify-center gap-2 mt-3 text-[11px] font-bold text-white/95">
            <span className="bg-black/15 backdrop-blur-xs px-2.5 py-0.5 rounded-full border border-white/20">🥛 Pure Milk</span>
            <span className="bg-black/15 backdrop-blur-xs px-2.5 py-0.5 rounded-full border border-white/20">🍯 Vedic Ghee</span>
            <span className="bg-black/15 backdrop-blur-xs px-2.5 py-0.5 rounded-full border border-white/20">🧀 Malai Paneer</span>
          </div>
        </div>

        {/* 3. Modal Body Content */}
        <div className="p-5 sm:p-6 space-y-4 sm:space-y-4.5">

          {/* Value Perks */}
          <div className="grid grid-cols-3 gap-2 text-center py-1">
            <div className="bg-white/80 rounded-2xl p-2.5 border border-amber-100/80 shadow-xs flex flex-col items-center">
              <div className="w-7 h-7 rounded-full bg-red-50 text-red-600 flex items-center justify-center mb-1">
                <ShieldCheck size={16} />
              </div>
              <span className="text-[11px] font-black text-slate-800 leading-tight">100% Pure</span>
              <span className="text-[9.5px] text-slate-500 font-medium">GC Lab Tested</span>
            </div>

            <div className="bg-white/80 rounded-2xl p-2.5 border border-amber-100/80 shadow-xs flex flex-col items-center">
              <div className="w-7 h-7 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mb-1">
                <Truck size={16} />
              </div>
              <span className="text-[11px] font-black text-slate-800 leading-tight">6 AM Fresh</span>
              <span className="text-[9.5px] text-slate-500 font-medium">Free Delivery</span>
            </div>

            <div className="bg-white/80 rounded-2xl p-2.5 border border-amber-100/80 shadow-xs flex flex-col items-center">
              <div className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-1">
                <Gift size={16} />
              </div>
              <span className="text-[11px] font-black text-slate-800 leading-tight">₹0 Minimum</span>
              <span className="text-[9.5px] text-slate-500 font-medium">Cancel Anytime</span>
            </div>
          </div>

          {/* Interactive Coupon Ticket Box */}
          <div className="relative rounded-2xl border-2 border-dashed border-red-300 bg-white p-3.5 shadow-sm">
            <div className="text-[10px] uppercase font-extrabold tracking-widest text-slate-400 text-center mb-1.5">
              Coupon Code • Single Tap to Copy
            </div>

            <div className="flex items-center justify-between gap-2 bg-gradient-to-r from-red-50 to-amber-50 rounded-xl px-3.5 py-2 border border-red-200/80">
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-black tracking-widest text-red-600 font-mono">
                  {couponCode}
                </span>
                <span className="text-[10px] font-extrabold text-amber-700 bg-amber-200/70 px-2 py-0.5 rounded-md">
                  25% OFF
                </span>
              </div>

              <button
                onClick={handleCopy}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-xs ${
                  copied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-red-600 hover:bg-red-700 text-white active:scale-95'
                }`}
              >
                {copied ? (
                  <>
                    <Check size={14} strokeWidth={2.5} />
                    <span>COPIED!</span>
                  </>
                ) : (
                  <>
                    <Copy size={14} strokeWidth={2} />
                    <span>COPY</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Urgency Countdown Banner */}
          <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-amber-100/70 border border-amber-200 text-amber-900 text-xs font-bold">
            <div className="flex items-center gap-1.5">
              <Clock size={14} className="text-amber-700 animate-spin-slow" />
              <span>Offer expires in:</span>
            </div>
            <span className="font-mono text-sm font-black text-red-600 bg-white px-2 py-0.5 rounded-md shadow-2xs">
              {formatTime(timeLeft)}
            </span>
          </div>

          {/* Primary CTA Button */}
          <button
            onClick={handleClaim}
            className="w-full py-3.5 sm:py-4 px-5 rounded-2xl bg-gradient-to-r from-red-600 via-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-red-600/25 hover:shadow-xl hover:shadow-red-600/35 transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer active:scale-[0.98]"
          >
            <span>Claim 25% Discount & Explore</span>
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </button>

          {/* Dismiss link */}
          <div className="text-center">
            <button
              onClick={onClose}
              className="text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              No thanks, I'll pay regular price
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
