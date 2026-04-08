import React from 'react';
import { MapPin, Phone, Clock, Navigation } from 'lucide-react';
import '../styles/PromoBanner.css';

// ──────────────────────────────────────────────
//  Replace the src below with your store image
//  e.g.: import storeImg from '../assets/images/store/front.jpg';
//  then swap the placeholder <div> with <img src={storeImg} ... />
// ──────────────────────────────────────────────
// import storeImg from '../assets/images/store/front.jpg';

const PromoBanner = () => {
    return (
        <div className="promo-container">
            <div className="location-section-header">
                <span className="location-eyebrow">
                    <MapPin size={14} />
                    Find Us
                </span>
                <h2 className="location-title">
                    Visit Our <span>Store</span>
                </h2>
                <p className="location-subtitle">
                    Come experience our full range of building materials in person
                </p>
            </div>

            <div className="promo-card location-card">

                {/* ── LEFT: Store Picture ── */}
                <div className="promo-left store-photo-side">
                    {/* ── STORE PHOTO PLACEHOLDER ──
                        To add your store picture:
                        1. Import your image at the top of the file
                        2. Replace the <div className="store-photo-placeholder"> block
                           with: <img src={storeImg} alt="Sago Traders Store" className="store-photo-img" />
                    */}
                    <div className="store-photo-placeholder">
                        <div className="placeholder-icon">🏪</div>
                        <p className="placeholder-text">Photos</p>
                        <span className="placeholder-hint">SaGo Traders</span>
                    </div>

                    {/* Store name badge */}
                    <div className="store-name-badge">
                        <div className="store-badge-dot" />
                        <span>Sago Traders</span>
                    </div>
                </div>

                {/* ── RIGHT: Google Map + Info ── */}
                <div className="promo-right map-side">
                    {/* Google Map Embed */}
                    <div className="map-embed-wrap">
                        {/*
                          ── HOW TO GET YOUR MAP EMBED URL ──
                          1. Go to https://maps.google.com
                          2. Search for your store / navigate to its location
                          3. Click "Share" → "Embed a map"
                          4. Copy the <iframe src="..."> URL
                          5. Paste it in the `src` prop below (replace the placeholder URL)
                        */}
                        <iframe
                            title="Sago Traders Store Location"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d870.7708490734053!2d77.40222455750978!3d11.50667695923838!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba93d9d7c9d927d%3A0x6aa05fa325de030c!2sSaGo%20kattumanam%20and%20Traders!5e0!3m2!1sen!2sin!4v1775664971350!5m2!1sen!2sin"
                            className="map-iframe"
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        />
                    </div>
                </div>

            </div>
        </div>
    );
};

export default PromoBanner;
