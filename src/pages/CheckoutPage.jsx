// /src/pages/CheckoutPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import Checkout from "../components/Checkout";
import "../styles/CheckoutPage.css";

export default function CheckoutPage() {
  const { cart } = useCart();
  const navigate = useNavigate();

  if (!cart.length) {
    navigate("/cart");
    return null;
  }

  return (
    <div className="checkout-page">
      <h1 className="page-title">Checkout</h1>
      <Checkout />
    </div>
  );
}
