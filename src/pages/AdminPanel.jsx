// src/pages/AdminPanel.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';

const API   = process.env.REACT_APP_API_URL;
const TYPES = ['Silk','Cotton','Pattu','Georgette','Linen','Chiffon','Other'];
const STATUSES = ['pending','confirmed','shipped','delivered','cancelled'];

const STATUS_COLORS = {
  pending:   { bg:'#2A1F0A', color:'#F5C842', border:'#5A4010' },
  confirmed: { bg:'#0A1F14', color:'#4ADE80', border:'#1A5A32' },
  shipped:   { bg:'#0A1428', color:'#60AEFF', border:'#1A3D6A' },
  delivered: { bg:'#0A2010', color:'#34D399', border:'#145A30' },
  cancelled: { bg:'#200A0A', color:'#F87171', border:'#5A1A1A' },
};

async function apiFetch(method, path, body, token, isForm = false) {
  const headers = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (!isForm && body) headers['Content-Type'] = 'application/json';
  const res = await fetch(`${API}${path}`, {
    method,
    headers,
    body: isForm ? body : body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Error ${res.status}`);
  return data;
}

const BLANK = {
  sku:'', name:'', description:'', type:'Silk', color:'',
  price:'', originalPrice:'', stock:'', size:'5.5m',
  weight:'', blouseIncluded:false, isFeatured:false,
  isActive:true, tags:'', sortOrder:'0',
};

// ════════════════════════════════════════════════════════════
export default function AdminPanel() {
  const [token, setToken]     = useState(() => localStorage.getItem('cg_admin_token') || '');
  const [tab, setTab]         = useState('sarees');
  const [sarees, setSarees]   = useState([]);
  const [orders, setOrders]   = useState([]);
  const [toast, setToast]     = useState(null);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm]   = useState(false);
  const [editing, setEditing]     = useState(null);
  const [form, setForm]           = useState(BLANK);
  const [imgFiles, setImgFiles]   = useState([]);
  const [vidFile, setVidFile]     = useState(null);
  const [saving, setSaving]       = useState(false);
  const [search, setSearch]       = useState('');
  const imgRef = useRef();
  const vidRef = useRef();

  const notify = useCallback((msg, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3500);
  }, []);

  const loadSarees = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try { setSarees(await apiFetch('GET', '/api/sarees/admin/all', null, token)); }
    catch (e) { notify(e.message, false); }
    finally { setLoading(false); }
  }, [token, notify]);

  const loadOrders = useCallback(async () => {
    if (!token) return;
    try {
      const d = await apiFetch('GET', '/api/orders', null, token);
      setOrders(d.orders || []);
    } catch (e) { notify(e.message, false); }
  }, [token, notify]);

  useEffect(() => { if (token) { loadSarees(); loadOrders(); } }, [token, loadSarees, loadOrders]);

  if (!token) return <LoginScreen onLogin={t => { localStorage.setItem('cg_admin_token', t); setToken(t); }} />;

  function logout() { localStorage.removeItem('cg_admin_token'); setToken(''); }

  function openNew() {
    setEditing(null); setForm(BLANK);
    setImgFiles([]); setVidFile(null);
    setShowForm(true);
  }

  function openEdit(s) {
    setEditing(s);
    setForm({
      sku: s.sku, name: s.name, description: s.description || '',
      type: s.type, color: s.color, price: s.price,
      originalPrice: s.originalPrice || '', stock: s.stock,
      size: s.size || '5.5m', weight: s.weight || '',
      blouseIncluded: !!s.blouseIncluded, isFeatured: !!s.isFeatured,
      isActive: s.isActive !== false,
      tags: (s.tags || []).join(', '), sortOrder: s.sortOrder ?? 0,
    });
    setImgFiles([]); setVidFile(null);
    setShowForm(true);
  }

  async function saveSaree(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price), stock: Number(form.stock),
        sortOrder: Number(form.sortOrder),
        originalPrice: form.originalPrice !== '' ? Number(form.originalPrice) : null,
        tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      };
      let id;
      if (editing) {
        await apiFetch('PUT', `/api/sarees/${editing._id}`, payload, token);
        id = editing._id;
        notify(`"${form.name}" updated ✓`);
      } else {
        const res = await apiFetch('POST', '/api/sarees', payload, token);
        id = res._id;
        notify(`"${form.name}" created ✓`);
      }
      if (imgFiles.length) {
        const fd = new FormData();
        imgFiles.forEach(f => fd.append('images', f));
        await apiFetch('POST', `/api/sarees/${id}/images`, fd, token, true);
        notify(`${imgFiles.length} image(s) uploaded ✓`);
      }
      if (vidFile) {
        const fd = new FormData();
        fd.append('video', vidFile);
        await apiFetch('POST', `/api/sarees/${id}/video`, fd, token, true);
        notify('Video uploaded ✓');
      }
      setShowForm(false);
      loadSarees();
    } catch (err) { notify(err.message, false); }
    finally { setSaving(false); }
  }

  async function removeImg(saree, url) {
    if (!window.confirm('Remove this image?')) return;
    try {
      await apiFetch('DELETE', `/api/sarees/${saree._id}/images`, { url }, token);
      setSarees(prev => prev.map(s =>
        s._id === saree._id ? { ...s, imageUrls: s.imageUrls.filter(u => u !== url) } : s
      ));
      if (editing?._id === saree._id)
        setEditing(prev => ({ ...prev, imageUrls: prev.imageUrls.filter(u => u !== url) }));
      notify('Image removed');
    } catch (e) { notify(e.message, false); }
  }

  async function toggleField(s, field) {
    try {
      await apiFetch('PUT', `/api/sarees/${s._id}`, { [field]: !s[field] }, token);
      loadSarees();
    } catch (e) { notify(e.message, false); }
  }

  async function quickStock(s) {
    const val = window.prompt(`New stock for "${s.name}":`, s.stock);
    if (val === null || val === '' || isNaN(val)) return;
    try {
      await apiFetch('PATCH', `/api/sarees/${s._id}/stock`, { stock: Number(val) }, token);
      notify(`Stock → ${val}`);
      loadSarees();
    } catch (e) { notify(e.message, false); }
  }

  async function deleteSaree(s) {
    if (!window.confirm(`Delete "${s.name}" permanently?`)) return;
    try {
      await apiFetch('DELETE', `/api/sarees/${s._id}?hard=true`, null, token);
      notify(`"${s.name}" deleted`);
      loadSarees();
    } catch (e) { notify(e.message, false); }
  }

  async function updateOrderStatus(o, status) {
    try {
      await apiFetch('PATCH', `/api/orders/${o._id}/status`, { status }, token);
      setOrders(prev => prev.map(x => x._id === o._id ? { ...x, status } : x));
      notify(`Order → ${status}`);
    } catch (e) { notify(e.message, false); }
  }

  const set  = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const f    = form;

  const filteredSarees = sarees.filter(s =>
    !search ||
    s.name?.toLowerCase().includes(search.toLowerCase()) ||
    s.sku?.toLowerCase().includes(search.toLowerCase()) ||
    s.type?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={A.wrap}>

      {/* SIDEBAR */}
      <aside style={A.sidebar}>
        <div style={A.sidebarLogo}>
          <span style={A.logoEmoji}>🥻</span>
          <div>
            <div style={A.logoText}>City Girl</div>
            <div style={A.logoSub}>Admin Panel</div>
          </div>
        </div>

        <nav style={A.nav}>
          {[
            { key:'sarees', icon:'🏪', label:'Sarees', count: sarees.length },
            { key:'orders', icon:'📦', label:'Orders', count: orders.filter(o=>o.status==='pending').length },
          ].map(item => (
            <button
              key={item.key}
              style={tab === item.key ? {...A.navBtn, ...A.navBtnActive} : A.navBtn}
              onClick={() => setTab(item.key)}
            >
              <span style={{ fontSize:18 }}>{item.icon}</span>
              <span style={{ flex:1, textAlign:'left' }}>{item.label}</span>
              {item.count > 0 && (
                <span style={tab===item.key ? {...A.navCount,...A.navCountActive} : A.navCount}>
                  {item.count}
                </span>
              )}
            </button>
          ))}
        </nav>

        <button style={A.logoutBtn} onClick={logout}>
          ← Logout
        </button>
      </aside>

      {/* MAIN */}
      <div style={A.main}>

        {/* TOPBAR */}
        <div style={A.topbar}>
          <div>
            <div style={A.pageTitle}>
              {tab === 'sarees' ? 'Saree Inventory' : 'Orders'}
            </div>
            <div style={A.pageSub}>
              {tab === 'sarees'
                ? `${sarees.length} sarees total · ${sarees.filter(s=>s.isActive).length} active`
                : `${orders.length} orders · ${orders.filter(o=>o.status==='pending').length} pending`
              }
            </div>
          </div>
          {tab === 'sarees' && (
            <div style={{ display:'flex', gap:12, alignItems:'center' }}>
              <input
                style={A.searchInput}
                placeholder="Search sarees…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <button style={A.addBtn} onClick={openNew}>
                + Add Saree
              </button>
            </div>
          )}
        </div>

        {/* TOAST */}
        {toast && (
          <div style={{ ...A.toast, background: toast.ok ? '#1A3D2A' : '#3D1A1A', borderColor: toast.ok ? '#4ADE80' : '#F87171' }}>
            <span style={{ color: toast.ok ? '#4ADE80' : '#F87171' }}>
              {toast.ok ? '✓' : '✗'}
            </span>
            {toast.msg}
          </div>
        )}

        {/* ════ SAREES TAB ════════════════════════════════ */}
        {tab === 'sarees' && (
          <div style={A.content}>
            {loading ? (
              <div style={A.loadingWrap}>
                <div style={A.spinner} />
                <span>Loading sarees…</span>
              </div>
            ) : (
              <div style={A.tableCard}>
                <table style={A.table}>
                  <thead>
                    <tr>
                      {['Image','SKU','Name','Type','Color','Price','Stock','Featured','Status','Actions'].map(h => (
                        <th key={h} style={A.th}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSarees.map((s, i) => (
                      <tr
                        key={s._id}
                        style={{
                          ...A.tr,
                          opacity: s.isActive ? 1 : 0.45,
                          background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)',
                        }}
                      >
                        {/* Thumbnail */}
                        <td style={A.td}>
                          {s.imageUrls?.[0] ? (
                            <img src={s.imageUrls[0]} alt={s.name} style={A.thumb} />
                          ) : (
                            <div style={A.thumbPlaceholder}>🥻</div>
                          )}
                        </td>

                        <td style={A.td}>
                          <span style={A.skuBadge}>{s.sku}</span>
                        </td>

                        <td style={A.td}>
                          <div style={{ fontWeight:500, color:'#F5F0E8', fontSize:13 }}>{s.name}</div>
                          {s.description && (
                            <div style={{ fontSize:11, color:'#6B5E4A', marginTop:2, maxWidth:180, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                              {s.description}
                            </div>
                          )}
                        </td>

                        <td style={A.td}>
                          <span style={A.typeBadge}>{s.type}</span>
                        </td>

                        <td style={A.td}>
                          <span style={{ fontSize:13, color:'#C8B08A' }}>{s.color}</span>
                        </td>

                        <td style={A.td}>
                          <div style={{ color:'#D4AB5A', fontWeight:600, fontSize:14 }}>
                            ₹{s.price?.toLocaleString('en-IN')}
                          </div>
                          {s.originalPrice && (
                            <div style={{ color:'#6B5E4A', fontSize:11, textDecoration:'line-through' }}>
                              ₹{s.originalPrice?.toLocaleString('en-IN')}
                            </div>
                          )}
                        </td>

                        <td style={A.td}>
                          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                            <span style={
                              s.stock === 0 ? A.stockRed :
                              s.stock < 5  ? A.stockAmber : A.stockGreen
                            }>
                              {s.stock}
                            </span>
                            <button style={A.btnTiny} onClick={() => quickStock(s)}>Edit</button>
                          </div>
                        </td>

                        <td style={A.td}>
                          <button
                            style={s.isFeatured ? A.pillOn : A.pillOff}
                            onClick={() => toggleField(s, 'isFeatured')}
                          >
                            {s.isFeatured ? '★ Yes' : '☆ No'}
                          </button>
                        </td>

                        <td style={A.td}>
                          <button
                            style={s.isActive ? A.pillGreen : A.pillGray}
                            onClick={() => toggleField(s, 'isActive')}
                          >
                            {s.isActive ? '● Live' : '○ Hidden'}
                          </button>
                        </td>

                        <td style={A.td}>
                          <div style={{ display:'flex', gap:6 }}>
                            <button style={A.btnEdit} onClick={() => openEdit(s)}>Edit</button>
                            <button style={A.btnDel}  onClick={() => deleteSaree(s)}>Del</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {filteredSarees.length === 0 && (
                  <div style={{ padding:'3rem', textAlign:'center', color:'#6B5E4A' }}>
                    {search ? `No sarees match "${search}"` : 'No sarees yet. Click "+ Add Saree" to get started.'}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ════ ORDERS TAB ════════════════════════════════ */}
        {tab === 'orders' && (
          <div style={A.content}>
            <div style={A.tableCard}>
              <table style={A.table}>
                <thead>
                  <tr>
                    {['Order ID','Customer','Phone','Items','Total','Status','Date'].map(h => (
                      <th key={h} style={A.th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o, i) => {
                    const sc = STATUS_COLORS[o.status] || STATUS_COLORS.pending;
                    return (
                      <tr key={o._id} style={{ ...A.tr, background: i%2===0?'transparent':'rgba(255,255,255,0.015)' }}>
                        <td style={A.td}><span style={A.skuBadge}>{o.orderId}</span></td>
                        <td style={A.td}>
                          <div style={{ fontWeight:500, color:'#F5F0E8', fontSize:13 }}>{o.customer?.name}</div>
                          <div style={{ fontSize:11, color:'#6B5E4A', marginTop:2 }}>{o.customer?.address?.substring(0,40)}…</div>
                        </td>
                        <td style={A.td}><span style={{ color:'#C8B08A', fontSize:13 }}>{o.customer?.phone}</span></td>
                        <td style={A.td}>
                          {o.items?.map((item, j) => (
                            <div key={j} style={{ fontSize:12, color:'#8A7560', lineHeight:1.6 }}>
                              {item.name} <span style={{ color:'#5A4A30' }}>×{item.qty}</span>
                            </div>
                          ))}
                        </td>
                        <td style={A.td}>
                          <span style={{ color:'#D4AB5A', fontWeight:600 }}>
                            ₹{o.pricing?.grandTotal?.toLocaleString('en-IN')}
                          </span>
                        </td>
                        <td style={A.td}>
                          <select
                            style={{
                              ...A.statusSelect,
                              background: sc.bg,
                              color: sc.color,
                              borderColor: sc.border,
                            }}
                            value={o.status}
                            onChange={e => updateOrderStatus(o, e.target.value)}
                          >
                            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </td>
                        <td style={{ ...A.td, fontSize:12, color:'#6B5E4A' }}>
                          {new Date(o.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {orders.length === 0 && (
                <div style={{ padding:'3rem', textAlign:'center', color:'#6B5E4A' }}>
                  No orders yet
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ════ ADD / EDIT MODAL ══════════════════════════════ */}
      {showForm && (
        <div style={A.modalBg} onClick={() => !saving && setShowForm(false)}>
          <div style={A.modal} onClick={e => e.stopPropagation()}>

            <div style={A.modalHead}>
              <div>
                <div style={A.modalTitle}>{editing ? 'Edit Saree' : 'Add New Saree'}</div>
                {editing && <div style={A.modalSub}>{editing.name}</div>}
              </div>
              <button style={A.closeBtn} onClick={() => setShowForm(false)}>✕</button>
            </div>

            <form onSubmit={saveSaree} style={A.modalBody}>

              {/* Section: Identity */}
              <div style={A.formSection}>
                <div style={A.formSectionTitle}>Basic Details</div>
                <div style={A.formRow}>
                  <Field label="SKU *" hint="e.g. CG-SILK-001">
                    <input style={A.input} value={f.sku} required placeholder="CG-SILK-001"
                      onChange={e => set('sku', e.target.value)} />
                  </Field>
                  <Field label="Saree Name *">
                    <input style={A.input} value={f.name} required placeholder="Kanjivaram Crimson Bridal"
                      onChange={e => set('name', e.target.value)} />
                  </Field>
                </div>
                <Field label="Description">
                  <textarea style={{...A.input, minHeight:72, resize:'vertical'}} value={f.description}
                    placeholder="Describe the saree — fabric, occasion, weave, specialty…"
                    onChange={e => set('description', e.target.value)} />
                </Field>
              </div>

              {/* Section: Classification */}
              <div style={A.formSection}>
                <div style={A.formSectionTitle}>Classification</div>
                <div style={A.formRow}>
                  <Field label="Fabric Type *">
                    <select style={A.input} value={f.type} onChange={e => set('type', e.target.value)}>
                      {TYPES.map(t => <option key={t}>{t}</option>)}
                    </select>
                  </Field>
                  <Field label="Color *">
                    <input style={A.input} value={f.color} required placeholder="Red, Blue, Multicolor…"
                      onChange={e => set('color', e.target.value)} />
                  </Field>
                  <Field label="Size">
                    <input style={A.input} value={f.size} placeholder="5.5m"
                      onChange={e => set('size', e.target.value)} />
                  </Field>
                </div>
                <div style={A.formRow}>
                  <Field label="Weight" hint="e.g. 400g">
                    <input style={A.input} value={f.weight} placeholder="400g"
                      onChange={e => set('weight', e.target.value)} />
                  </Field>
                  <Field label="Tags" hint="comma-separated">
                    <input style={A.input} value={f.tags} placeholder="bridal, festive, daily-wear"
                      onChange={e => set('tags', e.target.value)} />
                  </Field>
                </div>
              </div>

              {/* Section: Pricing & Stock */}
              <div style={A.formSection}>
                <div style={A.formSectionTitle}>Pricing & Stock</div>
                <div style={A.formRow}>
                  <Field label="Selling Price (₹) *">
                    <input style={A.input} type="number" value={f.price} required min={0} placeholder="2499"
                      onChange={e => set('price', e.target.value)} />
                  </Field>
                  <Field label="MRP / Original (for strikethrough)" hint="optional">
                    <input style={A.input} type="number" value={f.originalPrice} min={0} placeholder="3000"
                      onChange={e => set('originalPrice', e.target.value)} />
                  </Field>
                  <Field label="Stock Qty *">
                    <input style={A.input} type="number" value={f.stock} required min={0} placeholder="10"
                      onChange={e => set('stock', e.target.value)} />
                  </Field>
                  <Field label="Sort Order" hint="lower = first">
                    <input style={A.input} type="number" value={f.sortOrder}
                      onChange={e => set('sortOrder', e.target.value)} />
                  </Field>
                </div>
              </div>

              {/* Section: Toggles */}
              <div style={A.formSection}>
                <div style={A.formSectionTitle}>Visibility</div>
                <div style={A.toggleRow}>
                  {[
                    ['blouseIncluded', 'Blouse Included'],
                    ['isFeatured', 'Featured on Home Page'],
                    ['isActive', 'Active (visible in shop)'],
                  ].map(([key, lbl]) => (
                    <label key={key} style={A.toggleLabel}>
                      <div
                        style={f[key] ? A.toggleOn : A.toggleOff}
                        onClick={() => set(key, !f[key])}
                      >
                        <div style={{ ...A.toggleKnob, transform: f[key] ? 'translateX(18px)' : 'translateX(2px)' }} />
                      </div>
                      <span style={{ fontSize:13, color: f[key] ? '#D4AB5A' : '#6B5E4A' }}>{lbl}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Section: Images */}
              <div style={A.formSection}>
                <div style={A.formSectionTitle}>Product Images</div>
                <div style={A.uploadHint}>
                  Select up to 15 photos. First image = thumbnail shown in shop.
                  JPG, PNG or WebP. Compress to under 300KB each for fast loading.
                </div>

                <button type="button" style={A.uploadBtn} onClick={() => imgRef.current.click()}>
                  📸 Choose Images
                </button>
                <input ref={imgRef} type="file" accept="image/*" multiple style={{ display:'none' }}
                  onChange={e => setImgFiles(Array.from(e.target.files))} />

                {imgFiles.length > 0 && (
                  <div style={A.fileChosen}>
                    ✓ {imgFiles.length} file(s): {imgFiles.map(f => f.name).join(', ')}
                  </div>
                )}

                {editing?.imageUrls?.length > 0 && (
                  <div style={{ marginTop:14 }}>
                    <div style={{ fontSize:11, color:'#6B5E4A', marginBottom:8, letterSpacing:'0.1em', textTransform:'uppercase' }}>
                      Current Images
                    </div>
                    <div style={{ display:'flex', flexWrap:'wrap', gap:10 }}>
                      {editing.imageUrls.map((url, i) => (
                        <div key={i} style={{ position:'relative' }}>
                          <img src={url} alt="" style={A.existThumb} />
                          {i === 0 && (
                            <div style={A.primaryBadge}>Primary</div>
                          )}
                          <button type="button" style={A.removeImgBtn}
                            onClick={() => removeImg(editing, url)}>×</button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Section: Video */}
              <div style={A.formSection}>
                <div style={A.formSectionTitle}>Product Video</div>
                <div style={A.uploadHint}>
                  One short MP4 video (under 30 sec, max 100MB). Customers see a ▶ play button on the card.
                </div>
                <button type="button" style={A.uploadBtn} onClick={() => vidRef.current.click()}>
                  🎬 Choose Video
                </button>
                <input ref={vidRef} type="file" accept="video/mp4,video/mov,video/webm"
                  style={{ display:'none' }} onChange={e => setVidFile(e.target.files[0])} />

                {vidFile && (
                  <div style={A.fileChosen}>
                    ✓ {vidFile.name} ({(vidFile.size/1024/1024).toFixed(1)}MB)
                  </div>
                )}
                {editing?.videoUrl && (
                  <div style={{ marginTop:8, fontSize:12, color:'#6B5E4A' }}>
                    Current video:{' '}
                    <a href={editing.videoUrl} target="_blank" rel="noreferrer"
                      style={{ color:'#D4AB5A' }}>View ↗</a>
                    {' — upload a new file to replace it'}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div style={A.modalFooter}>
                <button type="button" style={A.cancelBtn}
                  onClick={() => setShowForm(false)} disabled={saving}>
                  Cancel
                </button>
                <button type="submit" style={saving ? {...A.saveBtn, opacity:0.7} : A.saveBtn} disabled={saving}>
                  {saving ? 'Saving…' : editing ? 'Save Changes' : 'Create Saree'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Field wrapper ─────────────────────────────────────────────
function Field({ label, hint, children }) {
  return (
    <div style={{ flex:1, minWidth:140, display:'flex', flexDirection:'column', gap:5 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline' }}>
        <label style={{ fontSize:10, letterSpacing:'0.15em', textTransform:'uppercase', color:'#8A7560', fontWeight:600 }}>
          {label}
        </label>
        {hint && <span style={{ fontSize:10, color:'#5A4A30' }}>{hint}</span>}
      </div>
      {children}
    </div>
  );
}

// ── Login screen ──────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [u, setU] = useState('');
  const [p, setP] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setErr(''); setLoading(true);
    try {
      const res = await fetch(`${API}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: u, password: p }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      onLogin(data.token);
    } catch (e) { setErr(e.message); }
    finally { setLoading(false); }
  }

  return (
    <div style={A.loginWrap}>
      {/* Background pattern */}
      <div style={A.loginBg} />
      <div style={A.loginBox}>
        <div style={{ fontSize:52, marginBottom:12, textAlign:'center' }}>🥻</div>
        <div style={{ fontFamily:"'Playfair Display',serif", fontSize:28, color:'#F5E9CC', fontWeight:400, textAlign:'center', marginBottom:4 }}>
          City Girl
        </div>
        <div style={{ fontSize:10, letterSpacing:'0.3em', color:'#6B5E4A', textAlign:'center', marginBottom:36, textTransform:'uppercase' }}>
          Admin Panel
        </div>
        <form onSubmit={submit}>
          <input style={{...A.input, display:'block', width:'100%', marginBottom:12}}
            type="text" placeholder="Username" value={u}
            onChange={e => setU(e.target.value)} autoFocus required />
          <input style={{...A.input, display:'block', width:'100%', marginBottom:20}}
            type="password" placeholder="Password" value={p}
            onChange={e => setP(e.target.value)} required />
          {err && (
            <div style={{ color:'#F87171', fontSize:13, marginBottom:14, textAlign:'center' }}>
              {err}
            </div>
          )}
          <button style={{...A.saveBtn, width:'100%', padding:'13px', justifyContent:'center'}} type="submit" disabled={loading}>
            {loading ? 'Logging in…' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}

// ── Admin styles ──────────────────────────────────────────────
const A = {
  wrap:       { display:'flex', minHeight:'100vh', background:'#0D0A06', fontFamily:"'Jost',sans-serif", color:'#C8B08A' },
  sidebar:    { width:220, background:'#120D06', borderRight:'1px solid #2A1E0A', display:'flex', flexDirection:'column', padding:'0 0 24px', flexShrink:0, position:'sticky', top:0, height:'100vh' },
  sidebarLogo:{ padding:'28px 20px 24px', borderBottom:'1px solid #2A1E0A', display:'flex', alignItems:'center', gap:12 },
  logoEmoji:  { fontSize:28 },
  logoText:   { fontFamily:"'Playfair Display',serif", fontSize:18, color:'#F5E9CC', fontWeight:400, fontStyle:'italic' },
  logoSub:    { fontSize:9, letterSpacing:'0.2em', color:'#5A4A30', textTransform:'uppercase', marginTop:2 },
  nav:        { flex:1, padding:'16px 12px', display:'flex', flexDirection:'column', gap:4 },
  navBtn:     { display:'flex', alignItems:'center', gap:10, padding:'11px 12px', borderRadius:8, background:'none', border:'none', color:'#6B5E4A', cursor:'pointer', fontSize:13, fontFamily:"'Jost',sans-serif", fontWeight:500, transition:'all 0.2s', width:'100%' },
  navBtnActive:{ background:'rgba(184,137,42,0.12)', color:'#D4AB5A', borderLeft:'2px solid #D4AB5A' },
  navCount:   { background:'#2A1E0A', color:'#8A7560', borderRadius:12, padding:'1px 8px', fontSize:11, fontWeight:600 },
  navCountActive:{ background:'rgba(184,137,42,0.25)', color:'#D4AB5A' },
  logoutBtn:  { margin:'0 12px', background:'none', border:'1px solid #2A1E0A', color:'#5A4A30', padding:'9px', borderRadius:6, cursor:'pointer', fontSize:12, fontFamily:"'Jost',sans-serif", transition:'all 0.2s' },
  main:       { flex:1, display:'flex', flexDirection:'column', minWidth:0 },
  topbar:     { padding:'24px 28px 20px', borderBottom:'1px solid #1E1408', display:'flex', justifyContent:'space-between', alignItems:'center', background:'#0F0B05' },
  pageTitle:  { fontFamily:"'Playfair Display',serif", fontSize:22, color:'#F5E9CC', fontWeight:400 },
  pageSub:    { fontSize:12, color:'#5A4A30', marginTop:3 },
  searchInput:{ background:'#1A1208', border:'1px solid #2A1E0A', borderRadius:6, padding:'9px 14px', color:'#C8B08A', fontSize:13, fontFamily:"'Jost',sans-serif", outline:'none', width:220 },
  addBtn:     { background:'#B8892A', color:'#0D0A06', border:'none', borderRadius:6, padding:'10px 20px', fontSize:12, fontWeight:700, cursor:'pointer', letterSpacing:'0.08em', fontFamily:"'Jost',sans-serif", transition:'all 0.2s', whiteSpace:'nowrap' },
  toast:      { margin:'16px 28px 0', padding:'12px 18px', borderRadius:8, border:'1px solid', fontSize:13, display:'flex', gap:10, alignItems:'center', background:'#1A3D2A' },
  content:    { padding:'24px 28px', flex:1 },
  loadingWrap:{ display:'flex', flexDirection:'column', alignItems:'center', gap:16, padding:'4rem', color:'#5A4A30', fontSize:13 },
  spinner:    { width:32, height:32, border:'2px solid #2A1E0A', borderTopColor:'#B8892A', borderRadius:'50%', animation:'spin 0.8s linear infinite' },
  tableCard:  { background:'#120D06', border:'1px solid #1E1408', borderRadius:10, overflow:'hidden' },
  table:      { width:'100%', borderCollapse:'collapse', fontSize:13 },
  th:         { textAlign:'left', padding:'12px 14px', fontSize:10, letterSpacing:'0.15em', textTransform:'uppercase', color:'#5A4A30', background:'#0F0B05', borderBottom:'1px solid #1E1408', fontWeight:600 },
  tr:         { borderBottom:'1px solid #1A1208', transition:'background 0.15s' },
  td:         { padding:'12px 14px', verticalAlign:'middle' },
  thumb:      { width:44, height:56, objectFit:'cover', borderRadius:4, border:'1px solid #2A1E0A' },
  thumbPlaceholder: { width:44, height:56, background:'#1E1408', borderRadius:4, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, border:'1px solid #2A1E0A' },
  skuBadge:   { fontFamily:'monospace', fontSize:11, background:'#1A1208', padding:'3px 8px', borderRadius:4, color:'#8A7560', border:'1px solid #2A1E0A' },
  typeBadge:  { fontSize:11, background:'#1E1408', padding:'3px 10px', borderRadius:20, color:'#C8B08A', border:'1px solid #2A1E0A', fontWeight:500 },
  stockGreen: { color:'#4ADE80', fontWeight:600, fontSize:14 },
  stockAmber: { color:'#F5C842', fontWeight:600, fontSize:14 },
  stockRed:   { color:'#F87171', fontWeight:600, fontSize:14 },
  btnTiny:    { background:'none', border:'1px solid #2A1E0A', borderRadius:3, padding:'2px 8px', fontSize:10, cursor:'pointer', color:'#6B5E4A', fontFamily:"'Jost',sans-serif" },
  pillOn:     { background:'rgba(184,137,42,0.15)', border:'1px solid #5A4010', color:'#D4AB5A', borderRadius:20, padding:'3px 10px', fontSize:11, cursor:'pointer', fontFamily:"'Jost',sans-serif" },
  pillOff:    { background:'#1A1208', border:'1px solid #2A1E0A', color:'#5A4A30', borderRadius:20, padding:'3px 10px', fontSize:11, cursor:'pointer', fontFamily:"'Jost',sans-serif" },
  pillGreen:  { background:'rgba(74,222,128,0.1)', border:'1px solid #1A5A32', color:'#4ADE80', borderRadius:20, padding:'3px 10px', fontSize:11, cursor:'pointer', fontFamily:"'Jost',sans-serif" },
  pillGray:   { background:'#1A1208', border:'1px solid #2A1E0A', color:'#5A4A30', borderRadius:20, padding:'3px 10px', fontSize:11, cursor:'pointer', fontFamily:"'Jost',sans-serif" },
  btnEdit:    { background:'none', border:'1px solid #2A1E0A', borderRadius:4, padding:'5px 12px', fontSize:11, cursor:'pointer', color:'#C8B08A', fontFamily:"'Jost',sans-serif", transition:'all 0.2s' },
  btnDel:     { background:'none', border:'1px solid #3D1A1A', borderRadius:4, padding:'5px 12px', fontSize:11, cursor:'pointer', color:'#F87171', fontFamily:"'Jost',sans-serif" },
  statusSelect:{ border:'1px solid', borderRadius:6, padding:'6px 10px', fontSize:12, fontFamily:"'Jost',sans-serif", cursor:'pointer', fontWeight:500 },
  // modal
  modalBg:    { position:'fixed', inset:0, background:'rgba(0,0,0,0.8)', zIndex:1000, display:'flex', alignItems:'flex-start', justifyContent:'center', overflowY:'auto', padding:'40px 16px', backdropFilter:'blur(4px)' },
  modal:      { background:'#120D06', border:'1px solid #2A1E0A', borderRadius:14, width:'100%', maxWidth:800, marginTop:'auto', marginBottom:'auto', overflow:'hidden' },
  modalHead:  { background:'#0F0B05', borderBottom:'1px solid #1E1408', padding:'20px 28px', display:'flex', justifyContent:'space-between', alignItems:'flex-start' },
  modalTitle: { fontFamily:"'Playfair Display',serif", fontSize:20, color:'#F5E9CC', fontWeight:400 },
  modalSub:   { fontSize:12, color:'#5A4A30', marginTop:3 },
  closeBtn:   { background:'none', border:'none', color:'#5A4A30', fontSize:22, cursor:'pointer', padding:0, lineHeight:1, transition:'color 0.2s' },
  modalBody:  { padding:'0 28px 28px', maxHeight:'80vh', overflowY:'auto' },
  formSection:{ borderBottom:'1px solid #1A1208', paddingBottom:20, marginBottom:20, paddingTop:20 },
  formSectionTitle: { fontSize:10, letterSpacing:'0.2em', textTransform:'uppercase', color:'#5A4A30', fontWeight:600, marginBottom:14 },
  formRow:    { display:'flex', gap:14, flexWrap:'wrap', marginBottom:14 },
  input:      { padding:'10px 12px', background:'#0D0A06', border:'1px solid #2A1E0A', borderRadius:6, fontFamily:"'Jost',sans-serif", fontSize:13, color:'#C8B08A', outline:'none', width:'100%', boxSizing:'border-box', transition:'border-color 0.2s' },
  toggleRow:  { display:'flex', gap:24, flexWrap:'wrap' },
  toggleLabel:{ display:'flex', alignItems:'center', gap:10, cursor:'pointer' },
  toggleOn:   { width:38, height:20, background:'#B8892A', borderRadius:10, position:'relative', cursor:'pointer', transition:'background 0.2s' },
  toggleOff:  { width:38, height:20, background:'#2A1E0A', borderRadius:10, position:'relative', cursor:'pointer', border:'1px solid #3A2E1A' },
  toggleKnob: { position:'absolute', top:2, width:16, height:16, background:'#fff', borderRadius:'50%', transition:'transform 0.2s', boxShadow:'0 1px 4px rgba(0,0,0,0.4)' },
  uploadHint: { fontSize:12, color:'#5A4A30', lineHeight:1.6, marginBottom:12 },
  uploadBtn:  { background:'#1A1208', border:'1px solid #2A1E0A', color:'#C8B08A', borderRadius:6, padding:'9px 18px', fontSize:12, cursor:'pointer', fontFamily:"'Jost',sans-serif", transition:'all 0.2s', fontWeight:500 },
  fileChosen: { marginTop:8, fontSize:12, color:'#4ADE80' },
  existThumb: { width:72, height:92, objectFit:'cover', borderRadius:6, border:'1px solid #2A1E0A', display:'block' },
  primaryBadge:{ position:'absolute', top:4, left:4, background:'rgba(184,137,42,0.9)', color:'#0D0A06', fontSize:9, padding:'2px 6px', borderRadius:3, fontWeight:700, letterSpacing:'0.08em' },
  removeImgBtn:{ position:'absolute', top:-6, right:-6, background:'#9B2335', color:'#fff', border:'none', borderRadius:'50%', width:20, height:20, fontSize:14, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', lineHeight:1 },
  modalFooter:{ display:'flex', justifyContent:'flex-end', gap:12, paddingTop:8 },
  cancelBtn:  { background:'none', border:'1px solid #2A1E0A', borderRadius:6, padding:'11px 22px', fontSize:12, cursor:'pointer', color:'#6B5E4A', fontFamily:"'Jost',sans-serif" },
  saveBtn:    { background:'#B8892A', color:'#0D0A06', border:'none', borderRadius:6, padding:'11px 28px', fontSize:12, fontWeight:700, cursor:'pointer', fontFamily:"'Jost',sans-serif", letterSpacing:'0.08em', transition:'all 0.2s', display:'flex', alignItems:'center', gap:8 },
  // login
  loginWrap:  { minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#0D0A06', position:'relative', overflow:'hidden' },
  loginBg:    { position:'absolute', inset:0, backgroundImage:'radial-gradient(ellipse at 50% 50%, rgba(184,137,42,0.08) 0%, transparent 70%)' },
  loginBox:   { background:'#120D06', border:'1px solid #2A1E0A', borderRadius:14, padding:'48px 44px', width:360, position:'relative', boxShadow:'0 32px 80px rgba(0,0,0,0.5)' },
};
