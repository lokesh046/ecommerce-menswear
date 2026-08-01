import React, { useState } from 'react';
import { X, CheckCircle } from 'lucide-react';

export default function CheckoutModal({ 
  isOpen, 
  onClose, 
  cartItems, 
  onOrderCompleted 
}) {
  const [formData, setFormData] = useState({
    customer_name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
    payment_method: 'UPI'
  });

  const [loading, setLoading] = useState(false);
  const [orderResult, setOrderResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const payload = {
        customer_name: formData.customer_name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        pincode: formData.pincode,
        items: cartItems.map(item => ({
          product_id: item.id,
          product_title: item.title,
          quantity: item.quantity,
          price: item.price,
          size: item.size
        }))
      };

      const res = await fetch('http://localhost:8000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error('Failed to place order. Please check inputs.');
      }

      const data = await res.json();
      setOrderResult(data);
      onOrderCompleted();
    } catch (err) {
      setErrorMsg(err.message || 'Error connecting to server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="animate-fade-in"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '580px',
          maxHeight: '90vh',
          overflowY: 'auto',
          background: '#ffffff',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-sm)',
          padding: '1.75rem',
          position: 'relative'
        }}
      >
        <button 
          onClick={onClose}
          style={{ position: 'absolute', top: '1rem', right: '1rem', color: 'var(--text-secondary)' }}
        >
          <X size={20} />
        </button>

        {orderResult ? (
          /* Order Confirmation Screen */
          <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
            <CheckCircle size={52} style={{ color: '#000000', margin: '0 auto 1rem auto' }} />
            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#000000' }}>ORDER CONFIRMED</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '0.4rem 0 1.25rem 0' }}>
              Thank you for shopping with Snipes Menswear.
            </p>

            <div style={{ background: '#f8f9fa', padding: '1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', margin: '1rem 0' }}>
              <div style={{ fontSize: '0.675rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 800 }}>YOUR TRACKING ID</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#000000', letterSpacing: '0.08em', marginTop: '0.25rem' }}>
                {orderResult.tracking_code}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                Express Shipping: <strong>3-5 Business Days (Delhivery Express)</strong>
              </div>
            </div>

            <button 
              onClick={onClose}
              className="btn btn-primary"
              style={{ padding: '0.75rem 2rem', marginTop: '0.75rem' }}
            >
              CONTINUE SHOPPING
            </button>
          </div>
        ) : (
          /* Checkout Form */
          <div>
            <div style={{ marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 900 }}>EXPRESS CHECKOUT</h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                TOTAL AMOUNT: <strong style={{ color: '#000000' }}>₹{subtotal.toLocaleString('en-IN')}</strong>
              </p>
            </div>

            {errorMsg && (
              <div style={{ background: '#fef2f2', border: '1px solid #f87171', color: '#991b1b', padding: '0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.825rem', marginBottom: '1rem' }}>
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                <div>
                  <label style={labelStyle}>FULL NAME *</label>
                  <input 
                    type="text" required placeholder="e.g. Rahul Sharma"
                    value={formData.customer_name}
                    onChange={(e) => setFormData({...formData, customer_name: e.target.value})}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>EMAIL ADDRESS *</label>
                  <input 
                    type="email" required placeholder="rahul@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    style={inputStyle}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                <div>
                  <label style={labelStyle}>PHONE NUMBER *</label>
                  <input 
                    type="tel" required placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>PINCODE *</label>
                  <input 
                    type="text" required placeholder="600001"
                    value={formData.pincode}
                    onChange={(e) => setFormData({...formData, pincode: e.target.value})}
                    style={inputStyle}
                  />
                </div>
              </div>

              <div>
                <label style={labelStyle}>STREET ADDRESS *</label>
                <input 
                  type="text" required placeholder="Flat No., Street Name, Area"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>CITY *</label>
                <input 
                  type="text" required placeholder="e.g. Chennai / Mumbai"
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  style={inputStyle}
                />
              </div>

              {/* Payment Option */}
              <div>
                <label style={labelStyle}>PAYMENT METHOD</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                  {['UPI', 'Card', 'COD'].map((method) => (
                    <button
                      type="button"
                      key={method}
                      onClick={() => setFormData({...formData, payment_method: method})}
                      style={{
                        padding: '0.55rem',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.725rem',
                        fontWeight: 800,
                        border: formData.payment_method === method ? '2px solid #000000' : '1px solid var(--border-color)',
                        background: formData.payment_method === method ? '#000000' : '#ffffff',
                        color: formData.payment_method === method ? '#ffffff' : '#000000'
                      }}
                    >
                      {method === 'UPI' ? 'INSTANT UPI' : method === 'COD' ? 'CASH ON DELIVERY' : 'CARD'}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="btn btn-primary"
                style={{ padding: '0.8rem', marginTop: '0.4rem' }}
              >
                {loading ? 'PROCESSING...' : `PLACE ORDER — ₹${subtotal.toLocaleString('en-IN')}`}
              </button>
            </form>

          </div>
        )}

      </div>
    </div>
  );
}

const labelStyle = {
  display: 'block',
  fontSize: '0.675rem',
  fontWeight: 800,
  letterSpacing: '0.04em',
  color: 'var(--text-secondary)',
  marginBottom: '0.25rem'
};

const inputStyle = {
  width: '100%',
  padding: '0.55rem 0.75rem',
  background: '#f9fafb',
  border: '1px solid var(--border-color)',
  borderRadius: 'var(--radius-sm)',
  color: '#000000',
  fontSize: '0.825rem',
  outline: 'none'
};
