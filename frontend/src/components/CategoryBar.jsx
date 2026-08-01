import React from 'react';
import { Heart } from 'lucide-react';

export default function CategoryBar({ categories, selectedCategory, onSelectCategory, showWishlistOnly, setShowWishlistOnly, wishlistCount }) {
  return (
    <div style={{ margin: '2rem 0 1.25rem 0', textAlign: 'center' }}>
      <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.15rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.02em', color: '#000000' }}>
          EXPLORE COLLECTIONS
        </h2>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', marginTop: '0.2rem' }}>
          FILTER CATALOG ITEMS BY CATEGORY
        </p>
      </div>

      {/* Centered Horizontal Scrollable Category Chips */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        flexWrap: 'wrap',
        scrollbarWidth: 'none'
      }}>
        {/* All Products Chip */}
        <button
          onClick={() => { setShowWishlistOnly(false); onSelectCategory(null); }}
          style={{
            padding: '0.5rem 1.1rem',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.75rem',
            fontWeight: 800,
            letterSpacing: '0.02em',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
            transition: 'all 0.2s',
            background: (selectedCategory === null && !showWishlistOnly) ? '#000000' : '#f3f4f6',
            color: (selectedCategory === null && !showWishlistOnly) ? '#ffffff' : '#000000',
            border: (selectedCategory === null && !showWishlistOnly) ? '1px solid #000000' : '1px solid var(--border-color)'
          }}
        >
          ALL DROPS
        </button>

        {/* Wishlist Like Chip */}
        <button
          onClick={() => { onSelectCategory(null); setShowWishlistOnly(!showWishlistOnly); }}
          style={{
            padding: '0.5rem 1.1rem',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.75rem',
            fontWeight: 800,
            letterSpacing: '0.02em',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            background: showWishlistOnly ? '#000000' : '#f3f4f6',
            color: showWishlistOnly ? '#ffffff' : '#000000',
            border: showWishlistOnly ? '1px solid #000000' : '1px solid var(--border-color)'
          }}
        >
          <Heart size={14} fill={showWishlistOnly ? "#ffffff" : "none"} /> MY WISHLIST ({wishlistCount})
        </button>

        {/* Dynamic Category Chips */}
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.slug && !showWishlistOnly;
          return (
            <button
              key={cat.id}
              onClick={() => { setShowWishlistOnly(false); onSelectCategory(cat.slug); }}
              style={{
                padding: '0.5rem 1.1rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.75rem',
                fontWeight: 800,
                letterSpacing: '0.02em',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s',
                background: isSelected ? '#000000' : '#f3f4f6',
                color: isSelected ? '#ffffff' : '#000000',
                border: isSelected ? '1px solid #000000' : '1px solid var(--border-color)'
              }}
            >
              {cat.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
