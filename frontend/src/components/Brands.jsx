import React, { useState } from 'react';
import '../styles/Brands.css';

const adminSettings = {
    showSection: true,
    title: 'Brands We Trust',
    brands: [
        { name: 'Havells', url: 'https://placehold.co/150x70/ffffff/DC7835?text=Havells&font=inter' },
        { name: 'Philips', url: 'https://placehold.co/150x70/ffffff/003a70?text=Philips&font=inter' },
        { name: 'Hindware', url: 'https://placehold.co/150x70/ffffff/b22222?text=Hindware&font=inter' },
        { name: 'Asian Paints', url: 'https://placehold.co/150x70/ffffff/e85d04?text=AsianPaints&font=inter' },
        { name: 'Birla Opus', url: 'https://placehold.co/150x70/ffffff/228b22?text=BirlaOpus&font=inter' },
        { name: 'Schneider', url: 'https://placehold.co/150x70/ffffff/3b5998?text=Schneider&font=inter' },
    ]
};

const Brands = () => {
    const [settings] = useState(adminSettings);

    if (!settings.showSection) return null;

    return (
        <div className="brands-section">
            <div className="brands-section-header">
                <span className="brands-label">Our Partners</span>
                <h3>{settings.title}</h3>
                <div className="brands-divider" />
            </div>

            <div className="brands-marquee">
                <div className="brands-track">
                    {/* Original list */}
                    {settings.brands.map((b, i) => (
                        <div className="brand-box" key={`orig-${i}`} title={b.name}>
                            <img src={b.url} alt={b.name} />
                        </div>
                    ))}
                    {/* Duplicate for seamless loop */}
                    {settings.brands.map((b, i) => (
                        <div className="brand-box" key={`dup-${i}`} title={b.name}>
                            <img src={b.url} alt={b.name} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Brands;
