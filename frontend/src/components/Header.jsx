import React, { useState } from 'react';
import { Search, ShoppingBag, User, X, LayoutDashboard } from 'lucide-react';
import '../styles/Header.css';
import Login from './Login';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

import Logo from '../assets/images/Logo/unnamed.jpg';

const Header = () => {
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { getCartCount } = useCart();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleLoginSuccess = (loggedInUser) => {
    setShowModal(false);
    if (loggedInUser?.role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/dashboard');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search/${encodeURIComponent(searchQuery)}`);
      //setSearchQuery('');
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
          <Link to="/about" className="nav-link">About</Link>
        </nav>

        {/* Search Bar */}
        <div className="search-bar">
<<<<<<< Updated upstream
          <input 
            type="text" 
            placeholder="Search products..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
          />
          <button className="search-btn" onClick={handleSearch}>
            <Search size={20} />
=======
          <input type="text" placeholder="Search products…" />
          <button className="search-btn" aria-label="Search">
            <Search size={18} />
>>>>>>> Stashed changes
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
              <button className="auth-btn login" onClick={() => setShowModal(true)}>
                LOG IN
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Login Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setShowModal(false)}
              aria-label="Close"
            >
              <X size={18} />
            </button>
            <Login onLoginSuccess={handleLoginSuccess} />
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
