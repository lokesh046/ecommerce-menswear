import React from 'react';
import { Eye, Heart } from 'lucide-react';

export default function ProductCard({ product, onQuickView, isLiked, onToggleLike }) {
  const discountPercent = product.original_price 
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  const handleHeartClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleLike(product.id);
  };

  return (
    <div style={{
      background: '#ffffff',
      border: '1px solid var(--border-color)',
      borderRadius: 'var(--radius-sm)',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative'
    }} className="product-card popout-card">
      
      {/* Product Image Container */}
      <div 
        onClick={() => onQuickView(product)}
        style={{
          position: 'relative',
          aspectRatio: '3/4',
          overflow: 'hidden',
          cursor: 'pointer',
          background: '#f8f9fa'
        }}
      >
        <img 
          src={product.image_url} 
          alt={product.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.4s ease'
          }}
          className="product-img"
        />

        {/* Top Badges */}
        <div style={{
          position: 'absolute',
          top: '0.65rem',
          left: '0.65rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.35rem',
          zIndex: 5
        }}>
          {product.badge && (
            <span className="badge badge-black">
              {product.badge}
            </span>
          )}
          {discountPercent > 0 && (
            <span className="badge badge-white">
              {discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Top Right Wishlist Like Heart Button */}
        <button
          onClick={handleHeartClick}
          title={isLiked ? "Unlike product" : "Like product"}
          style={{
            position: 'absolute',
            top: '0.65rem',
            right: '0.65rem',
            zIndex: 10,
            background: isLiked ? '#000000' : 'rgba(255,255,255,0.9)',
            color: isLiked ? '#ffffff' : '#000000',
            border: '1px solid var(--border-color)',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-sm)',
            transition: 'all 0.2s'
          }}
        >
          <Heart size={16} fill={isLiked ? "#ffffff" : "none"} />
        </button>

        {/* Quick View Overlay */}
        <div className="quick-view-overlay" style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: 0,
          transition: 'opacity 0.2s ease'
        }}>
          <button className="btn btn-primary" style={{ padding: '0.45rem 0.85rem', fontSize: '0.725rem' }}>
            <Eye size={14} /> VIEW DETAILS
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div style={{ padding: '0.85rem', display: 'flex', flexDirection: 'column', flexGrow: 1, gap: '0.4rem' }}>
        
        {/* Fabric & Fit Tag */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.675rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>
          <span>{product.fabric || 'COTTON'}</span>
          <span>{product.fit || 'TAILORED'}</span>
        </div>

        {/* Product Title */}
        <h3 
          onClick={() => onQuickView(product)}
          style={{
            fontSize: '0.9rem',
            fontWeight: 800,
            color: '#000000',
            cursor: 'pointer',
            lineHeight: 1.3,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            fontFamily: 'var(--font-primary)'
          }}
        >
          {product.title}
        </h3>

        {/* Price Tag */}
        <div style={{ marginTop: 'auto', paddingTop: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <span style={{ fontSize: '1rem', fontWeight: 900, color: '#000000' }}>
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.original_price && (
              <span style={{ fontSize: '0.725rem', textDecoration: 'line-through', color: 'var(--text-muted)' }}>
                ₹{product.original_price.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          <button
            onClick={() => onQuickView(product)}
            className="btn btn-secondary"
            style={{ padding: '0.35rem 0.65rem', fontSize: '0.7rem' }}
          >
            VIEW
          </button>
        </div>

      </div>

      <style>{`
        .product-card:hover .product-img {
          transform: scale(1.04);
        }
        .product-card:hover .quick-view-overlay {
          opacity: 1;
        }
      `}</style>
    </div>
  );
}
