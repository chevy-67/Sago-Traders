import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import ProductCard from './ProductCard';
import '../styles/ProductListPage.css';

const API = `${import.meta.env.VITE_PROD_URL}/api/products`;

// Map URL slug to a display name
const CATEGORY_LABELS = {
    electricals: 'Electricals',
    tools: 'Hand Tools',
    paints: 'Paints',
    lighting: 'Lightings & Fans',
    bathroom: 'Bathroom',
    appliances: 'Appliances',
};

const PRICE_RANGES = [
    { label: '₹0 – ₹500',    min: 0,    max: 500   },
    { label: '₹500 – ₹1000', min: 500,  max: 1000  },
    { label: '₹1000 – ₹2000',min: 1000, max: 2000  },
    { label: '₹2000 – ₹5000',min: 2000, max: 5000  },
    { label: '₹5000+',        min: 5000, max: Infinity },
];

const ProductListPage = () => {
    const { name } = useParams();
    const categoryName = CATEGORY_LABELS[name] || (name ? name.charAt(0).toUpperCase() + name.slice(1) : 'Products');

    // UI state
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSortOpen, setIsSortOpen]       = useState(false);

    // Data state
    const [products, setProducts]       = useState([]);
    const [sidebarNames, setSidebarNames] = useState([]);
    const [sidebarBrands, setSidebarBrands] = useState([]);
    const [filtersLoading, setFiltersLoading] = useState(true);
    const [loading, setLoading]         = useState(true);
    const [error, setError]             = useState('');

    // Filter state
    const [selectedName,  setSelectedName]  = useState(null);
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [selectedPrice, setSelectedPrice] = useState(null); // index into PRICE_RANGES
    const [brandSearch,   setBrandSearch]   = useState('');
    const [sortOrder,     setSortOrder]     = useState('default');

    const toggleSidebar = () => setIsSidebarOpen(prev => !prev);
    const closeSidebar  = () => setIsSidebarOpen(false);
    const toggleSort    = () => setIsSortOpen(prev => !prev);
    const closeSort     = () => setIsSortOpen(false);

    // ── Fetch sidebar filters whenever category changes ─────────────────
    useEffect(() => {
        setFiltersLoading(true);
        // Reset filters when category changes
        setSelectedName(null);
        setSelectedBrand(null);
        setSelectedPrice(null);
        setBrandSearch('');

        axios.get(`${API}/filters`, { params: { category: name } })
            .then(res => {
                setSidebarNames(res.data.names  || []);
                setSidebarBrands(res.data.brands || []);
            })
            .catch(() => {
                setSidebarNames([]);
                setSidebarBrands([]);
            })
            .finally(() => setFiltersLoading(false));
    }, [name]);

    // ── Fetch products whenever category or brand filter changes ─────────
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError('');
            try {
                const params = { category: name };
                if (selectedBrand) params.brand = selectedBrand;
                const res = await axios.get(API, { params });
                setProducts(Array.isArray(res.data) ? res.data : []);
            } catch {
                setError('Failed to load products. Please try again later.');
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [name, selectedBrand]);

    // ── Client-side filtering + sorting ─────────────────────────────────
    const filteredProducts = useMemo(() => {
        let list = [...products];

        // Filter by product name
        if (selectedName) {
            list = list.filter(p =>
                p.name.toLowerCase().includes(selectedName.toLowerCase())
            );
        }

        // Filter by price range
        if (selectedPrice !== null) {
            const { min, max } = PRICE_RANGES[selectedPrice];
            list = list.filter(p => {
                const price = parseFloat(String(p.price).replace(/[^0-9.]/g, ''));
                return !isNaN(price) && price >= min && price <= max;
            });
        }

        // Sort
        if (sortOrder === 'price-asc') {
            list.sort((a, b) =>
                parseFloat(String(a.price).replace(/[^0-9.]/g, '')) -
                parseFloat(String(b.price).replace(/[^0-9.]/g, ''))
            );
        } else if (sortOrder === 'price-desc') {
            list.sort((a, b) =>
                parseFloat(String(b.price).replace(/[^0-9.]/g, '')) -
                parseFloat(String(a.price).replace(/[^0-9.]/g, ''))
            );
        } else if (sortOrder === 'newest') {
            list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }

        return list;
    }, [products, selectedName, selectedPrice, sortOrder]);

    // ── Filtered brand list for search box ──────────────────────────────
    const visibleBrands = useMemo(() => {
        if (!brandSearch.trim()) return sidebarBrands;
        return sidebarBrands.filter(b =>
            b.toLowerCase().includes(brandSearch.toLowerCase())
        );
    }, [sidebarBrands, brandSearch]);

    const handleNameClick  = (n) => setSelectedName(prev => prev === n ? null : n);
    const handleBrandClick = (b) => setSelectedBrand(prev => prev === b ? null : b);
    const handlePriceClick = (i) => setSelectedPrice(prev => prev === i ? null : i);
    const handleSortChange = (val) => { setSortOrder(val); closeSort(); };

    const clearAllFilters = () => {
        setSelectedName(null);
        setSelectedBrand(null);
        setSelectedPrice(null);
        setSortOrder('default');
    };

    const hasActiveFilters = selectedName || selectedBrand || selectedPrice !== null;

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
                        {hasActiveFilters && <span className="filter-badge" />}
                    </button>
                </div>
            </div>

            {/* Overlay for mobile sidebar/sort */}
            {(isSidebarOpen || isSortOpen) && (
                <div className="sidebar-overlay" onClick={() => { closeSidebar(); closeSort(); }} />
            )}

            {/* Mobile Sort Sheet */}
            <div className={`sort-sheet ${isSortOpen ? 'open' : ''}`}>
                <div className="sort-header">
                    <h3>Sort By</h3>
                    <button className="close-sort" onClick={closeSort}>×</button>
                </div>
                <ul className="sort-options">
                    {[
                        { val: 'default',    label: 'Popularity' },
                        { val: 'price-asc',  label: 'Price: Low to High' },
                        { val: 'price-desc', label: 'Price: High to Low' },
                        { val: 'newest',     label: 'Newest First' },
                    ].map(o => (
                        <li key={o.val}>
                            <button
                                className={sortOrder === o.val ? 'sort-active' : ''}
                                onClick={() => handleSortChange(o.val)}
                            >
                                {o.label}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* ── Sidebar ── */}
            <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-header-mobile">
                    <h3>Filters</h3>
                    <button className="close-sidebar" onClick={closeSidebar}>×</button>
                </div>

                {/* Clear filters button */}
                {hasActiveFilters && (
                    <div className="sidebar-clear">
                        <button className="clear-filters-btn" onClick={clearAllFilters}>
                            ✕ Clear all filters
                        </button>
                    </div>
                )}

                {/* Products (subcategory names) */}
                <div className="sidebar-section">
                    <h4 className="sidebar-title">Products</h4>
                    {filtersLoading ? (
                        <div className="sidebar-skeleton">
                            {[1,2,3,4].map(i => <div key={i} className="skeleton-line" />)}
                        </div>
                    ) : sidebarNames.length === 0 ? (
                        <p className="sidebar-empty">No products in this category yet.</p>
                    ) : (
                        <ul className="sidebar-list">
                            {sidebarNames.map(n => (
                                <li
                                    key={n}
                                    className={selectedName === n ? 'active' : ''}
                                    onClick={() => handleNameClick(n)}
                                >
                                    {n}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Brands */}
                <div className="sidebar-section">
                    <h4 className="sidebar-title">Brands</h4>
                    <input
                        type="text"
                        placeholder="Search brands…"
                        className="search-input"
                        value={brandSearch}
                        onChange={e => setBrandSearch(e.target.value)}
                    />
                    {filtersLoading ? (
                        <div className="sidebar-skeleton">
                            {[1,2,3].map(i => <div key={i} className="skeleton-line" />)}
                        </div>
                    ) : visibleBrands.length === 0 ? (
                        <p className="sidebar-empty">
                            {brandSearch ? 'No matching brands.' : 'No brands in this category yet.'}
                        </p>
                    ) : (
                        <ul className="sidebar-list">
                            {visibleBrands.map(b => (
                                <li
                                    key={b}
                                    className={selectedBrand === b ? 'active' : ''}
                                    onClick={() => handleBrandClick(b)}
                                >
                                    {b}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Price Range */}
                <div className="sidebar-section">
                    <h4 className="sidebar-title">Price Range</h4>
                    <ul className="sidebar-list price-range-list">
                        {PRICE_RANGES.map((range, i) => (
                            <li
                                key={i}
                                className={selectedPrice === i ? 'active' : ''}
                                onClick={() => handlePriceClick(i)}
                            >
                                {range.label}
                                <span className={`checkbox-placeholder ${selectedPrice === i ? 'checked' : ''}`} />
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="sidebar-footer-mobile">
                    <button className="apply-btn" onClick={closeSidebar}>Apply Filters</button>
                </div>
            </aside>

            {/* ── Main Content ── */}
            <main className="main-content">
                <div className="breadcrumb">Home / <span>{categoryName}</span></div>
                <h2 className="page-title">Buy High Quality Products at the Best Prices at SAGO</h2>

                {/* Active filter chips */}
                {hasActiveFilters && (
                    <div className="active-filters">
                        {selectedName && (
                            <span className="filter-chip">
                                {selectedName}
                                <button onClick={() => setSelectedName(null)}>×</button>
                            </span>
                        )}
                        {selectedBrand && (
                            <span className="filter-chip">
                                {selectedBrand}
                                <button onClick={() => setSelectedBrand(null)}>×</button>
                            </span>
                        )}
                        {selectedPrice !== null && (
                            <span className="filter-chip">
                                {PRICE_RANGES[selectedPrice].label}
                                <button onClick={() => setSelectedPrice(null)}>×</button>
                            </span>
                        )}
                    </div>
                )}

                <div className="sort-container desktop-only">
                    <span className="sort-label">Sort By:</span>
                    <select
                        className="sort-select"
                        value={sortOrder}
                        onChange={e => setSortOrder(e.target.value)}
                    >
                        <option value="default">Popularity</option>
                        <option value="price-asc">Price: Low to High</option>
                        <option value="price-desc">Price: High to Low</option>
                        <option value="newest">Newest First</option>
                    </select>
                    {filteredProducts.length > 0 && (
                        <span className="result-count">{filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}</span>
                    )}
                </div>

                {loading && (
                    <div className="pd-loader">
                        <div className="pd-spinner" />
                        <p>Loading products…</p>
                    </div>
                )}

                {!loading && error && (
                    <div style={{ textAlign: 'center', padding: '60px', color: '#dc2626', fontSize: '15px' }}>
                        {error}
                    </div>
                )}

                {!loading && !error && filteredProducts.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '60px', color: '#9ca3af', fontSize: '15px' }}>
                        <div style={{ fontSize: '48px', marginBottom: '12px' }}>📦</div>
                        {hasActiveFilters
                            ? <>No products match the current filters. <button className="clear-link" onClick={clearAllFilters}>Clear filters</button></>
                            : <>No products found in <strong>{categoryName}</strong> yet.<br /><span style={{ fontSize: '13px' }}>Check back later or explore other categories.</span></>
                        }
                    </div>
                )}

                {!loading && filteredProducts.length > 0 && (
                    <>
                        <div className="product-grid">
                            {filteredProducts.map(product => (
                                <Link
                                    key={product._id}
                                    to={`/product/${product._id}`}
                                    style={{ textDecoration: 'none', color: 'inherit' }}
                                >
                                    <ProductCard product={{
                                        id: product._id,
                                        name: product.name,
                                        price: product.price || null,
                                        originalPrice: null,
                                        imageUrl: product.imageUrl || null,
                                        off: product.offer?.discountPercent > 0 ? `${product.offer.discountPercent}%` : null,
                                    }} />
                                </Link>
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
