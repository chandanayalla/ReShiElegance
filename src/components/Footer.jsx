import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import logo from '../assets/main.jpeg';
import './Footer.css';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { getTotalItems } = useContext(CartContext);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  return (
    <footer className="footer">
      {/* Newsletter Section */}
      <section className="newsletter-section py-5">
        <div className="container-fluid">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <h3>Subscribe to Our Newsletter</h3>
              <p>Get exclusive offers, new arrivals, and styling tips delivered to your inbox.</p>
            </div>
            <div className="col-lg-6">
              <form className="subscribe-form" onSubmit={handleSubscribe}>
                <div className="input-group">
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <button className="btn btn-primary" type="submit">
                    Subscribe
                  </button>
                </div>
                {isSubscribed && (
                  <small className="text-success">Thanks for subscribing!</small>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Main Footer */}
      <section className="footer-main py-5">
        <div className="container-fluid">
          <div className="row">
            {/* Brand Info */}
            <div className="col-md-4 mb-4">
              <div className="footer-brand">
                <div className="brand-logo mb-3">
                  <img src={logo} alt="ReShi Elegance Logo" className="footer-brand-image" />
                  <div className="brand-text">
                    <span className="brand-name">ReShi</span>
                    <span className="brand-tagline">Elegance</span>
                  </div>
                </div>
                <p className="tagline">"Grace in every weave, elegance in every drape."</p>
                <p>Experience the timeless beauty of traditional sarees crafted with premium quality and modern designs.</p>
              </div>
            </div>

            {/* Quick Links */}
            <div className="col-md-2 mb-4">
              <h5>Quick Links</h5>
              <ul className="footer-links">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/shop">Shop</Link></li>
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/contact">Contact</Link></li>
                <li><a href="#faq">FAQ</a></li>
              </ul>
            </div>

            {/* Customer Service */}
            <div className="col-md-2 mb-4">
              <h5>Customer Service</h5>
              <ul className="footer-links">
                <li><a href="#shipping">Shipping Info</a></li>
                <li><a href="#returns">Returns</a></li>
                <li><a href="#faq">FAQ</a></li>
                <li><Link to="/contact">Contact Us</Link></li>
                <li><a href="#privacy">Privacy Policy</a></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="col-md-2 mb-4">
              <h5>Contact Us</h5>
              <ul className="contact-info">
                <li>
                  <i className="bi bi-telephone"></i>
                  <span>+917815861896</span>
                </li>
                <li>
                  <i className="bi bi-envelope"></i>
                  <span>reshielegancee@gmail.com</span>
                </li>
                <li>
                  <i className="bi bi-geo-alt"></i>
                  <span>Tuni, Andhra Pradesh, India</span>
                </li>
              </ul>
            </div>

            {/* Social & Payment */}
            <div className="col-md-2 mb-4">
              <h5>Follow Us</h5>
              <div className="social-links mb-4">
                <a href="#facebook" title="Facebook">
                  <i className="bi bi-facebook"></i>
                </a>
                <a href="#instagram" title="Instagram">
                  <i className="bi bi-instagram"></i>
                </a>
                <a href="#youtube" title="YouTube">
                  <i className="bi bi-youtube"></i>
                </a>
              </div>
              <h6>Payment Methods</h6>
              <div className="payment-methods">
                <i className="bi bi-credit-card"></i>
                <i className="bi bi-wallet2"></i>
                <span>+ More</span>
              </div>
            </div>
          </div>

          {/* Divider */}
          <hr className="my-4" />

          {/* Bottom Footer */}
          <div className="row align-items-center">
            <div className="col-md-6 text-center text-md-start">
              <p className="mb-0">
                &copy; 2026 ReShi Elegance. All rights reserved.
              </p>
            </div>
            <div className="col-md-6 text-center text-md-end">
              <p className="mb-0">
                <a href="#terms">Terms of Service</a> | 
                <a href="#privacy"> Privacy Policy</a> | 
                <a href="#cookies"> Cookie Policy</a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </footer>
  );
};

export default Footer;
