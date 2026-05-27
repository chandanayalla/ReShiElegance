import React from 'react';
import { Link } from 'react-router-dom';
import './CategorySection.css';

const CategorySection = ({ categories }) => {
  const fallbackCategories = [
    { id: 1, name: 'Sarees', image: 'https://images.unsplash.com/photo-1543163521-9145f931371e?w=800' },
    { id: 2, name: 'Blouses', image: 'https://images.unsplash.com/photo-1609631183071-fdfb62db3bbd?w=800' },
    { id: 3, name: 'Lehengas', image: 'https://images.unsplash.com/photo-1625895477097-9c7b2cb88e26?w=800' },
  ];
  const items = categories && categories.length ? categories : fallbackCategories;

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
            <div key={category.id} className="col-md-6 col-lg-4">
              <Link to={`/shop?category=${category.name}`} className="category-card-link">
                <div className="category-card">
                  <div className="category-image">
                    <img src={category.image} alt={category.name} />
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
