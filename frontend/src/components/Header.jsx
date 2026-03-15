import React, { useState, useRef, useEffect } from 'react';
import { Search, ShoppingCart, User, LayoutDashboard, LogOut, ChevronDown, Phone, MapPin, Package, Info, Menu, X } from 'lucide-react';
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
      setIsMenuOpen(false);
    }
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="header">


      {/* ── Main Header ── */}
      <div className="header-main">
        <div className="header-inner">
          
          {/* Mobile Menu Toggle */}
          <button className="mobile-menu-toggle" onClick={toggleMenu} aria-label="Toggle Menu">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Logo */}
          <Link to="/" className="header-logo" onClick={closeMenu}>
            <img src={Logo} alt="Sago Traders" className="logo-img" />
            <div className="logo-text">
              <span className="logo-brand">SAGO</span>
              <span className="logo-sub">Traders</span>
            </div>
          </Link>

          {/* Search Bar - Hidden on mobile drawer, shown in header-main */}
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
              placeholder="Search..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch(e)}
            />
            <button type="submit" className="search-submit-btn" aria-label="Search">
              <Search size={18} />
            </button>
          </form>

          {/* Right Actions */}
          <div className="header-actions">

            {/* User Dropdown (Desktop) */}
            <div className="action-item user-menu desktop-only" ref={userRef}>
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

            {/* About Us (Desktop) */}
            <Link to="/about" className="action-btn action-item desktop-only" aria-label="About Us">
              <div className="action-icon-wrap">
                <Info size={20} />
              </div>
              <div className="action-label">
                <span className="action-sub">More</span>
                <span className="action-main">About Us</span>
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

      {/* ── Mobile Menu Cabinet ──  */}
      <div className={`mobile-menu-cabinet ${isMenuOpen ? 'open' : ''}`}>
        <div className=" cabinet-inner">
          <div className="cabinet-header">
            <h3>Menu</h3>
            <button onClick={closeMenu}><X size={24} /></button>
          </div>
          
          <div className="cabinet-user-section">
            {user ? (
               <Link to="/profile" className="cabinet-link profile-link" onClick={closeMenu}>
                 <div className="dropdown-avatar">{user.name?.charAt(0).toUpperCase()}</div>
                 <div>
                   <div className="dropdown-name">{user.name}</div>
                   <div className="dropdown-email">{user.email}</div>
                 </div>
               </Link>
            ) : (
               <Link to="/login" className="cabinet-link login-btn-cm" onClick={closeMenu}>
                 <User size={20} /> Login / Register
               </Link>
            )}
          </div>

          <nav className="cabinet-nav">
            <Link to="/" className="cabinet-link" onClick={closeMenu}>Home</Link>
            <Link to="/about" className="cabinet-link" onClick={closeMenu}>About Us</Link>
            <div className="cabinet-divider" />
            <h4 className="cabinet-section-title">Categories</h4>
             {CATEGORIES.map(c => (
              <Link 
                key={c.slug} 
                to={`/category/${c.slug}`} 
                className="cabinet-link" 
                onClick={closeMenu}
              >
                {c.label}
              </Link>
            ))}
          </nav>
          
          {user && (
            <div className="cabinet-footer">
               <button className="cabinet-logout-btn" onClick={handleLogout}>
                 <LogOut size={18} /> Logout
               </button>
            </div>
          )}
        </div>
        <div className="cabinet-overlay" onClick={closeMenu} />
      </div>

      {/* ── Nav Bar (Desktop) ── */}
      <nav className="header-navbar desktop-only">
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

        </div>
      </nav>
    </header>
  );
};

export default Header;
