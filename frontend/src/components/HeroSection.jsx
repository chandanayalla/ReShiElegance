import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import heroImage from '../assets/desktophome.png';
import mobileHeroImage from '../assets/mobilehero.png';
import './HeroSection.css';

const HeroSection = () => {
  useEffect(() => {
    const previousHtmlOverflow = document.documentElement.style.overflow;
    const previousBodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';

    return () => {
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.overflow = previousBodyOverflow;
    };
  }, []);

  return (
    <section className="home-hero-section" aria-label="ReShi Elegance hero banner">
      <picture>
        <source media="(max-width: 600px)" srcSet={mobileHeroImage} />
        <img src={heroImage} alt="ReShi Elegance fashion hero" className="home-hero-image" />
      </picture>
      <Link to="/choose" className="home-hero-image-cta" aria-label="Explore now" />
    </section>
  );
};

export default HeroSection;
