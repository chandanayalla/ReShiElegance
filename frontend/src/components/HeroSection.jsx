import React from 'react';
import { Link } from 'react-router-dom';
import heroImage from '../assets/hero1.jpeg';
import './HeroSection.css';

const benefits = [
  ['bi-truck', 'Fast & Reliable Delivery'],
  ['bi-shield-check', 'Secure Payment'],
  ['bi-gem', 'Premium Quality'],
  ['bi-headset', 'Support 24/7'],
];

const HeroSection = () => {
  return (
    <section className="hero-section" style={{ backgroundImage: `url(${heroImage})` }}>
      <div className="hero-inner">
        <div className="hero-copy">
          <p className="hero-label">Tradition <span>|</span> Style <span>|</span> You</p>
          <h1>Elevate<br />your style</h1>
          <p>Timeless jewellery and ethnic fashion for every occasion.</p>
          <div className="hero-buttons">
            <Link to="/choose" className="btn hero-primary-btn">Explore Now <span>→</span></Link>
          </div>
        </div>

      </div>

      <div className="hero-benefits" aria-label="ReShi Elegance benefits">
        {benefits.map(([icon, title]) => (
          <div className="hero-benefit" key={title}>
            <i className={`bi ${icon}`} aria-hidden="true"></i>
            <span>{title}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
