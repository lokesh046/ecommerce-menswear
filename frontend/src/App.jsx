import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroBanner from './components/HeroBanner';
import CategoryGrid from './components/CategoryGrid';
import ProductDetailModal from './components/ProductDetailModal';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import InstagramReels from './components/InstagramReels';
import WhatsAppWidget from './components/WhatsAppWidget';
import AdminPage from './pages/AdminPage';
import CollectionPage from './pages/CollectionPage';
import { Truck, RefreshCw, Headset, ShieldCheck } from 'lucide-react';
import { API_BASE_URL } from './api';

export default function App() {
  const [viewState, setViewState] = useState(() => {
    return window.location.pathname === '/admin' ? 'admin' : 'home';
  });

  const [activeCollectionSlug, setActiveCollectionSlug] = useState('linen-shirts');

  // Wishlist & Cart state
  const [likedProductIds, setLikedProductIds] = useState(() => {
    const saved = localStorage.getItem('snipes_liked');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    // Warm up backend server on page load
    fetch(`${API_BASE_URL}/health`).catch(err => console.log('Warmup ping:', err));
  }, []);
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('snipes_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    localStorage.setItem('snipes_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('snipes_liked', JSON.stringify(likedProductIds));
  }, [likedProductIds]);

  const handleOpenCollectionPage = (slug) => {
    setActiveCollectionSlug(slug || 'linen-shirts');
    setViewState('collection');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleLike = (productId) => {
    setLikedProductIds(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  const handleAddToCart = (product, size = "M", quantity = 1) => {
    setCartItems(prev => {
      const existingIdx = prev.findIndex(item => item.id === product.id && item.size === size);
      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx].quantity += quantity;
        return updated;
      }
      return [...prev, { ...product, size, quantity }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateCartQuantity = (index, newQty) => {
    if (newQty <= 0) {
      handleRemoveCartItem(index);
      return;
    }
    setCartItems(prev => {
      const updated = [...prev];
      updated[index].quantity = newQty;
      return updated;
    });
  };

  const handleRemoveCartItem = (index) => {
    setCartItems(prev => prev.filter((_, idx) => idx !== index));
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // 1. Separate Admin Workspace Page
  if (viewState === 'admin') {
    return <AdminPage onReturnToStore={() => setViewState('home')} />;
  }

  // 2. Separate Dedicated Collection Page
  if (viewState === 'collection') {
    return (
      <CollectionPage 
        initialCategorySlug={activeCollectionSlug}
        onReturnToHome={() => setViewState('home')}
        onNavigateAdmin={() => setViewState('admin')}
      />
    );
  }

  // 3. Main Homepage View
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#ffffff', color: '#000000' }}>
      
      {/* Header Navigation */}
      <Navbar 
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        selectedCategory={null}
        onSelectCategory={handleOpenCollectionPage}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onNavigateHome={() => setViewState('home')}
      />

      {/* Hero Visual Banner */}
      {!searchQuery && (
        <HeroBanner onSelectCategory={handleOpenCollectionPage} />
      )}

      {/* Main Homepage Container */}
      <main className="container" style={{ flex: 1, paddingBottom: '3rem' }}>
        
        {/* SHOP THE COLLECTION Grid on Main Page (Pop-out hover cards with shadow elevation) */}
        <CategoryGrid onOpenCollectionPage={handleOpenCollectionPage} />

      </main>

      {/* Pure Menswear Quote Banner */}
      <section style={{ background: '#f8f9fa', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', padding: '4rem 0', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '850px', margin: '0 auto' }}>
          <span style={{ fontSize: '0.725rem', fontWeight: 800, color: 'var(--text-secondary)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            MENSWEAR ESSENCE
          </span>
          <blockquote style={{ fontSize: '1.5rem', fontStyle: 'italic', fontWeight: 800, color: '#000000', margin: '1rem 0 0.5rem 0', lineHeight: 1.45, fontFamily: 'var(--font-display)' }}>
            "Dressing well is a form of good manners."
          </blockquote>
          <cite style={{ fontSize: '0.85rem', fontWeight: 800, color: '#4b5563', textTransform: 'uppercase', fontStyle: 'normal', letterSpacing: '0.04em' }}>
            — TOM FORD
          </cite>
        </div>
      </section>

      {/* Instagram Reels Showcase Section */}
      <InstagramReels />

      {/* Footer */}
      <footer style={{ background: '#ffffff', color: 'var(--text-secondary)', padding: '3.5rem 0 2rem 0', fontSize: '0.825rem', borderTop: '1px solid var(--border-color)' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '2.5rem' }}>
          
          <div>
            <div style={{ marginBottom: '0.75rem' }}>
              <img 
                src="/logo.png" 
                alt="2020 MENS WEAR" 
                style={{ height: '44px', width: 'auto', objectFit: 'contain' }} 
              />
            </div>
            <p style={{ lineHeight: 1.6, color: 'var(--text-secondary)' }}>Tailored Gurkha trousers, French linen shirts, textured knit polos, and quiet luxury readymade menswear.</p>
          </div>

          <div>
            <h4 style={{ color: '#000000', fontSize: '0.85rem', marginBottom: '0.85rem', textTransform: 'uppercase' }}>COLLECTIONS</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontWeight: 600 }}>
              <li><a href="#" onClick={(e) => { e.preventDefault(); handleOpenCollectionPage('linen-shirts'); }}>Linen Collections</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); handleOpenCollectionPage('gurkha-pants'); }}>Gurkha Trousers</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); handleOpenCollectionPage('old-money-polos'); }}>Old Money Polos</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); handleOpenCollectionPage('back-printed-tees'); }}>Back Printed Tees</a></li>
            </ul>
          </div>

          <div>
            <h4 style={{ color: '#000000', fontSize: '0.85rem', marginBottom: '0.85rem', textTransform: 'uppercase' }}>STORE & ADMIN</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontWeight: 600 }}>
              <li><span>2020 MENS WEAR Store & Online</span></li>
              <li><span>Instagram: @2020_mens_wear</span></li>
              <li style={{ marginTop: '0.5rem' }}>
                <button 
                  onClick={() => setViewState('admin')}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    background: '#000000',
                    color: '#ffffff',
                    padding: '0.4rem 0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    textTransform: 'uppercase'
                  }}
                >
                  <ShieldCheck size={14} /> Admin Control Portal
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 style={{ color: '#000000', fontSize: '0.85rem', marginBottom: '0.85rem', textTransform: 'uppercase' }}>DROP NOTIFICATIONS</h4>
            <p style={{ fontSize: '0.775rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>Sign up for exclusive new drops and limited offers.</p>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input type="email" placeholder="Enter email address" style={{ flex: 1, padding: '0.55rem 0.75rem', background: '#f8f9fa', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', color: '#000000', fontSize: '0.775rem', outline: 'none' }} />
              <button className="btn btn-primary" style={{ padding: '0.55rem 0.85rem' }}>JOIN</button>
            </div>
          </div>

        </div>
      </footer>

      {/* Dialog Modals */}
      {selectedProduct && (
        <ProductDetailModal 
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
          isLiked={likedProductIds.includes(selectedProduct.id)}
          onToggleLike={handleToggleLike}
        />
      )}

      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      <CheckoutModal 
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        onOrderCompleted={() => setCartItems([])}
      />

      {/* Floating WhatsApp Chat Button & Widget */}
      <WhatsAppWidget />

    </div>
  );
}
