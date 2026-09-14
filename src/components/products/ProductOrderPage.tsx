import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Heart, 
  Share2, 
  Star, 
  ShieldCheck, 
  Droplets, 
  Clock, 
  Truck, 
  CheckCircle2, 
  Sparkles, 
  Minus, 
  Plus, 
  Calendar, 
  MessageCircle, 
  Zap, 
  MapPin, 
  User as UserIcon, 
  Phone, 
  ChevronRight, 
  Check, 
  Award,
  RefreshCw,
  ShoppingBag,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { RuduLogo } from '../RuduLogo';
import { ProductItem, PRODUCTS_CATALOG } from './DedicatedProductPage';

interface ProductOrderPageProps {
  product: ProductItem;
  initialPackIndex?: number;
  onBack: () => void;
  onSelectProduct: (product: ProductItem) => void;
  onOpenLogin?: (role?: 'farmer' | 'admin' | 'employee') => void;
}

export const ProductOrderPage: React.FC<ProductOrderPageProps> = ({
  product,
  initialPackIndex = 1,
  onBack,
  onSelectProduct,
  onOpenLogin
}) => {
  // Pack size selection
  const [selectedPackIndex, setSelectedPackIndex] = useState<number>(
    Math.min(initialPackIndex, product.packSizes.length - 1)
  );

  // Order configuration
  const [orderMode, setOrderMode] = useState<'subscription' | 'onetime'>('subscription');
  const [quantity, setQuantity] = useState<number>(1);
  const [deliverySlot, setDeliverySlot] = useState<'morning' | 'evening'>('morning');

  // Customer Form
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [customerAddress, setCustomerAddress] = useState<string>('');
  const [customerPincode, setCustomerPincode] = useState<string>('281401');
  const [deliveryNotes, setDeliveryNotes] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'whatsapp' | 'cod' | 'upi'>('whatsapp');

  // Interactive Wishlist & Share
  const [isWishlisted, setIsWishlisted] = useState<boolean>(false);
  const [shareToast, setShareToast] = useState<boolean>(false);
  const [orderSuccess, setOrderSuccess] = useState<boolean>(false);
  const [orderId, setOrderId] = useState<string>('');

  // Scroll to top on product change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setSelectedPackIndex(Math.min(initialPackIndex, product.packSizes.length - 1));
    setOrderSuccess(false);
  }, [product.id, initialPackIndex]);

  const currentPack = product.packSizes[selectedPackIndex] || product.packSizes[0];
  const unitPrice = orderMode === 'subscription' ? Math.round(currentPack.priceNum * 0.9) : currentPack.priceNum;
  const originalUnitPrice = Math.round(currentPack.priceNum * 1.25);
  const subtotal = currentPack.priceNum * quantity;
  const subscriptionDiscount = orderMode === 'subscription' ? Math.round(subtotal * 0.1) : 0;
  const finalTotal = subtotal - subscriptionDiscount;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${product.name} | Rudu Dairy`,
        text: `Order 100% farm-fresh ${product.name} direct from Rudu Farms Mathura:`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setShareToast(true);
      setTimeout(() => setShareToast(false), 2500);
    }
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerPhone.trim() || !customerName.trim() || !customerAddress.trim()) {
      alert('Please provide your name, phone number, and delivery address.');
      return;
    }

    const generatedId = `RF-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderId(generatedId);

    // Confetti celebration
    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 }
      });
    } catch { /* ignore */ }

    // If WhatsApp method selected, open WhatsApp chat
    if (paymentMethod === 'whatsapp') {
      const message = `*RUDU DAIRY ORDER CONFIRMATION* 🥛
Order ID: #${generatedId}

• *Product:* ${product.name}
• *Pack Size:* ${currentPack.label}
• *Plan:* ${orderMode === 'subscription' ? 'Daily Morning Subscription (10% OFF Applied)' : 'One-Time Trial Order'}
• *Quantity:* ${quantity}x (${currentPack.label})
• *Total Payable:* ₹${finalTotal}
• *Delivery Slot:* ${deliverySlot === 'morning' ? 'Early Morning (5:30 - 7:00 AM)' : 'Evening (5:00 - 7:00 PM)'}

*Customer Details:*
• Name: ${customerName}
• Phone: ${customerPhone}
• Address: ${customerAddress}, PIN: ${customerPincode}
${deliveryNotes ? `• Instructions: ${deliveryNotes}` : ''}

Please confirm my fresh order dispatch for tomorrow morning!`;

      const encodedMsg = encodeURIComponent(message);
      window.open(`https://wa.me/919411985444?text=${encodedMsg}`, '_blank');
    }

    setOrderSuccess(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Other related products to explore
  const relatedProducts = PRODUCTS_CATALOG.filter(p => p.id !== product.id).slice(0, 4);

  return (
    <div className="product-order-page bg-[#F8F9FA] min-h-screen text-slate-900 pb-28 selection:bg-emerald-200">
      
      {/* ── Toast Notifications ── */}
      {shareToast && (
        <div className="fixed top-16 right-4 z-50 bg-[#0A3821] text-white px-4 py-2.5 rounded-2xl shadow-xl text-xs font-bold animate-in fade-in flex items-center gap-2">
          <CheckCircle2 size={16} className="text-[#FACC15]" />
          <span>Product link copied to clipboard!</span>
        </div>
      )}

      {/* ── Top Header ── */}
      <header className="bg-white sticky top-0 z-30 border-b border-slate-100 shadow-2xs">
        <div className="max-w-5xl mx-auto px-4 h-14 sm:h-16 flex items-center justify-between">
          
          {/* Back Button */}
          <button 
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs font-black text-slate-700 hover:text-[#0A3821] transition-colors py-2 px-3 rounded-full hover:bg-slate-100 cursor-pointer border border-slate-200/80"
            title="Back to Products"
          >
            <ArrowLeft size={16} className="stroke-[2.5]" />
            <span className="hidden xs:inline">Products</span>
          </button>

          {/* Rudu Logo */}
          <div onClick={onBack} className="cursor-pointer">
            <RuduLogo height={34} className="landing-logo-img sm:h-[38px]" />
          </div>

          {/* Quick Actions: Share & Wishlist */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="w-9 h-9 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Share Product"
            >
              <Share2 size={15} />
            </button>

            <button
              onClick={() => setIsWishlisted(!isWishlisted)}
              className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
                isWishlisted 
                  ? 'bg-red-50 border-red-200 text-red-500 scale-105' 
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-red-500'
              }`}
              title="Wishlist"
            >
              <Heart size={16} fill={isWishlisted ? 'currentColor' : 'none'} />
            </button>
          </div>

        </div>
      </header>

      {/* ── Order Success Confirmation Screen ── */}
      {orderSuccess ? (
        <main className="max-w-2xl mx-auto px-4 py-8 sm:py-12 animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-emerald-100 shadow-xl text-center relative overflow-hidden">
            
            <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 ring-8 ring-emerald-50/50">
              <CheckCircle2 size={42} className="stroke-[2.5]" />
            </div>

            <div className="inline-block bg-emerald-100 text-emerald-800 text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider mb-2">
              Order Confirmed #{orderId}
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">
              Thank You, {customerName}!
            </h1>
            
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto mb-6 leading-relaxed">
              Your order for <strong>{product.name} ({currentPack.label})</strong> has been received by Rudu Farm dispatch desk. 
              Fresh milk will be bottled at 4:30 AM and dispatched directly to your doorstep.
            </p>

            {/* Summary Box */}
            <div className="bg-[#FAF7F2] rounded-2xl p-4 border border-[#EAE2D8] max-w-md mx-auto text-left space-y-2 text-xs mb-6">
              <div className="flex justify-between text-slate-600">
                <span>Product Item:</span>
                <span className="font-bold text-slate-900">{product.name}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Pack & Quantity:</span>
                <span className="font-bold text-slate-900">{quantity}x {currentPack.label}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Plan Type:</span>
                <span className="font-bold text-emerald-700">
                  {orderMode === 'subscription' ? 'Daily Morning Subscription (10% Off)' : 'One-Time Trial Order'}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Delivery Slot:</span>
                <span className="font-bold text-slate-900">
                  {deliverySlot === 'morning' ? 'Tomorrow, 5:30 – 7:00 AM' : 'Tomorrow, 5:00 – 7:00 PM'}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Delivery Address:</span>
                <span className="font-bold text-slate-900 truncate max-w-[200px]">{customerAddress}, {customerPincode}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline font-black">
                <span className="text-sm text-slate-900">Total Amount:</span>
                <span className="text-xl text-[#EA580C]">₹{finalTotal}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
              <a 
                href={`https://wa.me/919411985444?text=Hello%20Rudu%20Farm,%20I%20have%20a%20question%20regarding%20my%20order%20%23${orderId}.`}
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-5 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <MessageCircle size={16} />
                <span>Track on WhatsApp</span>
              </a>

              <button
                onClick={onBack}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-3 px-5 rounded-2xl text-xs transition-all cursor-pointer"
              >
                Explore More Products
              </button>
            </div>

          </div>
        </main>
      ) : (
        /* ── Main Product Detail & Ordering Page ── */
        <main className="max-w-5xl mx-auto px-4 py-4 sm:py-6">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            
            {/* ── Left Column: Product Visuals & Farm Purity Highlights (5 cols) ── */}
            <div className="lg:col-span-5 space-y-4">
              
              {/* Product Hero Card */}
              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm relative overflow-hidden flex flex-col items-center justify-center">
                
                {/* Top Badges */}
                <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5">
                  <span className="bg-[#0A3821] text-[#FACC15] text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-2xs">
                    {product.tag}
                  </span>
                  {product.isA2 && (
                    <span className="bg-amber-500 text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shadow-2xs w-fit">
                      A2 Vedic Cow
                    </span>
                  )}
                </div>

                <div className="absolute top-4 right-4 z-10 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-black px-2.5 py-1 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>{product.purityScore}</span>
                </div>

                {/* Main Product Image with subtle float effect */}
                <div className="h-64 sm:h-72 w-full flex items-center justify-center p-4 my-2 relative">
                  <img 
                    src={product.img} 
                    alt={product.name} 
                    className="max-h-full max-w-full object-contain drop-shadow-xl hover:scale-105 transition-transform duration-500" 
                  />
                  <img 
                    src="/images/fresh_milk_splash.png" 
                    alt="Purity splash" 
                    className="absolute inset-0 w-full h-full object-contain opacity-25 pointer-events-none filter brightness-125" 
                  />
                </div>

                {/* Fat & SNF Content Pill */}
                <div className="w-full pt-3 border-t border-slate-100 flex items-center justify-around text-center text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">Fat Content</span>
                    <span className="font-black text-slate-800">{product.fatContent}</span>
                  </div>
                  {product.snfContent && (
                    <>
                      <div className="h-6 w-[1px] bg-slate-200" />
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block uppercase">SNF Ratio</span>
                        <span className="font-black text-slate-800">{product.snfContent}</span>
                      </div>
                    </>
                  )}
                  <div className="h-6 w-[1px] bg-slate-200" />
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">Cold Chain</span>
                    <span className="font-black text-emerald-700">4°C Chilled</span>
                  </div>
                </div>

              </div>

              {/* Farm Source & Authenticity Guarantee */}
              <div className="bg-[#FAF7F2] rounded-2xl p-4 border border-[#EAE2D8] space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-amber-100 border border-amber-300 flex items-center justify-center flex-shrink-0">
                    <img src="/images/hero_owner.jpg" alt="Rudu Farm Origin" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-black text-slate-900">Rudu Heritage Farm</h4>
                      <svg className="w-3.5 h-3.5 text-blue-500 fill-current" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                    </div>
                    <p className="text-[10px] text-slate-500 font-medium">{product.origin}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] font-semibold text-slate-700 pt-1">
                  <div className="flex items-center gap-1.5 bg-white p-2 rounded-xl border border-[#EAE2D8]">
                    <ShieldCheck size={14} className="text-emerald-700 flex-shrink-0" />
                    <span>26 Lab Purity Tests</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-white p-2 rounded-xl border border-[#EAE2D8]">
                    <Clock size={14} className="text-amber-700 flex-shrink-0" />
                    <span>6:00 AM Delivery</span>
                  </div>
                </div>
              </div>

            </div>

            {/* ── Right Column: Order Configuration & Details Form (7 cols) ── */}
            <div className="lg:col-span-7 space-y-5">
              
              {/* Product Header & Title */}
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-sm space-y-3">
                
                {/* Rating & Category */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-amber-800 uppercase tracking-wider bg-amber-50 px-2.5 py-0.5 rounded-full">
                    {product.category}
                  </span>
                  
                  <div className="flex items-center gap-1">
                    <div className="flex items-center text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={13} fill="currentColor" />
                      ))}
                    </div>
                    <span className="text-xs font-black text-slate-800 ml-1">{product.rating}</span>
                    <span className="text-[11px] text-slate-400 font-medium">({product.reviewsCount} reviews)</span>
                  </div>
                </div>

                {/* Title */}
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 leading-tight">
                  {product.name}
                </h1>

                {/* Description */}
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  {product.desc}
                </p>

                {/* Price Display */}
                <div className="pt-3 border-t border-slate-100 flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-black text-[#EA580C]">
                    ₹{unitPrice}
                  </span>
                  <span className="text-sm sm:text-base text-slate-400 line-through font-semibold">
                    ₹{originalUnitPrice}
                  </span>
                  <span className="text-xs font-bold text-slate-500">
                    /{currentPack.label}
                  </span>
                  {orderMode === 'subscription' && (
                    <span className="ml-auto bg-emerald-100 text-emerald-800 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                      10% Subscription Discount Applied
                    </span>
                  )}
                </div>

              </div>

              {/* ── Step 1: Pack Size Selector ── */}
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-sm space-y-2.5">
                <label className="text-xs font-black text-slate-900 block uppercase tracking-wider">
                  Select Pack Size:
                </label>
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  {product.packSizes.map((pack, idx) => {
                    const isSelected = selectedPackIndex === idx;
                    const packPrice = orderMode === 'subscription' ? Math.round(pack.priceNum * 0.9) : pack.priceNum;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedPackIndex(idx)}
                        className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                          isSelected 
                            ? 'bg-emerald-50/70 border-[#0A3821] text-[#0A3821] shadow-xs ring-2 ring-[#0A3821]/15' 
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <span className="text-xs sm:text-sm font-black block">{pack.label}</span>
                        <span className="text-[11px] font-bold text-[#EA580C] block mt-0.5">₹{packPrice}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ── Step 2: Choose Order Plan ── */}
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-sm space-y-3">
                <label className="text-xs font-black text-slate-900 block uppercase tracking-wider">
                  Choose Your Ordering Plan:
                </label>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Daily Subscription */}
                  <div 
                    onClick={() => setOrderMode('subscription')}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative ${
                      orderMode === 'subscription' 
                        ? 'border-[#0A3821] bg-emerald-50/50 shadow-sm' 
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="absolute top-3 right-3 bg-[#EA580C] text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                      SAVE 10%
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${orderMode === 'subscription' ? 'border-[#0A3821] bg-[#0A3821]' : 'border-slate-300'}`}>
                        {orderMode === 'subscription' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                      <h4 className="text-sm font-black text-slate-900">Daily Morning Subscription</h4>
                    </div>
                    <p className="text-[11px] text-slate-600 pl-6 leading-relaxed">
                      Delivered daily by 6:00 AM. Free 4°C insulated packaging. Pause, resume, or cancel anytime via WhatsApp.
                    </p>
                  </div>

                  {/* One-Time Order */}
                  <div 
                    onClick={() => setOrderMode('onetime')}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative ${
                      orderMode === 'onetime' 
                        ? 'border-[#0A3821] bg-emerald-50/50 shadow-sm' 
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${orderMode === 'onetime' ? 'border-[#0A3821] bg-[#0A3821]' : 'border-slate-300'}`}>
                        {orderMode === 'onetime' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                      <h4 className="text-sm font-black text-slate-900">One-Time Trial Order</h4>
                    </div>
                    <p className="text-[11px] text-slate-600 pl-6 leading-relaxed">
                      Single trial bottle delivered tomorrow morning. Experience village farm freshness before subscribing.
                    </p>
                  </div>
                </div>

                {/* Quantity & Delivery Slot in 2 columns */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  
                  {/* Quantity */}
                  <div className="bg-[#FAF7F2] p-3.5 rounded-2xl border border-[#EAE2D8]">
                    <span className="text-[11px] font-black text-slate-700 block mb-2">
                      Quantity ({currentPack.label}):
                    </span>
                    <div className="flex items-center justify-between bg-white px-3 py-1.5 rounded-xl border border-slate-200">
                      <button
                        type="button"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-800 cursor-pointer"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="text-sm font-black text-slate-900">{quantity}</span>
                      <button
                        type="button"
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-800 cursor-pointer"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Delivery Slot */}
                  <div className="bg-[#FAF7F2] p-3.5 rounded-2xl border border-[#EAE2D8]">
                    <span className="text-[11px] font-black text-slate-700 block mb-2">
                      Preferred Delivery Window:
                    </span>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setDeliverySlot('morning')}
                        className={`flex-1 py-1.5 px-2 rounded-xl text-[10px] font-bold border transition-all cursor-pointer ${
                          deliverySlot === 'morning' 
                            ? 'bg-[#0A3821] text-white border-[#0A3821]' 
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        🌅 5:30 – 7:00 AM
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeliverySlot('evening')}
                        className={`flex-1 py-1.5 px-2 rounded-xl text-[10px] font-bold border transition-all cursor-pointer ${
                          deliverySlot === 'evening' 
                            ? 'bg-[#0A3821] text-white border-[#0A3821]' 
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        🌇 5:00 – 7:00 PM
                      </button>
                    </div>
                  </div>

                </div>

              </div>

              {/* ── Step 3: Delivery Information & Form ── */}
              <form onSubmit={handlePlaceOrder} className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-sm space-y-4">
                
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                    Delivery Address Details:
                  </h3>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    Free Punctual Delivery
                  </span>
                </div>

                <div className="space-y-3">
                  {/* Full Name */}
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      Full Name *
                    </label>
                    <div className="relative">
                      <UserIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input 
                        type="text"
                        required
                        placeholder="e.g. Rahul Sharma"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-[#FAF7F2] border border-[#EAE2D8] rounded-xl text-xs font-semibold focus:bg-white focus:outline-none focus:border-[#0A3821]"
                      />
                    </div>
                  </div>

                  {/* Phone & Pincode */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        10-Digit Mobile Number *
                      </label>
                      <div className="relative">
                        <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                          type="tel"
                          required
                          placeholder="e.g. 9876543210"
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 bg-[#FAF7F2] border border-[#EAE2D8] rounded-xl text-xs font-semibold focus:bg-white focus:outline-none focus:border-[#0A3821]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        Area Pincode *
                      </label>
                      <div className="relative">
                        <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                          type="text"
                          required
                          value={customerPincode}
                          onChange={(e) => setCustomerPincode(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 bg-[#FAF7F2] border border-[#EAE2D8] rounded-xl text-xs font-semibold focus:bg-white focus:outline-none focus:border-[#0A3821]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Street Address */}
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      Complete House / Flat / Street Address *
                    </label>
                    <textarea 
                      rows={2}
                      required
                      placeholder="House/Flat No., Apartment/Colony Name, Landmark"
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#EAE2D8] rounded-xl text-xs font-semibold focus:bg-white focus:outline-none focus:border-[#0A3821] resize-none"
                    />
                  </div>
                </div>

                {/* Preferred Checkout Method */}
                <div className="pt-2">
                  <label className="text-[11px] font-black text-slate-700 block mb-2">
                    Select Checkout Method:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('whatsapp')}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                        paymentMethod === 'whatsapp' 
                          ? 'bg-emerald-50 border-emerald-600 text-emerald-800 ring-2 ring-emerald-500/20' 
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <MessageCircle size={16} className="mx-auto mb-1 text-emerald-600" />
                      <span className="text-[11px] font-black block">WhatsApp</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('cod')}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                        paymentMethod === 'cod' 
                          ? 'bg-red-50 border-red-600 text-red-800 ring-2 ring-red-500/20' 
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Truck size={16} className="mx-auto mb-1 text-red-600" />
                      <span className="text-[11px] font-black block">Cash on Delivery</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('upi')}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                        paymentMethod === 'upi' 
                          ? 'bg-blue-50 border-blue-600 text-blue-800 ring-2 ring-blue-500/20' 
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Zap size={16} className="mx-auto mb-1 text-blue-600" />
                      <span className="text-[11px] font-black block">UPI / QR</span>
                    </button>
                  </div>
                </div>

                {/* Pricing Summary */}
                <div className="bg-[#FAF7F2] rounded-2xl p-4 border border-[#EAE2D8] space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal ({quantity}x {currentPack.label})</span>
                    <span>₹{subtotal}</span>
                  </div>
                  {subscriptionDiscount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-bold">
                      <span>Subscription 10% Discount</span>
                      <span>-₹{subscriptionDiscount}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>4°C Thermal Packaging</span>
                    <span>FREE</span>
                  </div>
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>Morning Doorstep Delivery</span>
                    <span>FREE</span>
                  </div>
                  <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline font-black">
                    <span className="text-sm text-slate-900">Total Payable:</span>
                    <span className="text-xl text-[#EA580C]">₹{finalTotal}</span>
                  </div>
                </div>

                {/* Submit CTA */}
                <button
                  type="submit"
                  className="w-full bg-[#0A3821] hover:bg-[#124d2e] text-[#FACC15] py-3.5 px-6 rounded-2xl font-black text-sm sm:text-base shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <ShoppingBag size={18} className="stroke-[2.5]" />
                  <span>Confirm & Place Order (Buy Now)</span>
                </button>

              </form>

            </div>

          </div>

          {/* ── Related / Other Fresh Dairy Products ── */}
          <section className="mt-12 pt-8 border-t border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  Customers Also Subscribed To
                </h3>
                <p className="text-xs text-slate-500 font-medium">Farm fresh, unadulterated village dairy essentials</p>
              </div>

              <button
                onClick={onBack}
                className="text-xs font-black text-[#0A3821] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>View All</span>
                <ChevronRight size={14} />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {relatedProducts.map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => onSelectProduct(rel)}
                  className="bg-white rounded-2xl p-3 border border-slate-100 shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div className="h-28 flex items-center justify-center p-2">
                    <img 
                      src={rel.img} 
                      alt={rel.name} 
                      className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform" 
                    />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900 line-clamp-1 group-hover:text-[#0A3821]">
                      {rel.name}
                    </h4>
                    <div className="flex items-baseline justify-between mt-1">
                      <span className="text-xs font-black text-[#EA580C]">
                        {rel.packSizes[0]?.priceFormatted}
                      </span>
                      <span className="text-[10px] font-bold text-[#0A3821]">Order ↗</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </main>
      )}

      {/* ── Fixed Mobile Bottom Action Bar (when not in success view) ── */}
      {!orderSuccess && (
        <div className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-slate-200 p-3 sm:hidden shadow-lg">
          <div className="flex items-center justify-between gap-3">
            <div>
              <span className="text-[10px] text-slate-400 font-bold block uppercase">Total Payable</span>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-black text-[#EA580C]">₹{finalTotal}</span>
                {orderMode === 'subscription' && (
                  <span className="text-[10px] text-emerald-700 font-extrabold">(10% Off)</span>
                )}
              </div>
            </div>

            <button
              onClick={() => {
                const formEl = document.querySelector('form');
                if (formEl) {
                  formEl.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="bg-[#0A3821] text-[#FACC15] px-5 py-2.5 rounded-full font-black text-xs flex items-center gap-1.5 shadow-md cursor-pointer active:scale-95"
            >
              <ShoppingBag size={14} className="stroke-[2.5]" />
              <span>Order Now</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
