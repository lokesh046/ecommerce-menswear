import React, { useState } from 'react';
import { X, ShoppingBag, Check } from 'lucide-react';

const SIZES = ["S", "M", "L", "XL", "XXL"];

export default function ProductDetailModal({ product, onClose, onAddToCart, isLiked, onToggleLike }) {
  const [selectedSize, setSelectedSize] = useState("M");
  const [quantity, setQuantity] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);

  if (!product) return null;

  const handleAdd = () => {
    onAddToCart(product, selectedSize, quantity);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 2000);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="animate-fade-in" 
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '820px',
          maxHeight: '90vh',
          overflowY: 'auto',
          background: '#ffffff',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-sm)',
          position: 'relative',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          boxShadow: 'var(--shadow-lg)'
        }}
      >
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '0.85rem',
            right: '0.85rem',
            background: '#f3f4f6',
            border: '1px solid var(--border-color)',
            color: '#000000',
            borderRadius: '50%',
            width: '34px',
            height: '34px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 20
          }}
        >
          <X size={18} />
        </button>

        {/* Product Image */}
        <div style={{ background: '#f8f9fa', position: 'relative', aspectRatio: '3/4' }}>
          <img 
            src={product.image_url} 
            alt={product.title} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          {product.badge && (
            <span className="badge badge-black" style={{ position: 'absolute', top: '0.85rem', left: '0.85rem' }}>
              {product.badge}
            </span>
          )}
        </div>

        {/* Product Details Content */}
        <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          
          <div>
            <span style={{ fontSize: '0.725rem', color: 'var(--text-secondary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              SNIPES MENSWEAR
            </span>
            <h2 style={{ fontSize: '1.4rem', color: '#000000', fontWeight: 800, marginTop: '0.2rem', fontFamily: 'var(--font-primary)' }}>
              {product.title}
            </h2>
          </div>

          {/* Pricing */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}>
            <span style={{ fontSize: '1.6rem', fontWeight: 900, color: '#000000' }}>
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.original_price && (
              <span style={{ fontSize: '0.95rem', textDecoration: 'line-through', color: 'var(--text-muted)' }}>
                ₹{product.original_price.toLocaleString('en-IN')}
              </span>
            )}
            <span className="badge badge-black">INCLUSIVE OF TAXES</span>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            {product.description || 'Authentic Snipes Menswear release crafted with high precision tailored fit and premium fabric durability.'}
          </p>

          {/* Fabric & Fit Specs */}
          <div style={{ display: 'flex', gap: '1rem', background: '#f9fafb', padding: '0.75rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
            <div>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', fontWeight: 700 }}>FABRIC</span>
              <strong style={{ fontSize: '0.825rem', color: '#000000' }}>{product.fabric || '100% PREMIUM COTTON'}</strong>
            </div>
            <div style={{ borderLeft: '1px solid var(--border-color)', paddingLeft: '1rem' }}>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', fontWeight: 700 }}>FIT TYPE</span>
              <strong style={{ fontSize: '0.825rem', color: '#000000' }}>{product.fit || 'MODERN TAILORED FIT'}</strong>
            </div>
          </div>

          {/* Size Selector */}
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.04em', color: '#000000', display: 'block', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
              SELECT SIZE
            </label>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              {SIZES.map((sz) => (
                <button
                  key={sz}
                  onClick={() => setSelectedSize(sz)}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: 'var(--radius-sm)',
                    fontWeight: 800,
                    fontSize: '0.825rem',
                    border: selectedSize === sz ? '2px solid #000000' : '1px solid var(--border-color)',
                    background: selectedSize === sz ? '#000000' : '#ffffff',
                    color: selectedSize === sz ? '#ffffff' : '#000000',
                    transition: 'all 0.2s'
                  }}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.04em', color: '#000000', textTransform: 'uppercase' }}>
              QUANTITY:
            </label>
            <div style={{ display: 'flex', alignItems: 'center', background: '#f3f4f6', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                style={{ padding: '0.3rem 0.75rem', color: '#000000', fontSize: '0.95rem', fontWeight: 700 }}
              >
                -
              </button>
              <span style={{ padding: '0 0.75rem', fontWeight: 800, fontSize: '0.85rem' }}>{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                style={{ padding: '0.3rem 0.75rem', color: '#000000', fontSize: '0.95rem', fontWeight: 700 }}
              >
                +
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.4rem' }}>
            <button 
              onClick={handleAdd}
              className="btn btn-primary" 
              style={{ flex: 1, padding: '0.8rem' }}
            >
              {addedAnimation ? <Check size={16} /> : <ShoppingBag size={16} />}
              {addedAnimation ? 'ADDED TO BAG' : `ADD TO BAG — ₹${(product.price * quantity).toLocaleString('en-IN')}`}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
