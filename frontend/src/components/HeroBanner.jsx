import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

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
  const [activeSlides, setActiveSlides] = useState(DEFAULT_SLIDES);

  useEffect(() => {
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
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [activeSlides]);

  const slide = activeSlides[currentSlide] || DEFAULT_SLIDES[0];

  return (
    <div className="hero-container" style={{ position: 'relative', minHeight: 'calc(100vh - 75px)', width: '100%', overflow: 'hidden', borderBottom: '1px solid var(--border-color)', background: '#000000', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      
      {/* 100% Crystal Clear Background Image */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `url(${slide.bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        transition: 'background-image 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
      }} />

      {/* Subtle Lighting Overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to top, rgba(0, 0, 0, 0.35) 0%, rgba(0, 0, 0, 0.05) 50%, rgba(0, 0, 0, 0) 100%)',
        pointerEvents: 'none'
      }} />

      {/* Content Container */}
      <div className="container" style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center', zIndex: 10, padding: '3.5rem 0' }}>
        
        {/* Restored Aligned Frosted Glass Text Container */}
        <div style={{ 
          maxWidth: '640px', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '1.25rem',
          background: 'rgba(255, 255, 255, 0.92)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          padding: '2.75rem 3rem',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.95)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
        }}>
          
          <div style={{ display: 'inline-flex', alignSelf: 'flex-start' }}>
            <span className="badge badge-black" style={{ padding: '0.45rem 0.9rem', fontSize: '0.75rem', letterSpacing: '0.08em' }}>
              <Sparkles size={13} /> {slide.badge}
            </span>
          </div>

          <h1 className="hero-title" style={{
            fontSize: '3.2rem',
            lineHeight: 1.06,
            fontWeight: 900,
            textTransform: 'uppercase',
            letterSpacing: '-0.02em',
            color: '#000000',
            fontFamily: 'var(--font-display)'
          }}>
            {slide.title}
          </h1>

          <p style={{ fontSize: '1rem', color: '#4b5563', fontWeight: 600, lineHeight: 1.5 }}>
            {slide.subtitle}
          </p>

          <div style={{ display: 'flex', gap: '0.85rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
            <button 
              className="btn btn-primary"
              onClick={() => onSelectCategory(slide.categorySlug)}
              style={{ padding: '0.85rem 1.75rem', fontSize: '0.85rem' }}
            >
              {slide.cta} <ArrowRight size={16} />
            </button>

            <button 
              className="btn btn-secondary"
              onClick={() => onSelectCategory(null)}
              style={{ padding: '0.85rem 1.75rem', fontSize: '0.85rem', background: '#ffffff', color: '#000000', border: '1px solid var(--border-color)' }}
            >
              BROWSE ALL DROPS
            </button>
          </div>

        </div>

      </div>

      {/* Sliding Image Thumbnails Controls */}
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
        {activeSlides.map((s, idx) => (
          <button 
            key={idx} 
            onClick={() => setCurrentSlide(idx)}
            title={`Slide #${idx + 1}`}
            style={{
              width: idx === currentSlide ? '38px' : '10px',
              height: '5px',
              borderRadius: '2px',
              background: idx === currentSlide ? '#ffffff' : 'rgba(255,255,255,0.4)',
              transition: 'all 0.3s',
              cursor: 'pointer',
              border: 'none'
            }}
          />
        ))}
      </div>

    </div>
  );
}
