"use client";
import React, { useState, useEffect } from 'react';
import { Download, Share, PlusSquare, X, Smartphone } from 'lucide-react';

export const InstallPwaBanner = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isIos, setIsIos] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if dismissed recently
    const dismissedAt = localStorage.getItem('rudu_pwa_dismissed_time');
    if (dismissedAt && Date.now() - parseInt(dismissedAt) < 7 * 24 * 60 * 60 * 1000) {
      return;
    }

    // Check if already running as standalone PWA
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    if (isStandalone) return;

    // iOS Detection
    const userAgent = window.navigator.userAgent;
    const isIosDevice = /iPhone|iPad|iPod/.test(userAgent) && !window.MSStream;

    if (isIosDevice) {
      setIsIos(true);
      setShowBanner(true);
    }

    // Android / Chrome beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowBanner(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem('rudu_pwa_dismissed_time', Date.now().toString());
  };

  if (!showBanner) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '16px',
      left: '16px',
      right: '16px',
      maxWidth: '460px',
      margin: '0 auto',
      background: '#4E2A18',
      color: '#FFFFFF',
      borderRadius: '20px',
      padding: '14px 18px',
      boxShadow: '0 12px 32px rgba(0, 0, 0, 0.25)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '12px',
      animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
        <div style={{
          width: '42px', height: '42px', borderRadius: '12px', background: '#FFFFFF',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
        }}>
          <Smartphone size={22} color="#4E2A18" />
        </div>
        <div style={{ fontSize: '12.5px' }}>
          <div style={{ fontWeight: '800', fontSize: '13.5px', marginBottom: '2px' }}>
            Install Rudu Farm App
          </div>
          {isIos ? (
            <div style={{ color: '#E2E8F0', opacity: 0.9, lineHeight: '1.3' }}>
              Tap <Share size={12} style={{ display: 'inline', margin: '0 2px' }} /> then tap <b>'Add to Home Screen'</b>
            </div>
          ) : (
            <div style={{ color: '#E2E8F0', opacity: 0.9 }}>
              Get fast offline access & mobile slip printing
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {!isIos && deferredPrompt && (
          <button
            onClick={handleInstallClick}
            style={{
              background: '#22C55E', color: 'white', border: 'none',
              borderRadius: '20px', padding: '8px 14px', fontSize: '12px',
              fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px'
            }}
          >
            <Download size={14} /> Install
          </button>
        )}
        <button
          onClick={handleDismiss}
          style={{ background: 'transparent', border: 'none', color: '#CBD5E1', cursor: 'pointer', padding: '4px' }}
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
};
