import React, { useState } from 'react';
import { Search, ShoppingCart, User } from 'lucide-react';
import '../styles/Header.css';
import Login from './Login';

import Logo from '../assets/images/Logo/unnamed.jpg';
/**/
const Header = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <header className="header">
      {/* Top Bar (Optional if needed, but sticking to main header for now) */}

      <div className="main-header">
        <div className="logo-container">
          {/* User can replace this src with their actual logo file later */}
          <img
            src={Logo}
            alt="Sago Traders Logo"
            className="logo-img"
          />
        </div>

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
            <button className="auth-btn login" onClick={() => setShowModal(true)}>LOG IN</button>
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
              x
            </button>
            <Login />
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
