import React, { useState, useRef, useEffect } from 'react';
import { Search, ShoppingCart, User, LayoutDashboard, LogOut, ChevronDown, Phone, MapPin, Package, Info, Menu, X } from 'lucide-react';
import '../styles/Header.css';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Logo from '../assets/images/Logo/unnamed.jpg';

const CATEGORIES = [
  { label: 'Electricals', slug: 'electricals' },
  { label: 'Plumbings', slug: 'tools' },
  { label: 'Paints', slug: 'paints' },
  { label: 'Lightings & Fans', slug: 'lighting' },
  { label: 'Bathroom', slug: 'bathroom' },
  { label: 'Appliances', slug: 'appliances' },
];

const MEGA_MENU = {
  electricals: [
    {
      heading: 'Wiring & Cables',
      items: ['House Wire', 'Flexible Wire', 'Armoured Cable', 'Data Cable', 'Coaxial Cable'],
    },
    {
      heading: 'Switches & Sockets',
      items: ['Fan Regulator', 'Switch Board Plate', 'Lamp Holder', 'Electrical Socket', 'Communication Socket', 'Blank Plate Cover', 'Switch', 'Combined Box', 'Modular Surface Box', 'Ceiling Rose', 'Plug Top', 'LED Indicator'],
    },
    {
      heading: 'Circuit Breakers',
      items: ['MCB', 'RCCB'],
    },
    {
      heading: 'Distribution Boards',
      items: ['Distribution Boards'],
    },
    {
      heading: 'Conduits & Accessories',
      items: ['Conduit Fittings','Conduit Pipe','Conduit Solvent Cement','Ceiling Fan Box','Concealed box'],
    },
    {
      heading: 'Electrical Tools & Accessories',
      items: ['Accessories','Door Bell','Multi PLug Adaptor','Spike Guard'],
    },
    {
      heading: 'Water Heaters & Geysers',
      items: ['Instant Geyser','Storage Geyser','Spare Parts']
    },
  ],
  tools: [
    {
      heading: 'Fittings',
      items: ['Water Pipe Fitting','SWR Fitting','Agriculture Fitting'],
    }, 
    {
      heading: 'Tanks',
      items: ['Overhead Tanks', 'Tank Accessory'],
    },
  ],
  paints: [
  {
    heading: 'Interior Paints',
    items: ['Interior Distemper-Color', 'Interior Emulsion - Color', 'Interior Emulsion - Base'],
  },
  {
    heading: 'Exterior Paints',
    items: ['Exterior Emulsion - Color', 'Exterior Emulsion - Base'],
  },
  {
    heading: 'Metal Paints',
    items: ['Enamel-Color', 'Enamel-Base'],
  },
  {
    heading: 'Sealants',
    items: ['Interior Sealant'],
  },
  {
    heading: 'Undercoats',
    items: ['Putty', 'White Cement', 'Filler', 'Wall Primer', 'Metal Primer', 'Wood Primer'],
  },
  {
    heading: 'Paint Thinners',
    items: ['Paint Thinner'],
  },
  {
    heading: 'Waterproofing',
    items: ['General Purpose Waterproofing', 'Wall Waterproofing', 'Roof Waterproofing', 'Floor Waterproofing'],
  },
  {
    heading: 'Wood Coatings',
    items: ['Varnish', 'Melamine Coating', 'Polyurethane (PU) Coating'],
  },
  {
    heading: 'Other Paints',
    items: ['Spray Paint'],
  },
  {
    heading: 'Colorants',
    items: ['Universal Stainer'],
  },
  {
    heading: 'Applicators',
    items: ['Roller', 'Brush'],
  },
  {
    heading: 'Paint Tools',
    items: ['Knife', 'Extension Pole', 'Other Tools'],
  },
  {
    heading: 'Tapes',
    items: ['Masking Tape'],
  },
],
  lighting: [
  {
    heading: 'Light Bulbs',
    items: ['LED Bulb', 'LED Batten', 'LED Night Bulb'],
  },
  {
    heading: 'Ceiling Lights',
    items: ['LED Panel Light', 'LED Downlighter', 'LED Spotlight', 'LED COB Light'],
  },
  {
    heading: 'Fan',
    items: ['Pedestal Fan', 'Table Fan', 'Wall Fan', 'Exhaust Fan', 'Ceiling Fan'],
  },
  {
    heading: 'Outdoor Lighting',
    items: ['LED Flood Light', 'LED Street Light', 'Wall Light'],
  },
  {
    heading: 'Decorative Lights',
    items: ['LED Strip Light', 'LED Rope Light', 'Pendant Light', 'Wall Light', 'LED Scale Light'],
  },
  {
    heading: 'Lighting Accessories',
    items: ['LED Strip Light Driver'],
  },
],
  bathroom: [
  {
    heading: 'Bath Faucets',
    items: ['Wall Mixer', 'Diverter', 'Bath Spout', 'Bib Tap', 'Shower Head', 'Shower Arm', 'Hand Held Shower', 'Angle Valve'],
  },
  {
    heading: 'Tiles Tools & Accessories',
    items: ['Tile Adhesive', 'Tile Grout', 'Tile Tools', 'Tile Clean & Care'],
  },
  {
    heading: 'Toilets',
    items: ['One Piece Toilet', 'Two Piece Toilet', 'Toilet Seat cover', 'Indian Toilet (IWC)', 'Flush tank', 'Flush Plate', 'Health Faucet', 'Urinal Push Cock'],
  },
  {
    heading: 'Wash Basins',
    items: ['Wall hung Basin', 'Table Top Basin', 'Pedestal Basin', 'Pedestal'],
  },
  {
    heading: 'Bath Accessories',
    items: ['Storage Shelf', 'Towel Rail', 'Soap Holder', 'Soap Dispenser', 'Towel Ring', 'Toilet Paper Holder', 'Tumbler Holder', 'Bottle Trap', 'Waste Coupling', 'Floor Drain', 'Towel Rack', 'Wall Bracket', 'Hose Pipe', 'Robe Hook', 'Grab Bar'],
  },
  {
    heading: 'Bath Mirrors',
    items: ['Bath Mirror'],
  },
],
  appliances: [
    {
      heading: 'Small Domestic Appliances',
      items: ['Mixer Grinder','Wet Grinder','Electric Kettle','Iron Box'],
    },
    {
      heading: 'Hobs & Chimney',
      items: ['Chimney', 'Induction Cooktop', 'Gas Stove'],
    },
    {
      heading: 'Large Domestic Appliances',
      items: ['Air Conditioner'],
    },
    {
      heading: 'Water Treatment',
      items: ['RO Water Filter'],
    },
  ],
};

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCatOpen, setIsCatOpen] = useState(false);
  const [isUserOpen, setIsUserOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeMega, setActiveMega] = useState(null);
  const megaTimeoutRef = useRef(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { getCartCount } = useCart();
  const catRef = useRef(null);
  const userRef = useRef(null);

  const openMega = (slug) => {
    clearTimeout(megaTimeoutRef.current);
    setActiveMega(slug);
  };

  const closeMega = () => {
    megaTimeoutRef.current = setTimeout(() => setActiveMega(null), 150);
  };

  const keepMega = () => {
    clearTimeout(megaTimeoutRef.current);
  };

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
            <div
              key={c.slug}
              className="navbar-item-wrap"
              onMouseEnter={() => MEGA_MENU[c.slug] && openMega(c.slug)}
              onMouseLeave={closeMega}
            >
              <Link
                to={`/category/${c.slug}`}
                className={`navbar-link ${location.pathname === `/category/${c.slug}` ? 'active' : ''}`}
              >
                {c.label}
              </Link>

              {/* Mega Menu Panel */}
              {activeMega === c.slug && MEGA_MENU[c.slug] && (
                <div
                  className="mega-menu-panel"
                  onMouseEnter={keepMega}
                  onMouseLeave={closeMega}
                >
                  <div className="mega-menu-inner">
                    {MEGA_MENU[c.slug].map((group) => (
                      <div key={group.heading} className="mega-group">
                        <h4 className="mega-group-heading">{group.heading}</h4>
                        <ul className="mega-group-list">
                          {group.items.map((item) => (
                            <li key={item}>
                              <Link
                                to={`/category/${c.slug}?sub=${encodeURIComponent(item)}`}
                                className="mega-item-link"
                                onClick={() => setActiveMega(null)}
                              >
                                {item}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </nav>
    </header>
  );
};

export default Header;
