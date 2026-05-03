// /src/components/ProductList.jsx
import React from "react";
import ProductCard from "./ProductCard";
import "../styles/ProductList.css";

export default function ProductList({ sarees, onVideoClick }) {
  if (!sarees.length) {
    return (
      <div className="no-results">
        <div className="no-results-icon">🥻</div>
        <p>No sarees match your filters.</p>
        <p className="no-results-sub">Try clearing some filters to see more.</p>
      </div>
    );
  }

  return (
    <div className="products-grid">
      {sarees.map((s) => (
        <ProductCard key={s.id} saree={s} onVideoClick={onVideoClick} />
      ))}
    </div>
  );
}
