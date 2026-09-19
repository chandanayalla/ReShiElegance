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
          <h1>About Us</h1>
          <div className="info-content">
            <h4>Our Story</h4>
            <h2>Where Tradition Meets Modern Elegance</h2>
            <p>
              At <strong>ReshiElegance</strong>, we believe that fashion is more than what you wear - it is a reflection of who you are.
            </p>
            <p>
              Inspired by the timeless beauty of Indian traditions, we bring together carefully selected <strong>sarees and fashion jewellery</strong> that celebrate elegance, individuality, and everyday moments.
            </p>
            <p>
              From graceful sarees for special occasions to beautiful jewellery that adds the perfect finishing touch, every piece is chosen with an eye for <strong>quality, beauty, and contemporary style</strong>.
            </p>

            <h4>What We Believe</h4>
            <ul>
              <li>✨ <strong>Timeless Elegance</strong> - Designs inspired by Indian heritage with a modern touch.</li>
              <li>💎 <strong>Quality First</strong> - Thoughtfully selected products you can feel confident wearing.</li>
              <li>🌸 <strong>For Every Occasion</strong> - From everyday elegance to weddings and celebrations.</li>
              <li>🤍 <strong>Made to Feel Special</strong> - Because every outfit should make you feel beautiful.</li>
            </ul>

            <h4>Our Promise</h4>
            <h2>Your style. Your story. Your elegance.</h2>
            <p>
              We want ReshiElegance to be a place where tradition feels fresh, fashion feels personal, and every purchase becomes a part of your story.
            </p>
            <p><strong>Thank you for choosing ReshiElegance.</strong></p>
            <p><em>More than fashion, a feeling.</em></p>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default About;
