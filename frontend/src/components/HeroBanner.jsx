import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';

const DEFAULT_SLIDES = [
  {
    badge: "SIGNATURE TAILORING",
    title: "PLEATED GURKHA TROUSERS",
    subtitle: "High-waisted luxury trousers featuring iconic double-side waist buckles.",
    cta: "SHOP GURKHA PANTS",
    categorySlug: "gurkha-pants",
    bgImage: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&q=80&w=1600"
  },
  {
    badge: "SUMMER 2026 DROPS",
    title: "OLD MONEY & FRENCH LINEN",
    subtitle: "Tailored Gurkha Trousers, Breathable Pure Linen & Textured Waffle Polos.",
    cta: "EXPLORE LINEN DROPS",
    categorySlug: "linen-shirts",
    bgImage: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&q=80&w=1600"
  },
  {
    badge: "QUIET LUXURY ESSENTIALS",
    title: "TEXTURED KNIT POLOS & CORD SETS",
    subtitle: "Sophisticated resort streetwear crafted for effortless everyday style.",
    cta: "VIEW OLD MONEY POLOS",
    categorySlug: "old-money-polos",
    bgImage: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&q=80&w=1600"
  },
  {
    badge: "NEW SEASON RELEASE",
    title: "GRAPHIC TEES & CASUAL DENIM",
    subtitle: "Heavyweight oversized streetwear t-shirts and premium stretch denim jeans.",
    cta: "EXPLORE TEES & DENIM",
    categorySlug: "back-printed-tees",
    bgImage: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=1600"
  }
];

export default function HeroBanner({ onSelectCategory }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [activeSlides, setActiveSlides] = useState(DEFAULT_SLIDES);

  const displaySlides = [...activeSlides, activeSlides[0]];

  useEffect(() => {
    const loadSlides = () => {
      const saved = localStorage.getItem('menswear_hero_slides');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.length > 0) {
            setActiveSlides(parsed);
          }
        } catch (e) {
          console.error("Error parsing hero slides:", e);
        }
      }
    };

    loadSlides();
    window.addEventListener('hero_slides_updated', loadSlides);
    window.addEventListener('storage', loadSlides);
    return () => {
      window.removeEventListener('hero_slides_updated', loadSlides);
      window.removeEventListener('storage', loadSlides);
    };
  }, []);

  // Slower auto-play timer (8.5 seconds)
  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 8500);
    return () => clearInterval(timer);
  }, [activeSlides, currentSlide]);

  const handleNext = () => {
    setIsTransitioning(true);
    setCurrentSlide((prev) => {
      if (prev >= activeSlides.length) return 1;
      return prev + 1;
    });
  };

  const handlePrev = () => {
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev <= 0 ? activeSlides.length - 1 : prev - 1));
  };

  // Infinite Forward Loop Reset
  useEffect(() => {
    if (currentSlide >= activeSlides.length) {
      const timeout = setTimeout(() => {
        setIsTransitioning(false);
        setCurrentSlide(0);
      }, 1200); // 1.2s smooth transition duration
      return () => clearTimeout(timeout);
    }
  }, [currentSlide, activeSlides.length]);

  return (
    <div className="hero-container" style={{ position: 'relative', minHeight: 'calc(100vh - 75px)', width: '100%', overflow: 'hidden', borderBottom: '1px solid var(--border-color)', background: '#000000' }}>
      
      {/* Sliding Track Container */}
      <div style={{
        display: 'flex',
        width: `${displaySlides.length * 100}%`,
        height: '100%',
        minHeight: 'calc(100vh - 75px)',
        transform: `translateX(-${(Math.min(currentSlide, activeSlides.length) * 100) / displaySlides.length}%)`,
        transition: isTransitioning ? 'transform 1.2s cubic-bezier(0.25, 1, 0.4, 1)' : 'none'
      }}>
        {displaySlides.map((s, idx) => {
          const slideData = s || activeSlides[0];
          return (
            <div key={idx} style={{
              width: `${100 / displaySlides.length}%`,
              minHeight: 'calc(100vh - 75px)',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              flexShrink: 0
            }}>

              {/* Background Image for Slide */}
              <div style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `url(${slideData.bgImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center center'
              }} />

            {/* Subtle Lighting Overlay */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(0, 0, 0, 0.35) 0%, rgba(0, 0, 0, 0.05) 50%, rgba(0, 0, 0, 0) 100%)',
              pointerEvents: 'none'
            }} />

            {/* Content Container (Middle Left Aligned) */}
            <div className="container" style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', zIndex: 10, padding: '2.5rem 0' }}>
              
              {/* Middle-Left Frosted Glass Card (Auto-Minimizes on Mobile) */}
              <div className="hero-card" style={{ 
                maxWidth: '600px', 
                width: '100%',
                display: 'flex', 
                flexDirection: 'column', 
                gap: 'clamp(0.5rem, 1.8vw, 1rem)',
                background: 'rgba(255, 255, 255, 0.92)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                padding: 'clamp(1rem, 3.5vw, 2.5rem)',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.95)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
              }}>
                
                <div style={{ display: 'inline-flex', alignSelf: 'flex-start' }}>
                  <span className="badge badge-black hero-badge" style={{ padding: '0.4rem 0.85rem', fontSize: 'clamp(0.65rem, 1.2vw, 0.75rem)', letterSpacing: '0.08em' }}>
                    <Sparkles size={12} /> {slideData.badge}
                  </span>
                </div>

                <h1 className="hero-title" style={{
                  fontSize: 'clamp(1.35rem, 3.8vw, 3rem)',
                  lineHeight: 1.1,
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  letterSpacing: '-0.02em',
                  color: '#000000',
                  fontFamily: 'var(--font-display)'
                }}>
                  {slideData.title}
                </h1>

                <p className="hero-subtitle" style={{ fontSize: 'clamp(0.775rem, 1.5vw, 0.95rem)', color: '#4b5563', fontWeight: 600, lineHeight: 1.4 }}>
                  {slideData.subtitle}
                </p>

                <div style={{ display: 'flex', gap: '0.65rem', marginTop: '0.35rem', flexWrap: 'wrap' }}>
                  <button 
                    className="btn btn-primary hero-btn"
                    onClick={() => onSelectCategory(slideData.categorySlug)}
                    style={{ padding: 'clamp(0.6rem, 1.5vw, 0.85rem) clamp(1rem, 2vw, 1.6rem)', fontSize: 'clamp(0.725rem, 1.3vw, 0.825rem)' }}
                  >
                    {slideData.cta} <ArrowRight size={15} />
                  </button>

                  <button 
                    className="btn btn-secondary hero-btn"
                    onClick={() => onSelectCategory(null)}
                    style={{ padding: 'clamp(0.6rem, 1.5vw, 0.85rem) clamp(1rem, 2vw, 1.6rem)', fontSize: 'clamp(0.725rem, 1.3vw, 0.825rem)', background: '#ffffff', color: '#000000', border: '1px solid var(--border-color)' }}
                  >
                    ALL DROPS
                  </button>
                </div>

              </div>

            </div>
          </div>
        );
      })}
      </div>

      {/* Slide Navigation Arrows */}
      <button 
        onClick={handlePrev}
        className="hide-mobile"
        style={{
          position: 'absolute',
          left: '1.5rem',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 30,
          background: 'rgba(255, 255, 255, 0.9)',
          color: '#000000',
          width: '46px',
          height: '46px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
          cursor: 'pointer',
          border: '1px solid var(--border-color)',
          transition: 'all 0.2s'
        }}
        title="Previous Slide"
      >
        <ChevronLeft size={24} />
      </button>

      <button 
        onClick={handleNext}
        className="hide-mobile"
        style={{
          position: 'absolute',
          right: '1.5rem',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 30,
          background: 'rgba(255, 255, 255, 0.9)',
          color: '#000000',
          width: '46px',
          height: '46px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
          cursor: 'pointer',
          border: '1px solid var(--border-color)',
          transition: 'all 0.2s'
        }}
        title="Next Slide"
      >
        <ChevronRight size={24} />
      </button>

      {/* Sliding Image Indicator Dots */}
      <div style={{
        position: 'absolute',
        bottom: '2rem',
        right: '2.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.6rem',
        zIndex: 20,
        background: 'rgba(0,0,0,0.65)',
        padding: '0.5rem 0.85rem',
        borderRadius: '20px',
        backdropFilter: 'blur(8px)'
      }}>
        {activeSlides.map((s, idx) => {
          const activeIndex = currentSlide === activeSlides.length ? 0 : currentSlide;
          return (
            <button 
              key={idx} 
              onClick={() => {
                setIsTransitioning(true);
                setCurrentSlide(idx);
              }}
              title={`Slide #${idx + 1}`}
              style={{
                width: idx === activeIndex ? '38px' : '10px',
                height: '5px',
                borderRadius: '2px',
                background: idx === activeIndex ? '#ffffff' : 'rgba(255,255,255,0.4)',
                transition: 'all 0.3s',
                cursor: 'pointer',
                border: 'none'
              }}
            />
          );
        })}
      </div>

    </div>
  );
}
