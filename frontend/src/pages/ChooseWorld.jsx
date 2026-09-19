import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import screen2Image from '../assets/screen2.png';
import './ChooseWorld.css';

const ChooseWorld = () => (
  <>
    <Navbar />
    <main className="choose-world-page" aria-label="Choose what to shop">
      <div className="choose-world-artwork">
        <img src={screen2Image} alt="Choose between clothing and jewellery" />
        <Link to="/clothing" className="choose-world-hotspot clothing-hotspot" aria-label="Explore clothing" />
        <Link to="/jewellery" className="choose-world-hotspot jewellery-hotspot" aria-label="Explore jewellery" />
      </div>
    </main>
  </>
);

export default ChooseWorld;
