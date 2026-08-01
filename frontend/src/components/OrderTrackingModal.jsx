import React, { useState } from 'react';
import { X, PackageCheck, CheckCircle2 } from 'lucide-react';

const STATUS_STEPS = ["Order Placed", "Processing", "Shipped", "Out for Delivery", "Delivered"];

export default function OrderTrackingModal({ isOpen, onClose }) {
  const [trackingCode, setTrackingCode] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!trackingCode.trim()) return;

    setLoading(true);
    setErrorMsg('');
    setOrder(null);

    try {
      const res = await fetch(`http://localhost:8000/api/orders/track/${trackingCode.trim()}`);
      if (!res.ok) {
        throw new Error('Tracking ID not found. Please check your code.');
      }
      const data = await res.json();
      setOrder(data);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStepIndex = (status) => {
    const idx = STATUS_STEPS.indexOf(status);
    return idx >= 0 ? idx : 0;
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="animate-fade-in"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '540px',
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

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
          <PackageCheck size={24} style={{ color: '#000000' }} />
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 900 }}>DELHIVERY EXPRESS TRACKING</h2>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Track your Snipes Menswear parcel in real-time</p>
          </div>
        </div>

        {/* Search Input */}
        <form onSubmit={handleTrack} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <input 
            type="text" 
            placeholder="ENTER TRACKING ID (e.g. SNP-8346ED80)"
            value={trackingCode}
            onChange={(e) => setTrackingCode(e.target.value)}
            style={{
              flex: 1,
              padding: '0.65rem 0.85rem',
              background: '#f9fafb',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)',
              color: '#000000',
              fontWeight: 700,
              fontSize: '0.8rem',
              outline: 'none'
            }}
          />
          <button type="submit" className="btn btn-primary" style={{ padding: '0.65rem 1.1rem' }}>
            {loading ? 'SEARCHING...' : 'TRACK'}
          </button>
        </form>

        {errorMsg && (
          <div style={{ background: '#fef2f2', border: '1px solid #f87171', color: '#991b1b', padding: '0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.825rem', marginBottom: '1rem' }}>
            {errorMsg}
          </div>
        )}

        {/* Tracking Details */}
        {order && (
          <div style={{ background: '#f9fafb', padding: '1.1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '0.85rem' }}>
              <div>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>CUSTOMER</span>
                <div style={{ fontWeight: 800, color: '#000000' }}>{order.customer_name}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>TOTAL AMOUNT</span>
                <div style={{ fontWeight: 900, color: '#000000' }}>₹{order.total_amount.toLocaleString('en-IN')}</div>
              </div>
            </div>

            {/* Stepper Timeline */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginTop: '0.85rem' }}>
              {STATUS_STEPS.map((step, idx) => {
                const currentIdx = getStepIndex(order.status);
                const isCompleted = idx <= currentIdx;
                const isCurrent = idx === currentIdx;

                return (
                  <div key={step} style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <div style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: isCompleted ? '#000000' : '#ffffff',
                      color: isCompleted ? '#ffffff' : 'var(--text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 900,
                      border: isCompleted ? '1px solid #000000' : '1px solid var(--border-color)'
                    }}>
                      {isCompleted ? <CheckCircle2 size={15} /> : idx + 1}
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: isCurrent ? 900 : 700, color: isCompleted ? '#000000' : 'var(--text-muted)', fontSize: '0.825rem', textTransform: 'uppercase' }}>
                        {step}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
