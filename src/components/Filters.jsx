// /src/components/Filters.jsx
import React from "react";
// import { SAREE_TYPES, COLOR_MAP } from "../data/sarees";
import "../styles/Filters.css";

export default function Filters({ filters, onChange, onClear, availableColors = [], availableTypes = [] }) {

  function toggleChip(key, value) {
    const current = [...filters[key]];
    const idx = current.findIndex(c => c.toLowerCase() === value.toLowerCase());
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
          onChange={e => onChange({ ...filters, search: e.target.value })}
        />
      </div>

      {/* Type — built from real data */}
      <div className="filter-section">
        <div className="filter-label">Fabric Type</div>
        <div className="filter-chips">
          {availableTypes.map(t => (
            <span
              key={t}
              className={`chip${filters.types.some(f => f.toLowerCase() === t.toLowerCase()) ? ' selected' : ''}`}
              onClick={() => toggleChip('types', t)}
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Color — built from real data */}
      <div className="filter-section">
        <div className="filter-label">Color</div>
        <div className="filter-chips">
          {availableColors.map(c => (
            <span
              key={c}
              className={`chip${filters.colors.some(f => f.toLowerCase() === c.toLowerCase()) ? ' selected' : ''}`}
              onClick={() => toggleChip('colors', c)}
            >
              {c}
            </span>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="filter-section">
        <div className="filter-label">Price Range (₹)</div>
        <div className="price-range">
          <input className="price-input" type="number" placeholder="Min"
            value={filters.priceMin}
            onChange={e => onChange({ ...filters, priceMin: e.target.value })} />
          <span className="price-dash">–</span>
          <input className="price-input" type="number" placeholder="Max"
            value={filters.priceMax}
            onChange={e => onChange({ ...filters, priceMax: e.target.value })} />
        </div>
      </div>

      {/* Availability */}
      <div className="filter-section">
        <div className="filter-label">Availability</div>
        <div className="toggle-group">
          {[['all','All'],['in','In Stock'],['out','Out']].map(([v, label]) => (
            <button key={v}
              className={`toggle-btn${filters.stock === v ? ' selected' : ''}`}
              onClick={() => onChange({ ...filters, stock: v })}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Quantity */}
      <div className="filter-section">
        <div className="filter-label">Quantity</div>
        <div className="toggle-group">
          {[['any','Any'],['hi','5+'],['lo','< 5']].map(([v, label]) => (
            <button key={v}
              className={`toggle-btn${filters.qty === v ? ' selected' : ''}`}
              onClick={() => onChange({ ...filters, qty: v })}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <button className="clear-btn" onClick={onClear}>✕ Clear All Filters</button>
    </aside>
  );
}