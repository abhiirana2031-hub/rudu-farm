import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const IMAGES = [
  { 
    src: 'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/1.02464a56.png', 
    bg: '#F4845F', 
    panel: '#F79B7F' 
  },
  { 
    src: 'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/2.b977faab.png', 
    bg: '#6BBF7A', 
    panel: '#85CC92' 
  },
  { 
    src: 'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/3.4df853b4.png', 
    bg: '#E882B4', 
    panel: '#ED9DC4' 
  },
  { 
    src: 'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/4.4457fbce.png', 
    bg: '#6EB5FF', 
    panel: '#8DC4FF' 
  },
];

const grainSvgUri = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><filter id="noise"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" stitchTiles="stitch"/></filter><rect width="200" height="200" filter="url(%23noise)" opacity="0.08"/></svg>`;

export const ToonHubCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Preload images on mount
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
        transform: `translateX(-50%) scale(${isMobile ? 1.25 : 1.68})`,
        filter: 'blur(0px)',
        opacity: 1,
        zIndex: 20,
        left: '50%',
        height: isMobile ? '60%' : '92%',
        bottom: isMobile ? '22%' : '0px',
      };
    }

    if (isLeft) {
      return {
        transform: 'translateX(-50%) scale(1)',
        filter: 'blur(2px)',
        opacity: 0.85,
        zIndex: 10,
        left: isMobile ? '20%' : '30%',
        height: isMobile ? '16%' : '28%',
        bottom: isMobile ? '32%' : '12%',
      };
    }

    if (isRight) {
      return {
        transform: 'translateX(-50%) scale(1)',
        filter: 'blur(2px)',
        opacity: 0.85,
        zIndex: 10,
        left: isMobile ? '80%' : '70%',
        height: isMobile ? '16%' : '28%',
        bottom: isMobile ? '32%' : '12%',
      };
    }

    // Role: back
    return {
      transform: 'translateX(-50%) scale(1)',
      filter: 'blur(4px)',
      opacity: 1,
      zIndex: 5,
      left: '50%',
      height: isMobile ? '13%' : '22%',
      bottom: isMobile ? '32%' : '12%',
    };
  };

  return (
    <section 
      className="relative w-full overflow-hidden"
      style={{
        backgroundColor: IMAGES[activeIndex].bg,
        transition: 'background-color 650ms cubic-bezier(0.4, 0, 0.2, 1)',
        fontFamily: "'Inter', sans-serif"
      }}
    >
      <div className="relative w-full overflow-hidden" style={{ height: '100vh' }}>
        
        {/* 1. Grain overlay */}
        <div 
          className="absolute inset-0 pointer-events-none z-[50]"
          style={{
            opacity: 0.4,
            backgroundImage: `url("${grainSvgUri}")`,
            backgroundSize: '200px 200px',
            backgroundRepeat: 'repeat'
          }}
        />

        {/* 2. Giant ghost text "3D SHAPE" */}
        <div 
          className="absolute inset-x-0 flex items-center justify-center pointer-events-none select-none z-[2]"
          style={{ top: '18%' }}
        >
          <span 
            className="font-display-anton uppercase text-white tracking-[-0.02em] whitespace-nowrap"
            style={{
              fontSize: 'clamp(90px, 28vw, 380px)',
              fontWeight: 900,
              opacity: 1,
              lineHeight: 1
            }}
          >
            3D SHAPE
          </span>
        </div>

        {/* 3. Top-left brand label "TOONHUB" */}
        <div className="absolute top-6 left-4 sm:left-8 z-[60] text-xs font-semibold uppercase text-white opacity-90 tracking-[0.18em]">
          TOONHUB
        </div>

        {/* 4. Carousel */}
        <div className="absolute inset-0 z-[3]">
          {IMAGES.map((img, idx) => {
            const roleStyle = getRoleStyle(idx);
            return (
              <div
                key={img.src}
                style={{
                  position: 'absolute',
                  aspectRatio: '0.6 / 1',
                  ...roleStyle,
                  transition: 'transform 650ms cubic-bezier(0.4,0,0.2,1), filter 650ms cubic-bezier(0.4,0,0.2,1), opacity 650ms cubic-bezier(0.4,0,0.2,1), left 650ms cubic-bezier(0.4,0,0.2,1)',
                  willChange: 'transform, filter, opacity'
                }}
              >
                <img
                  src={img.src}
                  alt={`Toonhub figurine ${idx + 1}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    objectPosition: 'bottom center'
                  }}
                  draggable={false}
                />
              </div>
            );
          })}
        </div>

        {/* 5. Bottom-left text + nav buttons */}
        <div 
          className="absolute bottom-6 left-4 sm:bottom-20 sm:left-24 z-[60]"
          style={{ maxWidth: '320px' }}
        >
          <p className="font-bold uppercase tracking-widest mb-2 sm:mb-3 text-base sm:text-[22px] text-white opacity-95" style={{ letterSpacing: '0.02em' }}>
            TOONHUB FIGURINES
          </p>
          
          <p className="hidden sm:block text-xs sm:text-sm text-white opacity-85 leading-[1.6] mb-4 sm:mb-5">
            The artwork is stunning, shipped fully prepared. The finish is a vision, the 3D craft is flawless. Many thanks! Wishing you the win. Order now.
          </p>

          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => navigate('prev')}
              className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 border-white flex items-center justify-center text-white bg-transparent transition-all duration-150 hover:scale-105 hover:bg-white/10 active:scale-95 cursor-pointer"
              aria-label="Previous figurine"
            >
              <ArrowLeft className="w-6 h-6 sm:w-7 sm:h-7" strokeWidth={2.25} />
            </button>
            <button
              onClick={() => navigate('next')}
              className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 border-white flex items-center justify-center text-white bg-transparent transition-all duration-150 hover:scale-105 hover:bg-white/10 active:scale-95 cursor-pointer"
              aria-label="Next figurine"
            >
              <ArrowRight className="w-6 h-6 sm:w-7 sm:h-7" strokeWidth={2.25} />
            </button>
          </div>
        </div>

        {/* 6. Bottom-right link "DISCOVER IT" */}
        <div className="absolute bottom-6 right-4 sm:bottom-20 sm:right-10 z-[60]">
          <a
            href="#products"
            className="group flex items-center gap-2 font-display-anton text-white opacity-95 hover:opacity-100 transition-opacity duration-200 uppercase no-underline cursor-pointer"
            style={{
              fontSize: 'clamp(20px, 4vw, 56px)',
              fontWeight: 400,
              letterSpacing: '-0.02em',
              lineHeight: 1
            }}
          >
            <span>DISCOVER IT</span>
            <ArrowRight 
              className="w-5 h-5 sm:w-8 sm:h-8 transition-transform duration-200 group-hover:translate-x-1" 
              strokeWidth={2.25} 
            />
          </a>
        </div>

      </div>
    </section>
  );
};
