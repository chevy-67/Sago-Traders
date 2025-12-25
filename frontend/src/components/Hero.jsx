import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import '../styles/Hero.css';

const Hero = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    // Placeholder slides - User will add images later
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
                            <p>4 HRS EXPRESS DELIVERY</p>
                            <p>FLAT ₹299 WITHIN CITY LIMITS</p>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 2,
            content: (
                <div className="banner-content" style={{ justifyContent: 'center' }}>
                    <h1>Slide 2: Add your image here later</h1>
                </div>
            )
        },
        {
            id: 3,
            content: (
                <div className="banner-content" style={{ justifyContent: 'center' }}>
                    <h1>Slide 3: Add your image here later</h1>
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
                <button className="carousel-btn prev" onClick={prevSlide}><ChevronLeft /></button>

                <div className="hero-banner">
                    {slides[currentSlide].content}
                </div>

                <button className="carousel-btn next" onClick={nextSlide}><ChevronRight /></button>

                <div className="carousel-dots">
                    {slides.map((_, idx) => (
                        <span
                            key={idx}
                            className={`dot ${currentSlide === idx ? 'active' : ''} `}
                            onClick={() => setCurrentSlide(idx)}
                        ></span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Hero;
