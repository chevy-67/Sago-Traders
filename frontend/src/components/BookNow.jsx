import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/BookNow.css';

const BookNow = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const product = state?.product;

    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(false);
    const [ordered, setOrdered] = useState(false);
    const [error, setError] = useState('');

    if (!product) {
        return (
            <div className="bn-empty">
                <h2>No product selected</h2>
                <button onClick={() => navigate('/')}>Back to Home</button>
            </div>
        );
    }

    const priceNum = parseFloat(product.price) || 0;
    const total = (priceNum * quantity).toFixed(2);

    const handleConfirm = async () => {
        setLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${import.meta.env.VITE_PROD_URL}/api/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ product, quantity }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Order failed');
            setOrdered(true);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (ordered) {
        return (
            <div className="bn-success">
                <div className="bn-success-icon">✔</div>
                <h2>Order Placed Successfully!</h2>
                <p>Your order for <strong>{product.name}</strong> (×{quantity}) has been placed and is being processed.</p>
                <div className="bn-success-actions">
                    <button className="bn-btn-primary" onClick={() => navigate('/my-orders')}>View My Orders</button>
                    <button className="bn-btn-secondary" onClick={() => navigate('/')}>Continue Shopping</button>
                </div>
            </div>
        );
    }

    return (
        <div className="bn-container">
            <h1 className="bn-title">Book Now</h1>

            <div className="bn-card">
                {product.image && (
                    <div className="bn-image-wrap">
                        <img src={product.image} alt={product.name} className="bn-image" />
                    </div>
                )}
                <div className="bn-details">
                    <span className="bn-badge">{product.off || (product.discount ? product.discount + '%' : '')} Off</span>
                    <h2 className="bn-name">{product.name}</h2>
                    <div className="bn-pricing">
                        <span className="bn-price">₹{product.price}</span>
                        {product.originalPrice && (
                            <span className="bn-original">₹{product.originalPrice}</span>
                        )}
                        <span className="bn-gst">Incl. GST</span>
                    </div>

                    <div className="bn-qty-row">
                        <label className="bn-qty-label">Quantity</label>
                        <div className="bn-qty-ctrl">
                            <button
                                className="bn-qty-btn"
                                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                disabled={quantity <= 1}
                            >−</button>
                            <span className="bn-qty-val">{quantity}</span>
                            <button
                                className="bn-qty-btn"
                                onClick={() => setQuantity(q => q + 1)}
                            >+</button>
                        </div>
                    </div>

                    <div className="bn-total-row">
                        <span className="bn-total-label">Total</span>
                        <span className="bn-total-val">₹{total}</span>
                    </div>

                    {error && <p className="bn-error">{error}</p>}

                    <div className="bn-actions">
                        <button
                            className="bn-btn-primary"
                            onClick={handleConfirm}
                            disabled={loading}
                        >
                            {loading ? 'Placing Order...' : 'Confirm Order'}
                        </button>
                        <button
                            className="bn-btn-secondary"
                            onClick={() => navigate(-1)}
                            disabled={loading}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookNow;
