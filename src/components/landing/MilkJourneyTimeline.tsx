import React, { useState, useRef } from 'react';
import { Milk, ShieldCheck, Sliders, UserCheck, ChevronLeft, ChevronRight } from 'lucide-react';

interface JourneyStep {
  step: number;
  title: string;
  desc: string;
  image: string;
  icon: React.ReactNode;
  tag: string;
}

const JOURNEY_STEPS: JourneyStep[] = [
  {
    step: 1,
    title: 'Village Sourcing',
    desc: 'Farmers bring fresh milk daily to computerized booths, checking Fat, SNF, and volume instant slips.',
    image: '/images/blog_farmer_organic.jpg',
    icon: <Milk size={16} className="text-emerald-700" />,
    tag: 'Digital Intake'
  },
  {
    step: 2,
    title: 'Cold Chain Chilling',
    desc: 'Milk is tested for premium quality grades and immediately cooled to 4°C to preserve natural vitamins.',
    image: '/images/dairy_farm_bg.png',
    icon: <ShieldCheck size={16} className="text-emerald-700" />,
    tag: '4°C Rapid Cooling'
  },
  {
    step: 3,
    title: 'Automated Pasteurization',
    desc: 'Processed touch-free using state-of-the-art homogenization and pasteurization for consistent purity.',
    image: '/images/proof_lab.jpg',
    icon: <Sliders size={16} className="text-emerald-700" />,
    tag: 'NABL Certified'
  },
  {
    step: 4,
    title: 'Aromatic Delivery',
    desc: 'Sealed in packets and jars, delivered fresh daily in temperature-controlled transport to households.',
    image: '/images/blog_a2_milk.jpg',
    icon: <UserCheck size={16} className="text-emerald-700" />,
    tag: 'Farm to Doorstep'
  }
];

export const MilkJourneyTimeline: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, clientWidth } = scrollRef.current;
    const stepIndex = Math.round(scrollLeft / (clientWidth * 0.78));
    setActiveStep(Math.min(Math.max(stepIndex, 0), JOURNEY_STEPS.length - 1));
  };

  const scrollToStep = (index: number) => {
    if (!scrollRef.current) return;
    const cardWidth = scrollRef.current.clientWidth * 0.78;
    scrollRef.current.scrollTo({
      left: index * cardWidth,
      behavior: 'smooth'
    });
    setActiveStep(index);
  };

  return (
    <section id="journey" className="process-flow-section py-16 sm:py-24 bg-[#FAF9F5] scroll-mt-20 overflow-hidden border-b border-stone-200/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="landing-section-header text-center mb-10 sm:mb-16 max-w-2xl mx-auto">
          <span className="section-tagline text-xs sm:text-sm font-bold tracking-widest uppercase text-emerald-800">
            Trace the Purity
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#1f3d2b] tracking-tight mt-1 mb-2">
            The Path of Pure Milk
          </h2>
          <div className="w-14 h-1 bg-[#d4a373] rounded-full mx-auto my-3" />
          <p className="text-stone-600 text-xs sm:text-sm md:text-base leading-relaxed max-w-lg mx-auto">
            We track every droplet from cattle collection centers to hygienic packing plants, assuring absolute quality.
          </p>
        </div>

        {/* Timeline Container */}
        <div className="relative">
          
          {/* Scrollable Timeline Track */}
          <div 
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex overflow-x-auto md:grid md:grid-cols-4 gap-4 sm:gap-6 -mx-4 px-6 md:mx-0 md:px-0 pt-4 pb-4 snap-x snap-mandatory no-scrollbar relative"
          >
            {/* Dashed Connecting Line (Spans across all cards on mobile and desktop) */}
            <div 
              className="absolute top-[22px] left-[50px] md:left-[12%] right-[50px] md:right-[12%] h-0.5 border-t-2 border-dashed border-[#234b35]/40 z-0 pointer-events-none"
              style={{ minWidth: 'calc(4 * 270px - 140px)' }}
              aria-hidden="true"
            />

            {JOURNEY_STEPS.map((item, idx) => (
              <div 
                key={item.step}
                className="flex-shrink-0 w-[78vw] sm:w-[68vw] max-w-[275px] md:w-auto snap-center flex flex-col items-center group relative z-10"
              >
                {/* Numbered Step Circle (Matching reference design) */}
                <div 
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-sm transition-all duration-300 mb-4 shadow-md ring-4 ring-[#FAF9F5] ${
                    activeStep === idx 
                      ? 'bg-[#1e4630] text-white scale-110 shadow-emerald-900/30' 
                      : 'bg-[#2d5a3f] text-white hover:scale-105'
                  }`}
                >
                  {item.step}
                </div>

                {/* Timeline Card Box */}
                <div className="w-full bg-white rounded-[26px] p-3.5 sm:p-5 border border-stone-200/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1 flex flex-col justify-between flex-1">
                  
                  {/* Step Image Container */}
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-stone-100 mb-3.5 shadow-inner">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />

                    {/* Translucent Glass Pill Badge in Corner */}
                    <div className="absolute top-2 left-2 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1.5 border border-white/50 shadow-sm">
                      {item.icon}
                      <span className="text-[10px] font-bold text-gray-800 tracking-wide">{item.tag}</span>
                    </div>
                  </div>

                  {/* Step Content */}
                  <div className="text-center px-1">
                    <h3 className="text-base sm:text-lg font-extrabold text-gray-900 mb-1.5 leading-snug group-hover:text-emerald-800 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-[13px] text-gray-600 font-normal leading-relaxed">
                      {item.desc}
                    </p>
                  </div>

                </div>
              </div>
            ))}
          </div>

          {/* Mobile Swipe Pagination Dots & Controls */}
          <div className="flex md:hidden items-center justify-center gap-2 mt-4">
            {JOURNEY_STEPS.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollToStep(i)}
                aria-label={`Go to step ${i + 1}`}
                className={`transition-all duration-300 rounded-full ${
                  activeStep === i 
                    ? 'w-6 h-2 bg-[#1e4630]' 
                    : 'w-2 h-2 bg-stone-300 hover:bg-stone-400'
                }`}
              />
            ))}
          </div>

          {/* Mobile Hint Text */}
          <div className="text-center md:hidden mt-2 text-[11px] font-semibold text-stone-400 flex items-center justify-center gap-1">
            <span>Swipe steps to explore</span>
            <span>→</span>
          </div>

        </div>

      </div>
    </section>
  );
};
