import React, { useState, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

export default function WhatsAppWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState('919876543210');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const savedNum = localStorage.getItem('menswear_whatsapp_number');
    if (savedNum) {
      setWhatsappNumber(savedNum);
    }
  }, []);

  const handleStartChat = (e) => {
    e.preventDefault();
    const encodedText = encodeURIComponent(message.trim() || 'Hi 2020 MENS WEAR, I have a question about your menswear collection.');
    const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodedText}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 1000 }}>
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: '#25D366',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(37, 211, 102, 0.45)',
            cursor: 'pointer',
            border: 'none',
            transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
          }}
          className="popout-card"
          title="Chat with us on WhatsApp"
        >
          <MessageCircle size={32} />
        </button>
      )}

      {/* WhatsApp Chat Box Drawer */}
      {isOpen && (
        <div style={{
          width: '340px',
          background: '#ffffff',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.25)',
          border: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          animation: 'fadeInUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}>
          
          {/* Header */}
          <div style={{
            background: '#075E54',
            color: '#ffffff',
            padding: '1.1rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ position: 'relative' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#ffffff', color: '#075E54', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem' }}>
                  2020
                </div>
                <div style={{ position: 'absolute', bottom: 0, right: 0, width: '10px', height: '10px', borderRadius: '50%', background: '#25D366', border: '2px solid #075E54' }} />
              </div>
              <div>
                <h4 style={{ color: '#ffffff', fontSize: '0.9rem', fontWeight: 800 }}>2020 MENS WEAR</h4>
                <span style={{ fontSize: '0.675rem', color: '#e5e7eb', fontWeight: 600 }}>Typically replies instantly</span>
              </div>
            </div>

            <button 
              onClick={() => setIsOpen(false)}
              style={{ color: '#ffffff', opacity: 0.8, cursor: 'pointer', border: 'none', background: 'none' }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Chat Body */}
          <div style={{ padding: '1.25rem', background: '#ece5dd', flex: 1, minHeight: '160px', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{
              alignSelf: 'flex-start',
              background: '#ffffff',
              padding: '0.75rem 1rem',
              borderRadius: '0px 12px 12px 12px',
              maxWidth: '85%',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              fontSize: '0.825rem',
              color: '#111827',
              lineHeight: 1.45
            }}>
              Hi there! 👋 Welcome to <strong>2020 MENS WEAR</strong>.<br />
              How can we help you with sizing, orders, or custom fitting today?
            </div>
          </div>

          {/* Message Input & Action */}
          <form onSubmit={handleStartChat} style={{ padding: '0.85rem', background: '#ffffff', display: 'flex', gap: '0.5rem', borderTop: '1px solid var(--border-color)' }}>
            <input 
              type="text" 
              placeholder="Type your message..." 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={{
                flex: 1,
                padding: '0.6rem 0.85rem',
                borderRadius: '20px',
                border: '1px solid var(--border-color)',
                fontSize: '0.8rem',
                outline: 'none',
                background: '#f9fafb'
              }}
            />
            <button 
              type="submit" 
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: '#25D366',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: 'none',
                cursor: 'pointer',
                flexShrink: 0
              }}
              title="Send to WhatsApp"
            >
              <Send size={16} />
            </button>
          </form>

        </div>
      )}

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
