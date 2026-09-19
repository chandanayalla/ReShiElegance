import React from 'react';
import { Link } from 'react-router-dom';
import heroImage from '../assets/homepage-hero.png';
import './HeroSection.css';

const HeroSection = () => {
  return (
    <section className="home-hero-section" aria-label="ReShi Elegance hero banner">
      <img src={heroImage} alt="ReShi Elegance fashion hero" className="home-hero-image" />
      <Link to="/choose" className="home-hero-cta" aria-label="Explore now" title="Explore Now" />
    </section>
  );
};

export default HeroSection;
