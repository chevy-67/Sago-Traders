import React from 'react';
import '../styles/ProductListPage.css';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product, variant = 'deal' }) => {
    const { addToCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleAction = (action) => {
        if (!user) {
            alert('Please login to continue');
            navigate('/login');
            return;
        }
        if (action === 'cart') {
            addToCart(product);
        } else if (action === 'book') {
            console.log('Book now:', product);
        }
    };

    const discountPct = product.off
        ? product.off
        : product.discount
            ? `${product.discount}% Off`
            : product.originalPrice && product.price
                ? `${Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% Off`
                : null;

    const discountNum = discountPct ? parseInt(discountPct) : null;

    /* ── IBO-style deal card (used in home page DealsSection) ── */
    if (variant === 'deal') {
        return (
            <div className="deal-card ibo-card">
                {/* Discount badge */}
                {discountPct && (
                    <div className="ibo-badge">
                        <span className="ibo-pct">{discountNum}%</span>
                        <span className="ibo-off">OFF</span>
                    </div>
                )}

                {/* Product image */}
                <div className="ibo-img-wrap">
                    {product.image ? (
                        <img src={product.image} alt={product.name} className="ibo-img" />
                    ) : (
                        <div className="ibo-img-placeholder">📦</div>
                    )}
                </div>

                {/* Info section */}
                <div className="ibo-info">
                    <p className="ibo-name">{product.name}</p>

                    {/* Price row */}
                    <div className="ibo-price-row">
                        {product.price != null && (
                            <span className="ibo-price">₹{product.price}</span>
                        )}
                    </div>
                    <div className="ibo-gst">incl. GST</div>

                    {/* MRP row */}
                    {product.originalPrice != null && (
                        <div className="ibo-mrp-row">
                            MRP <span className="ibo-mrp">₹{product.originalPrice}</span>
                            {discountPct && (
                                <span className="ibo-mrp-save"> ({discountPct})</span>
                            )}
                        </div>
                    )}

                    {/* Delivery tag */}
                    <div className="ibo-delivery">
                        <span className="ibo-bolt">⚡</span> Delivery in 4 hours
                    </div>
                </div>
            </div>
        );
    }

    /* ── Full card with buttons (used in product list page) ── */
    return (
        <div className="deal-card">
<<<<<<< Updated upstream
            {product.offer?.discountPercent > 0 && (
                <div className="off-badge">{product.offer.discountPercent}% Offer</div>
            )}
            {product.imageUrl
                ? <img src={product.imageUrl} alt={product.name} className="product-img" />
                : <div className="product-img" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f3f4f6', fontSize: '48px' }}>📦</div>
            }
=======
            {/* Offer Badge */}
            {(product.off || product.discount) && (
                <div className="off-badge">
                    {product.off || product.discount + '%'} Off
                </div>
            )}
>>>>>>> Stashed changes

            {/* Product Image */}
            {product.image ? (
                <img
                    src={product.image}
                    alt={product.name}
                    className="product-img"
                />
            ) : (
                <div
                    className="product-img"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'linear-gradient(135deg, #f3f4f6, #e5e7eb)',
                        fontSize: '48px',
                    }}
                >
                    📦
                </div>
            )}

            {/* Product Info */}
            <div className="product-info">
                <h4>{product.name}</h4>

                <div className="pricing">
                    {product.price != null && (
                        <span className="current-price">₹{product.price}</span>
                    )}
                    {product.originalPrice != null && (
                        <span className="original-price">₹{product.originalPrice}</span>
                    )}
<<<<<<< Updated upstream
                    {product.price != null && <span className="gst-label">Incl. GST</span>}
=======
                    {product.price != null && (
                        <span className="gst-label">Incl. GST</span>
                    )}
>>>>>>> Stashed changes
                </div>

                <div className="btn-group">
                    <button className="book-now" onClick={() => handleAction('book')}>
                        BOOK NOW
                    </button>
                    <button className="add-cart" onClick={() => handleAction('cart')}>
                        ADD TO CART
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
