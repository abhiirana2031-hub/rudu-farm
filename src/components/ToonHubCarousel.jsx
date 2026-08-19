import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Sparkles, Leaf, ShieldCheck, Heart } from 'lucide-react';

const IMAGES = [
  { 
    src: '/images/rudu_milk_product.png', 
    bg: '#3E2417', 
    panel: '#543221',
    title: 'A2 ORGANIC COW MILK',
    desc: 'Pure A2 protein cow milk sourced directly from indigenous Mathura cows with zero preservatives.',
    tag: '100% ORGANIC'
  },
  { 
    src: '/images/fresh_dairy_products.png', 
    bg: '#1C3B24', 
    panel: '#284F32',
    title: 'VEDIC BILONA DESI GHEE',
    desc: 'Hand-churned golden aromatic ghee made from pure curd using traditional wooden bilona process.',
    tag: 'GC TESTED PURE'
  },
  { 
    src: '/milk.png', 
    bg: '#54371D', 
    panel: '#6E4927',
    title: 'FRESH MALAI PANEER',
    desc: 'Ultra-soft cottage paneer prepared touch-free from fresh full-cream cow milk.',
    tag: 'FARM FRESH'
  },
  { 
    src: '/images/rudu_farmer_clean.jpg', 
    bg: '#173634', 
    panel: '#224B49',
    title: 'TRANSPARENT FARM SOURCING',
    desc: 'Automated computerized milk testing empowering 500+ local village dairy farmers.',
    tag: 'FARMER FIRST'
  },
];

const grainSvgUri = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><filter id="noise"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" stitchTiles="stitch"/></filter><rect width="200" height="200" filter="url(%23noise)" opacity="0.08"/></svg>`;

export const ToonHubCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    IMAGES.forEach((item) => {
      const img = new Image();
      img.src = item.src;
    });

    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navigate = (direction) => {
    if (isAnimating) return;
    setIsAnimating(true);

    if (direction === 'next') {
      setActiveIndex((prev) => (prev + 1) % 4);
    } else {
      setActiveIndex((prev) => (prev + 3) % 4);
    }

    setTimeout(() => {
      setIsAnimating(false);
    }, 650);
  };

  const getRoleStyle = (index) => {
    const isCenter = index === activeIndex;
    const isLeft = index === (activeIndex + 3) % 4;
    const isRight = index === (activeIndex + 1) % 4;

    if (isCenter) {
      return {
        transform: `translateX(-50%) scale(${isMobile ? 1.15 : 1.35})`,
        filter: 'blur(0px)',
        opacity: 1,
        zIndex: 20,
        left: '50%',
        height: isMobile ? '65%' : '85%',
        bottom: isMobile ? '18%' : '5%',
      };
    }

    if (isLeft) {
      return {
        transform: 'translateX(-50%) scale(0.95)',
        filter: 'blur(2px)',
        opacity: 0.75,
        zIndex: 10,
        left: isMobile ? '22%' : '32%',
        height: isMobile ? '35%' : '55%',
        bottom: isMobile ? '25%' : '12%',
      };
    }

    if (isRight) {
      return {
        transform: 'translateX(-50%) scale(0.95)',
        filter: 'blur(2px)',
        opacity: 0.75,
        zIndex: 10,
        left: isMobile ? '78%' : '68%',
        height: isMobile ? '35%' : '55%',
        bottom: isMobile ? '25%' : '12%',
      };
    }

    return {
      transform: 'translateX(-50%) scale(0.8)',
      filter: 'blur(4px)',
      opacity: 0.5,
      zIndex: 5,
      left: '50%',
      height: isMobile ? '25%' : '40%',
      bottom: isMobile ? '25%' : '12%',
    };
  };

  const currentItem = IMAGES[activeIndex];

  return (
    <section 
      className="relative w-full overflow-hidden"
      style={{
        backgroundColor: currentItem.bg,
        transition: 'background-color 650ms cubic-bezier(0.4, 0, 0.2, 1)',
        fontFamily: "'Plus Jakarta Sans', sans-serif"
      }}
    >
      <div className="relative w-full overflow-hidden" style={{ minHeight: isMobile ? '80vh' : '90vh', padding: '60px 0' }}>
        
        {/* Grain overlay */}
        <div 
          className="absolute inset-0 pointer-events-none z-[50]"
          style={{
            opacity: 0.35,
            backgroundImage: `url("${grainSvgUri}")`,
            backgroundSize: '200px 200px',
            backgroundRepeat: 'repeat'
          }}
        />

        {/* Ghost background text */}
        <div 
          className="absolute inset-x-0 flex items-center justify-center pointer-events-none select-none z-[2]"
          style={{ top: '15%' }}
        >
          <span 
            className="font-serif-instrument uppercase text-white/10 tracking-[-0.02em] whitespace-nowrap"
            style={{
              fontSize: 'clamp(60px, 18vw, 260px)',
              fontWeight: 800,
              lineHeight: 1
            }}
          >
            NATURAL DAIRY
          </span>
        </div>

        {/* Top-left brand label badge */}
        <div className="absolute top-8 left-6 sm:left-12 z-[60] flex items-center gap-2">
          <span className="px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Leaf size={14} className="text-emerald-400" />
            <span>{currentItem.tag}</span>
          </span>
        </div>

        {/* 3D Showcase Carousel Images */}
        <div className="absolute inset-0 z-[3] flex items-center justify-center">
          {IMAGES.map((img, idx) => {
            const roleStyle = getRoleStyle(idx);
            return (
              <div
                key={img.title}
                style={{
                  position: 'absolute',
                  aspectRatio: '0.8 / 1',
                  ...roleStyle,
                  transition: 'transform 650ms cubic-bezier(0.4,0,0.2,1), filter 650ms cubic-bezier(0.4,0,0.2,1), opacity 650ms cubic-bezier(0.4,0,0.2,1), left 650ms cubic-bezier(0.4,0,0.2,1)',
                  willChange: 'transform, filter, opacity'
                }}
              >
                <div style={{ width: '100%', height: '100%', borderRadius: '24px', overflow: 'hidden', boxShadow: idx === activeIndex ? '0 25px 50px -12px rgba(0,0,0,0.5)' : 'none' }}>
                  <img
                    src={img.src}
                    alt={img.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: 'center'
                    }}
                    draggable={false}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom-left text + nav buttons */}
        <div 
          className="absolute bottom-8 left-6 sm:bottom-16 sm:left-16 z-[60]"
          style={{ maxWidth: '380px' }}
        >
          <div className="flex items-center gap-2 mb-2 text-emerald-300 text-xs font-bold uppercase tracking-widest">
            <Sparkles size={14} />
            <span>Pure Farm Collection</span>
          </div>

          <h3 className="font-serif-instrument text-2xl sm:text-4xl text-white font-bold mb-2 leading-tight">
            {currentItem.title}
          </h3>
          
          <p className="text-xs sm:text-sm text-white/85 leading-relaxed mb-6">
            {currentItem.desc}
          </p>

          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('prev')}
              className="w-12 h-12 rounded-full border border-white/40 bg-white/10 backdrop-blur-md flex items-center justify-center text-white transition-all duration-200 hover:scale-105 hover:bg-white/25 active:scale-95 cursor-pointer shadow-lg"
              aria-label="Previous product"
            >
              <ArrowLeft size={20} />
            </button>
            <button
              onClick={() => navigate('next')}
              className="w-12 h-12 rounded-full border border-white/40 bg-white/10 backdrop-blur-md flex items-center justify-center text-white transition-all duration-200 hover:scale-105 hover:bg-white/25 active:scale-95 cursor-pointer shadow-lg"
              aria-label="Next product"
            >
              <ArrowRight size={20} />
            </button>
            <div className="flex gap-1.5 ml-2">
              {IMAGES.map((_, i) => (
                <span 
                  key={i} 
                  className={`h-2 rounded-full transition-all duration-300 ${i === activeIndex ? 'w-6 bg-white' : 'w-2 bg-white/40'}`} 
                />
              ))}
            </div>
          </div>
        </div>

        {/* Bottom-right link */}
        <div className="absolute bottom-8 right-6 sm:bottom-16 sm:right-16 z-[60]">
          <a
            href="#products"
            className="group flex items-center gap-3 px-6 py-3 rounded-full bg-white/15 backdrop-blur-md border border-white/30 text-white font-bold hover:bg-white hover:text-slate-950 transition-all duration-300 shadow-xl cursor-pointer"
          >
            <span className="text-sm uppercase tracking-wider">Explore All Products</span>
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </a>
        </div>

      </div>
    </section>
  );
};
