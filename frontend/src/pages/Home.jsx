import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { products } from '../data/products';
import { jewelleryProducts } from '../data/jewellery';
import clothingImage from '../assets/clothinghero.png';
import jewelleryImage from '../assets/jewelleryhero.png';
import './Home.css';

const Home = () => {
  const clothingProducts = products.filter((product) => product.productType !== 'jewellery');
  const newArrivals = [...products].filter((product) => product.isNewArrival).slice(0, 4);
  const featured = [...products].filter((product) => product.isBestSeller).slice(0, 4);
  const occasions = [
    { label: 'Weddings', value: 'Wedding', image: clothingProducts.find((product) => product.occasion === 'Wedding')?.images?.[0] },
    { label: 'Festivals', value: 'Festival', image: clothingProducts.find((product) => product.occasion === 'Festival')?.images?.[0] },
    { label: 'Everyday', value: 'Casual', image: clothingProducts.find((product) => product.occasion === 'Casual')?.images?.[0] },
  ];

  return (
    <>
      <Navbar />
      <HeroSection />
      <main className="home-page">
        <div className="home-trust-strip" aria-label="Reshi Elegance promises">
          <span><i className="bi bi-stars"></i> Thoughtfully curated</span>
          <span><i className="bi bi-gem"></i> Detail-led design</span>
          <span><i className="bi bi-box-seam"></i> Carefully packed</span>
          <span><i className="bi bi-heart"></i> Made for your moments</span>
        </div>

        <section className="home-section home-categories">
          <div className="home-section-heading"><p className="eyebrow">YOUR STYLE, YOUR STORY</p><h2>Shop by category</h2><p>Pieces with an effortless sense of occasion.</p></div>
          <div className="category-feature-grid">
            <Link to="/clothing" className="category-feature-card category-feature-card-large"><img src={clothingImage} alt="Saree collection" /><div><span>01 / CLOTHING</span><h3>The art of the drape</h3><b>Explore sarees <i className="bi bi-arrow-up-right"></i></b></div></Link>
            <Link to="/jewellery" className="category-feature-card"><img src={jewelleryImage} alt="Jewellery collection" /><div><span>02 / JEWELLERY</span><h3>Details that glow</h3><b>Explore jewellery <i className="bi bi-arrow-up-right"></i></b></div></Link>
          </div>
        </section>

        <section className="home-section home-products-section">
          <div className="home-section-heading home-section-heading-inline"><div><p className="eyebrow">JUST IN</p><h2>New arrivals</h2><p>Fresh expressions of Indian craft.</p></div><Link to="/shop" className="text-link">View all <i className="bi bi-arrow-up-right"></i></Link></div>
          <div className="home-product-grid">{(newArrivals.length ? newArrivals : clothingProducts.slice(0, 4)).map((product) => <ProductCard product={product} key={product.id} />)}</div>
        </section>

        <section className="home-editorial-band">
          <div className="editorial-copy"><p className="eyebrow">THE RESHI EDIT</p><h2>Tradition, in a new light.</h2><p>From heirloom-inspired silk to luminous everyday details, find pieces that feel like you.</p><Link to="/shop" className="text-link">Discover the edit <i className="bi bi-arrow-up-right"></i></Link></div>
          <div className="editorial-image"><img src={featured[0]?.images?.[0] || clothingImage} alt="Featured saree from the Reshi edit" /></div>
        </section>

        <section className="home-section home-occasions">
          <div className="home-section-heading"><p className="eyebrow">DRESS THE MOMENT</p><h2>Shop by occasion</h2><p>Find the feeling, then make it yours.</p></div>
          <div className="occasion-grid">{occasions.map((occasion) => <Link to={`/shop?department=clothing&occasion=${encodeURIComponent(occasion.value)}`} className="occasion-card" key={occasion.value}><img src={occasion.image || clothingImage} alt={occasion.label} /><span>{occasion.label}<i className="bi bi-arrow-up-right"></i></span></Link>)}</div>
        </section>

        <section className="home-showcase-grid">
          <Link to="/clothing" className="home-showcase-card"><img src={featured[1]?.images?.[0] || clothingImage} alt="Saree showcase" /><div><p className="eyebrow">THE SAREE SHOWCASE</p><h2>Grace in every fold.</h2><span>Shop sarees <i className="bi bi-arrow-up-right"></i></span></div></Link>
          <Link to="/jewellery" className="home-showcase-card"><img src={jewelleryProducts[2]?.images?.[0] || jewelleryImage} alt="Jewellery showcase" /><div><p className="eyebrow">THE JEWELLERY EDIT</p><h2>Small details, lasting glow.</h2><span>Shop jewellery <i className="bi bi-arrow-up-right"></i></span></div></Link>
        </section>

        <section className="home-section home-reasons">
          <div className="home-section-heading"><p className="eyebrow">WHY RESHI ELEGANCE</p><h2>Considered from first glance to final detail.</h2></div>
          <div className="reason-grid"><article><span>01</span><h3>Curated, not crowded</h3><p>A focused edit of pieces chosen to stay relevant beyond a single season.</p></article><article><span>02</span><h3>Made for real moments</h3><p>Versatile silhouettes and jewellery that move easily from everyday to occasion.</p></article><article><span>03</span><h3>A personal kind of luxury</h3><p>Beautiful finishing, thoughtful service, and a little more care in every order.</p></article></div>
        </section>

        <section className="home-testimonials"><div className="home-section-heading"><p className="eyebrow">FROM OUR COMMUNITY</p><h2>Worn, loved, remembered.</h2></div><div className="testimonial-grid"><blockquote>“The saree felt even more beautiful in person. The colour, the finish, the way it draped, everything was perfect.”<cite>Priya M. <span>Verified customer</span></cite></blockquote><blockquote>“My jewellery arrived beautifully packed and looked so elegant with my outfit. I have already picked my next piece.”<cite>Ananya R. <span>Verified customer</span></cite></blockquote></div></section>
      </main>
      <Footer />
    </>
  );
};

export default Home;
