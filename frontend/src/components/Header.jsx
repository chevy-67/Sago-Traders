import React, { useState } from 'react';
import { Search, ShoppingCart } from 'lucide-react';
import '../styles/Header.css';
import Login from './Login';
import { Link, useNavigate } from 'react-router-dom';

import Logo from '../assets/images/Logo/unnamed.jpg';

const Header = () => {
  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState(() => {
    const userString = localStorage.getItem('user');
    return userString ? JSON.parse(userString) : null;
  });
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  const handleLoginSuccess = (loggedInUser) => {
    setUser(loggedInUser);
    setShowModal(false);
    if (loggedInUser?.role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/dashboard');
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
          <Link to="/services" className="nav-link">Services</Link>
          <Link to="/contact" className="nav-link">Contact</Link>
        </nav>

        <div className="search-bar">
          <input type="text" placeholder="Search" />
          <button className="search-btn">
            <Search size={20} />
          </button>
        </div>

        <div className="header-actions">
          <div className="action-item">
            <ShoppingCart size={24} />
          </div>
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
