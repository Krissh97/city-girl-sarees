// /src/components/Checkout.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { SAREES } from "../data/sarees";
import { submitOrder, buildWhatsAppUrl } from "../utils/orderService";
import "../styles/Checkout.css";

export default function Checkout() {
  const { cart, grandTotal, dispatch } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "", phone: "", address: "", notes: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.phone.trim()) e.phone = "Phone is required";
    else if (!/^[+\d\s-]{10,15}$/.test(form.phone)) e.phone = "Enter a valid phone number";
    if (!form.address.trim()) e.address = "Address is required";
    return e;
  }

  async function handleSubmit() {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    try {
      const order = await submitOrder(form, cart, grandTotal);
      const waUrl = buildWhatsAppUrl(form, cart, grandTotal);
      dispatch({ type: "CLEAR_CART" });
      // Pass data to confirmation page via state
      navigate("/confirmation", { state: { order, waUrl, customer: form } });
    } catch (err) {
      console.error("Order error:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="checkout-form">
      {/* Order summary mini */}
      <div className="order-summary-mini">
        <h4>Order Summary</h4>
        {cart.map((c) => {
          const s = SAREES.find((x) => x.id === c.id);
          return s ? (
            <div key={c.id} className="summary-item">
              <span>{s.name} × {c.qty}</span>
              <span>₹{(s.price * c.qty).toLocaleString("en-IN")}</span>
            </div>
          ) : null;
        })}
        <div className="summary-total-row">
          <span>Total</span>
          <span>₹{grandTotal.toLocaleString("en-IN")}</span>
        </div>
      </div>

      {/* Delivery details */}
      <div className="form-group">
        <label className="form-label">Full Name *</label>
        <input
          className={`form-input${errors.name ? " error" : ""}`}
          type="text"
          placeholder="Your full name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        {errors.name && <span className="field-error">{errors.name}</span>}
      </div>

      <div className="form-group">
        <label className="form-label">Phone Number *</label>
        <input
          className={`form-input${errors.phone ? " error" : ""}`}
          type="tel"
          placeholder="+91 9876543210"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        {errors.phone && <span className="field-error">{errors.phone}</span>}
      </div>

      <div className="form-group">
        <label className="form-label">Delivery Address *</label>
        <textarea
          className={`form-input${errors.address ? " error" : ""}`}
          placeholder="House no, Street, City, State, PIN code"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
          rows={4}
        />
        {errors.address && <span className="field-error">{errors.address}</span>}
      </div>

      <div className="form-group">
        <label className="form-label">Special Instructions</label>
        <input
          className="form-input"
          type="text"
          placeholder="Any notes for the seller (optional)"
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
        />
      </div>

      <button
        className="place-order-btn"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? "Placing Order..." : "Place Order & Notify Seller via WhatsApp"}
      </button>

      {/* Payment placeholder — wire up Razorpay/Stripe here */}
      <div className="payment-placeholder">
        <div className="ph-icon">💳</div>
        <strong>Payment Gateway</strong>
        <p>Razorpay / Stripe integration coming soon</p>
        {/* TODO: import RazorpayButton from './RazorpayButton' */}
        {/* TODO: import StripeCheckout from './StripeCheckout' */}
      </div>
    </div>
  );
}
