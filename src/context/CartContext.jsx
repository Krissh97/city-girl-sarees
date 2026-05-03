/**
 * /src/context/CartContext.jsx
 *
 * Global cart state using React Context API.
 * Cart is persisted to localStorage automatically.
 */

import React, { createContext, useContext, useReducer, useEffect } from "react";
import { SAREES } from "../data/sarees";

const CartContext = createContext();

// --- Reducer ---
function cartReducer(state, action) {
  switch (action.type) {
    case "ADD_ITEM": {
      const saree = SAREES.find((s) => s.id === action.id);
      if (!saree || saree.stock <= 0) return state;
      const existing = state.find((c) => c.id === action.id);
      if (existing) {
        if (existing.qty >= saree.stock) return state; // cap at stock
        return state.map((c) =>
          c.id === action.id ? { ...c, qty: c.qty + 1 } : c
        );
      }
      return [...state, { id: action.id, qty: 1 }];
    }
    case "REMOVE_ITEM":
      return state.filter((c) => c.id !== action.id);
    case "UPDATE_QTY": {
      const saree = SAREES.find((s) => s.id === action.id);
      return state.map((c) => {
        if (c.id !== action.id) return c;
        const newQty = Math.min(Math.max(1, action.qty), saree?.stock || 1);
        return { ...c, qty: newQty };
      });
    }
    case "CLEAR_CART":
      return [];
    case "LOAD_CART":
      return action.cart;
    default:
      return state;
  }
}

// --- Provider ---
export function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(
    cartReducer,
    [],
    () => {
      try {
        const saved = localStorage.getItem("cg_cart");
        return saved ? JSON.parse(saved) : [];
      } catch {
        return [];
      }
    }
  );

  // Persist cart to localStorage on every change
  useEffect(() => {
    localStorage.setItem("cg_cart", JSON.stringify(cart));
  }, [cart]);

  // Derived values
  const cartCount = cart.reduce((sum, c) => sum + c.qty, 0);
  const cartTotal = cart.reduce((sum, c) => {
    const s = SAREES.find((x) => x.id === c.id);
    return sum + (s ? s.price * c.qty : 0);
  }, 0);
  const shipping = cartTotal >= 1999 ? 0 : 99;
  const grandTotal = cartTotal + shipping;

  return (
    <CartContext.Provider
      value={{ cart, dispatch, cartCount, cartTotal, shipping, grandTotal }}
    >
      {children}
    </CartContext.Provider>
  );
}

// --- Custom hook ---
export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
