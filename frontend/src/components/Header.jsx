import React, { useState } from 'react';
import { Search, ShoppingBag, User } from 'lucide-react';
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
        <div className="logo-container">
          <Link to='/'>
            <img
              src={Logo}
              alt="Sago Traders Logo"
              className="logo-img"
            />
          </Link>
        </div>

        <nav className="header-nav">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/about" className="nav-link">About</Link>

        </nav>

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

        <div className="header-actions">
          <Link to="/cart" className="action-item cart-link">
            <ShoppingBag size={24} />
            {getCartCount() > 0 && <span className="cart-badge">{getCartCount()}</span>}
          </Link>
          <div className="auth-buttons">
            {user ? (
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                {user.role === 'admin' && (
                  <Link to="/admin" style={{ textDecoration: 'none' }}>
                    <button className="auth-btn" style={{ backgroundColor: '#E85D04', color: 'white' }}>
                      DASHBOARD
                    </button>
                  </Link>
                )}
                <Link to="/profile" style={{ textDecoration: 'none', display: 'flex' }} title="My Profile">
                  <button className="auth-btn" style={{
                    backgroundColor: '#fcfcfc',
                    color: '#DC7835',
                    border: '1px solid #DC7835',
                    padding: '8px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <User size={20} />
                  </button>
                </Link>
                <button className="auth-btn login" onClick={handleLogout}>
                  LOGOUT
                </button>
              </div>
            ) : (
              <button className="auth-btn login" onClick={() => setShowModal(true)}>LOG IN</button>
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '8px',
              maxWidth: '500px',
              width: '90%',
              position: 'relative',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowModal(false)}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: 'none',
                border: 'none',
                fontSize: '20px',
                cursor: 'pointer',
              }}
            >
              ✕
            </button>
            <Login onLoginSuccess={handleLoginSuccess} />
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
