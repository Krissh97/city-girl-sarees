// src/context/CartContext.jsx
import React, { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

function cartReducer(state, action) {
  switch (action.type) {

    case 'ADD_ITEM': {
      const existing = state.find(c => c.id === action.id);
      if (existing) {
        return state.map(c =>
          c.id === action.id ? { ...c, qty: c.qty + 1 } : c
        );
      }
      return [...state, { id: action.id, qty: 1 }];
    }

    case 'REMOVE_ITEM':
      return state.filter(c => c.id !== action.id);

    case 'UPDATE_QTY':
      return state.map(c =>
        c.id === action.id
          ? { ...c, qty: Math.max(1, action.qty) }
          : c
      );

    case 'CLEAR_CART':
      return [];

    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(
    cartReducer,
    [],
    () => {
      try { return JSON.parse(localStorage.getItem('cg_cart') || '[]'); }
      catch { return []; }
    }
  );

  useEffect(() => {
    localStorage.setItem('cg_cart', JSON.stringify(cart));
  }, [cart]);

  // These are calculated in Cart.jsx now since we fetch saree data there
  const cartCount = cart.reduce((sum, c) => sum + c.qty, 0);

  return (
    <CartContext.Provider value={{ cart, dispatch, cartCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
