"use client";

import React, { useEffect } from 'react';
import { RefreshCw, AlertTriangle } from 'lucide-react';

export default function GlobalErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application Render Error:", error);
  }, [error]);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#F8FAF9',
      padding: '24px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        maxWidth: '600px',
        width: '100%',
        background: '#FFFFFF',
        borderRadius: '24px',
        border: '1.5px solid #E2E8F0',
        padding: '36px 24px',
        textAlign: 'center',
        boxShadow: '0 12px 32px rgba(0,0,0,0.06)'
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '20px',
          background: '#FEF3C7',
          color: '#D97706',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px'
        }}>
          <AlertTriangle size={32} />
        </div>

        <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#4E2A18', margin: '0 0 8px' }}>
          Rudu Farm Error Diagnostic
        </h2>
        <p style={{ fontSize: '13.5px', color: '#64748B', margin: '0 0 16px', lineHeight: '1.5' }}>
          Exact Error Message:
        </p>

        <div style={{
          background: '#F1F5F9',
          color: '#0F172A',
          padding: '16px',
          borderRadius: '12px',
          fontSize: '12px',
          fontFamily: 'monospace',
          textAlign: 'left',
          marginBottom: '20px',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-all',
          maxHeight: '200px',
          overflowY: 'auto'
        }}>
          {error?.message || String(error)}
          {error?.digest && `\nDigest: ${error.digest}`}
        </div>

        <button
          onClick={() => {
            reset();
            window.location.reload();
          }}
          style={{
            background: '#4E2A18',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '30px',
            padding: '12px 28px',
            fontSize: '14px',
            fontWeight: '800',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            justifyContent: 'center',
            width: '100%'
          }}
        >
          <RefreshCw size={18} /> Reload Portal Page
        </button>
      </div>
    </div>
  );
}
