import React, { useState } from 'react';
import { X } from 'lucide-react';

interface ProcessStep {
  step: number;
  title: string;
  subtitle: string;
  image: string;
  desc: string;
}

const PROCESS_STEPS: ProcessStep[] = [
  {
    step: 1,
    title: 'Healthy Cows',
    subtitle: 'Grass Fed',
    image: '/images/1.jpeg',
    desc: 'Our cows graze freely in open green pastures, fed on nutritious natural fodder with zero synthetic hormones.'
  },
  {
    step: 2,
    title: 'Pure Milk',
    subtitle: 'Collection',
    image: '/images/2.jpeg',
    desc: 'Automated touch-free milking and digital testing for Fat & SNF at computerized collection booths within minutes.'
  },
  {
    step: 3,
    title: 'Traditional',
    subtitle: 'Bilona Method',
    image: '/images/3.jpeg',
    desc: 'Slow, authentic curd churning using age-old wooden bilona techniques to preserve vital vitamins and probiotic cultures.'
  },
  {
    step: 4,
    title: 'Fresh to',
    subtitle: 'Your Home',
    image: '/images/3.jpeg',
    desc: 'Chilled through insulated cold-chains and delivered in sanitized glass bottles within 4 hours of milking.'
  }
];

// 1. Healthy Cows & Calf (matching exact reference silhouette)
const HealthyCowsIcon: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => (
  <svg viewBox="0 0 54 54" fill="#1e4d34" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Mother Cow Body & Head */}
    <path d="M43 17c-1.2-1.5-3-2.5-5.5-2.8-3.5-.5-9.5-.2-13 1.2-2 1-3.5 2.5-4.8 4.2l-4.5 1.5c-1.2.4-2 1.5-2 2.8v1.2c0 .5.4 1 .9 1h1.8c.6 0 1.2-.4 1.4-1l1-2.2c.8-1.2 1.8-2 3-2.5 2-.8 5.5-.8 8-.6 2.8.2 5.2 1.2 6.5 2.8 1 1.4 1.5 3.2 1.2 5.5-.4 2.8-1.6 4.8-3.6 6-1.2.6-2.5 1-3.8 1.2v5.5c0 .6.5 1.2 1.2 1.2h1.2c.6 0 1.2-.5 1.2-1.2v-4.8c1.5-.4 3-1.2 4-2.2 1.5-1.5 2.2-3.6 2.5-6 .4-2.6 0-5.2-1.4-7.4z" />
    <path d="M21 24.5c-1.2 0-2.5.4-3.5 1.2l-3.5 2.8c-.6.5-1 1.2-1 2v11c0 .6.5 1.2 1.2 1.2h1.2c.6 0 1.2-.5 1.2-1.2v-8h3.2v8c0 .6.5 1.2 1.2 1.2h1.2c.6 0 1.2-.5 1.2-1.2v-8h4.8v8c0 .6.5 1.2 1.2 1.2h1.2c.6 0 1.2-.5 1.2-1.2v-9.5c0-1.6-.8-3-2-4-1.6-1.2-3.8-1.8-6.2-2l-2.5-.5z" />
    {/* Grazing calf */}
    <path d="M12.5 32c-.8 0-1.6.4-2 1l-2 2.8c-.4.6-.4 1.4 0 2 .4.6 1.2 1 2 1h1.5v2.8c0 .6.5 1.2 1.2 1.2h1.2c.6 0 1.2-.5 1.2-1.2V37c0-1.2-.6-2.2-1.6-2.8l-1.5-.4z" />
    {/* Grass blades */}
    <path d="M7 42.5c.6-1.2 1.5-2.2 2.5-2.8.3 1 .5 2 .5 2.8H7zm3.5 0c.3-1.2 1-2.2 2-2.8.3 1 .3 2 0 2.8h-2z" />
  </svg>
);

// 2. Pure Milk Jar with solid milk level
const PureMilkJarIcon: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => (
  <svg viewBox="0 0 54 54" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Solid green milk filling */}
    <path d="M18.5 29c2.5-1.5 5.5 1 8.5-1s6 1 8.5-1l1 11c0 2.5-2 4.5-4.5 4.5h-10c-2.5 0-4.5-2-4.5-4.5L18.5 29z" fill="#1e4d34" />
    {/* Glass Jar Outline */}
    <path d="M21 15h12c1 0 1.8.8 1.8 1.8v1.5c0 .8-.6 1.5-1.4 1.7l-1.2.2c-.8.1-1.4.8-1.4 1.6v2c0 1.5 1.5 2.8 2.8 4l2.2 3.2c.8 1.2 1.2 2.6 1.2 4v7c0 3-2.5 5.5-5.5 5.5h-9c-3 0-5.5-2.5-5.5-5.5v-7c0-1.4.4-2.8 1.2-4l2.2-3.2c1.3-1.2 2.8-2.5 2.8-4v-2c0-.8-.6-1.5-1.4-1.6l-1.2-.2c-.8-.2-1.4-.9-1.4-1.7v-1.5c0-1 .8-1.8 1.8-1.8z" stroke="#1e4d34" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
    {/* Top Cap */}
    <rect x="19" y="12" width="16" height="3" rx="1.5" fill="#1e4d34" />
  </svg>
);

// 3. Traditional Bilona Method (authentic wooden churner & pot)
const BilonaMethodIcon: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => (
  <svg viewBox="0 0 54 54" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Top crossbar & finial */}
    <rect x="15" y="13" width="24" height="3" rx="1" fill="#1e4d34" />
    <path d="M27 9v4" stroke="#1e4d34" strokeWidth="2.5" strokeLinecap="round" />
    {/* Vertical wooden side frames */}
    <line x1="17.5" y1="16" x2="17.5" y2="43" stroke="#1e4d34" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="36.5" y1="16" x2="36.5" y2="43" stroke="#1e4d34" strokeWidth="2.5" strokeLinecap="round" />
    {/* Bottom frame base */}
    <line x1="14" y1="43" x2="40" y2="43" stroke="#1e4d34" strokeWidth="2.5" strokeLinecap="round" />
    {/* Central churning staff */}
    <line x1="27" y1="16" x2="27" y2="30" stroke="#1e4d34" strokeWidth="2.8" strokeLinecap="round" />
    <line x1="23" y1="23" x2="31" y2="23" stroke="#1e4d34" strokeWidth="2" strokeLinecap="round" />
    {/* Earthen Pot with solid fill */}
    <path d="M20.5 32c-2 2.2-2.5 5-2.5 8 0 3.5 4 6 9 6s9-2.5 9-6c0-3-.5-5.8-2.5-8h-13z" fill="#1e4d34" />
    {/* Churning ropes on pot */}
    <line x1="22" y1="35" x2="32" y2="35" stroke="#FAF8F5" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="21.5" y1="38" x2="32.5" y2="38" stroke="#FAF8F5" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// 4. Fresh Delivery Truck (van with bottle silhouette facing left)
const FreshDeliveryIcon: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => (
  <svg viewBox="0 0 54 54" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Solid green truck body facing left */}
    <path d="M39 20H18c-2 0-3.5 1.5-3.5 3.5v14c0 .8.7 1.5 1.5 1.5h2.5c0-2.8 2.2-5 5-5s5 2.2 5 5h7c0-2.8 2.2-5 5-5s5 2.2 5 5h1c.8 0 1.5-.7 1.5-1.5v-10c0-1.8-.7-3.5-2-4.8l-3.5-4.2H39z" fill="#1e4d34" />
    {/* Cab windshield cut-out */}
    <path d="M17.5 24h5c.8 0 1.5.7 1.5 1.5v4H16l1.5-5.5z" fill="#FAF8F5" />
    {/* White milk bottle cut-out inside cargo */}
    <path d="M29 24h3v1h-3zM28.5 25.5h4c.5 0 .8.3.8.8v6.2c0 .8-.7 1.5-1.5 1.5h-2.6c-.8 0-1.5-.7-1.5-1.5v-6.2c0-.5.3-.8.8-.8z" fill="#FAF8F5" />
    {/* Left Wheel */}
    <circle cx="23.5" cy="39" r="4" fill="#FAF8F5" stroke="#1e4d34" strokeWidth="2.5" />
    <circle cx="23.5" cy="39" r="1.5" fill="#1e4d34" />
    {/* Right Wheel */}
    <circle cx="37.5" cy="39" r="4" fill="#FAF8F5" stroke="#1e4d34" strokeWidth="2.5" />
    <circle cx="37.5" cy="39" r="1.5" fill="#1e4d34" />
  </svg>
);

// Organic Leaf Sprig for header
const LeafSprig: React.FC<{ flip?: boolean }> = ({ flip = false }) => (
  <svg 
    className={`w-6 h-5 text-[#2d6a4f] inline-block ${flip ? 'scale-x-[-1]' : ''}`} 
    viewBox="0 0 28 18" 
    fill="currentColor"
  >
    <path d="M2 16C5 14 10 9 16 3C13 6 9 11 5 14C11 12 17 7 22 1C18 5 13 11 8 15C14 14 20 10 25 5C21 10 15 15 9 17C4 18 2 17 2 16Z" opacity="0.4" />
    <path d="M12 6C10 2 15 0 19 0C22 3 22 7 19 9C15 10 12 8 12 6Z" />
    <path d="M5 11C4 8 8 6 12 7C14 10 13 13 10 15C7 16 5 14 5 11Z" />
    <path d="M2 17C7 15 13 10 19 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
  </svg>
);

export const MilkJourneyTimeline: React.FC = () => {
  const [selectedStep, setSelectedStep] = useState<ProcessStep | null>(null);

  const getStepIcon = (step: number) => {
    switch (step) {
      case 1: return <HealthyCowsIcon className="w-8 h-8 sm:w-11 sm:h-11 md:w-13 md:h-13" />;
      case 2: return <PureMilkJarIcon className="w-8 h-8 sm:w-11 sm:h-11 md:w-13 md:h-13" />;
      case 3: return <BilonaMethodIcon className="w-8 h-8 sm:w-11 sm:h-11 md:w-13 md:h-13" />;
      case 4: return <FreshDeliveryIcon className="w-8 h-8 sm:w-11 sm:h-11 md:w-13 md:h-13" />;
      default: return null;
    }
  };

  return (
    <section id="journey" className="process-flow-section py-16 sm:py-24 bg-[#FAF8F5] scroll-mt-20 overflow-x-hidden border-b border-[#EBE6DD]">
      <div className="max-w-5xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16 max-w-2xl mx-auto">
          {/* Tagline flanked by leaves */}
          <div className="inline-flex items-center justify-center gap-2 mb-2">
            <LeafSprig />
            <span className="text-[11px] sm:text-xs md:text-sm font-extrabold uppercase tracking-[0.25em] text-[#2d6a4f]">
              OUR PROCESS
            </span>
            <LeafSprig flip />
          </div>

          {/* Heading */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl text-[#1e4630] font-normal tracking-wide mt-1 mb-2 font-['Caveat',cursive] sm:font-['Playfair_Display',serif] sm:italic sm:font-semibold">
            From Farm to Freshness
          </h2>
        </div>

        {/* 4 Steps in a Guaranteed Single Horizontal Row Without Scroll */}
        <div className="w-full flex flex-row items-start justify-between">
          {PROCESS_STEPS.map((step, idx) => (
            <React.Fragment key={step.step}>
              {/* Step Item */}
              <div 
                className="flex-1 flex flex-col items-center text-center cursor-pointer group px-0.5 sm:px-1"
                onClick={() => setSelectedStep(step)}
              >
                {/* Clean Circular Icon without number badge */}
                <div className="w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full border-[1.5px] sm:border-2 border-[#1e4d34] bg-white flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:border-emerald-600 transition-all duration-300 group-hover:scale-105 mb-2 sm:mb-3">
                  {getStepIcon(step.step)}
                </div>

                {/* Step Titles */}
                <h3 className="text-[11px] sm:text-sm md:text-base font-bold text-gray-900 leading-tight group-hover:text-emerald-800 transition-colors">
                  {step.title}
                </h3>
                <p className="text-[9px] sm:text-xs md:text-sm font-medium text-stone-600 leading-tight mt-0.5">
                  {step.subtitle}
                </p>
              </div>

              {/* Centered Horizontal Arrow between steps */}
              {idx < PROCESS_STEPS.length - 1 && (
                <div className="flex items-center justify-center text-[#1e4d34]/70 pt-4 sm:pt-7 md:pt-9 px-0.5 sm:px-2 flex-shrink-0">
                  <svg 
                    className="w-3.5 h-3.5 sm:w-5 sm:h-5 md:w-6 md:h-6 transform transition-transform group-hover:translate-x-0.5" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="1.8" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <polyline points="14 5 21 12 14 19" />
                  </svg>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

      </div>

      {/* Fullscreen Lightbox Modal on click */}
      {selectedStep && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelectedStep(null)}
        >
          <div 
            className="relative max-w-4xl max-h-[92vh] w-full bg-white rounded-3xl p-4 sm:p-6 shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-stone-100">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-[#1e4630] text-white font-bold text-sm flex items-center justify-center">
                  {selectedStep.step}
                </span>
                <h3 className="font-extrabold text-stone-900 text-base sm:text-lg">
                  {selectedStep.title} — {selectedStep.subtitle}
                </h3>
              </div>
              <button 
                onClick={() => setSelectedStep(null)}
                className="p-2 rounded-full hover:bg-stone-100 text-stone-500 hover:text-stone-800 transition"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Image View */}
            <div className="flex-1 flex items-center justify-center overflow-auto p-2 bg-[#FAF8F5] rounded-2xl border border-stone-200/60">
              <img 
                src={selectedStep.image} 
                alt={selectedStep.title} 
                className="max-h-[65vh] w-auto max-w-full object-contain rounded-xl shadow-md"
              />
            </div>

            {/* Modal Footer Description */}
            <p className="text-stone-600 text-xs sm:text-sm mt-3 px-2 text-center">
              {selectedStep.desc}
            </p>
          </div>
        </div>
      )}
    </section>
  );
};
