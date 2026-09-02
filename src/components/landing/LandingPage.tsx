import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { RuduLogo } from '../RuduLogo';
import { BUSINESS } from '../../config/business';
import { MetaTags } from '../seo/MetaTags';
import { JsonLd } from '../seo/JsonLd';
import {
  getOrganizationSchema,
  getLocalBusinessSchema,
  getWebSiteSchema,
  getFaqSchema,
  getSoftwareApplicationSchema,
} from '../../lib/structuredData';
import { 
  Milk, 
  Users, 
  UserCheck, 
  Sliders, 
  CreditCard, 
  BookOpen, 
  ShieldCheck, 
  User, 
  MapPin, 
  Droplets, 
  CheckCircle, 
  CheckCircle2,
  Lock, 
  ArrowRight, 
  Sparkles, 
  Phone, 
  Mail, 
  Star, 
  ChevronRight, 
  Menu, 
  X, 
  Heart, 
  ArrowUp, 
  Camera, 
  Send, 
  Leaf, 
  Award, 
  Briefcase, 
  ChevronDown, 
  ChevronUp, 
  Building2,
  Target,
  Eye,
  Upload,
  HelpCircle,
  FlaskConical
} from 'lucide-react';

const Facebook = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const Twitter = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const Instagram = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const Youtube = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" />
  </svg>
);

const Linkedin = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

// Animated Counter Component
const AnimatedCounter = ({ target, suffix = '', duration = 2000 }: { target: number; suffix?: string; duration?: number }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const startTime = performance.now();
          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
};

interface LandingPageProps {
  onOpenLogin?: (role?: 'farmer' | 'admin' | 'employee') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenLogin }) => {
  const { farmers, milkEntries } = useApp();

  const totalHappyFarmers = farmers.length;
  const totalVillages = new Set(farmers.map((f) => f.village).filter(Boolean)).size;
  const totalDailyVolume = Math.round(milkEntries.reduce((sum, e) => sum + (Number(e.quantityLiters) || 0), 0) * 10) / 10;

  const [activeProductTab, setActiveProductTab] = useState<'milk' | 'ghee' | 'curd' | 'paneer' | 'butter'>('milk');
  const [activeSection, setActiveSection] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);
  
  // Quick Order Modal States
  const [quickOrderProduct, setQuickOrderProduct] = useState<any>(null);
  const [selectedPackSize, setSelectedPackSize] = useState('1 L');
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [orderConfirmed, setOrderConfirmed] = useState(false);

  // About Us States
  const [aboutSubTab, setAboutSubTab] = useState<'story' | 'mission' | 'team' | 'infrastructure' | 'certifications'>('story');

  // Blog States
  const [blogCategory, setBlogCategory] = useState('All');
  const [selectedArticle, setSelectedArticle] = useState<any>(null);

  // FAQ States
  const [faqCategory, setFaqCategory] = useState('General');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Career States
  const [showCareersSection, setShowCareersSection] = useState(false);
  const [showAboutUs, setShowAboutUs] = useState(false);
  const [isCareerModalOpen, setIsCareerModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [careerFormData, setCareerFormData] = useState({ name: '', email: '', phone: '', cover: '', resumeName: '' });
  const [careerSubmitted, setCareerSubmitted] = useState(false);

  // Proof Slideshow State
  const [proofSlide, setProofSlide] = useState(0);
  const proofTotalSlides = 3;

  // Auto-advance proof slideshow
  useEffect(() => {
    const timer = setInterval(() => {
      setProofSlide(prev => (prev + 1) % proofTotalSlides);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 180;
      setShowBackToTop(window.scrollY > 400);

      const productsEl = document.getElementById('products');
      const purityEl = document.getElementById('purity');
      const processEl = document.getElementById('process');

      if (productsEl && purityEl && scrollPos >= productsEl.offsetTop && scrollPos < purityEl.offsetTop) {
        setActiveSection('products');
      } else if (purityEl && processEl && scrollPos >= purityEl.offsetTop && scrollPos < processEl.offsetTop) {
        setActiveSection('purity');
      } else if (processEl && scrollPos >= processEl.offsetTop) {
        setActiveSection('process');
      } else {
        setActiveSection('home');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSubmitted(true);
      setNewsletterEmail('');
      setTimeout(() => setNewsletterSubmitted(false), 4000);
    }
  };

  const handleCareerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCareerSubmitted(true);
  };

  const handleConfirmQuickOrder = () => {
    setOrderConfirmed(true);
  };

  const handleLogin = (role: 'farmer' | 'admin' | 'employee' = 'farmer') => {
    setIsMobileMenuOpen(false);
    if (onOpenLogin) {
      onOpenLogin(role);
    } else {
      window.location.href = role === 'admin' ? '/admin' : (role === 'employee' ? '/operator' : '/');
    }
  };

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const productsData = {
    milk: [
      { name: "Premium Full Cream Milk", desc: "Rich in cream, pasteurized fresh milk ideal for children and traditional sweets.", price: "₹66/L", tag: "Best Seller", rating: 5, img: "/images/rudu_milk_product.png" },
      { name: "Standardized Fresh Milk", desc: "Balanced cream content for everyday tea, coffee, and home cooking requirements.", price: "₹60/L", tag: "Daily Essential", rating: 5, img: "/images/rudu_milk_product.png" },
      { name: "Toned Slim Milk", desc: "Homogenized low-fat milk packed with vitamins, perfect for health-conscious individuals.", price: "₹52/L", tag: "Slim Fit", rating: 4.8, img: "/images/rudu_milk_product.png" },
      { name: "A2 Organic Cow Milk", desc: "Pure A2 protein cow milk sourced directly from indigenous desi cows.", price: "₹78/L", tag: "A2 Pure", rating: 5, img: "/images/rudu_milk_product.png" }
    ],
    ghee: [
      { name: "Danedar Cow Ghee", desc: "Traditional slow-cooked ghee with grainy texture, golden color, and heavenly aroma.", price: "₹680/L", tag: "GC Tested Pure", rating: 5, img: "/images/fresh_dairy_products.png" },
      { name: "Premium Desi Ghee", desc: "Pure buffalo milk ghee, aromatic, perfect for cooking, sweets, and parathas.", price: "₹740/L", tag: "Rich Aroma", rating: 5, img: "/images/fresh_dairy_products.png" },
      { name: "A2 Bilona Vedic Ghee", desc: "Hand-churned A2 cow ghee prepared using traditional wooden bilona process.", price: "₹1,250/L", tag: "Vedic Bilona", rating: 5, img: "/images/fresh_dairy_products.png" },
      { name: "Pure Country Ghee", desc: "Traditional village farm ghee with rich golden granulates and pure taste.", price: "₹620/L", tag: "Farm Fresh", rating: 4.9, img: "/images/fresh_dairy_products.png" }
    ],
    curd: [
      { name: "Thick Creamy Dahi", desc: "Naturally set dahi with mild sour flavor and rich thick consistency, set in hygiene cups.", price: "₹30/cup", tag: "Gut Health", rating: 4.9, img: "/images/fresh_dairy_products.png" },
      { name: "Fresh Sweet Lassi", desc: "Rich churned sweet buttermilk flavored with cardamom and saffron, served chilled.", price: "₹25/bottle", tag: "Refreshing", rating: 4.8, img: "/images/fresh_dairy_products.png" },
      { name: "Masala Spiced Chaach", desc: "Refreshing spiced buttermilk infused with roasted cumin, mint, and black salt.", price: "₹18/pack", tag: "Digestive", rating: 4.8, img: "/images/fresh_dairy_products.png" },
      { name: "Greek Style Hung Curd", desc: "Ultra-thick strained probiotic dahi packed with natural proteins.", price: "₹45/cup", tag: "High Protein", rating: 4.9, img: "/images/fresh_dairy_products.png" }
    ],
    paneer: [
      { name: "Soft Malai Paneer", desc: "Deliciously soft paneer cubes made from pure full cream milk, packed touch-free.", price: "₹110/200g", tag: "Protein Rich", rating: 5, img: "/images/fresh_dairy_products.png" },
      { name: "Organic Cottage Paneer", desc: "Hand-crafted fresh cottage paneer made with organic cow milk.", price: "₹120/200g", tag: "Farm Organic", rating: 4.9, img: "/images/fresh_dairy_products.png" },
      { name: "Low Fat Protein Paneer", desc: "Homogenized low-calorie paneer specially made for fitness lovers.", price: "₹105/200g", tag: "Slim Fit", rating: 4.8, img: "/images/fresh_dairy_products.png" },
      { name: "Herb Spiced Masala Paneer", desc: "Soft paneer cubes seasoned with natural green herbs and aromatic spices.", price: "₹130/200g", tag: "Gourmet", rating: 5, img: "/images/fresh_dairy_products.png" }
    ],
    butter: [
      { name: "Fresh White Butter", desc: "Traditional unsalted white butter churned from pure fresh cream.", price: "₹140/200g", tag: "Country Style", rating: 4.9, img: "/images/fresh_dairy_products.png" },
      { name: "Pasteurized Salted Butter", desc: "Rich and creamy table butter, perfect for spreading on toasted bread.", price: "₹260/500g", tag: "Breakfast Fav", rating: 4.8, img: "/images/fresh_dairy_products.png" },
      { name: "Unsalted Cooking Butter", desc: "Pure churned cream butter ideal for baking, cooking, and frying.", price: "₹240/500g", tag: "Baking Essential", rating: 4.9, img: "/images/fresh_dairy_products.png" },
      { name: "Heavy Whipping Cream", desc: "Fresh 30% fat rich dairy cream for desserts, coffee, and rich gravies.", price: "₹90/200ml", tag: "Rich Cream", rating: 5, img: "/images/fresh_dairy_products.png" }
    ]
  };

  return (
    <div className="landing-page-container">

      {/* Dynamic SEO Meta Tags & Schema.org Structured Data */}
      <MetaTags path="/" />
      <JsonLd
        data={[
          getOrganizationSchema(),
          getLocalBusinessSchema(),
          getWebSiteSchema(),
          getFaqSchema(),
          getSoftwareApplicationSchema(),
        ]}
      />

      {/* 1. Header Navigation */}
      <header className="landing-header">
        <div className="landing-header-content">
          <div className="landing-logo" onClick={() => { setIsMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
            <RuduLogo height={45} />
          </div>
          
          <nav className={`landing-nav ${isMobileMenuOpen ? 'open' : ''}`}>
            <button onClick={() => { setIsMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className={`nav-link ${activeSection === 'home' ? 'active' : ''}`}>Home</button>
            <button onClick={() => scrollToSection('products')} className={`nav-link ${activeSection === 'products' ? 'active' : ''}`}>
              Our Products <span style={{ fontSize: '11px', marginLeft: '4px', opacity: 0.8 }}>▼</span>
            </button>
            <button onClick={() => scrollToSection('purity')} className={`nav-link ${activeSection === 'purity' ? 'active' : ''}`}>Purity</button>
            <button onClick={() => scrollToSection('process')} className={`nav-link ${activeSection === 'process' ? 'active' : ''}`}>Journey</button>
            <button onClick={() => scrollToSection('about')} className={`nav-link ${activeSection === 'about' ? 'active' : ''}`}>About Us</button>
            <button onClick={() => scrollToSection('why-us')} className={`nav-link ${activeSection === 'why-us' ? 'active' : ''}`}>Why Choose Us</button>
            <button onClick={() => scrollToSection('faq')} className={`nav-link ${activeSection === 'faq' ? 'active' : ''}`}>FAQ</button>
            <button onClick={() => { setShowCareersSection(true); setIsMobileMenuOpen(false); setTimeout(() => scrollToSection('careers'), 100); }} className={`nav-link ${activeSection === 'careers' ? 'active' : ''}`}>Careers</button>
            <button onClick={() => handleLogin('farmer')} className="btn-landing-login mobile-login-item">
              <User size={15} />
              <span>Farmer Login</span>
            </button>
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button 
              onClick={() => handleLogin('farmer')} 
              className="mobile-header-farmer-btn"
              title="Farmer Portal Login"
              aria-label="Farmer Login"
            >
              <User size={18} />
            </button>

            <button 
              className="mobile-menu-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Wavy Bottom Border */}
        <div className="header-wave-border">
          <svg viewBox="0 0 1440 40" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <path d="M0 0 L1440 0 L1440 15 C1300 35, 1100 -5, 900 25 C700 45, 500 -10, 300 30 C150 40, 50 25, 0 15 Z" fill="#ffffff" />
          </svg>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative w-full overflow-hidden bg-[#FAF8F5] min-h-[85vh] flex items-center">
        {/* Photo Container Layer - Positioned Strictly on the Right 50% */}
        <div className="absolute inset-y-0 right-0 w-full lg:w-[50%] z-0 overflow-hidden rounded-b-2xl sm:rounded-b-3xl lg:rounded-bl-[2.5rem]">
          <img 
            src="/images/my_photo.jpg" 
            alt="Rudu Dairy Founder & Cow"
            className="w-full h-full object-cover object-[15%_top] rounded-b-2xl sm:rounded-b-3xl lg:rounded-bl-[2.5rem]"
          />
          {/* Subtle blend gradient on the left edge of the photo */}
          <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#FAF8F5] to-transparent z-10 pointer-events-none" />

          {/* Upper Center Overlay Text on the Image - No Card, Pure Luxury Typography */}
          <div className="absolute top-4 sm:top-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none text-center whitespace-nowrap px-4">
            <div className="inline-flex flex-col items-center justify-center">
              <div className="flex items-center gap-2 sm:gap-2.5 text-red-600 text-[10px] sm:text-xs font-bold tracking-[0.25em] sm:tracking-[0.3em] uppercase mb-0.5">
                <span className="w-4 sm:w-7 h-[1.5px] bg-gradient-to-r from-transparent to-red-600 rounded-full"></span>
                <Sparkles size={13} className="text-red-600" />
                <span>Welcome To</span>
                <Sparkles size={13} className="text-red-600" />
                <span className="w-4 sm:w-7 h-[1.5px] bg-gradient-to-l from-transparent to-red-600 rounded-full"></span>
              </div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-wider text-gray-900 drop-shadow-[0_2px_4px_rgba(255,255,255,0.9)]">
                RUDU DAIRY
              </h2>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 w-full relative z-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 flex flex-col justify-center -mt-[170px]">
              
              {/* Big Bold Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-gray-900 mb-5">
                <span className="block text-gray-900">Pure Milk.</span>
                <span className="block text-emerald-800">Trusted by</span>
                <span className="block text-red-600">Every Home.</span>
              </h1>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 mb-8 sm:mb-10 translate-y-[300px] translate-x-[20px]">
                <button 
                  onClick={() => scrollToSection('products')} 
                  className="bg-red-600 hover:bg-red-700 text-white font-bold text-base px-7 py-3.5 rounded-full shadow-lg shadow-red-600/20 hover:shadow-xl hover:shadow-red-600/30 transition-all duration-300 flex items-center gap-2.5"
                >
                  <Sliders size={18} />
                  <span>Our Services</span>
                </button>
                <button 
                  onClick={() => handleLogin('farmer')} 
                  className="bg-white hover:bg-gray-50 text-gray-800 border-2 border-gray-200 hover:border-gray-300 font-bold text-base px-7 py-3.5 rounded-full shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-2.5"
                >
                  <Users size={18} className="text-gray-600" />
                  <span>Partner With Us</span>
                </button>
              </div>

              {/* Bottom Feature Pill Bar Card (Hidden on Mobile) */}
              <div className="hidden sm:block bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-red-100/60 shadow-xl shadow-red-950/5 max-w-xl">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Feature 1 */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-red-50 border border-red-200 flex items-center justify-center flex-shrink-0 text-red-600 shadow-sm">
                      <ShieldCheck size={20} />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-gray-900 leading-snug">
                        100% Transparent
                      </h4>
                      <p className="text-[11px] text-gray-500 font-medium">Milk Collection</p>
                    </div>
                  </div>

                  {/* Feature 2 */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-red-50 border border-red-200 flex items-center justify-center flex-shrink-0 text-red-600 shadow-sm">
                      <Heart size={20} />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-gray-900 leading-snug">
                        Love & Care
                      </h4>
                      <p className="text-[11px] text-gray-500 font-medium">for Animals</p>
                    </div>
                  </div>

                  {/* Feature 3 */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-red-50 border border-red-200 flex items-center justify-center flex-shrink-0 text-red-600 shadow-sm">
                      <Users size={20} />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-gray-900 leading-snug">
                        Empowering
                      </h4>
                      <p className="text-[11px] text-gray-500 font-medium">Rural Farmers</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: Clean space for background photo to showcase clearly on desktop & mobile */}
            <div className="lg:col-span-5 hidden lg:block" />

          </div>
        </div>
      </section>

      {/* 4. Products Tabbed Catalog */}
      <section id="products" className="products-catalog-section">
        <div className="catalog-container">
          <div className="landing-section-header">
            <span className="section-tagline">Fresh Offerings</span>
            <h2 className="section-main-title">Our Premium Dairy Range</h2>
            <p className="section-desc">Explore our range of organic, nutrition-rich, and pure dairy products crafted for your healthy lifestyle.</p>
          </div>

          {/* Product Tabs */}
          <div className="catalog-tabs-container">
            <button 
              className={`catalog-tab-btn ${activeProductTab === 'milk' ? 'active' : ''}`}
              onClick={() => setActiveProductTab('milk')}
            >
              <Milk size={16} />
              <span>Milk</span>
            </button>
            <button 
              className={`catalog-tab-btn ${activeProductTab === 'ghee' ? 'active' : ''}`}
              onClick={() => setActiveProductTab('ghee')}
            >
              <Sparkles size={16} />
              <span>Desi Ghee</span>
            </button>
            <button 
              className={`catalog-tab-btn ${activeProductTab === 'curd' ? 'active' : ''}`}
              onClick={() => setActiveProductTab('curd')}
            >
              <Droplets size={16} />
              <span>Dahi & Curd</span>
            </button>
            <button 
              className={`catalog-tab-btn ${activeProductTab === 'paneer' ? 'active' : ''}`}
              onClick={() => setActiveProductTab('paneer')}
            >
              <Users size={16} />
              <span>Paneer</span>
            </button>
            <button 
              className={`catalog-tab-btn ${activeProductTab === 'butter' ? 'active' : ''}`}
              onClick={() => setActiveProductTab('butter')}
            >
              <Sparkles size={16} />
              <span>Butter & Cream</span>
            </button>
          </div>

          {/* Tab Content Products Grid */}
          <div className="products-grid">
            {productsData[activeProductTab].map((prod, idx) => (
              <div className="product-card" key={idx}>
                <div className="product-img-box">
                  <span className="product-badge">{prod.tag}</span>
                  <img src={prod.img} alt={prod.name} className="product-img" />
                </div>
                <div className="product-info-box">
                  <div className="product-meta-row">
                    <span className="product-type">{activeProductTab}</span>
                    <div className="product-rating">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={14} fill={i < Math.floor(prod.rating) ? "currentColor" : "none"} />
                      ))}
                    </div>
                  </div>
                  <h3 className="product-title">{prod.name}</h3>
                  <p className="product-desc">{prod.desc}</p>
                  
                  <div className="product-action-row">
                    <div className="product-pricing">
                      <span className="price-label">Price Range</span>
                      <span className="price-value">{prod.price}</span>
                    </div>
                    <button className="product-btn" onClick={() => { setQuickOrderProduct(prod); setSelectedPackSize('1 L'); setOrderQuantity(1); setOrderConfirmed(false); }}>
                      <span>Order Fresh</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Production Process Flow (Journey) */}
      <section id="process" className="process-flow-section">
        <div className="process-container">
          <div className="landing-section-header">
            <span className="section-tagline">Trace the Purity</span>
            <h2 className="section-main-title">The Path of Pure Milk</h2>
            <p className="section-desc">We track every droplet from cattle collection centers to hygienic packing plants, assuring absolute quality.</p>
          </div>

          <div className="process-flow-row">
            <div className="process-step-node">
              <div className="process-icon-box">
                <span className="process-step-num">1</span>
                <Milk size={30} />
              </div>
              <h4>Village Sourcing</h4>
              <p>Farmers bring fresh milk daily to computerized booths, checking Fat, SNF, and volume instant receipt slips.</p>
            </div>

            <div className="process-step-node">
              <div className="process-icon-box">
                <span className="process-step-num">2</span>
                <ShieldCheck size={30} />
              </div>
              <h4>Cold Chain Chilling</h4>
              <p>Milk is tested for premium quality grades and immediately cooled to 4°C to preserve natural vitamins.</p>
            </div>

            <div className="process-step-node">
              <div className="process-icon-box">
                <span className="process-step-num">3</span>
                <Sliders size={30} />
              </div>
              <h4>Automated Pasteurization</h4>
              <p>Processed touch-free using state-of-the-art homogenization and pasteurization for consistent purity.</p>
            </div>

            <div className="process-step-node">
              <div className="process-icon-box">
                <span className="process-step-num">4</span>
                <UserCheck size={30} />
              </div>
              <h4>Aromatic Delivery</h4>
              <p>Sealed in packets and jars, delivered fresh daily in temperature-controlled transport to households.</p>
            </div>
          </div>
        </div>
      </section>
      {/* Mobile 3-Block Stats (White Cards) */}
      <section className="block md:hidden py-8 px-4 bg-gradient-to-b from-[#fdfbf7] to-[#f4eee4]">
        <div className="grid grid-cols-3 gap-2 sm:gap-4 max-w-md mx-auto">
          <div className="bg-white rounded-[16px] p-3 sm:p-4 shadow-sm border-b-4 border-red-700 text-center flex flex-col justify-center items-center">
            <div className="text-xl sm:text-2xl font-black text-slate-800 mb-1 tracking-tight">
              <AnimatedCounter target={totalHappyFarmers > 0 ? totalHappyFarmers : 0} suffix="+" />
            </div>
            <div className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-wide leading-tight">Total<br/>Farmers</div>
          </div>

          <div className="bg-white rounded-[16px] p-3 sm:p-4 shadow-sm border-b-4 border-amber-400 text-center flex flex-col justify-center items-center">
            <div className="text-xl sm:text-2xl font-black text-slate-800 mb-1 tracking-tight">
              <AnimatedCounter target={99} suffix=".9%" />
            </div>
            <div className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-wide leading-tight">Testing<br/>Precision</div>
          </div>

          <div className="bg-white rounded-[16px] p-3 sm:p-4 shadow-sm border-b-4 border-emerald-600 text-center flex flex-col justify-center items-center">
            <div className="text-xl sm:text-2xl font-black text-slate-800 mb-1 tracking-tight">
              <AnimatedCounter target={totalDailyVolume > 0 ? Math.round(totalDailyVolume) : 0} suffix="L" />
            </div>
            <div className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-wide leading-tight">Volume<br/>Logged</div>
          </div>
        </div>
      </section>
      {/* Why Farmers Choose Rudu — Ultra Premium Section (Mobile) */}
      <section className="block md:hidden relative overflow-hidden" style={{ background: 'linear-gradient(155deg, #450a0a 0%, #991b1b 40%, #b91c1c 70%, #7f1d1d 100%)', borderTopLeftRadius: '52px', borderBottomRightRadius: '52px', margin: '0 0' }}>

        {/* Decorative SVG dot-grid pattern */}
        <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.07, pointerEvents: 'none' }} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.5" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>

        {/* Glowing orbs */}
        <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '280px', height: '280px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.10) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-60px', left: '-60px', width: '220px', height: '220px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,100,100,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', padding: '40px 20px 44px' }}>

          {/* Section Label */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '14px' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.22)', borderRadius: '100px', padding: '5px 16px', fontSize: '10px', fontWeight: 800, letterSpacing: '0.12em', color: '#fecaca', textTransform: 'uppercase' }}>
              <Sparkles size={10} /> Why Choose Us
            </span>
          </div>

          {/* Heading */}
          <h2 style={{ fontSize: '28px', fontWeight: 900, color: '#ffffff', textAlign: 'center', lineHeight: 1.12, letterSpacing: '-0.03em', marginBottom: '8px', textShadow: '0 2px 20px rgba(0,0,0,0.3)' }}>
            Why Farmers<br />
            <span style={{ background: 'linear-gradient(90deg, #fca5a5, #fde8e8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Choose Rudu</span>
          </h2>
          <p style={{ textAlign: 'center', fontSize: '13px', color: 'rgba(255,255,255,0.55)', marginBottom: '30px', lineHeight: 1.6, letterSpacing: '0.01em' }}>
            Built for farmers. Designed for prosperity.
          </p>

          {/* Feature Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { icon: <Heart size={18} strokeWidth={2.5} />,       num: '01', title: 'Complete Support',      desc: 'From veterinary care to daily payouts, we are always with you.' },
              { icon: <ShieldCheck size={18} strokeWidth={2.5} />,  num: '02', title: 'Assured Purchase',     desc: 'We buy your milk daily at fair, transparent Govt rates.' },
              { icon: <Leaf size={18} strokeWidth={2.5} />,         num: '03', title: 'Cattle Health & Yield', desc: 'Expert guidance to improve cattle health and boost yield.' },
              { icon: <Award size={18} strokeWidth={2.5} />,        num: '04', title: 'Better Earnings',      desc: 'Higher quality milk directly leads to better, timely returns.' },
              { icon: <Users size={18} strokeWidth={2.5} />,        num: '05', title: 'Long-Term Partnership', desc: 'We grow together for a sustainable village ecosystem.' },
            ].map((item, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: '14px',
                background: 'rgba(255,255,255,0.09)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '20px',
                padding: '14px 16px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.10)',
              }}>
                {/* Icon box */}
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <div style={{ width: '50px', height: '50px', borderRadius: '16px', background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', boxShadow: '0 4px 12px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.2)' }}>
                    {item.icon}
                  </div>
                  {/* Number badge */}
                  <div style={{ position: 'absolute', top: '-6px', right: '-6px', width: '18px', height: '18px', borderRadius: '50%', background: '#ffffff', color: '#b91c1c', fontSize: '8px', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 6px rgba(0,0,0,0.2)', letterSpacing: '-0.02em' }}>
                    {item.num}
                  </div>
                </div>

                {/* Text */}
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#ffffff', margin: '0 0 3px', lineHeight: 1.2, letterSpacing: '-0.01em' }}>{item.title}</h4>
                  <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.60)', margin: 0, lineHeight: 1.5 }}>{item.desc}</p>
                </div>

                {/* Check indicator */}
                <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <CheckCircle2 size={12} color="rgba(255,255,255,0.8)" strokeWidth={2.5} />
                </div>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div style={{ margin: '28px 0 22px', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)' }} />

          {/* CTA Button */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button
              onClick={() => handleLogin('farmer')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: '#ffffff', color: '#991b1b', fontWeight: 900, fontSize: '14px', padding: '14px 32px', borderRadius: '100px', border: 'none', cursor: 'pointer', boxShadow: '0 8px 32px rgba(0,0,0,0.25), 0 2px 8px rgba(0,0,0,0.15)', letterSpacing: '0.01em' }}
            >
              <User size={15} />
              Join as Farmer
              <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', background: '#991b1b', borderRadius: '50%' }}>
                <ArrowRight size={12} color="#fff" />
              </span>
            </button>
          </div>

          {/* Trust badge strip */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '20px' }}>
            {['100% Transparent', 'Govt Rates', 'Daily Payouts'].map((t, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', fontWeight: 700, color: 'rgba(255,255,255,0.50)', letterSpacing: '0.03em' }}>
                <CheckCircle size={10} color="rgba(255,255,255,0.50)" strokeWidth={2.5} />
                {t}
              </div>
            ))}
          </div>

        </div>
      </section>
      {/* Brand Story Section */}
      <section className="brand-story-section">
        <div className="brand-story-container">
          <div className="brand-story-content">
            <div className="brand-story-text">
              <span className="section-tagline">Our Story</span>
              <h2 className="section-main-title">Born from Village Roots</h2>
              <p className="brand-story-desc">
                Rudu was founded with a simple yet powerful belief — that every farmer deserves a fair price, 
                and every family deserves pure dairy. Starting from a single village collection booth in Uttar Pradesh, 
                we have grown into a trusted cooperative serving over 15 villages.
              </p>
              <p className="brand-story-desc">
                Our name "Rudu" comes from the local dialect, meaning "pure essence." We use computerized fat testing, 
                GC-verified purity checks, and direct bank payouts to eliminate middlemen and bring complete transparency 
                to dairy farming.
              </p>
              <div className="brand-story-values">
                <div className="brand-value-chip">
                  <Heart size={14} />
                  <span>Farmer First</span>
                </div>
                <div className="brand-value-chip">
                  <Leaf size={14} />
                  <span>100% Natural</span>
                </div>
                <div className="brand-value-chip">
                  <Award size={14} />
                  <span>GC Certified</span>
                </div>
                <div className="brand-value-chip">
                  <ShieldCheck size={14} />
                  <span>Zero Adulteration</span>
                </div>
              </div>
            </div>
            <div className="brand-story-visual">
              <div className="brand-story-img-wrapper">
                <img src="/images/rudu_milk_product.png" alt="Rudu farm fresh milk" className="brand-story-img" />
                <div className="brand-story-badge">
                  <span className="badge-year">Est.</span>
                  <span className="badge-number">2020</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= WHO WE ARE BUTTON + ABOUT US SECTION ================= */}
      {/* Toggle Button */}
      <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 20px 0', background: 'transparent' }}>
        <button
          onClick={() => {
            setShowAboutUs(prev => !prev);
            if (!showAboutUs) setTimeout(() => scrollToSection('about'), 80);
          }}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '10px',
            background: showAboutUs ? '#991b1b' : 'linear-gradient(135deg, #b91c1c, #7f1d1d)',
            color: '#ffffff', fontWeight: 800, fontSize: '15px',
            padding: '14px 32px', borderRadius: '100px', border: 'none',
            cursor: 'pointer',
            boxShadow: showAboutUs ? '0 4px 16px rgba(153,27,27,0.35)' : '0 8px 28px rgba(185,28,28,0.40)',
            letterSpacing: '0.01em', transition: 'all 0.3s ease',
          }}
        >
          <Building2 size={17} />
          {showAboutUs ? 'Hide Details' : 'Who We Are'}
          <span style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: '24px', height: '24px', background: 'rgba(255,255,255,0.2)',
            borderRadius: '50%', transition: 'transform 0.3s ease',
            transform: showAboutUs ? 'rotate(180deg)' : 'rotate(0deg)'
          }}>
            <ChevronDown size={14} color="#fff" strokeWidth={2.5} />
          </span>
        </button>
      </div>

      {/* About Us Section — hidden until button clicked */}
      {showAboutUs && (
      <section id="about" className="about-us-section">
        <div className="about-us-container">
          <div className="landing-section-header">
            <span className="section-tagline">Who We Are</span>
            <h2 className="section-main-title">About Rudu Dairy</h2>
            <p className="section-desc">Pioneering transparent milk collection, modern cold-chain infrastructure, and empowering village dairy farmers across Northern India.</p>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="about-subtabs-row">
            <button className={`about-tab-btn ${aboutSubTab === 'story' ? 'active' : ''}`} onClick={() => setAboutSubTab('story')}>
              <BookOpen size={16} /> <span>Company Story</span>
            </button>
            <button className={`about-tab-btn ${aboutSubTab === 'mission' ? 'active' : ''}`} onClick={() => setAboutSubTab('mission')}>
              <Target size={16} /> <span>Mission & Vision</span>
            </button>
            <button className={`about-tab-btn ${aboutSubTab === 'team' ? 'active' : ''}`} onClick={() => setAboutSubTab('team')}>
              <Users size={16} /> <span>Our Leadership</span>
            </button>
            <button className={`about-tab-btn ${aboutSubTab === 'infrastructure' ? 'active' : ''}`} onClick={() => setAboutSubTab('infrastructure')}>
              <Building2 size={16} /> <span>Infrastructure</span>
            </button>
            <button className={`about-tab-btn ${aboutSubTab === 'certifications' ? 'active' : ''}`} onClick={() => setAboutSubTab('certifications')}>
              <Award size={16} /> <span>Certifications</span>
            </button>
          </div>

          {/* Tab 1: Company Story */}
          {aboutSubTab === 'story' && (
            <div className="about-content-card animated-fade-in">
              <div className="story-grid">
                <div className="story-text-col">
                  <h3>Founded in the Heart of Mathura Dairy Belt</h3>
                  <p>
                    Established in 2018, Rudu Farm was born out of a simple commitment: to eliminate milk weight manipulation, fat testing disputes, and delayed payouts that traditionally plagued rural dairy farmers.
                  </p>
                  <p>
                    By deploying digital Automated Milk Collection Units (AMCUs) directly to village hubs, we created a 100% transparent ecosystem where every drop of milk is tested digitally, weighed accurately, and recorded instantly on cloud servers.
                  </p>
                  <div className="story-highlights-row">
                    <div className="story-highlight-box">
                      <span className="highlight-number">500+</span>
                      <span className="highlight-label">Partner Villages</span>
                    </div>
                    <div className="story-highlight-box">
                      <span className="highlight-number">100%</span>
                      <span className="highlight-label">Automated Payouts</span>
                    </div>
                    <div className="story-highlight-box">
                      <span className="highlight-number">0%</span>
                      <span className="highlight-label">Preservative Added</span>
                    </div>
                  </div>
                </div>
                <div className="story-visual-col">
                  <img src="/images/fresh_dairy_products.png" alt="Rudu Farm Story" className="story-img" />
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Mission & Vision */}
          {aboutSubTab === 'mission' && (
            <div className="about-content-card animated-fade-in">
              <div className="mission-vision-grid">
                <div className="mv-card mission-card">
                  <div className="mv-icon-wrapper"><Target size={28} /></div>
                  <h3>Our Mission</h3>
                  <p>
                    To empower rural dairy farmers with transparent daily milk pricing, zero-error automated banking payouts, and modern veterinary support, while delivering unadulterated, grade-A pure dairy products to every Indian home.
                  </p>
                </div>
                <div className="mv-card vision-card">
                  <div className="mv-icon-wrapper"><Eye size={28} /></div>
                  <h3>Our Vision</h3>
                  <p>
                    To become India's premier tech-driven dairy cooperative—setting gold standards in cold-chain purity, zero-emission logistics, and sustainable indigenous cattle care.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Team */}
          {aboutSubTab === 'team' && (
            <div className="about-content-card animated-fade-in">
              <div className="team-grid">
                <div className="team-card">
                  <div className="team-avatar-box">RV</div>
                  <h4>Rameshwar Verma</h4>
                  <span className="team-role">Founder & Managing Director</span>
                  <p>20+ years of dairy cooperative leadership in Uttar Pradesh. Pioneer of rural digitization.</p>
                </div>
                <div className="team-card">
                  <div className="team-avatar-box">SR</div>
                  <h4>Dr. Sunita Rao</h4>
                  <span className="team-role">Head of Quality & Veterinary Health</span>
                  <p>Ex-NDRI Scientist specializing in cattle nutrition, disease prevention, and A2 protein testing.</p>
                </div>
                <div className="team-card">
                  <div className="team-avatar-box">VS</div>
                  <h4>Vikramaditya Singh</h4>
                  <span className="team-role">Chief Technology Officer</span>
                  <p>Architect of Rudu's AMCU IoT hardware integration and instant farmer payment gateway.</p>
                </div>
                <div className="team-card">
                  <div className="team-avatar-box">PS</div>
                  <h4>Priya Sharma</h4>
                  <span className="team-role">Head of Cold Storage & Logistics</span>
                  <p>Oversees 45+ Bulk Milk Chilling units ensuring continuous 4°C cold-chain maintenance.</p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Infrastructure */}
          {aboutSubTab === 'infrastructure' && (
            <div className="about-content-card animated-fade-in">
              <div className="infra-grid">
                <div className="infra-card">
                  <div className="infra-icon"><Building2 size={24} /></div>
                  <h4>4°C Bulk Milk Coolers (BMC)</h4>
                  <p>45+ chilling stations situated within 3km of village hubs, cooling fresh milk below 4°C in 30 minutes to lock in freshness.</p>
                </div>
                <div className="infra-card">
                  <div className="infra-icon"><Droplets size={24} /></div>
                  <h4>Ultrasonic AMCU Testing</h4>
                  <p>High-precision digital fat & SNF analyzers integrated with thermal print slip generators and solar backup power.</p>
                </div>
                <div className="infra-card">
                  <div className="infra-icon"><ShieldCheck size={24} /></div>
                  <h4>NABL Central Testing Lab</h4>
                  <p>State-of-the-art Gas Chromatography & HPLC testing equipment for multi-spectrum adulterant screening.</p>
                </div>
                <div className="infra-card">
                  <div className="infra-icon"><Sliders size={24} /></div>
                  <h4>Automated Touchless Packaging</h4>
                  <p>Hermetically sealed packaging lines operating in clean-room environments without human contact.</p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 5: Certifications */}
          {aboutSubTab === 'certifications' && (
            <div className="about-content-card animated-fade-in">
              <div className="cert-grid">
                <div className="cert-card">
                  <div className="cert-badge-circle"><Award size={26} /></div>
                  <h4>FSSAI Licensed</h4>
                  <span className="cert-no">Lic. No. 10021051000189</span>
                  <p>Compliant with Food Safety and Standards Authority of India safety benchmarks.</p>
                </div>
                <div className="cert-card">
                  <div className="cert-badge-circle"><ShieldCheck size={26} /></div>
                  <h4>ISO 22000:2018 Certified</h4>
                  <span className="cert-no">Cert ID: FS-994012</span>
                  <p>Internationally recognized Food Safety Management System accreditation.</p>
                </div>
                <div className="cert-card">
                  <div className="cert-badge-circle"><Leaf size={26} /></div>
                  <h4>A2 Native Breed Verified</h4>
                  <span className="cert-no">DNA Batch Tested</span>
                  <p>Guaranteed 100% Beta-Casein A2 protein sourced exclusively from Gir and Sahiwal cows.</p>
                </div>
                <div className="cert-card">
                  <div className="cert-badge-circle"><CheckCircle size={26} /></div>
                  <h4>NABL Accredited Lab</h4>
                  <span className="cert-no">Standard ISO/IEC 17025</span>
                  <p>Certified zero chemical adulteration, zero antibiotics, and zero heavy metal residue.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
      )}

      {/* 7. Statistics Bar — Dynamic Database Counters (Desktop) */}
      <section className="landing-stats hidden md:block">
        <div className="stats-bar-content">
          <div className="stat-metric-item">
            <div className="stat-metric-icon"><Users size={20} /></div>
            <div>
              <div className="stat-number"><AnimatedCounter target={totalHappyFarmers > 0 ? totalHappyFarmers : 0} suffix={totalHappyFarmers > 0 ? '+' : ''} /></div>
              <div className="stat-label">Registered Farmers</div>
            </div>
          </div>

          <div className="stat-metric-item">
            <div className="stat-metric-icon"><MapPin size={20} /></div>
            <div>
              <div className="stat-number"><AnimatedCounter target={totalVillages > 0 ? totalVillages : 0} suffix={totalVillages > 0 ? '+' : ''} /></div>
              <div className="stat-label">Villages Sourced</div>
            </div>
          </div>

          <div className="stat-metric-item">
            <div className="stat-metric-icon"><Droplets size={20} /></div>
            <div>
              <div className="stat-number"><AnimatedCounter target={totalDailyVolume > 0 ? Math.round(totalDailyVolume) : 0} suffix=" L" /></div>
              <div className="stat-label">Total Volume Logged</div>
            </div>
          </div>

          <div className="stat-metric-item">
            <div className="stat-metric-icon"><CheckCircle size={20} /></div>
            <div>
              <div className="stat-number"><AnimatedCounter target={99} suffix=".9%" /></div>
              <div className="stat-label">Testing Precision</div>
            </div>
          </div>

          <div className="stat-metric-item">
            <div className="stat-metric-icon"><Lock size={20} /></div>
            <div>
              <div className="stat-number"><AnimatedCounter target={100} suffix="%" /></div>
              <div className="stat-label">Secure Cloud Logs</div>
            </div>
          </div>
        </div>
      </section>



      {/* Photo Gallery Section */}
      <section className="gallery-section">
        <div className="gallery-container">
          <div className="landing-section-header">
            <span className="section-tagline"><Camera size={14} style={{ marginRight: '6px', verticalAlign: '-2px' }} />Farm Life</span>
            <h2 className="section-main-title">Glimpses of Our Journey</h2>
            <p className="section-desc">From green pastures to your doorstep — experience the authentic dairy farm life.</p>
          </div>
          <div className="gallery-grid">
            <div className="gallery-item gallery-item-large">
              <img src="/images/hero_farm_background.png" alt="Fresh milk collection" />
              <div className="gallery-overlay"><span>Village Collection</span></div>
            </div>
            <div className="gallery-item">
              <img src="/images/rudu_milk_product.png" alt="Premium milk products" />
              <div className="gallery-overlay"><span>Premium Products</span></div>
            </div>
            <div className="gallery-item">
              <img src="/images/fresh_dairy_products.png" alt="Fresh dairy range" />
              <div className="gallery-overlay"><span>Fresh Dairy</span></div>
            </div>
            <div className="gallery-item">
              <img src="/images/sunny_dairy_farm.png" alt="Quality testing" />
              <div className="gallery-overlay"><span>Quality Testing</span></div>
            </div>
            <div className="gallery-item gallery-item-wide">
              <img src="/images/fresh_dairy_products.png" alt="Farm to table" />
              <div className="gallery-overlay"><span>Farm to Table</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= GLOBALLY CERTIFIED ORGANIC GOODNESS ================= */}
      <section className="organic-cert-section">
        <div className="organic-cert-container">
          <h2 className="cert-section-title">Globally Certified Organic Goodness</h2>
          <div className="cert-title-underline"></div>
          <p className="cert-section-desc">
            RUDU products are pure, chemical-free, and naturally crafted for honest, healthy nutrition.
          </p>

          <div className="cert-ribbon-grid">
            {/* Card 1: India Organic */}
            <div className="cert-ribbon-card">
              <span className="cert-ribbon-bar"></span>
              <span className="cert-ribbon-title">India Organic</span>
              <div className="cert-ribbon-divider"></div>
              <div className="cert-ribbon-svg-box">
                <svg viewBox="0 0 100 100" width="80" height="80">
                  <circle cx="50" cy="42" r="32" fill="#E6F2FF" stroke="#3A75C4" strokeWidth="2"/>
                  <path d="M50,22 C42,32 40,48 50,58 C60,48 58,32 50,22 Z" fill="#2E8B57" opacity="0.8"/>
                  <path d="M50,22 C46,28 46,38 50,45 C54,38 54,28 50,22 Z" fill="#98FB98"/>
                  <path d="M42,38 C38,42 38,48 43,51 C48,46 45,41 42,38 Z" fill="#2E8B57"/>
                  <path d="M58,38 C62,42 62,48 57,51 C52,46 55,41 58,38 Z" fill="#2E8B57"/>
                  <path d="M22,74 C35,60 48,82 78,64" fill="none" stroke="#E31E24" strokeWidth="4" strokeLinecap="round"/>
                  <path d="M25,79 C38,65 51,87 81,69" fill="none" stroke="#3A75C4" strokeWidth="4" strokeLinecap="round"/>
                  <path d="M28,84 C41,70 54,92 84,74" fill="none" stroke="#2E8B57" strokeWidth="4" strokeLinecap="round"/>
                </svg>
              </div>
            </div>

            {/* Card 2: USDA Organic */}
            <div className="cert-ribbon-card">
              <span className="cert-ribbon-bar"></span>
              <span className="cert-ribbon-title">USDA Organic</span>
              <div className="cert-ribbon-divider"></div>
              <div className="cert-ribbon-svg-box">
                <svg viewBox="0 0 100 100" width="80" height="80">
                  <circle cx="50" cy="50" r="46" fill="none" stroke="#255C2C" strokeWidth="8"/>
                  <clipPath id="lower-half">
                    <rect x="0" y="50" width="100" height="50" />
                  </clipPath>
                  <circle cx="50" cy="50" r="42" fill="#255C2C" clipPath="url(#lower-half)"/>
                  <text x="50" y="44" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="20" fill="#255C2C" textAnchor="middle">USDA</text>
                  <text x="50" y="78" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="14" fill="#ffffff" textAnchor="middle">ORGANIC</text>
                </svg>
              </div>
            </div>

            {/* Card 3: EU Organic */}
            <div className="cert-ribbon-card">
              <span className="cert-ribbon-bar"></span>
              <span className="cert-ribbon-title">EU Organic</span>
              <div className="cert-ribbon-divider"></div>
              <div className="cert-ribbon-svg-box">
                <svg viewBox="0 0 100 66" width="90" height="60">
                  <rect width="100" height="66" rx="8" fill="#3C8D2F"/>
                  <path d="M25,33 C35,20 65,20 75,33 C65,46 35,46 25,33 Z" fill="none" stroke="#ffffff" strokeWidth="2" strokeDasharray="2,2"/>
                  <path d="M25,33 Q50,33 75,33" fill="none" stroke="#ffffff" strokeWidth="1.5"/>
                  <g fill="#ffffff">
                    <polygon points="50,12 51,15 54,15 52,17 53,20 50,18 47,20 48,17 46,15 49,15"/>
                    <polygon points="38,16 40,18 43,17 41,20 42,23 39,21 36,23 37,20 35,17 38,18"/>
                    <polygon points="29,24 31,26 34,24 32,27 34,30 31,28 28,30 29,27 27,24 30,25"/>
                    <polygon points="25,34 27,35 30,33 28,36 30,39 27,37 24,39 25,36 23,33 26,34"/>
                    <polygon points="28,44 30,45 33,43 31,46 33,49 30,47 27,49 28,46 26,43 29,44"/>
                    <polygon points="37,51 39,52 42,50 40,53 42,56 39,54 36,56 37,53 35,50 38,51"/>
                    <polygon points="50,54 51,55 54,53 52,56 54,59 51,57 48,59 49,56 47,53 50,54"/>
                    <polygon points="63,51 64,52 67,50 65,53 67,56 64,54 61,56 62,53 60,50 63,51"/>
                    <polygon points="72,44 73,45 76,43 74,46 76,49 73,47 70,49 71,46 69,43 72,44"/>
                    <polygon points="75,34 76,35 79,33 77,36 79,39 76,37 73,39 74,36 72,33 75,34"/>
                    <polygon points="71,24 72,26 75,24 73,27 75,30 72,28 69,30 70,27 68,24 71,25"/>
                    <polygon points="62,16 63,18 66,17 64,20 65,23 62,21 59,23 60,20 58,17 61,18"/>
                  </g>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Purity & Quality Pillars Section */}
      <section id="purity" className="purity-pillars-section">
        <div className="purity-container">
          <div className="landing-section-header">
            <span className="section-tagline">Commitment to Quality</span>
            <h2 className="section-main-title">Purity Tested. Quality Assured.</h2>
            <p className="section-desc">We follow rigorous processing guidelines to bring you delicious, high-quality, and nutritious dairy essentials.</p>
          </div>

          <div className="pillars-grid">
            <div className="pillar-card">
              <div className="pillar-icon-box red-bg">
                <ShieldCheck size={30} />
              </div>
              <h3>GC Tested Purity</h3>
              <p>Our ghee batches undergo Gas Chromatography testing to prove complete purity and detect any adulterations, satisfying high quality standards.</p>
            </div>

            <div className="pillar-card">
              <div className="pillar-icon-box gold-bg">
                <Droplets size={30} />
              </div>
              <h3>Clean & Hygienic</h3>
              <p>Processed touch-free using state-of-the-art packaging systems, ensuring clean food grade safety from milking to delivery.</p>
            </div>

            <div className="pillar-card">
              <div className="pillar-icon-box blue-bg">
                <Users size={30} />
              </div>
              <h3>Empowering Farmers</h3>
              <p>Procuring directly from local villages with computerized fat testing, securing fair rates and bi-weekly direct bank payouts.</p>
            </div>

            <div className="pillar-card">
              <div className="pillar-icon-box green-bg">
                <Sparkles size={30} />
              </div>
              <h3>Rich in Nutrients</h3>
              <p>Naturally packed with proteins, calcium, and vitamins, maintaining native dairy goodness for absolute wellness.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= WHY CHOOSE RUDU DAIRY (COMPARISON MATRIX) ================= */}
      <section id="why-us" className="why-choose-section py-16 px-4 bg-gradient-to-b from-gray-50 via-white to-red-50/30">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="landing-section-header text-center mb-12">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-extrabold bg-red-100 text-red-700 border border-red-200 mb-3 shadow-2xs">
              <Sparkles size={14} className="text-red-600 animate-pulse" />
              The Rudu Advantage
            </span>
            <h2 className="section-main-title text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              Why Choose Rudu Dairy?
            </h2>
            <p className="section-desc max-w-2xl mx-auto text-sm sm:text-base text-gray-600 font-medium mt-3">
              Compare Rudu Dairy with traditional local dairies &amp; middlemen to see how our smart technology and lab-verified purity deliver unmatched value.
            </p>
          </div>

          {/* 2-Column Side-by-Side Comparison Cards */}
          <div className="grid grid-cols-2 gap-3 sm:gap-8 mb-12">
            {/* Column 1: Rudu Dairy (Winner Card) */}
            <div className="bg-gradient-to-b from-red-50/80 via-white to-red-50/30 rounded-2xl sm:rounded-3xl p-3 sm:p-6 lg:p-8 border-2 border-red-500 shadow-md sm:shadow-xl relative overflow-hidden flex flex-col justify-between transform transition-all duration-300 hover:shadow-2xl">
              <div className="absolute top-0 right-0 bg-red-600 text-white font-extrabold text-[8px] sm:text-[11px] uppercase tracking-wider px-2 sm:px-4 py-1 sm:py-1.5 rounded-bl-xl sm:rounded-bl-2xl shadow-sm flex items-center gap-1">
                <span>👑</span> <span className="hidden sm:inline">Recommended Choice</span><span className="sm:hidden">Best</span>
              </div>

              <div>
                <div className="flex items-center gap-2 sm:gap-3.5 mb-3 sm:mb-6">
                  <div className="w-9 h-9 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-red-600 text-white flex items-center justify-center text-base sm:text-2xl shadow-lg shrink-0">
                    🥛
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-2xl font-extrabold text-gray-900 leading-tight">
                      Rudu Dairy
                    </h3>
                    <span className="hidden sm:block text-xs font-extrabold text-red-600 uppercase tracking-wide">
                      Smart Ecosystem &amp; 100% Pure Guarantee
                    </span>
                    <span className="sm:hidden text-[10px] font-bold text-red-600 uppercase tracking-wide">
                      100% Pure
                    </span>
                  </div>
                </div>

                <div className="space-y-3.5">
                  {[
                    { title: "100% Lab-Verified Purity", desc: "GC-Tested with zero chemical preservatives or water dilution.", emoji: "🧪" },
                    { title: "Real-Time Ultrasonic Testing", desc: "Accurate Fat & SNF calculation with instant printed receipt slips.", emoji: "📊" },
                    { title: "Guaranteed Direct Payouts", desc: "Weekly direct bank payments with 0-day delay for every farmer.", emoji: "⚡" },
                    { title: "Rapid Cold-Chain Preservation", desc: "Chilled to 4°C within 1 hour in sealed tamper-evident bottles.", emoji: "❄️" },
                    { title: "Standardized Govt. Rate Charts", desc: "Fair pricing + seasonal bonus payouts for local dairy farmers.", emoji: "💰" },
                    { title: "100% Satisfaction Guarantee", desc: "Full replacement guarantee & complete farm-to-table traceability.", emoji: "🛡️" }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 sm:gap-3.5 p-2 sm:p-3.5 rounded-xl sm:rounded-2xl bg-white/90 border border-red-100 shadow-2xs hover:border-red-300 transition-all">
                      <span className="text-lg sm:text-2xl shrink-0 p-1 sm:p-1.5 bg-red-50 rounded-lg sm:rounded-xl">{item.emoji}</span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1 text-[11px] sm:text-sm font-extrabold text-gray-900 flex-wrap">
                          <span className="leading-tight">{item.title}</span>
                          <span className="inline-flex items-center justify-center w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-emerald-500 text-white text-[8px] sm:text-[10px] font-bold shrink-0">✓</span>
                        </div>
                        <p className="hidden sm:block text-xs text-gray-600 font-medium mt-0.5 leading-snug">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-3 sm:mt-8 pt-3 sm:pt-4 border-t border-red-100 flex items-center justify-between flex-wrap gap-1">
                <span className="text-[10px] sm:text-xs font-extrabold text-red-700 flex items-center gap-1">
                  ⭐ <span className="hidden sm:inline">Overall Rating:</span> 99.8%
                </span>
                <span className="text-[10px] sm:text-xs font-extrabold bg-emerald-100 text-emerald-800 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full border border-emerald-200 shadow-2xs">
                  ✅ Certified
                </span>
              </div>
            </div>

            {/* Column 2: Traditional Local Dairies */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-6 lg:p-8 border border-gray-200 shadow-md flex flex-col justify-between hover:shadow-lg transition-all duration-300">
              <div>
                <div className="flex items-center gap-2 sm:gap-3.5 mb-3 sm:mb-6">
                  <div className="w-9 h-9 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gray-100 text-gray-500 flex items-center justify-center text-base sm:text-2xl shrink-0 border border-gray-200">
                    🏚️
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-2xl font-extrabold text-gray-700 leading-tight">
                      Traditional
                    </h3>
                    <span className="hidden sm:block text-xs font-extrabold text-gray-400 uppercase tracking-wide">
                      Conventional Vendors &amp; Middlemen
                    </span>
                    <span className="sm:hidden text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                      Old Methods
                    </span>
                  </div>
                </div>

                <div className="space-y-3.5">
                  {[
                    { title: "Unverified Milk Quality", desc: "Frequent water dilution & synthetic chemical preservatives.", emoji: "⚠️" },
                    { title: "Arbitrary Manual Estimation", desc: "Manual fat cuts & hidden margin deductions without proof.", emoji: "❌" },
                    { title: "Delayed & Uncertain Payments", desc: "Delayed payments by 15–45 days with unexpected commission cuts.", emoji: "⏳" },
                    { title: "Unhygienic Open Transport", desc: "Unrefrigerated open milk cans transported in scorching heat.", emoji: "🌡️" },
                    { title: "Unstable Daily Pricing", desc: "Fluctuating rates dictated arbitrarily by middleman commission.", emoji: "📉" },
                    { title: "Zero Quality Guarantees", desc: "No customer replacement policy or farm traceability.", emoji: "🚫" }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 sm:gap-3.5 p-2 sm:p-3.5 rounded-xl sm:rounded-2xl bg-gray-50/80 border border-gray-200">
                      <span className="text-lg sm:text-2xl shrink-0 p-1 sm:p-1.5 bg-gray-100 rounded-lg sm:rounded-xl">{item.emoji}</span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1 text-[11px] sm:text-sm font-extrabold text-gray-700 flex-wrap">
                          <span className="leading-tight">{item.title}</span>
                          <span className="inline-flex items-center justify-center w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-rose-500 text-white text-[8px] sm:text-[10px] font-bold shrink-0">✕</span>
                        </div>
                        <p className="hidden sm:block text-xs text-gray-500 font-medium mt-0.5 leading-snug">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-3 sm:mt-8 pt-3 sm:pt-4 border-t border-gray-100 flex items-center justify-between flex-wrap gap-1 text-gray-400">
                <span className="text-[10px] sm:text-xs font-semibold text-gray-500"><span className="hidden sm:inline">Unverified</span> Standards</span>
                <span className="text-[10px] sm:text-xs font-bold bg-gray-100 text-gray-600 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full border border-gray-200">
                  ❌ Risk
                </span>
              </div>
            </div>
          </div>

          {/* 4 Feature Highlights Grid — Desktop only */}
          <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center font-bold text-xl mb-4">
                <ShieldCheck size={26} />
              </div>
              <h4 className="font-extrabold text-lg text-gray-900 mb-1">100% Pure Certified</h4>
              <p className="text-xs text-gray-600 font-medium leading-relaxed">
                Zero chemical additives or synthetic preservatives. Tested for complete purity every single morning.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center font-bold text-xl mb-4">
                <Sliders size={26} />
              </div>
              <h4 className="font-extrabold text-lg text-gray-900 mb-1">Digital Testing</h4>
              <p className="text-xs text-gray-600 font-medium leading-relaxed">
                Ultrasonic testing ensures accurate Fat &amp; SNF calculation with instant printed receipts for every farmer.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center font-bold text-xl mb-4">
                <CreditCard size={26} />
              </div>
              <h4 className="font-extrabold text-lg text-gray-900 mb-1">Instant Payouts</h4>
              <p className="text-xs text-gray-600 font-medium leading-relaxed">
                Direct bank payouts with transparent rate charts empower local farmers with zero payment delays.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center font-bold text-xl mb-4">
                <Droplets size={26} />
              </div>
              <h4 className="font-extrabold text-lg text-gray-900 mb-1">Cold Chain Freshness</h4>
              <p className="text-xs text-gray-600 font-medium leading-relaxed">
                Rapid chilling to 4°C preserves fresh milk taste, creaminess, and essential nutrients from farm to table.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROOF SLIDESHOW CARD ── */}
      <section className="py-12 px-4 sm:px-6 bg-[#FAF8F5]">
        <div className="max-w-4xl mx-auto">
          {/* Main Gold Tan Card Outer Container */}
          <div className="bg-[#CCA364] rounded-[32px] sm:rounded-[36px] p-5 sm:p-8 shadow-2xl relative border-4 border-[#BA9355] text-center my-6">
            
            {/* Top 3D Speech-Bubble Green Banner */}
            <div className="relative z-30 inline-block -mt-12 sm:-mt-14 mb-6">
              <div className="bg-[#2D5A47] text-white px-8 sm:px-12 py-3 rounded-2xl shadow-2xl border-2 border-[#1E3F31] relative flex flex-col items-center min-w-[240px] sm:min-w-[280px]">
                
                {/* Speech tail triangle pointing down */}
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[12px] border-t-[#2D5A47]" />
                
                {/* Top Rudu Dairy Text Badge */}
                <div className="bg-[#0B1727] text-white px-5 py-1.5 rounded-lg mb-1 flex items-center justify-center shadow-md border border-white/20">
                  <span className="font-black text-sm sm:text-base tracking-[0.25em] text-white uppercase font-sans">
                    RUDU DAIRY
                  </span>
                </div>
                
                {/* Main Headline PROOF! */}
                <h2 className="text-4xl sm:text-6xl font-black tracking-wider text-white drop-shadow-[0_4px_6px_rgba(0,0,0,0.6)]">
                  PROOF!
                </h2>
              </div>
            </div>

            {/* Two Side-by-Side Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 relative z-10">
              
              {/* Card 1: 100% Certified Organic Food */}
              <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border-2 border-amber-900/20 group h-[280px] sm:h-[340px]">
                {/* Top Center Purple Icon Badge */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 w-10 h-10 rounded-full bg-[#6B2D5C] text-white flex items-center justify-center shadow-lg border-2 border-white/90">
                  <ShieldCheck size={22} className="text-white" />
                </div>
                
                {/* Background Photo */}
                <img 
                  src="/images/proof_family.jpg" 
                  alt="100% Certified Organic Food" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                
                {/* Bottom Dark Green Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B2E1D] via-[#0B2E1D]/80 via-35% to-transparent z-10" />
                
                {/* Text Content at Bottom */}
                <div className="absolute bottom-4 inset-x-3 sm:inset-x-4 z-20 text-white text-center">
                  <div className="flex items-baseline justify-center gap-1.5 mb-1">
                    <span className="text-3xl sm:text-4xl font-black text-white tracking-tight drop-shadow-md">100%</span>
                    <span className="text-xs sm:text-sm font-bold text-emerald-100 uppercase tracking-wide leading-tight text-left">
                      Certified<br/>Organic Food
                    </span>
                  </div>
                  <p className="text-xs italic text-amber-200/90 font-serif">For Your Family</p>
                </div>
              </div>

              {/* Card 2: 252+ Banned Chemicals Lab Test */}
              <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border-2 border-amber-900/20 group h-[280px] sm:h-[340px]">
                {/* Top Center Purple Icon Badge */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 w-10 h-10 rounded-full bg-[#6B2D5C] text-white flex items-center justify-center shadow-lg border-2 border-white/90">
                  <FlaskConical size={22} className="text-white" />
                </div>
                
                {/* Background Photo */}
                <img 
                  src="/images/proof_lab.jpg" 
                  alt="252+ Banned Chemicals Lab Test" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                
                {/* Bottom Dark Green Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B2E1D] via-[#0B2E1D]/80 via-35% to-transparent z-10" />
                
                {/* Text Content at Bottom */}
                <div className="absolute bottom-4 inset-x-3 sm:inset-x-4 z-20 text-white text-center">
                  <div className="flex items-baseline justify-center gap-1.5 mb-1">
                    <span className="text-3xl sm:text-4xl font-black text-white tracking-tight drop-shadow-md">252+</span>
                    <span className="text-xs sm:text-sm font-bold text-emerald-100 uppercase tracking-wide leading-tight text-left">
                      Banned<br/>Chemicals Lab Test
                    </span>
                  </div>
                  <p className="text-xs italic text-amber-200/90 font-serif">Every Batch. Tested Twice</p>
                </div>
              </div>

            </div>

            {/* Bottom Carousel Indicator Dots */}
            <div className="flex items-center justify-center gap-2 mt-6 relative z-10">
              <div className="w-2.5 h-2.5 rounded-full bg-white/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-white/60" />
              <div className="w-10 h-2.5 rounded-full bg-white shadow-md" />
            </div>

          </div>
        </div>
      </section>

      {/* 8. Testimonials Section */}
      <section className="testimonials-section">
        <div className="testimonials-container">
          <div className="landing-section-header">
            <span className="section-tagline">Voices of Trust</span>
            <h2 className="section-main-title">What Our Partners Say</h2>
            <p className="section-desc">Hear directly from dairy farmers who supply milk daily and experience our transparent management framework.</p>
          </div>

          <div className="testimonials-grid">
            <div className="testimonial-card">
              <p className="testimonial-quote">
                "Rudu's automated fat-testing machine completely removed any doubt about milk weight. Every morning, I get a print slip right away with exact pricing, and money goes to my bank on time."
              </p>
              <div className="testimonial-author-box">
                <div className="author-avatar-circle">R</div>
                <div className="author-details">
                  <h4>Rajesh Kumar</h4>
                  <p>Milk Supplier, Mathura Village</p>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <p className="testimonial-quote">
                "We manage collections for three villages. With Rudu's portal, we don't have to keep paper logs. Payout sheets are calculated with a single click, saving hours of manual audit weekly."
              </p>
              <div className="testimonial-author-box">
                <div className="author-avatar-circle">A</div>
                <div className="author-details">
                  <h4>Amit Singh</h4>
                  <p>Collection Officer, Aligarh</p>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <p className="testimonial-quote">
                "The purity checks and cooling systems ensure our ghee has the iconic danedar texture and rich natural flavor. Quality is verified at every level."
              </p>
              <div className="testimonial-author-box">
                <div className="author-avatar-circle">M</div>
                <div className="author-details">
                  <h4>Manish Sharma</h4>
                  <p>Quality Head, Creamy Foods</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= BLOGS SECTION ================= */}
      <section id="blogs" className="blog-section">
        <div className="blog-container">
          <div className="blog-header-row">
            <h2 className="blog-section-title">
              Blogs
              <div className="blog-title-underline"></div>
            </h2>
            <button 
              onClick={() => alert("Blogs portal coming soon! Stay tuned.")} 
              className="blog-see-all-btn"
            >
              <span>See all</span>
              <ArrowRight size={15} />
            </button>
          </div>

          <div className="blog-cards-grid">
            {/* Card 1 */}
            <div 
              className="blog-card-new"
              onClick={() => setSelectedArticle({
                title: "Meet the Farmers: The Hard Work Behind Every Clean Product",
                category: "Organic Farming",
                date: "26 May 2026",
                readTime: "5 min read",
                author: "Dr. Sunita Rao",
                img: "/images/sunny_dairy_farm.png",
                desc: "Organic farming goes beyond avoiding synthetic chemicals. It requires a long transition period of soil preparation, implementing natural pest management, and bearing higher initial operational costs. Our dedicated local farmers put in tireless daily work to harvest certified pure, unadulterated milk and crops for your family."
              })}
            >
              <div className="blog-img-container">
                <img src="/images/sunny_dairy_farm.png" alt="Untold Story Behind Organic Farming" className="blog-img" />
                <div className="blog-img-overlay-text">
                  <h3 className="overlay-heading">The Untold Story<br/>Behind Organic Farming</h3>
                  <ul className="overlay-bullets">
                    <li><span>•</span> Long Transition Period</li>
                    <li><span>•</span> Higher Costs and Risks</li>
                    <li><span>•</span> Uncertain Premiums</li>
                  </ul>
                  <span className="overlay-branding">COWBERRY</span>
                </div>
              </div>
              <div className="blog-card-details">
                <h4 className="blog-card-headline">Meet the Farmers: The Hard Work Behind Every Clean Product</h4>
                <div className="blog-card-divider"></div>
                <div className="blog-card-date">26 May 2026</div>
              </div>
            </div>

            {/* Card 2 */}
            <div 
              className="blog-card-new"
              onClick={() => setSelectedArticle({
                title: "Carbendazim in Your Kitchen: Fungicide in Spices & Veggies",
                category: "Food Safety",
                date: "27 May 2026",
                readTime: "7 min read",
                author: "Manish Sharma",
                img: "/images/fresh_dairy_products.png",
                desc: "Many household spices and vegetables contain residue from chemical fungicides like Carbendazim. These pesticides are known endocrine disruptors, potentially causing hormone imbalance, liver strain, and developmental issues over long-term exposure. Choosing certified organic, lab-tested dairy and produce is the safest way to guard your family's health."
              })}
            >
              <div className="blog-img-container">
                <img src="/images/fresh_dairy_products.png" alt="An Invisible Danger in your Kitchen" className="blog-img" />
                <div className="blog-img-overlay-text">
                  <h3 className="overlay-heading">An Invisible Danger<br/>in your Kitchen</h3>
                  <ul className="overlay-bullets">
                    <li><span>•</span> Hormone Disruption</li>
                    <li><span>•</span> Liver Damage</li>
                    <li><span>•</span> Immune and Dev. Effects</li>
                  </ul>
                  <span className="overlay-branding">COWBERRY</span>
                </div>
              </div>
              <div className="blog-card-details">
                <h4 className="blog-card-headline">Carbendazim in Your Kitchen: Fungicide in Spices & Veggies</h4>
                <div className="blog-card-divider"></div>
                <div className="blog-card-date">27 May 2026</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FAQ SECTION ================= */}
      <section id="faq" className="faq-section">
        <div className="faq-container">
          <div className="landing-section-header">
            <span className="section-tagline">Got Questions?</span>
            <h2 className="section-main-title">Common Questions & Answers</h2>
            <p className="section-desc">Clear answers regarding general operations, daily milk payments, Fat & SNF calculation, farmer registration, and quality testing.</p>
          </div>

          {/* Category Tabs */}
          <div className="faq-categories-row">
            {[
              { id: 'General', label: 'Common Questions', icon: <HelpCircle size={15} /> },
              { id: 'Payment', label: 'Payment Questions', icon: <CreditCard size={15} /> },
              { id: 'FatSNF', label: 'Fat & SNF Calculation', icon: <Sliders size={15} /> },
              { id: 'Registration', label: 'Farmer Registration', icon: <UserCheck size={15} /> },
              { id: 'Quality', label: 'Milk Quality & Testing', icon: <ShieldCheck size={15} /> }
            ].map(cat => (
              <button 
                key={cat.id} 
                className={`faq-cat-btn ${faqCategory === cat.id ? 'active' : ''}`}
                onClick={() => { setFaqCategory(cat.id); setOpenFaqIndex(0); }}
              >
                {cat.icon} <span>{cat.label}</span>
              </button>
            ))}
          </div>

          {/* Accordion Questions */}
          <div className="faq-accordion-box">
            {[
              // General/Common Questions (Dynamic from BUSINESS.faqs)
              ...(faqCategory === 'General' ? BUSINESS.faqs.map(faq => ({
                q: faq.question,
                a: faq.answer
              })) : []),

              // Payment Questions
              ...(faqCategory === 'Payment' ? [
                {
                  q: "How are daily milk payments calculated and transferred?",
                  a: "Daily payments are calculated automatically by our system based on exact milk volume (Kg), Fat %, and SNF % as per government-approved rate charts. Payouts are transferred directly into the farmer's linked bank account on a 10-day cycle or available in cash via daily print slips."
                },
                {
                  q: "Can registered farmers request advance payouts for cattle feed?",
                  a: "Yes! Registered farmers with an active 30-day supply history can request advance payments up to ₹15,000 for cattle feed or emergency expenses directly from their Farmer Portal or collection center operator."
                },
                {
                  q: "Are there any hidden deductions or commission fees in payouts?",
                  a: "Zero! Rudu Dairy enforces a 100% transparent pricing policy. No middleman commissions or secret weight deductions are ever made. The printed slip amount is exact."
                }
              ] : []),

              // Fat & SNF Calculation
              ...(faqCategory === 'FatSNF' ? [
                {
                  q: "How is Fat % and SNF % measured accurately at the collection hub?",
                  a: "Each collection center uses digital ultrasonic milk analyzers calibrated daily with standard laboratory buffer solutions. When milk is poured into the sensor cup, the machine displays exact Fat % and SNF % on screen within 15 seconds."
                },
                {
                  q: "Why does SNF % vary between morning and evening milk collections?",
                  a: "SNF (Solids-Not-Fat) naturally fluctuates based on feed timing, ambient temperature, water intake, and milking intervals. Our system automatically references the official rate matrix so you get fair compensation regardless of shift variations."
                },
                {
                  q: "What if a farmer disagrees with the digital Fat test reading?",
                  a: "Farmers can request an immediate re-test using a secondary control sample or request a Gerber laboratory test at the central hub in the presence of the supervisor."
                }
              ] : []),

              // Registration
              ...(faqCategory === 'Registration' ? [
                {
                  q: "How can a local dairy farmer register with Rudu Dairy?",
                  a: "Farmers can register within 5 minutes at any local Rudu Village Collection Center by bringing a valid Aadhaar card, bank passbook copy, and phone number. Operators issue an instant Member ID card."
                },
                {
                  q: "What are the eligibility criteria for opening a new Collection Center?",
                  a: "You need a small covered space (approx. 100 sq ft), single-phase electricity connection for BMC/AMCU devices, and basic digital literacy. Contact our onboarding team via the contact section."
                }
              ] : []),

              // Milk Quality
              ...(faqCategory === 'Quality' ? [
                {
                  q: "Are any synthetic preservatives, chemicals, or water added to Rudu milk?",
                  a: "NEVER. Every batch undergoes 14 stringent laboratory tests for urea, starch, detergent, maltodextrin, hydrogen peroxide, and antibiotic residues before processing."
                },
                {
                  q: "How does Rudu maintain milk freshness from village collection to doorstep?",
                  a: "Milk collected in villages is chilled below 4°C within 30 minutes in Bulk Milk Coolers (BMC) and transported in insulated stainless-steel cold-chain tankers to our pasteurization plant."
                }
              ] : [])
            ].map((faq, idx) => (
              <div 
                key={idx} 
                className={`faq-accordion-item ${openFaqIndex === idx ? 'expanded' : ''}`}
                onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
              >
                <div className="faq-question-header">
                  <h4>{faq.q}</h4>
                  <div className="faq-toggle-icon">
                    {openFaqIndex === idx ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>
                </div>
                {openFaqIndex === idx && (
                  <div className="faq-answer-body animated-slide-down">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CAREERS SECTION ================= */}
      {showCareersSection && (
        <section id="careers" className="careers-section animated-fade-in" style={{ position: 'relative' }}>
          <button 
            type="button" 
            onClick={() => setShowCareersSection(false)}
            style={{ position: 'absolute', top: '24px', right: '24px', background: 'rgba(0,0,0,0.06)', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 5 }}
            title="Close Careers View"
          >
            <X size={18} />
          </button>
          <div className="careers-container">
            <div className="landing-section-header">
              <span className="section-tagline">Work With Us</span>
              <h2 className="section-main-title">Careers at Rudu Dairy</h2>
              <p className="section-desc">Join our team of passion-driven engineers, dairy technologists, and rural operations specialists building the future of dairy management.</p>
            </div>

            {/* Job Openings Grid */}
            <div className="careers-grid">
              {[
                {
                  id: 'job-1',
                  title: "Dairy Quality Control & Lab Analyst",
                  department: "Quality Assurance",
                  location: "Mathura Central Plant",
                  type: "Full Time",
                  exp: "2 - 4 Years",
                  desc: "Conduct GC, HPLC, and microbiological testing on incoming milk batches to ensure 100% compliance with FSSAI & NABL standards."
                },
                {
                  id: 'job-2',
                  title: "Village Collection Center Supervisor",
                  department: "Field Operations",
                  location: "Aligarh Regional Hub",
                  type: "Full Time",
                  exp: "1 - 3 Years",
                  desc: "Manage morning and evening milk collection operations, calibrate AMCU hardware, and assist village dairy farmers with onboarding."
                },
                {
                  id: 'job-3',
                  title: "Full Stack Software Engineer (React / Node / IoT)",
                  department: "Engineering",
                  location: "Remote / Hybrid",
                  type: "Full Time",
                  exp: "3 - 5 Years",
                  desc: "Develop scalable cloud dashboards, real-time IoT weighing scale integrations, and mobile progressive web applications for farmers."
                },
                {
                  id: 'job-4',
                  title: "Field Veterinary Medical Officer",
                  department: "Cattle Care & Health",
                  location: "Mathura Rural Field",
                  type: "Full Time",
                  exp: "2 - 5 Years",
                  desc: "Provide veterinary care, vaccination drives, and nutrition counseling to partner dairy farmers to optimize herd productivity."
                }
              ].map(job => (
                <div key={job.id} className="job-card">
                  <div className="job-card-header">
                    <span className="job-dept-tag">{job.department}</span>
                    <span className="job-type-badge">{job.type}</span>
                  </div>
                  <h3 className="job-title">{job.title}</h3>
                  <div className="job-meta-list">
                    <span><MapPin size={13} /> {job.location}</span>
                    <span>•</span>
                    <span><Briefcase size={13} /> {job.exp}</span>
                  </div>
                  <p className="job-desc">{job.desc}</p>
                  <button 
                    type="button"
                    className="job-apply-btn"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedJob(job);
                      setCareerSubmitted(false);
                      setIsCareerModalOpen(true);
                    }}
                  >
                    <span>Apply Online</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}



      {/* 9. CTA Section */}
      <section id="cta" className="landing-cta">
        <div className="cta-banner-card">
          <div className="cta-left-text">
            <h2>Start Digitizing Your Dairy Operations Today</h2>
            <p>Join the next generation of dairy management. Experience 100% transparent milk weight reporting, zero-error payouts, and premium grade validation in a unified, smart cloud solution.</p>
            <button onClick={() => handleLogin('farmer')} className="cta-btn-cream">
              <User size={16} />
              <span>Go to Farmer Portal</span>
            </button>
          </div>

          <div className="cta-right-mockups">
            <img src="/milk_can_realistic.png" className="cta-milk-can-box" alt="Premium silver milk can" />
            <img src="/milk_splash_realistic.png" className="cta-splash-overlay" alt="White splash background pattern" />
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter-section">
        <div className="newsletter-container">
          <div className="newsletter-icon-box">
            <Mail size={32} />
          </div>
          <h2 className="newsletter-title">Stay Fresh — Get Farm Updates</h2>
          <p className="newsletter-desc">Subscribe to receive exclusive offers, seasonal product launches, and stories from our village farms.</p>
          <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
            <div className="newsletter-input-wrapper">
              <div className="newsletter-input-field-inner">
                <Mail size={16} className="newsletter-input-icon" />
                <input 
                  type="email" 
                  placeholder="Enter your email address" 
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="newsletter-input"
                  required
                />
              </div>
              <button type="submit" className="newsletter-submit-btn">
                <Send size={16} />
                <span>Subscribe</span>
              </button>
            </div>
          </form>
          {newsletterSubmitted && (
            <div className="newsletter-success">
              <CheckCircle size={16} />
              <span>Thank you! You're now part of the Rudu family.</span>
            </div>
          )}
        </div>
      </section>

      {/* 10. Footer Section */}
      <footer id="footer" className="landing-footer-milky">
        <div className="footer-milky-content">
          {/* Logo at the top, centered */}
          <div className="footer-milky-logo flex justify-center items-center py-2">
            <RuduLogo height={48} className="mx-auto" />
          </div>

          {/* Links grid, centered */}
          <div className="footer-milky-links">
            <div className="footer-milky-links-row">
              <button onClick={() => alert('Online Store coming soon!')}>Online Store</button>
              <button onClick={() => scrollToSection('about')}>About Us</button>
              <button onClick={() => scrollToSection('products')}>Products</button>
            </div>
            <div className="footer-milky-links-row">
              <button onClick={() => scrollToSection('cta')}>Contact Us</button>
              <button onClick={() => alert('Terms of Use coming soon!')}>Terms of Use</button>
              <button onClick={() => alert('Privacy Policy coming soon!')}>Privacy Policy</button>
            </div>
          </div>

          {/* Social icons, filled circles with dark icons */}
          <div className="footer-milky-socials">
            <a href="#" className="social-circle" title="LinkedIn"><Linkedin size={18} fill="currentColor" stroke="none" /></a>
            <a href="#" className="social-circle" title="Facebook"><Facebook size={18} fill="currentColor" stroke="none" /></a>
            <a href="#" className="social-circle" title="YouTube"><Youtube size={18} fill="currentColor" stroke="none" /></a>
            <a href="#" className="social-circle" title="Instagram"><Instagram size={18} /></a>
          </div>
        </div>

        {/* Bottom copyright bar */}
        <div className="footer-milky-bottom">
          <div className="max-w-6xl mx-auto px-4 flex justify-center items-center h-full">
            <span>© Copyright {new Date().getFullYear()}. All Rights Reserved</span>
          </div>
        </div>

        {/* Floating Chat Widget */}
        <div 
          className="chat-float-widget" 
          onClick={() => alert("Chat Support: How can we help you today?")}
          title="Chat Support"
        >
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            <circle cx="8" cy="10" r="1" fill="currentColor"/>
            <circle cx="12" cy="10" r="1" fill="currentColor"/>
            <circle cx="16" cy="10" r="1" fill="currentColor"/>
          </svg>
        </div>
      </footer>

      {/* Modal 1: Article Reader Modal */}
      {selectedArticle && (
        <div className="landing-modal-overlay" onClick={() => setSelectedArticle(null)}>
          <div className="landing-modal-card article-modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setSelectedArticle(null)}>
              <X size={20} />
            </button>
            <div className="article-modal-header">
              <span className="blog-cat-badge">{selectedArticle.category}</span>
              <h2>{selectedArticle.title}</h2>
              <div className="blog-meta-row">
                <span>By {selectedArticle.author}</span>
                <span>•</span>
                <span>{selectedArticle.date}</span>
                <span>•</span>
                <span>{selectedArticle.readTime}</span>
              </div>
            </div>
            <div className="article-modal-body">
              <img src={selectedArticle.img} alt={selectedArticle.title} className="article-hero-img" />
              <p className="article-lead">{selectedArticle.desc}</p>
              <div className="article-full-text">
                <p>Proper cattle care, high-precision fat/SNF testing, and rapid 4°C cooling are essential to maintain pure dairy quality. Rudu Dairy continues to support rural farmers with modern technology and transparent pricing.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Career Job Application Modal */}
      {isCareerModalOpen && (
        <div className="landing-modal-overlay" onClick={() => setIsCareerModalOpen(false)}>
          <div className="landing-modal-card career-modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setIsCareerModalOpen(false)}>
              <X size={20} />
            </button>

            {!careerSubmitted ? (
              <>
                <div className="career-modal-header">
                  <span className="job-dept-tag">{selectedJob?.department || 'Rudu Careers'}</span>
                  <h2>Apply for {selectedJob?.title || 'Open Position'}</h2>
                  <p className="career-modal-sub"><MapPin size={13} /> {selectedJob?.location} • {selectedJob?.type}</p>
                </div>
                <form className="career-form" onSubmit={handleCareerSubmit}>
                  <div className="form-group-row">
                    <div className="form-field">
                      <label>Full Name *</label>
                      <input 
                        type="text" 
                        required 
                        placeholder="e.g. Ankit Sharma"
                        value={careerFormData.name}
                        onChange={(e) => setCareerFormData({ ...careerFormData, name: e.target.value })}
                      />
                    </div>
                    <div className="form-field">
                      <label>Email Address *</label>
                      <input 
                        type="email" 
                        required 
                        placeholder="name@example.com"
                        value={careerFormData.email}
                        onChange={(e) => setCareerFormData({ ...careerFormData, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-group-row">
                    <div className="form-field">
                      <label>Phone Number *</label>
                      <input 
                        type="tel" 
                        required 
                        placeholder="+91 98765 43210"
                        value={careerFormData.phone}
                        onChange={(e) => setCareerFormData({ ...careerFormData, phone: e.target.value })}
                      />
                    </div>
                    <div className="form-field">
                      <label>Upload Resume / CV</label>
                      <div className="file-input-wrapper">
                        <Upload size={16} />
                        <span>{careerFormData.resumeName || 'Attach PDF/DOCX (Max 5MB)'}</span>
                        <input 
                          type="file" 
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              setCareerFormData({ ...careerFormData, resumeName: e.target.files[0].name });
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-field">
                    <label>Cover Note / Brief Introduction</label>
                    <textarea 
                      rows={3} 
                      placeholder="Tell us briefly about your experience and why you'd like to join Rudu Dairy..."
                      value={careerFormData.cover}
                      onChange={(e) => setCareerFormData({ ...careerFormData, cover: e.target.value })}
                    />
                  </div>

                  <button type="submit" className="submit-application-btn">
                    <Send size={16} />
                    <span>Submit Application</span>
                  </button>
                </form>
              </>
            ) : (
              <div className="career-success-box">
                <div className="success-icon-circle"><CheckCircle size={40} /></div>
                <h3>Application Submitted Successfully!</h3>
                <p>Thank you for applying for <strong>{selectedJob?.title}</strong>. Our HR talent acquisition team will review your application and contact you via email/phone within 3-5 business days.</p>
                <span className="ref-number">Ref Code: RUDU-APP-{Math.floor(Math.random() * 89999 + 10000)}</span>
                <button 
                  className="close-success-btn"
                  onClick={() => {
                    setIsCareerModalOpen(false);
                    setCareerSubmitted(false);
                    setCareerFormData({ name: '', email: '', phone: '', cover: '', resumeName: '' });
                  }}
                >
                  Close Window
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Interactive Quick Order Modal */}
      {quickOrderProduct && (
        <div className="quick-order-modal-overlay">
          <div className="quick-order-card animated-scale-up">
            <button className="auth-modal-close" onClick={() => setQuickOrderProduct(null)}>
              <X size={16} />
            </button>

            <div className="quick-order-header">
              <img src={quickOrderProduct.img} alt={quickOrderProduct.name} className="quick-order-img" />
              <div>
                <span className="product-badge" style={{ position: 'static', display: 'inline-block', marginBottom: '4px' }}>
                  {quickOrderProduct.tag}
                </span>
                <h3 style={{ fontSize: '18px', fontWeight: '900', color: '#1F2937', margin: '2px 0 4px 0' }}>
                  {quickOrderProduct.name}
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ display: 'flex', color: '#E5C378' }}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={13} fill={i < Math.floor(quickOrderProduct.rating) ? "currentColor" : "none"} />
                    ))}
                  </div>
                  <span style={{ fontSize: '12px', color: '#6B7280', fontWeight: '700' }}>({quickOrderProduct.rating} / 5)</span>
                </div>
              </div>
            </div>

            <div className="quick-order-body">
              {orderConfirmed ? (
                <div style={{ textAlign: 'center', padding: '24px 12px' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#E6F4EA', color: '#2E6B34', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px auto' }}>
                    <CheckCircle2 size={32} />
                  </div>
                  <h4 style={{ fontSize: '18px', fontWeight: '900', color: '#1F2937', marginBottom: '8px' }}>
                    Order Request Confirmed!
                  </h4>
                  <p style={{ fontSize: '13px', color: '#4B5563', lineHeight: '1.5', marginBottom: '18px' }}>
                    Your request for <strong>{orderQuantity}x {selectedPackSize} {quickOrderProduct.name}</strong> has been logged. Our local village cold-chain operator will deliver fresh daily.
                  </p>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button 
                      onClick={() => setQuickOrderProduct(null)} 
                      style={{ flex: 1, padding: '11px', borderRadius: '25px', border: '1.5px solid #E2E8F0', background: '#FFFFFF', color: '#4A5568', fontWeight: '800', fontSize: '13px', cursor: 'pointer' }}
                    >
                      Close Window
                    </button>
                    <button 
                      onClick={() => { setQuickOrderProduct(null); handleLogin('farmer'); }} 
                      className="hero-btn-primary" 
                      style={{ flex: 1, justifyContent: 'center', padding: '11px', fontSize: '13px' }}
                    >
                      <span>Farmer Login</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: '800', color: '#4A5568', display: 'block', marginBottom: '8px' }}>
                      Select Pack Size:
                    </label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {['500 ml', '1 L', '2 L'].map((size) => (
                        <button
                          key={size}
                          type="button"
                          className={`size-chip-btn ${selectedPackSize === size ? 'active' : ''}`}
                          onClick={() => setSelectedPackSize(size)}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quantity selector */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F8FAF9', padding: '12px 16px', borderRadius: '14px', border: '1px solid #EAE2D8' }}>
                    <div>
                      <span style={{ fontSize: '12px', fontWeight: '700', color: '#718096', display: 'block' }}>Estimated Price</span>
                      <span style={{ fontSize: '18px', fontWeight: '900', color: '#D9383A' }}>
                        {quickOrderProduct.price}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#ffffff', borderRadius: '20px', padding: '4px 10px', border: '1.5px solid #EAE2D8' }}>
                      <button 
                        type="button" 
                        onClick={() => setOrderQuantity(Math.max(1, orderQuantity - 1))}
                        style={{ border: 'none', background: 'none', fontWeight: '900', fontSize: '16px', cursor: 'pointer', color: '#2D3748', width: '24px', height: '24px' }}
                      >
                        -
                      </button>
                      <span style={{ fontSize: '14px', fontWeight: '900', color: '#1A202C' }}>{orderQuantity}</span>
                      <button 
                        type="button" 
                        onClick={() => setOrderQuantity(orderQuantity + 1)}
                        style={{ border: 'none', background: 'none', fontWeight: '900', fontSize: '16px', cursor: 'pointer', color: '#2D3748', width: '24px', height: '24px' }}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Product quality chips */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', padding: '10px', background: '#FFFDF8', borderRadius: '12px', border: '1px dashed #E5C378' }}>
                    <span style={{ fontSize: '11px', color: '#2E6B34', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <ShieldCheck size={12} /> GC Tested Purity
                    </span>
                    <span style={{ fontSize: '11px', color: '#2E6B34', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Droplets size={12} /> 4°C Cold Chain Chilled
                    </span>
                    <span style={{ fontSize: '11px', color: '#2E6B34', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircle2 size={12} /> Zero Preservatives
                    </span>
                  </div>

                  <button 
                    type="button"
                    onClick={handleConfirmQuickOrder} 
                    className="hero-btn-primary" 
                    style={{ width: '100%', justifyContent: 'center', padding: '13px', borderRadius: '30px', marginTop: '4px' }}
                  >
                    <span>Confirm Quick Order Request</span>
                    <ArrowRight size={16} />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Article Modal */}
      {selectedArticle && (
        <div className="quick-order-modal-overlay" onClick={() => setSelectedArticle(null)}>
          <div className="quick-order-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '540px' }}>
            <button className="auth-modal-close" onClick={() => setSelectedArticle(null)} style={{ background: '#F1F5F9' }}>
              <X size={15} />
            </button>
            <div style={{ padding: '24px' }}>
              <span className="blog-red-badge" style={{ position: 'static', display: 'inline-block', marginBottom: '12px' }}>{selectedArticle.category}</span>
              <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#1A202C', lineHeight: 1.3, marginBottom: '10px' }}>{selectedArticle.title}</h2>
              <div style={{ fontSize: '12px', color: '#718096', fontWeight: '600', marginBottom: '16px' }}>
                {selectedArticle.author} &bull; {selectedArticle.readTime} &bull; {selectedArticle.date}
              </div>
              <img src={selectedArticle.img} alt={selectedArticle.title} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '16px', marginBottom: '16px' }} />
              <p style={{ fontSize: '14px', color: '#4A5568', lineHeight: 1.6, marginBottom: '16px' }}>{selectedArticle.desc}</p>
              <p style={{ fontSize: '13.5px', color: '#718096', lineHeight: 1.6 }}>
                Proper cattle care, high-precision fat/SNF testing, and rapid 4°C cooling are essential to maintain pure dairy quality. Rudu Dairy continues to support rural farmers with modern technology and transparent pricing.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Back to Top Button */}
      <button 
        className={`back-to-top-btn ${showBackToTop ? 'visible' : ''}`}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Back to top"
      >
        <ArrowUp size={20} />
      </button>
    </div>
  );
};
