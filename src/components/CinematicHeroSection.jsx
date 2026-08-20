import React, { useEffect, useRef, useState } from 'react';
import { Droplets, Menu, X, ArrowRight } from 'lucide-react';

export const CinematicHeroSection = ({ onScrollToSection, onHandleLogin }) => {
  const videoRef = useRef(null);
  const [videoOpacity, setVideoOpacity] = useState(0);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

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
      {/* Background Video Layer (z-0) - Crisp 100% Clear Video Background */}
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
      </div>

      {/* High-Contrast Spacious Navigation Bar */}
      <header className="relative z-20 px-4 sm:px-8 max-w-7xl mx-auto w-full pt-6 pb-2">
        <div 
          className="flex items-center justify-between px-8 py-4 bg-white/95 backdrop-blur-2xl border border-slate-200/80 shadow-[0_15px_40px_rgba(0,0,0,0.08)] rounded-full transition-all duration-300"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
        >
          
          {/* Logo */}
          <div 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-3 cursor-pointer select-none group"
            style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
          >
            <div className="w-10 h-10 rounded-full bg-slate-950 flex items-center justify-center text-white transition-transform group-hover:scale-105 shadow-md">
              <Droplets size={20} className="text-white fill-white" />
            </div>
            <span className="text-2xl sm:text-3xl tracking-tight font-serif-instrument text-slate-950 font-bold">
              Rudu Dairy<sup className="text-sm font-sans font-semibold text-red-600 ml-0.5">®</sup>
            </span>
          </div>

          {/* Desktop Navigation Links (Hidden on Mobile) */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8 ml-auto mr-6">
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-[15px] font-bold text-slate-950 hover:text-[#C5221F] transition-colors cursor-pointer py-1"
            >
              Home
            </button>
            <button 
              onClick={() => onScrollToSection && onScrollToSection('about')}
              className="text-[15px] font-semibold text-slate-700 hover:text-slate-950 transition-colors cursor-pointer py-1"
            >
              Our Story
            </button>
            <button 
              onClick={() => onScrollToSection && onScrollToSection('products')}
              className="text-[15px] font-semibold text-slate-700 hover:text-slate-950 transition-colors cursor-pointer py-1"
            >
              Services
            </button>
            <button 
              onClick={() => onScrollToSection && onScrollToSection('purity')}
              className="text-[15px] font-semibold text-slate-700 hover:text-slate-950 transition-colors cursor-pointer py-1"
            >
              Purity Audit
            </button>
            <button 
              onClick={() => onScrollToSection && onScrollToSection('faq')}
              className="text-[15px] font-semibold text-slate-700 hover:text-slate-950 transition-colors cursor-pointer py-1"
            >
              Contact Us
            </button>
          </nav>

          {/* High-Contrast Bold Login / Partner CTA Button (Desktop) */}
          <div className="hidden md:flex items-center gap-3">
            <button 
              onClick={() => onHandleLogin && onHandleLogin('farmer')}
              className="rounded-full px-6 py-2.5 text-sm font-extrabold transition-all duration-200 cursor-pointer shadow-lg hover:scale-[1.03] flex items-center gap-2"
              style={{ 
                backgroundColor: '#111827', 
                color: '#ffffff', 
                border: '1px solid #111827',
                boxShadow: '0 8px 20px rgba(0,0,0,0.15)'
              }}
            >
              <span>Partner With Us</span>
              <ArrowRight size={15} color="#ffffff" />
            </button>
          </div>

          {/* Mobile Menu Hamburger Button */}
          <button 
            onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-full text-slate-950 bg-slate-100 hover:bg-slate-200 transition-colors shadow-sm"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileNavOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Navigation Dropdown */}
        {isMobileNavOpen && (
          <div className="md:hidden mt-3 p-5 bg-white backdrop-blur-2xl border border-slate-200 rounded-2xl shadow-2xl flex flex-col gap-3 animate-fade-rise">
            <button 
              onClick={() => { setIsMobileNavOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="text-left px-4 py-2.5 text-base font-bold text-slate-950 hover:bg-slate-100 rounded-xl"
            >
              Home
            </button>
            <button 
              onClick={() => { setIsMobileNavOpen(false); onScrollToSection && onScrollToSection('about'); }}
              className="text-left px-4 py-2.5 text-base font-semibold text-slate-800 hover:bg-slate-100 rounded-xl"
            >
              Our Story
            </button>
            <button 
              onClick={() => { setIsMobileNavOpen(false); onScrollToSection && onScrollToSection('products'); }}
              className="text-left px-4 py-2.5 text-base font-semibold text-slate-800 hover:bg-slate-100 rounded-xl"
            >
              Services & Range
            </button>
            <button 
              onClick={() => { setIsMobileNavOpen(false); onScrollToSection && onScrollToSection('purity'); }}
              className="text-left px-4 py-2.5 text-base font-semibold text-slate-800 hover:bg-slate-100 rounded-xl"
            >
              Purity Audit
            </button>
            <button 
              onClick={() => { setIsMobileNavOpen(false); onScrollToSection && onScrollToSection('faq'); }}
              className="text-left px-4 py-2.5 text-base font-semibold text-slate-800 hover:bg-slate-100 rounded-xl"
            >
              Contact Us
            </button>
            <button 
              onClick={() => { setIsMobileNavOpen(false); onHandleLogin && onHandleLogin('farmer'); }}
              className="w-full mt-2 rounded-xl py-3.5 text-sm font-extrabold bg-slate-950 text-white text-center shadow-lg flex items-center justify-center gap-2"
              style={{ backgroundColor: '#111827', color: '#ffffff' }}
            >
              <span>Partner With Us</span>
              <ArrowRight size={15} color="#ffffff" />
            </button>
          </div>
        )}
      </header>

      {/* Hero Section (z-10) with Crisp Unmasked Background */}
      <section 
        className="relative z-10 flex flex-col items-center justify-center text-center px-6 pb-36"
        style={{ paddingTop: 'calc(5.5rem - 20px)' }}
      >
        {/* Authentic Rudu Dairy Headline */}
        <h1 className="text-5xl sm:text-7xl md:text-8xl max-w-7xl font-normal font-serif-instrument text-slate-950 leading-[0.95] tracking-[-2.46px] animate-fade-rise">
          Beyond <span className="italic text-[#6F6F6F]">compromise,</span> we deliver <span className="italic text-[#6F6F6F]">the pure milk.</span>
        </h1>

        {/* Authentic Rudu Dairy Description */}
        <p className="text-base sm:text-lg max-w-2xl mt-8 leading-relaxed text-[#475569] font-sans-inter font-medium animate-fade-rise-delay">
          Empowering dairy farmers across Northern India with 100% transparent milk collection, organic animal care, and pure farm-fresh delivery to every home.
        </p>

        {/* Hero CTA Button */}
        <div className="flex items-center gap-4 mt-12 animate-fade-rise-delay-2">
          <button 
            onClick={() => onScrollToSection && onScrollToSection('products')}
            className="rounded-full px-12 py-4.5 text-base bg-slate-950 text-white hover:bg-[#C5221F] hover:scale-[1.03] transition-all duration-200 font-bold cursor-pointer shadow-xl flex items-center gap-2"
            style={{ backgroundColor: '#111827', color: '#ffffff' }}
          >
            <span>Explore Products</span>
            <ArrowRight size={18} color="#ffffff" />
          </button>
        </div>
      </section>
    </div>
  );
};
