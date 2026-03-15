import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/MyOrders.css';

const statusColors = {
    pending: '#f39c12',
    confirmed: '#27ae60',
    cancelled: '#e74c3c',
};

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`${import.meta.env.VITE_PROD_URL}/api/orders`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.message || 'Failed to load orders');
                setOrders(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    if (loading) return <div className="mo-loading">Loading orders…</div>;

    if (error) return (
        <div className="mo-error">
            <p>{error}</p>
            <button onClick={() => navigate('/')}>Back to Home</button>
        </div>
    );

    return (
        <div className="mo-container">
            <div className="mo-header">
                <h1>My Orders</h1>
                <button className="mo-back-btn" onClick={() => navigate('/dashboard')}>← Dashboard</button>
            </div>

            {orders.length === 0 ? (
                <div className="mo-empty">
                    <div className="mo-empty-icon">📦</div>
                    <h2>No orders yet</h2>
                    <p>You haven't placed any orders. Start shopping!</p>
                    <button className="mo-shop-btn" onClick={() => navigate('/')}>Shop Now</button>
                </div>
            ) : (
                <div className="mo-list">
                    {orders.map((order) => (
                        <div key={order._id} className="mo-card">
                            {order.product.image && (
                                <img
                                    src={order.product.image}
                                    alt={order.product.name}
                                    className="mo-product-img"
                                />
                            )}
                            <div className="mo-info">
                                <h3 className="mo-product-name">{order.product.name}</h3>
                                <p className="mo-meta">Qty: <strong>{order.quantity}</strong></p>
                                <p className="mo-meta">Price: <strong>₹{order.product.price}</strong> each</p>
                                <p className="mo-meta">Total: <strong>₹{order.totalAmount?.toFixed(2)}</strong></p>
                                <p className="mo-meta">
                                    Ordered on:{' '}
                                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                        day: 'numeric', month: 'short', year: 'numeric',
                                    })}
                                </p>
                            </div>
                            <div className="mo-status-wrap">
                                <span
                                    className="mo-status-badge"
                                    style={{ backgroundColor: statusColors[order.status] || '#999' }}
                                >
                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyOrders;
