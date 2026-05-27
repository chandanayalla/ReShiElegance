import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import logo from '../assets/main.jpeg';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const { getTotalItems } = useContext(CartContext);
  const { user, isAuthenticated, logout } = useContext(AuthContext);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/shop?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <>
      {/* Announcement Bar */}
      <div className="announcement-bar">
        <p className="mb-0">
          <i className="bi bi-truck me-2"></i>Free Shipping on orders above ₹999
        </p>
      </div>

      {/* Navbar */}
      <nav className={`navbar navbar-expand-lg navbar-light ${isScrolled ? 'sticky-top navbar-shadow' : ''}`}>
        <div className="container-fluid">
          {/* Logo */}
          <Link className="navbar-brand" to="/">
            <div className="brand-logo">
              <img src={logo} alt="ReShi Elegance Logo" className="brand-image" />
              <div className="brand-text">
                <span className="brand-name">ReShi</span>
                <span className="brand-tagline">Elegance</span>
              </div>
            </div>
          </Link>

          {/* Toggle Button */}
          <button
            className="navbar-toggler"
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Collapse Content */}
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
                <Link className="nav-link" to="/">Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/shop">Sarees</Link>
              </li>
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" id="collectionsDropdown" role="button" data-bs-toggle="dropdown">
                  Collections
                </a>
                <ul className="dropdown-menu">
                  <li><Link className="dropdown-item" to="/shop?category=New Arrivals">New Arrivals</Link></li>
                  <li><Link className="dropdown-item" to="/shop?category=Best Sellers">Best Sellers</Link></li>
                  <li><Link className="dropdown-item" to="/shop?category=Bridal Sarees">Bridal Sarees</Link></li>
                  <li><Link className="dropdown-item" to="/shop?category=Party Wear Sarees">Party Wear</Link></li>
                </ul>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/about">About Us</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/contact">Contact Us</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/admin/login">Admin</Link>
              </li>
            </ul>

            {/* Icons */}
            <div className="navbar-icons ms-lg-3">
              <Link to="/wishlist" className="icon-link" title="Wishlist">
                <i className="bi bi-heart"></i>
              </Link>
              
              {isAuthenticated ? (
                <div className="dropdown">
                  <a href="#" className="icon-link dropdown-toggle" id="accountDropdown" data-bs-toggle="dropdown">
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
                <Link to="/login" className="icon-link" title="Account">
                  <i className="bi bi-person-circle"></i>
                </Link>
              )}
              
              <Link to="/cart" className="icon-link cart-icon" title="Cart">
                <i className="bi bi-cart3"></i>
                {getTotalItems() > 0 && (
                  <span className="cart-badge">{getTotalItems()}</span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
