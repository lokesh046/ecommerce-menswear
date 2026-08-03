import React, { useState } from 'react';
import { Search, ChevronDown, Menu, X } from 'lucide-react';

export default function Navbar({ 
  onSelectCategory, 
  selectedCategory, 
  searchQuery, 
  setSearchQuery,
  onNavigateHome
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isTopsOpen, setIsTopsOpen] = useState(false);
  const [isBottomsOpen, setIsBottomsOpen] = useState(false);

  const handleCategoryClick = (slug) => {
    onNavigateHome();
    onSelectCategory(slug);
    setIsMobileMenuOpen(false);
    setIsTopsOpen(false);
    setIsBottomsOpen(false);
  };

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 100 }}>
      {/* Top Banner: 2020 MENS WEAR Fashion Header */}
      <div style={{
        background: '#000000',
        color: '#ffffff',
        fontWeight: '900',
        fontSize: '0.85rem',
        padding: '0.55rem 1rem',
        textAlign: 'center',
        letterSpacing: '0.45em',
        textTransform: 'uppercase',
        fontFamily: 'var(--font-fashion)',
        textShadow: '0 2px 8px rgba(255,255,255,0.15)'
      }}>
        2020 MENS WEAR
      </div>

      {/* Main Navbar */}
      <nav style={{ background: '#ffffff', borderBottom: '1px solid var(--border-color)', padding: '0.85rem 0' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem' }}>
          
          {/* Logo & Mobile Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button 
              className="mobile-menu-btn" 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              style={{ color: '#000000', display: 'none', background: '#f3f4f6', padding: '0.4rem', borderRadius: '4px' }}
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            
            {/* Logo: 2020 MENS WEAR Official Logo */}
            <a 
              href="#" 
              onClick={(e) => { 
                e.preventDefault(); 
                if (setSearchQuery) setSearchQuery('');
                if (onNavigateHome) onNavigateHome(); 
              }}
              style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', marginLeft: '-0.45rem' }}
            >
              <img 
                src="/logo.png" 
                alt="2020 MENS WEAR" 
                style={{ height: '42px', width: 'auto', objectFit: 'contain', display: 'block' }} 
              />
            </a>
          </div>

          {/* Desktop Navigation Links */}
          <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: '2rem', fontSize: '0.825rem', fontWeight: 800, letterSpacing: '0.02em', textTransform: 'uppercase' }}>
            <button 
              onClick={() => handleCategoryClick(null)}
              style={{ color: selectedCategory === null ? '#000000' : 'var(--text-secondary)', transition: 'color 0.2s', borderBottom: selectedCategory === null ? '2px solid #000000' : '2px solid transparent', paddingBottom: '0.2rem' }}
            >
              All Drops
            </button>

            {/* Tops Dropdown */}
            <div style={{ position: 'relative' }} onMouseEnter={() => setIsTopsOpen(true)} onMouseLeave={() => setIsTopsOpen(false)}>
              <button style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: 'var(--text-secondary)' }}>
                Tops <ChevronDown size={14} />
              </button>
              {isTopsOpen && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  width: '190px',
                  background: '#ffffff',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.4rem',
                  boxShadow: 'var(--shadow-md)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.2rem'
                }}>
                  <button onClick={() => handleCategoryClick('linen-shirts')} style={dropdownItemStyle}>Linen Shirts</button>
                  <button onClick={() => handleCategoryClick('solid-shirts')} style={dropdownItemStyle}>Solid Shirts</button>
                  <button onClick={() => handleCategoryClick('printed-shirts')} style={dropdownItemStyle}>Printed Shirts</button>
                  <button onClick={() => handleCategoryClick('old-money-polos')} style={dropdownItemStyle}>Old Money Polos</button>
                  <button onClick={() => handleCategoryClick('back-printed-tees')} style={dropdownItemStyle}>Back Printed Tees</button>
                </div>
              )}
            </div>

            {/* Bottoms Dropdown */}
            <div style={{ position: 'relative' }} onMouseEnter={() => setIsBottomsOpen(true)} onMouseLeave={() => setIsBottomsOpen(false)}>
              <button style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: 'var(--text-secondary)' }}>
                Bottoms <ChevronDown size={14} />
              </button>
              {isBottomsOpen && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  width: '190px',
                  background: '#ffffff',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.4rem',
                  boxShadow: 'var(--shadow-md)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.2rem'
                }}>
                  <button onClick={() => handleCategoryClick('gurkha-pants')} style={dropdownItemStyle}>Gurkha Trousers</button>
                  <button onClick={() => handleCategoryClick('formal-pants')} style={dropdownItemStyle}>Formal Trousers</button>
                  <button onClick={() => handleCategoryClick('denim-casuals')} style={dropdownItemStyle}>Denim Jeans</button>
                  <button onClick={() => handleCategoryClick('cord-sets')} style={dropdownItemStyle}>Co-ord Sets</button>
                </div>
              )}
            </div>

            <button onClick={() => handleCategoryClick('luxury-perfumes')} style={{ color: 'var(--text-secondary)' }}>
              Perfumes
            </button>
          </div>

          {/* Right Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            
            {/* Search Input */}
            <div style={{ position: 'relative', width: '240px' }} className="search-box">
              <Search size={14} style={{ position: 'absolute', left: '0.65rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                placeholder="Search catalog..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.45rem 0.65rem 0.45rem 2rem',
                  background: '#f3f4f6',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  color: '#000000',
                  fontSize: '0.775rem',
                  outline: 'none',
                  fontWeight: 600
                }}
              />
            </div>

          </div>

        </div>
      </nav>

      {/* Mobile Drawer Navigation Menu */}
      {isMobileMenuOpen && (
        <div style={{
          background: '#ffffff',
          borderBottom: '1px solid var(--border-color)',
          padding: '1rem 1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          fontSize: '0.85rem',
          fontWeight: 800,
          textTransform: 'uppercase'
        }}>
          <button onClick={() => handleCategoryClick(null)} style={{ textAlign: 'left', padding: '0.4rem 0' }}>All Drops</button>
          <button onClick={() => handleCategoryClick('linen-shirts')} style={{ textAlign: 'left', padding: '0.4rem 0' }}>Linen Shirts</button>
          <button onClick={() => handleCategoryClick('gurkha-pants')} style={{ textAlign: 'left', padding: '0.4rem 0' }}>Gurkha Trousers</button>
          <button onClick={() => handleCategoryClick('old-money-polos')} style={{ textAlign: 'left', padding: '0.4rem 0' }}>Old Money Polos</button>
          <button onClick={() => handleCategoryClick('luxury-perfumes')} style={{ textAlign: 'left', padding: '0.4rem 0' }}>Luxury Perfumes</button>
        </div>
      )}
    </header>
  );
}

const dropdownItemStyle = {
  textAlign: 'left',
  padding: '0.45rem 0.65rem',
  color: 'var(--text-secondary)',
  borderRadius: 'var(--radius-sm)',
  fontSize: '0.775rem',
  fontWeight: 700,
  width: '100%',
  transition: 'all 0.2s',
  cursor: 'pointer'
};
