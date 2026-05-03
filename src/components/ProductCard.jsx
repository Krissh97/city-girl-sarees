// /src/components/ProductCard.jsx
import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { COLOR_MAP } from "../data/sarees";
import "../styles/ProductCard.css";

export default function ProductCard({ saree, onVideoClick }) {
  const { cart, dispatch } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  const inCart = cart.some((c) => c.id === saree.id);
  const outOfStock = saree.stock <= 0;
  const lowStock = saree.stock > 0 && saree.stock < 5;

  function handleAddToCart() {
    if (outOfStock) return;
    dispatch({ type: "ADD_ITEM", id: saree.id });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1800);
  }

  const badgeClass = `badge badge-${saree.type.toLowerCase()}`;

  return (
    <div className="product-card">
      {/* Image area */}
      <div className="product-img-wrap">
        {saree.imageUrl ? (
          <img
            className="product-img"
            src={saree.imageUrl}
            alt={saree.name}
            onError={(e) => { e.target.style.display = "none"; }}
          />
        ) : (
          <div className="product-img-placeholder">
            <span>🥻</span>
            <span className="placeholder-type">{saree.type}</span>
          </div>
        )}

        <span className={badgeClass}>{saree.type}</span>

        {outOfStock && (
          <div className="oos-overlay">
            <span className="oos-label">Out of Stock</span>
          </div>
        )}

        {saree.videoUrl && (
          <button
            className="video-btn"
            onClick={() => onVideoClick(saree)}
            title="Watch preview"
          >
            ▶
          </button>
        )}

        <div className="color-dot-row">
          <span
            className="color-dot"
            style={{ background: COLOR_MAP[saree.color] || "#aaa" }}
          />
        </div>
      </div>

      {/* Info area */}
      <div className="product-info">
        <div className="product-name">{saree.name}</div>
        <div className="product-meta-line">
          {saree.type} · {saree.color}
        </div>
        <div className="product-price">
          ₹{saree.price.toLocaleString("en-IN")}
        </div>
        <div className="product-tags">
          <span className="tag">{saree.size}</span>
          {outOfStock ? (
            <span className="tag tag-danger">Out of stock</span>
          ) : lowStock ? (
            <span className="tag tag-warn">Only {saree.stock} left</span>
          ) : (
            <span className="tag">{saree.stock} in stock</span>
          )}
        </div>
        <button
          className={`add-cart-btn${justAdded ? " added" : ""}`}
          onClick={handleAddToCart}
          disabled={outOfStock}
        >
          {outOfStock ? "Out of Stock" : justAdded ? "✓ Added!" : inCart ? "✓ In Cart" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
