import React from 'react';
import { useParams } from 'react-router-dom';
import ProductCard from './ProductCard';
import '../styles/ProductListPage.css';

// Import a fallback image since we don't have specific product images yet
import electricalsImg from '../assets/images/Category/electricals.jpeg';

const ProductListPage = () => {
    const { name } = useParams();
    const categoryName = name ? name.charAt(0).toUpperCase() + name.slice(1) : 'Electricals';
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
    const [isSortOpen, setIsSortOpen] = React.useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const closeSidebar = () => {
        setIsSidebarOpen(false);
    };

    const toggleSort = () => {
        setIsSortOpen(!isSortOpen);
    };

    const closeSort = () => {
        setIsSortOpen(false);
    };

    // Mock Data based on the provided image
    const products = Array(6).fill(null).map((_, index) => ({
        id: index + 1,
        name: 'Havells Lifeline 1 sq mm Red 90 m PVC Insulated Wire',
        price: '5.05',
        originalPrice: '7.05',
        image: electricalsImg, // Using category image as placeholder
        off: '40%',
    }));

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
                <div className="breadcrumb">Home/{categoryName}</div>
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

                <div className="product-grid">
                    {products.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>

                <div className="pagination">
                    <span className="page-info">Page 1 of 6</span>
                    <button className="pagination-btn">&lt; Previous</button>
                    <button className="pagination-btn active">1</button>
                    <button className="pagination-btn">2</button>
                    <button className="pagination-btn">...</button>
                    <button className="pagination-btn">Next &gt;</button>
                </div>
            </main>
        </div>
    );
};

export default ProductListPage;
