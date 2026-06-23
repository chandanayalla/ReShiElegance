import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import logo from '../assets/main.jpeg';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const { getTotalItems } = useContext(CartContext);
  const { user, isAuthenticated, logout } = useContext(AuthContext);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
      <nav className={`navbar navbar-expand-lg navbar-light ${isScrolled ? 'sticky-top navbar-shadow' : ''}`}>
        <div className="container-fluid">
          <div className="brand-left-tools">
            <button className="brand-tool" type="button" aria-label="Open menu" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <i className="bi bi-list"></i>
            </button>
          </div>

          <Link className="navbar-brand" to="/" aria-label="ReShi Elegance home">
            <div className="brand-logo brand-crest">
              <img src={logo} alt="ReShi Elegance Logo" className="brand-image" />
            </div>
          </Link>

          <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`} id="navbarNav">
            {/* Search Bar */}
            <form className="search-form mx-auto" onSubmit={handleSearch}>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search for sarees..."
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
                <Link className="nav-link" to="/shop" onClick={closeMobileMenu}>Sarees</Link>
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
            {isAuthenticated ? (
              <div className="dropdown">
                <a href="#" className="icon-link dropdown-toggle" id="accountDropdown" data-bs-toggle="dropdown" aria-label="Account">
                  <i className="bi bi-person-circle"></i>
                </a>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li><span className="dropdown-item-text">{user?.name}</span></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><Link className="dropdown-item" to="/account">My Account</Link></li>
                  <li><Link className="dropdown-item" to="/orders">My Orders</Link></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><a className="dropdown-item" href="#" onClick={logout}>Logout</a></li>
                </ul>
              </div>
            ) : (
              <Link to="/login" className="icon-link" title="Account" aria-label="Account">
                <i className="bi bi-person-circle"></i>
              </Link>
            )}
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
                placeholder="Search sarees..."
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
    </>
  );
};

export default Navbar;
