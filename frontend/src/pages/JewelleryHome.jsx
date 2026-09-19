import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import api from '../services/api';
import { readArrayResponse } from '../utils/apiData';
import { jewelleryCategories, jewelleryProducts } from '../data/jewellery';
import './Jewellery.css';

const heroImage = jewelleryProducts[0].images[0];
const jewelleryHeroImage = new URL('../assets/jewelleryhero.png', import.meta.url).href;

const JewelleryHome = () => {
  const location = useLocation();
  const [products, setProducts] = useState(jewelleryProducts);

  useEffect(() => {
    api.get('/products').then((response) => {
      const items = readArrayResponse(response.data).filter((product) => product.productType === 'jewellery');
      if (items.length) setProducts(items);
    }).catch(() => {});
  }, []);

  const query = new URLSearchParams(location.search);
  const selectedOccasion = query.get('occasion') || '';
  const selectedCollection = query.get('collection') || '';
  const filteredProducts = useMemo(() => products.filter((product) => (
    (!selectedOccasion || product.occasion?.toLowerCase() === selectedOccasion.toLowerCase())
    && (!selectedCollection || product.collection === selectedCollection)
  )), [products, selectedCollection, selectedOccasion]);
  const newArrivals = filteredProducts.filter((product) => product.isNewArrival).slice(0, 4);
  const bestSellers = filteredProducts.filter((product) => product.isBestSeller).slice(0, 4);
  const fallbackArrivals = newArrivals.length ? newArrivals : filteredProducts.slice(0, 4);
  const occasionCards = [
    { name: 'Everyday Elegance', value: 'Everyday', image: products.find((product) => product.occasion === 'Everyday')?.images[0] },
    { name: 'Festive Collection', value: 'Festive', image: products.find((product) => product.occasion === 'Festive')?.images[0] },
    { name: 'Party Wear', value: 'Party', image: products.find((product) => product.occasion === 'Party')?.images[0] },
    { name: 'Wedding Collection', value: 'Wedding', image: products.find((product) => product.occasion === 'Wedding')?.images[0] },
    { name: 'Bridal Collection', value: 'Bridal', image: products.find((product) => product.occasion === 'Bridal')?.images[0] },
  ];
  const trendCards = [
    ['one-gram-gold', 'One Gram Gold Jewellery', products[2]?.images[0]],
    ['temple', 'Temple Jewellery', products[2]?.images[0]],
    ['pearl', 'Pearl Collection', products[3]?.images[0]],
    ['cz', 'CZ Collection', products[1]?.images[0]],
    ['matt-finish', 'Matt Finish', products[5]?.images[0]],
    ['minimal', 'Minimal Jewellery', products[6]?.images[0]],
  ];

  return (
    <>
      <Navbar />
      <main className="jewellery-page">
        <section className="jewellery-hero">
          <img src={jewelleryHeroImage} alt="Reshi Elegance jewellery collection" />
          <Link to="/jewellery/necklaces" className="jewellery-hero-hotspot necklaces-hotspot" aria-label="Explore necklaces" />
          <Link to="/jewellery/bangles" className="jewellery-hero-hotspot bangles-hotspot" aria-label="Explore bangles" />
          <Link to="/jewellery/earrings" className="jewellery-hero-hotspot earrings-hotspot" aria-label="Explore earrings" />
          <Link to="/jewellery/black-beads" className="jewellery-hero-hotspot black-beads-hotspot" aria-label="Explore black beads" />
          <Link to="/jewellery/thali-chains" className="jewellery-hero-hotspot thali-chains-hotspot" aria-label="Explore thali chains" />
          <Link to="/jewellery/rings" className="jewellery-hero-hotspot rings-hotspot" aria-label="Explore rings" />
          <Link to="/jewellery" className="jewellery-hero-hotspot jewellery-shop-hotspot" aria-label="Shop jewellery" />
        </section>

        <section className="jewellery-benefits" aria-label="Jewellery benefits">
          {['✦ Trendy Designs', '♢ Premium Quality', '✧ Skin Friendly', '♕ Every Occasion'].map((item) => <span key={item}>{item}</span>)}
        </section>

        <section className="jewellery-section">
          <div className="jewellery-section-heading"><p className="eyebrow">FIND YOUR SIGNATURE</p><h2>Shop By Category</h2><p>Discover jewellery for every occasion</p></div>
          <div className="jewellery-category-grid">
            {jewelleryCategories.map((category) => (
              <Link className="jewellery-category-card" to={`/jewellery/${category.slug}`} key={category.slug}>
                <img src={category.image} alt={category.name} loading="lazy" />
                <span>{category.icon}</span><h3>{category.name}</h3>
              </Link>
            ))}
          </div>
        </section>

        <section className="jewellery-featured-collections">
          <div className="jewellery-feature-banner black-beads-banner"><div><p className="eyebrow">TIMELESS SIGNATURES</p><h2>Black Beads Collection</h2><p>Tradition woven with timeless elegance.</p><Link to="/jewellery/black-beads" className="btn jewellery-primary-btn">Explore Collection <span>→</span></Link></div></div>
          <div className="jewellery-feature-banner thali-banner"><div><p className="eyebrow">HEIRLOOM STORIES</p><h2>Thali Chains Collection</h2><p>Celebrate every bond with elegance.</p><Link to="/jewellery/thali-chains" className="btn jewellery-primary-btn">Explore Collection <span>→</span></Link></div></div>
        </section>

        <section className="jewellery-section jewellery-occasions">
          <div className="jewellery-section-heading"><p className="eyebrow">MADE FOR YOUR MOMENT</p><h2>Shop By Occasion</h2><p>Find a little sparkle for every chapter</p></div>
          <div className="occasion-grid">{occasionCards.map((occasion) => <Link to={`/jewellery/shop?occasion=${encodeURIComponent(occasion.value)}`} className="occasion-card" key={occasion.value} style={{ backgroundImage: `url(${occasion.image || heroImage})` }}><span>{occasion.name}</span></Link>)}</div>
        </section>

        <section className="jewellery-section jewellery-arrivals">
          <div className="jewellery-section-heading"><p className="eyebrow">JUST IN</p><h2>New Arrivals</h2><p>Discover the latest additions to our jewellery collection</p></div>
          <div className="row g-4">{fallbackArrivals.map((product) => <div className="col-6 col-lg-3" key={product.id}><ProductCard product={product} /></div>)}</div>
        </section>

        <section className="jewellery-section jewellery-best-sellers">
          <div className="jewellery-section-heading"><p className="eyebrow">LOVED BY OUR COMMUNITY</p><h2>Best Sellers</h2><p>Pieces our customers keep coming back for</p></div>
          <div className="row g-4">{(bestSellers.length ? bestSellers : products.slice(0, 4)).map((product) => <div className="col-6 col-lg-3" key={product.id}><ProductCard product={product} /></div>)}</div>
        </section>

        <section className="jewellery-section">
          <div className="jewellery-section-heading"><p className="eyebrow">EXPLORE THE MOOD</p><h2>Trending Collections</h2><p>Curated details for your signature style</p></div>
          <div className="trend-grid">{trendCards.map(([slug, name, image]) => <Link to={`/jewellery/shop?collection=${encodeURIComponent(slug)}`} className="trend-card" key={slug}><img src={image || heroImage} alt={name} loading="lazy" /><div><h3>{name}</h3><span>Explore →</span></div></Link>)}</div>
        </section>

        <section className="jewellery-promo"><div><p className="eyebrow">A LITTLE MORE MAGIC</p><h2>Celebrate Every Moment With Sparkle</h2><Link to="/jewellery/shop" className="btn jewellery-primary-btn">Shop Now <span>→</span></Link></div></section>
      </main>
      <Footer />
    </>
  );
};

export default JewelleryHome;
