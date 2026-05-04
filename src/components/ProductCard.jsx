// src/components/ProductCard.jsx
import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { COLOR_MAP } from '../data/sarees';
import '../styles/ProductCard.css';

export default function ProductCard({ saree, onVideoClick }) {
  const { cart, dispatch } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const [imgError, setImgError]   = useState(false);

  const inCart     = cart.some(c => c.id === saree.id || c.id === saree._id);
  const outOfStock = saree.stock <= 0;
  const lowStock   = saree.stock > 0 && saree.stock < 5;

  // Support both _id (from MongoDB) and id (from mock data)
  const sareeId = saree._id || saree.id;

  // First image from imageUrls array, or legacy imageUrl string
  const primaryImage = saree.imageUrls?.[0] || saree.imageUrl || '';

  function handleAddToCart() {
    if (outOfStock) return;
    dispatch({ type: 'ADD_ITEM', id: sareeId });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1800);
  }

  const badgeClass = `badge badge-${saree.type?.toLowerCase() || 'other'}`;

  return (
    <div className="product-card">

      {/* ── Image ───────────────────────────────────────── */}
      <div className="product-img-wrap">

        {primaryImage && !imgError ? (
          <img
            className="product-img"
            src={primaryImage}
            alt={saree.name}
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="product-img-placeholder">
            <span className="placeholder-emoji">🥻</span>
            <span className="placeholder-type">{saree.type}</span>
          </div>
        )}

        {/* Hover gradient overlay */}
        <div className="card-overlay" />

        {/* Type badge */}
        <span className={badgeClass}>{saree.type}</span>

        {/* Out of stock */}
        {outOfStock && (
          <div className="oos-overlay">
            <span className="oos-label">Out of Stock</span>
          </div>
        )}

        {/* Video button */}
        {saree.videoUrl && (
          <button
            className="video-btn"
            onClick={e => { e.stopPropagation(); onVideoClick(saree); }}
            title="Watch preview"
          >
            ▶
          </button>
        )}

        {/* Color dot */}
        <div className="color-dot-wrap">
          <span
            className="color-dot"
            style={{ background: COLOR_MAP[saree.color] || '#aaa' }}
          />
        </div>

      </div>

      {/* ── Info ────────────────────────────────────────── */}
      <div className="product-info">
        <div className="product-name">{saree.name}</div>
        <div className="product-meta-line">{saree.type} · {saree.color}</div>

        <div className="product-price-row">
          <span className="product-price">
            ₹{saree.price?.toLocaleString('en-IN')}
          </span>
          {saree.originalPrice && (
            <span className="product-price-original">
              ₹{saree.originalPrice?.toLocaleString('en-IN')}
            </span>
          )}
        </div>

        <div className="product-tags">
          <span className="tag">{saree.size || '5.5m'}</span>
          {outOfStock ? (
            <span className="tag tag-danger">Out of stock</span>
          ) : lowStock ? (
            <span className="tag tag-warn">Only {saree.stock} left</span>
          ) : (
            <span className="tag tag-good">{saree.stock} in stock</span>
          )}
        </div>

        <button
          className={`add-cart-btn${justAdded ? ' added' : ''}`}
          onClick={handleAddToCart}
          disabled={outOfStock}
        >
          {outOfStock ? 'Out of Stock' : justAdded ? '✓ Added!' : inCart ? '✓ In Cart' : 'Add to Cart'}
        </button>
      </div>

    </div>
  );
}
