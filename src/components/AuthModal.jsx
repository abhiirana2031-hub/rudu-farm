import React, { useState, useEffect } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase/client';
import { useFarm } from '../context/FarmContext';
import { 
  Mail, Lock, User, Eye, EyeOff,
  ShieldCheck, UserCheck, HeartHandshake,
  ArrowRight, X, Sparkles, CheckCircle2,
  Smartphone, MapPin, Droplets, CreditCard
} from 'lucide-react';
import { RuduLogo } from './RuduLogo';

/* ── TOP-LEVEL STABLE INPUT FIELD ── */
const Field = ({ icon, ...props }) => {
  const inputRef = React.useRef(null);
  return (
    <div className="auth-input-wrapper" onClick={() => inputRef.current?.focus()}>
      {React.cloneElement(icon, { size: 16, className: 'input-icon' })}
      <input ref={inputRef} {...props} />
    </div>
  );
};

export const AuthModal = () => {
  const { currentUser, isAuthModalOpen, setIsAuthModalOpen, loginUser, currentRole, setCurrentRole, sessionConfig, startSession } = useFarm();
  const [activeTab, setActiveTab] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [selectedRole, setSelectedRole] = useState('admin');
  const [rememberMe, setRememberMe] = useState(true);

  // Farmer registration multi-step
  const [signupStep, setSignupStep] = useState(1);
  const [cattleType, setCattleType] = useState('cow');
  const [dailyCapacity, setDailyCapacity] = useState('15');
  const [memberCategory, setMemberCategory] = useState('gold');
  const [village, setVillage] = useState('Rampur');
  const [bankName, setBankName] = useState('State Bank of India');
  const [accountNumber, setAccountNumber] = useState('50100987654321');
  const [ifsc, setIfsc] = useState('SBIN0001234');
  const [upiId, setUpiId] = useState('ramesh@ybl');

  // Sync selected role when modal opens
  useEffect(() => {
    if (isAuthModalOpen && currentRole) {
      setSelectedRole(currentRole);
      setEmail(''); setPassword(''); setErrorMsg(''); setSignupStep(1);
    }
  }, [currentRole, isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // loginUser will be handled automatically by the FarmContext onAuthStateChanged listener
      setIsAuthModalOpen(false);
    } catch (error) {
      if (error.code === 'auth/invalid-credential') {
        setErrorMsg('Invalid email or password.');
      } else {
        setErrorMsg('Error: ' + error.message);
      }
    }
  };

  const handleSignUpSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!fullName || !email || !password) { setErrorMsg('Please fill all required fields.'); return; }
    setErrorMsg('');
    loginUser({
      name: fullName,
      email: email.includes('@') ? email : `${email}@rudufarm.com`,
      role: selectedRole,
      village: selectedRole === 'farmer' ? village : undefined,
    });
  };

  const handleQuickDemo = (role) => {
    // Disabled
  };

  const roleConfig = {
    farmer:   { placeholder: 'Farmer ID or Mobile (e.g. RF1024)', btn: 'Access Passbook',      demo: 'Farmer Login' },
    employee: { placeholder: 'Operator Email or Agent ID',         btn: 'Open Agent Hub',        demo: 'Operator Login' },
    admin:    { placeholder: 'Administrator Email',                 btn: 'Sign In to Admin',      demo: 'Admin Login' },
  };
  const rc = roleConfig[selectedRole] || roleConfig.admin;

  const roles = [
    { key: 'admin',    label: 'Admin',    icon: <ShieldCheck size={12} /> },
    { key: 'employee', label: 'Operator', icon: <UserCheck size={12} /> },
    { key: 'farmer',   label: 'Farmer',   icon: <HeartHandshake size={12} /> },
  ];



  return (
    <div className="auth-modal-overlay">
      <div className="auth-modal-card auth-modal-card-illustrated" style={{ maxWidth: '420px' }}>

        {/* ── CLOSE ── */}
        <button className="auth-modal-close" onClick={() => setIsAuthModalOpen(false)}>
          <X size={15} />
        </button>

        {/* ── HEADER ── */}
        <div className="auth-modal-header" style={{ padding: '20px 20px 12px', background: 'transparent', borderBottom: 'none' }}>
          {/* Brand row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <RuduLogo height={30} />
            <div>
              <div style={{ fontSize: '17px', fontWeight: '900', color: '#fff', letterSpacing: '-0.3px', lineHeight: 1.1, textShadow: '0 2px 4px rgba(0,0,0,0.7)' }}>Rudu Farm</div>
              <div style={{ fontSize: '11.5px', color: '#F6E05E', fontWeight: '800', textShadow: '0 1px 3px rgba(0,0,0,0.7)' }}>Farmer Passbook & Member Portal</div>
            </div>
          </div>
        </div>

        {/* ── ERROR ── */}
        {errorMsg && (
          <div style={{ margin: '10px 16px 0', padding: '8px 14px', background: 'rgba(255, 235, 235, 0.95)', border: '1.5px solid #E53E3E', borderRadius: '12px', fontSize: '12px', color: '#9B2C2C', fontWeight: '800', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
            {errorMsg}
          </div>
        )}

        {/* ══════════════════════════════ FARMER SIGN IN ══════════════════════════════ */}
        <div style={{ padding: '16px 18px', background: 'transparent' }}>
          <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Field icon={<Mail />} type="text" placeholder="Farmer ID or Mobile (e.g. RF1024)" value={email} onChange={e => setEmail(e.target.value)} />
            <div className="auth-input-wrapper">
              <Lock size={15} className="input-icon" />
              <input type={showPassword ? 'text' : 'password'} placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
              <button type="button" className="password-toggle-btn" onClick={() => setShowPassword(v => !v)}>
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>

            {/* Remember + Forgot */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#ffffff', fontWeight: '800', cursor: 'pointer', textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>
                <input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} style={{ accentColor: '#2E7D32' }} />
                Remember me
              </label>
              <a href="#forgot" onClick={e => { e.preventDefault(); alert('Reset link sent to your registered device.'); }} style={{ fontSize: '12px', color: '#F6E05E', fontWeight: '900', textDecoration: 'none', textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>
                Forgot?
              </a>
            </div>

            <button type="submit" className="auth-submit-btn" style={{ width: '100%', padding: '12px', borderRadius: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '4px' }}>
              <span style={{ fontSize: '13.5px', fontWeight: '900' }}>Access Farmer Passbook</span>
              <ArrowRight size={15} />
            </button>
          </form>



          {/* Trust line */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', marginTop: '12px', fontSize: '11px', color: 'rgba(255,255,255,0.95)', fontWeight: '700', textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>
            <CheckCircle2 size={12} style={{ color: '#48BB78' }} />
            <span>Secured by Rudu Farm SSL</span>
          </div>
        </div>
      </div>
    </div>
  );
};
