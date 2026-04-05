import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Phone, Mail, MapPin, Calendar, Check, AlertCircle } from 'lucide-react';
import '../styles/UserProfile.css';

const UserProfile = () => {
    const { user, token, login } = useAuth();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        alternatePhone: '',
        gender: '',
        dateOfBirth: '',
        address: {
            line1: '',
            line2: '',
            city: '',
            state: '',
            pincode: ''
        }
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });
    const [coupons, setCoupons] = useState([]);

    // Fetch full profile on mount
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_PROD_URL}/api/auth/profile`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setFormData({
                        name: data.name || '',
                        email: data.email || '',
                        phone: data.phone || '',
                        alternatePhone: data.alternatePhone || '',
                        gender: data.gender || '',
                        dateOfBirth: data.dateOfBirth ? data.dateOfBirth.split('T')[0] : '',
                        address: {
                            line1: data.address?.line1 || '',
                            line2: data.address?.line2 || '',
                            city: data.address?.city || '',
                            state: data.address?.state || '',
                            pincode: data.address?.pincode || ''
                        }
                    });
                    setCoupons(data.coupons || []);
                    // Sync Context user state if backend is newer
                    if (JSON.stringify(data) !== JSON.stringify(user)) {
                        login(data, token);
                    }
                }
            } catch (err) {
                console.error("Failed to fetch profile", err);
            } finally {
                setLoading(false);
            }
        };

        if (token) fetchProfile();
    }, [token]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('address.')) {
            const addressField = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                address: { ...prev.address, [addressField]: value }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ text: '', type: '' });

        try {
            const res = await fetch(`${import.meta.env.VITE_PROD_URL}/api/auth/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (res.ok) {
                setMessage({ text: 'Profile updated successfully!', type: 'success' });
                // Update Context with the fresh user data
                login(data.user, token);

                // Clear success message after 3 seconds
                setTimeout(() => setMessage({ text: '', type: '' }), 3000);
            } else {
                setMessage({ text: data.message || 'Failed to update profile', type: 'error' });
            }
        } catch (error) {
            setMessage({ text: 'A network error occurred', type: 'error' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="profile-loading"><div className="spinner"></div></div>;

    const initials = formData.name ? formData.name.substring(0, 2).toUpperCase() : 'ST';

    return (
        <div className="profile-page-wrapper">
            <div className="profile-container">
                {/* Header Banner */}
                <div className="profile-header">
                    <div className="profile-header__bg"></div>
                    <div className="profile-avatar-wrapper">
                        <div className="profile-avatar">
                            {initials}
                        </div>
                    </div>
                </div>

                <div className="profile-content">
                    <div className="profile-title-area">
                        <h1 className="profile-title">My Profile</h1>
                        <p className="profile-subtitle">Manage your personal information and contact details</p>
                    </div>

                    {message.text && (
                        <div className={`profile-message profile-message--${message.type}`}>
                            {message.type === 'success' ? <Check size={20} /> : <AlertCircle size={20} />}
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="profile-form">

                        {/* Section 1: Personal Details */}
                        <div className="form-section">
                            <h2 className="form-section__title">
                                <User size={18} /> Personal Details
                            </h2>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Enter your full name"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Gender</label>
                                    <select name="gender" value={formData.gender} onChange={handleChange}>
                                        <option value="">Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Date of Birth</label>
                                    <input
                                        type="date"
                                        name="dateOfBirth"
                                        value={formData.dateOfBirth}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Contact Info */}
                        <div className="form-section">
                            <h2 className="form-section__title">
                                <Phone size={18} /> Contact Information
                            </h2>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Primary Phone</label>
                                    <input
                                        type="text"
                                        name="phone"
                                        value={formData?.phone || ''}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Alternate Phone</label>
                                    <input
                                        type="text"
                                        name="alternatePhone"
                                        value={formData.alternatePhone}
                                        onChange={handleChange}
                                        placeholder="Optional second number"
                                    />
                                </div>
                                <div className="form-group form-group--full">
                                    <label>Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="your.email@example.com"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section 3: Shipping Address */}
                        <div className="form-section">
                            <h2 className="form-section__title">
                                <MapPin size={18} /> Shipping Address
                            </h2>
                            <div className="form-grid">
                                <div className="form-group form-group--full">
                                    <label>Address Line 1</label>
                                    <input
                                        type="text"
                                        name="address.line1"
                                        value={formData.address.line1}
                                        onChange={handleChange}
                                        placeholder="Flat, House no., Building, Company, Apartment"
                                    />
                                </div>
                                <div className="form-group form-group--full">
                                    <label>Address Line 2</label>
                                    <input
                                        type="text"
                                        name="address.line2"
                                        value={formData.address.line2}
                                        onChange={handleChange}
                                        placeholder="Area, Street, Sector, Village"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>City / Town</label>
                                    <input
                                        type="text"
                                        name="address.city"
                                        value={formData.address.city}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>State</label>
                                    <input
                                        type="text"
                                        name="address.state"
                                        value={formData.address.state}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Pincode</label>
                                    <input
                                        type="text"
                                        name="address.pincode"
                                        value={formData.address.pincode}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="profile-form-actions">
                            <button type="submit" className="btn-save-profile" disabled={saving}>
                                {saving ? "Saving..." : "Save Profile Details"}
                            </button>
                        </div>

                    </form>

                    {coupons.length > 0 && (
                        <div className="profile-coupons-section" style={{ marginTop: '2rem' }}>
                            <h2 className="form-section__title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                🎁 My Coupons
                            </h2>
                            <div className="coupons-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
                                {coupons.map(coupon => {
                                    const isExpired = !coupon.isActive || (coupon.validUntil && new Date(coupon.validUntil) < new Date());
                                    return (
                                        <div key={coupon._id} style={{
                                            background: isExpired ? 'rgba(255,255,255,0.05)' : 'linear-gradient(135deg, #1e1e3a, #2d2d5e)',
                                            border: `1px solid ${isExpired ? '#555' : '#E85D04'}`,
                                            borderRadius: '12px',
                                            padding: '16px',
                                            position: 'relative',
                                            opacity: isExpired ? 0.6 : 1
                                        }}>
                                            <div style={{ fontSize: '20px', fontWeight: '800', color: isExpired ? '#aaa' : '#fff', letterSpacing: '2px', marginBottom: '8px' }}>
                                                {coupon.code}
                                            </div>
                                            {coupon.discountType && coupon.discountType !== 'none' && (
                                                <div style={{ fontSize: '14px', fontWeight: '600', color: isExpired ? '#888' : '#fff', marginBottom: '8px' }}>
                                                    {coupon.discountType === 'percent' ? `${coupon.discountValue}% OFF` :
                                                     coupon.discountType === 'flat' ? `₹${coupon.discountValue} OFF` :
                                                     coupon.discountType === 'free_shipping' ? 'Free Shipping' : 
                                                     coupon.discountType === 'free_product' ? 'Free Product' : ''}
                                                </div>
                                            )}
                                            {coupon.validUntil && (
                                                <div style={{ fontSize: '12px', color: '#ccc' }}>
                                                    {isExpired ? 'Expired' : `Valid until: ${new Date(coupon.validUntil).toLocaleDateString()}`}
                                                </div>
                                            )}
                                            {coupon.isSpinWheelPrize && (
                                                <div style={{ marginTop: '8px', fontSize: '11px', color: '#F48C06', fontWeight: 'bold' }}>
                                                    Spin & Win Prize
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
