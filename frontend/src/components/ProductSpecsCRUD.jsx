import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API = 'http://localhost:2004/api/products';

const FIELDS = [
    { name: 'brand', label: 'Brand' },
    { name: 'isin', label: 'ISIN' },
    { name: 'offerId', label: 'Offer ID' },
    { name: 'modelNumber', label: 'Brand Model Number' },
    { name: 'collectionName', label: 'Brand Collection Name' },
    { name: 'size', label: 'Size / Dimensions' },
    { name: 'colour', label: 'Brand Colour' },
    { name: 'material', label: 'Material' },
    { name: 'packOf', label: 'Pack Of' },
    { name: 'countryOfOrigin', label: 'Country of Origin' },
    { name: 'customerCareAddress', label: 'Customer Care Address' },
    { name: 'manufacturedBy', label: 'Manufactured By' },
    { name: 'packedBy', label: 'Packed By' },
];

const emptySpec = () => Object.fromEntries(FIELDS.map(f => [f.name, '']));

/* ─── Design tokens ─────────────────────────────────────── */
const card = {
    backgroundColor: '#fff',
    borderRadius: '12px',
    border: '1px solid #e5e7eb',
    padding: '24px',
    marginBottom: '28px',
    boxShadow: '0 1px 6px rgba(0,0,0,0.07)',
};

const inp = {
    width: '100%',
    padding: '9px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '7px',
    fontSize: '13px',
    boxSizing: 'border-box',
    outline: 'none',
    backgroundColor: '#fafafa',
};

const lbl = {
    display: 'block',
    marginBottom: '4px',
    fontWeight: '600',
    fontSize: '12px',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.4px',
};

const btn = (bg = '#E85D04', extra = {}) => ({
    padding: '9px 20px',
    backgroundColor: bg,
    color: 'white',
    border: 'none',
    borderRadius: '7px',
    cursor: 'pointer',
    fontWeight: '700',
    fontSize: '13px',
    ...extra,
});

/* ─── Live Customer Preview Card ──────────────────────────── */
const ProductPreviewCard = ({ spec, imagePreview }) => {
    const hasAny = Object.values(spec).some(v => v.trim());

    return (
        <div style={{
            position: 'sticky',
            top: '20px',
            backgroundColor: '#fff',
            borderRadius: '14px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
            overflow: 'hidden',
            border: '1px solid #e5e7eb',
            minHeight: '400px',
        }}>
            {/* Header badge */}
            <div style={{
                backgroundColor: '#E85D04',
                padding: '8px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
            }}>
                <span style={{ fontSize: '12px', fontWeight: '700', color: 'white', letterSpacing: '1px' }}>
                    👁 CUSTOMER PREVIEW
                </span>
            </div>

            {/* Product image */}
            <div style={{
                backgroundColor: '#f3f4f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '200px',
                position: 'relative',
                overflow: 'hidden',
            }}>
                {imagePreview ? (
                    <img src={imagePreview} alt="Product" style={{
                        width: '100%', height: '100%', objectFit: 'contain', padding: '10px',
                    }} />
                ) : (
                    <div style={{ textAlign: 'center', color: '#d1d5db' }}>
                        <div style={{ fontSize: '56px', lineHeight: 1 }}>📦</div>
                        <p style={{ fontSize: '12px', marginTop: '8px', color: '#9ca3af' }}>No image uploaded</p>
                    </div>
                )}
                {spec.collectionName && (
                    <div style={{
                        position: 'absolute', top: 10, left: 10,
                        backgroundColor: '#E85D04', color: 'white',
                        fontSize: '11px', fontWeight: '700',
                        padding: '3px 10px', borderRadius: '99px',
                    }}>
                        {spec.collectionName}
                    </div>
                )}
            </div>

            {/* Product info */}
            <div style={{ padding: '16px 18px' }}>
                {spec.brand ? (
                    <p style={{
                        fontSize: '11px', color: '#E85D04', fontWeight: '700',
                        textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px'
                    }}>
                        {spec.brand}
                    </p>
                ) : (
                    <p style={{ fontSize: '11px', color: '#d1d5db', marginBottom: '4px' }}>Brand name</p>
                )}

                <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#111827', margin: '0 0 4px' }}>
                    {spec.modelNumber || <span style={{ color: '#d1d5db' }}>Model Number</span>}
                </h3>

                {spec.colour && (
                    <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>
                        🎨 {spec.colour}
                        {spec.size ? ` · ${spec.size}` : ''}
                    </p>
                )}
                {spec.material && (
                    <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>🧵 {spec.material}</p>
                )}

                {/* Spec table */}
                {hasAny && (
                    <div style={{ marginTop: '14px', borderTop: '1px solid #f3f4f6', paddingTop: '14px' }}>
                        <p style={{
                            fontSize: '11px', fontWeight: '700', color: '#374151',
                            textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px'
                        }}>
                            Specifications
                        </p>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                            <tbody>
                                {FIELDS.filter(f => spec[f.name]).map(({ name, label }) => (
                                    <tr key={name} style={{ borderBottom: '1px solid #f9fafb' }}>
                                        <td style={{ padding: '5px 4px', color: '#6b7280', width: '45%', fontWeight: '500' }}>
                                            {label}
                                        </td>
                                        <td style={{ padding: '5px 4px', color: '#111827', fontWeight: '600' }}>
                                            {spec[name]}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {!hasAny && (
                    <p style={{ marginTop: '20px', color: '#d1d5db', fontSize: '13px', textAlign: 'center' }}>
                        Fill in the form to see a live preview ✨
                    </p>
                )}
            </div>
        </div>
    );
};

/* ─── Main Component ────────────────────────────────────── */
const ProductSpecsCRUD = () => {

    // ── Add-product form ──
    const [spec, setSpec] = useState(emptySpec);
    const [imagePreview, setImagePreview] = useState(null);
    const [addError, setAddError] = useState('');
    const [addLoading, setAddLoading] = useState(false);

    // ── Product list ──
    const [products, setProducts] = useState([]);
    const [listLoading, setListLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [filterBrand, setFilterBrand] = useState('');
    const [filterColour, setFilterColour] = useState('');

    // ── Edit & Offer modals ──
    const [editProduct, setEditProduct] = useState(null);
    const [editData, setEditData] = useState({});
    const [offerProduct, setOfferProduct] = useState(null);
    const [offerData, setOfferData] = useState({ discountPercent: '', offerLabel: '', offerExpiry: '' });
    const [saveMsg, setSaveMsg] = useState('');

    /* ── Fetch ── */
    const fetchProducts = useCallback(async () => {
        setListLoading(true);
        try {
            const params = {};
            if (search) params.search = search;
            if (filterBrand) params.brand = filterBrand;
            if (filterColour) params.colour = filterColour;
            const res = await axios.get(API, { params });
            setProducts(res.data);
        } catch {
            setProducts([]);
        } finally {
            setListLoading(false);
        }
    }, [search, filterBrand, filterColour]);

    useEffect(() => { fetchProducts(); }, [fetchProducts]);

    /* ── Add product ── */
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        setAddError('');
        if (!spec.brand.trim()) { setAddError('Brand is required.'); return; }
        setAddLoading(true);
        try {
            await axios.post(API, { ...spec, imageUrl: imagePreview });
            setSpec(emptySpec());
            setImagePreview(null);
            e.target.reset();
            fetchProducts();
        } catch (err) {
            setAddError(err.response?.data?.message || 'Failed to save product.');
        } finally {
            setAddLoading(false);
        }
    };

    /* ── Edit ── */
    const openEdit = (p) => { setEditProduct(p); setEditData({ ...p }); setSaveMsg(''); };
    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditData(prev => ({ ...prev, [name]: value }));
    };
    const handleEditSave = async () => {
        try {
            await axios.put(`${API}/${editProduct._id}`, editData);
            setSaveMsg('✓ Saved');
            fetchProducts();
            setTimeout(() => { setEditProduct(null); setSaveMsg(''); }, 800);
        } catch { setSaveMsg('✗ Save failed'); }
    };

    /* ── Offer ── */
    const openOffer = (p) => {
        setOfferProduct(p);
        setOfferData({
            discountPercent: p.offer?.discountPercent ?? '',
            offerLabel: p.offer?.offerLabel ?? '',
            offerExpiry: p.offer?.offerExpiry ? p.offer.offerExpiry.split('T')[0] : '',
        });
        setSaveMsg('');
    };
    const handleOfferSave = async () => {
        try {
            await axios.put(`${API}/${offerProduct._id}`, { offer: offerData });
            setSaveMsg('✓ Offer saved');
            fetchProducts();
            setTimeout(() => { setOfferProduct(null); setSaveMsg(''); }, 800);
        } catch { setSaveMsg('✗ Failed'); }
    };

    /* ── Delete ── */
    const handleDelete = async (id) => {
        if (!window.confirm('Delete this product?')) return;
        await axios.delete(`${API}/${id}`);
        fetchProducts();
    };

    const brands = [...new Set(products.map(p => p.brand).filter(Boolean))];
    const colours = [...new Set(products.map(p => p.colour).filter(Boolean))];

    /* ─────────────────── RENDER ──────────────────────────── */
    return (
        <div style={{ padding: '24px', width: '100%', boxSizing: 'border-box' }}>

            {/* ══════════ ADD PRODUCT — split layout ══════════ */}
            <div style={{ ...card, padding: 0, overflow: 'hidden' }}>
                {/* Section header */}
                <div style={{
                    padding: '16px 24px',
                    borderBottom: '1px solid #f3f4f6',
                    backgroundColor: '#fafafa',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                }}>
                    <span style={{ fontSize: '18px' }}>➕</span>
                    <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#111827' }}>
                        Add Product Specification
                    </h2>
                </div>

                {/* Two-column body */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 340px',
                    gap: 0,
                }}>
                    {/* ── LEFT: Form ── */}
                    <div style={{ padding: '24px', borderRight: '1px solid #f3f4f6' }}>
                        <form onSubmit={handleAddSubmit}>
                            {addError && (
                                <p style={{
                                    color: '#dc2626', marginBottom: '14px', fontSize: '13px',
                                    backgroundColor: '#fef2f2', padding: '10px 14px', borderRadius: '6px'
                                }}>
                                    {addError}
                                </p>
                            )}

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                                {FIELDS.map(({ name, label }) => (
                                    <div key={name}>
                                        <label style={lbl}>{label}</label>
                                        <input
                                            type="text"
                                            name={name}
                                            value={spec[name]}
                                            onChange={e => setSpec(prev => ({ ...prev, [name]: e.target.value }))}
                                            placeholder={`Enter ${label}`}
                                            style={inp}
                                        />
                                    </div>
                                ))}
                            </div>

                            {/* Image upload */}
                            <div style={{ marginTop: '20px' }}>
                                <label style={lbl}>Product Image</label>
                                <input type="file" accept="image/*" onChange={handleImageChange}
                                    style={{ fontSize: '13px', cursor: 'pointer' }} />
                            </div>

                            <button type="submit" disabled={addLoading}
                                style={btn('#E85D04', { marginTop: '20px', fontSize: '14px', padding: '10px 28px' })}>
                                {addLoading ? 'Saving…' : '💾 Save Product'}
                            </button>
                        </form>
                    </div>

                    {/* ── RIGHT: Live Preview ── */}
                    <div style={{ padding: '24px', backgroundColor: '#f9fafb' }}>
                        <ProductPreviewCard spec={spec} imagePreview={imagePreview} />
                    </div>
                </div>
            </div>

            {/* ══════════ PRODUCT LIST ══════════ */}
            <div style={card}>
                <div style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    marginBottom: '18px', paddingBottom: '16px', borderBottom: '1px solid #f3f4f6',
                }}>
                    <span style={{ fontSize: '18px' }}>📋</span>
                    <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#111827' }}>All Products</h2>
                    <span style={{
                        marginLeft: 'auto', fontSize: '13px', color: '#6b7280',
                        backgroundColor: '#f3f4f6', padding: '3px 12px', borderRadius: '99px'
                    }}>
                        {products.length} products
                    </span>
                </div>

                {/* Search + Filters */}
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
                    <input
                        type="text"
                        placeholder="🔍  Search brand, model, material…"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={{ ...inp, flex: '1 1 260px' }}
                    />
                    <select value={filterBrand} onChange={e => setFilterBrand(e.target.value)}
                        style={{ ...inp, flex: '0 0 150px' }}>
                        <option value="">All Brands</option>
                        {brands.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                    <select value={filterColour} onChange={e => setFilterColour(e.target.value)}
                        style={{ ...inp, flex: '0 0 150px' }}>
                        <option value="">All Colours</option>
                        {colours.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <button onClick={() => { setSearch(''); setFilterBrand(''); setFilterColour(''); }}
                        style={btn('#6b7280', { padding: '9px 16px' })}>Clear</button>
                </div>

                {/* Table */}
                {listLoading ? (
                    <p style={{ color: '#6b7280', textAlign: 'center', padding: '40px' }}>Loading…</p>
                ) : products.length === 0 ? (
                    <p style={{ color: '#9ca3af', textAlign: 'center', padding: '40px', fontSize: '15px' }}>
                        No products found.
                    </p>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#f9fafb', textAlign: 'left' }}>
                                    {['Image', 'Brand', 'Model No.', 'Colour', 'Material', 'Offer', 'Actions'].map(h => (
                                        <th key={h} style={{
                                            padding: '12px 14px', borderBottom: '2px solid #e5e7eb',
                                            fontWeight: '700', color: '#374151', whiteSpace: 'nowrap'
                                        }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((p, i) => (
                                    <tr key={p._id}
                                        style={{
                                            borderBottom: '1px solid #f3f4f6',
                                            backgroundColor: i % 2 === 0 ? '#fff' : '#fafafa'
                                        }}>
                                        <td style={{ padding: '10px 14px' }}>
                                            {p.imageUrl
                                                ? <img src={p.imageUrl} alt="" style={{
                                                    width: '52px', height: '52px',
                                                    objectFit: 'cover', borderRadius: '7px', border: '1px solid #e5e7eb'
                                                }} />
                                                : <div style={{
                                                    width: '52px', height: '52px', borderRadius: '7px',
                                                    backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center',
                                                    justifyContent: 'center', fontSize: '22px'
                                                }}>📦</div>
                                            }
                                        </td>
                                        <td style={{ padding: '10px 14px', fontWeight: '700', color: '#111827' }}>{p.brand}</td>
                                        <td style={{ padding: '10px 14px', color: '#6b7280' }}>{p.modelNumber || '—'}</td>
                                        <td style={{ padding: '10px 14px', color: '#6b7280' }}>{p.colour || '—'}</td>
                                        <td style={{ padding: '10px 14px', color: '#6b7280' }}>{p.material || '—'}</td>
                                        <td style={{ padding: '10px 14px' }}>
                                            {p.offer?.discountPercent > 0 ? (
                                                <span style={{
                                                    backgroundColor: '#dcfce7', color: '#15803d',
                                                    padding: '3px 10px', borderRadius: '99px', fontWeight: '700', fontSize: '12px'
                                                }}>
                                                    {p.offer.discountPercent}% OFF
                                                    {p.offer.offerLabel ? ` · ${p.offer.offerLabel}` : ''}
                                                </span>
                                            ) : (
                                                <span style={{ color: '#9ca3af', fontSize: '12px' }}>No offer</span>
                                            )}
                                        </td>
                                        <td style={{ padding: '10px 14px' }}>
                                            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                                <button onClick={() => openEdit(p)} style={btn('#2563eb', { padding: '6px 12px', fontSize: '12px' })}>
                                                    ✏️ Edit
                                                </button>
                                                <button onClick={() => openOffer(p)} style={btn('#7c3aed', { padding: '6px 12px', fontSize: '12px' })}>
                                                    🏷 Offer
                                                </button>
                                                <button onClick={() => handleDelete(p._id)} style={btn('#dc2626', { padding: '6px 12px', fontSize: '12px' })}>
                                                    🗑 Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* ══════════ EDIT SPECS MODAL ══════════ */}
            {editProduct && (
                <ModalOverlay onClose={() => setEditProduct(null)}>
                    <h3 style={{ marginBottom: '18px', fontSize: '17px', color: '#111827' }}>
                        ✏️ Edit Specs — <span style={{ color: '#E85D04' }}>{editProduct.brand}</span>
                    </h3>
                    <div style={{
                        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px',
                        maxHeight: '58vh', overflowY: 'auto', paddingRight: '6px'
                    }}>
                        {FIELDS.map(({ name, label }) => (
                            <div key={name}>
                                <label style={lbl}>{label}</label>
                                <input type="text" name={name} value={editData[name] || ''}
                                    onChange={handleEditChange} style={inp} />
                            </div>
                        ))}
                    </div>
                    <div style={{ marginTop: '18px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <button onClick={handleEditSave} style={btn('#2563eb')}>Save Changes</button>
                        <button onClick={() => setEditProduct(null)} style={btn('#6b7280')}>Cancel</button>
                        {saveMsg && <span style={{
                            fontSize: '13px',
                            color: saveMsg.startsWith('✓') ? '#16a34a' : '#dc2626'
                        }}>{saveMsg}</span>}
                    </div>
                </ModalOverlay>
            )}

            {/* ══════════ OFFER MODAL ══════════ */}
            {offerProduct && (
                <ModalOverlay onClose={() => setOfferProduct(null)}>
                    <h3 style={{ marginBottom: '18px', fontSize: '17px', color: '#111827' }}>
                        🏷 Add / Edit Offer — <span style={{ color: '#7c3aed' }}>{offerProduct.brand}</span>
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        <div>
                            <label style={lbl}>Discount (%)</label>
                            <input type="number" min="0" max="100" value={offerData.discountPercent}
                                onChange={e => setOfferData(p => ({ ...p, discountPercent: e.target.value }))}
                                placeholder="e.g. 20" style={inp} />
                        </div>
                        <div>
                            <label style={lbl}>Offer Label</label>
                            <input type="text" value={offerData.offerLabel}
                                onChange={e => setOfferData(p => ({ ...p, offerLabel: e.target.value }))}
                                placeholder="e.g. Summer Sale" style={inp} />
                        </div>
                        <div>
                            <label style={lbl}>Offer Expiry Date</label>
                            <input type="date" value={offerData.offerExpiry}
                                onChange={e => setOfferData(p => ({ ...p, offerExpiry: e.target.value }))}
                                style={inp} />
                        </div>

                        {/* Offer preview */}
                        {offerData.discountPercent > 0 && (
                            <div style={{
                                backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0',
                                borderRadius: '8px', padding: '12px 16px', display: 'flex',
                                alignItems: 'center', gap: '10px'
                            }}>
                                <span style={{ fontSize: '24px' }}>🏷</span>
                                <div>
                                    <p style={{ margin: 0, fontWeight: '700', color: '#15803d', fontSize: '15px' }}>
                                        {offerData.discountPercent}% OFF
                                        {offerData.offerLabel ? ` · ${offerData.offerLabel}` : ''}
                                    </p>
                                    {offerData.offerExpiry && (
                                        <p style={{ margin: 0, fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>
                                            Expires: {new Date(offerData.offerExpiry).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                    <div style={{ marginTop: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <button onClick={handleOfferSave} style={btn('#7c3aed')}>Save Offer</button>
                        <button onClick={() => setOfferProduct(null)} style={btn('#6b7280')}>Cancel</button>
                        {saveMsg && <span style={{
                            fontSize: '13px',
                            color: saveMsg.startsWith('✓') ? '#16a34a' : '#dc2626'
                        }}>{saveMsg}</span>}
                    </div>
                </ModalOverlay>
            )}
        </div>
    );
};

/* ── Modal wrapper ── */
const ModalOverlay = ({ children, onClose }) => (
    <div onClick={onClose}
        style={{
            position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.45)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000
        }}>
        <div onClick={e => e.stopPropagation()}
            style={{
                backgroundColor: '#fff', borderRadius: '14px', padding: '28px',
                width: '92%', maxWidth: '700px', position: 'relative',
                boxShadow: '0 24px 64px rgba(0,0,0,0.22)', maxHeight: '90vh', overflowY: 'auto'
            }}>
            <button onClick={onClose}
                style={{
                    position: 'absolute', top: '14px', right: '16px', background: 'none',
                    border: 'none', fontSize: '20px', cursor: 'pointer', color: '#9ca3af'
                }}>✕</button>
            {children}
        </div>
    </div>
);

export default ProductSpecsCRUD;
