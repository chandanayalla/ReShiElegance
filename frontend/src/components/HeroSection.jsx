import React from 'react';
import { Link } from 'react-router-dom';
import heroImage from '../assets/homepage-hero.png';
import mobileHeroImage from '../assets/mobilehero.png';
import './HeroSection.css';

const HeroSection = () => {
  return (
    <section className="home-hero-section" aria-label="ReShi Elegance hero banner">
      <picture>
        <source media="(max-width: 600px)" srcSet={mobileHeroImage} />
        <img src={heroImage} alt="ReShi Elegance fashion hero" className="home-hero-image" />
      </picture>
      <div className="home-hero-caption">
        <p className="eyebrow">THE NEW SEASON</p>
        <h1>Elegance, thoughtfully chosen.</h1>
        <p>Timeless sarees and jewellery for the moments that become memories.</p>
        <Link to="/choose" className="home-hero-cta">Explore the collection <i className="bi bi-arrow-up-right"></i></Link>
      </div>
    </section>
  );
};

export default HeroSection;
