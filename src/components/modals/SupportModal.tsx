import React from 'react';
import { X, Headphones, Phone, MessageCircle, ShieldCheck, MapPin, Clock } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SupportModal: React.FC = () => {
  const { isSupportModalOpen, setIsSupportModalOpen, t } = useApp();

  if (!isSupportModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-gray-200 flex flex-col animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="px-5 py-4 bg-gray-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center">
              <Headphones className="w-4 h-4 text-gray-200" />
            </div>
            <div>
              <h2 className="text-base font-bold">Rudu Farm Support</h2>
              <p className="text-[11px] text-gray-400 font-medium">Farmer helpline & settlement help</p>
            </div>
          </div>
          <button
            onClick={() => setIsSupportModalOpen(false)}
            className="w-8 h-8 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-950">
              <ShieldCheck className="w-4 h-4 text-gray-700" />
              <span>Direct Assistance Desk</span>
            </div>
            <p className="text-xs text-gray-600 mt-1">
              Have questions regarding your milk Fat/SNF testing, missing liters, or UPI bank settlement? We are here to help!
            </p>
          </div>

          <div className="space-y-2.5">
            {/* Toll Free Call */}
            <a
              href="tel:18007838327"
              className="p-3.5 rounded-xl bg-white border border-gray-200 hover:border-gray-400 hover:bg-gray-50 flex items-center justify-between transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gray-100 text-gray-800 flex items-center justify-center">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-gray-900 block group-hover:text-gray-950">Toll-Free Helpline</span>
                  <span className="text-[11px] text-gray-500 font-medium">1800-RUDU-FARM (1800 783 8327)</span>
                </div>
              </div>
              <span className="text-xs font-semibold text-gray-900">Call Now →</span>
            </a>

            {/* WhatsApp Support */}
            <a
              href="https://wa.me/919800737321?text=Hi%20Rudu%20Farm%20Team%2C%20I%20need%20assistance%20with%20my%20dairy%20account"
              target="_blank"
              rel="noreferrer"
              className="p-3.5 rounded-xl bg-white border border-gray-200 hover:border-gray-400 hover:bg-gray-50 flex items-center justify-between transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gray-100 text-gray-800 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-gray-900 block group-hover:text-gray-950">WhatsApp Assistance</span>
                  <span className="text-[11px] text-gray-500 font-medium">+91 98007 37321</span>
                </div>
              </div>
              <span className="text-xs font-semibold text-gray-900">Chat →</span>
            </a>

            {/* Collection Center Visit */}
            <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-gray-100 text-gray-800 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="text-xs">
                  <span className="font-bold text-gray-900 block">Kheda Main Dairy Hub</span>
                  <span className="text-gray-500 block mt-0.5">Plot 42, GIDC Dairy Road, Anand - Kheda District, Gujarat 387001</span>
                  <span className="text-[10px] text-gray-600 font-medium flex items-center gap-1 mt-1">
                    <Clock className="w-3 h-3" />
                    Open Daily 5:30 AM - 9:00 PM
                  </span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsSupportModalOpen(false)}
            className="w-full py-2.5 bg-gray-950 text-white rounded-xl text-xs font-semibold hover:bg-gray-800 transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
