import React, { useState, useEffect } from 'react';
import '../styles/Brands.css';

// --------------------------------------------------------------------------
// MOCK ADMIN SETTINGS
// --------------------------------------------------------------------------
const adminSettings = {
    showSection: true,
    title: 'Brands We Sell',
    // Admin can manage this list
    brands: [
        'https://placehold.co/150x80/white/red?text=Havells',
        'https://placehold.co/150x80/white/blue?text=Philips',
        'https://placehold.co/150x80/white/red?text=Hindware',
        'https://placehold.co/150x80/white/orange?text=AsianPaints',
        'https://placehold.co/150x80/white/green?text=BirlaOpus',
        'https://placehold.co/150x80/white/blue?text=Philips',
    ]
};

const Brands = () => {
    const [settings, setSettings] = useState(adminSettings);

    if (!settings.showSection) return null;

    return (
        <div className="brands-section">
            <h3>{settings.title}</h3>

            <div className="brands-marquee">
                {/* 
                   We duplicate the list to create a seamless infinite scroll effect.
                   The CSS will animate this track.
                */}
                <div className="brands-track">
                    {/* Original List */}
                    {settings.brands.map((b, i) => (
                        <div className="brand-box" key={`orig-${i}`}>
                            <img src={b} alt="Brand" />
                        </div>
                    ))}
                    {/* Duplicate List for Loop */}
                    {settings.brands.map((b, i) => (
                        <div className="brand-box" key={`dup-${i}`}>
                            <img src={b} alt="Brand" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Brands;
