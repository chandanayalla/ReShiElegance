import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../services/api';
import { readArrayResponse } from '../utils/apiData';
import './Shop.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await api.get('/products');
        setProducts(readArrayResponse(response.data));
      } catch (err) {
        setError('Unable to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  return (
    <>
      <Navbar />

      <div className="shop-container py-5">
        <div className="container-fluid">
          <div className="section-header text-center mb-5">
            <h2>Product List</h2>
            <p>All products from the backend with live stock data.</p>
            <div className="title-divider"></div>
          </div>

          {loading && <p className="text-center">Loading products...</p>}
          {error && <div className="alert alert-danger text-center">{error}</div>}

          {!loading && !error && (
            <div className="row g-4">
              {products.map((product) => (
                <div key={product.id} className="col-md-6 col-lg-4">
                  <div className="card h-100 shadow-sm">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="card-img-top"
                      style={{ height: '260px', objectFit: 'cover' }}
                    />
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title">{product.name}</h5>
                      <p className="card-text text-muted mb-2">₹{product.price}</p>
                      <p className="mb-3">{product.description}</p>
                      <div className="mt-auto">
                        <span className={`badge ${product.stock > 0 ? 'bg-success' : 'bg-danger'}`}>
                          {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ProductList;
