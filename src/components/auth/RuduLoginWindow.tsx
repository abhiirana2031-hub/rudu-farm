import React, { useState } from 'react';
import {
  Phone,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Globe,
  ChevronDown,
  Check,
  Smartphone,
  ChevronLeft,
  User,
  ShieldAlert,
  Users
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { LanguageCode } from '../../types';

// Crisp double-leaf sprout logo
const RuduLeafLogo = () => (
  <svg width="46" height="46" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M40 70C40 70 42 45 62 25C62 25 68 18 64 12C60 6 52 10 45 16C35 25 38 42 38 42"
      stroke="#1B4D2E"
      strokeWidth="4.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="#2E7D32"
    />
    <path
      d="M38 42C38 42 22 28 14 36C6 44 14 54 22 56C30 58 39 52 39 52"
      stroke="#1B4D2E"
      strokeWidth="4.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="#43A047"
    />
    <path
      d="M40 70C39 58 40 45 45 35"
      stroke="#1B4D2E"
      strokeWidth="4"
      strokeLinecap="round"
    />
  </svg>
);

const GoogleGIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
    />
    <path
      fill="#34A853"
      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z"
    />
    <path
      fill="#FBBC05"
      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
    />
    <path
      fill="#EA4335"
      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
    />
  </svg>
);

interface RuduLoginWindowProps {
  forcedRole?: 'farmer' | 'employee' | 'admin';
  onBack?: () => void;
}

export const RuduLoginWindow: React.FC<RuduLoginWindowProps> = ({ forcedRole = 'farmer', onBack }) => {
  const { login, language, setLanguage } = useApp();
  const [selectedRole] = useState<'farmer' | 'employee' | 'admin'>(forcedRole);
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [otpPhone, setOtpPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');

  const languages: Array<{ code: LanguageCode; label: string; native: string }> = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
    { code: 'gu', label: 'Gujarati', native: 'ગુજરાતી' },
    { code: 'pa', label: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
    { code: 'mr', label: 'Marathi', native: 'मराठी' },
  ];
  const currentLangObj = languages.find((l) => l.code === language) || languages[0];

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsSubmitting(true);
    try {
      const res = await login(selectedRole, mobileNumber, password);
      if (!res.success) {
        setLoginError(res.error || `Invalid credentials. Please verify your details.`);
      }
    } catch (err: any) {
      setLoginError(err.message || 'Network error connecting to dairy server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFarmer = selectedRole === 'farmer';
  const isAdmin = selectedRole === 'admin';
  const isOperator = selectedRole === 'employee';

  return (
    <div style={{ minHeight: '100vh', width: '100%', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 16px', backgroundColor: '#0B1510', boxSizing: 'border-box' }}>
      
      {/* ─── 1. FULLSCREEN PANORAMIC FARM BACKGROUND ───────────────────────── */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <img
          src="/images/hero_farm_background.png"
          alt="Rudu Dairy Farm Landscape"
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', filter: 'brightness(0.38) contrast(1.1)', transform: 'scale(1.02)' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, rgba(11,21,16,0.3) 0%, rgba(11,21,16,0.85) 100%)' }} />
      </div>

      {/* ─── 2. TOP FLOATING CONTROLS ───────────────────────────────────────── */}
      <div style={{ position: 'fixed', top: '20px', left: '20px', right: '20px', zIndex: 30, display: 'flex', justifyContent: 'space-between', alignItems: 'center', pointerEvents: 'auto', maxWidth: '1200px', margin: '0 auto' }}>
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', borderRadius: '30px', backgroundColor: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.22)', color: '#ffffff', fontSize: '13px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 16px rgba(0,0,0,0.25)', transition: 'all 0.2s ease' }}
          >
            <ChevronLeft size={16} color="#4ADE80" />
            <span>Back to Home</span>
          </button>
        ) : (
          <a
            href="/"
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', borderRadius: '30px', backgroundColor: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.22)', color: '#ffffff', fontSize: '13px', fontWeight: '700', textDecoration: 'none', cursor: 'pointer', boxShadow: '0 4px 16px rgba(0,0,0,0.25)' }}
          >
            <ChevronLeft size={16} color="#4ADE80" />
            <span>Public Site</span>
          </a>
        )}

        {/* Language Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            type="button"
            onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', borderRadius: '30px', backgroundColor: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.22)', color: '#ffffff', fontSize: '13px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 16px rgba(0,0,0,0.25)' }}
          >
            <Globe size={16} color="#4ADE80" />
            <span>{currentLangObj.native}</span>
            <ChevronDown size={14} color="#CBD5E1" />
          </button>

          {isLangDropdownOpen && (
            <div style={{ position: 'absolute', right: 0, marginTop: '8px', width: '160px', backgroundColor: '#ffffff', borderRadius: '16px', boxShadow: '0 12px 32px rgba(0,0,0,0.3)', border: '1px solid #E2E8F0', padding: '6px', zIndex: 50 }}>
              {languages.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => {
                    setLanguage(l.code);
                    setIsLangDropdownOpen(false);
                  }}
                  style={{ width: '100%', padding: '8px 12px', textAlign: 'left', fontSize: '13px', fontWeight: language === l.code ? '800' : '600', color: language === l.code ? '#1B4D2E' : '#334155', backgroundColor: language === l.code ? '#ECFDF5' : 'transparent', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: 'none', cursor: 'pointer', marginBottom: '2px' }}
                >
                  <span>{l.native}</span>
                  {language === l.code && <Check size={14} color="#1B4D2E" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ─── 3. CENTERED LUXURY CARD ────────────────────────────────────────── */}
      <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '440px', margin: 'auto', paddingTop: '40px', paddingBottom: '20px', boxSizing: 'border-box' }}>
        
        {/* Main Card Shell */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '28px', padding: '36px 32px 30px 32px', boxShadow: '0 25px 60px rgba(0, 0, 0, 0.35)', border: '1px solid rgba(255,255,255,0.8)', boxSizing: 'border-box' }}>
          
          {/* Header Brand */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '22px' }}>
            <div style={{ marginBottom: '8px' }}>
              <img
                src="/images/rudu_logo.png"
                alt="Rudu Dairy"
                style={{ height: '48px', width: 'auto', objectFit: 'contain' }}
              />
            </div>

            <p style={{ fontSize: '11.5px', fontWeight: '800', color: '#64748B', letterSpacing: '0.8px', textTransform: 'uppercase', margin: '2px 0 0 0' }}>
              Smart Dairy Management
            </p>

            {/* Portal Pill Badge */}
            <div style={{ marginTop: '12px', display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '5px 14px', borderRadius: '20px', backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0', fontSize: '12px', fontWeight: '800', color: '#1B4D2E' }}>
              {isFarmer && <User size={14} color="#16A34A" />}
              {isAdmin && <ShieldAlert size={14} color="#9333EA" />}
              {isOperator && <Users size={14} color="#D97706" />}
              <span>
                {isFarmer ? '🌾 Farmer Portal Login' : (isAdmin ? '👑 Admin Management Console' : '🧑‍🌾 BMC Operator Terminal')}
              </span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            
            {/* Identifier field */}
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: '#334155', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '6px' }}>
                {isAdmin ? 'Admin Email / Username' : (isOperator ? 'Operator ID / Phone' : 'Mobile Number / Farmer ID')}
              </label>
              <div style={{ position: 'relative', width: '100%' }}>
                <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8', display: 'flex', alignItems: 'center', pointerEvents: 'none' }}>
                  <Phone size={17} />
                </div>
                <input
                  type="text"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  placeholder={isAdmin ? 'admin@rududairy.com' : (isOperator ? 'e.g. OP-101' : 'Enter 10-digit mobile number')}
                  required
                  style={{ width: '100%', height: '50px', boxSizing: 'border-box', padding: '0 16px 0 44px', backgroundColor: '#F8FAF9', border: '1.5px solid #E2E8F0', borderRadius: '14px', fontSize: '14px', fontWeight: '600', color: '#0F172A', outline: 'none', transition: 'all 0.2s ease' }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = '#1B4D2E'; e.currentTarget.style.backgroundColor = '#ffffff'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(27, 77, 46, 0.12)'; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.backgroundColor = '#F8FAF9'; e.currentTarget.style.boxShadow = 'none'; }}
                />
              </div>
            </div>

            {/* Password field */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontSize: '11px', fontWeight: '800', color: '#334155', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                  {isAdmin ? 'Admin Password' : (isOperator ? 'Security PIN' : 'Passcode / PIN')}
                </label>
                <button
                  type="button"
                  onClick={() => alert('Please contact your dairy center administrator or operator to reset your passcode.')}
                  style={{ fontSize: '11.5px', fontWeight: '700', color: '#16A34A', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                >
                  Forgot?
                </button>
              </div>
              <div style={{ position: 'relative', width: '100%' }}>
                <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8', display: 'flex', alignItems: 'center', pointerEvents: 'none' }}>
                  <Lock size={17} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isAdmin ? 'Enter password' : (isOperator ? 'Enter 4-digit PIN' : 'Enter passcode')}
                  required
                  style={{ width: '100%', height: '50px', boxSizing: 'border-box', padding: '0 46px 0 44px', backgroundColor: '#F8FAF9', border: '1.5px solid #E2E8F0', borderRadius: '14px', fontSize: '14px', fontWeight: '600', color: '#0F172A', outline: 'none', transition: 'all 0.2s ease' }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = '#1B4D2E'; e.currentTarget.style.backgroundColor = '#ffffff'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(27, 77, 46, 0.12)'; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.backgroundColor = '#F8FAF9'; e.currentTarget.style.boxShadow = 'none'; }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px' }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {loginError && (
              <div style={{ padding: '12px 14px', backgroundColor: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '12px', fontSize: '12px', fontWeight: '700', color: '#B91C1C', lineHeight: '1.4' }}>
                ⚠️ {loginError}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              style={{ width: '100%', height: '52px', boxSizing: 'border-box', backgroundColor: '#1B4D2E', color: '#ffffff', borderRadius: '14px', fontSize: '15px', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', border: 'none', cursor: isSubmitting ? 'not-allowed' : 'pointer', boxShadow: '0 8px 24px rgba(27, 77, 46, 0.3)', marginTop: '4px', transition: 'all 0.2s ease' }}
              onMouseEnter={(e) => { if (!isSubmitting) e.currentTarget.style.backgroundColor = '#164627'; }}
              onMouseLeave={(e) => { if (!isSubmitting) e.currentTarget.style.backgroundColor = '#1B4D2E'; }}
            >
              {isSubmitting ? (
                <span>Authenticating with Database...</span>
              ) : (
                <>
                  <span>Sign In to {isFarmer ? 'Farmer Portal' : (isAdmin ? 'Admin Console' : 'Operator Portal')}</span>
                  <ArrowRight size={17} />
                </>
              )}
            </button>
          </form>

          {/* Security note / clean footer */}
        </div>

        {/* Card Footer info */}
        <div style={{ marginTop: '16px', textAlign: 'center' }}>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.85)', fontWeight: '500', margin: 0 }}>
            New to Rudu Dairy?{' '}
            <span style={{ fontWeight: '700', color: '#ffffff', cursor: 'pointer', textDecoration: 'underline' }}>
              Contact your local center operator.
            </span>
          </p>
          <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', fontWeight: '600', margin: '4px 0 0 0' }}>
            Rudu Farm Dairy Management System · v1.0.0
          </p>
        </div>
      </div>

      {/* OTP SMS Modal */}
      {otpModalOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 60, backgroundColor: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', padding: '24px', width: '100%', maxWidth: '360px', boxShadow: '0 20px 40px rgba(0,0,0,0.3)', border: '1px solid #E2E8F0' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '900', color: '#1B4D2E', margin: '0 0 4px 0' }}>Login with OTP</h3>
            <p style={{ fontSize: '12px', color: '#64748B', margin: '0 0 16px 0', lineHeight: '1.4' }}>Enter your registered mobile number to receive a secure SMS OTP.</p>

            {!otpSent ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <input
                  type="tel"
                  value={otpPhone}
                  onChange={(e) => setOtpPhone(e.target.value)}
                  placeholder="Enter 10-digit Mobile Number"
                  style={{ width: '100%', height: '48px', boxSizing: 'border-box', padding: '0 14px', border: '1.5px solid #E2E8F0', borderRadius: '12px', fontSize: '14px', fontWeight: '600', outline: 'none' }}
                />
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setOtpModalOpen(false)}
                    style={{ flex: 1, height: '42px', borderRadius: '12px', border: '1px solid #E2E8F0', backgroundColor: '#F8FAF9', fontSize: '12.5px', fontWeight: '700', color: '#475569', cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (otpPhone.length >= 10) setOtpSent(true);
                    }}
                    style={{ flex: 1, height: '42px', borderRadius: '12px', border: 'none', backgroundColor: '#1B4D2E', color: '#ffffff', fontSize: '12.5px', fontWeight: '800', cursor: 'pointer', boxShadow: '0 4px 12px rgba(27,77,46,0.3)' }}
                  >
                    Send OTP SMS
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ padding: '10px 12px', backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '10px', fontSize: '12px', fontWeight: '700', color: '#166534' }}>
                  OTP sent to +91 {otpPhone}. Check your phone SMS.
                </div>
                <input
                  type="text"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="Enter 6-digit OTP"
                  style={{ width: '100%', height: '48px', boxSizing: 'border-box', textAlign: 'center', letterSpacing: '4px', fontSize: '18px', fontWeight: '900', border: '1.5px solid #E2E8F0', borderRadius: '12px', outline: 'none' }}
                />
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setOtpSent(false)}
                    style={{ flex: 1, height: '42px', borderRadius: '12px', border: '1px solid #E2E8F0', backgroundColor: '#F8FAF9', fontSize: '12.5px', fontWeight: '700', color: '#475569', cursor: 'pointer' }}
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      setOtpModalOpen(false);
                      await login(selectedRole, otpPhone, 'demo123');
                    }}
                    style={{ flex: 1, height: '42px', borderRadius: '12px', border: 'none', backgroundColor: '#1B4D2E', color: '#ffffff', fontSize: '12.5px', fontWeight: '800', cursor: 'pointer', boxShadow: '0 4px 12px rgba(27,77,46,0.3)' }}
                  >
                    Verify & Login
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
