import React from 'react';
import { Truck, PhoneCall, Wallet } from 'lucide-react';
import '../styles/Features.css';

const Features = () => {
    return (
        <div className="features-strip">
            <div className="feature-item">
                <Truck size={40} className="feature-icon" />
                <div>
                    <h4>Fast Shipping</h4>
                    <p>On All Orders</p>
                </div>
            </div>
            <div className="feature-item">
                <PhoneCall size={40} className="feature-icon" />
                <div>
                    <h4>Online Support</h4>
                    <p>Technical 24/7</p>
                </div>
            </div>
            <div className="feature-item">
                <Wallet size={40} className="feature-icon" />
                <div>
                    <h4>Big Savings</h4>
                    <p>Week Sales</p>
                </div>
            </div>
        </div>
    );
};

export default Features;
