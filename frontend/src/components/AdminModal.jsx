import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, DollarSign, Package, ShoppingBag, AlertTriangle, Plus, Trash2, Edit, RefreshCw } from 'lucide-react';

export default function AdminModal({ isOpen, onClose }) {
  const [token, setToken] = useState(localStorage.getItem('admin_token') || null);
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [loginError, setLoginError] = useState('');

  const [activeTab, setActiveTab] = useState('products'); // 'products' | 'orders'
  const [stats, setStats] = useState({ total_revenue: 0, total_orders: 0, total_products: 0, low_stock_products: 0 });
  const [productsList, setProductsList] = useState([]);
  const [ordersList, setOrdersList] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);

  // New product form modal state inside admin
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({
    title: '',
    slug: '',
    category_id: 1,
    price: 1499,
    original_price: 2499,
    badge: 'New Drop',
    fabric: '100% Cotton',
    fit: 'Regular Fit',
    description: 'Modern luxury fit menswear piece.',
    image_url: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&q=80&w=800',
    stock: 40
  });

  useEffect(() => {
    if (isOpen && token) {
      fetchAdminData();
    }
  }, [isOpen, token]);

  const fetchAdminData = async () => {
    try {
      const [sRes, pRes, oRes, cRes] = await Promise.all([
        fetch('http://localhost:8000/api/admin/stats'),
        fetch('http://localhost:8000/api/products'),
        fetch('http://localhost:8000/api/orders'),
        fetch('http://localhost:8000/api/categories')
      ]);

      if (sRes.ok) setStats(await sRes.json());
      if (pRes.ok) setProductsList(await pRes.json());
      if (oRes.ok) setOrdersList(await oRes.json());
      if (cRes.ok) setCategoriesList(await cRes.json());
    } catch (err) {
      console.error('Error fetching admin stats:', err);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await fetch('http://localhost:8000/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (!res.ok) {
        throw new Error('Invalid credentials');
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
    localStorage.removeItem('admin_token');
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:8000/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct)
      });
      if (res.ok) {
        setShowAddProduct(false);
        fetchAdminData();
      }
    } catch (err) {
      console.error('Error creating product:', err);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await fetch(`http://localhost:8000/api/products/${id}`, { method: 'DELETE' });
      fetchAdminData();
    } catch (err) {
      console.error('Error deleting product:', err);
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await fetch(`http://localhost:8000/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      fetchAdminData();
    } catch (err) {
      console.error('Error updating order status:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="glass animate-fade-in"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '950px',
          maxHeight: '90vh',
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative'
        }}
      >
        {/* Header */}
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#0d111a' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={24} style={{ color: '#34d399' }} />
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Snipes Admin Control Center</h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {token && (
              <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}>
                Logout
              </button>
            )}
            <button onClick={onClose} style={{ color: 'var(--text-secondary)' }}>
              <X size={22} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
          {!token ? (
            /* Login View */
            <div style={{ maxWidth: '380px', margin: '3rem auto', textAlign: 'center' }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Admin Authentication</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                Sign in to manage catalog, stock levels, and customer orders.
              </p>

              {loginError && (
                <div style={{ background: 'rgba(244,63,94,0.15)', color: '#fb7185', padding: '0.65rem', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                  {loginError}
                </div>
              )}

              <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left' }}>
                <div>
                  <label style={adminLabelStyle}>Username</label>
                  <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} style={adminInputStyle} />
                </div>
                <div>
                  <label style={adminLabelStyle}>Password</label>
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={adminInputStyle} />
                </div>
                <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem', marginTop: '0.5rem' }}>
                  Sign In as Admin
                </button>
              </form>
            </div>
          ) : (
            /* Dashboard View */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* Metric Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div style={metricCardStyle}>
                  <DollarSign size={24} style={{ color: 'var(--accent-gold)' }} />
                  <div>
                    <div style={metricTitleStyle}>Total Revenue</div>
                    <div style={metricValueStyle}>₹{stats.total_revenue.toLocaleString('en-IN')}</div>
                  </div>
                </div>

                <div style={metricCardStyle}>
                  <ShoppingBag size={24} style={{ color: '#38bdf8' }} />
                  <div>
                    <div style={metricTitleStyle}>Total Orders</div>
                    <div style={metricValueStyle}>{stats.total_orders}</div>
                  </div>
                </div>

                <div style={metricCardStyle}>
                  <Package size={24} style={{ color: '#34d399' }} />
                  <div>
                    <div style={metricTitleStyle}>Products</div>
                    <div style={metricValueStyle}>{stats.total_products}</div>
                  </div>
                </div>

                <div style={metricCardStyle}>
                  <AlertTriangle size={24} style={{ color: '#fb7185' }} />
                  <div>
                    <div style={metricTitleStyle}>Low Stock Alert</div>
                    <div style={metricValueStyle}>{stats.low_stock_products}</div>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                <button 
                  onClick={() => setActiveTab('products')}
                  style={{
                    padding: '0.5rem 1rem',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    color: activeTab === 'products' ? 'var(--accent-gold)' : 'var(--text-secondary)',
                    borderBottom: activeTab === 'products' ? '2px solid var(--accent-gold)' : 'none'
                  }}
                >
                  Products Management ({productsList.length})
                </button>

                <button 
                  onClick={() => setActiveTab('orders')}
                  style={{
                    padding: '0.5rem 1rem',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    color: activeTab === 'orders' ? 'var(--accent-gold)' : 'var(--text-secondary)',
                    borderBottom: activeTab === 'orders' ? '2px solid var(--accent-gold)' : 'none'
                  }}
                >
                  Orders Management ({ordersList.length})
                </button>

                <button onClick={fetchAdminData} style={{ marginLeft: 'auto', color: 'var(--text-secondary)' }} title="Refresh Data">
                  <RefreshCw size={18} />
                </button>
              </div>

              {/* Tab 1: Products */}
              {activeTab === 'products' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h4>Catalog Items</h4>
                    <button onClick={() => setShowAddProduct(true)} className="btn btn-primary" style={{ padding: '0.4rem 0.85rem', fontSize: '0.85rem' }}>
                      <Plus size={16} /> Add Product
                    </button>
                  </div>

                  {/* Add Product Form Modal */}
                  {showAddProduct && (
                    <form onSubmit={handleCreateProduct} style={{ background: 'rgba(255,255,255,0.04)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                      <div>
                        <label style={adminLabelStyle}>Title</label>
                        <input type="text" required value={newProduct.title} onChange={(e) => setNewProduct({...newProduct, title: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-')})} style={adminInputStyle} />
                      </div>
                      <div>
                        <label style={adminLabelStyle}>Price (₹)</label>
                        <input type="number" required value={newProduct.price} onChange={(e) => setNewProduct({...newProduct, price: parseFloat(e.target.value)})} style={adminInputStyle} />
                      </div>
                      <div>
                        <label style={adminLabelStyle}>Badge</label>
                        <input type="text" value={newProduct.badge} onChange={(e) => setNewProduct({...newProduct, badge: e.target.value})} style={adminInputStyle} />
                      </div>
                      <div>
                        <label style={adminLabelStyle}>Image URL</label>
                        <input type="text" required value={newProduct.image_url} onChange={(e) => setNewProduct({...newProduct, image_url: e.target.value})} style={adminInputStyle} />
                      </div>
                      <div style={{ gridColumn: 'span 2', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                        <button type="button" onClick={() => setShowAddProduct(false)} className="btn btn-secondary" style={{ padding: '0.4rem 0.85rem' }}>Cancel</button>
                        <button type="submit" className="btn btn-primary" style={{ padding: '0.4rem 0.85rem' }}>Save Product</button>
                      </div>
                    </form>
                  )}

                  {/* Products Table */}
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                        <th style={{ padding: '0.75rem' }}>Image</th>
                        <th style={{ padding: '0.75rem' }}>Title</th>
                        <th style={{ padding: '0.75rem' }}>Price</th>
                        <th style={{ padding: '0.75rem' }}>Stock</th>
                        <th style={{ padding: '0.75rem' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productsList.map((p) => (
                        <tr key={p.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                          <td style={{ padding: '0.5rem' }}>
                            <img src={p.image_url} alt={p.title} style={{ width: '40px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                          </td>
                          <td style={{ padding: '0.5rem', fontWeight: 600, color: '#fff' }}>{p.title}</td>
                          <td style={{ padding: '0.5rem', color: 'var(--accent-gold)', fontWeight: 700 }}>₹{p.price.toLocaleString('en-IN')}</td>
                          <td style={{ padding: '0.5rem' }}>
                            <span className={p.stock <= 25 ? "badge badge-rose" : "badge badge-emerald"}>
                              {p.stock} in stock
                            </span>
                          </td>
                          <td style={{ padding: '0.5rem' }}>
                            <button onClick={() => handleDeleteProduct(p.id)} style={{ color: '#fb7185' }}>
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Tab 2: Orders */}
              {activeTab === 'orders' && (
                <div>
                  <h4>Customer Orders</h4>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left', marginTop: '1rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                        <th style={{ padding: '0.75rem' }}>Tracking ID</th>
                        <th style={{ padding: '0.75rem' }}>Customer</th>
                        <th style={{ padding: '0.75rem' }}>Total</th>
                        <th style={{ padding: '0.75rem' }}>Status</th>
                        <th style={{ padding: '0.75rem' }}>Update Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ordersList.map((o) => (
                        <tr key={o.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                          <td style={{ padding: '0.5rem', fontWeight: 800, color: 'var(--accent-gold)' }}>{o.tracking_code}</td>
                          <td style={{ padding: '0.5rem' }}>
                            <div style={{ color: '#fff', fontWeight: 600 }}>{o.customer_name}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{o.phone} | {o.city}</div>
                          </td>
                          <td style={{ padding: '0.5rem', fontWeight: 700 }}>₹{o.total_amount.toLocaleString('en-IN')}</td>
                          <td style={{ padding: '0.5rem' }}>
                            <span className="badge badge-cyan">{o.status}</span>
                          </td>
                          <td style={{ padding: '0.5rem' }}>
                            <select 
                              value={o.status}
                              onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                              style={{ padding: '0.25rem 0.5rem', background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '0.8rem' }}
                            >
                              <option value="Order Placed">Order Placed</option>
                              <option value="Processing">Processing</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Out for Delivery">Out for Delivery</option>
                              <option value="Delivered">Delivered</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

            </div>
          )}
        </div>

      </div>
    </div>
  );
}

const metricCardStyle = {
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid var(--border-color)',
  borderRadius: 'var(--radius-md)',
  padding: '1rem',
  display: 'flex',
  alignItems: 'center',
  gap: '1rem'
};

const metricTitleStyle = {
  fontSize: '0.75rem',
  color: 'var(--text-secondary)',
  textTransform: 'uppercase',
  letterSpacing: '0.05em'
};

const metricValueStyle = {
  fontSize: '1.25rem',
  fontWeight: 800,
  color: '#fff',
  marginTop: '0.15rem'
};

const adminLabelStyle = {
  display: 'block',
  fontSize: '0.75rem',
  fontWeight: 700,
  color: 'var(--text-secondary)',
  marginBottom: '0.25rem'
};

const adminInputStyle = {
  width: '100%',
  padding: '0.5rem 0.75rem',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid var(--border-color)',
  borderRadius: 'var(--radius-md)',
  color: '#fff',
  fontSize: '0.85rem',
  outline: 'none'
};
