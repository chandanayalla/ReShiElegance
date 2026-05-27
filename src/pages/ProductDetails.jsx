import React, { useState, useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import api from '../services/api';
import './ProductDetails.css';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [showNotification, setShowNotification] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [relatedProducts, setRelatedProducts] = useState([]);

  const { addToCart } = useContext(CartContext);
  const { toggleWishlist, isInWishlist } = useContext(WishlistContext);

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await api.get(`/products/${id}`);
        const productData = response.data;
        setProduct(productData);
        setMainImage(productData.images?.[0] || '');
      } catch (err) {
        setError('Product not found.');
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  useEffect(() => {
    const loadRelated = async () => {
      if (!product?.category) return;

      try {
        const response = await api.get('/products');
        setRelatedProducts(
          response.data
            .filter((p) => p.category === product.category && p.id !== product.id)
            .slice(0, 3)
        );
      } catch (err) {
        setRelatedProducts([]);
      }
    };

    loadRelated();
  }, [product]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container py-5 text-center">
          <h2>Loading product...</h2>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        <Navbar />
        <div className="container py-5 text-center">
          <h2>{error || 'Product not found'}</h2>
        </div>
        <Footer />
      </>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const handleWishlist = () => {
    toggleWishlist(product);
  };

  return (
    <>
      <Navbar />

      <div className="product-details-container py-5">
        <div className="container-fluid">
          {/* Breadcrumb */}
          <nav aria-label="breadcrumb" className="mb-4">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><a href="/">Home</a></li>
              <li className="breadcrumb-item"><a href="/shop">Shop</a></li>
              <li className="breadcrumb-item"><a href={`/shop?category=${product.category}`}>{product.category}</a></li>
              <li className="breadcrumb-item active">{product.name}</li>
            </ol>
          </nav>

          <div className="row">
            {/* Product Images */}
            <div className="col-lg-5 mb-4">
              <div className="product-images">
                {/* Main Image */}
                <div className="main-image-container">
                  <img src={mainImage} alt={product.name} className="main-image" />
                  {product.discount > 0 && (
                    <span className="discount-badge">-{product.discount}%</span>
                  )}
                </div>

                {/* Thumbnails */}
                <div className="image-thumbnails">
                  {product.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className={`thumbnail ${mainImage === image ? 'active' : ''}`}
                      onClick={() => setMainImage(image)}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Product Info */}
            <div className="col-lg-7">
              <div className="product-details">
                {/* Category and Title */}
                <p className="product-category">{product.category}</p>
                <h1 className="product-title">{product.name}</h1>

                {/* Rating */}
                <div className="product-rating mb-3">
                  <div className="stars">
                    {[...Array(5)].map((_, i) => (
                      <i
                        key={i}
                        className={`bi bi-star${i < Math.floor(product.rating) ? '-fill' : ''}`}
                      ></i>
                    ))}
                  </div>
                  <span>({product.reviewsCount} reviews)</span>
                </div>

                {/* Pricing */}
                <div className="pricing-section mb-4">
                  <h2 className="current-price">₹{product.price.toLocaleString()}</h2>
                  {product.originalPrice > product.price && (
                    <>
                      <span className="original-price">₹{product.originalPrice.toLocaleString()}</span>
                      <span className="discount-info">You save ₹{(product.originalPrice - product.price).toLocaleString()} ({product.discount}% off)</span>
                    </>
                  )}
                </div>

                {/* Stock Status */}
                <p className={`stock-status ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </p>

                {/* Description */}
                <p className="description mb-4">{product.description}</p>

                {/* Product Details */}
                <div className="details-grid mb-4">
                  <div className="detail-item">
                    <span className="label">Fabric:</span>
                    <span className="value">{product.fabric}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Work:</span>
                    <span className="value">{product.work}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Occasion:</span>
                    <span className="value">{product.occasion}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Available Colors:</span>
                    <span className="value">{product.colors.join(', ')}</span>
                  </div>
                </div>

                {/* Quantity and Actions */}
                <div className="actions-section mb-4">
                  <div className="quantity-selector">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                      <i className="bi bi-dash"></i>
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      min="1"
                      max={product.stock}
                    />
                    <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}>
                      <i className="bi bi-plus"></i>
                    </button>
                  </div>

                  <button
                    className="btn btn-primary btn-lg"
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                  >
                    <i className="bi bi-cart3 me-2"></i>
                    Add to Cart
                  </button>

                  <button
                    className={`btn btn-outline-primary btn-lg ${inWishlist ? 'active' : ''}`}
                    onClick={handleWishlist}
                  >
                    <i className={`bi bi-heart${inWishlist ? '-fill' : ''}`}></i>
                    {inWishlist ? 'Remove' : 'Add to'} Wishlist
                  </button>
                </div>

                {/* Features */}
                <div className="features-list">
                  <div className="feature">
                    <i className="bi bi-truck"></i>
                    <div>
                      <h6>Free Shipping</h6>
                      <p>On orders above ₹999</p>
                    </div>
                  </div>
                  <div className="feature">
                    <i className="bi bi-arrow-counterclockwise"></i>
                    <div>
                      <h6>Easy Returns</h6>
                      <p>30-day return policy</p>
                    </div>
                  </div>
                  <div className="feature">
                    <i className="bi bi-shield-check"></i>
                    <div>
                      <h6>Secure Payment</h6>
                      <p>SSL encrypted checkout</p>
                    </div>
                  </div>
                </div>

                {/* Notification */}
                {showNotification && (
                  <div className="alert alert-success alert-dismissible">
                    <i className="bi bi-check-circle me-2"></i>
                    Added to cart successfully!
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="row mt-5">
            <div className="col-12">
              <div className="tabs-section">
                <div className="tabs-header">
                  <button
                    className={`tab-button ${activeTab === 'description' ? 'active' : ''}`}
                    onClick={() => setActiveTab('description')}
                  >
                    Description
                  </button>
                  <button
                    className={`tab-button ${activeTab === 'details' ? 'active' : ''}`}
                    onClick={() => setActiveTab('details')}
                  >
                    Additional Information
                  </button>
                  <button
                    className={`tab-button ${activeTab === 'reviews' ? 'active' : ''}`}
                    onClick={() => setActiveTab('reviews')}
                  >
                    Reviews ({product.reviewsCount})
                  </button>
                </div>

                <div className="tabs-content">
                  {activeTab === 'description' && (
                    <div className="tab-pane">
                      <p>{product.description}</p>
                      <h5>Why Choose This Saree?</h5>
                      <ul>
                        <li>Premium {product.fabric} fabric</li>
                        <li>Exquisite {product.work}</li>
                        <li>Perfect for {product.occasion} occasions</li>
                        <li>Beautiful color options: {product.colors.join(', ')}</li>
                      </ul>
                    </div>
                  )}
                  {activeTab === 'details' && (
                    <div className="tab-pane">
                      <table className="details-table">
                        <tbody>
                          <tr>
                            <td>Fabric</td>
                            <td>{product.fabric}</td>
                          </tr>
                          <tr>
                            <td>Work</td>
                            <td>{product.work}</td>
                          </tr>
                          <tr>
                            <td>Occasion</td>
                            <td>{product.occasion}</td>
                          </tr>
                          <tr>
                            <td>Available Colors</td>
                            <td>{product.colors.join(', ')}</td>
                          </tr>
                          <tr>
                            <td>Length</td>
                            <td>5.5 meters</td>
                          </tr>
                          <tr>
                            <td>Blouse Piece</td>
                            <td>0.8 meters</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}
                  {activeTab === 'reviews' && (
                    <div className="tab-pane">
                      <div className="reviews-container">
                        <p>Great saree! Excellent quality and fast delivery.</p>
                        <p>Highly recommended for special occasions.</p>
                        <p>Beautiful colors and intricate work. Worth the price!</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ProductDetails;
