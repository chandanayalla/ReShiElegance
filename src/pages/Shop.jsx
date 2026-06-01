import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import Footer from '../components/Footer';
import api from '../services/api';
import './Shop.css';

const Shop = () => {
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const searchQuery = urlParams.get('search') || '';
  const categoryParam = urlParams.get('category') || '';

  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    category: categoryParam || '',
    priceRange: [0, 20000],
    color: '',
    fabric: '',
    occasion: '',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await api.get('/products');
        setProducts(response.data || []);
      } catch (err) {
        setError('Unable to load products.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const nextParams = new URLSearchParams(location.search);
    setFilters((prev) => ({ ...prev, category: nextParams.get('category') || '' }));
    setCurrentPage(1);
  }, [location.search]);

  const itemsPerPage = 12;

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((p) =>
        (p.name || '').toLowerCase().includes(query) ||
        (p.description || '').toLowerCase().includes(query)
      );
    }

    if (filters.category) {
      result = result.filter((p) => p.category === filters.category);
    }

    result = result.filter((p) => {
      const price = Number(p.price) || 0;
      return price >= filters.priceRange[0] && price <= filters.priceRange[1];
    });

    if (filters.color) {
      result = result.filter((p) => (p.colors || []).includes(filters.color));
    }

    if (filters.fabric) {
      result = result.filter((p) => p.fabric === filters.fabric);
    }

    if (filters.occasion) {
      result = result.filter((p) => p.occasion === filters.occasion);
    }

    switch (sortBy) {
      case 'price-low':
        return result.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
      case 'price-high':
        return result.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
      case 'newest':
        return result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      case 'rating':
        return result.sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0));
      default:
        return result;
    }
  }, [searchQuery, filters, sortBy, products]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilters({
      category: '',
      priceRange: [0, 20000],
      color: '',
      fabric: '',
      occasion: '',
    });
    setSortBy('featured');
    setCurrentPage(1);
  };

  const uniqueColors = [...new Set(products.flatMap((p) => p.colors || []))];
  const uniqueFabrics = [...new Set(products.map((p) => p.fabric).filter(Boolean))];
  const uniqueOccasions = [...new Set(products.map((p) => p.occasion).filter(Boolean))];
  const uniqueCategories = [...new Set(products.map((p) => p.category).filter(Boolean))];

  return (
    <>
      <Navbar />

      <div className="shop-container">
        <div className="container-fluid py-5">
          {/* Page Header */}
          <div className="shop-header mb-5">
            <h1>All Sarees</h1>
            <p>{filteredProducts.length} products found</p>
          </div>

          <div className="row">
            {/* Main Content */}
            <div className="col-12">
              {/* Sort Bar */}
              <div className="sort-bar mb-4">
                <div className="d-flex d-lg-none align-items-center">
                  <button className="btn btn-outline-primary me-2" onClick={() => setShowFilters(true)}>Filters</button>
                </div>
                <label htmlFor="sort-select">Sort by:</label>
                <select
                  id="sort-select"
                  className="form-select"
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="newest">Newest</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>

              {/* Off-canvas Filters (mobile) */}
              <div className={`filters-offcanvas ${showFilters ? 'open' : ''}`} role="dialog" aria-hidden={!showFilters}>
                <div className="filters-offcanvas-inner">
                  <div className="filters-offcanvas-header d-flex justify-content-between align-items-center">
                    <h5>Filters</h5>
                    <button className="btn btn-link text-muted" onClick={() => setShowFilters(false)}>Close</button>
                  </div>

                  <div className="filters-panel p-3">
                    <div className="filter-group">
                      <h6>Category</h6>
                      <select className="form-select" value={filters.category} onChange={(e) => handleFilterChange('category', e.target.value)}>
                        <option value="">All</option>
                        {uniqueCategories.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>

                    <div className="filter-group">
                      <h6>Color</h6>
                      <select className="form-select" value={filters.color} onChange={(e) => handleFilterChange('color', e.target.value)}>
                        <option value="">Any</option>
                        {uniqueColors.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>

                    <div className="filter-group">
                      <h6>Fabric</h6>
                      <select className="form-select" value={filters.fabric} onChange={(e) => handleFilterChange('fabric', e.target.value)}>
                        <option value="">Any</option>
                        {uniqueFabrics.map((f) => <option key={f} value={f}>{f}</option>)}
                      </select>
                    </div>

                    <div className="filter-group">
                      <h6>Occasion</h6>
                      <select className="form-select" value={filters.occasion} onChange={(e) => handleFilterChange('occasion', e.target.value)}>
                        <option value="">Any</option>
                        {uniqueOccasions.map((o) => <option key={o} value={o}>{o}</option>)}
                      </select>
                    </div>

                    <div className="filter-group">
                      <h6>Price Range</h6>
                      <div className="d-flex gap-2">
                        <input type="number" className="form-control" value={filters.priceRange[0]} onChange={(e) => handleFilterChange('priceRange', [Number(e.target.value || 0), filters.priceRange[1]])} />
                        <input type="number" className="form-control" value={filters.priceRange[1]} onChange={(e) => handleFilterChange('priceRange', [filters.priceRange[0], Number(e.target.value || 0)])} />
                      </div>
                    </div>

                    <div className="d-flex gap-2 mt-3">
                      <button className="btn btn-primary flex-grow-1" onClick={() => { setShowFilters(false); }}>Apply</button>
                      <button className="btn btn-outline-secondary flex-grow-1" onClick={() => { handleResetFilters(); }}>Reset</button>
                    </div>
                  </div>
                </div>
                <div className="filters-offcanvas-backdrop" onClick={() => setShowFilters(false)}></div>
              </div>

              {/* Products Grid */}
              {paginatedProducts.length > 0 ? (
                <>
                  <div className="row g-4 mb-5">
                    {paginatedProducts.map(product => (
                      <div key={product.id} className="col-6 col-md-6 col-lg-4">
                        <ProductCard product={product} />
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <nav aria-label="Page navigation">
                      <ul className="pagination justify-content-center">
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                          <button
                            className="page-link"
                            onClick={() => setCurrentPage(currentPage - 1)}
                          >
                            Previous
                          </button>
                        </li>
                        {[...Array(totalPages)].map((_, i) => (
                          <li
                            key={i + 1}
                            className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}
                          >
                            <button
                              className="page-link"
                              onClick={() => setCurrentPage(i + 1)}
                            >
                              {i + 1}
                            </button>
                          </li>
                        ))}
                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                          <button
                            className="page-link"
                            onClick={() => setCurrentPage(currentPage + 1)}
                          >
                            Next
                          </button>
                        </li>
                      </ul>
                    </nav>
                  )}
                </>
              ) : (
                <div className="no-products">
                  <i className="bi bi-inbox"></i>
                  <h4>No products found</h4>
                  <p>Try adjusting your filters</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Shop;
