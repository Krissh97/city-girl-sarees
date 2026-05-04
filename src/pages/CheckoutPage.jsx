// src/components/Checkout.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { buildWhatsAppUrl, submitOrder } from '../utils/orderService';
import '../styles/Checkout.css';

export default function Checkout() {
  const { cart, dispatch } = useCart();
  const navigate = useNavigate();

  const [sareeData, setSareeData] = useState({});  // _id → saree
  const [form, setForm]   = useState({ name:'', phone:'', address:'', notes:'' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Fetch all sarees to get prices/names for cart items
  useEffect(() => {
    if (!cart.length) return;
    fetch(`${process.env.REACT_APP_API_URL}/api/sarees`)
      .then(r => r.json())
      .then(data => {
        if (!Array.isArray(data)) return;
        const map = {};
        data.forEach(s => { map[s._id] = s; });
        setSareeData(map);
      })
      .catch(e => console.error('Failed to load saree data:', e));
  }, [cart]);

  // Calculate totals from live data
  const cartTotal  = cart.reduce((sum, c) => {
    const s = sareeData[c.id];
    return sum + (s ? s.price * c.qty : 0);
  }, 0);
  const shipping   = cartTotal > 0 && cartTotal < 1999 ? 99 : 0;
  const grandTotal = cartTotal + shipping;

  function validate() {
    const e = {};
    if (!form.name.trim())    e.name    = 'Name is required';
    if (!form.phone.trim())   e.phone   = 'Phone is required';
    if (!form.address.trim()) e.address = 'Address is required';
    return e;
  }

  async function handleSubmit() {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    try {
      // Build items array using live saree data
      const items = cart.map(c => {
        const s = sareeData[c.id];
        return {
          sareeId:  c.id,
          sku:      s?.sku,
          name:     s?.name,
          type:     s?.type,
          color:    s?.color,
          size:     s?.size,
          price:    s?.price,
          qty:      c.qty,
          subtotal: (s?.price || 0) * c.qty,
          imageUrl: s?.imageUrls?.[0] || '',
        };
      });

      const orderPayload = {
        customer: form,
        items,
        pricing: { subtotal: cartTotal, shipping, grandTotal },
      };

      // Submit to backend
      const order = await submitOrder(orderPayload);

      // Build WhatsApp URL
      const waUrl = buildWhatsAppUrl(form, cart, sareeData, grandTotal);

      dispatch({ type: 'CLEAR_CART' });
      navigate('/confirmation', {
        state: { order, waUrl, customer: form, grandTotal },
      });
    } catch (err) {
      console.error('Order error:', err);
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  return (
    <div className="checkout-form">
      {/* Order summary */}
      <div className="order-summary-mini">
        <h4>Order Summary</h4>
        {cart.map(c => {
          const s = sareeData[c.id];
          if (!s) return null;
          return (
            <div key={c.id} className="summary-item">
              <span>{s.name} × {c.qty}</span>
              <span>₹{(s.price * c.qty).toLocaleString('en-IN')}</span>
            </div>
          );
        })}
        <div className="summary-total-row">
          <span>Total</span>
          <span>₹{grandTotal.toLocaleString('en-IN')}</span>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Full Name *</label>
        <input className={`form-input${errors.name ? ' error' : ''}`}
          type="text" placeholder="Your full name"
          value={form.name} onChange={e => set('name', e.target.value)} />
        {errors.name && <span className="field-error">{errors.name}</span>}
      </div>

      <div className="form-group">
        <label className="form-label">Phone Number *</label>
        <input className={`form-input${errors.phone ? ' error' : ''}`}
          type="tel" placeholder="+91 9876543210"
          value={form.phone} onChange={e => set('phone', e.target.value)} />
        {errors.phone && <span className="field-error">{errors.phone}</span>}
      </div>

      <div className="form-group">
        <label className="form-label">Delivery Address *</label>
        <textarea className={`form-input${errors.address ? ' error' : ''}`}
          placeholder="House no, Street, City, State, PIN code"
          value={form.address} onChange={e => set('address', e.target.value)}
          rows={4} />
        {errors.address && <span className="field-error">{errors.address}</span>}
      </div>

      <div className="form-group">
        <label className="form-label">Special Instructions</label>
        <input className="form-input" type="text"
          placeholder="Any notes for the seller (optional)"
          value={form.notes} onChange={e => set('notes', e.target.value)} />
      </div>

      <button className="place-order-btn" onClick={handleSubmit} disabled={loading}>
        {loading ? 'Placing Order…' : 'Place Order & Notify Seller via WhatsApp'}
      </button>

      <div className="payment-placeholder">
        <div className="ph-icon">💳</div>
        <strong>Payment Gateway</strong>
        <p>Razorpay / Stripe integration coming soon</p>
      </div>
    </div>
  );
}