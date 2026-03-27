 import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { User, Phone, MapPin, FileText, Package } from 'lucide-react';
import '../styles/Checkout.css';

const API_BASE = `${import.meta.env.VITE_PROD_URL}/api`;

const Checkout = () => {
    const navigate = useNavigate();
    const { user, token } = useAuth();
    const { cartItems, clearCart, getCartTotal } = useCart();

    const [formData, setFormData] = useState({
        name: user?.name || '',
        phone: user?.phone || '',
        alternatePhone: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        notes: '',
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    };

    const validate = () => {
        const err = {};
        if (!formData.name.trim()) err.name = 'Full name is required';
        if (!formData.phone.trim()) {
            err.phone = 'Phone number is required';
        } else if (!/^[0-9]{10}$/.test(formData.phone.replace(/\s/g, ''))) {
            err.phone = 'Enter a valid 10-digit phone number';
        }
        if (formData.alternatePhone && !/^[0-9]{10}$/.test(formData.alternatePhone.replace(/\s/g, ''))) {
            err.alternatePhone = 'Enter a valid 10-digit number or leave blank';
        }
        if (!formData.address.trim()) err.address = 'Full address is required';
        if (!formData.city.trim()) err.city = 'City is required';
        if (!formData.state.trim()) err.state = 'State is required';
        if (!formData.pincode.trim()) {
            err.pincode = 'Pincode is required';
        } else if (!/^[0-9]{6}$/.test(formData.pincode)) {
            err.pincode = 'Pincode must be exactly 6 digits';
        }
        return err;
    };

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setApiError('');

        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            document.querySelector('.has-error')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

        if (cartItems.length === 0) {
            setApiError('Your cart is empty. Please add items before placing an order.');
            return;
        }

        try {
            setLoading(true);

            const scriptLoaded = await loadRazorpayScript();
            if (!scriptLoaded) {
                setApiError('Failed to load Razorpay payment gateway. Please check your internet connection.');
                setLoading(false);
                return;
            }

            const totalAmountToPay = cartItems.reduce((sum, item) => sum + (parseFloat(String(item.price).replaceAll(',','')) * item.quantity), 0);

            // 1. Create Order on Backend
            const orderCreateRes = await axios.post(
                `${API_BASE}/orders/razorpay-create`,
                { amount: totalAmountToPay },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const { id: order_id, amount: rzp_amount, currency } = orderCreateRes.data;

            // 2. Initialize Razorpay Modal
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_placeholder', // Fallback for dev mode
                amount: rzp_amount,
                currency: currency,
                name: 'Sago Traders',
                description: 'Order Payment',
                order_id: order_id,
                theme: { color: '#0d9488' }, // matches teal theme roughly
                handler: async function (response) {
                    try {
                        setLoading(true);
                        // 3. Verify Payment and Place Order payload
                        const verifyRes = await axios.post(
                            `${API_BASE}/orders/razorpay-verify`,
                            {
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                orderData: {
                                    items: cartItems.map((item) => ({
                                        product: item._id,
                                        name: item.name,
                                        price: item.price,
                                        quantity: item.quantity,
                                        image: item.image,
                                    })),
                                    name: formData.name.trim(),
                                    phone: formData.phone.trim(),
                                    alternatePhone: formData.alternatePhone.trim() || undefined,
                                    address: formData.address.trim(),
                                    city: formData.city.trim(),
                                    state: formData.state.trim(),
                                    pincode: formData.pincode.trim(),
                                    notes: formData.notes.trim() || undefined,
                                }
                            },
                            { headers: { Authorization: `Bearer ${token}` } }
                        );

                        clearCart();
                        navigate('/order/confirmation', {
                            state: { orderId: verifyRes.data?.order?._id || 'N/A' },
                        });
                    } catch (err) {
                        setApiError(err.response?.data?.message || 'Payment verification failed.');
                    } finally {
                        setLoading(false);
                    }
                },
                prefill: {
                    name: formData.name,
                    contact: formData.phone,
                },
                modal: {
                    ondismiss: function () {
                        setLoading(false);
                    }
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', function (response) {
                setApiError('Payment failed: ' + response.error.description);
                setLoading(false);
            });
            rzp.open();

        } catch (err) {
            console.error('Checkout error:', err);
            setApiError(err.response?.data?.message || 'Failed to initiate checkout. Please try again.');
            setLoading(false);
        }
    };

    const subtotal = getCartTotal();

    return (
        <div className="checkout-page">
            <div className="checkout-wrapper">
                <div className="checkout-page-header">
                    <h1 className="checkout-page-title">Checkout</h1>
                    <p className="checkout-page-sub">
                        Review your order and complete your details below
                    </p>
                </div>

                {apiError && (
                    <div className="checkout-api-error">
                        <span>⚠️</span>
                        <span>{apiError}</span>
                    </div>
                )}

                <div className="checkout-grid">
                    {/* ── Left Column: Order Form ── */}
                    <form onSubmit={handleSubmit} className="checkout-form" noValidate>

                        {/* Section: Personal Details */}
                        <div className="ck-section">
                            <h2 className="ck-section-title">
                                <User size={18} /> Delivery Details
                            </h2>
                            <div className="ck-grid">
                                <div className={`ck-form-group ck-full ${errors.name ? 'has-error' : ''}`}>
                                    <label htmlFor="ck-name">Full Name *</label>
                                    <div className="ck-input-wrap">
                                        <span className="ck-input-icon"><User size={15} /></span>
                                        <input
                                            id="ck-name"
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="Enter your full name"
                                        />
                                    </div>
                                    {errors.name && <span className="ck-field-error">{errors.name}</span>}
                                </div>

                                <div className={`ck-form-group ${errors.phone ? 'has-error' : ''}`}>
                                    <label htmlFor="ck-phone">Phone Number *</label>
                                    <div className="ck-input-wrap ck-phone-wrap">
                                        <span className="ck-phone-prefix">+91</span>
                                        <input
                                            id="ck-phone"
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="10-digit mobile number"
                                            maxLength={10}
                                        />
                                    </div>
                                    {errors.phone && <span className="ck-field-error">{errors.phone}</span>}
                                </div>

                                <div className={`ck-form-group ${errors.alternatePhone ? 'has-error' : ''}`}>
                                    <label htmlFor="ck-alt-phone">Alternate Phone <span className="ck-optional">(optional)</span></label>
                                    <div className="ck-input-wrap ck-phone-wrap">
                                        <span className="ck-phone-prefix">+91</span>
                                        <input
                                            id="ck-alt-phone"
                                            type="tel"
                                            name="alternatePhone"
                                            value={formData.alternatePhone}
                                            onChange={handleChange}
                                            placeholder="Alternate number"
                                            maxLength={10}
                                        />
                                    </div>
                                    {errors.alternatePhone && (
                                        <span className="ck-field-error">{errors.alternatePhone}</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Section: Address */}
                        <div className="ck-section">
                            <h2 className="ck-section-title">
                                <MapPin size={18} /> Delivery Address
                            </h2>
                            <div className="ck-grid">
                                <div className={`ck-form-group ck-full ${errors.address ? 'has-error' : ''}`}>
                                    <label htmlFor="ck-address">Full Address *</label>
                                    <textarea
                                        id="ck-address"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        placeholder="House no., Street, Area, Landmark..."
                                        rows={3}
                                        className="ck-textarea"
                                    />
                                    {errors.address && <span className="ck-field-error">{errors.address}</span>}
                                </div>

                                <div className={`ck-form-group ${errors.city ? 'has-error' : ''}`}>
                                    <label htmlFor="ck-city">City *</label>
                                    <input
                                        id="ck-city"
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        placeholder="City / Town"
                                    />
                                    {errors.city && <span className="ck-field-error">{errors.city}</span>}
                                </div>

                                <div className={`ck-form-group ${errors.state ? 'has-error' : ''}`}>
                                    <label htmlFor="ck-state">State *</label>
                                    <input
                                        id="ck-state"
                                        type="text"
                                        name="state"
                                        value={formData.state}
                                        onChange={handleChange}
                                        placeholder="State"
                                    />
                                    {errors.state && <span className="ck-field-error">{errors.state}</span>}
                                </div>

                                <div className={`ck-form-group ${errors.pincode ? 'has-error' : ''}`}>
                                    <label htmlFor="ck-pincode">Pincode *</label>
                                    <input
                                        id="ck-pincode"
                                        type="text"
                                        name="pincode"
                                        value={formData.pincode}
                                        onChange={handleChange}
                                        placeholder="6-digit pincode"
                                        maxLength={6}
                                        inputMode="numeric"
                                    />
                                    {errors.pincode && <span className="ck-field-error">{errors.pincode}</span>}
                                </div>
                            </div>
                        </div>

                        {/* Section: Notes */}
                        <div className="ck-section">
                            <h2 className="ck-section-title">
                                <FileText size={18} /> Order Notes{' '}
                                <span className="ck-optional" style={{ fontWeight: 400, fontSize: '0.8rem' }}>(optional)</span>
                            </h2>
                            <textarea
                                id="ck-notes"
                                name="notes"
                                value={formData.notes}
                                onChange={handleChange}
                                placeholder="Any special instructions, preferred delivery time, etc."
                                rows={3}
                                className="ck-textarea"
                            />
                        </div>

                        {/* Submit */}
                        <button type="submit" className="ck-submit-btn" disabled={loading}>
                            {loading ? (
                                <span className="ck-btn-spinner"></span>
                            ) : (
                                <>
                                    <Package size={18} />
                                    Place Order
                                </>
                            )}
                        </button>
                    </form>

                    {/* ── Right Column: Order Summary ── */}
                    <aside className="checkout-summary">
                        <h2 className="ck-summary-title">Order Summary</h2>

                        {/* Cart items list */}
                        <div className="ck-item-list">
                            {cartItems.length === 0 ? (
                                <p className="ck-empty-msg">Your cart is empty.</p>
                            ) : (
                                cartItems.map((item) => (
                                    <div key={item._id} className="ck-item">
                                        <div className="ck-item-img-wrap">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="ck-item-img"
                                                onError={(e) => { e.target.style.display = 'none'; }}
                                            />
                                        </div>
                                        <div className="ck-item-info">
                                            <p className="ck-item-name">{item.name}</p>
                                            <p className="ck-item-qty">Qty: {item.quantity}</p>
                                        </div>
                                        <div className="ck-item-price">
                                            ₹{((parseFloat(item.price.replaceAll(',',''))) * item.quantity).toLocaleString('en-IN')}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Totals */}
                        <div className="ck-totals">
                            <div className="ck-total-row">
                                <span>Subtotal</span>
                                <span>₹{subtotal.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="ck-total-row">
                                <span>Delivery Charge</span>
                                <span className="ck-delivery-note">To be confirmed on call</span>
                            </div>
                            <div className="ck-total-row ck-grand-total">
                                <span>Total</span>
                                <span className="ck-grand-amount">₹{subtotal.toLocaleString('en-IN')}</span>
                            </div>
                        </div>

                        {/* Notice Box */}
                        <div className="ck-notice-box">
                            <span className="ck-notice-icon">📞</span>
                            <p className="ck-notice-text">
                                Our team will call you within <strong>24 hours</strong> to confirm
                                your order and arrange delivery.
                            </p>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
