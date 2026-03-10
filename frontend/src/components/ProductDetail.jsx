import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, Tag, Package, Truck, Shield, ChevronRight, Star, Minus, Plus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import '../styles/ProductDetail.css';

const API = 'http://localhost:2004/api/products';

const CATEGORY_LABELS = {
    electricals: 'Electricals',
    tools: 'Hand Tools',
    paints: 'Paints',
    lighting: 'Lightings & Fans',
    bathroom: 'Bathroom',
    appliances: 'Appliances',
};

/* ── Static star rating display ── */
const StarRating = ({ rating = 4.5, count = 0 }) => {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    const empty = 5 - full - (half ? 1 : 0);
    return (
        <div className="pd-rating-row">
            <div className="pd-stars">
                {[...Array(full)].map((_, i) => <Star key={`f${i}`} size={15} fill="#F59E0B" color="#F59E0B" />)}
                {half && <Star key="h" size={15} fill="#F59E0B" color="#F59E0B" style={{ clipPath: 'inset(0 50% 0 0)' }} />}
                {[...Array(empty)].map((_, i) => <Star key={`e${i}`} size={15} fill="none" color="#D1D5DB" />)}
            </div>
            <span className="pd-rating-val">{rating}</span>
            {count > 0 && <span className="pd-rating-count">({count} reviews)</span>}
        </div>
    );
};

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { user } = useAuth();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [addedToCart, setAddedToCart] = useState(false);
    const [qty, setQty] = useState(1);
    const [activeThumb, setActiveThumb] = useState(0); // for future multi-image support

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            setError('');
            try {
                const res = await fetch(`${API}/${id}`);
                if (!res.ok) throw new Error('Product not found');
                const data = await res.json();
                setProduct(data);
                setQty(1);
                setActiveThumb(0);
            } catch (err) {
                setError(err.message || 'Failed to load product.');
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleAddToCart = () => {
        if (!user) { alert('Please login to continue'); navigate('/login'); return; }
        for (let i = 0; i < qty; i++) {
            addToCart({ id: product._id, name: product.name, price: product.price, image: product.imageUrl });
        }
        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 2000);
    };

    const handleBookNow = () => {
        if (!user) { alert('Please login to continue'); navigate('/login'); return; }
        handleAddToCart();
        navigate('/cart');
    };

    const discountPct = product?.offer?.discountPercent > 0 ? product.offer.discountPercent : null;

    /* Compute MRP from discount if available */
    const computedMRP = discountPct && product?.price
        ? Math.round(parseFloat(product.price) / (1 - discountPct / 100))
        : null;

    /* Spec rows — only show filled fields */
    const specs = product ? [
        { label: 'Brand', value: product.brand },
        { label: 'Model Number', value: product.modelNumber },
        { label: 'Collection', value: product.collectionName },
        { label: 'Size', value: product.size },
        { label: 'Colour', value: product.colour },
        { label: 'Material', value: product.material },
        { label: 'Pack Of', value: product.packOf },
        { label: 'Country of Origin', value: product.countryOfOrigin },
        { label: 'Manufactured By', value: product.manufacturedBy },
        { label: 'Packed By', value: product.packedBy },
        { label: 'ISIN', value: product.isin },
    ].filter(s => s.value) : [];

    /* ─── Loading ─── */
    if (loading) return (
        <div className="pd-loader">
            <div className="pd-spinner" />
            <p>Loading product…</p>
        </div>
    );

    /* ─── Error ─── */
    if (error) return (
        <div className="pd-error-wrap">
            <span className="pd-error-icon">📦</span>
            <h2>Product not found</h2>
            <p>{error}</p>
            <button className="pd-back-btn" onClick={() => navigate(-1)}>
                <ArrowLeft size={16} /> Go Back
            </button>
        </div>
    );

    /* Thumbnails — currently just the single image; keeps the UI ready for multiple */
    const thumbs = product.imageUrl ? [product.imageUrl] : [];

    return (
        <div className="pd-page">
            <div className="pd-inner">

                {/* ── Breadcrumb ── */}
                <nav className="pd-breadcrumb">
                    <Link to="/">Home</Link>
                    <ChevronRight size={14} />
                    <Link to={`/category/${product.category}`}>
                        {CATEGORY_LABELS[product.category] || product.category}
                    </Link>
                    <ChevronRight size={14} />
                    <span>{product.name}</span>
                </nav>

                {/* ── Main card ── */}
                <div className="pd-card">

                    {/* Left: Image */}
                    <div className="pd-image-col">
                        {discountPct && (
                            <div className="pd-discount-badge">{discountPct}% OFF</div>
                        )}

                        {/* Main image */}
                        <div className="pd-main-image-wrap">
                            {thumbs.length > 0 ? (
                                <img
                                    src={thumbs[activeThumb]}
                                    alt={product.name}
                                    className="pd-image"
                                />
                            ) : (
                                <div className="pd-image-placeholder">📦</div>
                            )}
                        </div>

                        {/* Thumbnail strip */}
                        {thumbs.length > 0 && (
                            <div className="pd-thumbs">
                                {thumbs.map((t, i) => (
                                    <button
                                        key={i}
                                        className={`pd-thumb ${activeThumb === i ? 'active' : ''}`}
                                        onClick={() => setActiveThumb(i)}
                                    >
                                        <img src={t} alt={`thumb-${i}`} />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right: Info */}
                    <div className="pd-info-col">

                        {/* Brand */}
                        {product.brand && (
                            <span className="pd-brand-tag">{product.brand}</span>
                        )}

                        {/* Name */}
                        <h1 className="pd-name">{product.name}</h1>

                        {/* Star rating */}
                        <StarRating rating={4.5} count={0} />

                        {/* Offer label */}
                        {product.offer?.offerLabel && (
                            <div className="pd-offer-label">
                                <Tag size={13} /> {product.offer.offerLabel}
                            </div>
                        )}

                        {/* Price block */}
                        <div className="pd-price-block">
                            {product.price && (
                                <span className="pd-price">₹{product.price}</span>
                            )}
                            {computedMRP && (
                                <span className="pd-mrp">₹{computedMRP}</span>
                            )}
                            {discountPct && (
                                <span className="pd-discount-chip">{discountPct}% OFF</span>
                            )}
                            <span className="pd-gst">Incl. GST</span>
                        </div>

                        {/* Quick spec chips */}
                        {(product.size || product.colour || product.material || product.packOf) && (
                            <div className="pd-quick-specs">
                                {product.size && <span className="pd-chip">📐 {product.size}</span>}
                                {product.colour && <span className="pd-chip">🎨 {product.colour}</span>}
                                {product.material && <span className="pd-chip">🧱 {product.material}</span>}
                                {product.packOf && <span className="pd-chip">📦 Pack of {product.packOf}</span>}
                            </div>
                        )}

                        {/* Quantity selector */}
                        <div className="pd-qty-row">
                            <span className="pd-qty-label">Quantity:</span>
                            <div className="pd-qty-ctrl">
                                <button
                                    className="pd-qty-btn"
                                    onClick={() => setQty(q => Math.max(1, q - 1))}
                                    aria-label="Decrease"
                                >
                                    <Minus size={14} />
                                </button>
                                <span className="pd-qty-val">{qty}</span>
                                <button
                                    className="pd-qty-btn"
                                    onClick={() => setQty(q => q + 1)}
                                    aria-label="Increase"
                                >
                                    <Plus size={14} />
                                </button>
                            </div>
                        </div>

                        {/* CTA buttons */}
                        <div className="pd-cta-row">
                            <button
                                className={`pd-btn cart ${addedToCart ? 'added' : ''}`}
                                onClick={handleAddToCart}
                            >
                                <ShoppingBag size={18} />
                                {addedToCart ? `✓ Added (×${qty})!` : 'Add to Cart'}
                            </button>
                            <button className="pd-btn book" onClick={handleBookNow}>
                                Book Now
                            </button>
                        </div>

                        {/* Trust / delivery badges */}
                        <div className="pd-badges">
                            <div className="pd-badge">
                                <Truck size={18} />
                                <div>
                                    <strong>4-Hour Express Delivery</strong>
                                    <span>Within city limits · ₹299</span>
                                </div>
                            </div>
                            <div className="pd-badge">
                                <Shield size={18} />
                                <div>
                                    <strong>Genuine Products</strong>
                                    <span>100% authentic brands</span>
                                </div>
                            </div>
                            <div className="pd-badge">
                                <Package size={18} />
                                <div>
                                    <strong>Secure Packaging</strong>
                                    <span>Safe delivery guaranteed</span>
                                </div>
                            </div>
                        </div>

                        {/* Customer care */}
                        {product.customerCareAddress && (
                            <p className="pd-care">
                                📞 Customer Care: {product.customerCareAddress}
                            </p>
                        )}
                    </div>
                </div>

                {/* ── Specs Table ── */}
                {specs.length > 0 && (
                    <div className="pd-specs-section">
                        <h2 className="pd-specs-title">Product Specifications</h2>
                        <table className="pd-specs-table">
                            <tbody>
                                {specs.map((s, i) => (
                                    <tr key={i} className={i % 2 === 0 ? 'even' : 'odd'}>
                                        <td className="pd-spec-label">{s.label}</td>
                                        <td className="pd-spec-value">{s.value}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductDetail;
