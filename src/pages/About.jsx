import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './Info.css';

const About = () => {
  return (
    <>
      <Navbar />

      <div className="info-container">
        <div className="container-fluid py-5">
          <h1>About ReShi Elegance</h1>
          <div className="info-content">
            <h4>Our Story</h4>
            <p>
              ReShi Elegance is dedicated to bringing the timeless beauty of traditional Indian sarees
              to modern women who appreciate craftsmanship, quality, and elegance. Every saree in our
              collection is carefully curated to celebrate the artistry of Indian textile tradition.
            </p>

            <h4>Our Mission</h4>
            <p>
              We strive to make authentic, premium-quality sarees accessible to women everywhere,
              ensuring that every customer experiences the grace and elegance that defines ReShi Elegance.
            </p>

            <h4>Why Choose Us?</h4>
            <ul>
              <li>Premium quality fabrics and authentic designs</li>
              <li>Direct partnership with skilled artisans</li>
              <li>Fair trade practices</li>
              <li>Free shipping on orders above ₹999</li>
              <li>30-day easy return policy</li>
              <li>24/7 customer support</li>
            </ul>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default About;
