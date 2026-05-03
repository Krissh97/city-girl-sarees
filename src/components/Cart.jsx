// /src/components/Cart.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import CartItem from "./CartItem";
import "../styles/Cart.css";

export default function Cart() {
  const { cart, cartTotal, shipping, grandTotal } = useCart();
  const navigate = useNavigate();

  if (!cart.length) {
    return (
      <div className="cart-empty">
        <div className="empty-icon">🛒</div>
        <p className="empty-title">Your cart is empty</p>
        <p className="empty-sub">Discover our beautiful saree collection</p>
        <button className="shop-btn" onClick={() => navigate("/shop")}>
          Shop Now
        </button>
      </div>
    );
  }

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
          {cart.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </tbody>
      </table>

      <div className="cart-summary">
        <div className="summary-box">
          <div className="summary-row">
            <span>Subtotal</span>
            <span>₹{cartTotal.toLocaleString("en-IN")}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
          </div>
          {shipping > 0 && (
            <div className="summary-note">
              Add ₹{(1999 - cartTotal).toLocaleString("en-IN")} more for free shipping
            </div>
          )}
          <div className="summary-total">
            <span>Total</span>
            <span>₹{grandTotal.toLocaleString("en-IN")}</span>
          </div>
          <button
            className="checkout-btn"
            onClick={() => navigate("/checkout")}
          >
            Proceed to Checkout →
          </button>
          <p className="secure-note">🔒 Secure checkout · Easy returns</p>
        </div>
      </div>
    </div>
  );
}
