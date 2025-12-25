import React from 'react';
import '../styles/PromoBanner.css';
import workerImg from '../assets/images/Human/worker.jpg';

const PromoBanner = () => {
    return (
        <div className="promo-container">
            <div className="promo-card">
                <div className="promo-content-wrapper">
                    <div className="promo-image">
                        <img src={workerImg} alt="Professional" />
                    </div>
                    <div className="promo-text">
                        <p>ARE YOU A HOME BUILDING PROFESSIONAL?</p>
                        <h2>GET EXCLUSIVE OFFERS</h2>
                        <button className="promo-cta">JOIN NOW</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PromoBanner;
