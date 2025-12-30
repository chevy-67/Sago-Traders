import React from 'react';
import { Search, ShoppingCart, User } from 'lucide-react';
import '../styles/Header.css';
import Logo from '../assets/images/Logo/unnamed.jpg';
/**/
const Header = () => {
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
            <button className="auth-btn login">LOG IN</button>
            <button className="auth-btn signup">SIGN UP</button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
