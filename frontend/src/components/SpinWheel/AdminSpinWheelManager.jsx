import React, { useEffect, useRef, useState } from 'react';
import '../../styles/Loading-Animation.css';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const CANVAS_SIZE = 220;

const SEGMENT_TYPES = [
  { value: 'percent',       label: '% Discount' },
  { value: 'flat',          label: '₹ Flat Off'  },
  { value: 'free_shipping', label: 'Free Shipping' },
  { value: 'none',          label: 'No Offer'    },
  { value: 'free_product',  label: 'Free Product' }
];

const DEFAULT_COLORS = [
  '#E85D04','#3E2723','#1565C0','#2E7D32',
  '#757575','#AD1457','#F57F17','#00695C'
];

/* ── Mini canvas preview ─────────────────────────────────────────── */
function drawPreview(canvas, segments) {
  if (!canvas || segments.length === 0) return;
  const ctx = canvas.getContext('2d');
  const size = canvas.width;
  const cx = size / 2, cy = size / 2;
  const radius = size / 2 - 4;
  const arc = (2 * Math.PI) / segments.length;
  ctx.clearRect(0, 0, size, size);

  segments.forEach((seg, i) => {
    const start = i * arc - Math.PI / 2;
    const end   = start + arc;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, radius, start, end);
    ctx.closePath();
    ctx.fillStyle = seg.color || '#888';
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(start + arc / 2);
    ctx.textAlign = 'right';
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 10px Inter, sans-serif';
    ctx.shadowColor = 'rgba(0,0,0,0.7)';
    ctx.shadowBlur = 3;
    ctx.fillText(seg.label || '…', radius - 8, 4);
    ctx.restore();
  });

  // Center hub
  ctx.beginPath();
  ctx.arc(cx, cy, 16, 0, 2 * Math.PI);
  ctx.fillStyle = '#1a1a2e';
  ctx.fill();
}

/* ═══════════════════════════════════════════════════════════════════
   Component
═══════════════════════════════════════════════════════════════════ */
export default function AdminSpinWheelManager() {
  const [segments, setSegments]   = useState([]);
  const [isActive, setIsActive]   = useState(true);
  const [spinRecords, setSpinRecords] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [message, setMessage]     = useState('');
  const [msgType, setMsgType]     = useState('success');
  const [expandedOffers, setExpandedOffers] = useState({});
  const [activeTab, setActiveTab] = useState('config');
  const [coupons, setCoupons]     = useState([]);
  const [searchCoupon, setSearchCoupon] = useState('');
  const canvasRef = useRef(null);

  const toggleOffer = (label) => {
    setExpandedOffers(prev => ({ ...prev, [label]: !prev[label] }));
  };

  /* ── Fetch config ──────────────────────────────────────────────── */
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const token = localStorage.getItem('token');
    try {
      const [configRes, couponsRes] = await Promise.all([
        fetch(`${API}/api/spin-wheel/admin`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API}/api/spin-wheel/admin/coupons`, { headers: { Authorization: `Bearer ${token}` } })
      ]);
      const d = await configRes.json();
      const coups = await couponsRes.json();

      setSegments(d.segments || []);
      setIsActive(d.isActive !== false);
      setSpinRecords(d.spinRecords || []);
      setCoupons(Array.isArray(coups) ? coups : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteCoupon = async (id) => {
    if (!window.confirm('Delete and revoke this coupon?')) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API}/api/spin-wheel/admin/coupons/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setCoupons(prev => prev.filter(c => c._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  /* ── Redraw preview whenever segments change ────────────────────── */
  useEffect(() => {
    if (canvasRef.current) drawPreview(canvasRef.current, segments);
  }, [segments]);

  /* ── Segment CRUD helpers ───────────────────────────────────────── */
  function addSegment() {
    if (segments.length >= 8) return;
    setSegments(prev => [
      ...prev,
      {
        label: 'New Offer',
        color: DEFAULT_COLORS[prev.length % DEFAULT_COLORS.length],
        value: '0',
        type: 'none',
        maxWins: 0
      }
    ]);
  }

  function removeSegment(i) {
    setSegments(prev => prev.filter((_, idx) => idx !== i));
  }

  function updateSegment(i, field, val) {
    setSegments(prev => prev.map((seg, idx) => idx === i ? { ...seg, [field]: val } : seg));
  }

  /* ── Save ───────────────────────────────────────────────────────── */
  async function handleSave() {
    if (segments.length < 2) { setMessage('Add at least 2 segments.'); setMsgType('error'); return; }
    setSaving(true);
    setMessage('');
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API}/api/spin-wheel/admin`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ segments, isActive })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setMessage('Wheel configuration saved successfully!');
      setMsgType('success');
    } catch (err) {
      setMessage(err.message || 'Save failed.');
      setMsgType('error');
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(''), 4000);
    }
  }

  /* ── Styles (inline — no extra CSS file needed) ─────────────────── */
  const s = {
    page:        { padding: '0', fontFamily: 'Inter, sans-serif' },
    headerRow:   { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 },
    h1:          { fontSize: 24, fontWeight: 800, color: '#1a1a2e', margin: 0 },
    grid:        { display: 'grid', gridTemplateColumns: '1fr 260px', gap: 28, alignItems: 'start' },
    card:        { background: '#fff', borderRadius: 16, padding: '28px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' },
    sectionTitle:{ fontSize: 16, fontWeight: 700, color: '#333', marginBottom: 16, marginTop: 0 },
    row:         {
      display: 'grid',
      gridTemplateColumns: '1fr 100px 80px 110px 80px 36px',
      gap: 8, alignItems: 'center', marginBottom: 10
    },
    input:       {
      padding: '8px 12px', border: '1px solid #ddd', borderRadius: 8,
      fontSize: 13, width: '100%', boxSizing: 'border-box'
    },
    select:      {
      padding: '8px 8px', border: '1px solid #ddd', borderRadius: 8,
      fontSize: 13, width: '100%', background: '#fff', boxSizing: 'border-box'
    },
    colorInput:  { width: '100%', height: 36, border: '1px solid #ddd', borderRadius: 8, cursor: 'pointer', padding: 2 },
    delBtn:      {
      background: '#fce4e4', border: 'none', borderRadius: 8, color: '#c62828',
      fontSize: 18, cursor: 'pointer', width: 36, height: 36, display: 'flex',
      alignItems: 'center', justifyContent: 'center', flexShrink: 0
    },
    addBtn:      {
      background: '#E85D04', color: '#fff', border: 'none', borderRadius: 10,
      padding: '10px 20px', cursor: 'pointer', fontWeight: 700, fontSize: 13,
      marginTop: 8, display: 'inline-flex', alignItems: 'center', gap: 6
    },
    saveBtn:     {
      background: '#2E7D32', color: '#fff', border: 'none', borderRadius: 10,
      padding: '13px 32px', cursor: saving ? 'not-allowed' : 'pointer',
      fontWeight: 800, fontSize: 15, marginTop: 20, opacity: saving ? 0.6 : 1
    },
    toggle:      { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 },
    toggleLabel: { fontSize: 14, color: '#444', fontWeight: 600 },
    msgSuccess:  { background: '#e8f5e9', color: '#2E7D32', borderRadius: 8, padding: '10px 16px', fontSize: 13, marginTop: 10 },
    msgError:    { background: '#fce4e4', color: '#c62828', borderRadius: 8, padding: '10px 16px', fontSize: 13, marginTop: 10 },
    colHeader:   { fontSize: 11, color: '#888', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 },
    previewCard: {
      background: '#1a1a2e', borderRadius: 16, padding: 24,
      boxShadow: '0 4px 24px rgba(0,0,0,0.12)', display: 'flex',
      flexDirection: 'column', alignItems: 'center', gap: 14
    },
    previewTitle:{ color: '#fff', fontWeight: 800, fontSize: 14, margin: 0 },
    previewCanvas:{ borderRadius: '50%', boxShadow: '0 0 0 4px rgba(255,255,255,0.1)' },
    badge:    { background: 'rgba(232,93,4,0.15)', color: '#E85D04', borderRadius: 6, padding: '2px 10px', fontSize: 12, fontWeight: 700 },
    recTable: { width: '100%', borderCollapse: 'collapse', fontSize: 13 },
    recTh:    { textAlign: 'left', padding: '8px 10px', background: '#f5f5f5', color: '#555', fontWeight: 700, borderBottom: '2px solid #eee' },
    recTd:    { padding: '8px 10px', borderBottom: '1px solid #f0f0f0', color: '#333', verticalAlign: 'middle' },
    tabRow:   { display: 'flex', gap: 16, marginBottom: 24, paddingBottom: 10, borderBottom: '2px solid #eee' },
    tabBtn: (active) => ({
      background: 'none', border: 'none', padding: '10px 18px', cursor: 'pointer',
      fontSize: 15, fontWeight: 700, color: active ? '#E85D04' : '#666',
      borderBottom: active ? '3px solid #E85D04' : '3px solid transparent',
      transition: 'all 0.2s', marginBottom: '-12px'
    }),
  };

  /* ── Group spin records by segment label ── */
  const recordsByOffer = spinRecords.reduce((acc, rec) => {
    const label = rec.wonLabel || 'Unknown Offer';
    if (!acc[label]) acc[label] = [];
    acc[label].push(rec);
    return acc;
  }, {});

  if (loading) return (
        <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Rolling Wheel</p>
        </div>
    );

  return (
    <div style={s.page}>
      {/* Header */}
      <div style={s.headerRow}>
        <h1 style={s.h1}>Spin Wheel Offers</h1>
        <span style={s.badge}>{segments.length} / 8 segments</span>
      </div>

      <div style={s.tabRow}>
        <button style={s.tabBtn(activeTab === 'config')} onClick={() => setActiveTab('config')}>Wheel Configuration</button>
        <button style={s.tabBtn(activeTab === 'winners')} onClick={() => setActiveTab('winners')}>Spin Winners</button>
        <button style={s.tabBtn(activeTab === 'coupons')} onClick={() => setActiveTab('coupons')}>Coupon Management</button>
      </div>

      {activeTab === 'config' && (
      <div style={s.grid}>
        {/* ── Left: Segment editor ── */}
        <div style={s.card}>
          <h2 style={s.sectionTitle}>Wheel Segments</h2>

          {/* Active toggle */}
          <div style={s.toggle}>
            <input
              type="checkbox" id="sw-active"
              checked={isActive}
              onChange={e => setIsActive(e.target.checked)}
              style={{ width: 18, height: 18, cursor: 'pointer' }}
            />
            <label htmlFor="sw-active" style={s.toggleLabel}>Publish Wheel (visible to users)</label>
          </div>

          {/* Column headers */}
          <div style={{ ...s.row, marginBottom: 2 }}>
            <span style={s.colHeader}>Label</span>
            <span style={s.colHeader}>Value</span>
            <span style={s.colHeader}>Color</span>
            <span style={s.colHeader}>Type</span>
            <span style={s.colHeader}>Max Wins</span>
            <span />
          </div>

          {/* Segments list */}
          {segments.map((seg, i) => (
            <div key={i} style={s.row}>
              <input
                style={s.input}
                value={seg.label}
                onChange={e => updateSegment(i, 'label', e.target.value)}
                placeholder="e.g. 10% OFF"
                maxLength={20}
              />
              <input
                style={s.input}
                value={seg.value}
                onChange={e => updateSegment(i, 'value', e.target.value)}
                placeholder="10"
                type="number"
                min="0"
              />
              <input
                type="color"
                style={s.colorInput}
                value={seg.color}
                onChange={e => updateSegment(i, 'color', e.target.value)}
              />
              <select
                style={s.select}
                value={seg.type}
                onChange={e => updateSegment(i, 'type', e.target.value)}
              >
                {SEGMENT_TYPES.map(t => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
              <input
                style={s.input}
                value={seg.maxWins !== undefined ? seg.maxWins : 0}
                onChange={e => updateSegment(i, 'maxWins', Number(e.target.value))}
                placeholder="Unl."
                type="number"
                min={0} 
                title="Max wins (0 for unlimited)"
              />
              <button style={s.delBtn} onClick={() => removeSegment(i)} title="Remove">×</button>
            </div>
          ))}

          {segments.length < 8 && (
            <button style={s.addBtn} onClick={addSegment}>＋ Add Segment</button>
          )}

          <br />
          <button style={s.saveBtn} onClick={handleSave} disabled={saving}>
            {saving ? 'Saving…' : 'Save Changes'}
          </button>

          {message && (
            <div style={msgType === 'success' ? s.msgSuccess : s.msgError}>{message}</div>
          )}
        </div>

        {/* ── Right: Live preview ── */}
        <div>
          <div style={s.previewCard}>
            <p style={s.previewTitle}>Live Preview</p>
            <canvas
              ref={canvasRef}
              width={CANVAS_SIZE}
              height={CANVAS_SIZE}
              style={s.previewCanvas}
            />
          </div>
        </div>
      </div>
      )}

      {/* ── Spin Records Grouped by Segment ── */}
      {activeTab === 'winners' && (
        <div>
          <h2 style={{ ...s.sectionTitle, marginBottom: 20 }}>Spin Records by Segment ({spinRecords.length} users)</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {spinRecords.length > 0 ? (
              Object.entries(recordsByOffer).map(([label, records], idx) => {
              const matchingSeg = segments.find(s => s.label === label);
              const color = matchingSeg ? matchingSeg.color : '#888';
              const isExpanded = !!expandedOffers[label];

              return (
                <div key={idx} style={{ ...s.card, padding: '16px' }}>
                  <div 
                    onClick={() => toggleOffer(label)}
                    style={{ 
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
                      cursor: 'pointer', userSelect: 'none' 
                    }}
                  >
                    <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: color }}></span>
                      {label} <span style={{ color: '#888', fontSize: 13, fontWeight: 'normal' }}>({records.length} winners)</span>
                    </h3>
                    <span style={{ fontSize: 18, color: '#666', transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                      ▼
                    </span>
                  </div>
                  
                  {isExpanded && (
                    <div style={{ marginTop: 16, maxHeight: '250px', overflowY: 'auto', border: '1px solid #eee', borderRadius: '8px' }}>
                      <table style={{...s.recTable, fontSize: 13}}>
                        <thead>
                          <tr>
                            <th style={{...s.recTh, padding: '8px 10px', position: 'sticky', top: 0, zIndex: 1}}>User</th>
                            <th style={{...s.recTh, padding: '8px 10px', position: 'sticky', top: 0, zIndex: 1}}>Date</th>
                            <th style={{...s.recTh, padding: '8px 10px', position: 'sticky', top: 0, zIndex: 1}}>Coupon Code</th>
                          </tr>
                        </thead>
                        <tbody>
                          {records.map((rec, i) => (
                            <tr key={i}>
                              <td style={{...s.recTd, padding: '8px 10px'}}>
                                {rec.userId?.name || rec.userId?.email || rec.userId?.phone || 'Unknown'}
                              </td>
                              <td style={{...s.recTd, padding: '8px 10px', color: '#666'}}>
                                {rec.spunAt ? new Date(rec.spunAt).toLocaleDateString() : '—'}
                              </td>
                              <td style={{...s.recTd, padding: '8px 10px', color: '#333', fontWeight: 600}}>
                                {rec.couponCode || '—'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              );
              })
            ) : (
              <p style={{ color: '#666', fontSize: 14 }}>No Winners Yet</p>
            )}
          </div>
        </div>
      )}

      {/* ── Coupons Management ── */}
      {activeTab === 'coupons' && (() => {
        const filteredCoupons = coupons.filter(c => {
          if (!searchCoupon) return true;
          const searchLower = searchCoupon.toLowerCase();
          const matchCode = c.code.toLowerCase().includes(searchLower);
          const matchName = c.user?.name?.toLowerCase().includes(searchLower);
          const matchEmail = c.user?.email?.toLowerCase().includes(searchLower);
          return matchCode || matchName || matchEmail;
        });

        return (
          <div style={s.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h2 style={{ ...s.sectionTitle, marginBottom: 0 }}>Coupons ({coupons.length})</h2>
              <input
                style={{ ...s.input, width: '250px' }}
                placeholder="Search code, name or email..."
                value={searchCoupon}
                onChange={e => setSearchCoupon(e.target.value)}
              />
            </div>
            
            {coupons.length === 0 ? (
              <p style={{ color: '#666', fontSize: 14 }}>No coupons have been generated yet.</p>
            ) : filteredCoupons.length === 0 ? (
              <p style={{ color: '#666', fontSize: 14 }}>No coupons match your search.</p>
            ) : (
              <div style={{ border: '1px solid #eee', borderRadius: '8px', overflowX: 'auto' }}>
                <table style={{...s.recTable, fontSize: 13}}>
                  <thead>
                    <tr>
                      <th style={{...s.recTh, padding: '12px 10px'}}>Coupon Code</th>
                      <th style={{...s.recTh, padding: '12px 10px'}}>Won User</th>
                      <th style={{...s.recTh, padding: '12px 10px'}}>Validity</th>
                      <th style={{...s.recTh, padding: '12px 10px'}}>Reward</th>
                      <th style={{...s.recTh, padding: '12px 10px'}}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCoupons.map((c) => {
                      const isExpired = !c.isActive || (c.validUntil && new Date(c.validUntil) < new Date());
                      return (
                        <tr key={c._id}>
                          <td style={{...s.recTd, padding: '12px 10px', fontWeight: 800, color: '#E85D04'}}>
                            {c.code}
                          </td>
                          <td style={{...s.recTd, padding: '12px 10px'}}>
                            {c.user?.name || c.user?.email || 'Unknown'}
                          </td>
                          <td style={{...s.recTd, padding: '12px 10px', color: isExpired ? '#c62828' : '#2E7D32'}}>
                            {c.validUntil ? new Date(c.validUntil).toLocaleDateString() : '—'} 
                            {isExpired && ' (Expired)'}
                          </td>
                          <td style={{...s.recTd, padding: '12px 10px'}}>
                            {c.discountType !== 'none' ? `${c.discountValue} ${c.discountType === 'percent' ? '%' : 'flat'}` : '—'}
                          </td>
                          <td style={{...s.recTd, padding: '12px 10px'}}>
                            <button 
                              onClick={() => deleteCoupon(c._id)}
                              style={{ background: '#fce4e4', border: '1px solid #ffcdd2', padding: '6px 12px', borderRadius: '6px', color: '#c62828', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      })()}
    </div>
  );
}
