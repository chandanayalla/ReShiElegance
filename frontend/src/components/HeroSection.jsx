import React from 'react';
import { Link } from 'react-router-dom';
import heroImg from '../assets/head.jpeg';
import mainImg from '../assets/main.jpeg';
import redOne from '../assets/red1.jpeg';
import redTwo from '../assets/red2.jpeg';
import './HeroSection.css';


// Single hero image to match the provided design (model on the right)
const heroImage = mainImg;

const HeroSection = () => {
  return (
    <section className="hero-section">
      <div className="hero-inner">
        <div className="hero-gallery" aria-label="ReShi Elegance featured saree collection">
          <Link to="/shop" className="hero-panel hero-single">
            <img src={heroImage} alt="Featured collection" loading="eager" />
          </Link>
        </div>

        <div className="hero-copy">
          <p className="hero-label">Women's clothing and saree atelier</p>
          <h1>Elegance Woven For Every Celebration</h1>
          <p>
            Sarees, blouses, kurtis and dress materials curated with a heritage mood,
            premium finish and ready-to-shop comfort.
          </p>
          <div className="hero-buttons">
            <Link to="/shop" className="btn btn-primary btn-lg">
              <i className="bi bi-bag-check me-2"></i>Shop Collection
            </Link>
            <Link to="/shop?category=New Arrivals" className="btn btn-outline-primary btn-lg">
              New Arrivals
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
