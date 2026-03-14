import React, { useState, useRef, useEffect } from 'react';
import { Search, ShoppingCart, User, LayoutDashboard, LogOut, ChevronDown, Phone, MapPin, Package } from 'lucide-react';
import '../styles/Header.css';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Logo from '../assets/images/Logo/unnamed.jpg';

const CATEGORIES = [
  { label: 'Electricals', slug: 'electricals' },
  { label: 'Hand Tools', slug: 'tools' },
  { label: 'Paints', slug: 'paints' },
  { label: 'Lightings & Fans', slug: 'lighting' },
  { label: 'Bathroom', slug: 'bathroom' },
  { label: 'Appliances', slug: 'appliances' },
];

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCatOpen, setIsCatOpen] = useState(false);
  const [isUserOpen, setIsUserOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { getCartCount } = useCart();
  const catRef = useRef(null);
  const userRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (catRef.current && !catRef.current.contains(e.target)) setIsCatOpen(false);
      if (userRef.current && !userRef.current.contains(e.target)) setIsUserOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    logout();
    setIsUserOpen(false);
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search/${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="header">
      {/* ── Top Bar ── */}
      <div className="header-topbar">
        <div className="topbar-inner">
          <div className="topbar-left">
            <span className="topbar-item">
              <Phone size={12} />
              +91 98765 43210
            </span>
            <span className="topbar-divider" />
            <span className="topbar-item">
              <MapPin size={12} />
              Delivering across India
            </span>
          </div>
          <div className="topbar-right">
            <Link to="/about" className="topbar-link">About Us</Link>
            <span className="topbar-divider" />
            <Link to="/category/all" className="topbar-link">All Products</Link>
          </div>
        </div>
      </div>

      {/* ── Main Header ── */}
      <div className="header-main">
        <div className="header-inner">

          {/* Logo */}
          <Link to="/" className="header-logo">
            <img src={Logo} alt="Sago Traders" className="logo-img" />
            <div className="logo-text">
              <span className="logo-brand">SAGO</span>
              <span className="logo-sub">Traders</span>
            </div>
          </Link>

          {/* Search Bar */}
          <form className="header-search" onSubmit={handleSearch}>
            <div className="search-category-btn" ref={catRef}>
              <button
                type="button"
                className="cat-toggle"
                onClick={() => setIsCatOpen(p => !p)}
              >
                All <ChevronDown size={14} className={`cat-arrow ${isCatOpen ? 'open' : ''}`} />
              </button>
              {isCatOpen && (
                <ul className="cat-dropdown">
                  <li>
                    <button type="button" onClick={() => { navigate('/category/all'); setIsCatOpen(false); }}>
                      All Categories
                    </button>
                  </li>
                  {CATEGORIES.map(c => (
                    <li key={c.slug}>
                      <button type="button" onClick={() => { navigate(`/category/${c.slug}`); setIsCatOpen(false); }}>
                        {c.label}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="search-divider" />
            <input
              className="search-input-main"
              type="text"
              placeholder="Search products, brands, categories…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch(e)}
            />
            <button type="submit" className="search-submit-btn" aria-label="Search">
              <Search size={20} />
            </button>
          </form>

          {/* Right Actions */}
          <div className="header-actions">

            {/* User */}
            <div className="action-item user-menu" ref={userRef}>
              <button
                className="action-btn"
                onClick={() => setIsUserOpen(p => !p)}
                aria-label="Account"
              >
                <div className="action-icon-wrap">
                  <User size={20} />
                  {user && <span className="online-dot" />}
                </div>
                <div className="action-label">
                  <span className="action-sub">{user ? `Hi, ${user.name?.split(' ')[0]}` : 'Hello, Guest'}</span>
                  <span className="action-main">Account <ChevronDown size={11} /></span>
                </div>
              </button>
              {isUserOpen && (
                <div className="user-dropdown">
                  {user ? (
                    <>
                      <div className="dropdown-header">
                        <div className="dropdown-avatar">{user.name?.charAt(0).toUpperCase()}</div>
                        <div>
                          <div className="dropdown-name">{user.name}</div>
                          <div className="dropdown-email">{user.email}</div>
                        </div>
                      </div>
                      <div className="dropdown-divider" />
                      <Link to="/profile" className="dropdown-item" onClick={() => setIsUserOpen(false)}>
                        <User size={15} /> My Profile
                      </Link>
                      {user.role === 'admin' && (
                        <Link to="/admin" className="dropdown-item" onClick={() => setIsUserOpen(false)}>
                          <LayoutDashboard size={15} /> Admin Dashboard
                        </Link>
                      )}
                      <button className="dropdown-item logout-item" onClick={handleLogout}>
                        <LogOut size={15} /> Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <p className="dropdown-guest-msg">Sign in for a better experience</p>
                      <button className="dropdown-login-btn" onClick={() => { navigate('/login'); setIsUserOpen(false); }}>
                        Login / Register
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Orders */}
            <Link to="/cart" className="action-btn action-item" aria-label="Orders">
              <div className="action-icon-wrap">
                <Package size={20} />
              </div>
              <div className="action-label">
                <span className="action-sub">Track</span>
                <span className="action-main">Orders</span>
              </div>
            </Link>

            {/* Cart */}
            <Link to="/cart" className="action-btn action-item cart-action" aria-label="Cart">
              <div className="action-icon-wrap">
                <ShoppingCart size={20} />
                {getCartCount() > 0 && (
                  <span className="cart-badge">{getCartCount()}</span>
                )}
              </div>
              <div className="action-label">
                <span className="action-sub">My</span>
                <span className="action-main">Cart</span>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Nav Bar ── */}
      <nav className="header-navbar">
        <div className="navbar-inner">
          <Link to="/" className={`navbar-link ${location.pathname === '/' ? 'active' : ''}`}>Home</Link>
          {CATEGORIES.map(c => (
            <Link
              key={c.slug}
              to={`/category/${c.slug}`}
              className={`navbar-link ${location.pathname === `/category/${c.slug}` ? 'active' : ''}`}
            >
              {c.label}
            </Link>
          ))}
          <Link to="/about" className={`navbar-link ${location.pathname === '/about' ? 'active' : ''}`}>About Us</Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;
