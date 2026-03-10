import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import '../styles/CategoryGrid.css';
import electricalsImg from '../assets/images/Category/electricals.jpeg';
import handToolsImg from '../assets/images/Category/hand_tools.jpeg';
import paintsImg from '../assets/images/Category/paints.webp';
import lightsImg from '../assets/images/Category/lights.jpg';
import bathroomImg from '../assets/images/Category/bathroom.jpeg';
import appliancesImg from '../assets/images/Category/appliances.avif';

const categories = [
    { name: 'Electricals', img: electricalsImg, path: '/category/electricals' },
    { name: 'Hand Tools', img: handToolsImg, path: '/category/tools' },
    { name: 'Paints', img: paintsImg, path: '/category/paints' },
    { name: 'Lightings & Fans', img: lightsImg, path: '/category/lighting' },
    { name: 'Bathroom', img: bathroomImg, path: '/category/bathroom' },
    { name: 'Appliances', img: appliancesImg, path: '/category/appliances' },
];

const CategoryGrid = () => {
    return (
        <section className="category-section">
            <div className="category-section-header">
                <span className="category-label">Our Collections</span>
                <h3>Shop By Category</h3>
                <div className="category-divider" />
            </div>
            <div className="category-grid">
                {categories.map((cat, index) => (
                    <Link to={cat.path} key={index} className="category-card">
                        <div className="img-wrapper">
                            <img
                                src={cat.img}
                                alt={cat.name}
                                onError={(e) => {
                                    e.target.src = 'https://placehold.co/300x200?text=' + cat.name;
                                    e.target.onerror = null;
                                }}
                            />
                        </div>
                        <div className="category-card-footer">
                            <p>{cat.name}</p>
                            <div className="category-arrow">
                                <ArrowRight size={14} />
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
};

export default CategoryGrid;
