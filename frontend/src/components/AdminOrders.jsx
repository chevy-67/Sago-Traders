import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import '../styles/AdminOrders.css';

const API_BASE = 'http://localhost:2004/api/orders';

const STATUS_OPTIONS = ['pending', 'confirmed', 'dispatched', 'delivered', 'cancelled'];

const STATUS_META = {
    pending: { label: 'Pending', color: '#f59e0b', bg: '#fef3c7' },
    confirmed: { label: 'Confirmed', color: '#3b82f6', bg: '#dbeafe' },
    dispatched: { label: 'Dispatched', color: '#8b5cf6', bg: '#ede9fe' },
    delivered: { label: 'Delivered', color: '#10b981', bg: '#d1fae5' },
    cancelled: { label: 'Cancelled', color: '#ef4444', bg: '#fee2e2' },
};

const AdminOrders = () => {
    const { token } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [updatingId, setUpdatingId] = useState(null);
    const [search, setSearch] = useState('');

    const fetchOrders = useCallback(async () => {
        try {
            setLoading(true);
            setError('');
            const res = await axios.get(`${API_BASE}/admin/all`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setOrders(res.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load orders.');
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => { fetchOrders(); }, [fetchOrders]);

    const handleStatusChange = async (orderId, newStatus) => {
        setUpdatingId(orderId);
        try {
            const res = await axios.patch(
                `${API_BASE}/admin/${orderId}/status`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setOrders(prev =>
                prev.map(o => o._id === orderId ? { ...o, status: res.data.order.status } : o)
            );
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to update status.');
        } finally {
            setUpdatingId(null);
        }
    };

    const filtered = orders.filter(o => {
        const matchStatus = filterStatus === 'all' || o.status === filterStatus;
        const matchSearch = !search.trim() ||
            o._id.includes(search) ||
            o.userId?.name?.toLowerCase().includes(search.toLowerCase()) ||
            o.userId?.phone?.includes(search);
        return matchStatus && matchSearch;
    });

    const counts = STATUS_OPTIONS.reduce((acc, s) => {
        acc[s] = orders.filter(o => o.status === s).length;
        return acc;
    }, {});

    if (loading) return (
        <div className="ao-loading">
            <div className="ao-spinner"></div>
            <p>Loading orders…</p>
        </div>
    );

    if (error) return (
        <div className="ao-error">
            <span>⚠️ {error}</span>
            <button onClick={fetchOrders}>Retry</button>
        </div>
    );

    return (
        <div className="ao-page">
            {/* Stats Strip */}
            <div className="ao-stats">
                {[{ key: 'all', label: 'Total', count: orders.length, color: '#3E2723', bg: '#FFF8F2' },
                ...STATUS_OPTIONS.map(s => ({ key: s, label: STATUS_META[s].label, count: counts[s], color: STATUS_META[s].color, bg: STATUS_META[s].bg }))
                ].map(stat => (
                    <button
                        key={stat.key}
                        className={`ao-stat-card${filterStatus === stat.key ? ' active' : ''}`}
                        onClick={() => setFilterStatus(stat.key)}
                        style={{ '--stat-color': stat.color, '--stat-bg': stat.bg }}
                    >
                        <span className="ao-stat-num">{stat.count}</span>
                        <span className="ao-stat-label">{stat.label}</span>
                    </button>
                ))}
            </div>

            {/* Toolbar */}
            <div className="ao-toolbar">
                <h2 className="ao-section-title">
                    {filterStatus === 'all' ? 'All Orders' : `${STATUS_META[filterStatus]?.label} Orders`}
                    <span className="ao-count-badge">{filtered.length}</span>
                </h2>
                <div className="ao-search-wrap">
                    <input
                        type="text"
                        className="ao-search"
                        placeholder="Search by name, phone or order ID…"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                    <button className="ao-refresh-btn" onClick={fetchOrders} title="Refresh">↻</button>
                </div>
            </div>

            {/* Orders Table */}
            {filtered.length === 0 ? (
                <div className="ao-empty">
                    <span>📦</span>
                    <p>No orders found.</p>
                </div>
            ) : (
                <div className="ao-table-wrap">
                    <table className="ao-table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Product</th>
                                <th>Qty</th>
                                <th>Amount</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Update Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(order => {
                                const meta = STATUS_META[order.status] || STATUS_META.pending;
                                return (
                                    <tr key={order._id} className="ao-row">
                                        <td className="ao-id">
                                            <span title={order._id}>#{order._id.slice(-6).toUpperCase()}</span>
                                        </td>
                                        <td className="ao-customer">
                                            <div className="ao-customer-name">{order.deliveryDetails?.name || order.userId?.name || '—'}</div>
                                            <div className="ao-customer-phone">{order.deliveryDetails?.phone || order.userId?.phone || '—'}</div>
                                            {order.deliveryDetails?.address && (
                                                <div className="ao-customer-addr">
                                                    {order.deliveryDetails.address}, {order.deliveryDetails.city} {order.deliveryDetails.pincode}
                                                </div>
                                            )}
                                        </td>
                                        <td className="ao-product">
                                            {(order.items && order.items.length > 0 ? order.items : [order.product]).map((item, idx) => (
                                                <div key={idx} className="ao-product-row">
                                                    {item?.image && (
                                                        <img
                                                            src={item.image}
                                                            alt={item.name}
                                                            className="ao-product-img"
                                                            onError={e => e.target.style.display = 'none'}
                                                        />
                                                    )}
                                                    <span className="ao-product-name">{item?.name || '—'} <span style={{ color: '#9ca3af' }}>×{item?.quantity || 1}</span></span>
                                                </div>
                                            ))}
                                        </td>
                                        <td className="ao-qty">{order.quantity}</td>
                                        <td className="ao-amount">
                                            ₹{(order.totalAmount).toLocaleString('en-IN')}
                                        </td>
                                        <td className="ao-date">
                                            {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                                day: '2-digit', month: 'short', year: 'numeric'
                                            })}
                                        </td>
                                        <td>
                                            <span
                                                className="ao-status-badge"
                                                style={{ color: meta.color, background: meta.bg }}
                                            >
                                                {meta.label}
                                            </span>
                                        </td>
                                        <td>
                                            <select
                                                className="ao-status-select"
                                                value={order.status}
                                                disabled={updatingId === order._id}
                                                onChange={e => handleStatusChange(order._id, e.target.value)}
                                            >
                                                {STATUS_OPTIONS.map(s => (
                                                    <option key={s} value={s}>
                                                        {STATUS_META[s].label}
                                                    </option>
                                                ))}
                                            </select>
                                            {updatingId === order._id && (
                                                <span className="ao-updating">…</span>
                                            )}
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
};

export default AdminOrders;
