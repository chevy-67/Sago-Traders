import React, { useState, useEffect } from 'react';
import { useParams,Link } from 'react-router-dom';
import axios from 'axios';
import ProductCard from './ProductCard';
import '../styles/ProductListPage.css';

const API = `${import.meta.env.VITE_PROD_URL}/api/products`;

const SearchResults = () => {
    const { query } = useParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSortOpen, setIsSortOpen] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen(prev => !prev);
    const closeSidebar = () => setIsSidebarOpen(false);
    const toggleSort = () => setIsSortOpen(prev => !prev);
    const closeSort = () => setIsSortOpen(false);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError('');
            try {
                const res = await axios.get(API, { params: { search: query } });
                setProducts(res.data);
                if (res.data.length === 0) {
                    setError(`No products found for "${query}". Try a different search.`);
                }
            } catch {
                setError('Failed to search products. Please try again later.');
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        if (query) {
            fetchProducts();
        }
    }, [query]);

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
                    <h4 className="sidebar-title">Popular Brands</h4>
                    <ul className="sidebar-list">
                        <li>All Brands</li>
                    </ul>
                </div>
            </aside>

            <main className="main-content">
                <div className="products-header">
                    <h3>Search Results for "{query}"</h3>
                    {!loading && <p className="product-count">{products.length} products found</p>}
                </div>

                {loading ? (
                    <div className="pd-loader">
                        <div className="pd-spinner" />
                        <p>Loading products…</p>
                    </div>
                ) : error && products.length === 0 ? (
                    <div className="no-products">
                        <p>{error}</p>
                    </div>
                ) : (
                    <div className="product-grid">
                        {products.map((product) => (
                            <Link key={product._id} to={`/product/${product._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                <ProductCard key={product._id} product={product} />
                            </Link>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default SearchResults;
