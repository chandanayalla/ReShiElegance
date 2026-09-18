import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import api from '../services/api';
import { readArrayResponse } from '../utils/apiData';
import { products as catalogProducts } from '../data/products';
import './Clothing.css';

const clothingCatalog = catalogProducts.filter((product) => product.productType === 'clothing');
const heroImage = clothingCatalog[0]?.images?.[0];

const ClothingHome = () => {
  const [products, setProducts] = useState(clothingCatalog);

  useEffect(() => {
    api.get('/products').then((response) => {
      const items = readArrayResponse(response.data).filter((product) => product.productType !== 'jewellery');
      if (items.length) setProducts(items);
    }).catch(() => {});
  }, []);

  const categories = useMemo(() => {
    const seen = new Set();
    return products.filter((product) => {
      if (!product.category || seen.has(product.category)) return false;
      seen.add(product.category);
      return true;
    }).slice(0, 6);
  }, [products]);
  const newArrivals = products.filter((product) => product.isNewArrival).slice(0, 4);
  const bestSellers = products.filter((product) => product.isBestSeller).slice(0, 4);
  const featured = products.find((product) => product.isBestSeller) || products[0];

  return (
    <>
      <Navbar />
      <main className="clothing-page">
        <section className="clothing-hero">
          <img src={heroImage} alt="Elegant saree from the ReShi clothing collection" />
          <div className="clothing-hero-copy">
            <p className="eyebrow">THE CLOTHING EDIT</p>
            <h1>Tradition, Woven Beautifully</h1>
            <p>Timeless sarees and occasion-ready pieces made for your story.</p>
            <Link to="/shop?department=clothing" className="btn clothing-primary-btn">Shop Sarees <span>→</span></Link>
          </div>
        </section>

        <section className="clothing-benefits" aria-label="Clothing benefits">
          <span>✦ Handpicked Fabrics</span><span>♢ Quality Craftsmanship</span><span>✧ Easy Returns</span><span>♕ Made For Every Occasion</span>
        </section>

        <section className="clothing-section">
          <div className="clothing-section-heading"><p className="eyebrow">FIND YOUR DRAPE</p><h2>Shop By Collection</h2><p>Explore sarees for every mood and moment</p></div>
          <div className="clothing-category-grid">
            {categories.map((category) => <Link className="clothing-category-card" to={`/shop?department=clothing&category=${encodeURIComponent(category.category)}`} key={category.category}>
              <img src={category.images?.[0] || category.image} alt={category.category} loading="lazy" />
              <span>{category.category}</span><small>Explore collection →</small>
            </Link>)}
          </div>
        </section>

        {featured && <section className="clothing-feature-banner" style={{ backgroundImage: `url(${featured.images?.[0] || featured.image})` }}>
          <div><p className="eyebrow">SIGNATURE SILHOUETTES</p><h2>Designed To Be Remembered</h2><p>Elegant colour, graceful drape, and details that stay with you.</p><Link to="/shop?department=clothing&category=Bridal%20Sarees" className="btn clothing-primary-btn">Explore Sarees <span>→</span></Link></div>
        </section>}

        <section className="clothing-section clothing-products">
          <div className="clothing-section-heading"><p className="eyebrow">JUST IN</p><h2>New Arrivals</h2><p>Fresh styles for your next occasion</p></div>
          <div className="row g-3 g-md-4">{(newArrivals.length ? newArrivals : products.slice(0, 4)).map((product) => <div className="col-6 col-lg-3" key={product.id}><ProductCard product={product} /></div>)}</div>
        </section>

        <section className="clothing-section clothing-best-sellers">
          <div className="clothing-section-heading"><p className="eyebrow">LOVED BY OUR COMMUNITY</p><h2>Best Sellers</h2><p>The sarees customers keep coming back for</p></div>
          <div className="row g-3 g-md-4">{(bestSellers.length ? bestSellers : products.slice(0, 4)).map((product) => <div className="col-6 col-lg-3" key={product.id}><ProductCard product={product} /></div>)}</div>
        </section>

        <section className="clothing-promo"><div><p className="eyebrow">YOUR NEXT FAVOURITE</p><h2>Find A Saree For Every Story</h2><Link to="/shop?department=clothing" className="btn clothing-primary-btn">View All Clothing <span>→</span></Link></div></section>
      </main>
      <Footer />
    </>
  );
};

export default ClothingHome;
