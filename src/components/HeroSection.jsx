import React from 'react';
import { Link } from 'react-router-dom';
import heroImg from '../assets/head.jpeg';
import './HeroSection.css';

const HeroSection = () => {
  return (
    <section className="hero-section">
      <div className="container-fluid h-100">
        <div className="hero-frame">
          <div className="hero-card row align-items-center">
            <div className="col-lg-6 hero-content">
              <p className="hero-label">Women's Fashion | Saree Collection</p>
              <h1 className="hero-title">
                Elegance Woven<br />
                <span>For Every Woman</span>
              </h1>
              <p className="hero-subtitle">
                Timeless sarees crafted with grace, made for every special moment.
              </p>
              <p className="hero-description">
                Experience the perfect blend of tradition and contemporary style. Our curated collection celebrates the elegance of Indian sarees with premium quality and exquisite designs.
              </p>
              <div className="hero-buttons">
                <Link to="/shop" className="btn btn-primary btn-lg">
                  <i className="bi bi-bag-check me-2"></i>Shop Now
                </Link>
                <a href="#features" className="btn btn-outline-primary btn-lg">
                  <i className="bi bi-play-circle me-2"></i>Explore More
                </a>
              </div>
            </div>

            <div className="col-lg-6 hero-image">
              <div className="image-card">
                <div className="image-frame-top"></div>
                <div className="image-frame-side"></div>
                <img src={heroImg} alt="Woman wearing a stylish saree" loading="lazy" className="main-image" />
                <div className="image-tag">New Arrival</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
