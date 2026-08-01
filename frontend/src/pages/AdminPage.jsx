import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, DollarSign, Package, ShoppingBag, AlertTriangle, 
  Plus, Trash2, Edit, X, ArrowLeft, RefreshCw, Database, Upload, Layers, Check, FolderPlus, Video, ExternalLink, Sparkles
} from 'lucide-react';
import { API_BASE_URL } from '../api';

const ALL_SIZES = ["S", "M", "L", "XL", "XXL"];

export default function AdminPage({ onReturnToStore }) {
  const [token, setToken] = useState(localStorage.getItem('admin_token') || null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [activeTab, setActiveTab] = useState('hero'); // 'hero' | 'reels' | 'products' | 'collections' | 'database'
  const [stats, setStats] = useState({ total_revenue: 0, total_orders: 0, total_products: 0, low_stock_products: 0 });
  const [productsList, setProductsList] = useState([]);
  const [ordersList, setOrdersList] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [reelsList, setReelsList] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);

  // Hero Banner Layout State (4 Slides default)
  const [heroSlides, setHeroSlides] = useState(() => {
    const saved = localStorage.getItem('menswear_hero_slides');
    if (saved) {
      try { return JSON.parse(saved); } catch(e) {}
    }
    return [
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
  });

  const handleAddHeroSlide = () => {
    setHeroSlides(prev => [
      ...prev,
      {
        badge: "NEW COLLECTION DROP",
        title: "NEW SEASON MENSWEAR",
        subtitle: "Explore our latest arrival readymade luxury menswear.",
        cta: "SHOP COLLECTION",
        categorySlug: "linen-shirts",
        bgImage: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&q=80&w=1600"
      }
    ]);
  };

  const handleRemoveHeroSlide = (index) => {
    if (heroSlides.length <= 1) {
      alert("You must keep at least 1 hero banner slide.");
      return;
    }
    setHeroSlides(prev => prev.filter((_, i) => i !== index));
  };

  // Form Toggles
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddReel, setShowAddReel] = useState(false);

  // New Collection Form State
  const [newCategory, setNewCategory] = useState({
    name: '',
    slug: '',
    description: 'Exclusive Snipes Menswear Collection',
    image_url: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&q=80&w=800'
  });

  // New Product Form State
  const [newProduct, setNewProduct] = useState({
    title: '',
    slug: '',
    category_id: 1,
    price: 1499,
    original_price: 2499,
    badge: 'New Collection Drop',
    fabric: '100% French Linen',
    fit: 'Tailored Fit',
    description: 'Minimalist luxury fashion piece.',
    image_url: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&q=80&w=800',
    stock: 50,
    sizes: ["S", "M", "L", "XL", "XXL"]
  });

  // New Reel Form State
  const [newReel, setNewReel] = useState({
    title: '',
    reel_url: 'https://www.instagram.com/2020_mens_wear/',
    cover_image_url: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=600',
    tagline: 'New Drop @2020_mens_wear'
  });

  useEffect(() => {
    if (token) {
      fetchAdminData();
    }
  }, [token]);

  const fetchAdminData = async () => {
    try {
      const [sRes, pRes, oRes, cRes, rRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/admin/stats`),
        fetch(`${API_BASE_URL}/api/products`),
        fetch(`${API_BASE_URL}/api/orders`),
        fetch(`${API_BASE_URL}/api/categories`),
        fetch(`${API_BASE_URL}/api/reels`)
      ]);

      if (sRes.ok) setStats(await sRes.json());
      if (pRes.ok) setProductsList(await pRes.json());
      if (oRes.ok) setOrdersList(await oRes.json());
      if (cRes.ok) setCategoriesList(await cRes.json());
      if (rRes.ok) setReelsList(await rRes.json());
    } catch (err) {
      console.error('Error fetching admin data:', err);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (!res.ok) {
        throw new Error('Invalid admin credentials');
      }

      const data = await res.json();
      setToken(data.access_token);
      localStorage.setItem('admin_token', data.access_token);
      fetchAdminData();
    } catch (err) {
      setLoginError(err.message);
    }
  };

  const handleLogout = () => {
    setToken(null);
    setUsername('');
    setPassword('');
    localStorage.removeItem('admin_token');
  };

  const handleSaveHeroSlides = (e) => {
    if (e) e.preventDefault();
    localStorage.setItem('menswear_hero_slides', JSON.stringify(heroSlides));
    window.dispatchEvent(new Event('hero_slides_updated'));
    alert('Hero Banner Layout & Drop Links saved successfully!');
  };

  // Helper to compress local PNG/JPG images before saving
  const compressImageFile = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const maxDim = 1200;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.82));
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  // Image File Upload Helper (Cloudinary CDN + Canvas Compressed Base64 Fallback)
  const handleImageFileUpload = async (e, targetStateSetter) => {
    const file = e.target.files[0];
    if (!file) return null;

    let imageUrl = '';
    const cloudName = localStorage.getItem('menswear_cloudinary_cloud_name') || import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'menswear';
    const uploadPreset = localStorage.getItem('menswear_cloudinary_preset') || import.meta.env.VITE_CLOUDINARY_PRESET || 'mw3u1zla';

    if (cloudName && uploadPreset) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', uploadPreset);

        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
          method: 'POST',
          body: formData
        });

        if (res.ok) {
          const data = await res.json();
          imageUrl = data.secure_url;
        }
      } catch (err) {
        console.error("Cloudinary upload error, using compressed local fallback:", err);
      }
    }

    if (!imageUrl) {
      imageUrl = await compressImageFile(file);
    }

    if (targetStateSetter && typeof targetStateSetter === 'function') {
      targetStateSetter(prev => ({
        ...prev,
        cover_image_url: imageUrl,
        image_url: imageUrl,
        bgImage: imageUrl
      }));
    }

    return imageUrl;
  };

  const handleToggleSize = (size) => {
    setNewProduct(prev => {
      const current = prev.sizes || [];
      if (current.includes(size)) {
        return { ...prev, sizes: current.filter(s => s !== size) };
      } else {
        return { ...prev, sizes: [...current, size] };
      }
    });
  };

  const handleCreateReel = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/api/reels`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReel)
      });

      if (res.ok) {
        alert('Instagram Reel published successfully!');
        setShowAddReel(false);
        setNewReel({
          title: '',
          reel_url: 'https://www.instagram.com/2020_mens_wear/',
          cover_image_url: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=600',
          tagline: 'New Drop @2020_mens_wear'
        });
        fetchAdminData();
      } else {
        alert('Failed to publish reel. Please check backend connection.');
      }
    } catch (err) {
      alert('Error publishing reel: ' + err.message);
    }
  };

  const handleDeleteReel = async (id) => {
    if (!window.confirm('Delete this Instagram Reel link?')) return;
    try {
      await fetch(`${API_BASE_URL}/api/reels/${id}`, { method: 'DELETE' });
      fetchAdminData();
    } catch (err) {
      console.error('Error deleting reel:', err);
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    try {
      const slug = newCategory.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const payload = { ...newCategory, slug };

      const res = await fetch(`${API_BASE_URL}/api/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        alert('Collection created successfully!');
        setShowAddCategory(false);
        fetchAdminData();
      }
    } catch (err) {
      alert('Error creating category: ' + err.message);
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    if (!newProduct.image_url) {
      alert('Please upload a product photo or paste an image URL first.');
      return;
    }

    try {
      const slug = newProduct.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now().toString().slice(-4);
      const payload = {
        ...newProduct,
        slug,
        sizes: (newProduct.sizes || []).join(',')
      };

      const res = await fetch(`${API_BASE_URL}/api/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        alert('Product published to collection successfully!');
        setShowAddProduct(false);
        setNewProduct({
          title: '',
          slug: '',
          category_id: categoriesList[0]?.id || 1,
          price: 1999,
          original_price: 2999,
          image_url: '',
          hover_image_url: '',
          description: 'Premium tailored menswear.',
          fabric: '100% Cotton',
          fit: 'Regular Fit',
          sizes: ['S', 'M', 'L', 'XL']
        });
        fetchAdminData();
      } else {
        alert('Failed to publish product. Please check backend connection.');
      }
    } catch (err) {
      alert('Error creating product: ' + err.message);
    }
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    if (!editingProduct) return;
    try {
      const payload = {
        title: editingProduct.title,
        price: editingProduct.price,
        original_price: editingProduct.original_price,
        stock: editingProduct.stock,
        category_id: editingProduct.category_id,
        sizes: editingProduct.sizes,
        image_url: editingProduct.image_url,
        description: editingProduct.description || 'Premium tailored menswear.',
        fabric: editingProduct.fabric || '100% Cotton',
        fit: editingProduct.fit || 'Regular Fit'
      };

      const res = await fetch(`${API_BASE_URL}/api/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        alert('Product details updated successfully!');
        setEditingProduct(null);
        fetchAdminData();
      } else {
        alert('Failed to update product. Please try again.');
      }
    } catch (err) {
      alert('Error updating product: ' + err.message);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Delete this collection and its associated products?')) return;
    try {
      await fetch(`${API_BASE_URL}/api/categories/${id}`, { method: 'DELETE' });
      fetchAdminData();
    } catch (err) {
      alert('Error deleting collection: ' + err.message);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Delete this product from database?')) return;
    try {
      await fetch(`${API_BASE_URL}/api/products/${id}`, { method: 'DELETE' });
      fetchAdminData();
    } catch (err) {
      console.error('Error deleting product:', err);
    }
  };

  // If not logged in
  if (!token) {
    return (
      <div style={{ minHeight: '100vh', background: '#f8f9fa', color: '#000000', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '2rem' }}>
        <div style={{ width: '100%', maxWidth: '400px', background: '#ffffff', border: '1px solid var(--border-color)', padding: '2.5rem', borderRadius: 'var(--radius-sm)', boxShadow: 'var(--shadow-md)' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 900, letterSpacing: '-0.02em', color: '#000000' }}>
              SNIPES MENSWEAR
            </span>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.35rem', fontWeight: 800, textTransform: 'uppercase' }}>
              ADMIN CONTROL PANEL
            </p>
          </div>

          {loginError && (
            <div style={{ background: '#fef2f2', border: '1px solid #f87171', color: '#991b1b', padding: '0.65rem', borderRadius: 'var(--radius-sm)', fontSize: '0.825rem', marginBottom: '1.25rem', textAlign: 'center' }}>
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            <div>
              <label style={adminLabelStyle}>USERNAME</label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} style={adminInputStyle} />
            </div>

            <div>
              <label style={adminLabelStyle}>PASSWORD</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={adminInputStyle} />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.85rem', marginTop: '0.4rem' }}>
              SIGN IN TO ADMIN
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.75rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.1rem' }}>
            <button onClick={onReturnToStore} style={{ color: 'var(--text-secondary)', fontSize: '0.825rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
              <ArrowLeft size={15} /> Return to Storefront
            </button>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa', color: '#000000', display: 'flex' }}>
      
      {/* Sidebar Navigation */}
      <aside style={{ width: '270px', background: '#ffffff', borderRight: '1px solid var(--border-color)', padding: '1.5rem 1.1rem', display: 'flex', flexDirection: 'column' }}>
        
        <div style={{ marginBottom: '2rem' }}>
          <img 
            src="/logo.png" 
            alt="2020 MENS WEAR" 
            style={{ height: '40px', width: 'auto', objectFit: 'contain' }} 
          />
          <div style={{ fontSize: '0.675rem', color: 'var(--text-secondary)', fontWeight: 800, textTransform: 'uppercase', marginTop: '0.35rem' }}>
            ADMIN CONTROL PANEL
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', flex: 1 }}>
          <button 
            onClick={() => setActiveTab('hero')} 
            style={sidebarBtnStyle(activeTab === 'hero')}
          >
            <Sparkles size={16} /> Hero Banner & Layout
          </button>

          <button 
            onClick={() => setActiveTab('reels')} 
            style={sidebarBtnStyle(activeTab === 'reels')}
          >
            <Video size={16} /> @2020_mens_wear Reels ({reelsList.length})
          </button>

          <button 
            onClick={() => setActiveTab('products')} 
            style={sidebarBtnStyle(activeTab === 'products')}
          >
            <Package size={16} /> Products ({productsList.length})
          </button>

          <button 
            onClick={() => setActiveTab('collections')} 
            style={sidebarBtnStyle(activeTab === 'collections')}
          >
            <Layers size={16} /> Collections ({categoriesList.length})
          </button>

          <button 
            onClick={() => setActiveTab('database')} 
            style={sidebarBtnStyle(activeTab === 'database')}
          >
            <Database size={16} /> Cloud Database
          </button>
        </div>

        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          <button onClick={onReturnToStore} className="btn btn-secondary" style={{ width: '100%', fontSize: '0.725rem' }}>
            <ArrowLeft size={15} /> Return to Store
          </button>

          <button onClick={handleLogout} style={{ color: 'var(--text-secondary)', fontSize: '0.775rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem', justifyContent: 'center' }}>
            Log out
          </button>
        </div>

      </aside>

      {/* Main Workspace */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        
        <header style={{ padding: '1.1rem 2rem', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#ffffff' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 900 }}>
            {activeTab === 'hero' && 'HERO BANNER & LAYOUT EDITOR'}
            {activeTab === 'reels' && 'INSTAGRAM REELS MANAGER (@2020_MENS_WEAR)'}
            {activeTab === 'products' && 'PRODUCT INVENTORY & SIZES LOG'}
            {activeTab === 'collections' && 'MENSWEAR COLLECTIONS LOG'}
            {activeTab === 'database' && 'NEON POSTGRESQL CLOUD SETUP'}
          </h2>

          <button onClick={fetchAdminData} className="btn btn-secondary" style={{ padding: '0.4rem 0.85rem', fontSize: '0.725rem' }}>
            <RefreshCw size={14} /> Refresh Data
          </button>
        </header>

        <div style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
          
          {/* Tab: Hero Banner & Layout Editor */}
          {activeTab === 'hero' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>Edit Main Homepage Hero Banner Layout</h3>
                  <p style={{ fontSize: '0.775rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
                    Customize banner text, titles, subtitles, background images, and drop collection links.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button type="button" onClick={handleAddHeroSlide} className="btn btn-secondary" style={{ padding: '0.6rem 1.1rem', fontSize: '0.775rem' }}>
                    <Plus size={15} /> Add New Slide
                  </button>

                  <button onClick={handleSaveHeroSlides} className="btn btn-primary" style={{ padding: '0.6rem 1.25rem' }}>
                    Save Hero Banner Layout
                  </button>
                </div>
              </div>

              {/* WhatsApp Phone Number Configuration Card */}
              <div style={{ background: '#ffffff', border: '1px solid var(--border-color)', padding: '1.25rem 1.5rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: '0.25rem' }}>💬 WhatsApp Floating Chat Phone Number</h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.85rem' }}>
                  Visitors clicking the floating green WhatsApp chat widget will open a direct chat with this number. Include country code (e.g. 919876543210).
                </p>
                <div style={{ display: 'flex', gap: '0.75rem', maxWidth: '520px' }}>
                  <input 
                    type="text" 
                    placeholder="WhatsApp number e.g. 919876543210"
                    defaultValue={localStorage.getItem('menswear_whatsapp_number') || '919876543210'}
                    onChange={(e) => {
                      localStorage.setItem('menswear_whatsapp_number', e.target.value);
                    }}
                    style={{ flex: 1, padding: '0.55rem 0.85rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', outline: 'none' }}
                  />
                  <button type="button" onClick={() => alert('WhatsApp phone number updated successfully!')} className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.75rem' }}>
                    Save Number
                  </button>
                </div>
              </div>

              {/* Cloudinary 25 GB Free Cloud Storage Card */}
              <div style={{ background: '#ffffff', border: '1px solid var(--border-color)', padding: '1.25rem 1.5rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: '0.25rem' }}>☁️ Cloudinary Free CDN Image Storage (Optional)</h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.85rem' }}>
                  Enable free CDN image hosting for 25,000+ product photos. Enter your Cloudinary <strong>Cloud Name</strong> &amp; <strong>Unsigned Upload Preset</strong>.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '0.75rem', maxWidth: '640px' }}>
                  <input 
                    type="text" 
                    placeholder="Cloud Name (e.g. menswear)"
                    defaultValue={localStorage.getItem('menswear_cloudinary_cloud_name') || import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'menswear'}
                    onChange={(e) => localStorage.setItem('menswear_cloudinary_cloud_name', e.target.value.trim())}
                    style={{ padding: '0.55rem 0.85rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', outline: 'none' }}
                  />
                  <input 
                    type="text" 
                    placeholder="Upload Preset (e.g. mw3u1zla)"
                    defaultValue={localStorage.getItem('menswear_cloudinary_preset') || import.meta.env.VITE_CLOUDINARY_PRESET || 'mw3u1zla'}
                    onChange={(e) => localStorage.setItem('menswear_cloudinary_preset', e.target.value.trim())}
                    style={{ padding: '0.55rem 0.85rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', outline: 'none' }}
                  />
                  <button type="button" onClick={() => alert('Cloudinary CDN Keys Saved! Image uploads will now save automatically to your Cloudinary CDN.')} className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.75rem' }}>
                    Save Keys
                  </button>
                </div>
              </div>

              <form onSubmit={handleSaveHeroSlides} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {heroSlides.map((slide, idx) => (
                  <div key={idx} style={{ background: '#ffffff', border: '1px solid var(--border-color)', padding: '1.5rem', borderRadius: 'var(--radius-sm)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    
                    <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 900, color: '#000000', textTransform: 'uppercase' }}>
                        Hero Slide #{idx + 1}
                      </span>

                      {heroSlides.length > 1 && (
                        <button 
                          type="button" 
                          onClick={() => handleRemoveHeroSlide(idx)}
                          style={{ color: '#ef4444', fontSize: '0.725rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.25rem', background: 'transparent', border: 'none', cursor: 'pointer' }}
                        >
                          <Trash2 size={13} /> Remove Slide
                        </button>
                      )}
                    </div>

                    <div>
                      <label style={adminLabelStyle}>BADGE TEXT *</label>
                      <input 
                        type="text" 
                        required 
                        value={slide.badge} 
                        onChange={(e) => {
                          const updated = [...heroSlides];
                          updated[idx].badge = e.target.value;
                          setHeroSlides(updated);
                        }} 
                        style={adminInputStyle} 
                        placeholder="e.g. SIGNATURE TAILORING" 
                      />
                    </div>

                    <div>
                      <label style={adminLabelStyle}>MAIN HERO TITLE *</label>
                      <input 
                        type="text" 
                        required 
                        value={slide.title} 
                        onChange={(e) => {
                          const updated = [...heroSlides];
                          updated[idx].title = e.target.value;
                          setHeroSlides(updated);
                        }} 
                        style={adminInputStyle} 
                        placeholder="e.g. PLEATED GURKHA TROUSERS" 
                      />
                    </div>

                    <div style={{ gridColumn: 'span 2' }}>
                      <label style={adminLabelStyle}>SUBTITLE / DESCRIPTION *</label>
                      <input 
                        type="text" 
                        required 
                        value={slide.subtitle} 
                        onChange={(e) => {
                          const updated = [...heroSlides];
                          updated[idx].subtitle = e.target.value;
                          setHeroSlides(updated);
                        }} 
                        style={adminInputStyle} 
                        placeholder="e.g. High-waisted luxury trousers featuring iconic double-side waist buckles." 
                      />
                    </div>

                    <div>
                      <label style={adminLabelStyle}>PRIMARY BUTTON TEXT *</label>
                      <input 
                        type="text" 
                        required 
                        value={slide.cta} 
                        onChange={(e) => {
                          const updated = [...heroSlides];
                          updated[idx].cta = e.target.value;
                          setHeroSlides(updated);
                        }} 
                        style={adminInputStyle} 
                        placeholder="e.g. SHOP GURKHA PANTS" 
                      />
                    </div>

                    <div>
                      <label style={adminLabelStyle}>LINK TO COLLECTION DROP *</label>
                      <select 
                        value={slide.categorySlug} 
                        onChange={(e) => {
                          const updated = [...heroSlides];
                          updated[idx].categorySlug = e.target.value;
                          setHeroSlides(updated);
                        }} 
                        style={adminInputStyle}
                      >
                        <option value="linen-shirts">Linen Shirts Drop</option>
                        <option value="gurkha-pants">Gurkha Pants Drop</option>
                        <option value="old-money-polos">Old Money Polos Drop</option>
                        <option value="solid-shirts">Solid Shirts Drop</option>
                        <option value="printed-shirts">Printed Shirts Drop</option>
                        <option value="back-printed-tees">Back Printed Tees Drop</option>
                        <option value="formal-pants">Formal Pants Drop</option>
                        <option value="denim-casuals">Denim & Casuals Drop</option>
                        <option value="luxury-perfumes">Luxury Perfumes Drop</option>
                        {categoriesList.map(cat => (
                          <option key={cat.id} value={cat.slug}>{cat.name} Drop</option>
                        ))}
                      </select>
                    </div>

                    <div style={{ gridColumn: 'span 2' }}>
                      <label style={adminLabelStyle}>HERO BACKGROUND IMAGE (URL OR FILE UPLOAD) *</label>
                      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                        <input 
                          type="text" 
                          required 
                          value={slide.bgImage} 
                          onChange={(e) => {
                            const updated = [...heroSlides];
                            updated[idx].bgImage = e.target.value;
                            setHeroSlides(updated);
                          }} 
                          style={{ ...adminInputStyle, flex: 1 }} 
                          placeholder="Background Image URL..." 
                        />
                        <label className="btn btn-secondary" style={{ padding: '0.5rem 0.85rem', fontSize: '0.75rem', cursor: 'pointer' }}>
                          <Upload size={14} /> Upload Image
                          <input type="file" accept="image/*" onChange={async (e) => {
                            const url = await handleImageFileUpload(e);
                            if (url) {
                              const updated = [...heroSlides];
                              updated[idx].bgImage = url;
                              setHeroSlides(updated);
                            }
                          }} style={{ display: 'none' }} />
                        </label>
                      </div>
                    </div>

                  </div>
                ))}

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                  <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 2rem', fontSize: '0.85rem' }}>
                    Save Hero Banner Layout
                  </button>
                </div>

              </form>
            </div>
          )}

          {/* Tab: Instagram Reels Manager */}
          {activeTab === 'reels' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>Manage @2020_mens_wear Instagram Reels</h3>
                  <p style={{ fontSize: '0.775rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
                    Paste new Instagram Reel links to update the homepage reels showcase instantly.
                  </p>
                </div>

                <button onClick={() => setShowAddReel(!showAddReel)} className="btn btn-primary" style={{ fontSize: '0.725rem' }}>
                  <Plus size={15} /> {showAddReel ? 'Cancel' : 'Add New Instagram Reel'}
                </button>
              </div>

              {/* Add Reel Form */}
              {showAddReel && (
                <form onSubmit={handleCreateReel} style={{ background: '#ffffff', border: '1px solid var(--border-color)', padding: '1.5rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  
                  <div>
                    <label style={adminLabelStyle}>REEL TITLE / CAPTION *</label>
                    <input type="text" required value={newReel.title} onChange={(e) => setNewReel({...newReel, title: e.target.value})} style={adminInputStyle} placeholder="e.g. kasakuren or Linen Drop" />
                  </div>

                  <div>
                    <label style={adminLabelStyle}>INSTAGRAM REEL LINK / URL *</label>
                    <input type="text" required value={newReel.reel_url} onChange={(e) => setNewReel({...newReel, reel_url: e.target.value})} style={adminInputStyle} placeholder="https://www.instagram.com/reel/C-XXXX/" />
                  </div>

                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={adminLabelStyle}>REEL COVER PHOTO / THUMBNAIL (URL OR FILE UPLOAD) *</label>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                      <input type="text" required value={newReel.cover_image_url} onChange={(e) => setNewReel({...newReel, cover_image_url: e.target.value})} style={{ ...adminInputStyle, flex: 1 }} placeholder="Image URL..." />
                      <label className="btn btn-secondary" style={{ padding: '0.5rem 0.85rem', fontSize: '0.75rem', cursor: 'pointer' }}>
                        <Upload size={14} /> Upload Thumbnail
                        <input type="file" accept="image/*" onChange={(e) => handleImageFileUpload(e, setNewReel)} style={{ display: 'none' }} />
                      </label>
                    </div>
                  </div>

                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={adminLabelStyle}>REEL VIDEO (MP4 URL OR VIDEO FILE UPLOAD FOR IN-WEBSITE PLAYBACK)</label>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                      <input type="text" value={newReel.video_url || ''} onChange={(e) => setNewReel({...newReel, video_url: e.target.value})} style={{ ...adminInputStyle, flex: 1 }} placeholder="https://.../video.mp4" />
                      <label className="btn btn-secondary" style={{ padding: '0.5rem 0.85rem', fontSize: '0.75rem', cursor: 'pointer' }}>
                        <Upload size={14} /> Upload Video MP4
                        <input type="file" accept="video/*" onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setNewReel(prev => ({ ...prev, video_url: reader.result }));
                            };
                            reader.readAsDataURL(file);
                          }
                        }} style={{ display: 'none' }} />
                      </label>
                    </div>
                  </div>

                  <div>
                    <label style={adminLabelStyle}>TAGLINE / SUBTITLE</label>
                    <input type="text" value={newReel.tagline} onChange={(e) => setNewReel({...newReel, tagline: e.target.value})} style={adminInputStyle} placeholder="e.g. Exclusive Drop @2020_mens_wear" />
                  </div>

                  <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                    <button type="submit" className="btn btn-primary" style={{ padding: '0.55rem 1.25rem' }}>
                      Publish Reel to Website
                    </button>
                  </div>

                </form>
              )}

              {/* Reels Log Table */}
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.825rem', textAlign: 'left', background: '#ffffff', border: '1px solid var(--border-color)' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', background: '#f8f9fa', color: '#000000', textTransform: 'uppercase', fontWeight: 800 }}>
                    <th style={{ padding: '0.75rem' }}>Thumbnail</th>
                    <th style={{ padding: '0.75rem' }}>Reel Title</th>
                    <th style={{ padding: '0.75rem' }}>Instagram URL</th>
                    <th style={{ padding: '0.75rem' }}>Tagline</th>
                    <th style={{ padding: '0.75rem' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {reelsList.map((r) => (
                    <tr key={r.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '0.65rem' }}>
                        <img src={r.cover_image_url} alt={r.title} style={{ width: '40px', height: '60px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--border-color)' }} />
                      </td>
                      <td style={{ padding: '0.65rem', fontWeight: 800, color: '#000000' }}>{r.title}</td>
                      <td style={{ padding: '0.65rem' }}>
                        <a href={r.reel_url} target="_blank" rel="noopener noreferrer" style={{ color: '#000000', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                          View Link <ExternalLink size={12} />
                        </a>
                      </td>
                      <td style={{ padding: '0.65rem', color: 'var(--text-secondary)' }}>{r.tagline}</td>
                      <td style={{ padding: '0.65rem' }}>
                        <button onClick={() => handleDeleteReel(r.id)} style={{ color: '#000000' }} title="Delete Reel">
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

            </div>
          )}

          {/* Tab: Products */}
          {activeTab === 'products' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>Collection Products Activity Log</h3>
                <button onClick={() => setShowAddProduct(!showAddProduct)} className="btn btn-primary" style={{ fontSize: '0.725rem' }}>
                  <Plus size={15} /> {showAddProduct ? 'Cancel' : 'Add New Product'}
                </button>
              </div>

              {showAddProduct && (
                <form onSubmit={handleCreateProduct} style={{ background: '#ffffff', border: '1px solid var(--border-color)', padding: '1.5rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={adminLabelStyle}>PRODUCT NAME / TITLE *</label>
                    <input type="text" required value={newProduct.title} onChange={(e) => setNewProduct({...newProduct, title: e.target.value})} style={adminInputStyle} />
                  </div>
                  <div>
                    <label style={adminLabelStyle}>ASSIGN TO COLLECTION *</label>
                    <select value={newProduct.category_id} onChange={(e) => setNewProduct({...newProduct, category_id: parseInt(e.target.value)})} style={adminInputStyle}>
                      {categoriesList.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={adminLabelStyle}>PRICE (₹) *</label>
                    <input type="number" required value={newProduct.price} onChange={(e) => setNewProduct({...newProduct, price: parseFloat(e.target.value)})} style={adminInputStyle} />
                  </div>
                  <div>
                    <label style={adminLabelStyle}>STOCK AVAILABILITY *</label>
                    <input type="number" required value={newProduct.stock} onChange={(e) => setNewProduct({...newProduct, stock: parseInt(e.target.value)})} style={adminInputStyle} />
                  </div>

                  {/* Sizes Selection Pills */}
                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={adminLabelStyle}>AVAILABLE SIZES (CLICK TO TOGGLE SIZES) *</label>
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.35rem' }}>
                      {ALL_SIZES.map((size) => {
                        const isSelected = (newProduct.sizes || []).includes(size);
                        return (
                          <button
                            type="button"
                            key={size}
                            onClick={() => handleToggleSize(size)}
                            style={{
                              padding: '0.45rem 0.95rem',
                              borderRadius: '4px',
                              border: '1.5px solid #000000',
                              background: isSelected ? '#000000' : '#ffffff',
                              color: isSelected ? '#ffffff' : '#000000',
                              fontWeight: 800,
                              fontSize: '0.8rem',
                              cursor: 'pointer',
                              transition: 'all 0.2s'
                            }}
                          >
                            {size} {isSelected && '✓'}
                          </button>
                        );
                      })}
                    </div>
                    <span style={{ fontSize: '0.725rem', color: 'var(--text-secondary)', marginTop: '0.35rem', display: 'block', fontWeight: 700 }}>
                      Selected Sizes: {(newProduct.sizes || []).join(', ') || 'None'}
                    </span>
                  </div>

                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={adminLabelStyle}>PRODUCT PHOTO (URL OR FILE UPLOAD) *</label>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                      <input type="text" required value={newProduct.image_url} onChange={(e) => setNewProduct({...newProduct, image_url: e.target.value})} style={{ ...adminInputStyle, flex: 1 }} placeholder="Image URL..." />
                      <label className="btn btn-secondary" style={{ padding: '0.5rem 0.85rem', fontSize: '0.75rem', cursor: 'pointer' }}>
                        <Upload size={14} /> Upload Photo
                        <input type="file" accept="image/*" onChange={(e) => handleImageFileUpload(e, setNewProduct)} style={{ display: 'none' }} />
                      </label>
                    </div>
                  </div>

                  <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end' }}>
                    <button type="submit" className="btn btn-primary" style={{ padding: '0.65rem 1.5rem' }}>Publish Product</button>
                  </div>
                </form>
              )}

              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.825rem', textAlign: 'left', background: '#ffffff', border: '1px solid var(--border-color)' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', background: '#f8f9fa', color: '#000000', textTransform: 'uppercase', fontWeight: 800 }}>
                    <th style={{ padding: '0.75rem' }}>Photo</th>
                    <th style={{ padding: '0.75rem' }}>Product Name</th>
                    <th style={{ padding: '0.75rem' }}>Collection</th>
                    <th style={{ padding: '0.75rem' }}>Available Sizes</th>
                    <th style={{ padding: '0.75rem' }}>Price</th>
                    <th style={{ padding: '0.75rem' }}>Stock</th>
                    <th style={{ padding: '0.75rem' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {productsList.map((p) => (
                    <tr key={p.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '0.65rem' }}>
                        <img src={p.image_url} alt={p.title} style={{ width: '45px', height: '60px', objectFit: 'cover', borderRadius: '2px', border: '1px solid var(--border-color)' }} />
                      </td>
                      <td style={{ padding: '0.65rem', fontWeight: 800, color: '#000000' }}>{p.title}</td>
                      <td style={{ padding: '0.65rem', fontWeight: 700, color: 'var(--text-secondary)' }}>{p.category?.name || 'Menswear'}</td>
                      <td style={{ padding: '0.65rem', fontWeight: 700 }}>{p.sizes || 'S, M, L, XL, XXL'}</td>
                      <td style={{ padding: '0.65rem', fontWeight: 900 }}>₹{p.price.toLocaleString('en-IN')}</td>
                      <td style={{ padding: '0.65rem' }}><span className="badge badge-black">{p.stock} in stock</span></td>
                      <td style={{ padding: '0.65rem' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                          <button 
                            onClick={() => setEditingProduct({ ...p, sizesArray: p.sizes ? p.sizes.split(',') : ['S', 'M', 'L', 'XL'] })} 
                            style={{ color: '#2563eb', padding: '0.2rem', cursor: 'pointer' }} 
                            title="Edit Product Details"
                          >
                            <Edit size={15} />
                          </button>
                          <button 
                            onClick={() => handleDeleteProduct(p.id)} 
                            style={{ color: '#ef4444', padding: '0.2rem', cursor: 'pointer' }} 
                            title="Delete Product"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Edit Product Modal */}
              {editingProduct && (
                <div className="modal-backdrop" onClick={() => setEditingProduct(null)}>
                  <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ background: '#ffffff', padding: '1.75rem', borderRadius: '12px', width: '100%', maxWidth: '650px', maxHeight: '90vh', overflowY: 'auto', border: '1px solid var(--border-color)', boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Edit Product #{editingProduct.id}</h3>
                      <button onClick={() => setEditingProduct(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                        <X size={20} />
                      </button>
                    </div>

                    <form onSubmit={handleUpdateProduct} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      
                      <div style={{ gridColumn: 'span 2' }}>
                        <label style={adminLabelStyle}>PRODUCT TITLE *</label>
                        <input 
                          type="text" 
                          required 
                          value={editingProduct.title} 
                          onChange={(e) => setEditingProduct({...editingProduct, title: e.target.value})} 
                          style={adminInputStyle} 
                        />
                      </div>

                      <div>
                        <label style={adminLabelStyle}>ASSIGN COLLECTION *</label>
                        <select 
                          value={editingProduct.category_id} 
                          onChange={(e) => setEditingProduct({...editingProduct, category_id: parseInt(e.target.value)})} 
                          style={adminInputStyle}
                        >
                          {categoriesList.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label style={adminLabelStyle}>PRICE (₹) *</label>
                        <input 
                          type="number" 
                          required 
                          value={editingProduct.price} 
                          onChange={(e) => setEditingProduct({...editingProduct, price: parseFloat(e.target.value)})} 
                          style={adminInputStyle} 
                        />
                      </div>

                      <div>
                        <label style={adminLabelStyle}>ORIGINAL PRICE / MRP (₹)</label>
                        <input 
                          type="number" 
                          value={editingProduct.original_price || ''} 
                          onChange={(e) => setEditingProduct({...editingProduct, original_price: parseFloat(e.target.value)})} 
                          style={adminInputStyle} 
                        />
                      </div>

                      <div>
                        <label style={adminLabelStyle}>STOCK COUNT *</label>
                        <input 
                          type="number" 
                          required 
                          value={editingProduct.stock} 
                          onChange={(e) => setEditingProduct({...editingProduct, stock: parseInt(e.target.value)})} 
                          style={adminInputStyle} 
                        />
                      </div>

                      {/* Sizes Selection Pills */}
                      <div style={{ gridColumn: 'span 2' }}>
                        <label style={adminLabelStyle}>AVAILABLE SIZES *</label>
                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.35rem' }}>
                          {ALL_SIZES.map((size) => {
                            const currentSizes = editingProduct.sizesArray || (editingProduct.sizes ? editingProduct.sizes.split(',') : []);
                            const isSelected = currentSizes.includes(size);
                            return (
                              <button
                                type="button"
                                key={size}
                                onClick={() => {
                                  const updated = isSelected ? currentSizes.filter(s => s !== size) : [...currentSizes, size];
                                  setEditingProduct({ ...editingProduct, sizesArray: updated, sizes: updated.join(',') });
                                }}
                                style={{
                                  padding: '0.45rem 0.85rem',
                                  borderRadius: '4px',
                                  border: '1.5px solid #000000',
                                  background: isSelected ? '#000000' : '#ffffff',
                                  color: isSelected ? '#ffffff' : '#000000',
                                  fontWeight: 800,
                                  fontSize: '0.75rem',
                                  cursor: 'pointer'
                                }}
                              >
                                {size} {isSelected && '✓'}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div style={{ gridColumn: 'span 2' }}>
                        <label style={adminLabelStyle}>PRODUCT PHOTO (URL OR FILE UPLOAD) *</label>
                        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                          <input 
                            type="text" 
                            required 
                            value={editingProduct.image_url} 
                            onChange={(e) => setEditingProduct({...editingProduct, image_url: e.target.value})} 
                            style={{ ...adminInputStyle, flex: 1 }} 
                          />
                          <label className="btn btn-secondary" style={{ padding: '0.5rem 0.85rem', fontSize: '0.75rem', cursor: 'pointer' }}>
                            <Upload size={14} /> Change Photo
                            <input type="file" accept="image/*" onChange={(e) => handleImageFileUpload(e, setEditingProduct)} style={{ display: 'none' }} />
                          </label>
                        </div>
                      </div>

                      <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                        <button type="button" onClick={() => setEditingProduct(null)} className="btn btn-secondary" style={{ padding: '0.6rem 1.25rem' }}>
                          Cancel
                        </button>
                        <button type="submit" className="btn btn-primary" style={{ padding: '0.6rem 1.5rem' }}>
                          Save Changes
                        </button>
                      </div>

                    </form>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* Tab: Collections */}
          {activeTab === 'collections' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>Manage Menswear Collections</h3>
                  <p style={{ fontSize: '0.775rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
                    Add new category collections or remove existing collections from your catalog.
                  </p>
                </div>

                <button onClick={() => setShowAddCategory(!showAddCategory)} className="btn btn-primary" style={{ fontSize: '0.725rem' }}>
                  <Plus size={15} /> {showAddCategory ? 'Cancel' : 'Add New Collection'}
                </button>
              </div>

              {/* Add Collection Form */}
              {showAddCategory && (
                <form onSubmit={handleCreateCategory} style={{ background: '#ffffff', border: '1px solid var(--border-color)', padding: '1.5rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  
                  <div>
                    <label style={adminLabelStyle}>COLLECTION NAME *</label>
                    <input type="text" required value={newCategory.name} onChange={(e) => setNewCategory({...newCategory, name: e.target.value})} style={adminInputStyle} placeholder="e.g. Printed Linen Shirts" />
                  </div>

                  <div>
                    <label style={adminLabelStyle}>DESCRIPTION</label>
                    <input type="text" value={newCategory.description} onChange={(e) => setNewCategory({...newCategory, description: e.target.value})} style={adminInputStyle} placeholder="e.g. Exclusive summer collection drops" />
                  </div>

                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={adminLabelStyle}>COVER IMAGE (URL OR UPLOAD) *</label>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                      <input type="text" required value={newCategory.image_url} onChange={(e) => setNewCategory({...newCategory, image_url: e.target.value})} style={{ ...adminInputStyle, flex: 1 }} placeholder="Image URL..." />
                      <label className="btn btn-secondary" style={{ padding: '0.5rem 0.85rem', fontSize: '0.75rem', cursor: 'pointer' }}>
                        <Upload size={14} /> Upload Cover Image
                        <input type="file" accept="image/*" onChange={(e) => handleImageFileUpload(e, setNewCategory)} style={{ display: 'none' }} />
                      </label>
                    </div>
                  </div>

                  <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                    <button type="submit" className="btn btn-primary" style={{ padding: '0.55rem 1.25rem' }}>
                      Create Collection
                    </button>
                  </div>

                </form>
              )}

              {/* Collections Cards Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.25rem' }}>
                {categoriesList.map((cat) => (
                  <div key={cat.id} style={{ background: '#ffffff', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', overflow: 'hidden', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                    <img src={cat.image_url} alt={cat.name} style={{ width: '100%', height: '140px', objectFit: 'cover' }} />
                    
                    <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#000000', marginBottom: '0.35rem' }}>{cat.name}</h4>
                        <p style={{ fontSize: '0.775rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{cat.description || 'Exclusive menswear collection'}</p>
                      </div>

                      <div style={{ marginTop: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.725rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                          Slug: {cat.slug}
                        </span>

                        <button 
                          onClick={() => handleDeleteCategory(cat.id)}
                          style={{
                            background: '#fef2f2',
                            border: '1px solid #fee2e2',
                            color: '#dc2626',
                            padding: '0.35rem 0.65rem',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: '0.725rem',
                            fontWeight: 800,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            cursor: 'pointer'
                          }}
                          title="Remove Collection"
                        >
                          <Trash2 size={13} /> Remove
                        </button>
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab: Database */}
          {activeTab === 'database' && (
            <div style={{ maxWidth: '640px' }}>
              <div style={{ background: '#ffffff', border: '1px solid var(--border-color)', padding: '1.75rem', borderRadius: 'var(--radius-sm)' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 900, marginBottom: '0.85rem' }}>NEON POSTGRESQL CONNECTED</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Connected live to Neon Cloud PostgreSQL instance.</p>
              </div>
            </div>
          )}

        </div>

      </main>

    </div>
  );
}

const sidebarBtnStyle = (active) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '0.65rem',
  padding: '0.65rem 0.85rem',
  borderRadius: 'var(--radius-sm)',
  fontSize: '0.775rem',
  fontWeight: 800,
  textTransform: 'uppercase',
  background: active ? '#000000' : 'transparent',
  color: active ? '#ffffff' : 'var(--text-secondary)',
  transition: 'all 0.2s',
  textAlign: 'left',
  width: '100%'
});

const adminLabelStyle = {
  display: 'block',
  fontSize: '0.675rem',
  fontWeight: 800,
  color: 'var(--text-secondary)',
  marginBottom: '0.25rem'
};

const adminInputStyle = {
  width: '100%',
  padding: '0.55rem 0.75rem',
  background: '#f9fafb',
  border: '1px solid var(--border-color)',
  borderRadius: 'var(--radius-sm)',
  color: '#000000',
  fontSize: '0.825rem',
  outline: 'none'
};
