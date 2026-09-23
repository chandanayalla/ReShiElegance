import React from 'react';
import { Link } from 'react-router-dom';
import heroImage from '../assets/desktophome.png';
import mobileHeroImage from '../assets/mobilehero.png';
import './HeroSection.css';

const HeroSection = () => {
  return (
    <section className="home-hero-section" aria-label="ReShi Elegance hero banner">
      <picture>
        <source media="(max-width: 600px)" srcSet={mobileHeroImage} />
        <img src={heroImage} alt="ReShi Elegance fashion hero" className="home-hero-image" />
      </picture>
      <div className="home-hero-content">
        <p className="eyebrow">THE RESHI EDIT</p>
        <h1>Grace in every detail.</h1>
        <p>Timeless sarees and jewellery for the moments that become memories.</p>
      </div>
      <Link to="/clothing" className="home-hero-cta" aria-label="Explore now">Explore now <span aria-hidden="true">&rarr;</span></Link>
    </section>
  );
};

export default HeroSection;
