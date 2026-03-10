import React from 'react';
import { ArrowRight } from 'lucide-react';
import '../styles/PromoBanner.css';
import workerImg from '../assets/images/Human/worker.jpg';

const PromoBanner = () => {
    return (
        <div className="promo-container">
            <div className="promo-card">

                {/* ── LEFT: Vivid Gradient + Floating Image ── */}
                <div className="promo-left">
                    {/* Decorative animated dots */}
                    <div className="promo-dot promo-dot-1" />
                    <div className="promo-dot promo-dot-2" />
                    <div className="promo-dot promo-dot-3" />
                    <div className="promo-dot promo-dot-4" />

                    {/* Floating image with spinning halo */}
                    <div className="promo-image-wrap">
                        <img src={workerImg} alt="Building Professional" />
                        <span className="promo-badge">⭐ Pro Member</span>
                    </div>
                </div>

                {/* ── RIGHT: Text Content ── */}
                <div className="promo-right">
                    <span className="promo-tag">
                        <span className="promo-tag-dot" />
                        Are you a professional?
                    </span>

                    <h2>
                        Get <span>Exclusive Offers</span>
                        <br />for Building Pros
                    </h2>

                    <p className="promo-desc">
                        Join thousands of contractors and builders who trust Sago Traders
                        for the best prices on premium materials — delivered fast.
                    </p>

                    <button className="promo-cta">
                        JOIN NOW
                        <ArrowRight size={20} />
                    </button>

                    <div className="promo-stats">
                        <div className="promo-stat">
                            <div className="promo-stat-number">5000+</div>
                            <div className="promo-stat-label">Happy Customers</div>
                        </div>
                        <div className="promo-stat">
                            <div className="promo-stat-number">200+</div>
                            <div className="promo-stat-label">Brand Partners</div>
                        </div>
                        <div className="promo-stat">
                            <div className="promo-stat-number">10yr</div>
                            <div className="promo-stat-label">Experience</div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default PromoBanner;
