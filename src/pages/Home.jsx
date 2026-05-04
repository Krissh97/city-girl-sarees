// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductList from '../components/ProductList';
import VideoModal from '../components/VideoModal';
import '../styles/Home.css';

const FEATURES = [
  { icon: '🧵', title: 'Handwoven',    sub: 'Artisan crafted'    },
  { icon: '✨', title: 'Pure Fabrics', sub: 'Quality guaranteed' },
];

export default function Home() {
  const navigate = useNavigate();
  const [sarees, setSarees]         = useState([]);
  const [loading, setLoading]       = useState(true);
  const [videoSaree, setVideoSaree] = useState(null);

  useEffect(() => {
    // ── Fetch ALL active sarees from your backend ──
    fetch(`${process.env.REACT_APP_API_URL}/api/sarees`)
      .then(r => r.json())
      .then(data => setSarees(Array.isArray(data) ? data : []))
      .catch(e => console.error('Failed to load sarees:', e))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="home-page">

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="hero">
        <div className="hero-eyebrow">
          New Collection
        </div>
        <h1>
          Draped in<br /><em>Timeless</em> Grace
        </h1>
        <p className="hero-sub">
          Handpicked sarees from the finest looms — silk, cotton,
          pattu and more, delivered to your door.
        </p>
        <button className="hero-cta" onClick={() => navigate('/shop')}>
          Explore Collection
        </button>
      </section>

      {/* ── FEATURES ─────────────────────────────────────── */}
      <div className="features-strip">
        {FEATURES.map(f => (
          <div className="feature-item" key={f.title}>
            <div className="feature-icon">{f.icon}</div>
            <div className="feature-title">{f.title}</div>
            <div className="feature-sub">{f.sub}</div>
          </div>
        ))}
      </div>

      {/* ── ALL SAREES ───────────────────────────────────── */}
      <div className="section-header">
        <div className="section-eyebrow">Our Collection</div>
        <h2 className="section-title">
          Every <em>Saree</em> Tells a Story
        </h2>
      </div>
      <div className="section-divider" />

      <div className="featured-wrapper">
        {loading ? (
          <div className="home-loading">Loading collection…</div>
        ) : (
          <ProductList sarees={sarees} onVideoClick={setVideoSaree} />
        )}
      </div>

      {videoSaree && (
        <VideoModal saree={videoSaree} onClose={() => setVideoSaree(null)} />
      )}
    </div>
  );
}
