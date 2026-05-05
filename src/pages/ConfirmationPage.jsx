// src/pages/ConfirmationPage.jsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/ConfirmationPage.css';

export default function ConfirmationPage() {
  const navigate = useNavigate();
  const { state } = useLocation();

  if (!state) { navigate('/'); return null; }

  const { order, waUrl, customer, grandTotal } = state;

  return (
    <div className="confirm-page">

      {/* ── Success icon ── */}
      <div className="confirm-check">✓</div>
      <h1 className="confirm-title">Order Placed!</h1>
      <p className="confirm-subtitle">
        Thank you, <strong>{customer.name}</strong>. Your order of{' '}
        <strong>₹{grandTotal?.toLocaleString('en-IN')}</strong> has been received.
      </p>
      <p className="confirm-orderid">Order ID: {order?.orderId}</p>

      {/* ── The important bit ── */}
      <div className="confirm-whatsapp-card">
        <div className="cw-header">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="#25D366">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
          <span className="cw-header-text">Complete your order on WhatsApp</span>
        </div>

        <p className="cw-instruction">
          Your order details are ready to send. Tap the button below —
          WhatsApp will open with everything pre-filled. Just hit <strong>Send</strong>.
        </p>

        <button className="cw-btn" onClick={() => window.open(waUrl, '_blank')}>
          Open WhatsApp & Send Order →
        </button>

        <div className="cw-steps">
          <div className="cw-step">
            <div className="cw-step-num">1</div>
            <div className="cw-step-text">Tap the button above — WhatsApp opens with your order pre-filled</div>
          </div>
          <div className="cw-step">
            <div className="cw-step-num">2</div>
            <div className="cw-step-text">Press <strong>Send</strong> in WhatsApp</div>
          </div>
          <div className="cw-step">
            <div className="cw-step-num">3</div>
            <div className="cw-step-text">Seller confirms your order and shares payment & delivery details</div>
          </div>
        </div>

        <div className="cw-reply-notice">
          <span className="cw-reply-dot" />
          Seller typically replies within a few hours
        </div>
      </div>

      {/* ── What happens next ── */}
      <div className="confirm-next">
        <div className="confirm-next-title">What happens after you send?</div>
        <div className="confirm-next-items">
          <div className="confirm-next-item">
            <span className="cni-icon">💬</span>
            <div>
              <div className="cni-label">Seller confirms</div>
              <div className="cni-sub">You'll get a WhatsApp reply confirming your saree is available and reserved for you</div>
            </div>
          </div>
          <div className="confirm-next-item">
            <span className="cni-icon">💳</span>
            <div>
              <div className="cni-label">Payment details shared</div>
              <div className="cni-sub">Seller sends UPI / bank details over WhatsApp for you to complete payment</div>
            </div>
          </div>
          <div className="confirm-next-item">
            <span className="cni-icon">📦</span>
            <div>
              <div className="cni-label">Packed & shipped</div>
              <div className="cni-sub">Once payment is received, your saree is packed and the tracking number is shared with you</div>
            </div>
          </div>
        </div>
      </div>

      <button className="confirm-shop-more" onClick={() => navigate('/shop')}>
        Continue Shopping
      </button>

    </div>
  );
}