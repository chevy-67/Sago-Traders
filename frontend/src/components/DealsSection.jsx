import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import '../styles/DealsSection.css';

// --------------------------------------------------------------------------
// MOCK ADMIN SETTINGS (To be replaced by API/DB data later)
// --------------------------------------------------------------------------
const adminSettings = {
    showSection: true,     // Admin decides whether to show this section
    sectionTitle: 'Explore Our Best Deals', // Admin can edit title
    cardLimit: 6,         // Admin decides how many cards to display
};

// --------------------------------------------------------------------------
// BASE DATA (Ideally would also come from backend/admin input)
// --------------------------------------------------------------------------
const allDeals = [
    { id: 1, name: 'Sameer New Ceiling Fan', originalPrice: 2199, price: 1299, off: '41% Off', img: 'https://placehold.co/150x150?text=Fan' },
    { id: 2, name: 'Preethi Wet Grinder', originalPrice: 4200, price: 2999, off: '40% Off', img: 'https://placehold.co/150x150?text=Grinder' },
    { id: 3, name: 'Philips Iron Box', originalPrice: 1500, price: 999, off: '33% Off', img: 'https://placehold.co/150x150?text=Iron' },
    { id: 4, name: 'Butterfly Mixer', originalPrice: 3500, price: 2500, off: '28% Off', img: 'https://placehold.co/150x150?text=Mixer' },
    { id: 5, name: 'Usha Table Fan', originalPrice: 2800, price: 1800, off: '35% Off', img: 'https://placehold.co/150x150?text=Fan' },
    { id: 6, name: 'Pigeon Gas Stove', originalPrice: 4000, price: 2200, off: '45% Off', img: 'https://placehold.co/150x150?text=Stove' },
    { id: 7, name: 'Havells Heater', originalPrice: 3200, price: 2600, off: '18% Off', img: 'https://placehold.co/150x150?text=Heater' },
    { id: 8, name: 'Kent Water Purifier', originalPrice: 15000, price: 12000, off: '20% Off', img: 'https://placehold.co/150x150?text=Purifier' },
];

const DealsSection = () => {
    const scrollRef = useRef(null);
    const [settings, setSettings] = useState(adminSettings);
    const [deals, setDeals] = useState([]);

    useEffect(() => {
        // In a real app, fetch settings and deals from API here
        // const fetchSettings = async () => { ... }

        if (settings.showSection) {
            // Apply card limit based on admin setting
            const limitedDeals = allDeals.slice(0, settings.cardLimit);
            setDeals(limitedDeals);
        }
    }, [settings]);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const { current } = scrollRef;
            const scrollAmount = 300; // Scroll by roughly one card width
            if (direction === 'left') {
                current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            } else {
                current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            }
        }
    };

    if (!settings.showSection) return null;

    return (
        <div className="deals-container">
            <div className="deals-header">
                <h3>{settings.sectionTitle}</h3>
                <div className="scroll-arrows">
                    <button onClick={() => scroll('left')} className="arrow-btn"><ChevronLeft size={20} /></button>
                    <button onClick={() => scroll('right')} className="arrow-btn"><ChevronRight size={20} /></button>
                </div>
            </div>

            <div className="deals-grid" ref={scrollRef}>
                {deals.map((deal) => (
                    <div className="deal-card" key={deal.id}>
                        <div className="off-badge">{deal.off} Offer</div>
                        <img src={deal.img} alt={deal.name} className="product-img" />

                        <div className="product-info">
                            <h4>{deal.name}</h4>
                            <div className="pricing">
                                <span className="current-price">₹{deal.price}</span>
                                <span className="original-price">₹{deal.originalPrice}</span>
                                <span className="gst-label">Inclu. GST</span>
                            </div>
                            <div className="btn-group">
                                <button className="book-now">BOOK NOW</button>
                                <button className="add-cart">ADD TO CART</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DealsSection;
