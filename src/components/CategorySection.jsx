import React from 'react';
import { Link } from 'react-router-dom';
import './CategorySection.css';

const makeCategoryImage = ({ title, base, accent, highlight, motif }) => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 620">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="${highlight}"/>
          <stop offset="0.48" stop-color="${base}"/>
          <stop offset="1" stop-color="${accent}"/>
        </linearGradient>
        <radialGradient id="glow" cx="50%" cy="18%" r="70%">
          <stop offset="0" stop-color="#fff7e8" stop-opacity="0.5"/>
          <stop offset="1" stop-color="#fff7e8" stop-opacity="0"/>
        </radialGradient>
        <pattern id="motif" width="90" height="90" patternUnits="userSpaceOnUse">
          <path d="${motif}" fill="none" stroke="#f0c77a" stroke-width="4" opacity="0.35"/>
        </pattern>
      </defs>
      <rect width="900" height="620" fill="url(#bg)"/>
      <rect width="900" height="620" fill="url(#glow)"/>
      <rect width="900" height="620" fill="url(#motif)" opacity="0.72"/>
      <path d="M90 620 C180 430 210 250 450 140 C690 250 720 430 810 620 Z" fill="#fff7e8" opacity="0.16"/>
      <path d="M260 620 C300 465 330 330 450 250 C570 330 600 465 640 620 Z" fill="#54111b" opacity="0.28"/>
      <path d="M322 620 C350 500 380 405 450 346 C520 405 550 500 578 620 Z" fill="#fff7e8" opacity="0.18"/>
      <circle cx="450" cy="196" r="58" fill="#fff7e8" opacity="0.22"/>
      <path d="M218 112 H682" stroke="#f0c77a" stroke-width="5" opacity="0.5"/>
      <path d="M252 140 H648" stroke="#fff7e8" stroke-width="2" opacity="0.45"/>
      <text x="450" y="520" text-anchor="middle" font-family="Georgia, serif" font-size="44" font-weight="700" fill="#fff7e8" letter-spacing="6">${title}</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

const categoryVisuals = {
  'Cotton Sarees': makeCategoryImage({
    title: 'COTTON',
    base: '#b78363',
    accent: '#6f2a28',
    highlight: '#f2d7a9',
    motif: 'M10 45 C28 15 62 15 80 45 C62 75 28 75 10 45 Z',
  }),
  'Silk Sarees': makeCategoryImage({
    title: 'SILK',
    base: '#7f1f2b',
    accent: '#3f0b14',
    highlight: '#edc678',
    motif: 'M45 8 L58 35 L86 45 L58 55 L45 82 L32 55 L4 45 L32 35 Z',
  }),
  'Party Wear Sarees': makeCategoryImage({
    title: 'PARTY',
    base: '#8a3a47',
    accent: '#1f1015',
    highlight: '#d8a45f',
    motif: 'M45 12 A33 33 0 1 0 45 78 A33 33 0 1 0 45 12 M45 25 A20 20 0 1 1 45 65 A20 20 0 1 1 45 25',
  }),
  'Designer Sarees': makeCategoryImage({
    title: 'DESIGNER',
    base: '#9f4e4f',
    accent: '#5a171f',
    highlight: '#f1c982',
    motif: 'M8 80 C24 18 66 18 82 80 M22 70 C34 38 56 38 68 70',
  }),
  'Bridal Sarees': makeCategoryImage({
    title: 'BRIDAL',
    base: '#741824',
    accent: '#30070d',
    highlight: '#f0b85e',
    motif: 'M45 8 L70 70 H20 Z M45 28 L57 62 H33 Z',
  }),
  'Banarasi Sarees': makeCategoryImage({
    title: 'BANARASI',
    base: '#6a1a21',
    accent: '#a06a37',
    highlight: '#f4d28d',
    motif: 'M12 48 C22 18 68 18 78 48 C66 76 24 76 12 48 Z M45 18 V78',
  }),
};

const categoryOrder = [
  'Cotton Sarees',
  'Silk Sarees',
  'Party Wear Sarees',
  'Designer Sarees',
  'Bridal Sarees',
  'Banarasi Sarees',
];

const CategorySection = ({ categories }) => {
  const categoryMap = new Map((categories || []).map((category) => [category.name, category]));
  const items = categoryOrder.map((name, index) => ({
    id: categoryMap.get(name)?.id || index + 1,
    name,
    image: categoryVisuals[name],
  }));

  return (
    <section className="category-section py-5">
      <div className="container-fluid">
        {/* Section Title */}
        <div className="section-header mb-5 text-center">
          <h2>Shop by Category</h2>
          <p>Discover our exclusive collection of sarees</p>
          <div className="title-divider"></div>
        </div>

        {/* Categories Grid */}
        <div className="row g-4">
          {items.map((category) => (
            <div key={category.name} className="col-md-6 col-lg-4">
              <Link to={`/shop?category=${category.name}`} className="category-card-link">
                <div className="category-card">
                  <div className="category-image">
                    <img
                      src={category.image}
                      alt={category.name}
                    />
                    <div className="overlay"></div>
                  </div>
                  <div className="category-content">
                    <h4>{category.name}</h4>
                    <p>
                      <i className="bi bi-arrow-right"></i>
                      <span>Explore</span>
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
