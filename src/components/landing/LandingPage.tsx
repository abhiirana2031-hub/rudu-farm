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
import { OrganicCertificationsSection } from './OrganicCertificationsSection';
import { BlogSection } from './BlogSection';
import { MilkJourneyTimeline } from './MilkJourneyTimeline';
import { ProductOfferModal } from './ProductOfferModal';
import { PurityBatchChecker } from './PurityBatchChecker';
import { SubscriptionCalculator } from './SubscriptionCalculator';
import { MilkComparisonSection } from './MilkComparisonSection';
import { AboutUsSection } from './AboutUsSection';
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
  FlaskConical,
  Gift
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
  const [activeView, setActiveView] = useState<'home' | 'products' | 'purity' | 'journey' | 'about' | 'why-us' | 'blogs' | 'faq' | 'careers' | 'certifications'>('home');
  const [activeSection, setActiveSection] = useState<'home' | 'products' | 'purity' | 'journey' | 'about' | 'why-us' | 'blogs' | 'faq' | 'careers' | 'certifications'>('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);

  // Product Offer Popup States
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [hasOfferEverOpened, setHasOfferEverOpened] = useState(false);
  const hasOfferTriggeredRef = useRef(false);

  // Auto-trigger offer popup when user scrolls down and completely opens the product section
  useEffect(() => {
    const productsSection = document.getElementById('products');
    if (!productsSection) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasOfferTriggeredRef.current) {
          hasOfferTriggeredRef.current = true;
          setTimeout(() => {
            setIsOfferModalOpen(true);
            setHasOfferEverOpened(true);
          }, 650);
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(productsSection);
    return () => observer.disconnect();
  }, [activeView]);

  const navigateToView = (view: 'home' | 'products' | 'purity' | 'journey' | 'about' | 'why-us' | 'blogs' | 'faq' | 'careers' | 'certifications') => {
    setIsMobileMenuOpen(false);
    if (view === 'products' && !hasOfferTriggeredRef.current) {
      hasOfferTriggeredRef.current = true;
      setTimeout(() => {
        setIsOfferModalOpen(true);
        setHasOfferEverOpened(true);
      }, 700);
    }

    if (view === 'home') {
      setActiveView('home');
      setActiveSection('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (activeView === 'home') {
      const targetId = view === 'journey' ? 'journey' : (view === 'certifications' ? 'organic-certifications' : view);
      const el = document.getElementById(targetId);
      if (el) {
        const offsetTop = el.getBoundingClientRect().top + window.pageYOffset - 75;
        window.scrollTo({ top: offsetTop, behavior: 'smooth' });
        setActiveSection(view);
        return;
      }
    }

    setActiveView('home');
    setActiveSection(view);
    setTimeout(() => {
      const targetId = view === 'journey' ? 'journey' : (view === 'certifications' ? 'organic-certifications' : view);
      const el = document.getElementById(targetId);
      if (el) {
        const offsetTop = el.getBoundingClientRect().top + window.pageYOffset - 75;
        window.scrollTo({ top: offsetTop, behavior: 'smooth' });
      }
    }, 60);
  };
  
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
      setShowBackToTop(window.scrollY > 400);

      const sectionIds: Array<'careers' | 'faq' | 'blogs' | 'why-us' | 'about' | 'journey' | 'purity' | 'products'> = [
        'careers',
        'faq',
        'blogs',
        'why-us',
        'about',
        'journey',
        'purity',
        'products'
      ];
      
      const scrollPos = window.scrollY + 220;

      if (window.scrollY < 300) {
        setActiveSection('home');
        return;
      }

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el && scrollPos >= el.offsetTop) {
          setActiveSection(id);
          return;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
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
            <RuduLogo height={45} className="landing-logo-img" />
          </div>
          
          <nav className={`landing-nav ${isMobileMenuOpen ? 'open' : ''}`}>
            <button onClick={() => navigateToView('home')} className={`nav-link ${activeSection === 'home' ? 'active' : ''}`}>Home</button>
            <button onClick={() => navigateToView('products')} className={`nav-link ${activeSection === 'products' ? 'active' : ''}`}>
              Our Products <span style={{ fontSize: '11px', marginLeft: '4px', opacity: 0.8 }}>▼</span>
            </button>
            <button onClick={() => navigateToView('purity')} className={`nav-link ${activeSection === 'purity' ? 'active' : ''}`}>Purity</button>
            <button onClick={() => navigateToView('journey')} className={`nav-link ${activeSection === 'journey' ? 'active' : ''}`}>Journey</button>
            <button onClick={() => navigateToView('about')} className={`nav-link ${activeSection === 'about' ? 'active' : ''}`}>About Us</button>
            <button onClick={() => navigateToView('why-us')} className={`nav-link ${activeSection === 'why-us' ? 'active' : ''}`}>Why Choose Us</button>
            <button onClick={() => navigateToView('blogs')} className={`nav-link ${activeSection === 'blogs' ? 'active' : ''}`}>Blogs</button>
            <button onClick={() => navigateToView('faq')} className={`nav-link ${activeSection === 'faq' ? 'active' : ''}`}>FAQ</button>
            <button onClick={() => navigateToView('careers')} className={`nav-link ${activeSection === 'careers' ? 'active' : ''}`}>Careers</button>
            <button onClick={() => handleLogin('farmer')} className="btn-landing-login mobile-login-item">
              <User size={15} />
              <span>Farmer Login</span>
            </button>
          </nav>

          <div className="landing-header-actions">
            <button 
              onClick={() => handleLogin('farmer')} 
              className="mobile-header-farmer-btn"
              title="Farmer Portal Login"
              aria-label="Farmer Login"
            >
              <User size={18} strokeWidth={2.2} />
            </button>

            <button 
              className="mobile-menu-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X size={23} strokeWidth={2.3} /> : <Menu size={23} strokeWidth={2.3} />}
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

      {/* Dedicated View Banner */}
      {activeView !== 'home' && (
        <div className="bg-amber-50 border-b border-amber-200 py-3 px-4 text-center text-xs sm:text-sm font-semibold text-amber-900 flex items-center justify-center gap-3 sticky top-[72px] z-30 shadow-sm">
          <span>Dedicated View: <strong>{activeView.replace('-', ' ').toUpperCase()}</strong></span>
          <button 
            onClick={() => navigateToView('home')} 
            className="bg-red-600 hover:bg-red-700 text-white font-bold px-3.5 py-1 rounded-full text-xs shadow-sm transition-all flex items-center gap-1"
          >
            <span>← View Full Landing Screen</span>
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <main className="landing-content-flow">
        {/* 1. Hero Section */}
        {activeView === 'home' && (
          <section id="home" className="relative w-full min-h-[85vh] bg-[#FAF8F5] flex items-center overflow-hidden">
            {/* Right Side Image Layer */}
            <div className="absolute top-0 right-0 w-full lg:w-1/2 h-[420px] sm:h-[490px] lg:h-full z-0 overflow-hidden">
              <img 
                src="/images/my_photo.jpg" 
                alt="Rudu Dairy Founder & Cow"
                className="w-full h-full object-cover object-[50%_0%] lg:object-[20%_top]"
              />
              <div className="hidden lg:block absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#FAF8F5] to-transparent pointer-events-none" />
              <div className="lg:hidden absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#FAF8F5] to-transparent pointer-events-none" />
            </div>

            {/* Hero Foreground Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 w-full relative z-10 pt-[370px] sm:pt-[450px] lg:pt-20">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-6 flex flex-col justify-center bg-[#FAF8F5]/90 lg:bg-transparent backdrop-blur-md lg:backdrop-blur-none p-6 lg:p-0 rounded-3xl shadow-xl lg:shadow-none border border-white/50 lg:border-none">
                  <div className="inline-flex items-center gap-2 text-red-600 text-xs sm:text-sm font-bold tracking-[0.2em] uppercase mb-3">
                    <Sparkles size={14} className="text-red-600" />
                    <span>Welcome To Rudu Dairy</span>
                  </div>

                  <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] text-gray-900 mb-5">
                    <span className="block text-gray-900">Pure Milk.</span>
                    <span className="block text-emerald-800">Trusted by</span>
                    <span className="block text-red-600">Every Home.</span>
                  </h1>

                  <p className="text-gray-600 text-sm sm:text-base lg:text-lg mb-8 max-w-lg font-medium leading-relaxed">
                    Directly from our local dairy farms to your doorstep. Experience 100% lab-tested pure, fresh, and unadulterated milk every morning.
                  </p>

                  <div className="flex flex-wrap items-center gap-4 mb-8">
                    <button 
                      onClick={() => navigateToView('products')} 
                      className="bg-red-600 hover:bg-red-700 text-white font-bold text-base px-7 py-3.5 rounded-full shadow-lg shadow-red-600/20 hover:shadow-xl hover:shadow-red-600/30 transition-all duration-300 flex items-center gap-2.5"
                    >
                      <Sliders size={18} />
                      <span>Our Products</span>
                    </button>
                    <button 
                      onClick={() => handleLogin('farmer')} 
                      className="bg-white hover:bg-gray-50 text-gray-800 border-2 border-gray-200 hover:border-gray-300 font-bold text-base px-7 py-3.5 rounded-full shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-2.5"
                    >
                      <Users size={18} className="text-gray-600" />
                      <span>Partner With Us</span>
                    </button>
                  </div>

                  {/* Feature Bar Pill */}
                  <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 border border-red-100/60 shadow-xl shadow-red-950/5 max-w-xl">
                    <div className="grid grid-cols-3 gap-2 sm:gap-4">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-red-50 border border-red-200 flex items-center justify-center flex-shrink-0 text-red-600 shadow-sm">
                          <ShieldCheck size={18} />
                        </div>
                        <div>
                          <h4 className="text-[11px] sm:text-xs font-bold text-gray-900 leading-snug">100% Pure</h4>
                          <p className="text-[10px] text-gray-500 font-medium hidden sm:block">Lab Tested</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-red-50 border border-red-200 flex items-center justify-center flex-shrink-0 text-red-600 shadow-sm">
                          <Heart size={18} />
                        </div>
                        <div>
                          <h4 className="text-[11px] sm:text-xs font-bold text-gray-900 leading-snug">Fresh Farm</h4>
                          <p className="text-[10px] text-gray-500 font-medium hidden sm:block">Daily Delivery</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-red-50 border border-red-200 flex items-center justify-center flex-shrink-0 text-red-600 shadow-sm">
                          <Award size={18} />
                        </div>
                        <div>
                          <h4 className="text-[11px] sm:text-xs font-bold text-gray-900 leading-snug">Best Quality</h4>
                          <p className="text-[10px] text-gray-500 font-medium hidden sm:block">FSSAI Certified</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 2. Real-time Impact & Metrics Banner */}
        {activeView === 'home' && (
          <div className="bg-white border-y border-gray-100 py-6 px-4 shadow-sm">
            <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
              <div className="border-r border-gray-100 last:border-r-0">
                <div className="text-2xl sm:text-3xl font-black text-red-600">
                  <AnimatedCounter target={totalHappyFarmers > 0 ? totalHappyFarmers : 500} suffix="+" />
                </div>
                <div className="text-xs sm:text-sm font-semibold text-gray-600 mt-1">Supplying Farmers</div>
              </div>
              <div className="border-r border-gray-100 last:border-r-0">
                <div className="text-2xl sm:text-3xl font-black text-gray-900">
                  <AnimatedCounter target={totalVillages > 0 ? totalVillages : 15} suffix="+" />
                </div>
                <div className="text-xs sm:text-sm font-semibold text-gray-600 mt-1">Partner Villages</div>
              </div>
              <div className="border-r border-gray-100 last:border-r-0">
                <div className="text-2xl sm:text-3xl font-black text-emerald-700">
                  <AnimatedCounter target={totalDailyVolume > 0 ? Math.round(totalDailyVolume) : 12500} suffix=" L" />
                </div>
                <div className="text-xs sm:text-sm font-semibold text-gray-600 mt-1">Daily Pure Volume</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-amber-600">100%</div>
                <div className="text-xs sm:text-sm font-semibold text-gray-600 mt-1">GC Lab Tested Purity</div>
              </div>
            </div>
          </div>
        )}

        {/* 3. Products Section */}
        {(activeView === 'home' || activeView === 'products') && (
          <section id="products" className="products-catalog-section py-16 scroll-mt-20">
            <div className="catalog-container">
              <div className="landing-section-header">
                <span className="section-tagline">Fresh Offerings</span>
                <h2 className="section-main-title">Our Premium Dairy Range</h2>
                <p className="section-desc">Explore our range of organic, nutrition-rich, and pure dairy products crafted for your healthy lifestyle.</p>
              </div>

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

              {/* Interactive Subscription Calculator */}
              <SubscriptionCalculator 
                onSelectPlan={(plan) => {
                  setQuickOrderProduct({
                    name: `${plan.product} (Monthly Subscription)`,
                    price: `₹${plan.monthlyCost}/mo`,
                    tag: 'Fresh Morning Trial',
                    desc: `${plan.quantity}L daily • Morning delivery to ${plan.locality || 'your area'} by 6:15 AM before tea`,
                  });
                  setSelectedPackSize(`${plan.quantity} L`);
                  setOrderQuantity(1);
                  setOrderConfirmed(false);
                }}
              />
            </div>
          </section>
        )}

        {/* 4. Purity Section */}
        {(activeView === 'home' || activeView === 'purity') && (
          <section id="purity" className="purity-pillars-section py-16 scroll-mt-20">
            <div className="purity-container">
              <div className="landing-section-header">
                <span className="section-tagline">Commitment to Quality</span>
                <h2 className="section-main-title">Purity Tested. Quality Assured.</h2>
                <p className="section-desc">We follow rigorous processing guidelines to bring you delicious, high-quality, and nutritious dairy essentials.</p>
              </div>

              <div className="flex overflow-x-auto md:grid md:grid-cols-3 gap-5 px-6 md:px-5 pb-4 max-w-5xl mx-auto snap-x snap-mandatory no-scrollbar -mx-4 md:mx-auto">
                <div className="flex-shrink-0 w-[82vw] sm:w-[68vw] max-w-[290px] md:w-auto snap-center bg-white p-7 rounded-3xl text-center shadow-lg shadow-black/[0.04] border border-stone-100 flex flex-col justify-between">
                  <div className="pillar-icon-box" style={{ background: '#fee2e2', color: '#dc2626', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}><ShieldCheck size={30} /></div>
                  <div>
                    <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '10px' }}>GC Tested Purity</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">Our ghee batches undergo Gas Chromatography testing to prove complete purity and detect any adulterations.</p>
                  </div>
                </div>
                <div className="flex-shrink-0 w-[82vw] sm:w-[68vw] max-w-[290px] md:w-auto snap-center bg-white p-7 rounded-3xl text-center shadow-lg shadow-black/[0.04] border border-stone-100 flex flex-col justify-between">
                  <div className="pillar-icon-box" style={{ background: '#fef3c7', color: '#d97706', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}><Droplets size={30} /></div>
                  <div>
                    <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '10px' }}>Clean & Hygienic</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">Processed touch-free using state-of-the-art packaging systems, ensuring clean food safety from milking to delivery.</p>
                  </div>
                </div>
                <div className="flex-shrink-0 w-[82vw] sm:w-[68vw] max-w-[290px] md:w-auto snap-center bg-white p-7 rounded-3xl text-center shadow-lg shadow-black/[0.04] border border-stone-100 flex flex-col justify-between">
                  <div className="pillar-icon-box" style={{ background: '#dbeafe', color: '#2563eb', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}><Users size={30} /></div>
                  <div>
                    <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '10px' }}>Empowering Farmers</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">Procuring directly from local villages with computerized fat testing, securing fair rates and bi-weekly payouts.</p>
                  </div>
                </div>
              </div>

              {/* Mobile Swipe Cue */}
              <div className="text-center md:hidden mt-2 text-[11px] font-semibold text-stone-400 flex items-center justify-center gap-1">
                <span>Swipe quality pillars to explore</span>
                <span>→</span>
              </div>

              {/* Interactive Live Purity Batch Checker */}
              <div className="mt-12">
                <PurityBatchChecker />
              </div>
            </div>
          </section>
        )}

        {/* Packet Milk vs. Rudu Farm Fresh Comparison Section */}
        {(activeView === 'home' || activeView === 'purity' || activeView === 'why-us') && (
          <MilkComparisonSection />
        )}

        {/* Globally Certified Organic Goodness Section */}
        {(activeView === 'home' || activeView === 'purity' || activeView === 'certifications') && (
          <OrganicCertificationsSection />
        )}

        {/* 5. Journey Section (Connected Timeline with Images) */}
        {(activeView === 'home' || activeView === 'journey') && (
          <MilkJourneyTimeline />
        )}

        {/* 6. About Us Section */}
        {(activeView === 'home' || activeView === 'about') && (
          <AboutUsSection onNavigateToJourney={() => navigateToView('journey')} />
        )}

        {/* 7. Why Choose Us Section */}
        {(activeView === 'home' || activeView === 'why-us') && (
          <section id="why-us" className="py-16 px-4 max-w-6xl mx-auto scroll-mt-20">
            <div className="landing-section-header text-center mb-10">
              <span className="section-tagline">Why Choose Us</span>
              <h2 className="section-main-title">Why Farmers & Families Prefer Rudu</h2>
              <p className="section-desc">Transparent fat testing, zero middlemen, guaranteed government rates, and 100% pure lab-tested farm fresh milk.</p>
            </div>

            <div className="flex overflow-x-auto md:grid md:grid-cols-3 gap-5 pb-4 -mx-4 px-6 md:mx-auto md:px-0 snap-x snap-mandatory no-scrollbar">
              <div className="flex-shrink-0 w-[82vw] sm:w-[68vw] max-w-[310px] md:w-auto snap-center bg-white rounded-3xl p-6 shadow-xl border border-red-100 text-center hover:shadow-2xl transition-all duration-300 flex flex-col justify-between">
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 mx-auto flex items-center justify-center mb-4 shadow-sm">
                    <ShieldCheck size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">100% Digital Fat Testing</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">Computerized fat & SNF testing machines ensure error-free pricing with instant printed slips.</p>
                </div>
              </div>
              <div className="flex-shrink-0 w-[82vw] sm:w-[68vw] max-w-[310px] md:w-auto snap-center bg-white rounded-3xl p-6 shadow-xl border border-red-100 text-center hover:shadow-2xl transition-all duration-300 flex flex-col justify-between">
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 mx-auto flex items-center justify-center mb-4 shadow-sm">
                    <CreditCard size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Direct Bank Payouts</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">Eliminate middleman commissions with bi-weekly direct bank payouts for all supplying farmers.</p>
                </div>
              </div>
              <div className="flex-shrink-0 w-[82vw] sm:w-[68vw] max-w-[310px] md:w-auto snap-center bg-white rounded-3xl p-6 shadow-xl border border-red-100 text-center hover:shadow-2xl transition-all duration-300 flex flex-col justify-between">
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center mb-4 shadow-sm">
                    <Droplets size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">4°C Cold Chain Transit</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">Rapid chilling units maintain fresh quality, natural nutrients, and zero bacterial growth.</p>
                </div>
              </div>
            </div>

            {/* Mobile Swipe Cue */}
            <div className="text-center md:hidden mt-2 text-[11px] font-semibold text-stone-400 flex items-center justify-center gap-1">
              <span>Swipe benefits to view all</span>
              <span>→</span>
            </div>
          </section>
        )}

        {/* 8. Blogs Section */}
        {(activeView === 'home' || activeView === 'blogs') && (
          <BlogSection />
        )}

        {/* 9. FAQ Section */}
        {(activeView === 'home' || activeView === 'faq') && (
          <section id="faq" className="faq-section py-16 scroll-mt-20">
            <div className="faq-container" style={{ maxWidth: '800px', margin: '0 auto', padding: '0 20px' }}>
              <div className="landing-section-header text-center mb-10">
                <span className="section-tagline">Got Questions?</span>
                <h2 className="section-main-title">Common Questions & Answers</h2>
              </div>

              <div className="faq-accordion-box">
                {BUSINESS.faqs.map((faq, idx) => (
                  <div 
                    key={idx} 
                    className={`faq-item ${openFaqIndex === idx ? 'open' : ''}`}
                    onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                    style={{ background: '#fff', marginBottom: '10px', borderRadius: '16px', border: '1px solid #e5e7eb', padding: '16px', cursor: 'pointer' }}
                  >
                    <div className="faq-question-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h4 style={{ fontWeight: 700 }}>{faq.question}</h4>
                      <span className="faq-toggle-icon">{openFaqIndex === idx ? <ChevronUp size={18} /> : <ChevronDown size={18} />}</span>
                    </div>
                    {openFaqIndex === idx && <div className="faq-answer-body pt-3 text-gray-600 text-sm"><p>{faq.answer}</p></div>}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 9. Careers Section */}
        {(activeView === 'home' || activeView === 'careers') && (
          <section id="careers" className="py-16 px-4 max-w-5xl mx-auto scroll-mt-20">
            <div className="landing-section-header text-center mb-10">
              <span className="section-tagline">Join Our Team</span>
              <h2 className="section-main-title">Build the Future of Smart Dairy</h2>
              <p className="section-desc">We are always looking for passionate individuals in dairy technology, logistics, and quality assurance.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { title: "Dairy Quality Assurance Officer", location: "Mathura / Agra Hub", dept: "Quality Control", type: "Full Time" },
                { title: "Village Collection Center Supervisor", location: "Aligarh / Hathras", dept: "Operations", type: "Full Time" },
                { title: "Cold Chain Transport Coordinator", location: "Noida / Greater Noida", dept: "Logistics", type: "Full Time" },
                { title: "Farmer Relation Manager", location: "Mathura District", dept: "Community", type: "Full Time" }
              ].map((job, idx) => (
                <div key={idx} className="bg-white rounded-3xl p-6 shadow-xl border border-gray-200 flex flex-col justify-between hover:shadow-2xl transition-all duration-300">
                  <div>
                    <span className="text-xs font-bold bg-red-50 text-red-600 px-3 py-1 rounded-full">{job.dept}</span>
                    <h3 className="text-xl font-extrabold text-gray-900 mt-3 mb-1">{job.title}</h3>
                    <p className="text-xs text-gray-500 font-medium"><MapPin size={13} className="inline mr-1" />{job.location} • {job.type}</p>
                  </div>
                  <button 
                    onClick={() => { setSelectedJob(job); setIsCareerModalOpen(true); }}
                    className="mt-6 bg-red-600 hover:bg-red-700 text-white font-bold text-sm py-2.5 px-5 rounded-full shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <span>Apply Now</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* 10. Footer Section */}
      <footer id="footer" className="landing-footer-milky">
        <div className="footer-milky-content">
          <div className="footer-milky-logo flex justify-center items-center py-2">
            <RuduLogo height={48} className="mx-auto" />
          </div>

          <div className="footer-milky-links">
            <div className="footer-milky-links-row">
              <button onClick={() => navigateToView('products')}>Products</button>
              <button onClick={() => navigateToView('about')}>About Us</button>
              <button onClick={() => navigateToView('why-us')}>Why Choose Us</button>
            </div>
            <div className="footer-milky-links-row">
              <button onClick={() => navigateToView('blogs')}>Blogs</button>
              <button onClick={() => navigateToView('faq')}>FAQ</button>
              <button onClick={() => navigateToView('careers')}>Careers</button>
            </div>
          </div>

          <div className="footer-milky-socials">
            <a href="#" className="social-circle" title="LinkedIn"><Linkedin size={18} /></a>
            <a href="#" className="social-circle" title="Facebook"><Facebook size={18} /></a>
            <a href="#" className="social-circle" title="YouTube"><Youtube size={18} /></a>
            <a href="#" className="social-circle" title="Instagram"><Instagram size={18} /></a>
          </div>
        </div>

        <div className="footer-milky-bottom">
          <div className="max-w-6xl mx-auto px-4 flex justify-center items-center h-full">
            <span>© Copyright {new Date().getFullYear()}. All Rights Reserved</span>
          </div>
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


      {/* Product Offer Popup Modal */}
      <ProductOfferModal
        isOpen={isOfferModalOpen}
        onClose={() => setIsOfferModalOpen(false)}
        onClaimOffer={(coupon) => {
          const el = document.getElementById('products');
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        }}
      />

      {/* Re-open Offer Floating Badge (visible once offer has opened and is currently dismissed) */}
      {!isOfferModalOpen && hasOfferEverOpened && (
        <button
          onClick={() => setIsOfferModalOpen(true)}
          className="fixed bottom-4 sm:bottom-6 left-3 sm:left-6 z-40 bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-700 hover:to-amber-600 text-white font-extrabold text-[11px] sm:text-xs px-3 py-2 sm:px-4 sm:py-2.5 rounded-full shadow-xl shadow-red-950/20 flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95 cursor-pointer border border-white/90"
          title="Claim 25% OFF Product Offer"
          aria-label="Open 25% OFF Offer"
        >
          <Gift size={15} className="text-amber-200 animate-pulse" />
          <span>25% OFF Offer</span>
        </button>
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
