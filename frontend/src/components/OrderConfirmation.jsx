import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, ShoppingBag } from 'lucide-react';
import '../styles/OrderConfirmation.css';

const OrderConfirmation = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const orderId = location.state?.orderId;

    return (
        <div className="conf-page-wrapper">
            <div className="conf-container">
                <div className="conf-icon-wrap">
                    <CheckCircle size={64} className="conf-check-icon" />
                </div>

                <h1 className="conf-title">Order Placed!</h1>
                <p className="conf-subtitle">
                    Thank you for your order. Our team will call you within{' '}
                    <strong>24 hours</strong> to confirm and arrange delivery.
                </p>

                {orderId && orderId !== 'N/A' && (
                    <div className="conf-order-id-box">
                        <span className="conf-order-label">Order ID</span>
                        <span className="conf-order-value">{orderId}</span>
                    </div>
                )}

                <div className="conf-notice-box">
                    <span>📞</span>
                    <p>
                        Our team will contact you on the phone number you provided to confirm
                        your order details and schedule delivery.
                    </p>
                </div>

                <div className="conf-actions">
                    <button
                        className="conf-btn-primary"
                        onClick={() => navigate('/')}
                    >
                        <ShoppingBag size={18} />
                        Continue Shopping
                    </button>
                    <button
                        className="conf-btn-secondary"
                        onClick={() => navigate('/dashboard')}
                    >
                        View Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderConfirmation;
