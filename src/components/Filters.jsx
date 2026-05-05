// /src/components/Filters.jsx
import React from "react";
import { SAREE_TYPES, COLOR_MAP } from "../data/sarees";
import "../styles/Filters.css";

export default function Filters({ filters, onChange, onClear }) {
  const allColors = Object.keys(COLOR_MAP);

  function toggleChip(key, value) {
    const current = [...filters[key]]; // spread to new array — important
    const idx = current.indexOf(value);
    if (idx > -1) {
      current.splice(idx, 1);
    } else {
      current.push(value);
    }
    onChange({ ...filters, [key]: current });
  }

  return (
    <aside className="filters-sidebar">
      <div className="filter-header">Refine</div>

      {/* Search */}
      <div className="filter-section">
        <div className="filter-label">Search</div>
        <input
          className="search-input"
          type="text"
          placeholder="Search sarees..."
          value={filters.search}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
        />
      </div>

      {/* Fabric Type */}
      <div className="filter-section">
        <div className="filter-label">Fabric Type</div>
        <div className="filter-chips">
          {SAREE_TYPES.map((t) => (
            <span
              key={t}
              className={`chip${filters.types.includes(t) ? " selected" : ""}`}
              onClick={() => toggleChip("types", t)}
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Color */}
      <div className="filter-section">
        <div className="filter-label">Color</div>
        <div className="filter-chips">
          {allColors.map((c) => (
            <span
              key={c}
              className={`chip${filters.colors.includes(c) ? " selected" : ""}`}
              onClick={() => toggleChip("colors", c)}
            >
              <span
                className="color-swatch"
                style={{ background: COLOR_MAP[c] }}
              />
              {c}
            </span>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="filter-section">
        <div className="filter-label">Price Range (₹)</div>
        <div className="price-range">
          <input
            className="price-input"
            type="number"
            placeholder="Min"
            value={filters.priceMin}
            onChange={(e) => onChange({ ...filters, priceMin: e.target.value })}
          />
          <span className="price-dash">–</span>
          <input
            className="price-input"
            type="number"
            placeholder="Max"
            value={filters.priceMax}
            onChange={(e) => onChange({ ...filters, priceMax: e.target.value })}
          />
        </div>
      </div>

      {/* Availability */}
      <div className="filter-section">
        <div className="filter-label">Availability</div>
        <div className="toggle-group">
          {["all", "in", "out"].map((v) => (
            <button
              key={v}
              className={`toggle-btn${filters.stock === v ? " selected" : ""}`}
              onClick={() => onChange({ ...filters, stock: v })}
            >
              {v === "all" ? "All" : v === "in" ? "In Stock" : "Out"}
            </button>
          ))}
        </div>
      </div>

      {/* Quantity */}
      <div className="filter-section">
        <div className="filter-label">Quantity</div>
        <div className="toggle-group">
          {["any", "hi", "lo"].map((v) => (
            <button
              key={v}
              className={`toggle-btn${filters.qty === v ? " selected" : ""}`}
              onClick={() => onChange({ ...filters, qty: v })}
            >
              {v === "any" ? "Any" : v === "hi" ? "5+" : "< 5"}
            </button>
          ))}
        </div>
      </div>

      <button className="clear-btn" onClick={onClear}>
        ✕ Clear All Filters
      </button>
    </aside>
  );
}
