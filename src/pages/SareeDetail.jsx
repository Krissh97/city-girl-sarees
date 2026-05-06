// src/pages/SareeDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { StarDisplay } from '../components/ProductCard';
import '../styles/SareeDetail.css';

const API = process.env.REACT_APP_API_URL;

// ── Star picker for review form ───────────────────────────────
function StarPicker({ value, onChange }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div style={{ display:'flex', gap:4, cursor:'pointer' }}>
      {[1,2,3,4,5].map(star => (
        <svg
          key={star}
          width={28} height={28} viewBox="0 0 20 20"
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(star)}
        >
          <polygon
            points="10,1 12.9,7 19.5,7.6 14.5,12 16.2,18.5 10,15 3.8,18.5 5.5,12 0.5,7.6 7.1,7"
            fill={(hovered || value) >= star ? '#D4AB5A' : '#2A1E0A'}
            stroke="#5A4010"
            strokeWidth="0.5"
            style={{ transition:'fill 0.15s' }}
          />
        </svg>
      ))}
    </div>
  );
}

export default function SareeDetail() {
  const { id }   = useParams();
  const navigate = useNavigate();
  const { cart, dispatch } = useCart();

  const [saree, setSaree]             = useState(null);
  const [loading, setLoading]         = useState(true);
  const [activeImg, setActiveImg]     = useState(0);
  const [activeVariant, setActiveVariant] = useState(null); // null = primary
  const [justAdded, setJustAdded]     = useState(false);
  const [showVideo, setShowVideo]     = useState(false);

  // Review form state
  const [reviewName, setReviewName]       = useState('');
  const [reviewRating, setReviewRating]   = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewDone, setReviewDone]       = useState(false);
  const [reviewError, setReviewError]     = useState('');

  useEffect(() => {
    setLoading(true);
    fetch(`${API}/api/sarees/${id}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) { navigate('/shop'); return; }
        setSaree(data);
        setActiveImg(0);
        setActiveVariant(null);
      })
      .catch(() => navigate('/shop'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading) return (
    <div className="detail-loading">
      <div className="detail-spinner" />
      <span>Loading…</span>
    </div>
  );

  if (!saree) return null;

  // ── Active variant or primary ─────────────────────────────
  const active = activeVariant !== null ? saree.variants[activeVariant] : null;
  const currentColor    = active ? active.color    : saree.color;
  const currentPrice    = active ? active.price    : saree.price;
  const currentStock    = active ? active.stock    : saree.stock;
  const currentImages   = active?.imageUrls?.length ? active.imageUrls : saree.imageUrls;
  const currentVideo    = active?.videoUrl || saree.videoUrl;
  const currentId       = saree._id; // always use main saree _id for cart
  const outOfStock      = currentStock <= 0;
  const lowStock        = currentStock > 0 && currentStock < 5;
  const inCart          = cart.some(c => c.id === currentId);

  function addToCart() {
    if (outOfStock) return;
    dispatch({ type: 'ADD_ITEM', id: currentId });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  }

  // ── Review submit ─────────────────────────────────────────
  async function submitReview(e) {
    e.preventDefault();
    if (!reviewRating) { setReviewError('Please select a star rating'); return; }
    if (!reviewName.trim()) { setReviewError('Please enter your name'); return; }
    setReviewError('');
    setReviewSubmitting(true);
    try {
      const res = await fetch(`${API}/api/sarees/${id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: reviewName,
          rating: reviewRating,
          comment: reviewComment,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      // Update local saree state with new rating
      setSaree(prev => ({
        ...prev,
        averageRating: data.averageRating,
        reviewCount: data.reviewCount,
        reviews: [...(prev.reviews || []), data.review],
      }));
      setReviewDone(true);
      setReviewName(''); setReviewRating(0); setReviewComment('');
    } catch (err) {
      setReviewError(err.message || 'Failed to submit. Please try again.');
    } finally {
      setReviewSubmitting(false);
    }
  }

  const allImages  = currentImages?.length ? currentImages : [];
  const displayImg = allImages[activeImg] || null;

  return (
    <div className="detail-page">

      {/* ── BREADCRUMB ─────────────────────────────────── */}
      <div className="detail-breadcrumb">
        <span onClick={() => navigate('/')}>Home</span>
        <span className="bc-sep">›</span>
        <span onClick={() => navigate('/shop')}>Shop</span>
        <span className="bc-sep">›</span>
        <span className="bc-current">{saree.name}</span>
      </div>

      {/* ── MAIN CONTENT ──────────────────────────────── */}
      <div className="detail-main">

        {/* ── LEFT: Gallery ───────────────────────────── */}
        <div className="detail-gallery">

          {/* Thumbnails */}
          {allImages.length > 1 && (
            <div className="gallery-thumbs">
              {allImages.map((url, i) => (
                <div
                  key={i}
                  className={`gallery-thumb${activeImg === i ? ' active' : ''}`}
                  onClick={() => setActiveImg(i)}
                >
                  <img src={url} alt="" />
                </div>
              ))}
              {currentVideo && (
                <div
                  className={`gallery-thumb video-thumb${showVideo ? ' active' : ''}`}
                  onClick={() => setShowVideo(true)}
                >
                  <div className="video-thumb-icon">▶</div>
                </div>
              )}
            </div>
          )}

          {/* Main image */}
          <div className="gallery-main">
            {displayImg ? (
              <img
                className="gallery-main-img"
                src={displayImg}
                alt={saree.name}
              />
            ) : (
              <div className="gallery-placeholder">
                <span>🥻</span>
                <span>{saree.type}</span>
              </div>
            )}

            {/* Video play overlay if no thumbnails */}
            {currentVideo && allImages.length <= 1 && (
              <button className="main-video-btn" onClick={() => setShowVideo(true)}>
                ▶ Watch Video
              </button>
            )}
          </div>
        </div>

        {/* ── RIGHT: Info ─────────────────────────────── */}
        <div className="detail-info">

          <div className="detail-type-badge">{saree.type}</div>
          <h1 className="detail-name">{saree.name}</h1>

          {/* Rating summary */}
          {saree.averageRating > 0 && (
            <div className="detail-rating-row">
              <StarDisplay rating={saree.averageRating} count={saree.reviewCount} size={16} />
              <span className="detail-avg">{saree.averageRating} out of 5</span>
            </div>
          )}

          {/* Price */}
          <div className="detail-price-row">
            <span className="detail-price">₹{currentPrice?.toLocaleString('en-IN')}</span>
            {saree.originalPrice && !active && (
              <span className="detail-original">₹{saree.originalPrice?.toLocaleString('en-IN')}</span>
            )}
          </div>

          {/* Description */}
          {saree.description && (
            <p className="detail-description">{saree.description}</p>
          )}

          {/* Details grid */}
          <div className="detail-specs">
            {[
              ['Color', saree.colors?.length > 0
                ? saree.colors.join(' · ')
                : saree.color],
              ['Size',    saree.size || '5.5m'],
              ['Weight',  saree.weight || '—'],
              ['Blouse',  saree.blouseIncluded ? 'Included' : 'Not included'],
            ].map(([k, v]) => (
              <div className="spec-row" key={k}>
                <span className="spec-key">{k}</span>
                <span className="spec-val">{v}</span>
              </div>
            ))}
          </div>

          {/* Color variants */}
          {saree.variants?.length > 0 && (
            <div className="detail-variants">
              <div className="variants-label">Available in other colours</div>
              <div className="variants-list">
                {/* Primary color option */}
                <button
                  className={`variant-btn${activeVariant === null ? ' active' : ''}`}
                  onClick={() => { setActiveVariant(null); setActiveImg(0); }}
                >
                  <span className="variant-color-name">{saree.color}</span>
                  {saree.stock <= 0 && <span className="variant-oos">OOS</span>}
                </button>
                {/* Other variant color options */}
                {saree.variants.map((v, i) => (
                  <button
                    key={i}
                    className={`variant-btn${activeVariant === i ? ' active' : ''}`}
                    onClick={() => { setActiveVariant(i); setActiveImg(0); }}
                  >
                    <span className="variant-color-name">{v.color}</span>
                    {v.stock <= 0 && <span className="variant-oos">OOS</span>}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Stock status */}
          <div className="detail-stock">
            {outOfStock ? (
              <span className="stock-msg oos">Out of Stock</span>
            ) : lowStock ? (
              <span className="stock-msg low">Only {currentStock} left — order soon</span>
            ) : (
              <span className="stock-msg ok">✓ In Stock</span>
            )}
          </div>

          {/* Add to cart */}
          <div className="detail-actions">
            <button
              className={`detail-cart-btn${justAdded ? ' added' : ''}`}
              onClick={addToCart}
              disabled={outOfStock}
            >
              {outOfStock ? 'Out of Stock'
                : justAdded ? '✓ Added to Cart!'
                : inCart ? '✓ In Cart — Add Again'
                : 'Add to Cart'}
            </button>
            <button className="detail-cart-btn secondary" onClick={() => navigate('/cart')}>
              View Cart
            </button>
          </div>

          {/* Tags */}
          {saree.tags?.length > 0 && (
            <div className="detail-tags">
              {saree.tags.map(t => (
                <span key={t} className="detail-tag">{t}</span>
              ))}
            </div>
          )}

        </div>
      </div>

      {/* ── VIDEO MODAL ─────────────────────────────────── */}
      {showVideo && currentVideo && (
        <div className="video-modal-bg" onClick={() => setShowVideo(false)}>
          <div className="video-modal-box" onClick={e => e.stopPropagation()}>
            <div className="video-modal-head">
              <span>{saree.name} — Video Preview</span>
              <button onClick={() => setShowVideo(false)}>✕</button>
            </div>
            <video className="video-modal-player" controls autoPlay>
              <source src={currentVideo} type="video/mp4" />
            </video>
          </div>
        </div>
      )}

      {/* ── REVIEWS SECTION ───────────────────────────── */}
      <div className="reviews-section">

        {/* Header */}
        <div className="reviews-header">
          <h2 className="reviews-title">Customer Reviews</h2>
          {saree.averageRating > 0 && (
            <div className="reviews-summary">
              <span className="reviews-avg-num">{saree.averageRating}</span>
              <div>
                <StarDisplay rating={saree.averageRating} count={saree.reviewCount} size={18} />
                <div className="reviews-avg-sub">
                  Based on {saree.reviewCount} review{saree.reviewCount !== 1 ? 's' : ''}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="reviews-layout">

          {/* ── Write a review ── */}
          <div className="review-form-card">
            <div className="review-form-title">Write a Review</div>

            {reviewDone ? (
              <div className="review-success">
                <span style={{ fontSize:28 }}>🙏</span>
                <p>Thank you for your review!</p>
                <button
                  className="review-another-btn"
                  onClick={() => setReviewDone(false)}
                >
                  Write another
                </button>
              </div>
            ) : (
              <form onSubmit={submitReview}>
                <div className="rf-group">
                  <label className="rf-label">Your Rating *</label>
                  <StarPicker value={reviewRating} onChange={setReviewRating} />
                </div>
                <div className="rf-group">
                  <label className="rf-label">Your Name *</label>
                  <input
                    className="rf-input"
                    type="text"
                    placeholder="e.g. Priya S."
                    value={reviewName}
                    onChange={e => setReviewName(e.target.value)}
                  />
                </div>
                <div className="rf-group">
                  <label className="rf-label">Review (optional)</label>
                  <textarea
                    className="rf-input"
                    placeholder="Tell others what you think about this saree…"
                    value={reviewComment}
                    onChange={e => setReviewComment(e.target.value)}
                    rows={4}
                    style={{ resize:'vertical' }}
                  />
                </div>
                {reviewError && (
                  <div className="rf-error">{reviewError}</div>
                )}
                <button
                  type="submit"
                  className="rf-submit"
                  disabled={reviewSubmitting}
                >
                  {reviewSubmitting ? 'Submitting…' : 'Submit Review'}
                </button>
              </form>
            )}
          </div>

          {/* ── Existing reviews ── */}
          <div className="reviews-list">
            {!saree.reviews?.length ? (
              <div className="no-reviews">
                <span style={{ fontSize:32, opacity:0.3 }}>💬</span>
                <p>No reviews yet. Be the first!</p>
              </div>
            ) : (
              [...saree.reviews].reverse().map(r => (
                <div key={r._id} className="review-card">
                  <div className="review-top">
                    <div className="review-avatar">
                      {r.customerName[0]?.toUpperCase()}
                    </div>
                    <div>
                      <div className="review-name">{r.customerName}</div>
                      <div className="review-date">
                        {new Date(r.createdAt).toLocaleDateString('en-IN', {
                          day:'numeric', month:'short', year:'numeric'
                        })}
                      </div>
                    </div>
                    <div style={{ marginLeft:'auto' }}>
                      <StarDisplay rating={r.rating} size={13} />
                    </div>
                  </div>
                  {r.comment && (
                    <p className="review-comment">{r.comment}</p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
