import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import CategoryBar from '../components/CategoryBar';
import ProductCard from '../components/ProductCard';
import ProductDetailModal from '../components/ProductDetailModal';
import CartDrawer from '../components/CartDrawer';
import CheckoutModal from '../components/CheckoutModal';
import { ArrowLeft, ShieldCheck, Camera, Globe } from 'lucide-react';
import { API_BASE_URL } from '../api';

export default function CollectionPage({ 
  initialCategorySlug, 
  onReturnToHome,
  onNavigateAdmin 
}) {
  const [selectedCategory, setSelectedCategory] = useState(initialCategorySlug || 'linen-shirts');
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [showWishlistOnly, setShowWishlistOnly] = useState(false);

  // Wishlist & Cart states
  const [likedProductIds, setLikedProductIds] = useState(() => {
    const saved = localStorage.getItem('snipes_liked');
    return saved ? JSON.parse(saved) : [];
  });
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('snipes_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('snipes_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('snipes_liked', JSON.stringify(likedProductIds));
  }, [likedProductIds]);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, searchQuery, sortBy]);

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/categories`);
      if (res.ok) setCategories(await res.json());
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let url = `${API_BASE_URL}/api/products?sort_by=${sortBy}`;
      if (selectedCategory) {
        url += `&category_slug=${selectedCategory}`;
      }
      if (searchQuery.trim()) {
        url += `&search=${encodeURIComponent(searchQuery.trim())}`;
      }

      const res = await fetch(url);
      if (res.ok) setProducts(await res.json());
    } catch (err) {
      console.error('Error fetching collection products:', err);
    } finally {
      setLoading(false);
    }
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
      setCartItems(prev => prev.filter((_, idx) => idx !== index));
      return;
    }
    setCartItems(prev => {
      const updated = [...prev];
      updated[index].quantity = newQty;
      return updated;
    });
  };

  const activeCategoryObj = categories.find(c => c.slug === selectedCategory);
  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const displayedProducts = showWishlistOnly 
    ? products.filter(p => likedProductIds.includes(p.id))
    : products;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#ffffff', color: '#000000' }}>
      
      {/* Header Navbar */}
      <Navbar 
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        selectedCategory={selectedCategory}
        onSelectCategory={(slug) => { setShowWishlistOnly(false); setSelectedCategory(slug); }}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onNavigateHome={onReturnToHome}
      />

      {/* Collection Header Banner */}
      <div style={{ background: '#f8f9fa', borderBottom: '1px solid var(--border-color)', padding: '2rem 0' }}>
        <div className="container">
          
          {/* Breadcrumbs & Back Button */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <button 
              onClick={onReturnToHome}
              className="btn btn-secondary"
              style={{ padding: '0.45rem 0.85rem', fontSize: '0.75rem' }}
            >
              <ArrowLeft size={15} /> Back to Main Page
            </button>

            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase' }}>
              HOME / COLLECTIONS / {activeCategoryObj?.name || 'EXPLORE CATALOG'}
            </span>
          </div>

          <h1 style={{ fontSize: '2.2rem', fontWeight: 900, textTransform: 'uppercase', color: '#000000', letterSpacing: '-0.02em' }}>
            {showWishlistOnly ? 'MY LIKED WISHLIST' : (activeCategoryObj?.name || 'EXPLORE ALL COLLECTIONS')}
          </h1>
          
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.35rem', maxWidth: '650px' }}>
            {showWishlistOnly ? 'Items you have saved with a heart.' : (activeCategoryObj?.description || 'Discover tailored menswear releases, linen shirts, Gurkha trousers, and quiet luxury essential drops.')}
          </p>

        </div>
      </div>

      {/* Main Content Area */}
      <main className="container" style={{ flex: 1, paddingBottom: '4rem' }}>
        
        {/* Explore Collections Bar */}
        <CategoryBar 
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={(slug) => { setShowWishlistOnly(false); setSelectedCategory(slug); }}
          showWishlistOnly={showWishlistOnly}
          setShowWishlistOnly={setShowWishlistOnly}
          wishlistCount={likedProductIds.length}
        />

        {/* Sort & Results Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 800 }}>
          <div>
            SHOWING <strong style={{ color: '#000000' }}>{displayedProducts.length}</strong> ITEMS
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>SORT BY:</span>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                background: '#ffffff',
                border: '1px solid var(--border-color)',
                color: '#000000',
                padding: '0.4rem 0.65rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.775rem',
                outline: 'none',
                fontWeight: 800
              }}
            >
              <option value="newest">FEATURED & NEWEST</option>
              <option value="price_low">PRICE: LOW TO HIGH</option>
              <option value="price_high">PRICE: HIGH TO LOW</option>
            </select>
          </div>
        </div>

        {/* Products Grid with Pop-out Shadow Elevation Cards */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: '#000000' }}>
            <h4>LOADING COLLECTION ITEMS...</h4>
          </div>
        ) : displayedProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', background: '#f8f9fa', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)' }}>
            <h3>NO PRODUCTS IN THIS COLLECTION</h3>
            <p style={{ color: 'var(--text-secondary)', margin: '0.5rem 0 1.5rem 0', fontSize: '0.85rem' }}>Explore another collection from the bar above.</p>
            <button onClick={() => { setSelectedCategory(null); setShowWishlistOnly(false); }} className="btn btn-primary">
              VIEW ALL COLLECTIONS
            </button>
          </div>
        ) : (
          <div className="product-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '1.5rem'
          }}>
            {displayedProducts.map((prod) => (
              <ProductCard 
                key={prod.id}
                product={prod}
                onQuickView={setSelectedProduct}
                onAddToCart={handleAddToCart}
                isLiked={likedProductIds.includes(prod.id)}
                onToggleLike={handleToggleLike}
              />
            ))}
          </div>
        )}

      </main>

      {/* Minimal Footer for Explore Collection Page */}
      <footer style={{ background: '#ffffff', color: 'var(--text-secondary)', padding: '2rem 0', fontSize: '0.825rem', borderTop: '1px solid var(--border-color)' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <img 
              src="/logo.png" 
              alt="2020 MENS WEAR" 
              style={{ height: '36px', width: 'auto', objectFit: 'contain' }} 
            />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
              © 2026 2020 MENS WEAR. All rights reserved.
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <a 
              href="https://www.instagram.com/2020_mens_wear/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn btn-secondary" 
              style={{ padding: '0.45rem 0.85rem', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <Camera size={15} /> Instagram
            </a>

            <a 
              href="https://facebook.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn btn-secondary" 
              style={{ padding: '0.45rem 0.85rem', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <Globe size={15} /> Facebook
            </a>
          </div>
        </div>
      </footer>

      {/* Modals */}
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
        onUpdateQuantity={(idx, qty) => {
          if (qty <= 0) {
            setCartItems(prev => prev.filter((_, i) => i !== idx));
          } else {
            setCartItems(prev => {
              const u = [...prev];
              u[idx].quantity = qty;
              return u;
            });
          }
        }}
        onRemoveItem={(idx) => setCartItems(prev => prev.filter((_, i) => i !== idx))}
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

    </div>
  );
}
