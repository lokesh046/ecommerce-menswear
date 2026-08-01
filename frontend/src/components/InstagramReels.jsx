import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play, Camera, X, Volume2, VolumeX, Heart, MessageCircle, ExternalLink } from 'lucide-react';
import { API_BASE_URL } from '../api';

const DEFAULT_REELS = [
  {
    id: 1,
    title: "soldrathu",
    tagline: "Trending Drops @2020_mens_wear",
    reel_url: "https://www.instagram.com/2020_mens_wear/",
    video_url: "https://assets.mixkit.co/videos/preview/mixkit-man-holding-a-style-jacket-41584-large.mp4",
    cover_image_url: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: 2,
    title: "kasakuren",
    tagline: "Linen Shirt Styles @2020_mens_wear",
    reel_url: "https://www.instagram.com/2020_mens_wear/",
    video_url: "https://assets.mixkit.co/videos/preview/mixkit-young-man-wearing-a-casual-shirt-41585-large.mp4",
    cover_image_url: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: 3,
    title: "striped CHINESE COLLAR",
    tagline: "Summer Resort Wear",
    reel_url: "https://www.instagram.com/2020_mens_wear/",
    video_url: "https://assets.mixkit.co/videos/preview/mixkit-model-posing-in-a-fashion-photoshoot-41586-large.mp4",
    cover_image_url: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: 4,
    title: "gurkha WAIST BUCKLE",
    tagline: "Tailored Fit Trousers",
    reel_url: "https://www.instagram.com/2020_mens_wear/",
    video_url: "https://assets.mixkit.co/videos/preview/mixkit-man-posing-for-the-camera-in-a-studio-41587-large.mp4",
    cover_image_url: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: 5,
    title: "OLD MONEY POLOS",
    tagline: "Waffle Knit Essentials",
    reel_url: "https://www.instagram.com/2020_mens_wear/",
    video_url: "https://assets.mixkit.co/videos/preview/mixkit-young-man-in-a-fashionable-outfit-41588-large.mp4",
    cover_image_url: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&q=80&w=600"
  }
];

export default function InstagramReels() {
  const [reels, setReels] = useState(DEFAULT_REELS);
  const [activeReel, setActiveReel] = useState(null);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    fetchReels();
  }, []);

  const fetchReels = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/reels`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          // Merge with video_url fallbacks
          const enriched = data.map((item, idx) => ({
            ...item,
            video_url: item.video_url || DEFAULT_REELS[idx % DEFAULT_REELS.length].video_url
          }));
          setReels(enriched);
        }
      }
    } catch (err) {
      console.error('Error fetching reels:', err);
    }
  };

  const handleScroll = (direction) => {
    const container = document.getElementById('reels-container');
    if (container) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section style={{ padding: '4rem 0', background: '#ffffff', borderTop: '1px solid var(--border-color)' }}>
      <div className="container" style={{ textAlign: 'center' }}>
        
        {/* Section Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              OFFICIAL INSTAGRAM @2020_MENS_WEAR
            </span>
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#000000', letterSpacing: '-0.02em', marginBottom: '0.35rem' }}>
            Follow us on Instagram
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
            Click Any Reel Below to Play Video Directly on Website!
          </p>
        </div>

        {/* Reels Carousel Wrapper */}
        <div style={{ position: 'relative', maxWidth: '1240px', margin: '0 auto' }}>
          
          {/* Navigation Arrows */}
          <button 
            onClick={() => handleScroll('left')}
            title="Scroll Left"
            style={{
              position: 'absolute',
              left: '-1rem',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 10,
              background: '#ffffff',
              border: '1px solid var(--border-color)',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-md)',
              cursor: 'pointer'
            }}
          >
            <ChevronLeft size={20} color="#000000" />
          </button>

          <button 
            onClick={() => handleScroll('right')}
            title="Scroll Right"
            style={{
              position: 'absolute',
              right: '-1rem',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 10,
              background: '#ffffff',
              border: '1px solid var(--border-color)',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-md)',
              cursor: 'pointer'
            }}
          >
            <ChevronRight size={20} color="#000000" />
          </button>

          {/* Reels Cards Grid */}
          <div 
            id="reels-container"
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${Math.max(reels.length, 5)}, 1fr)`,
              gap: '1.25rem',
              overflowX: 'auto',
              scrollbarWidth: 'none',
              padding: '0.5rem 0.25rem'
            }}
          >
            {reels.map((reel) => (
              <div
                key={reel.id}
                onClick={() => setActiveReel(reel)}
                className="popout-card"
                style={{
                  position: 'relative',
                  aspectRatio: '9/16',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  background: '#111827',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  boxShadow: 'var(--shadow-md)',
                  cursor: 'pointer'
                }}
              >
                {/* Reel Poster Image */}
                <img 
                  src={reel.cover_image_url} 
                  alt={reel.title}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.5s ease'
                  }}
                  className="reel-img"
                />

                {/* Dark Overlay */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 60%, rgba(0,0,0,0.4) 100%)'
                }} />

                {/* Play Button Icon */}
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  background: 'rgba(0, 0, 0, 0.7)',
                  border: '1.5px solid rgba(255, 255, 255, 0.6)',
                  borderRadius: '50%',
                  width: '56px',
                  height: '56px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  boxShadow: 'var(--shadow-md)',
                  zIndex: 5
                }}>
                  <Play size={26} fill="#ffffff" style={{ marginLeft: '3px' }} />
                </div>

                {/* Bottom Title Overlay */}
                <div style={{
                  position: 'relative',
                  zIndex: 5,
                  padding: '1.25rem 0.85rem',
                  textAlign: 'center',
                  color: '#ffffff'
                }}>
                  <h3 style={{
                    fontSize: '0.95rem',
                    fontWeight: 900,
                    color: '#ffffff',
                    textTransform: 'lowercase',
                    fontStyle: 'italic',
                    fontFamily: 'var(--font-display)',
                    letterSpacing: '0.02em',
                    textShadow: '0 2px 4px rgba(0,0,0,0.8)'
                  }}>
                    {reel.title}
                  </h3>
                  <span style={{ fontSize: '0.675rem', color: 'rgba(255,255,255,0.8)', fontWeight: 700, display: 'block', marginTop: '0.2rem' }}>
                    @2020_mens_wear
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Visit Instagram Direct Link Button */}
        <div style={{ marginTop: '2.5rem' }}>
          <a
            href="https://www.instagram.com/2020_mens_wear/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
            style={{
              padding: '0.85rem 2.25rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.85rem',
              fontWeight: 800
            }}
          >
            <Camera size={18} /> Visit @2020_mens_wear on Instagram <ExternalLink size={14} />
          </a>
        </div>

      </div>

      {/* In-App Reel Video Player Modal */}
      {activeReel && (
        <div className="modal-backdrop" onClick={() => setActiveReel(null)}>
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '380px',
              height: '85vh',
              maxHeight: '680px',
              background: '#000000',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              position: 'relative',
              boxShadow: 'var(--shadow-popout)',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Modal Controls Header */}
            <div style={{
              position: 'absolute',
              top: '0.85rem',
              left: '0.85rem',
              right: '0.85rem',
              zIndex: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              color: '#ffffff'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(0,0,0,0.65)', padding: '0.35rem 0.75rem', borderRadius: 'var(--radius-full)' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 900 }}>@2020_mens_wear</span>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  onClick={() => setIsMuted(!isMuted)}
                  style={{ background: 'rgba(0,0,0,0.65)', color: '#ffffff', border: 'none', padding: '0.45rem', borderRadius: '50%', cursor: 'pointer' }}
                  title={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>
                
                <button 
                  onClick={() => setActiveReel(null)}
                  style={{ background: 'rgba(0,0,0,0.65)', color: '#ffffff', border: 'none', padding: '0.45rem', borderRadius: '50%', cursor: 'pointer' }}
                  title="Close Video"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* In-App Video Player */}
            <video
              src={activeReel.video_url || "https://assets.mixkit.co/videos/preview/mixkit-man-holding-a-style-jacket-41584-large.mp4"}
              poster={activeReel.cover_image_url}
              autoPlay
              loop
              controls
              playsInline
              muted={isMuted}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />

            {/* In-Video Actions Footer Overlay */}
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              padding: '1.25rem',
              background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0) 100%)',
              color: '#ffffff',
              zIndex: 15,
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              pointerEvents: 'none'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pointerEvents: 'auto' }}>
                <div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#ffffff', fontStyle: 'italic' }}>
                    {activeReel.title}
                  </h4>
                  <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.85)' }}>
                    {activeReel.tagline || 'Exclusive Drop @2020_mens_wear'}
                  </p>
                </div>

                <a 
                  href={activeReel.reel_url || "https://www.instagram.com/2020_mens_wear/"} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                  style={{ padding: '0.4rem 0.75rem', fontSize: '0.7rem' }}
                >
                  Instagram <ExternalLink size={12} />
                </a>
              </div>
            </div>

          </div>
        </div>
      )}

      <style>{`
        .popout-card:hover .reel-img {
          transform: scale(1.08);
        }
        @media (max-width: 1024px) {
          #reels-container {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
        @media (max-width: 640px) {
          #reels-container {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </section>
  );
}
