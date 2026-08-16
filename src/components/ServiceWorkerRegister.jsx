"use client";
import { useEffect } from 'react';

export const ServiceWorkerRegister = () => {
  useEffect(() => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((reg) => {
            console.log('[PWA] Service Worker registered:', reg.scope);
          })
          .catch((err) => {
            console.error('[PWA] Service Worker registration failed:', err);
          });
      });
    } else if ('serviceWorker' in navigator) {
      // In development mode, register sw as well for instant testing
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }
  }, []);

  return null;
};
