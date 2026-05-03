// /src/pages/CartPage.jsx
import React from "react";
import Cart from "../components/Cart";
import "../styles/CartPage.css";

export default function CartPage() {
  return (
    <div className="cart-page">
      <h1 className="page-title">Shopping Cart</h1>
      <Cart />
    </div>
  );
}
