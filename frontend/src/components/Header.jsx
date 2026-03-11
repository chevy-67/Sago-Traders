import React, { useState } from 'react';
import { Search, ShoppingBag, User, LayoutDashboard } from 'lucide-react';
import '../styles/Header.css';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

import Logo from '../assets/images/Logo/unnamed.jpg';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { getCartCount } = useCart();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search/${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="header">
      <div className="main-header">
        {/* Logo */}
        <div className="logo-container">
          <Link to='/'>
            <img src={Logo} alt="Sago Traders Logo" className="logo-img" />
          </Link>
        </div>

        {/* Nav Links */}
        <nav className="header-nav">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/category/all" className="nav-link">Product</Link>
          <Link to="/about" className="nav-link">About</Link>
        </nav>

        {/* Search Bar */}
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
          />
          <button className="search-btn" onClick={handleSearch}>
            <Search size={20} />
          </button>
        </div>

        {/* Actions */}
        <div className="header-actions">
          {/* Cart */}
          <Link to="/cart" className="cart-link" aria-label="Shopping Cart">
            <ShoppingBag size={22} />
            {getCartCount() > 0 && (
              <span className="cart-badge">{getCartCount()}</span>
            )}
          </Link>

          {/* Auth */}
          <div className="auth-buttons">
            {user ? (
              <>
                {user.role === 'admin' && (
                  <Link to="/admin" style={{ textDecoration: 'none' }}>
                    <button className="auth-btn login" title="Admin Dashboard">
                      <LayoutDashboard size={14} />
                      DASHBOARD
                    </button>
                  </Link>
                )}
                <Link to="/profile" className="profile-btn" title="My Profile">
                  <User size={18} />
                </Link>
                <button className="auth-btn login" onClick={handleLogout}>
                  LOGOUT
                </button>
              </>
            ) : (
              <button className="auth-btn login" onClick={() => navigate('/login')}>
                LOG IN
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
