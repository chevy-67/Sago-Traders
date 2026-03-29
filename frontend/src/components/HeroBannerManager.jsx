import React, { useState, useEffect, useRef } from 'react';
import '../styles/HeroBannerManager.css';

const API = `${import.meta.env.VITE_PROD_URL}/api/banners`;

const getToken = () => localStorage.getItem('token');

const defaultForm = {
    title: '',
    subtitle: '',
    mediaUrl: '',
    mediaType: 'image',
    link: '',
    linkLabel: 'Shop Now',
    order: 0,
    isActive: true,
};

const HeroBannerManager = () => {
    const [banners, setBanners] = useState([]);
    const [form, setForm] = useState(defaultForm);
    const [editId, setEditId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [previewUrl, setPreviewUrl] = useState('');
    const fileRef = useRef();

    const fetchBanners = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API}/all`, {
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            const data = await res.json();
            setBanners(Array.isArray(data) ? data : []);
        } catch {
            setError('Failed to load banners.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchBanners(); }, []);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setError('');
        setSuccess('');

        const isVideo = file.type.startsWith('video/');
        const reader = new FileReader();

        reader.onload = (ev) => {
            const dataUrl = ev.target.result;

            if (isVideo) {
                const video = document.createElement('video');
                video.src = dataUrl;
                video.onloadedmetadata = () => {
                    const ratio = video.videoWidth / video.videoHeight;
                    if (ratio < 2.8) { // allowing a small margin slightly below 3:1 for user convenience
                        setError(`❌ Video aspect ratio is too narrow (${ratio.toFixed(2)}:1). Use a wide landscape video (at least 3:1 ratio).`);
                        if (fileRef.current) fileRef.current.value = '';
                        return;
                    }
                    setForm(f => ({ ...f, mediaUrl: dataUrl, mediaType: 'video' }));
                    setPreviewUrl(dataUrl);
                };
            } else {
                const img = new Image();
                img.src = dataUrl;
                img.onload = () => {
                    const ratio = img.width / img.height;
                    if (ratio < 2.8) {
                        setError(`❌ Image aspect ratio is too narrow (${ratio.toFixed(2)}:1). Use a wide landscape image (at least 3:1 ratio).`);
                        if (fileRef.current) fileRef.current.value = '';
                        return;
                    }
                    setForm(f => ({ ...f, mediaUrl: dataUrl, mediaType: 'image' }));
                    setPreviewUrl(dataUrl);
                };
            }
        };
        reader.readAsDataURL(file);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
    };

    const resetForm = () => {
        setForm(defaultForm);
        setEditId(null);
        setPreviewUrl('');
        if (fileRef.current) fileRef.current.value = '';
        setError('');
        setSuccess('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.mediaUrl) { setError('Please upload an image or video.'); return; }
        setSaving(true);
        setError('');
        setSuccess('');
        try {
            const url = editId ? `${API}/${editId}` : API;
            const method = editId ? 'PUT' : 'POST';
            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getToken()}`,
                },
                body: JSON.stringify(form),
            });
            if (!res.ok) throw new Error('Save failed');
            setSuccess(editId ? 'Slide updated!' : 'Slide added!');
            resetForm();
            fetchBanners();
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (banner) => {
        setForm({
            title: banner.title || '',
            subtitle: banner.subtitle || '',
            mediaUrl: banner.mediaUrl || '',
            mediaType: banner.mediaType || 'image',
            link: banner.link || '',
            linkLabel: banner.linkLabel || 'Shop Now',
            order: banner.order ?? 0,
            isActive: banner.isActive ?? true,
        });
        setEditId(banner._id);
        setPreviewUrl(banner.mediaUrl || '');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this slide?')) return;
        try {
            await fetch(`${API}/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            fetchBanners();
        } catch {
            setError('Delete failed.');
        }
    };

    const handleToggleActive = async (banner) => {
        try {
            await fetch(`${API}/${banner._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getToken()}`,
                },
                body: JSON.stringify({ isActive: !banner.isActive }),
            });
            fetchBanners();
        } catch {
            setError('Toggle failed.');
        }
    };

    return (
        <div className="hbm-wrap">
            <h2 className="hbm-title">🖼️ Hero Carousel Slides</h2>
            <p className="hbm-sub">Upload images or videos that appear in the home page hero carousel.</p>

            {/* ─── Form ─── */}
            <form onSubmit={handleSubmit} className="hbm-form">
                <h3 className="hbm-form-title">{editId ? '✏️ Edit Slide' : '➕ Add New Slide'}</h3>

                {error && <div className="hbm-alert error">{error}</div>}
                {success && <div className="hbm-alert success">{success}</div>}

                {/* File upload */}
                <div className="hbm-upload-area" onClick={() => fileRef.current?.click()}>
                    {previewUrl ? (
                        form.mediaType === 'video' ? (
                            <video src={previewUrl} className="hbm-preview" muted playsInline />
                        ) : (
                            <img src={previewUrl} alt="preview" className="hbm-preview" />
                        )
                    ) : (
                        <div className="hbm-upload-placeholder">
                            <span className="hbm-upload-icon">📁</span>
                            <span>Click to upload image or video</span>
                            <span className="hbm-upload-hint">JPG, PNG, GIF, MP4, WebM</span>
                        </div>
                    )}
                </div>
                <input
                    ref={fileRef}
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                />

                <div className="hbm-grid">
                    <div className="hbm-field">
                        <label>Slide Title</label>
                        <input name="title" value={form.title} onChange={handleChange} placeholder="e.g. Big Deals Await" />
                    </div>
                    <div className="hbm-field">
                        <label>Subtitle</label>
                        <input name="subtitle" value={form.subtitle} onChange={handleChange} placeholder="e.g. Up to 40% off this week" />
                    </div>
                    <div className="hbm-field">
                        <label>CTA Link (URL path)</label>
                        <input name="link" value={form.link} onChange={handleChange} placeholder="e.g. /category/electricals" />
                    </div>
                    <div className="hbm-field">
                        <label>CTA Button Label</label>
                        <input name="linkLabel" value={form.linkLabel} onChange={handleChange} placeholder="e.g. Shop Now" />
                    </div>
                    <div className="hbm-field">
                        <label>Display Order</label>
                        <input name="order" type="number" value={form.order} onChange={handleChange} min="0" />
                    </div>
                    <div className="hbm-field hbm-check">
                        <label>
                            <input name="isActive" type="checkbox" checked={form.isActive} onChange={handleChange} />
                            Active (visible on home page)
                        </label>
                    </div>
                </div>

                <div className="hbm-form-actions">
                    <button type="submit" className="hbm-btn primary" disabled={saving}>
                        {saving ? 'Saving…' : editId ? 'Update Slide' : 'Add Slide'}
                    </button>
                    {editId && (
                        <button type="button" className="hbm-btn secondary" onClick={resetForm}>
                            Cancel
                        </button>
                    )}
                </div>
            </form>

            {/* ─── Slide List ─── */}
            <h3 className="hbm-list-title">Current Slides ({banners.length})</h3>

            {loading ? (
                <div className="hbm-loading">Loading slides…</div>
            ) : banners.length === 0 ? (
                <div className="hbm-empty">No slides yet. Add your first one above!</div>
            ) : (
                <div className="hbm-cards">
                    {banners.map(b => (
                        <div key={b._id} className={`hbm-card ${!b.isActive ? 'inactive' : ''}`}>
                            <div className="hbm-card-thumb">
                                {b.mediaType === 'video' ? (
                                    <video src={b.mediaUrl} className="hbm-thumb-media" muted />
                                ) : (
                                    <img src={b.mediaUrl} alt={b.title} className="hbm-thumb-media" />
                                )}
                                <span className="hbm-type-badge">{b.mediaType === 'video' ? '🎬' : '🖼️'}</span>
                            </div>
                            <div className="hbm-card-info">
                                <p className="hbm-card-title">{b.title || <em>No title</em>}</p>
                                <p className="hbm-card-sub">{b.subtitle}</p>
                                {b.link && <p className="hbm-card-link">→ {b.link}</p>}
                                <p className="hbm-card-order">Order: {b.order}</p>
                            </div>
                            <div className="hbm-card-actions">
                                <button
                                    className={`hbm-btn-sm ${b.isActive ? 'deactivate' : 'activate'}`}
                                    onClick={() => handleToggleActive(b)}
                                >
                                    {b.isActive ? 'Hide' : 'Show'}
                                </button>
                                <button className="hbm-btn-sm edit" onClick={() => handleEdit(b)}>Edit</button>
                                <button className="hbm-btn-sm delete" onClick={() => handleDelete(b._id)}>Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default HeroBannerManager;
