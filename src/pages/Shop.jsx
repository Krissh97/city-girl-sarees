import React, { useState, useEffect, useMemo } from 'react';
import Filters from '../components/Filters';
import ProductList from '../components/ProductList';
import VideoModal from '../components/VideoModal';

const DEFAULT_FILTERS = {
  search: '', types: [], colors: [],
  priceMin: '', priceMax: '', stock: 'all', qty: 'any',
};

export default function Shop() {
  const [sarees, setSarees]         = useState([]);
  const [loading, setLoading]       = useState(true);
  const [filters, setFilters]       = useState(DEFAULT_FILTERS);
  const [videoSaree, setVideoSaree] = useState(null);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/sarees`)
      .then(r => r.json())
      .then(data => setSarees(Array.isArray(data) ? data : []))
      .catch(e => console.error('Failed to load sarees:', e))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return sarees.filter(s => {
      if (filters.types.length && !filters.types.includes(s.type)) return false;
      if (filters.colors.length && !filters.colors.includes(s.color)) return false;
      if (filters.priceMin && s.price < +filters.priceMin) return false;
      if (filters.priceMax && s.price > +filters.priceMax) return false;
      if (filters.stock === 'in'  && s.stock <= 0) return false;
      if (filters.stock === 'out' && s.stock  > 0) return false;
      if (filters.qty === 'hi' && s.stock <  5) return false;
      if (filters.qty === 'lo' && s.stock >= 5) return false;
      if (filters.search) {
        const q = filters.search.toLowerCase();
        if (
          !s.name.toLowerCase().includes(q) &&
          !s.color.toLowerCase().includes(q) &&
          !s.type.toLowerCase().includes(q) &&
          !(s.description || '').toLowerCase().includes(q)
        ) return false;
      }
      return true;
    });
  }, [sarees, filters]);

  if (loading) return (
    <div style={{ textAlign:'center', padding:'5rem', color:'#7A6247' }}>
      Loading sarees…
    </div>
  );

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
            Showing <strong>{filtered.length}</strong> of {sarees.length} sarees
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