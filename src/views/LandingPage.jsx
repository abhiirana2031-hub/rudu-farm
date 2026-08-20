import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useFarm } from '../context/FarmContext';
import { RuduLogo } from '../components/RuduLogo';
import { CinematicHeroSection } from '../components/CinematicHeroSection';
import { 
  Milk, 
  Users, 
  UserCheck, 
  Sliders, 
  Printer, 
  CreditCard, 
  BookOpen, 
  BarChart3, 
  ShieldCheck, 
  Smartphone, 
  User, 
  Shield, 
  MapPin, 
  Droplets, 
  CheckCircle, 
  Lock, 
  ArrowRight,
  Sparkles,
  LayoutGrid,
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
  HelpCircle,
  FileText,
  ChevronDown,
  ChevronUp,
  Building2,
  Target,
  Eye,
  Upload,
  Clock,
  Tag,
  Search,
  Check
} from 'lucide-react';

const Facebook = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const Twitter = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const Instagram = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const Youtube = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" />
  </svg>
);

// Animated Counter Component
const AnimatedCounter = ({ target, suffix = '', duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const startTime = performance.now();
          const animate = (currentTime) => {
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

export const LandingPage = () => {
  const { setIsAuthModalOpen, setCurrentRole } = useFarm();
  const [activeProductTab, setActiveProductTab] = useState('milk');
  const [activeSection, setActiveSection] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);
  
  // Quick Order Modal States
  const [quickOrderProduct, setQuickOrderProduct] = useState(null);
  const [selectedPackSize, setSelectedPackSize] = useState('1 L');
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [orderConfirmed, setOrderConfirmed] = useState(false);

  // About Us States
  const [aboutSubTab, setAboutSubTab] = useState('story');

  // Blog States
  const [blogCategory, setBlogCategory] = useState('All');
  const [selectedArticle, setSelectedArticle] = useState(null);

  // FAQ States
  const [faqCategory, setFaqCategory] = useState('Payment');
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  // Career States
  const [showCareersSection, setShowCareersSection] = useState(false);
  const [isCareerModalOpen, setIsCareerModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [careerFormData, setCareerFormData] = useState({ name: '', email: '', phone: '', cover: '', resumeName: '' });
  const [careerSubmitted, setCareerSubmitted] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 180;
      setShowBackToTop(window.scrollY > 400);

      const homeEl = document.documentElement;
      const productsEl = document.getElementById('products');
      const purityEl = document.getElementById('purity');
      const processEl = document.getElementById('process');

      if (productsEl && scrollPos >= productsEl.offsetTop && scrollPos < purityEl.offsetTop) {
        setActiveSection('products');
      } else if (purityEl && scrollPos >= purityEl.offsetTop && scrollPos < processEl.offsetTop) {
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

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSubmitted(true);
      setNewsletterEmail('');
      setTimeout(() => setNewsletterSubmitted(false), 4000);
    }
  };

  const handleLogin = (role) => {
    setIsMobileMenuOpen(false);
    setCurrentRole(role);
    setIsAuthModalOpen(true);
  };

  const scrollToSection = (id) => {
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
      {/* 1. Cinematic Hero Section with Looping Video Background & Seamless Navigation */}
      <CinematicHeroSection 
        onScrollToSection={scrollToSection} 
        onHandleLogin={handleLogin} 
      />

      {/* 2. Products Tabbed Catalog */}
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

      {/* ================= ABOUT US SECTION (MATCHING USER IMAGE EXACTLY) ================= */}
      <section id="about" className="about-us-section-v2">
        <div className="about-v2-container">
          
          {/* 1. HERO BANNER: WHO WE ARE */}
          <div className="about-v2-hero">
            <div className="about-v2-hero-content">
              <span className="v2-tag-red">WHO WE ARE</span>
              <h1 className="v2-hero-title">About Rudu Dairy</h1>
              <p className="v2-hero-desc">
                Rudu Dairy is more than just a dairy—it’s a promise of purity, transparency, and trust. 
                We are dedicated to building a better future for farmers, animals, and every home we serve.
              </p>

              <div className="v2-hero-cta-row">
                <button className="v2-btn-journey" onClick={() => scrollToSection('process')}>
                  <BookOpen size={16} /> <span>Our Journey</span>
                </button>
                <button className="v2-btn-mission" onClick={() => scrollToSection('about-values')}>
                  <Target size={16} /> <span>Our Mission</span>
                </button>
              </div>

              {/* Floating Feature Pill Bar */}
              <div className="v2-feature-pill-bar">
                <div className="v2-pill-item">
                  <span className="v2-pill-icon red-icon"><Heart size={16} color="#C5221F" /></span>
                  <div>
                    <div className="v2-pill-title">Love & Care</div>
                    <div className="v2-pill-sub">for Animals</div>
                  </div>
                </div>
                <div className="v2-pill-divider"></div>
                <div className="v2-pill-item">
                  <span className="v2-pill-icon red-icon"><ShieldCheck size={16} color="#C5221F" /></span>
                  <div>
                    <div className="v2-pill-title">100% Transparent</div>
                    <div className="v2-pill-sub">Milk Collection</div>
                  </div>
                </div>
                <div className="v2-pill-divider"></div>
                <div className="v2-pill-item">
                  <span className="v2-pill-icon red-icon"><Users size={16} color="#C5221F" /></span>
                  <div>
                    <div className="v2-pill-title">Empowering</div>
                    <div className="v2-pill-sub">Rural Farmers</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="about-v2-hero-image-col">
              <div className="v2-hero-image-frame">
                <img 
                  src="/images/rudu_farmer_clean.jpg" 
                  alt="Rudu Dairy Farmer with Cow" 
                  className="v2-farmer-img"
                  onError={(e) => { e.currentTarget.src = '/images/rudu_hero_farmer.jpg'; }}
                />
              </div>
            </div>
          </div>

          {/* 2. OUR STORY SECTION */}
          <div className="about-v2-story-block">
            <div className="v2-story-grid">
              <div className="v2-story-text-col">
                <span className="v2-tag-red">OUR STORY</span>
                <h2 className="v2-block-title">Built on Trust, Grown with Experience</h2>
                <p className="v2-story-p">
                  Rudu Dairy was founded in 2026 with a simple but powerful purpose — to bring honesty, technology, and compassion together in the dairy industry.
                </p>
                <p className="v2-story-p">
                  With 8 years of hands-on experience in animal care and dairy management, we understand the needs of both farmers and animals. Our mission is to ensure every drop of milk is pure, every farmer is respected, and every animal is treated with love.
                </p>
                <p className="v2-story-p">
                  We started this journey from the heart of Mathura dairy belt and today, we are building a modern, farmer-first ecosystem that delivers real value and long-term prosperity.
                </p>
              </div>

              {/* Statistics Box */}
              <div className="v2-stats-card">
                <div className="v2-stat-row">
                  <div className="v2-stat-icon-box"><Clock size={22} color="#C5221F" /></div>
                  <div className="v2-stat-info">
                    <span className="v2-stat-label">Founded In</span>
                    <span className="v2-stat-val">2026</span>
                  </div>
                </div>
                <div className="v2-stat-divider"></div>

                <div className="v2-stat-row">
                  <div className="v2-stat-icon-box"><Award size={22} color="#C5221F" /></div>
                  <div className="v2-stat-info">
                    <span className="v2-stat-label">Experience In Animals</span>
                    <span className="v2-stat-val">8+ Years</span>
                  </div>
                </div>
                <div className="v2-stat-divider"></div>

                <div className="v2-stat-row">
                  <div className="v2-stat-icon-box"><Users size={22} color="#C5221F" /></div>
                  <div className="v2-stat-info">
                    <span className="v2-stat-label">Farmers Connected</span>
                    <span className="v2-stat-val">500+</span>
                  </div>
                </div>
                <div className="v2-stat-divider"></div>

                <div className="v2-stat-row">
                  <div className="v2-stat-icon-box"><Droplets size={22} color="#C5221F" /></div>
                  <div className="v2-stat-info">
                    <span className="v2-stat-label">Daily Milk Collection</span>
                    <span className="v2-stat-val">10,000+ Liters</span>
                  </div>
                </div>
                <div className="v2-stat-divider"></div>

                <div className="v2-stat-row">
                  <div className="v2-stat-icon-box"><MapPin size={22} color="#C5221F" /></div>
                  <div className="v2-stat-info">
                    <span className="v2-stat-label">Serving In</span>
                    <span className="v2-stat-val">Northern India</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3. OUR VALUES SECTION */}
          <div id="about-values" className="about-v2-values-block">
            <div className="v2-section-center-header">
              <span className="v2-tag-red">OUR VALUES</span>
              <h2 className="v2-block-title">Guided by Care, Driven by Purpose</h2>
              <div className="v2-leaf-divider">
                <span className="v2-line"></span>
                <span className="v2-leaf-icon">🍃</span>
                <span className="v2-line"></span>
              </div>
            </div>

            <div className="v2-values-grid">
              <div className="v2-value-card">
                <div className="v2-val-icon-circle"><Heart size={22} color="#C5221F" fill="#C5221F" /></div>
                <h4>Love for Animals</h4>
                <p>We treat every animal with kindness and ensure their health and happiness comes first.</p>
              </div>

              <div className="v2-value-card">
                <div className="v2-val-icon-circle"><ShieldCheck size={22} color="#C5221F" /></div>
                <h4>Transparency</h4>
                <p>Every drop of milk is tested, measured, and recorded transparently through modern technology.</p>
              </div>

              <div className="v2-value-card">
                <div className="v2-val-icon-circle"><User size={22} color="#C5221F" /></div>
                <h4>Farmer First</h4>
                <p>We empower rural dairy farmers by giving them fair prices, timely payments, and continuous support.</p>
              </div>

              <div className="v2-value-card">
                <div className="v2-val-icon-circle"><Leaf size={22} color="#C5221F" /></div>
                <h4>Pure & Natural</h4>
                <p>From farm to home, we ensure 100% pure, natural, and safe dairy products for your family.</p>
              </div>
            </div>
          </div>

          {/* 4. WHAT WE DO SECTION */}
          <div className="about-v2-what-block">
            <div className="v2-what-grid">
              <div className="v2-what-text-col">
                <span className="v2-tag-red">WHAT WE DO</span>
                <h2 className="v2-block-title">From Our Farms To Your Family</h2>
                <p className="v2-what-sub">
                  We operate modern milk collection units, follow strict quality protocols, and use technology to ensure purity at every step.
                </p>

                <ul className="v2-checklist">
                  <li>
                    <span className="v2-check-circle"><Check size={12} strokeWidth={3} /></span>
                    <span>Automated Milk Collection Units (AMCU)</span>
                  </li>
                  <li>
                    <span className="v2-check-circle"><Check size={12} strokeWidth={3} /></span>
                    <span>Milk Testing & Fat/SNF Analysis</span>
                  </li>
                  <li>
                    <span className="v2-check-circle"><Check size={12} strokeWidth={3} /></span>
                    <span>Farmer Training & Support</span>
                  </li>
                  <li>
                    <span className="v2-check-circle"><Check size={12} strokeWidth={3} /></span>
                    <span>Timely Payments & Digital Records</span>
                  </li>
                  <li>
                    <span className="v2-check-circle"><Check size={12} strokeWidth={3} /></span>
                    <span>Ethical & Hygienic Practices</span>
                  </li>
                </ul>
              </div>

              <div className="v2-what-img-col">
                <img 
                  src="https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=1000&q=80" 
                  alt="Modern Dairy Farm Shed and Silos" 
                  className="v2-farm-shed-img"
                  onError={(e) => { e.currentTarget.src = '/images/dairy_farm_bg.png'; }}
                />
              </div>
            </div>
          </div>

          {/* 5. OUR PROMISE BANNER */}
          <div className="about-v2-promise-banner">
            <div className="v2-promise-icon-box">
              <Heart size={24} color="#C5221F" fill="#C5221F" />
            </div>
            <div className="v2-promise-content">
              <h4 className="v2-promise-title">Our Promise</h4>
              <p className="v2-promise-text">
                We promise to continue working with honesty, caring for animals, supporting farmers, and delivering pure milk to every home. Rudu Dairy is not just our business — it's our responsibility.
              </p>
            </div>
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
                <img src="/milk.png" alt="Rudu farm fresh milk" className="brand-story-img" />
                <div className="brand-story-badge">
                  <span className="badge-year">Est.</span>
                  <span className="badge-number">2020</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Statistics Bar — Animated Counters */}
      <section className="landing-stats">
        <div className="stats-bar-content">
          <div className="stat-metric-item">
            <div className="stat-metric-icon"><Users size={20} /></div>
            <div>
              <div className="stat-number"><AnimatedCounter target={500} suffix="+" /></div>
              <div className="stat-label">Happy Farmers</div>
            </div>
          </div>

          <div className="stat-metric-item">
            <div className="stat-metric-icon"><MapPin size={20} /></div>
            <div>
              <div className="stat-number"><AnimatedCounter target={15} suffix="+" /></div>
              <div className="stat-label">Villages Sourced</div>
            </div>
          </div>

          <div className="stat-metric-item">
            <div className="stat-metric-icon"><Droplets size={20} /></div>
            <div>
              <div className="stat-number"><AnimatedCounter target={5000} suffix="+" /></div>
              <div className="stat-label">Liters / Day</div>
            </div>
          </div>

          <div className="stat-metric-item">
            <div className="stat-metric-icon"><CheckCircle size={20} /></div>
            <div>
              <div className="stat-number"><AnimatedCounter target={99} suffix=".9%" /></div>
              <div className="stat-label">Accuracy Rate</div>
            </div>
          </div>

          <div className="stat-metric-item">
            <div className="stat-metric-icon"><Lock size={20} /></div>
            <div>
              <div className="stat-number"><AnimatedCounter target={100} suffix="%" /></div>
              <div className="stat-label">Secure Logs</div>
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
              <img src="/milk.png" alt="Fresh milk collection" />
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
              <img src="/milk.png" alt="Quality testing" />
              <div className="gallery-overlay"><span>Quality Testing</span></div>
            </div>
            <div className="gallery-item gallery-item-wide">
              <img src="/images/fresh_dairy_products.png" alt="Farm to table" />
              <div className="gallery-overlay"><span>Farm to Table</span></div>
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

      {/* ================= KNOWLEDGE & UPDATES SECTION ================= */}
      <section id="blog" className="blogs-section">
        <div className="blogs-container">
          <div className="landing-section-header">
            <span className="section-tagline">Knowledge & Updates</span>
            <h2 className="section-main-title">Dairy Blog & Industry News</h2>
            <p className="section-desc">Expert articles on dairy farming techniques, cattle health management, and recent company announcements.</p>
          </div>

          {/* Category Filter Pills */}
          <div className="blog-filter-tabs">
            {['All', 'Dairy Farming Tips', 'Animal Health', 'Company Updates'].map((cat) => (
              <button 
                key={cat} 
                className={`blog-filter-pill ${blogCategory === cat ? 'active' : ''}`}
                onClick={() => setBlogCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Blog Cards Grid */}
          <div className="blogs-grid">
            {[
              {
                id: 1,
                title: "5 Proven Strategies to Increase Milk Yield & Fat Percentage in Summer",
                category: "DAIRY FARMING TIPS",
                filterCategory: "Dairy Farming Tips",
                date: "July 24, 2026",
                readTime: "4 min read",
                author: "By Dr. Sunita Rao",
                img: "/images/fresh_dairy_products.png",
                desc: "Discover cattle feeding adjustments, mineral mixture ratios, and water management tactics to sustain peak milk fat levels during heat waves."
              },
              {
                id: 2,
                title: "Preventing Mastitis in High-Yielding Cattle: Early Detection & Hygiene Protocol",
                category: "ANIMAL HEALTH",
                filterCategory: "Animal Health",
                date: "July 18, 2026",
                readTime: "5 min read",
                author: "By Dr. Ramesh Chaudhary",
                img: "/images/hero_farm_background.png",
                desc: "A practical guide to somatic cell count monitoring, pre-milking teat dips, and udder hygiene routines for dairy farmers."
              },
              {
                id: 3,
                title: "Rudu Dairy Expands 12 New Automated Collection Hubs in Aligarh District",
                category: "COMPANY UPDATES",
                filterCategory: "Company Updates",
                date: "July 10, 2026",
                readTime: "3 min read",
                author: "By Rudu News Desk",
                img: "/images/rudu_milk_product.png",
                desc: "Over 800 new village farmers gain access to instant digital weighing slips and direct bank account daily payouts."
              },
              {
                id: 4,
                category: "DAIRY FARMING TIPS",
                filterCategory: "Dairy Farming Tips",
                readTime: "4 min read",
                date: "July 05, 2026",
                title: "Clean Milk Production: Reducing Bacterial Load at Village Collection Centers",
                desc: "Essential sanitization steps for stainless steel milk cans, rapid chilling routines, and temperature control guidelines.",
                author: "By Er. Vikramaditya",
                img: "/milk.png"
              },
              {
                id: 5,
                category: "ANIMAL HEALTH",
                filterCategory: "Animal Health",
                readTime: "6 min read",
                date: "June 15, 2026",
                title: "Balanced Cattle Nutrition: The Role of Green Fodder & Silage Management",
                desc: "How making maize and sorghum silage ensures year-round green fodder availability and maintains digestive health.",
                author: "By Dr. Sunita Rao",
                img: "/images/fresh_dairy_products.png"
              },
              {
                id: 6,
                category: "COMPANY UPDATES",
                filterCategory: "Company Updates",
                readTime: "2 min read",
                date: "June 02, 2026",
                title: "Rudu Dairy Receives National Quality Excellence Award 2026",
                desc: "Recognized for transparent supply chain practices, zero adulteration testing protocols, and farmer welfare programs.",
                author: "By Rudu News Desk",
                img: "/images/rudu_milk_product.png"
              }
            ]
              .filter(article => blogCategory === 'All' || article.filterCategory === blogCategory)
              .map(article => (
                <div key={article.id} className="blog-card">
                  <div className="blog-img-box">
                    <span className="blog-red-badge">{article.category}</span>
                    <img src={article.img} alt={article.title} className="blog-img" />
                  </div>
                  <div className="blog-info-box">
                    <div className="blog-meta-row">
                      <span>⏱️ {article.readTime}</span>
                      <span className="blog-meta-dot">&bull;</span>
                      <span>{article.date}</span>
                    </div>
                    <h3 className="blog-title">{article.title}</h3>
                    <p className="blog-desc">{article.desc}</p>
                    <div className="blog-bottom-row">
                      <span className="blog-author">{article.author}</span>
                      <button className="blog-read-link" onClick={() => setSelectedArticle(article)}>
                        <span>Read Article</span>
                        <ArrowRight size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* ================= FAQ SECTION ================= */}
      <section id="faq" className="faq-section">
        <div className="faq-container">
          <div className="landing-section-header">
            <span className="section-tagline">Got Questions?</span>
            <h2 className="section-main-title">Frequently Asked Questions</h2>
            <p className="section-desc">Clear answers regarding daily milk payments, Fat & SNF calculation, farmer registration, and quality testing.</p>
          </div>

          {/* Category Tabs */}
          <div className="faq-categories-row">
            {[
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

      {/* ================= CAREERS SECTION (HIDDEN BY DEFAULT, ACCESSIBLE VIA FOOTER/NAV) ================= */}
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
      <footer id="footer" className="landing-footer">
        <div className="footer-columns">
          {/* Col 1 */}
          <div className="footer-col-about">
            <RuduLogo height={45} style={{ marginBottom: '14px' }} />
            <p className="footer-about-text">
              Transforming traditional dairy cooperative management with real-time digital tracking, GC verified testing records, and immediate transparent banking.
            </p>
          </div>

          {/* Col 2 */}
          <div className="footer-col-links">
            <h4>Company & Links</h4>
            <ul>
              <li><button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Home</button></li>
              <li><button onClick={() => scrollToSection('about')}>About Us</button></li>
              <li><button onClick={() => scrollToSection('products')}>Our Products</button></li>
              <li><button onClick={() => scrollToSection('purity')}>Purity Standards</button></li>
              <li><button onClick={() => scrollToSection('blog')}>Blog & News</button></li>
              <li><button onClick={() => scrollToSection('faq')}>FAQ</button></li>
              <li><button onClick={() => { setShowCareersSection(true); setTimeout(() => scrollToSection('careers'), 100); }}>Careers</button></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="footer-col-links">
            <h4>Products</h4>
            <ul>
              <li><button onClick={() => scrollToSection('products')}>Fresh Milk</button></li>
              <li><button onClick={() => scrollToSection('products')}>Danedar Ghee</button></li>
              <li><button onClick={() => scrollToSection('products')}>Thick Curd</button></li>
              <li><button onClick={() => scrollToSection('products')}>Soft Paneer</button></li>
            </ul>
          </div>

          {/* Col 4 */}
          <div className="footer-col-contact">
            <h4>Get In Touch</h4>
            <div className="footer-contact-item">
              <Phone size={14} />
              <span>+91 8859171700</span>
            </div>
            <div className="footer-contact-item">
              <Mail size={14} />
              <span>support@rudu.com</span>
            </div>
            <div className="footer-contact-item">
              <MapPin size={14} />
              <span>Rudu Dairy Cooperative Headquarters, Uttar Pradesh, India</span>
            </div>
          </div>

          {/* Col 5 */}
          <div className="footer-col-social">
            <h4>Follow Our Growth</h4>
            <div className="social-icons-row">
              <a href="#" className="social-icon-btn" title="Facebook"><Facebook size={16} /></a>
              <a href="#" className="social-icon-btn" title="Twitter"><Twitter size={16} /></a>
              <a href="#" className="social-icon-btn" title="Instagram"><Instagram size={16} /></a>
              <a href="#" className="social-icon-btn" title="Youtube"><Youtube size={16} /></a>
            </div>
          </div>
        </div>

        <div className="footer-bottom-row" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', textAlign: 'center' }}>
          <p>© 2026 Rudu Dairy Management Systems (Creamy Foods Cooperative Limited). All rights reserved.</p>
          <button 
            className="footer-mobile-careers-btn"
            onClick={() => {
              setShowCareersSection(true);
              setTimeout(() => scrollToSection('careers'), 100);
            }}
          >
            <Briefcase size={14} />
            <span>Careers / Work With Us</span>
          </button>
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
              <p className="article-lead">{selectedArticle.summary}</p>
              <div className="article-full-text">
                <p>{selectedArticle.fullContent}</p>
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
                <form className="career-form" onSubmit={(e) => {
                  e.preventDefault();
                  setCareerSubmitted(true);
                }}>
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
                            if (e.target.files[0]) {
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
                    onClick={() => setOrderConfirmed(true)} 
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
