import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import heroImage from '../assets/hero.jpeg';
import './ChooseWorld.css';

const benefits = [
  ['bi-truck', 'Fast & Reliable', 'Delivery'],
  ['bi-shield-check', 'Secure', 'Payment'],
  ['bi-gem', 'Premium', 'Quality'],
  ['bi-headset', 'Support', '24/7'],
];

const ChooseWorld = () => (
  <>
    <Navbar />
    <main className="choose-world-page">
      <section className="choose-world-intro">
        <div>
          <h1>What would you<br />like to shop today?</h1>
          <p><span>—</span> ♡ Two worlds. One elegance. <span>—</span></p>
        </div>
        <div className="choose-world-script">Style<br />Tradition<br />You <span>♡</span></div>
      </section>

      <section className="world-cards">
        <Link to="/clothing" className="world-card clothing-world">
          <img src={heroImage} alt="Woman wearing an elegant pink saree" />
          <div className="world-card-copy">
            <h2>CLOTHING</h2>
            <p>Sarees, blouses,<br />kurtis and more</p>
            <span>Explore Clothing <b>→</b></span>
          </div>
          <i className="bi bi-flower1 world-flourish" aria-hidden="true"></i>
        </Link>
        <Link to="/jewellery" className="world-card jewellery-world">
          <img src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1100&q=90" alt="Traditional green and gold jewellery" />
          <div className="world-card-copy">
            <h2>JEWELLERY</h2>
            <p>Add a little sparkle<br />to your story</p>
            <span>Explore Jewellery <b>→</b></span>
          </div>
          <i className="bi bi-flower1 world-flourish" aria-hidden="true"></i>
        </Link>
      </section>

      <section className="choose-benefits" aria-label="Shopping benefits">
        {benefits.map(([icon, first, second]) => <div key={first}><i className={`bi ${icon}`} aria-hidden="true"></i><span>{first}<br />{second}</span></div>)}
      </section>

      <div className="choose-world-footer-line"><span></span> Elegance always finds its way to you. <span></span></div>
    </main>
  </>
);

export default ChooseWorld;
