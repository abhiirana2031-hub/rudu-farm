import React, { useState, useMemo, useEffect } from 'react';
import { 
  ShoppingBag, 
  Zap, 
  ShieldCheck, 
  Droplets, 
  CheckCircle2, 
  Star, 
  Clock, 
  Truck, 
  ArrowLeft, 
  ArrowRight, 
  X, 
  Search, 
  Filter, 
  Sparkles, 
  ChevronRight, 
  Phone, 
  MessageCircle, 
  RefreshCw, 
  Award, 
  Heart, 
  Check, 
  Info,
  Calendar,
  Layers,
  FileText,
  SlidersHorizontal,
  ArrowUpRight,
  Bell,
  User,
  Home
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { RuduLogo } from '../RuduLogo';
import { ProductOrderPage } from './ProductOrderPage';

export interface ProductItem {
  id: string;
  name: string;
  category: 'milk' | 'ghee' | 'curd' | 'paneer' | 'butter';
  desc: string;
  tag: string;
  tagType?: 'bestseller' | 'vedic' | 'organic' | 'protein' | 'fresh';
  rating: number;
  reviewsCount: number;
  img: string;
  fatContent: string;
  snfContent?: string;
  shelfLife: string;
  origin: string;
  purityScore: string;
  packSizes: {
    label: string;
    priceNum: number;
    priceFormatted: string;
    unit: string;
  }[];
  isA2?: boolean;
  isOrganic?: boolean;
  isHighProtein?: boolean;
}

export const PRODUCTS_CATALOG: ProductItem[] = [
  // MILK
  {
    id: 'milk-full-cream',
    name: 'Premium Full Cream Milk',
    category: 'milk',
    desc: 'Pure pasteurized whole milk with thick natural malai layer. Unstandardized cream content ideal for growing children, artisanal tea, and rich homemade sweets.',
    tag: 'Best Seller',
    tagType: 'bestseller',
    rating: 5.0,
    reviewsCount: 1420,
    img: '/images/rudu_milk_product.png',
    fatContent: '6.0% Fat',
    snfContent: '9.0% SNF',
    shelfLife: '48 Hours at 4°C',
    origin: 'Rudu Farms, Village Chhata',
    purityScore: '100% Pure',
    packSizes: [
      { label: '500 ml', priceNum: 35, priceFormatted: '₹35', unit: '500ml pouch' },
      { label: '1 L', priceNum: 66, priceFormatted: '₹66', unit: '1 Liter bottle' },
      { label: '2 L', priceNum: 130, priceFormatted: '₹130', unit: '2 Liters pack' }
    ]
  },
  {
    id: 'milk-a2-cow',
    name: 'A2 Vedic Desi Cow Milk',
    category: 'milk',
    desc: 'Unadulterated raw-chilled A2 beta-casein milk sourced from indigenous Gir & Sahiwal cows grazing on organic green pastures. Easy to digest and light on stomach.',
    tag: 'A2 Vedic Pure',
    tagType: 'vedic',
    rating: 5.0,
    reviewsCount: 980,
    img: '/images/rudu_milk_product.png',
    fatContent: '4.5% Fat',
    snfContent: '8.8% SNF',
    shelfLife: '48 Hours at 4°C',
    origin: 'Mathura Heritage Gaushala',
    purityScore: 'A2 Certified',
    isA2: true,
    isOrganic: true,
    packSizes: [
      { label: '500 ml', priceNum: 42, priceFormatted: '₹42', unit: '500ml bottle' },
      { label: '1 L', priceNum: 78, priceFormatted: '₹78', unit: '1 Liter bottle' },
      { label: '2 L', priceNum: 152, priceFormatted: '₹152', unit: '2 Liters pack' }
    ]
  },
  {
    id: 'milk-standardized',
    name: 'Standardized Fresh Milk',
    category: 'milk',
    desc: 'Scientifically balanced 4.5% fat milk designed for the perfect cup of aromatic morning chai, filter coffee, and daily home culinary requirements.',
    tag: 'Daily Essential',
    tagType: 'fresh',
    rating: 4.9,
    reviewsCount: 860,
    img: '/images/rudu_milk_product.png',
    fatContent: '4.5% Fat',
    snfContent: '8.5% SNF',
    shelfLife: '48 Hours at 4°C',
    origin: 'Govardhan Cluster Farms',
    purityScore: 'GC Tested',
    packSizes: [
      { label: '500 ml', priceNum: 32, priceFormatted: '₹32', unit: '500ml pouch' },
      { label: '1 L', priceNum: 60, priceFormatted: '₹60', unit: '1 Liter pouch' },
      { label: '2 L', priceNum: 118, priceFormatted: '₹118', unit: '2 Liters pack' }
    ]
  },
  {
    id: 'milk-toned-slim',
    name: 'Toned Slim Low-Fat Milk',
    category: 'milk',
    desc: 'Light, nutrient-dense homogenized milk fortified with natural Vitamin A & D. Low in saturated calories, perfectly formulated for fitness enthusiasts and heart health.',
    tag: 'Slim & Fit',
    tagType: 'protein',
    rating: 4.8,
    reviewsCount: 640,
    img: '/images/rudu_milk_product.png',
    fatContent: '3.0% Fat',
    snfContent: '8.5% SNF',
    shelfLife: '48 Hours at 4°C',
    origin: 'Barsana Certified Dairy',
    purityScore: 'Zero Trans-fat',
    isHighProtein: true,
    packSizes: [
      { label: '500 ml', priceNum: 28, priceFormatted: '₹28', unit: '500ml pouch' },
      { label: '1 L', priceNum: 52, priceFormatted: '₹52', unit: '1 Liter pouch' },
      { label: '2 L', priceNum: 100, priceFormatted: '₹100', unit: '2 Liters pack' }
    ]
  },

  // GHEE
  {
    id: 'ghee-a2-bilona',
    name: 'A2 Vedic Bilona Cow Ghee',
    category: 'ghee',
    desc: 'Prepared strictly via authentic Ayurvedic 5-samskara Bilona method. Churned from curd of grass-fed A2 Gir cows over slow wood-fire. Distinct granular danedar texture with divine aroma.',
    tag: 'Handcrafted Vedic',
    tagType: 'vedic',
    rating: 5.0,
    reviewsCount: 1650,
    img: '/images/rudu_bilona_ghee.jpg',
    fatContent: '99.8% Pure Milk Fat',
    shelfLife: '12 Months',
    origin: 'Heritage Vedic Dairy Unit, Chhata',
    purityScore: 'BMT & GC Purity Certified',
    isA2: true,
    isOrganic: true,
    packSizes: [
      { label: '250 ml', priceNum: 350, priceFormatted: '₹350', unit: '250ml glass jar' },
      { label: '500 ml', priceNum: 650, priceFormatted: '₹650', unit: '500ml glass jar' },
      { label: '1 L', priceNum: 1250, priceFormatted: '₹1,250', unit: '1 Liter glass jar' }
    ]
  },
  {
    id: 'ghee-danedar-cow',
    name: 'Danedar Pure Cow Ghee',
    category: 'ghee',
    desc: 'Golden-yellow aromatic cow ghee slowly clarified to achieve a delectable grainy texture. Rich in fat-soluble vitamins and natural butyric acid for optimal digestion.',
    tag: 'Golden Grainy',
    tagType: 'bestseller',
    rating: 4.9,
    reviewsCount: 1120,
    img: '/images/rudu_bilona_ghee.jpg',
    fatContent: '99.7% Pure Fat',
    shelfLife: '9 Months',
    origin: 'Rudu Processing Unit, Mathura',
    purityScore: '100% Unadulterated',
    packSizes: [
      { label: '500 ml', priceNum: 350, priceFormatted: '₹350', unit: '500ml jar' },
      { label: '1 L', priceNum: 680, priceFormatted: '₹680', unit: '1 Liter jar' },
      { label: '2 L', priceNum: 1320, priceFormatted: '₹1,320', unit: '2 Liters tin' }
    ]
  },
  {
    id: 'ghee-premium-desi',
    name: 'Premium Desi Buffalo Ghee',
    category: 'ghee',
    desc: 'Traditional high-fat white granular desi ghee made from pure buffalo milk cream. Ideal for authentic North Indian sweets, parathas, and festive feasts.',
    tag: 'Rich Aroma',
    tagType: 'fresh',
    rating: 4.9,
    reviewsCount: 780,
    img: '/images/rudu_bilona_ghee.jpg',
    fatContent: '99.8% Pure Fat',
    shelfLife: '9 Months',
    origin: 'Rudu Dairy Farm Hub',
    purityScore: 'Zero Additives',
    packSizes: [
      { label: '500 ml', priceNum: 380, priceFormatted: '₹380', unit: '500ml jar' },
      { label: '1 L', priceNum: 740, priceFormatted: '₹740', unit: '1 Liter jar' }
    ]
  },

  // CURD / DAHI
  {
    id: 'curd-thick-creamy',
    name: 'Natural Thick Creamy Dahi',
    category: 'curd',
    desc: 'Traditional home-style setting with live active probiotic cultures. Creamy top layer with balanced pleasant tanginess, devoid of any gelatin, starches or stabilizers.',
    tag: 'Live Probiotics',
    tagType: 'bestseller',
    rating: 4.9,
    reviewsCount: 940,
    img: '/images/rudu_creamy_curd.jpg',
    fatContent: '4.5% Fat',
    shelfLife: '7 Days at 4°C',
    origin: 'Rudu Fresh Cold-Hub',
    purityScore: 'Zero Stabilizers',
    isOrganic: true,
    packSizes: [
      { label: '200 g', priceNum: 18, priceFormatted: '₹18', unit: '200g hygiene cup' },
      { label: '400 g', priceNum: 30, priceFormatted: '₹30', unit: '400g matka pack' },
      { label: '1 kg', priceNum: 70, priceFormatted: '₹70', unit: '1kg family tub' }
    ]
  },
  {
    id: 'curd-masala-chaach',
    name: 'Masala Spiced Buttermilk (Chaach)',
    category: 'curd',
    desc: 'Refreshing hand-churned buttermilk infused with freshly roasted cumin seeds, Himalayan black salt, ginger extracts, and crisp garden mint leaves.',
    tag: 'Digestive Cooler',
    tagType: 'fresh',
    rating: 4.8,
    reviewsCount: 520,
    img: '/images/rudu_creamy_curd.jpg',
    fatContent: '1.5% Light Fat',
    shelfLife: '5 Days at 4°C',
    origin: 'Mathura Village Churners',
    purityScore: 'Zero Chemicals',
    packSizes: [
      { label: '200 ml', priceNum: 12, priceFormatted: '₹12', unit: '200ml pouch' },
      { label: '500 ml', priceNum: 25, priceFormatted: '₹25', unit: '500ml bottle' },
      { label: '1 L', priceNum: 48, priceFormatted: '₹48', unit: '1 Liter family bottle' }
    ]
  },
  {
    id: 'curd-sweet-lassi',
    name: 'Kesar Pista Sweet Royal Lassi',
    category: 'curd',
    desc: 'Rich, thick, slow-churned sweet curd beverage flavored with Kashmiri saffron strands, crushed pistachios, and green cardamom seeds.',
    tag: 'Royal Treat',
    tagType: 'fresh',
    rating: 4.9,
    reviewsCount: 680,
    img: '/images/rudu_creamy_curd.jpg',
    fatContent: '4.8% Rich Cream',
    shelfLife: '4 Days at 4°C',
    origin: 'Rudu Dairy Churners',
    purityScore: 'Natural Saffron',
    packSizes: [
      { label: '250 ml', priceNum: 35, priceFormatted: '₹35', unit: '250ml glass bottle' },
      { label: '500 ml', priceNum: 65, priceFormatted: '₹65', unit: '500ml glass bottle' }
    ]
  },

  // PANEER
  {
    id: 'paneer-soft-malai',
    name: 'Fresh Malai Paneer (Zero Starch)',
    category: 'paneer',
    desc: 'Crafted strictly within 3 hours of morning milking from 100% full-fat dairy milk. Velvety soft texture that melts gracefully in gravies. Untouched by hand packaging.',
    tag: 'High Protein',
    tagType: 'protein',
    rating: 5.0,
    reviewsCount: 1530,
    img: '/images/rudu_fresh_paneer.jpg',
    fatContent: '50% Dry Matter Fat',
    shelfLife: '10 Days Vacuum Sealed',
    origin: 'Rudu Fresh Processing Unit',
    purityScore: 'Zero Starch Tested',
    isHighProtein: true,
    packSizes: [
      { label: '200 g', priceNum: 110, priceFormatted: '₹110', unit: '200g vacuum pack' },
      { label: '500 g', priceNum: 260, priceFormatted: '₹260', unit: '500g family pack' },
      { label: '1 kg', priceNum: 500, priceFormatted: '₹500', unit: '1kg party block' }
    ]
  },
  {
    id: 'paneer-organic-cottage',
    name: 'Organic A2 Desi Cow Paneer',
    category: 'paneer',
    desc: 'Artisanal cottage cheese curdled naturally using organic lemon extract from pure A2 cow milk. Exceptionally soft and nutrient-dense with 20g protein per 100g.',
    tag: 'A2 Organic',
    tagType: 'vedic',
    rating: 4.9,
    reviewsCount: 890,
    img: '/images/rudu_fresh_paneer.jpg',
    fatContent: '48% Fat',
    shelfLife: '8 Days Vacuum Sealed',
    origin: 'Rudu Organic Farms',
    purityScore: 'A2 Natural Whey Curdled',
    isA2: true,
    isOrganic: true,
    isHighProtein: true,
    packSizes: [
      { label: '200 g', priceNum: 130, priceFormatted: '₹130', unit: '200g vacuum pack' },
      { label: '500 g', priceNum: 310, priceFormatted: '₹310', unit: '500g vacuum pack' }
    ]
  },

  // BUTTER & CREAM
  {
    id: 'butter-white-makhan',
    name: 'Fresh Country White Butter (Safed Makhan)',
    category: 'butter',
    desc: 'Authentic unsalted village white butter churned freshly every morning from thick curd malai. Zero preservatives, zero artificial yellow color, pure grandma’s kitchen taste.',
    tag: 'Grandma Recipe',
    tagType: 'bestseller',
    rating: 5.0,
    reviewsCount: 1040,
    img: '/images/fresh_dairy_products.png',
    fatContent: '82% Fresh Cream Fat',
    shelfLife: '14 Days at 4°C',
    origin: 'Heritage Village Churners',
    purityScore: 'Zero Salt • Zero Color',
    packSizes: [
      { label: '200 g', priceNum: 140, priceFormatted: '₹140', unit: '200g eco tub' },
      { label: '500 g', priceNum: 330, priceFormatted: '₹330', unit: '500g eco tub' },
      { label: '1 kg', priceNum: 640, priceFormatted: '₹640', unit: '1kg bulk block' }
    ]
  },
  {
    id: 'butter-salted-table',
    name: 'Pasteurized Salted Table Butter',
    category: 'butter',
    desc: 'Velvety smooth spreadable table butter churned from pure pasteurized sweet cream and seasoned with natural sea salt. Elevates toasts, baking, and cooking.',
    tag: 'Breakfast Favorite',
    tagType: 'fresh',
    rating: 4.8,
    reviewsCount: 710,
    img: '/images/fresh_dairy_products.png',
    fatContent: '80% Butterfat',
    shelfLife: '4 Months Refrigerated',
    origin: 'Rudu Dairy Processing Unit',
    purityScore: '100% Pure Cream',
    packSizes: [
      { label: '200 g', priceNum: 115, priceFormatted: '₹115', unit: '200g pack' },
      { label: '500 g', priceNum: 260, priceFormatted: '₹260', unit: '500g block' }
    ]
  },
  {
    id: 'cream-heavy-whipping',
    name: 'Fresh Heavy Whipping Cream (30% Fat)',
    category: 'butter',
    desc: 'Thick, unhomogenized pure dairy cream separated from farm-fresh morning milk. Whips into stiff, luxurious peaks for cakes, desserts, soups, and coffee.',
    tag: 'Chef Grade',
    tagType: 'fresh',
    rating: 4.9,
    reviewsCount: 430,
    img: '/images/fresh_dairy_products.png',
    fatContent: '30% Milk Fat',
    shelfLife: '10 Days at 4°C',
    origin: 'Rudu Cold Hub',
    purityScore: 'Zero Emulsifiers',
    packSizes: [
      { label: '200 ml', priceNum: 90, priceFormatted: '₹90', unit: '200ml bottle' },
      { label: '500 ml', priceNum: 210, priceFormatted: '₹210', unit: '500ml bottle' }
    ]
  }
];

interface DedicatedProductPageProps {
  onBackToHome: () => void;
  onOpenPlanner?: () => void;
  onOpenLogin?: (role?: 'farmer' | 'admin' | 'employee') => void;
}

export const DedicatedProductPage: React.FC<DedicatedProductPageProps> = ({ 
  onBackToHome,
  onOpenPlanner,
  onOpenLogin 
}) => {
  // State for active category
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeFilterTag, setActiveFilterTag] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');

  // Flash Sale Countdown Timer (3h 32m 29s matching mockup)
  const [timeLeft, setTimeLeft] = useState<number>(3 * 3600 + 32 * 60 + 29);
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Interactive Wishlist
  const [wishlist, setWishlist] = useState<Set<string>>(new Set(['milk-a2-cow', 'ghee-bilona']));
  const toggleWishlist = (productId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setWishlist(prev => {
      const next = new Set(prev);
      if (next.has(productId)) next.delete(productId);
      else next.add(productId);
      return next;
    });
  };

  // Filter drawer toggle and notification toast
  const [showFilterDrawer, setShowFilterDrawer] = useState<boolean>(false);
  const [showNotificationToast, setShowNotificationToast] = useState<boolean>(false);

  // Selected pack sizes per product: mapping productId -> packSizeIndex
  const [selectedPacks, setSelectedPacks] = useState<Record<string, number>>({});

  // Active product for separate ordering page
  const [activeOrderingProduct, setActiveOrderingProduct] = useState<ProductItem | null>(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const prodId = params.get('id');
      if (prodId) {
        return PRODUCTS_CATALOG.find(p => p.id === prodId) || null;
      }
    } catch { /* ignore */ }
    return null;
  });
  const [activeOrderingPackIndex, setActiveOrderingPackIndex] = useState<number>(1);

  // Categories config
  const categories = [
    { id: 'all', label: 'All Dairy', icon: Layers, image: '/images/rudu_logo.png', count: PRODUCTS_CATALOG.length },
    { id: 'milk', label: 'Fresh Milk', icon: Droplets, image: '/images/rudu_milk_product.png', count: PRODUCTS_CATALOG.filter(p => p.category === 'milk').length },
    { id: 'ghee', label: 'Desi Ghee', icon: Sparkles, image: '/images/rudu_bilona_ghee.jpg', count: PRODUCTS_CATALOG.filter(p => p.category === 'ghee').length },
    { id: 'paneer', label: 'Paneer', icon: Award, image: '/images/rudu_fresh_paneer.jpg', count: PRODUCTS_CATALOG.filter(p => p.category === 'paneer').length },
    { id: 'curd', label: 'Curd & Dahi', icon: Heart, image: '/images/rudu_creamy_curd.jpg', count: PRODUCTS_CATALOG.filter(p => p.category === 'curd').length },
    { id: 'butter', label: 'Butter', icon: Star, image: '/images/fresh_dairy_products.png', count: PRODUCTS_CATALOG.filter(p => p.category === 'butter').length },
  ];

  // Helper to get selected pack index for a product
  const getPackIndex = (prod: ProductItem) => {
    return selectedPacks[prod.id] !== undefined ? selectedPacks[prod.id] : Math.min(1, prod.packSizes.length - 1);
  };

  const handleSelectPack = (productId: string, packIdx: number) => {
    setSelectedPacks(prev => ({ ...prev, [productId]: packIdx }));
  };

  // Open separate ordering page with pre-selected pack
  const handleOpenProductOrder = (prod: ProductItem, e?: React.MouseEvent, overridePackIdx?: number) => {
    if (e) e.stopPropagation();
    const currentPack = overridePackIdx !== undefined ? overridePackIdx : getPackIndex(prod);
    setActiveOrderingProduct(prod);
    setActiveOrderingPackIndex(currentPack);
    try {
      window.history.pushState({}, '', `/products?id=${prod.id}`);
    } catch { /* ignore */ }
  };

  // Filtered and Sorted Products
  const filteredProducts = useMemo(() => {
    return PRODUCTS_CATALOG.filter(prod => {
      // Category filter
      if (selectedCategory !== 'all' && prod.category !== selectedCategory) {
        return false;
      }
      // Tag filter
      if (activeFilterTag === 'a2' && !prod.isA2) return false;
      if (activeFilterTag === 'organic' && !prod.isOrganic) return false;
      if (activeFilterTag === 'protein' && !prod.isHighProtein) return false;
      if (activeFilterTag === 'bestseller' && prod.tagType !== 'bestseller') return false;
      if (activeFilterTag === 'wishlist' && !wishlist.has(prod.id)) return false;

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = prod.name.toLowerCase().includes(q);
        const matchesDesc = prod.desc.toLowerCase().includes(q);
        const matchesTag = prod.tag.toLowerCase().includes(q);
        const matchesCat = prod.category.toLowerCase().includes(q);
        if (!matchesName && !matchesDesc && !matchesTag && !matchesCat) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') {
        const priceA = a.packSizes[getPackIndex(a)]?.priceNum || 0;
        const priceB = b.packSizes[getPackIndex(b)]?.priceNum || 0;
        return priceA - priceB;
      }
      if (sortBy === 'price-desc') {
        const priceA = a.packSizes[getPackIndex(a)]?.priceNum || 0;
        const priceB = b.packSizes[getPackIndex(b)]?.priceNum || 0;
        return priceB - priceA;
      }
      if (sortBy === 'rating') {
        return b.rating - a.rating;
      }
      return 0; // featured default
    });
  }, [selectedCategory, activeFilterTag, searchQuery, sortBy, selectedPacks, wishlist]);

  // If a product is selected for ordering, render its dedicated separate page!
  if (activeOrderingProduct) {
    return (
      <ProductOrderPage
        product={activeOrderingProduct}
        initialPackIndex={activeOrderingPackIndex}
        onBack={() => {
          setActiveOrderingProduct(null);
          try {
            window.history.pushState({}, '', '/products');
          } catch { /* ignore */ }
        }}
        onSelectProduct={(p) => {
          setActiveOrderingProduct(p);
          setActiveOrderingPackIndex(0);
          try {
            window.history.pushState({}, '', `/products?id=${p.id}`);
          } catch { /* ignore */ }
        }}
        onOpenLogin={onOpenLogin}
      />
    );
  }

  return (
    <div className="dedicated-product-page bg-[#FAF7F2] min-h-screen text-[#1A202C]">
      
      {/* ── Notification Toast ── */}
      {showNotificationToast && (
        <div className="fixed top-16 right-4 z-50 bg-[#0A3821] text-white p-3.5 rounded-2xl shadow-2xl border border-emerald-700/50 max-w-xs animate-in slide-in-from-top-2">
          <div className="flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-full bg-emerald-800 flex items-center justify-center text-emerald-300 flex-shrink-0">
              <Bell size={14} />
            </div>
            <div className="flex-1">
              <h4 className="text-xs font-black text-yellow-400">Morning Fresh Batch Dispatched</h4>
              <p className="text-[11px] text-slate-200 mt-0.5 leading-snug">
                Batch #RF-4092 pasteurized & bottled at 4:30 AM. 100% Purity certified with 0% water adulteration.
              </p>
            </div>
            <button 
              onClick={() => setShowNotificationToast(false)}
              className="text-slate-400 hover:text-white"
            >
              <X size={13} />
            </button>
          </div>
        </div>
      )}

      {/* ── Top App Header (Brand Logo, Cart & Notification) ── */}
      <header className="bg-white sticky top-0 z-30 border-b border-slate-100 shadow-2xs">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          
          {/* Brand Logo */}
          <div 
            onClick={onBackToHome}
            className="cursor-pointer flex items-center"
            title="Return to Home"
          >
            <RuduLogo height={36} className="landing-logo-img sm:h-[40px]" />
          </div>

          {/* Quick Icons: Wishlist, Notification & Cart */}
          <div className="flex items-center gap-2">
            {/* Wishlist quick toggle */}
            <button
              onClick={() => setActiveFilterTag(activeFilterTag === 'wishlist' ? 'all' : 'wishlist')}
              className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all cursor-pointer relative ${
                activeFilterTag === 'wishlist' 
                  ? 'bg-red-50 border-red-200 text-red-500' 
                  : 'bg-slate-50 border-slate-200/80 text-slate-600 hover:bg-slate-100'
              }`}
              title="Saved Items"
            >
              <Heart size={16} fill={wishlist.size > 0 ? 'currentColor' : 'none'} />
              {wishlist.size > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#EA580C] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                  {wishlist.size}
                </span>
              )}
            </button>

            {/* Notification Bell */}
            <button
              onClick={() => setShowNotificationToast(!showNotificationToast)}
              className="w-9 h-9 rounded-full bg-slate-50 border border-slate-200/80 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors relative cursor-pointer"
              title="Daily Milking Notifications"
            >
              <Bell size={16} />
              <span className="absolute top-1.5 right-2 w-2 h-2 rounded-full bg-[#EA580C]" />
            </button>

            {/* Cart Button */}
            <button
              onClick={() => handleOpenProductOrder(PRODUCTS_CATALOG[0])}
              className="w-9 h-9 rounded-full bg-slate-50 border border-slate-200/80 flex items-center justify-center text-slate-700 hover:bg-slate-100 transition-colors relative cursor-pointer"
              title="Quick Cart / Order"
            >
              <ShoppingBag size={16} />
              <span className="absolute -top-1 -right-1 bg-[#0A3821] text-[#FACC15] text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                1
              </span>
            </button>
          </div>

        </div>

        {/* ── Search & Filter Pill ── */}
        <div className="max-w-5xl mx-auto px-4 pb-3">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text"
                placeholder="Search products, milk, bilona ghee, paneer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-9 py-2.5 bg-[#F4F6F5] border border-transparent hover:border-slate-200 focus:border-[#0A3821] focus:bg-white rounded-full text-xs font-semibold text-slate-800 placeholder:text-slate-400 outline-none transition-all"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Dark Green Filter Button */}
            <button
              onClick={() => setShowFilterDrawer(!showFilterDrawer)}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-xs ${
                showFilterDrawer 
                  ? 'bg-[#FACC15] text-[#0A3821]' 
                  : 'bg-[#0A3821] text-white hover:bg-[#124d2e]'
              }`}
              title="Filter and Sort"
            >
              <SlidersHorizontal size={17} className="stroke-[2.5]" />
            </button>
          </div>

          {/* Expandable Quick Filter Chips */}
          {showFilterDrawer && (
            <div className="flex items-center gap-1.5 pt-2.5 overflow-x-auto scrollbar-none animate-in fade-in duration-200">
              <button 
                onClick={() => setActiveFilterTag('all')}
                className={`px-3 py-1 rounded-full text-[11px] font-bold cursor-pointer whitespace-nowrap transition-all ${
                  activeFilterTag === 'all' 
                    ? 'bg-[#0A3821] text-white' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All Items
              </button>
              <button 
                onClick={() => setActiveFilterTag(activeFilterTag === 'a2' ? 'all' : 'a2')}
                className={`px-3 py-1 rounded-full text-[11px] font-bold cursor-pointer whitespace-nowrap transition-all ${
                  activeFilterTag === 'a2' 
                    ? 'bg-[#EA580C] text-white' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                A2 Beta-Casein
              </button>
              <button 
                onClick={() => setActiveFilterTag(activeFilterTag === 'organic' ? 'all' : 'organic')}
                className={`px-3 py-1 rounded-full text-[11px] font-bold cursor-pointer whitespace-nowrap transition-all ${
                  activeFilterTag === 'organic' 
                    ? 'bg-emerald-700 text-white' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                100% Organic
              </button>
              <button 
                onClick={() => setActiveFilterTag(activeFilterTag === 'bestseller' ? 'all' : 'bestseller')}
                className={`px-3 py-1 rounded-full text-[11px] font-bold cursor-pointer whitespace-nowrap transition-all ${
                  activeFilterTag === 'bestseller' 
                    ? 'bg-red-600 text-white' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Best Sellers
              </button>

              <div className="h-4 w-[1px] bg-slate-300 mx-1 flex-shrink-0" />

              <select 
                value={sortBy} 
                onChange={(e: any) => setSortBy(e.target.value)}
                className="bg-slate-100 text-[11px] font-bold text-slate-700 px-2.5 py-1 rounded-full border-none outline-none cursor-pointer"
              >
                <option value="featured">Sort: Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          )}
        </div>
      </header>

      {/* ── Main App Content ── */}
      <main className="max-w-5xl mx-auto px-4 pt-3 pb-24 sm:pb-28 space-y-4 sm:space-y-6">

        {/* ── Promotional Hero Banner matching reference image ── */}
        <section className="bg-gradient-to-r from-[#062917] via-[#0A3821] to-[#0E492B] rounded-3xl sm:rounded-4xl p-5 sm:p-7 relative overflow-hidden text-white shadow-md border border-emerald-950/20">
          
          <div className="relative z-10 max-w-[210px] xs:max-w-[240px] sm:max-w-xs md:max-w-md">
            <h2 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-black leading-tight text-white mb-4 tracking-tight">
              Get your special<br />sale up to 50%
            </h2>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => handleOpenProductOrder(PRODUCTS_CATALOG[0])}
                className="bg-[#FACC15] hover:bg-[#EAB308] text-[#0A3821] font-black text-xs sm:text-sm pl-4 pr-2 py-2 rounded-full inline-flex items-center gap-2 shadow-md cursor-pointer transition-all active:scale-95 group"
              >
                <span>Shop Now</span>
                <div className="w-6 h-6 rounded-full bg-[#0A3821] text-[#FACC15] flex items-center justify-center group-hover:rotate-45 transition-transform">
                  <ArrowUpRight size={13} className="stroke-[3]" />
                </div>
              </button>
            </div>
          </div>

          {/* Floating Fresh Dairy Imagery matching reference mockup */}
          <div className="absolute -right-1 xs:right-2 sm:right-6 top-1/2 -translate-y-1/2 w-36 xs:w-44 sm:w-56 md:w-64 h-[86%] flex items-center justify-end pointer-events-none">
            <div className="relative w-full h-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-white/30 transform rotate-1 hover:rotate-0 transition-transform">
              <img 
                src="/images/fresh_dairy_products.png" 
                alt="Fresh Farm Milk & Dairy" 
                className="w-full h-full object-cover" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#062917]/80 via-transparent to-black/20" />
              <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-[9px] font-black">
                <span className="bg-[#FACC15] text-[#0A3821] px-2 py-0.5 rounded-full shadow-xs">
                  4°C FRESH
                </span>
                <span className="text-white drop-shadow-md">
                  ★ 5.0 Pure
                </span>
              </div>
            </div>
          </div>

        </section>

        {/* ── Category Circles Strip matching reference image ── */}
        <section className="pt-1">
          <div className="flex items-center justify-between sm:justify-center gap-3 sm:gap-6 overflow-x-auto py-2 px-1 scrollbar-none">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className="flex flex-col items-center gap-1.5 flex-shrink-0 cursor-pointer group"
                >
                  <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center p-2.5 transition-all ${
                    isActive 
                      ? 'bg-emerald-50 border-2 border-[#0A3821] shadow-md scale-105 ring-2 ring-[#0A3821]/15' 
                      : 'bg-white border border-slate-200/90 shadow-2xs hover:border-emerald-300 hover:scale-105'
                  }`}>
                    <img 
                      src={cat.image} 
                      alt={cat.label} 
                      className="w-full h-full object-contain drop-shadow-xs" 
                    />
                  </div>
                  <span className={`text-[11px] sm:text-xs font-bold transition-colors ${
                    isActive ? 'text-[#0A3821] font-black' : 'text-slate-600 group-hover:text-slate-900'
                  }`}>
                    {cat.label}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* ── Flash Sale Row with Orange Countdown Timer ── */}
        <section className="pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Flash Sale
              </h2>
              {/* Countdown timer pill matching reference */}
              <div className="bg-[#EA580C] text-white px-2.5 py-0.5 sm:py-1 rounded-full text-[11px] sm:text-xs font-black tracking-wider flex items-center gap-1 shadow-xs">
                <Clock size={12} className="stroke-[2.5]" />
                <span>{formatTimer(timeLeft)}</span>
              </div>
            </div>

            <button 
              onClick={() => { setSelectedCategory('all'); setSearchQuery(''); setActiveFilterTag('all'); }}
              className="text-xs sm:text-sm font-bold text-slate-500 hover:text-[#0A3821] flex items-center gap-0.5 cursor-pointer transition-colors"
            >
              <span>See More</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </section>

        {/* ── Product Cards Grid (2x2 Matrix on Mobile) ── */}
        <section>
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center border border-slate-200/80 max-w-md mx-auto my-6 shadow-sm">
              <div className="w-14 h-14 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-3 text-2xl font-bold">
                🥛
              </div>
              <h3 className="text-base font-black text-[#1A202C] mb-1.5">No matching products found</h3>
              <p className="text-xs text-[#718096] mb-4">
                We couldn't find items for "{searchQuery || activeFilterTag}".
              </p>
              <button 
                onClick={() => { setSearchQuery(''); setSelectedCategory('all'); setActiveFilterTag('all'); }}
                className="bg-[#0A3821] text-[#FACC15] px-5 py-2.5 rounded-full text-xs font-extrabold cursor-pointer transition-all shadow-sm"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            /* 2x2 Matrix on mobile, 3 cols tablet, 4 cols desktop */
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
              {filteredProducts.map((prod) => {
                const packIndex = getPackIndex(prod);
                const currentPack = prod.packSizes[packIndex] || prod.packSizes[0];
                const originalPrice = Math.round(currentPack.priceNum * 1.25);
                const isWishlisted = wishlist.has(prod.id);

                return (
                  <div 
                    key={prod.id}
                    className="bg-white rounded-2xl sm:rounded-3xl p-2.5 sm:p-4 border border-slate-100 shadow-2xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between relative group"
                  >
                    {/* Top Right Floating Wishlist Heart */}
                    <button
                      onClick={(e) => toggleWishlist(prod.id, e)}
                      className={`absolute top-2.5 right-2.5 z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-2xs border ${
                        isWishlisted 
                          ? 'bg-red-50 border-red-200 text-red-500 scale-110' 
                          : 'bg-white/90 backdrop-blur-sm border-slate-100 text-slate-400 hover:text-red-500 hover:bg-white'
                      }`}
                      title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                    >
                      <Heart size={14} fill={isWishlisted ? 'currentColor' : 'none'} className="transition-transform active:scale-125" />
                    </button>

                    {/* Top Left Tag */}
                    <div className="absolute top-2.5 left-2.5 z-10">
                      <span className="bg-[#0A3821] text-[#FACC15] text-[8px] sm:text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shadow-2xs">
                        {prod.tag}
                      </span>
                    </div>

                    {/* Product Image */}
                    <div 
                      className="h-28 xs:h-32 sm:h-40 flex items-center justify-center relative cursor-pointer overflow-hidden p-1 my-1"
                      onClick={() => handleOpenProductOrder(prod)}
                    >
                      <img 
                        src={prod.img} 
                        alt={prod.name} 
                        className="max-h-full max-w-full object-contain group-hover:scale-108 transition-transform duration-500 drop-shadow-sm" 
                      />
                    </div>

                    {/* Farm Verification Badge matching reference (Warren ✓ ★ 4.9) */}
                    <div className="flex items-center gap-1.5 pt-1 mb-1">
                      <div className="w-4 h-4 rounded-full overflow-hidden bg-amber-100 border border-amber-300 flex items-center justify-center flex-shrink-0">
                        <img src="/images/hero_owner.jpg" alt="Rudu Farm" className="w-full h-full object-cover" />
                      </div>
                      <span className="text-[10px] sm:text-[11px] font-bold text-slate-700 truncate">
                        Rudu Farm
                      </span>
                      {/* Blue Verified Checkmark */}
                      <svg className="w-3.5 h-3.5 text-blue-500 fill-current flex-shrink-0" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>

                      {/* Star Rating */}
                      <div className="flex items-center gap-0.5 ml-auto text-amber-500">
                        <Star size={11} fill="currentColor" />
                        <span className="text-[10px] sm:text-[11px] font-black text-slate-800">
                          {prod.rating.toFixed(1)}
                        </span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 
                      onClick={() => handleOpenProductOrder(prod)}
                      className="text-xs sm:text-sm font-black text-slate-900 leading-snug line-clamp-1 mb-2 group-hover:text-[#0A3821] transition-colors cursor-pointer"
                      title={prod.name}
                    >
                      {prod.name}
                    </h3>

                    {/* Pack size pills */}
                    <div className="flex items-center gap-1 overflow-x-auto scrollbar-none mb-2 pb-0.5">
                      {prod.packSizes.map((pack, idx) => {
                        const isSelected = packIndex === idx;
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleSelectPack(prod.id, idx)}
                            className={`flex-1 py-0.5 px-1 rounded-md sm:rounded-lg text-[9px] sm:text-[10px] font-bold transition-all cursor-pointer whitespace-nowrap border ${
                              isSelected 
                                ? 'bg-emerald-50 border-[#0A3821] text-[#0A3821] font-black' 
                                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                            }`}
                          >
                            {pack.label}
                          </button>
                        );
                      })}
                    </div>

                    {/* Pricing & Buy Now */}
                    <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-sm sm:text-base md:text-lg font-black text-[#EA580C]">
                          {currentPack.priceFormatted}
                        </span>
                        <span className="text-[10px] sm:text-xs text-slate-400 line-through font-semibold">
                          ₹{originalPrice}
                        </span>
                      </div>

                      {/* Buy Now Button */}
                      <button
                        type="button"
                        onClick={(e) => handleOpenProductOrder(prod, e)}
                        className="bg-[#0A3821] hover:bg-emerald-800 text-white p-1.5 sm:px-3 sm:py-1.5 rounded-xl font-bold text-[10px] sm:text-xs transition-all flex items-center gap-1 cursor-pointer active:scale-95 shadow-2xs"
                        title="Order Now"
                      >
                        <ShoppingBag size={12} className="stroke-[2.5]" />
                        <span className="hidden sm:inline font-extrabold">Buy</span>
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </section>

      </main>

      {/* ── Rudu Purity & Quality Promise Strip ── */}
      <section className="bg-white border-y border-[#EAE2D8] py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-black uppercase tracking-wider text-[#E21E23] block mb-2">
              The Rudu Quality Standards
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#1A202C]">
              Why Rudu Farm Milk Tastes Superior
            </h2>
            <p className="text-xs sm:text-sm text-[#4A5568] mt-2">
              We never compromise on chemical purity, ethical animal rearing, or cold-chain integrity.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 md:gap-6">
            {/* Pillar 1 */}
            <div className="bg-[#FAF7F2] p-3.5 sm:p-6 rounded-2xl sm:rounded-3xl border border-[#EAE2D8] shadow-2xs hover:shadow-md transition-all flex flex-col">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-red-100 text-[#E21E23] flex items-center justify-center font-black mb-2.5 sm:mb-4 flex-shrink-0">
                <Droplets size={20} className="sm:w-6 sm:h-6" />
              </div>
              <h3 className="text-xs sm:text-base font-black text-[#1A202C] mb-1 sm:mb-2 leading-snug">
                100% Raw Chilled at 4°C
              </h3>
              <p className="text-[10px] sm:text-xs text-[#4A5568] leading-relaxed">
                Bacteria multiply if milk stays warm. Fresh milk hits 4°C bulk chillers within 60 minutes of collection.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="bg-[#FAF7F2] p-3.5 sm:p-6 rounded-2xl sm:rounded-3xl border border-[#EAE2D8] shadow-2xs hover:shadow-md transition-all flex flex-col">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-black mb-2.5 sm:mb-4 flex-shrink-0">
                <ShieldCheck size={20} className="sm:w-6 sm:h-6" />
              </div>
              <h3 className="text-xs sm:text-base font-black text-[#1A202C] mb-1 sm:mb-2 leading-snug">
                Zero Synthetic Hormones
              </h3>
              <p className="text-[10px] sm:text-xs text-[#4A5568] leading-relaxed">
                Zero oxytocin and zero chemical steroids. Our cows graze on pure green fodder and organic silage.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="bg-[#FAF7F2] p-3.5 sm:p-6 rounded-2xl sm:rounded-3xl border border-[#EAE2D8] shadow-2xs hover:shadow-md transition-all flex flex-col">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black mb-2.5 sm:mb-4 flex-shrink-0">
                <RefreshCw size={20} className="sm:w-6 sm:h-6" />
              </div>
              <h3 className="text-xs sm:text-base font-black text-[#1A202C] mb-1 sm:mb-2 leading-snug">
                Circular Glass Bottle
              </h3>
              <p className="text-[10px] sm:text-xs text-[#4A5568] leading-relaxed">
                Zero micro-plastics leach into your beverage. Delivered in sterilized reusable glass bottles collected daily.
              </p>
            </div>

            {/* Pillar 4 (Completes 2x2 matrix) */}
            <div className="bg-[#FAF7F2] p-3.5 sm:p-6 rounded-2xl sm:rounded-3xl border border-[#EAE2D8] shadow-2xs hover:shadow-md transition-all flex flex-col">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center font-black mb-2.5 sm:mb-4 flex-shrink-0">
                <Award size={20} className="sm:w-6 sm:h-6" />
              </div>
              <h3 className="text-xs sm:text-base font-black text-[#1A202C] mb-1 sm:mb-2 leading-snug">
                26 Lab Purity Tests
              </h3>
              <p className="text-[10px] sm:text-xs text-[#4A5568] leading-relaxed">
                Every dispatch batch is digitally screened for zero added water, urea, starch, detergent, or preservatives.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ── FAQ Quick Accordion ── */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-14">
        <div className="text-center mb-8">
          <h3 className="text-xl sm:text-2xl font-black text-[#1A202C]">
            Frequently Asked Questions about Ordering
          </h3>
          <p className="text-xs text-[#718096] mt-1 font-medium">
            Common questions about daily morning delivery, subscriptions, and purity tests.
          </p>
        </div>

        <div className="space-y-3">
          <div className="bg-white rounded-2xl p-5 border border-[#EAE2D8]">
            <h4 className="text-sm font-black text-[#1A202C] mb-1.5 flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-600" />
              What time will my morning milk be delivered?
            </h4>
            <p className="text-xs text-[#4A5568] leading-relaxed pl-6">
              Our milk dispatch operators start morning runs at 4:30 AM. Your fresh milk bottle will be at your doorstep by 6:00 AM to 6:30 AM every day, well before morning breakfast and tea.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-[#EAE2D8]">
            <h4 className="text-sm font-black text-[#1A202C] mb-1.5 flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-600" />
              Can I pause or cancel my subscription when traveling?
            </h4>
            <p className="text-xs text-[#4A5568] leading-relaxed pl-6">
              Yes, 100% flexibility! Just send a quick WhatsApp message to our dispatch desk before 8:00 PM the previous night, and your morning delivery will be paused instantly with no penalties.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-[#EAE2D8]">
            <h4 className="text-sm font-black text-[#1A202C] mb-1.5 flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-600" />
              How do I verify the purity batch lab test?
            </h4>
            <p className="text-xs text-[#4A5568] leading-relaxed pl-6">
              Every glass bottle and pouch has a Batch Code printed on it. You can enter that code into our online Purity Batch Checker to view the exact fat, SNF, and zero-adulteration report generated for that morning's milk.
            </p>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-[#1A202C] text-white py-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <RuduLogo height={32} className="filter brightness-0 invert" />
            <span className="text-xs text-slate-400 font-bold">
              © {new Date().getFullYear()} Rudu Dairy & Milk Management. All rights reserved.
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
            <button onClick={onBackToHome} className="hover:text-white cursor-pointer">
              Home Page
            </button>
            <span>•</span>
            <a href="tel:+919411985444" className="hover:text-white flex items-center gap-1">
              <Phone size={13} />
              <span>+91 94119 85444</span>
            </a>
          </div>
        </div>
      </footer>


      {/* ── Floating Bottom Navigation Dock matching reference mockup ── */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-auto max-w-[92vw]">
        <div className="bg-[#0A3821] text-white px-3 py-2 sm:px-4 sm:py-2.5 rounded-full shadow-2xl flex items-center gap-3 sm:gap-6 border border-emerald-800/40 backdrop-blur-md">
          {/* Home Active Pill */}
          <button
            onClick={onBackToHome}
            className="bg-[#FACC15] hover:bg-[#EAB308] text-[#0A3821] font-black px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full flex items-center gap-1.5 text-xs shadow-md transition-all cursor-pointer active:scale-95"
            title="Return to Home"
          >
            <Home size={15} className="stroke-[2.5]" />
            <span className="font-extrabold">Home</span>
          </button>

          {/* Wishlist */}
          <button
            onClick={() => setActiveFilterTag(activeFilterTag === 'wishlist' ? 'all' : 'wishlist')}
            className={`p-1.5 sm:p-2 rounded-full hover:text-[#FACC15] transition-colors relative cursor-pointer ${
              activeFilterTag === 'wishlist' ? 'text-[#FACC15]' : 'text-slate-300'
            }`}
            title="Wishlist"
          >
            <Heart size={18} fill={wishlist.size > 0 ? "currentColor" : "none"} />
            {wishlist.size > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center shadow-xs">
                {wishlist.size}
              </span>
            )}
          </button>

          {/* Cart / Order */}
          <button
            onClick={() => handleOpenProductOrder(PRODUCTS_CATALOG[0])}
            className="p-1.5 sm:p-2 rounded-full text-slate-300 hover:text-[#FACC15] transition-colors relative cursor-pointer"
            title="Cart / Quick Order"
          >
            <ShoppingBag size={18} />
            <span className="absolute -top-1 -right-1 bg-[#FACC15] text-[#0A3821] text-[8px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center shadow-xs">
              1
            </span>
          </button>

          {/* Daily Milk Planner */}
          <button
            onClick={onOpenPlanner}
            className="p-1.5 sm:p-2 rounded-full text-slate-300 hover:text-[#FACC15] transition-colors relative cursor-pointer"
            title="Daily Milk Planner"
          >
            <Calendar size={18} />
          </button>

          {/* User / Profile / Login */}
          <button
            onClick={() => onOpenLogin ? onOpenLogin('farmer') : (window.location.href = '/')}
            className="p-1.5 sm:p-2 rounded-full text-slate-300 hover:text-[#FACC15] transition-colors cursor-pointer"
            title="Account / Login"
          >
            <User size={18} />
          </button>
        </div>
      </div>

    </div>
  );
};
