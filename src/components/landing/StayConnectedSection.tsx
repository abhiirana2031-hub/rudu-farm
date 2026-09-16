import React, { useState } from 'react';

export const StayConnectedSection: React.FC = () => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleStoreClick = (storeName: string) => {
    setToastMessage(`🚀 Rudu Dairy app is arriving soon on ${storeName}! Pre-registration opening shortly.`);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  return (
    <section 
      id="stay-connected" 
      className="relative w-full bg-[#f2f6ee] border-y border-[#dce6d7] overflow-hidden py-10 sm:py-14 my-6 sm:my-8"
      aria-label="Stay Connected & Mobile App Download"
    >
      {/* Delicate Pastoral Farm Illustration Background */}
      <div 
        className="absolute inset-0 w-full h-full bg-no-repeat bg-bottom bg-cover pointer-events-none opacity-40 mix-blend-multiply transition-opacity"
        style={{ backgroundImage: "url('/images/stay_connected_farm.jpg')" }}
        aria-hidden="true"
      />

      {/* Subtle Gradient Veil to guarantee text contrast */}
      <div 
        className="absolute inset-0 bg-gradient-to-r from-[#f2f6ee]/90 via-[#f2f6ee]/70 to-[#f2f6ee]/90 pointer-events-none"
        aria-hidden="true"
      />

      {/* Foreground Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8">
        
        {/* Left Column: Heading & Description */}
        <div className="w-full md:w-auto text-left">
          {/* Tagline with Leaf Icon */}
          <div className="inline-flex items-center gap-2 text-[#2d5038] text-[11px] sm:text-xs font-bold tracking-[0.18em] uppercase mb-1 sm:mb-2">
            <svg 
              className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#2d5038] shrink-0" 
              viewBox="0 0 24 24" 
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66C7.62 17.5 9.7 12 17 10V8zm4-6c-6.63 0-12 5.37-12 12 0 .68.06 1.35.17 2 2.78-4.25 7.42-7 12.83-7 .2 0 .4.01.6.03C22.84 5.37 22.25 2 21 2z"/>
            </svg>
            <span>STAY CONNECTED</span>
          </div>

          {/* Main Title in signature handwritten cursive */}
          <h2 className="font-['Caveat',cursive] text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-bold text-[#1b3b24] tracking-tight leading-tight sm:leading-none mb-2 sm:mb-3">
            Freshness, Now Closer to You
          </h2>

          {/* Subtitle / Description */}
          <p className="text-gray-700 sm:text-[#38533f] text-xs sm:text-sm md:text-base font-medium max-w-xl leading-relaxed">
            Order your favourite dairy products online and enjoy farm-fresh goodness at your doorstep.
          </p>
        </div>

        {/* Right Column: Official App Store Badges */}
        <div className="flex flex-row items-center justify-start md:justify-end gap-3 sm:gap-4 shrink-0 w-full md:w-auto">
          {/* Google Play Badge */}
          <button
            type="button"
            onClick={() => handleStoreClick('Google Play Store')}
            className="group bg-black hover:bg-neutral-900 active:scale-98 text-white px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl flex items-center gap-2.5 sm:gap-3 transition-all duration-200 shadow-sm hover:shadow-md border border-neutral-800 cursor-pointer"
            aria-label="Get it on Google Play"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" aria-hidden="true">
              <path fill="#00D7FE" d="M3.6 1.8C3.3 2.1 3.1 2.6 3.1 3.2v17.6c0 .6.2 1.1.5 1.4l9.5-9.6L3.6 1.8z"/>
              <path fill="#00EB78" d="M16.9 16.3l-3.8-3.7-9.5 9.6c.4.4 1 .5 1.7.1l11.6-6z"/>
              <path fill="#FF394A" d="M16.9 7.7L5.3 1.7C4.6 1.3 4 1.4 3.6 1.8l9.5 9.6 3.8-3.7z"/>
              <path fill="#FFC900" d="M20.6 10.1l-3.7-1.9-3.4 3.4 3.4 3.4 3.7-1.9c1.1-.6 1.1-2.4 0-3z"/>
            </svg>
            <div className="text-left flex flex-col justify-center">
              <span className="text-[8px] sm:text-[9px] uppercase tracking-wider text-gray-400 font-semibold leading-none mb-0.5">
                GET IT ON
              </span>
              <span className="text-xs sm:text-[14px] font-bold text-white tracking-tight leading-tight">
                Google Play
              </span>
            </div>
          </button>

          {/* App Store Badge */}
          <button
            type="button"
            onClick={() => handleStoreClick('Apple App Store')}
            className="group bg-black hover:bg-neutral-900 active:scale-98 text-white px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl flex items-center gap-2.5 sm:gap-3 transition-all duration-200 shadow-sm hover:shadow-md border border-neutral-800 cursor-pointer"
            aria-label="Download on the App Store"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 sm:w-6 sm:h-6 fill-white shrink-0" aria-hidden="true">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.93-2.85-.9.04-1.99.6-2.64 1.35-.57.65-1.07 1.7-0.93 2.73 1.01.08 2.02-.48 2.64-1.23z"/>
            </svg>
            <div className="text-left flex flex-col justify-center">
              <span className="text-[8px] sm:text-[9px] text-gray-400 font-normal leading-none mb-0.5">
                Download on the
              </span>
              <span className="text-xs sm:text-[14px] font-bold text-white tracking-tight leading-tight">
                App Store
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Launch Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1a3826] text-white px-5 py-3 rounded-2xl shadow-xl border border-emerald-500/30 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 duration-300">
          <span className="text-sm font-medium">{toastMessage}</span>
          <button 
            type="button" 
            onClick={() => setToastMessage(null)} 
            className="text-emerald-300 hover:text-white text-xs font-bold px-1.5 py-0.5 rounded ml-2 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}
    </section>
  );
};
