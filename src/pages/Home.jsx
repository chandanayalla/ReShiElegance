import React, { useState, useEffect, useMemo } from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import CategorySection from '../components/CategorySection';
import ProductCard from '../components/ProductCard';
import Footer from '../components/Footer';
import api from '../services/api';
import { categories as defaultCategories } from '../data/products';
import { readArrayResponse } from '../utils/apiData';
import './Home.css';

const Home = () => {
  const [showAddedNotification, setShowAddedNotification] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await api.get('/products');
        setProducts(readArrayResponse(response.data));
      } catch (err) {
        setError('Unable to load products.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const productCategories = useMemo(() => {
    const unique = [...new Set(products.map((p) => p.category).filter(Boolean))];
    return unique.length ? unique.map((name, index) => ({ id: index, name, image: defaultCategories[index]?.image || 'https://via.placeholder.com/600x400' })) : defaultCategories;
  }, [products]);

  const newArrivals = useMemo(() => {
    return [...products]
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      .slice(0, 6);
  }, [products]);

  const bestSellers = useMemo(() => {
    return [...products]
      .filter((product) => product.status === 'In Stock')
      .sort((a, b) => (Number(a.stock) || 0) - (Number(b.stock) || 0))
      .slice(0, 6);
  }, [products]);

  const handleAddToCart = () => {
    setShowAddedNotification(true);
    setTimeout(() => setShowAddedNotification(false), 2000);
  };

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <section className="features-section py-5">
        <div className="container-fluid">
          <div className="row g-4">
            {[
              {
                icon: 'bi-truck',
                title: 'Free Shipping',
                description: 'On orders above ₹999'
              },
              {
                icon: 'bi-shield-check',
                title: 'Secure Payment',
                description: 'SSL encrypted checkout'
              },
              {
                icon: 'bi-arrow-counterclockwise',
                title: 'Easy Returns',
                description: '30-day return policy'
              },
              {
                icon: 'bi-chat-dots',
                title: 'Support 24/7',
                description: 'Dedicated customer support'
              },
            ].map((feature, index) => (
              <div key={index} className="col-md-6 col-lg-3">
                <div className="feature-card">
                  <div className="feature-icon">
                    <i className={`bi ${feature.icon}`}></i>
                  </div>
                  <h5>{feature.title}</h5>
                  <p>{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <CategorySection categories={productCategories} />

      {/* New Arrivals Section */}
      <section className="products-section py-5" id="new-arrivals">
        <div className="container-fluid">
          <div className="section-header mb-5 text-center">
            <h2>New Arrivals</h2>
            <p>Discover the latest additions to our collection</p>
            <div className="title-divider"></div>
          </div>

          <div className="row g-4">
            {newArrivals.map(product => (
              <div key={product.id} className="col-6 col-lg-4 col-md-6">
                <ProductCard product={product} onAddToCart={handleAddToCart} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Promotional Banner */}
      <section className="promo-banner py-5">
        <div className="container-fluid">
          <div className="banner-content">
            <h2>Celebrate Tradition</h2>
            <h3>Embrace Elegance</h3>
            <p>Every saree tells a story of craftsmanship and grace</p>
            <a href="/shop" className="btn btn-primary btn-lg">
              Explore Collection
            </a>
          </div>
        </div>
      </section>

      {/* Best Sellers Section */}
      <section className="products-section py-5" id="best-sellers">
        <div className="container-fluid">
          <div className="section-header mb-5 text-center">
            <h2>Best Sellers</h2>
            <p>Our most loved and trusted collection</p>
            <div className="title-divider"></div>
          </div>

          <div className="row g-4">
            {bestSellers.map(product => (
              <div key={product.id} className="col-6 col-lg-4 col-md-6">
                <ProductCard product={product} onAddToCart={handleAddToCart} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section py-5">
        <div className="container-fluid">
          <div className="cta-content">
            <h2>Join Our Community</h2>
            <p>Be the first to know about new collections, exclusive offers, and style tips</p>
            <form className="cta-form" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email"
                required
              />
              <button type="submit" className="btn btn-primary">Subscribe</button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Home;
