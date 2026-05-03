// /src/pages/Shop.jsx
import React, { useState, useMemo } from "react";
import Filters from "../components/Filters";
import ProductList from "../components/ProductList";
import VideoModal from "../components/VideoModal";
import { SAREES } from "../data/sarees";
import "../styles/Shop.css";

const DEFAULT_FILTERS = {
  search: "",
  types: [],
  colors: [],
  priceMin: "",
  priceMax: "",
  stock: "all",
  qty: "any",
};

export default function Shop() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [videoSaree, setVideoSaree] = useState(null);

  const filtered = useMemo(() => {
    return SAREES.filter((s) => {
      if (filters.types.length && !filters.types.includes(s.type)) return false;
      if (filters.colors.length && !filters.colors.includes(s.color)) return false;
      if (filters.priceMin && s.price < +filters.priceMin) return false;
      if (filters.priceMax && s.price > +filters.priceMax) return false;
      if (filters.stock === "in" && s.stock <= 0) return false;
      if (filters.stock === "out" && s.stock > 0) return false;
      if (filters.qty === "hi" && s.stock < 5) return false;
      if (filters.qty === "lo" && s.stock >= 5) return false;
      if (filters.search) {
        const q = filters.search.toLowerCase();
        if (
          !s.name.toLowerCase().includes(q) &&
          !s.description.toLowerCase().includes(q) &&
          !s.color.toLowerCase().includes(q) &&
          !s.type.toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    });
  }, [filters]);

  return (
    <div className="shop-layout">
      <Filters
        filters={filters}
        onChange={setFilters}
        onClear={() => setFilters(DEFAULT_FILTERS)}
      />

      <main className="shop-main">
        <div className="shop-topbar">
          <span className="results-count">
            Showing <strong>{filtered.length}</strong> of {SAREES.length} sarees
          </span>
        </div>
        <ProductList sarees={filtered} onVideoClick={setVideoSaree} />
      </main>

      {videoSaree && (
        <VideoModal saree={videoSaree} onClose={() => setVideoSaree(null)} />
      )}
    </div>
  );
}
