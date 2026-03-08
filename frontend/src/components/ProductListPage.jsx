import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ProductCard from './ProductCard';
import '../styles/ProductListPage.css';

const API = 'http://localhost:2004/api/products';

// Map URL slug to a display name
const CATEGORY_LABELS = {
    electricals: 'Electricals',
    tools: 'Hand Tools',
    paints: 'Paints',
    lighting: 'Lightings & Fans',
    bathroom: 'Bathroom',
    appliances: 'Appliances',
};

const ProductListPage = () => {
    const { name } = useParams();
    const categoryName = CATEGORY_LABELS[name] || (name ? name.charAt(0).toUpperCase() + name.slice(1) : 'Products');

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSortOpen, setIsSortOpen] = useState(false);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const toggleSidebar = () => setIsSidebarOpen(prev => !prev);
    const closeSidebar = () => setIsSidebarOpen(false);
    const toggleSort = () => setIsSortOpen(prev => !prev);
    const closeSort = () => setIsSortOpen(false);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError('');
            try {
                const res = await axios.get(API, { params: { category: name } });
                setProducts(res.data);
            } catch (err) {
                setError('Failed to load products. Please try again later.');
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [name]);

    return (
        <div className="product-list-page">
            {/* Mobile Filter Bar */}
            <div className="mobile-filter-bar">
                <div className="filter-actions">
                    <button className="filter-btn sort-btn" onClick={toggleSort}>
                        <span className="icon">⇅</span> Sort
                    </button>
                    <button className="filter-btn" onClick={toggleSidebar}>
                        <span className="icon">⚲</span> Filter
                    </button>
                </div>
            </div>

            {/* Overlay for mobile sidebar/sort */}
            {(isSidebarOpen || isSortOpen) && <div className="sidebar-overlay" onClick={() => { closeSidebar(); closeSort(); }}></div>}

            {/* Mobile Sort Sheet */}
            <div className={`sort-sheet ${isSortOpen ? 'open' : ''}`}>
                <div className="sort-header">
                    <h3>Sort By</h3>
                    <button className="close-sort" onClick={closeSort}>×</button>
                </div>
                <ul className="sort-options">
                    <li><button onClick={closeSort}>Popularity</button></li>
                    <li><button onClick={closeSort}>Price: Low to High</button></li>
                    <li><button onClick={closeSort}>Price: High to Low</button></li>
                    <li><button onClick={closeSort}>Newest First</button></li>
                </ul>
            </div>

            <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-header-mobile">
                    <h3>Filters</h3>
                    <button className="close-sidebar" onClick={closeSidebar}>×</button>
                </div>
                <div className="sidebar-section">
                    <h4 className="sidebar-title">Products</h4>
                    <ul className="sidebar-list">
                        <li>Wires</li>
                        <li>Fans</li>
                        <li>Switches</li>
                        <li>Multi-core cables</li>
                        <li>Flexible wires</li>
                    </ul>
                </div>

                <div className="sidebar-section">
                    <h4 className="sidebar-title">Brands</h4>
                    <input type="text" placeholder="Search" className="search-input" />
                    <ul className="sidebar-list">
                        <li>Havells</li>
                        <li>Dilmia</li>
                        <li>Philips</li>
                        <li>Opus</li>
                        <li>Neo Striker</li>
                    </ul>
                </div>

                <div className="sidebar-section">
                    <h4 className="sidebar-title">Price Range</h4>
                    <ul className="sidebar-list price-range-list">
                        <li>800-1000 <span className="checkbox-placeholder"></span></li>
                        <li>1000-2000 <span className="checkbox-placeholder"></span></li>
                        <li>2000-3000 <span className="checkbox-placeholder"></span></li>
                        <li>3000-4000 <span className="checkbox-placeholder"></span></li>
                        <li>4000-5000 <span className="checkbox-placeholder"></span></li>
                    </ul>
                </div>

                <div className="sidebar-footer-mobile">
                    <button className="apply-btn" onClick={closeSidebar}>Apply Filters</button>
                </div>
            </aside>

            <main className="main-content">
                <div className="breadcrumb">Home / {categoryName}</div>
                <h2 className="page-title">Buy High Quality Products at the Best Prices at SAGO</h2>

                <div className="sort-container desktop-only">
                    <span className="sort-label">Sort By:</span>
                    <select className="sort-select">
                        <option>Popularity</option>
                        <option>Price: Low to High</option>
                        <option>Price: High to Low</option>
                        <option>Newest First</option>
                    </select>
                </div>

                {loading && (
                    <div style={{ textAlign: 'center', padding: '60px', color: '#6b7280', fontSize: '16px' }}>
                        Loading products…
                    </div>
                )}

                {!loading && error && (
                    <div style={{ textAlign: 'center', padding: '60px', color: '#dc2626', fontSize: '15px' }}>
                        {error}
                    </div>
                )}

                {!loading && !error && products.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '60px', color: '#9ca3af', fontSize: '15px' }}>
                        <div style={{ fontSize: '48px', marginBottom: '12px' }}>📦</div>
                        No products found in <strong>{categoryName}</strong> yet.
                        <br />
                        <span style={{ fontSize: '13px' }}>Check back later or explore other categories.</span>
                    </div>
                )}

                {!loading && products.length > 0 && (
                    <>
                        <div className="product-grid">
                            {products.map(product => (
                                <ProductCard key={product._id} product={{
                                    id: product._id,
                                    name: `${product.name}`,
                                    price: null,
                                    originalPrice: null,
                                    imageUrl: product.imageUrl || null,
                                    off: product.offer?.discountPercent > 0 ? `${product.offer.discountPercent}%` : null,
                                }} />
                            ))}
                        </div>

                        <div className="pagination">
                            <span className="page-info">Page 1 of 1</span>
                            <button className="pagination-btn active">1</button>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
};

export default ProductListPage;
