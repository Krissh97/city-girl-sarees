// /src/pages/Home.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProductList from "../components/ProductList";
import VideoModal from "../components/VideoModal";
// import { SAREES } from "../data/sarees";
import "../styles/Home.css";

const FEATURES = [
  { icon: "🧵", title: "Handwoven", sub: "Artisan crafted" },
  // { icon: "📦", title: "Free Shipping", sub: "Orders above ₹1999" },
  { icon: "✨", title: "Pure Fabrics", sub: "Quality guaranteed" },
  // { icon: "🔄", title: "Easy Returns", sub: "7-day policy" },
];

export default function Home() {
  const navigate = useNavigate();
  const [videoSaree, setVideoSaree] = useState(null);

  // Show only in-stock featured products (first 8)
  // const featured = SAREES.filter((s) => s.stock > 0).slice(0, 8);
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/sarees?featured=true`)
      .then(r => r.json())
      .then(data => setFeatured(Array.isArray(data) ? data.slice(0, 8) : []))
      .catch(() => {});
  }, []);
  return (
    <div className="home-page">
      {/* Hero */}
      <section className="hero">
        <div className="hero-ornament">❋</div>
        <h1>
          Drape Yourself<br />in <em>Tradition</em>
        </h1>
        <p>Curated silk, cotton & pattu sarees — from the loom to your doorstep</p>
        <button className="hero-cta" onClick={() => navigate("/shop")}>
          Explore Collection
        </button>
      </section>

      {/* Features strip */}
      <div className="features-strip">
        {FEATURES.map((f) => (
          <div className="feature-item" key={f.title}>
            <div className="feature-icon">{f.icon}</div>
            <div className="feature-title">{f.title}</div>
            <div className="feature-sub">{f.sub}</div>
          </div>
        ))}
      </div>

      {/* Featured products */}
      <h2 className="section-title">Featured Sarees</h2>
      <div className="section-divider" />
      <div className="featured-wrapper">
        <ProductList sarees={featured} onVideoClick={setVideoSaree} />
      </div>

      {videoSaree && (
        <VideoModal saree={videoSaree} onClose={() => setVideoSaree(null)} />
      )}
    </div>
  );
}
