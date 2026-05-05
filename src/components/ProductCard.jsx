// src/components/ProductCard.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import '../styles/ProductCard.css';

// Star rating display (read-only)
export function StarDisplay({ rating, count, size = 13 }) {
  if (!rating) return null;
  const stars = [1, 2, 3, 4, 5].map(i => {
    const fill = Math.min(Math.max(rating - (i - 1), 0), 1);
    return { i, fill };
  });
  return (
    <div style={{ display:'flex', alignItems:'center', gap:4 }}>
      <div style={{ display:'flex', gap:1 }}>
        {stars.map(({ i, fill }) => (
          <svg key={i} width={size} height={size} viewBox="0 0 20 20">
            <defs>
              <linearGradient id={`sg-${i}-${rating}`}>
                <stop offset={`${fill * 100}%`} stopColor="#D4AB5A" />
                <stop offset={`${fill * 100}%`} stopColor="#2A1E0A" />
              </linearGradient>
            </defs>
            <polygon
              points="10,1 12.9,7 19.5,7.6 14.5,12 16.2,18.5 10,15 3.8,18.5 5.5,12 0.5,7.6 7.1,7"
              fill={`url(#sg-${i}-${rating})`}
            />
          </svg>
        ))}
      </div>
      {count > 0 && (
        <span style={{ fontSize:11, color:'#8A7560' }}>({count})</span>
      )}
    </div>
  );
}

export default function ProductCard({ saree, onVideoClick }) {
  const { cart, dispatch } = useCart();
  const navigate = useNavigate();
  const [justAdded, setJustAdded] = useState(false);
  const [imgError, setImgError]   = useState(false);

  const sareeId    = saree._id || saree.id;
  const inCart     = cart.some(c => c.id === sareeId);
  const outOfStock = saree.stock <= 0;
  // Only show "Only X left" if stock is between 1 and 4
  const lowStock   = saree.stock > 0 && saree.stock < 5;

  const primaryImage = saree.imageUrls?.[0] || saree.imageUrl || '';
  const badgeClass   = `badge badge-${saree.type?.toLowerCase() || 'other'}`;

  function handleAddToCart(e) {
    e.stopPropagation(); // don't open detail page
    if (outOfStock) return;
    dispatch({ type: 'ADD_ITEM', id: sareeId });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1800);
  }

  function openDetail() {
    navigate(`/saree/${sareeId}`);
  }

  return (
    <div className="product-card" onClick={openDetail}>

      {/* ── Image ─────────────────────────────────────── */}
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

        <div className="card-overlay" />
        <span className={badgeClass}>{saree.type}</span>

        {outOfStock && (
          <div className="oos-overlay">
            <span className="oos-label">Out of Stock</span>
          </div>
        )}

        {/* Video preview button */}
        {saree.videoUrl && (
          <button
            className="video-btn"
            onClick={e => { e.stopPropagation(); onVideoClick && onVideoClick(saree); }}
            title="Watch preview"
          >
            ▶
          </button>
        )}

        {/* Color variants count badge */}
        {saree.variants?.length > 0 && (
          <div className="variants-badge">
            +{saree.variants.length} colour{saree.variants.length > 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* ── Info ──────────────────────────────────────── */}
      <div className="product-info">
        <div className="product-name">{saree.name}</div>
        <div className="product-meta-line">
          {saree.type} · {saree.color}
          {saree.averageRating > 0 && (
            <>
              {' · '}
              <StarDisplay rating={saree.averageRating} count={saree.reviewCount} size={11} />
            </>
          )}
        </div>

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

        {/* Only show stock warning if low — nothing shown when stock is fine */}
        <div className="product-tags">
          <span className="tag">{saree.size || '5.5m'}</span>
          {outOfStock && <span className="tag tag-danger">Out of stock</span>}
          {lowStock   && <span className="tag tag-warn">Only {saree.stock} left</span>}
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
