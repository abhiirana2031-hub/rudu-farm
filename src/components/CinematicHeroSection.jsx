import React, { useEffect, useRef, useState } from 'react';

export const CinematicHeroSection = ({ onScrollToSection, onHandleLogin }) => {
  const videoRef = useRef(null);
  const [videoOpacity, setVideoOpacity] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let animId;
    const FADE_DURATION = 0.5; // 0.5 seconds fade duration

    const checkTime = () => {
      if (video && video.duration) {
        const cur = video.currentTime;
        const dur = video.duration;

        // Fade in over 0.5s at the start (opacity 0 to 1)
        if (cur < FADE_DURATION) {
          setVideoOpacity(cur / FADE_DURATION);
        } 
        // Fade out over 0.5s before the end (opacity 1 to 0)
        else if (dur - cur < FADE_DURATION) {
          setVideoOpacity(Math.max(0, (dur - cur) / FADE_DURATION));
        } 
        else {
          setVideoOpacity(1);
        }
      }
      animId = requestAnimationFrame(checkTime);
    };

    const handleEnded = () => {
      setVideoOpacity(0);
      setTimeout(() => {
        if (video) {
          video.currentTime = 0;
          video.play().catch(() => {});
        }
      }, 100);
    };

    video.addEventListener('ended', handleEnded);
    animId = requestAnimationFrame(checkTime);

    return () => {
      cancelAnimationFrame(animId);
      if (video) {
        video.removeEventListener('ended', handleEnded);
      }
    };
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-white font-sans-inter text-slate-900 selection:bg-black selection:text-white">
      {/* Background Video Layer (z-0) */}
      <div 
        className="absolute left-0 right-0 bottom-0 top-[300px] w-full h-[calc(100%-300px)] pointer-events-none z-0 overflow-hidden"
        style={{ inset: 'auto 0 0 0', top: '300px' }}
      >
        <video
          ref={videoRef}
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_083109_283f3553-e28f-428b-a723-d639c617eb2b.mp4"
          autoPlay
          muted
          playsInline
          className="w-full h-full object-cover transition-opacity duration-300 ease-out"
          style={{ opacity: videoOpacity }}
        />
        
        {/* Gradient Overlay on Video */}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white pointer-events-none z-10" />
      </div>

      {/* Navigation Bar (z-10) */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto w-full">
        {/* Logo */}
        <div 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="text-3xl tracking-tight font-serif-instrument text-[#000000] cursor-pointer select-none"
        >
          Rudu<sup className="text-lg font-sans font-normal ml-0.5">®</sup>
        </div>

        {/* Menu Items */}
        <div className="hidden md:flex items-center space-x-9">
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-sm font-medium text-[#000000] transition-colors duration-200 cursor-pointer"
          >
            Home
          </button>
          <button 
            onClick={() => onScrollToSection && onScrollToSection('about')}
            className="text-sm font-medium text-[#6F6F6F] hover:text-[#000000] transition-colors duration-200 cursor-pointer"
          >
            Studio
          </button>
          <button 
            onClick={() => onScrollToSection && onScrollToSection('products')}
            className="text-sm font-medium text-[#6F6F6F] hover:text-[#000000] transition-colors duration-200 cursor-pointer"
          >
            About
          </button>
          <button 
            onClick={() => onScrollToSection && onScrollToSection('purity')}
            className="text-sm font-medium text-[#6F6F6F] hover:text-[#000000] transition-colors duration-200 cursor-pointer"
          >
            Journal
          </button>
          <button 
            onClick={() => onScrollToSection && onScrollToSection('faq')}
            className="text-sm font-medium text-[#6F6F6F] hover:text-[#000000] transition-colors duration-200 cursor-pointer"
          >
            Reach Us
          </button>
        </div>

        {/* CTA Button */}
        <button 
          onClick={() => onHandleLogin && onHandleLogin('farmer')}
          className="rounded-full px-6 py-2.5 text-sm bg-[#000000] text-white hover:scale-[1.03] transition-transform duration-200 font-medium cursor-pointer shadow-sm"
        >
          Begin Journey
        </button>
      </nav>

      {/* Hero Section (z-10) */}
      <section 
        className="relative z-10 flex flex-col items-center justify-center text-center px-6 pb-40"
        style={{ paddingTop: 'calc(8rem - 75px)' }}
      >
        {/* Headline */}
        <h1 className="text-5xl sm:text-7xl md:text-8xl max-w-7xl font-normal font-serif-instrument text-[#000000] leading-[0.95] tracking-[-2.46px] animate-fade-rise">
          Beyond <span className="italic text-[#6F6F6F]">silence,</span> we build <span className="italic text-[#6F6F6F]">the eternal.</span>
        </h1>

        {/* Description */}
        <p className="text-base sm:text-lg max-w-2xl mt-8 leading-relaxed text-[#6F6F6F] font-sans-inter animate-fade-rise-delay">
          Building platforms for brilliant minds, fearless makers, and thoughtful souls. Through the noise, we craft digital havens for deep work and pure flows.
        </p>

        {/* Hero CTA Button */}
        <button 
          onClick={() => onHandleLogin && onHandleLogin('farmer')}
          className="rounded-full px-14 py-5 text-base mt-12 bg-[#000000] text-white hover:scale-[1.03] transition-all duration-200 font-medium cursor-pointer shadow-lg animate-fade-rise-delay-2"
        >
          Begin Journey
        </button>
      </section>
    </div>
  );
};
