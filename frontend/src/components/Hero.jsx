import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, ShoppingBag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import '../styles/Hero.css';

const API = 'http://localhost:2004/api/banners';

/* ─── Static fallback slides (shown when no banners uploaded) ─── */
const STATIC_SLIDES = [
    {
        _id: 'static-1',
        isStatic: true,
        content: (
            <div className="banner-content">
                <div className="banner-left">
                    <h2>SAGO TRADERS</h2>
                    <h1>PLYWOOD</h1>
                    <h2>DOUBLE</h2>
                    <h1 className="dhamaka">DHAMAKA</h1>
                    <div className="hero-cta-group">
                        <Link to="/products" className="hero-btn-primary">
                            <ShoppingBag size={18} /> Shop Now
                        </Link>
                        <Link to="/about" className="hero-btn-secondary">
                            Learn More <ArrowRight size={16} />
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
        ),
    },
    {
        _id: 'static-2',
        isStatic: true,
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
        ),
    },
];

/* ─── Live media slide rendered from API data ─── */
const MediaSlide = ({ banner }) => (
    <div className="hero-media-slide">
        {/* Background media */}
        {banner.mediaType === 'video' ? (
            <video
                key={banner._id}
                className="hero-media-bg"
                src={banner.mediaUrl}
                autoPlay
                muted
                loop
                playsInline
            />
        ) : (
            <img
                key={banner._id}
                className="hero-media-bg"
                src={banner.mediaUrl}
                alt={banner.title || 'Banner'}
            />
        )}

        {/* Dark overlay for text readability */}
        <div className="hero-media-overlay" />

        {/* Overlay text */}
        {(banner.title || banner.subtitle || banner.link) && (
            <div className="hero-media-text">
                {banner.title && <h1 className="hero-media-h1">{banner.title}</h1>}
                {banner.subtitle && <p className="hero-media-sub">{banner.subtitle}</p>}
                {banner.link && (
                    <div className="hero-cta-group" style={{ justifyContent: 'center', marginTop: '24px' }}>
                        <Link to={banner.link} className="hero-btn-primary">
                            <ShoppingBag size={18} /> {banner.linkLabel || 'Shop Now'}
                        </Link>
                    </div>
                )}
            </div>
        )}
    </div>
);

const Hero = () => {
    const [slides, setSlides] = useState(STATIC_SLIDES);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isLive, setIsLive] = useState(false);

    useEffect(() => {
        fetch(API)
            .then(r => r.json())
            .then(data => {
                if (Array.isArray(data) && data.length > 0) {
                    setSlides(data);
                    setIsLive(true);
                }
                // else keep static fallback
            })
            .catch(() => {
                // network error – keep static fallback silently
            });
    }, []);

    const nextSlide = useCallback(() => {
        setCurrentSlide(prev => (prev === slides.length - 1 ? 0 : prev + 1));
    }, [slides.length]);

    const prevSlide = useCallback(() => {
        setCurrentSlide(prev => (prev === 0 ? slides.length - 1 : prev - 1));
    }, [slides.length]);

    // Reset to slide 0 if slides change (e.g. banner loaded)
    useEffect(() => { setCurrentSlide(0); }, [slides]);

    // Auto-slide every 5 s
    useEffect(() => {
        const timer = setInterval(nextSlide, 5000);
        return () => clearInterval(timer);
    }, [nextSlide]);

    const current = slides[currentSlide];

    return (
        <div className="hero-section">
            <div className="carousel-container">
                <button className="carousel-btn prev" onClick={prevSlide} aria-label="Previous">
                    <ChevronLeft size={22} />
                </button>

                <div className="hero-banner">
                    {isLive
                        ? <MediaSlide banner={current} />
                        : current.content
                    }
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
