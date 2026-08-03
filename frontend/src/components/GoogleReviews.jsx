import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

const GOOGLE_MAPS_REVIEW_URL = "https://maps.app.goo.gl/2fii4NfWj8CpwmEZ9";

const INITIAL_REVIEWS = [
  {
    id: 1,
    name: "Abdul Kareem",
    timeAgo: "4 months ago",
    stars: 5,
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120",
    comment: "I had a fantastic shopping experience today. He was incredibly supportive and helped me pick the best linen outfit!"
  },
  {
    id: 2,
    name: "Premkumar Sundaramurthy",
    timeAgo: "6 months ago",
    stars: 5,
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=120",
    comment: "Loved shopping here! Amazing designs, good quality, and very supportive staff. Found exactly what I wanted."
  },
  {
    id: 3,
    name: "Shandeep Kumar",
    timeAgo: "6 months ago",
    stars: 5,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120",
    comment: "Collection is better than my last visit. Trendy outfits. Decent and helpful staff. Less price and premium quality."
  },
  {
    id: 4,
    name: "Saran Hari",
    timeAgo: "5 months ago",
    stars: 5,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120",
    comment: "Great collection with stylish and good-quality clothes. The staff were friendly and guided well."
  },
  {
    id: 5,
    name: "Karthik Raja",
    timeAgo: "3 months ago",
    stars: 5,
    avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=120",
    comment: "Best menswear shop in town! The Gurkha trousers and linen shirts fit amazingly well."
  },
  {
    id: 6,
    name: "Vigneshwaran M",
    timeAgo: "2 months ago",
    stars: 5,
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=120",
    comment: "Super fast service and top-notch fabric. Highly recommended for party wear and old money aesthetic look."
  }
];

export default function GoogleReviews() {
  const [reviews] = useState(INITIAL_REVIEWS);
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? reviews.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= reviews.length - 1 ? 0 : prev + 1));
  };

  // Auto slide every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, [reviews.length]);

  return (
    <section style={{ padding: '3.5rem 0', background: '#fcfcfc', borderBottom: '1px solid var(--border-color)' }}>
      <div className="container">
        
        {/* Header matching exact user screenshot layout */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          
          {/* Top Left Store Rating Info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <img 
              src="/logo.png" 
              alt="2020 Mens Wear" 
              style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--border-color)', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }} 
            />
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#000000', margin: 0, lineHeight: 1.2 }}>
                2020 Mens Wear
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.2rem' }}>
                <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#f59e0b' }}>4.8</span>
                <div style={{ display: 'flex', gap: '2px', color: '#f59e0b' }}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={15} fill="#f59e0b" color="#f59e0b" />
                  ))}
                </div>
                <span style={{ fontSize: '0.775rem', color: 'var(--text-secondary)', fontWeight: 600, marginLeft: '0.25rem' }}>
                  3,794 reviews
                </span>
              </div>
            </div>
          </div>

          {/* Top Right "Review us" Blue Button */}
          <a 
            href={GOOGLE_MAPS_REVIEW_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: '#3b82f6',
              color: '#ffffff',
              padding: '0.55rem 1.4rem',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: 700,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.25)',
              transition: 'all 0.2s'
            }}
          >
            Review us
          </a>

        </div>

        {/* Carousel Container */}
        <div style={{ position: 'relative' }}>
          
          {/* Left Arrow Button */}
          <button
            onClick={prevSlide}
            aria-label="Previous Review"
            style={{
              position: 'absolute',
              left: '-18px',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 10,
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              background: '#ffffff',
              border: '1px solid var(--border-color)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <ChevronLeft size={20} color="#000000" />
          </button>

          {/* Cards Track */}
          <div style={{ overflow: 'hidden', padding: '0.5rem 0' }}>
            <div 
              style={{
                display: 'flex',
                gap: '1.25rem',
                transition: 'transform 0.4s ease-in-out',
                transform: `translateX(-${currentIndex * (310 + 20)}px)`
              }}
            >
              {reviews.map((rev) => (
                <div
                  key={rev.id}
                  style={{
                    minWidth: '310px',
                    maxWidth: '310px',
                    background: '#f3f4f6',
                    borderRadius: '16px',
                    padding: '1.25rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justify: 'space-between',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                    border: '1px solid #e5e7eb'
                  }}
                >
                  <div>
                    {/* Top Row: Stars + Google G Logo */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                      <div style={{ display: 'flex', gap: '2px' }}>
                        {[...Array(rev.stars)].map((_, i) => (
                          <Star key={i} size={14} fill="#f59e0b" color="#f59e0b" />
                        ))}
                      </div>

                      {/* Google G SVG */}
                      <svg width="18" height="18" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                      </svg>
                    </div>

                    {/* Review Text */}
                    <p style={{ fontSize: '0.825rem', color: '#374151', lineHeight: 1.5, margin: 0, fontWeight: 500 }}>
                      {rev.comment}
                    </p>
                  </div>

                  {/* Bottom Row: User Avatar & Name */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginTop: '1.25rem', paddingTop: '0.75rem' }}>
                    <img 
                      src={rev.avatar} 
                      alt={rev.name} 
                      style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} 
                    />
                    <div>
                      <h4 style={{ fontSize: '0.8rem', fontWeight: 800, color: '#111827', margin: 0 }}>
                        {rev.name}
                      </h4>
                      <span style={{ fontSize: '0.7rem', color: '#6b7280', fontWeight: 500 }}>
                        {rev.timeAgo}
                      </span>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </div>

          {/* Right Arrow Button */}
          <button
            onClick={nextSlide}
            aria-label="Next Review"
            style={{
              position: 'absolute',
              right: '-18px',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 10,
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              background: '#ffffff',
              border: '1px solid var(--border-color)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <ChevronRight size={20} color="#000000" />
          </button>

        </div>

      </div>
    </section>
  );
}
