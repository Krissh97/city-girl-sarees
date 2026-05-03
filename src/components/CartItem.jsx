// /src/components/CartItem.jsx
import React from "react";
import { useCart } from "../context/CartContext";
import { SAREES } from "../data/sarees";
import "../styles/CartItem.css";

export default function CartItem({ item }) {
  const { dispatch } = useCart();
  const saree = SAREES.find((s) => s.id === item.id);
  if (!saree) return null;

  return (
    <tr className="cart-row">
      <td>
        {saree.imageUrl ? (
          <img className="cart-thumb" src={saree.imageUrl} alt={saree.name} />
        ) : (
          <div className="cart-thumb-placeholder">🥻</div>
        )}
      </td>
      <td>
        <div className="cart-name">{saree.name}</div>
        <div className="cart-sub">{saree.type} · {saree.color} · {saree.size}</div>
      </td>
      <td className="cart-price">₹{saree.price.toLocaleString("en-IN")}</td>
      <td>
        <div className="qty-controls">
          <button
            className="qty-btn"
            onClick={() => dispatch({ type: "UPDATE_QTY", id: saree.id, qty: item.qty - 1 })}
          >−</button>
          <span className="qty-num">{item.qty}</span>
          <button
            className="qty-btn"
            onClick={() => dispatch({ type: "UPDATE_QTY", id: saree.id, qty: item.qty + 1 })}
          >+</button>
        </div>
      </td>
      <td className="cart-subtotal">
        ₹{(saree.price * item.qty).toLocaleString("en-IN")}
      </td>
      <td>
        <button
          className="remove-btn"
          onClick={() => dispatch({ type: "REMOVE_ITEM", id: saree.id })}
          title="Remove"
        >✕</button>
      </td>
    </tr>
  );
}
