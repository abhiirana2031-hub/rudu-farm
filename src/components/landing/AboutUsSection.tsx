import React, { useState } from 'react';
import { ShieldCheck, Users, Heart, Leaf, ChevronRight, Award, Building2, Target, Eye, X } from 'lucide-react';

const CowIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4 8l2.5 1.5M20 8l-2.5 1.5" />
    <path d="M5 6c0-2 2-3 4-3h6c2 0 4 1 4 3" />
    <path d="M6.5 9.5C6.2 11 6 12.5 6 14c0 3 2.5 5 6 5s6-2 6-5c0-1.5-.2-3-.5-4.5" />
    <ellipse cx="12" cy="15.5" rx="3.5" ry="2.5" />
    <circle cx="10" cy="15.5" r="0.75" fill="currentColor" />
    <circle cx="14" cy="15.5" r="0.75" fill="currentColor" />
    <circle cx="9" cy="11.5" r="1" fill="currentColor" />
    <circle cx="15" cy="11.5" r="1" fill="currentColor" />
  </svg>
);

const SproutIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M7 20h10" />
    <path d="M12 20v-8" />
    <path d="M12 12c-2.5-3-5.5-2.5-7-2 0 3 2.5 5.5 7 5" />
    <path d="M12 10c2.5-3.5 6-3 7-2 0 3.5-3 6-7 5.5" />
  </svg>
);

interface AboutUsSectionProps {
  onNavigateToJourney?: () => void;
}

export const AboutUsSection: React.FC<AboutUsSectionProps> = ({ onNavigateToJourney }) => {
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [detailTab, setDetailTab] = useState<'mission' | 'team' | 'infra' | 'certs'>('mission');

  const values = [
    {
      id: 'cows',
      icon: <CowIcon className="w-5 h-5 text-[#1b633b]" />,
      title: 'Our Own Cows',
      desc: 'We raise and care for our own cows.'
    },
    {
      id: 'traditional',
      icon: <Leaf className="w-5 h-5 text-[#1b633b]" strokeWidth={2.2} />,
      title: 'Traditional Processing',
      desc: 'Authentic methods like bilona for real taste and nutrition.'
    },
    {
      id: 'purity',
      icon: <ShieldCheck className="w-5 h-5 text-[#1b633b]" strokeWidth={2.2} />,
      title: 'Purity & Safety',
      desc: 'No harmful chemicals, no shortcuts.'
    },
    {
      id: 'small-batch',
      icon: <Users className="w-5 h-5 text-[#1b633b]" strokeWidth={2.2} />,
      title: 'Small-Batch Production',
      desc: 'Freshness in every batch, not mass production.'
    },
    {
      id: 'health',
      icon: <Heart className="w-5 h-5 text-[#1b633b]" strokeWidth={2.2} />,
      title: 'Health for Your Family',
      desc: 'Rich in nutrition, naturally good for you.'
    },
    {
      id: 'transparency',
      icon: <SproutIcon className="w-5 h-5 text-[#1b633b]" />,
      title: 'Transparency',
      desc: 'You know exactly where your food comes from.'
    }
  ];

  return (
    <section id="about" className="relative w-full bg-[#FAF8F5] text-stone-800 scroll-mt-16 overflow-hidden">
      
      {/* ─────────────────────────────────────────────────────────────
          1. TOP HERO BANNER: "Pure by Nature, Made by Us"
         ───────────────────────────────────────────────────────────── */}
      <div className="relative pt-12 sm:pt-16 lg:pt-20 pb-16 sm:pb-24 lg:pb-28 bg-[#FAF8F5]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Heading, Subtext, CTA */}
            <div className="lg:col-span-7 flex flex-col justify-center z-10">
              {/* Eyebrow / Kicker */}
              <div className="inline-flex items-center gap-2.5 mb-3 sm:mb-4">
                <span className="text-[#c1121f] text-xs sm:text-sm font-bold tracking-[0.18em] uppercase">
                  ABOUT US
                </span>
                <span className="w-8 h-[2px] bg-[#c1121f] rounded-full inline-block" />
              </div>

              {/* Title */}
              <h1 className="font-editorial-serif text-3xl sm:text-5xl lg:text-[3.35rem] font-bold text-[#14281d] leading-[1.12] mb-5 sm:mb-6 tracking-tight">
                Pure by Nature,<br />
                Made by Us
              </h1>

              {/* Paragraph */}
              <p className="text-stone-600 text-sm sm:text-base lg:text-lg leading-relaxed max-w-lg mb-6 sm:mb-8 font-normal">
                At Rudu, we believe in the power of nature, the goodness of cows, and the value of honest work.
              </p>

              {/* CTA Action */}
              <div className="flex items-center gap-4 flex-wrap">
                <button
                  onClick={onNavigateToJourney}
                  className="inline-flex items-center gap-2.5 bg-[#c1121f] hover:bg-[#a60f1b] text-white font-semibold text-sm sm:text-base px-8 py-3.5 rounded-full shadow-lg shadow-red-700/20 hover:shadow-xl hover:shadow-red-700/30 transition-all duration-300 transform hover:-translate-y-0.5 group cursor-pointer"
                >
                  <span>Our Journey</span>
                  <span className="text-lg transition-transform duration-200 group-hover:translate-x-1.5">→</span>
                </button>

                <button
                  onClick={() => setShowDetailsModal(true)}
                  className="text-stone-500 hover:text-stone-800 font-medium text-xs sm:text-sm px-3 py-1.5 transition-colors underline-offset-4 hover:underline"
                >
                  View Certifications & Team →
                </button>
              </div>
            </div>

            {/* Right Column: Beautiful Jersey Cow photo in lush meadow with handwritten overlay */}
            <div className="lg:col-span-5 relative mt-4 lg:mt-0">
              <div className="relative mx-auto max-w-[440px] lg:max-w-none rounded-[2.5rem] overflow-hidden shadow-2xl shadow-emerald-950/15 aspect-[4/3] sm:aspect-[4/3.5] group">
                <img
                  src="/images/about_hero_cow.jpg"
                  alt="Healthy Jersey Cow in Rudu Farm Pasture"
                  className="w-full h-full object-cover object-center transform transition-transform duration-700 group-hover:scale-105"
                />

                {/* Subtle soft gradient overlay on the bottom right for handwriting legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

                {/* Script Handwritten Note Overlay: "Healthy Cows ♡ Healthy Milk Happy Families" */}
                <div className="absolute bottom-5 right-6 sm:bottom-7 sm:right-8 text-right select-none pointer-events-none transform -rotate-3">
                  <div className="font-handwriting text-white text-2xl sm:text-3xl leading-[1.1] font-bold drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                    <span>Healthy Cows</span> <span className="text-xl sm:text-2xl text-red-200">♡</span><br />
                    <span>Healthy Milk</span><br />
                    <span>Happy Families</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Organic Curved Wave Transition Divider */}
        <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none pointer-events-none">
          <svg
            viewBox="0 0 1440 90"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            className="w-full h-10 sm:h-16 lg:h-20"
          >
            <path
              d="M0,45 C280,95 560,10 880,50 C1160,85 1320,30 1440,48 L1440,90 L0,90 Z"
              fill="#FFFFFF"
            />
          </svg>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. OUR STORY: "From Our Own Cows To Your Home"
         ───────────────────────────────────────────────────────────── */}
      <div className="bg-white py-14 sm:py-20 lg:py-24 relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Left Text Block */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              {/* Eyebrow / Kicker */}
              <div className="inline-flex items-center gap-2.5 mb-3">
                <span className="text-[#c1121f] text-xs sm:text-sm font-bold tracking-[0.18em] uppercase">
                  OUR STORY
                </span>
                <span className="w-8 h-[2px] bg-[#c1121f] rounded-full inline-block" />
              </div>

              {/* Title */}
              <h2 className="font-editorial-serif text-2xl sm:text-4xl lg:text-[2.65rem] font-bold text-[#14281d] leading-[1.16] mb-5 sm:mb-6 tracking-tight">
                From Our Own Cows<br />
                To Your Home
              </h2>

              {/* Paragraphs */}
              <p className="text-stone-600 text-sm sm:text-base leading-relaxed mb-4 font-normal">
                Rudu is not just a dairy brand, it's our way of life. We are a family that believes in the purity of nature, the goodness of traditional methods and the value of honest work.
              </p>

              <p className="text-stone-600 text-sm sm:text-base leading-relaxed mb-6 font-normal">
                Our journey begins with our own cows — well cared for, naturally grazed and fed with love. We milk them ourselves, process the milk using age-old traditional methods like bilona, and create pure, wholesome dairy products. Finally, we bring these products directly to your home, so you and your family can enjoy the true taste of nature.
              </p>

              {/* Handwritten italic quote with leaf on 2 lines */}
              <div className="pt-2 sm:pt-4">
                <p className="font-handwriting text-[#1d5937] text-xl sm:text-2xl lg:text-[1.65rem] leading-snug font-semibold italic max-w-lg">
                  Because for us, it's not just business,<br />
                  <span className="inline-flex items-center gap-2">
                    <span>it's a commitment to your health and happiness.</span>
                    <span className="text-[#2d6a4f] not-italic text-lg sm:text-xl" aria-hidden="true">🍃</span>
                  </span>
                </p>
              </div>
            </div>

            {/* Right Photo: Woman Churning Butter with Bilona in Clay Matka */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-[380px] lg:max-w-none rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden shadow-2xl shadow-stone-900/10 border border-stone-200/80 group aspect-[3/4]">
                <img
                  src="/images/about_bilona_woman.jpg"
                  alt="Rural Indian woman preparing pure dairy butter using traditional bilona churning in an earthen pot"
                  className="w-full h-full object-cover object-center transform transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-[2rem] sm:rounded-[2.5rem] pointer-events-none" />
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. OUR VALUES: "What Makes Rudu Different?"
         ───────────────────────────────────────────────────────────── */}
      <div className="bg-[#FAF8F5] py-14 sm:py-20 lg:py-24 border-t border-stone-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="mb-10 sm:mb-14">
            {/* Eyebrow / Kicker */}
            <div className="inline-flex items-center gap-2.5 mb-3">
              <span className="text-[#c1121f] text-xs sm:text-sm font-bold tracking-[0.18em] uppercase">
                OUR VALUES
              </span>
              <span className="w-8 h-[2px] bg-[#c1121f] rounded-full inline-block" />
            </div>

            <h2 className="font-editorial-serif text-2xl sm:text-4xl lg:text-[2.65rem] font-bold text-[#14281d] leading-[1.18] mb-3 tracking-tight">
              What Makes Rudu Different?
            </h2>

            <p className="text-stone-600 text-sm sm:text-base leading-relaxed max-w-2xl">
              We don't just make dairy products, we create trust. Here's what sets us apart:
            </p>
          </div>

          {/* 6 Value Cards Grid - Minimal, airy, clean editorial style */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-5 sm:gap-x-8 lg:gap-x-12 gap-y-7 sm:gap-y-10">
            {values.map((v) => (
              <div
                key={v.id}
                className="flex flex-col items-start gap-2.5 group"
              >
                {/* Soft Mint Sage Circular Icon Badge */}
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#e8f5ed] border border-[#d1e9db] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-200">
                  {v.icon}
                </div>

                {/* Text Content */}
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-[#14281d] mb-1 leading-snug">
                    {v.title}
                  </h3>
                  <p className="text-stone-500 text-[11px] sm:text-xs lg:text-sm leading-relaxed font-normal">
                    {v.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          4. BOTTOM BANNER: "Our Promise to You ♡"
         ───────────────────────────────────────────────────────────── */}
      <div className="bg-[#FAF8F5] pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="relative rounded-3xl sm:rounded-[2.25rem] overflow-hidden shadow-2xl shadow-stone-900/25">
            
            {/* Background Image: Cows grazing in morning sunrise pasture */}
            <img
              src="/images/about_farm_sunrise.jpg"
              alt="Cows peacefully grazing on open green pastures at sunrise"
              className="absolute inset-0 w-full h-full object-cover object-center"
            />

            {/* Rich Dark Atmospheric Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-stone-950/90 via-stone-950/80 to-stone-900/85 backdrop-blur-[0.5px]" />

            {/* Foreground Content */}
            <div className="relative z-10 p-8 sm:p-11 lg:p-14">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-center">
                
                {/* Left Side: Cursive "Our Promise to You ♡" */}
                <div className="md:col-span-5 flex flex-col justify-center">
                  <div className="font-handwriting text-white text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-wide leading-tight select-none">
                    <span>Our Promise</span><br />
                    <span className="inline-flex items-center gap-2">
                      <span>to You</span>
                      <span className="text-2xl sm:text-3xl text-white/90">♡</span>
                    </span>
                  </div>
                  {/* Decorative underline brush line */}
                  <div className="mt-2 w-28 sm:w-36 h-[2px] bg-white/70 rounded-full" />
                </div>

                {/* Right Side: Divider & Statement */}
                <div className="md:col-span-7 md:border-l md:border-white/20 md:pl-8 lg:pl-12">
                  <p className="text-stone-100 text-sm sm:text-base lg:text-lg leading-relaxed font-normal">
                    We will always put our cows, our process and your health first. Because when you choose Rudu, you're not just buying dairy — you're supporting a better, healthier and more sustainable tomorrow.
                  </p>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          5. EXPANDABLE / MODAL DRAWER FOR LAB STANDARDS & LEADERSHIP
         ───────────────────────────────────────────────────────────── */}
      {showDetailsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[85vh] overflow-y-auto shadow-2xl border border-stone-200 p-6 sm:p-8 relative">
            
            <button
              onClick={() => setShowDetailsModal(false)}
              className="absolute top-5 right-5 w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-all"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>

            <div className="inline-flex items-center gap-2 text-[#c1121f] text-xs font-bold tracking-widest uppercase mb-2">
              <Award size={15} />
              <span>Rudu Dairy Technical Transparency</span>
            </div>

            <h3 className="font-editorial-serif text-2xl sm:text-3xl font-bold text-stone-900 mb-6">
              Standards, Infrastructure & Leadership
            </h3>

            {/* Modal Tabs */}
            <div className="flex gap-2 border-b border-stone-200 pb-3 mb-6 overflow-x-auto no-scrollbar">
              <button
                onClick={() => setDetailTab('mission')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  detailTab === 'mission'
                    ? 'bg-[#c1121f] text-white shadow-sm'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                Mission & Vision
              </button>
              <button
                onClick={() => setDetailTab('infra')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  detailTab === 'infra'
                    ? 'bg-[#c1121f] text-white shadow-sm'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                Infrastructure (BMC & AMCU)
              </button>
              <button
                onClick={() => setDetailTab('certs')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  detailTab === 'certs'
                    ? 'bg-[#c1121f] text-white shadow-sm'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                Certifications & FSSAI
              </button>
              <button
                onClick={() => setDetailTab('team')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  detailTab === 'team'
                    ? 'bg-[#c1121f] text-white shadow-sm'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                Leadership
              </button>
            </div>

            {/* Modal Tab Content */}
            {detailTab === 'mission' && (
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200/60">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center mb-3">
                    <Target size={20} />
                  </div>
                  <h4 className="font-bold text-stone-900 text-base mb-2">Our Mission</h4>
                  <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                    To empower rural dairy farmers with transparent daily milk pricing, zero-error automated banking payouts, and modern veterinary support, while delivering unadulterated, grade-A pure dairy products to every Indian home.
                  </p>
                </div>
                <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200/60">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-900 flex items-center justify-center mb-3">
                    <Eye size={20} />
                  </div>
                  <h4 className="font-bold text-stone-900 text-base mb-2">Our Vision</h4>
                  <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                    To become India's premier tech-driven dairy cooperative—setting gold standards in cold-chain purity, zero-emission logistics, and sustainable indigenous cattle care.
                  </p>
                </div>
              </div>
            )}

            {detailTab === 'infra' && (
              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-red-100 text-red-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Building2 size={18} />
                  </div>
                  <div>
                    <h5 className="font-bold text-stone-900 text-sm">4°C Bulk Milk Coolers (BMC)</h5>
                    <p className="text-stone-600 text-xs mt-1">45+ chilling stations situated within 3km of village hubs, cooling fresh milk below 4°C in 30 minutes to lock in freshness.</p>
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-red-100 text-red-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <ShieldCheck size={18} />
                  </div>
                  <div>
                    <h5 className="font-bold text-stone-900 text-sm">NABL Central Testing Lab</h5>
                    <p className="text-stone-600 text-xs mt-1">State-of-the-art Gas Chromatography & HPLC testing equipment for multi-spectrum adulterant screening.</p>
                  </div>
                </div>
              </div>
            )}

            {detailTab === 'certs' && (
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                  <span className="text-[11px] font-bold text-red-700 uppercase tracking-wider block mb-1">Lic. No. 10021051000189</span>
                  <h5 className="font-bold text-stone-900 text-sm">FSSAI Certified</h5>
                  <p className="text-stone-500 text-xs mt-1">Compliant with Food Safety and Standards Authority of India safety benchmarks.</p>
                </div>
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                  <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block mb-1">Standard ISO/IEC 17025</span>
                  <h5 className="font-bold text-stone-900 text-sm">NABL Accredited</h5>
                  <p className="text-stone-500 text-xs mt-1">Certified zero chemical adulteration, zero antibiotics, and zero heavy metal residue.</p>
                </div>
              </div>
            )}

            {detailTab === 'team' && (
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                  <h5 className="font-bold text-stone-900 text-sm">Rameshwar Verma</h5>
                  <span className="text-xs text-red-700 font-semibold block">Founder & Managing Director</span>
                  <p className="text-stone-500 text-xs mt-1">20+ years of dairy cooperative leadership in Uttar Pradesh. Pioneer of rural digitization.</p>
                </div>
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                  <h5 className="font-bold text-stone-900 text-sm">Dr. Sunita Rao</h5>
                  <span className="text-xs text-red-700 font-semibold block">Head of Quality & Veterinary Health</span>
                  <p className="text-stone-500 text-xs mt-1">Ex-NDRI Scientist specializing in cattle nutrition, disease prevention, and A2 protein testing.</p>
                </div>
              </div>
            )}

            <div className="mt-6 text-right">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-6 py-2.5 rounded-full bg-stone-900 text-white font-bold text-xs hover:bg-stone-800 transition-all cursor-pointer"
              >
                Close Window
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
