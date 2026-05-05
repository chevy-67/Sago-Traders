import React, { useState } from 'react'; // triggering HMR
import havellsLogo from '../assets/images/Logo/Brands/Havells_Logo.svg';
import asianpaints from '../assets/images/Logo/Brands/asian-paint-2.svg';
import Philips from '../assets/images/Logo/Brands/Philips_logo_new.svg';
import Hindware from '../assets/images/Logo/Brands/Hindware.svg';
import Legrand from '../assets/images/Logo/Brands/Legrand.svg';
import birlaopus from '../assets/images/Logo/Brands/birlaopus.svg';
import Finolex from '../assets/images/Logo/Brands/Finolex_Logo.svg';
import WaterTec from '../assets/images/Logo/Brands/WaterTec_logo.svg';
import Ultratec from '../assets/images/Logo/Brands/UltraTech_Cement_Ltd logo.svg';
import '../styles/Brands.css';

const adminSettings = {
    showSection: true,
    title: 'Brands We Trust',
    brands: [
        { name: 'Havells', url: havellsLogo },
        { name: 'Asian Paints', url: asianpaints },
        { name: 'Philips', url: Philips },
        { name: 'Hindware', url: Hindware },
        { name: 'Legrand', url: Legrand },
        { name: 'Birla Opus', url: birlaopus },
        { name: 'Finolex', url: Finolex },
        {name:'WaterTec', url:WaterTec},
        {name:'UltraTech', url:Ultratec}
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
