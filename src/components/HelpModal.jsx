import React, { useState } from 'react';
import { useFarm } from '../context/FarmContext';
import { X, HelpCircle, Phone, HeartHandshake, ShieldCheck, CheckCircle2 } from 'lucide-react';

const WhatsAppIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347z"/>
    <path d="M12 2C6.477 2 2 6.477 2 12c0 2.14.673 4.12 1.823 5.75L2 22l4.388-1.782A9.957 9.957 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a7.96 7.96 0 0 1-4.061-1.111l-.291-.173-2.6 1.056.903-2.527-.19-.303A7.956 7.956 0 0 1 4 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z"/>
  </svg>
);

export const HelpModal = () => {
  const { activeModal, setActiveModal } = useFarm();
  const [openFaqIdx, setOpenFaqIdx] = useState(null);

  if (activeModal !== 'help') return null;

  const faqs = [
    {
      q: 'How is the milk rate calculated?',
      a: 'The rate is calculated dynamically based on the FAT % and SNF % parameters of the milk sample using our standard rate chart engine formula, which offsets the values against standard Cow/Buffalo baselines.'
    },
    {
      q: 'When do I receive my payouts?',
      a: 'Payout settlements are processed weekly every Monday. Pending balances are cleared directly to your verified bank account via UPI or direct bank transfer.'
    },
    {
      q: 'How do I request a cash advance?',
      a: 'Registered farmers can request feed or cash advances from their dashboard. Click the "Request Advance" button, enter the amount/purpose, and the system instantly evaluates and credits the balance.'
    },
    {
      q: 'How to add new cattle to my profile?',
      a: 'You can update cattle numbers under the Farmer Profile page or contact the center operator at Kheda Dairy Center to submit authenticated veterinary records.'
    }
  ];

  return (
    <div className="modal-overlay" style={{ zIndex: 1200 }}>
      <div className="modal-content" style={{ maxWidth: '460px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <HelpCircle size={18} />
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800' }}>Help & Support Center</h3>
          </div>
          <button
            onClick={() => setActiveModal(null)}
            style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        <div className="modal-body" style={{ padding: '24px' }}>
          {/* Support Actions */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
            <a
              href="tel:+919800011122"
              style={{
                flex: 1,
                padding: '12px 10px',
                borderRadius: '16px',
                border: '1.5px solid var(--border)',
                background: '#FFFFFF',
                color: 'var(--text-main)',
                fontWeight: '800',
                fontSize: '13px',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
              }}
            >
              <Phone size={15} style={{ color: 'var(--primary)' }} />
              <span>Call Helpline</span>
            </a>

            <button
              onClick={() => window.open('https://wa.me/919800011122', '_blank')}
              style={{
                flex: 1,
                padding: '12px 10px',
                borderRadius: '16px',
                border: '1.5px solid var(--border)',
                background: '#FFFFFF',
                color: 'var(--text-main)',
                fontWeight: '800',
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
              }}
            >
              <WhatsAppIcon size={15} style={{ color: '#25D366' }} />
              <span>WhatsApp Us</span>
            </button>
          </div>

          {/* FAQS Accordions */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '12px' }}>
              Frequently Asked Questions
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {faqs.map((faq, idx) => {
                const isOpen = openFaqIdx === idx;
                return (
                  <div
                    key={idx}
                    style={{
                      border: '1.5px solid var(--border)',
                      borderRadius: '16px',
                      overflow: 'hidden',
                      background: isOpen ? 'var(--bg-subtle)' : '#FFFFFF',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                      style={{
                        width: '100%',
                        padding: '14px 16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: 'none',
                        border: 'none',
                        textAlign: 'left',
                        cursor: 'pointer',
                        fontWeight: '800',
                        fontSize: '13px',
                        color: 'var(--text-main)'
                      }}
                    >
                      <span>{faq.q}</span>
                      <span style={{ transform: isOpen ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s ease', display: 'inline-block', fontSize: '16px' }}>+</span>
                    </button>
                    {isOpen && (
                      <div style={{ padding: '0 16px 16px 16px', fontSize: '12.5px', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* System Diagnostics Status */}
          <div style={{ background: 'var(--bg-subtle)', padding: '16px', borderRadius: '18px', border: '1.5px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
              <ShieldCheck size={14} style={{ color: 'var(--primary)' }} />
              <span>System Core Status</span>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', marginTop: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-muted)' }}>Database Sync:</span>
                <span style={{ color: '#22C55E', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <CheckCircle2 size={12} /> Connected
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-muted)' }}>Rate Engine Version:</span>
                <strong style={{ color: 'var(--text-main)' }}>v2.4.1 (Stable)</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-muted)' }}>Helpline Center:</span>
                <strong style={{ color: 'var(--text-main)' }}>Active (9am - 6pm)</strong>
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveModal(null)}
            className="btn btn-primary"
            style={{ width: '100%', padding: '12px', borderRadius: '30px', justifyContent: 'center', marginTop: '20px' }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
