import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import api from '../services/api';
import { readArrayResponse } from '../utils/apiData';
import { jewelleryProducts } from '../data/jewellery';
import './Jewellery.css';

const titles = { earrings: 'Earrings', necklaces: 'Necklaces', sets: 'Jewellery Sets', bangles: 'Bangles', 'black-beads': 'Black Beads', 'thali-chains': 'Thali Chains', rings: 'Rings', bridal: 'Bridal Jewellery' };

const JewelleryShop = () => {
  const { category } = useParams();
  const [products, setProducts] = useState(jewelleryProducts);
  const [sort, setSort] = useState('featured');
  const queryOccasion = new URLSearchParams(window.location.search).get('occasion') || '';
  const [occasion, setOccasion] = useState(queryOccasion);

  useEffect(() => {
    api.get('/products').then((response) => {
      const items = readArrayResponse(response.data).filter((product) => product.productType === 'jewellery');
      if (items.length) setProducts(items);
    }).catch(() => {});
  }, []);

  const filteredProducts = useMemo(() => {
    const result = products.filter((product) => (!category || product.category === category) && (!occasion || product.occasion === occasion));
    return result.sort((a, b) => sort === 'price-low' ? a.price - b.price : sort === 'price-high' ? b.price - a.price : 0);
  }, [category, occasion, products, sort]);

  const heading = category ? titles[category] || 'Jewellery' : 'Jewellery Collection';

  return (
    <>
      <Navbar />
      <main className="jewellery-shop-page">
        <div className="jewellery-breadcrumb"><Link to="/">Home</Link><span>›</span><Link to="/jewellery">Jewellery</Link>{category && <><span>›</span><strong>{heading}</strong></>}</div>
        <header className="jewellery-list-header"><p className="eyebrow">REShi ELEGANCE JEWELLERY</p><h1>{heading}</h1><p>A perfect blend of tradition and modern charm</p></header>
        <div className="jewellery-toolbar"><span>{filteredProducts.length} Products</span><div className="jewellery-filters"><select aria-label="Filter by occasion" value={occasion} onChange={(event) => setOccasion(event.target.value)}><option value="">All Occasions</option><option>Everyday</option><option>Party</option><option>Festive</option><option>Wedding</option><option>Bridal</option></select><select aria-label="Sort products" value={sort} onChange={(event) => setSort(event.target.value)}><option value="featured">Featured</option><option value="price-low">Price: Low to High</option><option value="price-high">Price: High to Low</option></select></div></div>
        <div className="row g-4">{filteredProducts.map((product) => <div className="col-6 col-md-4 col-lg-3" key={product.id}><ProductCard product={product} /></div>)}</div>
      </main>
      <Footer />
    </>
  );
};

export default JewelleryShop;
