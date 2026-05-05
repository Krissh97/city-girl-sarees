// src/App.jsx — FULL REPLACEMENT
// Add the SareeDetail import and route

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Shop from './pages/Shop';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import ConfirmationPage from './pages/ConfirmationPage';
import SareeDetail from './pages/SareeDetail';   // ← NEW
import AdminPanel from './pages/AdminPanel';
import './styles/global.css';

export default function App() {
  return (
    <CartProvider>
      <Router>
        <Header />
        <Navbar />
        <Routes>
          <Route path="/"              element={<Home />} />
          <Route path="/shop"          element={<Shop />} />
          <Route path="/cart"          element={<CartPage />} />
          <Route path="/checkout"      element={<CheckoutPage />} />
          <Route path="/confirmation"  element={<ConfirmationPage />} />
          <Route path="/saree/:id"     element={<SareeDetail />} />  {/* ← NEW */}
          <Route path="/admin"         element={<AdminPanel />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}
