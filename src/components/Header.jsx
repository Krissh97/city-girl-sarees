// /src/components/Header.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "../styles/Header.css";

export default function Header() {
  const { cartCount } = useCart();

  return (
    <header className="header">
      <div className="header-brand">
        <Link to="/" className="header-logo">
          <span className="logo-city">City</span> Girl
        </Link>
        <div className="header-tagline">Handcrafted Elegance</div>
      </div>
      <div className="header-right">
        <Link to="/cart" className="cart-btn">
          🛒 Cart
          {cartCount > 0 && (
            <span className="cart-badge">{cartCount}</span>
          )}
        </Link>
      </div>
    </header>
  );
}
