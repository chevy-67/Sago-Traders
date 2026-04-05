import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ProductCard from './ProductCard';
import '../styles/DealsSection.css';

const API_BASE = 'http://localhost:2004/api/products';

const DealsSection = () => {
    const scrollRef = useRef(null);
    const navigate = useNavigate();
    const [deals, setDeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDeals = async () => {
            try {
                setLoading(true);
                const res = await fetch(`${API_BASE}/deals`);
                if (!res.ok) throw new Error('Failed to fetch deals');
                const data = await res.json();
                setDeals(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchDeals();
    }, []);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const scrollAmount = 300;
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth',
            });
        }
    };

    // Normalise a DB product for ProductCard
    const normaliseProduct = (p) => ({
        ...p,
        id: p._id,
        // If admin set a discountPercent, compute originalPrice from it
        originalPrice:
            p.offer?.discountPercent > 0 && p.price
                ? Math.round(
                      Number(p.price) /
                          (1 - p.offer.discountPercent / 100)
                  )
                : undefined,
        // Pass discount badge info the card understands
        discount: p.offer?.discountPercent > 0 ? p.offer.discountPercent : undefined,
        off: p.offer?.offerLabel && p.offer?.discountPercent > 0
            ? `${p.offer.discountPercent}% Off`
            : undefined,
    });

    /* ── Skeleton loader ── */
    if (loading) {
        return (
            <div className="deals-container">
                <div className="deals-header">
                    <div className="deals-header-text">
                        <span className="deals-label">Hot Picks</span>
                        <h3>Explore Our Best Deals</h3>
                    </div>
                </div>
                <div className="deals-grid">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="deal-card ibo-card" style={{
                            background: 'linear-gradient(90deg,#f3f4f6 25%,#e5e7eb 50%,#f3f4f6 75%)',
                            backgroundSize: '200% 100%',
                            animation: 'shimmer 1.5s infinite',
                            minHeight: '260px',
                        }} />
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="deals-container">
                <div className="deals-header">
                    <div className="deals-header-text">
                        <span className="deals-label">Hot Picks</span>
                        <h3>Explore Our Best Deals</h3>
                    </div>
                </div>
                <p style={{ color: '#9ca3af', textAlign: 'center', padding: '40px 0', fontSize: '0.9rem' }}>
                    Could not load deals right now. Please try again shortly.
                </p>
            </div>
        );
    }

    if (deals.length === 0 && !loading) return null;


    return (
        <div id="deals" className="deals-container">
            <div className="deals-header">
                <div className="deals-header-text">
                    <span className="deals-label">Hot Picks</span>
                    <h3>Explore Our Best Deals</h3>
                </div>
                <div className="deals-header-right">
                    <button
                        className="view-all-btn"
                        onClick={() => navigate('/products')}
                    >
                        View All
                    </button>
                    <div className="scroll-arrows">
                        <button onClick={() => scroll('left')} className="arrow-btn" aria-label="Scroll left">
                            <ChevronLeft size={20} />
                        </button>
                        <button onClick={() => scroll('right')} className="arrow-btn" aria-label="Scroll right">
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="deals-grid" ref={scrollRef}>
                {deals.map((deal) => (
                    <div
                        key={deal._id}
                        onClick={() => navigate(`/product/${deal._id}`)}
                        style={{ cursor: 'pointer' }}
                    >
                        <ProductCard product={normaliseProduct(deal)} variant="deal" />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DealsSection;
