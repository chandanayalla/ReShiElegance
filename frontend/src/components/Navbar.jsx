import React, { useContext, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import logo from '../assets/main.jpeg';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { getTotalItems } = useContext(CartContext);
  const { isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('mobile-menu-open', isMenuOpen);
    return () => document.body.classList.remove('mobile-menu-open');
  }, [isMenuOpen]);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname, location.search]);

  const handleSearch = (event) => {
    event.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/shop?search=${encodeURIComponent(searchQuery)}`;
      setIsMenuOpen(false);
    }
  };

  const closeMobileMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <nav className={`navbar navbar-expand-lg navbar-light ${location.pathname === '/' ? 'home-navbar' : ''} ${isScrolled ? 'sticky-top navbar-shadow' : ''} ${isMenuOpen ? 'menu-open' : ''}`}>
        <div className="container-fluid">
          <div className="brand-left-tools">
            <button
              className="brand-tool"
              type="button"
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMenuOpen}
              onClick={() => setIsMenuOpen((open) => !open)}
            >
              <i className={`bi ${isMenuOpen ? 'bi-x-lg' : 'bi-list'}`}></i>
            </button>
          </div>

          <Link className="navbar-brand" to="/" aria-label="ReShi Elegance home">
            <div className="brand-logo brand-crest">
              <img src={logo} alt="ReShi Elegance Logo" className="brand-image" />
            </div>
          </Link>

          <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`} id="navbarNav">
            {/* Search Bar */}
            <form className="mobile-drawer-search" onSubmit={handleSearch}>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search products or enter Product ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button className="btn btn-primary" type="submit">
                  <i className="bi bi-search"></i>
                </button>
              </div>
            </form>

            {/* Nav Links */}
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/" onClick={closeMobileMenu}>Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/clothing" onClick={closeMobileMenu}>Clothing</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/jewellery" onClick={closeMobileMenu}>Jewellery</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/about" onClick={closeMobileMenu}>About Us</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/contact" onClick={closeMobileMenu}>Contact Us</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/admin/login" onClick={closeMobileMenu}>Admin</Link>
              </li>
            </ul>

          </div>

          <div className="navbar-icons">
            <button className="icon-link search-toggle" type="button" title="Search" aria-label="Search" onClick={() => setIsSearchOpen((open) => !open)}>
              <i className="bi bi-search"></i>
            </button>
              <Link to="/wishlist" className="icon-link" title="Wishlist" aria-label="Wishlist">
              <i className="bi bi-heart"></i>
            </Link>
            <Link
              to={isAuthenticated ? '/account' : '/login'}
              className="icon-link"
              title={isAuthenticated ? 'Account' : 'Login'}
              aria-label={isAuthenticated ? 'Account' : 'Login'}
            >
              <i className="bi bi-person-circle"></i>
            </Link>
            <Link to="/cart" className="icon-link cart-icon" title="Cart" aria-label="Cart">
              <i className="bi bi-bag"></i>
              {getTotalItems() > 0 && <span className="cart-badge">{getTotalItems()}</span>}
            </Link>
          </div>

          <form id="site-search" className={`search-form ${isSearchOpen ? 'show' : ''}`} onSubmit={handleSearch}>
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Search products or enter Product ID..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
              />
              <button className="btn btn-primary" type="submit" aria-label="Submit search">
                <i className="bi bi-search"></i>
              </button>
            </div>
          </form>
        </div>
      </nav>
      <nav className="mobile-bottom-nav" aria-label="Quick navigation">
        <Link to="/" className={location.pathname === '/' ? 'active' : ''}><i className="bi bi-house"></i><span>Home</span></Link>
        <Link to="/choose" className={location.pathname === '/choose' ? 'active' : ''}><i className="bi bi-grid"></i><span>Categories</span></Link>
        <Link to="/wishlist" className={location.pathname === '/wishlist' ? 'active' : ''}><i className="bi bi-heart"></i><span>Wishlist</span></Link>
        <Link to="/cart" className={location.pathname === '/cart' ? 'active' : ''}><i className="bi bi-bag"></i><span>Cart</span></Link>
        <Link to={isAuthenticated ? '/account' : '/login'} className={location.pathname === '/account' ? 'active' : ''}><i className="bi bi-person"></i><span>Profile</span></Link>
      </nav>
      {isMenuOpen && (
        <button
          className="mobile-menu-backdrop"
          type="button"
          aria-label="Close menu"
          onClick={closeMobileMenu}
        />
      )}
    </>
  );
};

export default Navbar;
