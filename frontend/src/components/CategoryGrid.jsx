import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../api';

const DEFAULT_COLLECTION_CARDS = [
  {
    name: "Solid Shirts",
    slug: "solid-shirts",
    stylesCount: "53 styles",
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&q=80&w=600"
  },
  {
    name: "Printed Shirts",
    slug: "printed-shirts",
    stylesCount: "53 styles",
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=600"
  },
  {
    name: "Linen Shirts",
    slug: "linen-shirts",
    stylesCount: "35 styles",
    image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&q=80&w=600"
  },
  {
    name: "Gurkha Pants",
    slug: "gurkha-pants",
    stylesCount: "30 styles",
    image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&q=80&w=600"
  },
  {
    name: "Old Money Polo",
    slug: "old-money-polos",
    stylesCount: "16 styles",
    image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&q=80&w=600"
  },
  {
    name: "Back Printed Tee",
    slug: "back-printed-tees",
    stylesCount: "49 styles",
    image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=600"
  },
  {
    name: "Formal Trousers",
    slug: "formal-pants",
    stylesCount: "9 styles",
    image: "https://images.unsplash.com/photo-1479064555552-3ef4979f8908?auto=format&fit=crop&q=80&w=600"
  },
  {
    name: "Denim & Casuals",
    slug: "denim-casuals",
    stylesCount: "12 styles",
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=600"
  }
];

export default function CategoryGrid({ onOpenCollectionPage }) {
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/categories`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          const formatted = data.map(cat => ({
            name: cat.name,
            slug: cat.slug,
            stylesCount: "Exclusive Collection",
            image: cat.image_url || "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&q=80&w=600"
          }));
          setCollections(formatted);
          return;
        }
      }
    } catch (err) {
      console.error("Error loading categories for grid:", err);
    }
    setCollections(DEFAULT_COLLECTION_CARDS);
  };

  const handleCollectionClick = (e, slug) => {
    e.preventDefault();
    e.stopPropagation();
    onOpenCollectionPage(slug);
  };

  return (
    <div style={{ margin: '3.5rem 0 2rem 0', textAlign: 'center' }}>
      
      {/* Centered Title */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#000000' }}>
          SHOP THE COLLECTION
        </h2>
        <p style={{ fontSize: '0.775rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', marginTop: '0.25rem' }}>
          HOVER CARDS POP OUT WITH SHADOW ELEVATION — CLICK TO EXPLORE DEDICATED COLLECTION PAGE
        </p>
      </div>

      {/* Centered Grid - Exactly 4 items per row on desktop */}
      <div 
        className="category-4col-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '1.75rem',
          maxWidth: '1200px',
          margin: '0 auto',
          justifyContent: 'center'
        }}
      >
        {collections.map((card, idx) => (
          <div
            key={idx}
            onClick={(e) => handleCollectionClick(e, card.slug)}
            className="popout-card"
            style={{
              background: '#ffffff',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-color)',
              overflow: 'hidden',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              textAlign: 'center',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <div style={{ aspectRatio: '4/5', overflow: 'hidden', background: '#f1f5f9' }}>
              <img 
                src={card.image} 
                alt={card.name} 
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.5s ease'
                }}
                className="collection-card-img"
              />
            </div>

            <div style={{ padding: '1rem 0.65rem', background: '#ffffff', textAlign: 'center' }}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 900, textTransform: 'uppercase', color: '#000000', letterSpacing: '0.02em' }}>
                {card.name}
              </h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 700, display: 'block', marginTop: '0.2rem' }}>
                {card.stylesCount}
              </span>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .category-4col-grid {
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 1.25rem !important;
          }
        }
        @media (max-width: 640px) {
          .category-4col-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 0.85rem !important;
          }
        }
      `}</style>
    </div>
  );
}
