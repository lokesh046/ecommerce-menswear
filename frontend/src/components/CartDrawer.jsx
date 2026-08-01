import React from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, Truck } from 'lucide-react';

export default function CartDrawer({ 
  isOpen, 
  onClose, 
  cartItems, 
  onUpdateQuantity, 
  onRemoveItem, 
  onProceedToCheckout 
}) {
  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const freeShippingThreshold = 1999;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const shippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  return (
    <div className="drawer-backdrop" onClick={onClose}>
      <div className="drawer-content" onClick={(e) => e.stopPropagation()}>
        
        {/* Drawer Header */}
        <div style={{ padding: '1.1rem 1.25rem', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShoppingBag size={18} style={{ color: '#000000' }} />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, letterSpacing: '0.02em', color: '#000000' }}>YOUR BAG</h3>
            <span style={{ fontSize: '0.775rem', color: 'var(--text-secondary)' }}>({cartItems.length} ITEMS)</span>
          </div>
          <button onClick={onClose} style={{ color: 'var(--text-secondary)' }}>
            <X size={20} />
          </button>
        </div>

        {/* Free Shipping Progress Bar */}
        <div style={{ background: '#f8f9fa', padding: '0.85rem 1.25rem', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.725rem', fontWeight: 800, color: '#000000', marginBottom: '0.35rem', textTransform: 'uppercase' }}>
            <Truck size={14} />
            {remainingForFreeShipping === 0 
              ? <span>UNLOCKED FREE SHIPPING</span>
              : <span>ADD ₹{remainingForFreeShipping.toLocaleString('en-IN')} MORE FOR FREE SHIPPING</span>
            }
          </div>
          <div style={{ width: '100%', height: '4px', background: '#e5e7eb', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{ width: `${shippingProgress}%`, height: '100%', background: '#000000', transition: 'width 0.3s' }} />
          </div>
        </div>

        {/* Cart Item List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {cartItems.length === 0 ? (
            <div style={{ margin: 'auto', textAlign: 'center', color: 'var(--text-secondary)' }}>
              <ShoppingBag size={44} style={{ opacity: 0.3, marginBottom: '0.75rem' }} />
              <h4 style={{ color: '#000000' }}>YOUR BAG IS EMPTY</h4>
              <p style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>Explore our latest drops to build your look.</p>
            </div>
          ) : (
            cartItems.map((item, index) => (
              <div 
                key={`${item.id}-${item.size}-${index}`}
                style={{
                  display: 'flex',
                  gap: '0.85rem',
                  background: '#f9fafb',
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-color)'
                }}
              >
                <img 
                  src={item.image_url} 
                  alt={item.title}
                  style={{ width: '60px', height: '80px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
                />

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h4 style={{ fontSize: '0.825rem', color: '#000000', lineHeight: 1.3, fontWeight: 800 }}>{item.title}</h4>
                      <span className="badge badge-black" style={{ marginTop: '0.25rem', fontSize: '0.625rem' }}>
                        SIZE: {item.size}
                      </span>
                    </div>
                    <button 
                      onClick={() => onRemoveItem(index)}
                      style={{ color: 'var(--text-muted)' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.4rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', background: '#ffffff', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)' }}>
                      <button 
                        onClick={() => onUpdateQuantity(index, item.quantity - 1)}
                        style={{ padding: '0.2rem 0.45rem', color: '#000000', fontWeight: 700 }}
                      >
                        -
                      </button>
                      <span style={{ padding: '0 0.45rem', fontSize: '0.775rem', fontWeight: 800 }}>{item.quantity}</span>
                      <button 
                        onClick={() => onUpdateQuantity(index, item.quantity + 1)}
                        style={{ padding: '0.2rem 0.45rem', color: '#000000', fontWeight: 700 }}
                      >
                        +
                      </button>
                    </div>

                    <span style={{ fontWeight: 900, color: '#000000', fontSize: '0.875rem' }}>
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

              </div>
            ))
          )}
        </div>

        {/* Footer Checkout Summary */}
        {cartItems.length > 0 && (
          <div style={{ padding: '1.1rem 1.25rem', borderTop: '1px solid var(--border-color)', background: '#ffffff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 700 }}>
              <span>SUBTOTAL</span>
              <span>₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: '#000000', fontSize: '1.05rem', fontWeight: 900, textTransform: 'uppercase' }}>
              <span>TOTAL AMOUNT</span>
              <span>₹{subtotal.toLocaleString('en-IN')}</span>
            </div>

            <button 
              onClick={onProceedToCheckout}
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.8rem' }}
            >
              PROCEED TO CHECKOUT <ArrowRight size={16} />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
