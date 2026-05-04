// src/components/Cart.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import '../styles/Cart.css';

export default function Cart() {
  const { cart, dispatch } = useCart();
  const navigate = useNavigate();
  const [sareeData, setSareeData] = useState({});  // id → saree object

  // Fetch saree details for every item in cart
  useEffect(() => {
    if (!cart.length) return;
    Promise.all(
      cart.map(c =>
        fetch(`${process.env.REACT_APP_API_URL}/api/sarees`)
          .then(r => r.json())
      )
    ).then(results => {
      // results[0] is the full saree list — build a map
      const list = results[0];
      if (!Array.isArray(list)) return;
      const map = {};
      list.forEach(s => { map[s._id] = s; });
      setSareeData(map);
    }).catch(() => {});
  }, [cart]);

  if (!cart.length) {
    return (
      <div className="cart-empty">
        <div className="empty-icon">🛒</div>
        <p className="empty-title">Your cart is empty</p>
        <p className="empty-sub">Discover our saree collection</p>
        <button className="shop-btn" onClick={() => navigate('/shop')}>
          Shop Now
        </button>
      </div>
    );
  }

  const cartTotal = cart.reduce((sum, c) => {
    const s = sareeData[c.id];
    return sum + (s ? s.price * c.qty : 0);
  }, 0);
  const shipping   = cartTotal >= 1999 ? 0 : 99;
  const grandTotal = cartTotal + shipping;

  return (
    <div>
      <table className="cart-table">
        <thead>
          <tr>
            <th></th>
            <th>Item</th>
            <th>Price</th>
            <th>Qty</th>
            <th>Subtotal</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {cart.map(item => {
            const s = sareeData[item.id];
            if (!s) return null;
            const primaryImage = s.imageUrls?.[0] || s.imageUrl || '';
            return (
              <tr key={item.id} className="cart-row">
                <td>
                  {primaryImage
                    ? <img className="cart-thumb" src={primaryImage} alt={s.name} />
                    : <div className="cart-thumb-placeholder">🥻</div>
                  }
                </td>
                <td>
                  <div className="cart-name">{s.name}</div>
                  <div className="cart-sub">{s.type} · {s.color} · {s.size}</div>
                </td>
                <td className="cart-price">₹{s.price?.toLocaleString('en-IN')}</td>
                <td>
                  <div className="qty-controls">
                    <button className="qty-btn"
                      onClick={() => dispatch({ type: 'UPDATE_QTY', id: item.id, qty: item.qty - 1 })}>
                      −
                    </button>
                    <span className="qty-num">{item.qty}</span>
                    <button className="qty-btn"
                      onClick={() => dispatch({ type: 'UPDATE_QTY', id: item.id, qty: item.qty + 1 })}>
                      +
                    </button>
                  </div>
                </td>
                <td className="cart-subtotal">
                  ₹{(s.price * item.qty).toLocaleString('en-IN')}
                </td>
                <td>
                  <button className="remove-btn"
                    onClick={() => dispatch({ type: 'REMOVE_ITEM', id: item.id })}>
                    ✕
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="cart-summary">
        <div className="summary-box">
          <div className="summary-row"><span>Subtotal</span><span>₹{cartTotal.toLocaleString('en-IN')}</span></div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
          </div>
          {shipping > 0 && (
            <div className="summary-note">
              Add ₹{(1999 - cartTotal).toLocaleString('en-IN')} more for free shipping
            </div>
          )}
          <div className="summary-total">
            <span>Total</span>
            <span>₹{grandTotal.toLocaleString('en-IN')}</span>
          </div>
          <button className="checkout-btn" onClick={() => navigate('/checkout')}>
            Proceed to Checkout →
          </button>
          <p className="secure-note">🔒 Secure checkout · Easy returns</p>
        </div>
      </div>
    </div>
  );
}
