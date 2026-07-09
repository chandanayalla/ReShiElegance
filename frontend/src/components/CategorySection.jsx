import React from 'react';
import { Link } from 'react-router-dom';
import headImage from '../assets/head.jpeg';
import mainImage from '../assets/main.jpeg';
import redOneImage from '../assets/red1.jpeg';
import redTwoImage from '../assets/red2.jpeg';
import './CategorySection.css';

const categoryVisuals = {
  'Cotton Sarees': {
    image: 'https://images.unsplash.com/photo-1596752831369-5900ec1be783?auto=format&fit=crop&w=900&q=90',
    fallback: mainImage,
  },
  'Silk Sarees': {
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=90',
    fallback: redOneImage,
  },
  'Party Wear Sarees': {
    image: 'https://images.unsplash.com/photo-1611515582262-aa8b4fd0dd24?auto=format&fit=crop&w=900&q=90',
    fallback: redTwoImage,
  },
  'Designer Sarees': {
    image: 'https://images.unsplash.com/photo-1579958118922-842f453fbf67?auto=format&fit=crop&w=900&q=90',
    fallback: headImage,
  },
  'Bridal Sarees': {
    image: 'https://images.unsplash.com/photo-1610271340738-ad26202e90df?auto=format&fit=crop&w=900&q=90',
    fallback: redOneImage,
  },
  'Banarasi Sarees': {
    image: 'https://images.unsplash.com/photo-1543163521-9145f931371e?auto=format&fit=crop&w=900&q=90',
    fallback: redTwoImage,
  },
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
    image: categoryVisuals[name].image,
    fallback: categoryVisuals[name].fallback,
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
            <div key={category.name} className="col-6 col-md-4 col-lg-2">
              <Link to={`/shop?category=${category.name}`} className="category-card-link">
                <div className="category-card">
                  <div className="category-image">
                    <img
                      src={category.image}
                      alt={category.name}
                      loading="lazy"
                      onError={(event) => {
                        event.currentTarget.onerror = null;
                        event.currentTarget.src = category.fallback;
                      }}
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
