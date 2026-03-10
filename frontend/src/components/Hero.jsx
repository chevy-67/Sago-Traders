import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ShoppingBag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import '../styles/Hero.css';

const Hero = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const slides = [
        {
            id: 1,
            content: (
                <div className="banner-content">
                    <div className="banner-left">
                        <h2>IBO</h2>
                        <h1>PLYWOOD</h1>
                        <h2>DOUBLE</h2>
                        <h1 className="dhamaka">DHAMAKA</h1>
                        <div className="hero-cta-group">
                            <Link to="/products" className="hero-btn-primary">
                                <ShoppingBag size={18} />
                                Shop Now
                            </Link>
                            <Link to="/about" className="hero-btn-secondary">
                                Learn More
                                <ArrowRight size={16} />
                            </Link>
                        </div>
                    </div>
                    <div className="banner-right">
                        <div className="price-tag">
                            <span className="ibo-label">IBO PRICE</span>
                            <span className="price">₹108</span>
                            <span className="save-tag">SAVE ₹128</span>
                        </div>
                        <div className="price-tag">
                            <span className="ibo-label">IBO PRICE</span>
                            <span className="price">₹62</span>
                            <span className="save-tag">SAVE ₹64</span>
                        </div>
                        <div className="delivery-info">
                            <p>🚚 4 HRS EXPRESS DELIVERY</p>
                            <p>FLAT ₹299 WITHIN CITY LIMITS</p>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 2,
            content: (
                <div className="banner-content" style={{ justifyContent: 'center', flexDirection: 'column', textAlign: 'center' }}>
                    <h2 style={{ fontSize: '1rem', letterSpacing: '0.2em', marginBottom: '12px', opacity: 0.85 }}>COMING SOON</h2>
                    <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2rem, 5vw, 4rem)' }}>Big Deals Await</h1>
                    <div className="hero-cta-group" style={{ justifyContent: 'center', marginTop: '28px' }}>
                        <Link to="/products" className="hero-btn-primary">
                            <ShoppingBag size={18} /> Explore Products
                        </Link>
                    </div>
                </div>
            )
        },
        {
            id: 3,
            content: (
                <div className="banner-content" style={{ justifyContent: 'center', flexDirection: 'column', textAlign: 'center' }}>
                    <h2 style={{ fontSize: '1rem', letterSpacing: '0.2em', marginBottom: '12px', opacity: 0.85 }}>EXCLUSIVE OFFERS</h2>
                    <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2rem, 5vw, 4rem)' }}>Quality You Trust</h1>
                    <div className="hero-cta-group" style={{ justifyContent: 'center', marginTop: '28px' }}>
                        <Link to="/about" className="hero-btn-secondary">Our Story <ArrowRight size={16} /></Link>
                    </div>
                </div>
            )
        }
    ];

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    };

    // Auto-slide every 5 seconds
    useEffect(() => {
        const timer = setInterval(nextSlide, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="hero-section">
            <div className="carousel-container">
                <button className="carousel-btn prev" onClick={prevSlide} aria-label="Previous">
                    <ChevronLeft size={22} />
                </button>

                <div className="hero-banner">
                    {slides[currentSlide].content}
                </div>

                <button className="carousel-btn next" onClick={nextSlide} aria-label="Next">
                    <ChevronRight size={22} />
                </button>

                <div className="carousel-dots">
                    {slides.map((_, idx) => (
                        <span
                            key={idx}
                            className={`dot ${currentSlide === idx ? 'active' : ''}`}
                            onClick={() => setCurrentSlide(idx)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Hero;
