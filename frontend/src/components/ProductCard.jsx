import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import { AuthContext } from '../context/AuthContext';
import LoginRequiredPrompt from './LoginRequiredPrompt';
import fallbackImage from '../assets/main.jpeg';
import './ProductCard.css';

const ProductCard = ({ product, onAddToCart }) => {
  const navigate = useNavigate();
  const { addToCart, buyNow, syncError: cartSyncError } = useContext(CartContext);
  const { toggleWishlist, isInWishlist, syncError, statusMessage } = useContext(WishlistContext);
  const { isAuthenticated } = useContext(AuthContext);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [loginPrompt, setLoginPrompt] = useState('');

  useEffect(() => {
    const message = cartSyncError || syncError || statusMessage;
    if (!message) return undefined;
    setToastMessage(message);
    setShowToast(true);
    const timeout = setTimeout(() => setShowToast(false), 3500);
    return () => clearTimeout(timeout);
  }, [cartSyncError, statusMessage, syncError]);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      setLoginPrompt('Please login to add products to your cart.');
      return;
    }
    addToCart(product, 1);
    setToastMessage('Added to cart!');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
    onAddToCart && onAddToCart();
  };

  const handleWishlist = () => {
    if (!isAuthenticated) {
      setLoginPrompt('Please login to save products to your wishlist.');
      return;
    }
    toggleWishlist(product);
    const wasInWishlist = isInWishlist(product.id);
    setToastMessage(wasInWishlist ? 'Removed from wishlist' : 'Added to wishlist!');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      setLoginPrompt('Please login to add products to your cart.');
      return;
    }
    buyNow(product, 1);
    navigate('/checkout');
  };

  const inWishlist = isInWishlist(product.id);

  return (
    <div className={`product-card ${product.stock === 0 ? 'out-of-stock' : ''}`}>
      {/* Image Container */}
      <div className="product-image-container">
        <Link to={`/product/${product.searchId || product.id}`}>
          <div className="image-hover">
            <img
              src={product.images?.[0] || product.image || fallbackImage}
              alt={product.name}
              className="product-image"
              onError={(event) => {
                event.currentTarget.src = fallbackImage;
              }}
            />
          </div>
        </Link>

        {/* Badges */}
        <div className="product-badges">
          {product.stock === 0 && (
            <span className="badge badge-out-of-stock">OUT OF STOCK</span>
          )}
          {product.discount > 0 && (
            <span className="badge badge-discount">-{product.discount}%</span>
          )}
          {product.isNewArrival && (
            <span className="badge badge-new">NEW</span>
          )}
          {product.isBestSeller && (
            <span className="badge badge-bestseller">BESTSELLER</span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          className={`wishlist-btn ${inWishlist ? 'active' : ''}`}
          onClick={handleWishlist}
          title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <i className={`bi bi-heart${inWishlist ? '-fill' : ''}`}></i>
        </button>
      </div>

      {/* Product Info */}
      <div className="product-info">
        {/* Category */}
        <p className="product-category">{product.category}</p>

        {/* Name */}
        <Link to={`/product/${product.searchId || product.id}`}>
          <h5 className="product-name">{product.name}</h5>
        </Link>

        {/* Rating */}
        <div className="product-rating">
          <div className="stars">
            {[...Array(5)].map((_, i) => (
              <i
                key={i}
                className={`bi bi-star${i < Math.floor(product.rating) ? '-fill' : ''}`}
              ></i>
            ))}
          </div>
          <span className="rating-text">({product.reviewsCount})</span>
        </div>

        {/* Price */}
        <div className="product-price">
          <span className="current-price">₹{product.price.toLocaleString()}</span>
          {product.originalPrice > product.price && (
            <>
              <span className="original-price">₹{product.originalPrice.toLocaleString()}</span>
              <span className="discount-text">Save ₹{(product.originalPrice - product.price).toLocaleString()}</span>
            </>
          )}
        </div>

        <p className={`product-availability ${product.stock > 0 ? 'in-stock' : 'out-stock'}`}>
          <i className="bi bi-circle-fill"></i> {product.stock > 0 ? 'In stock' : 'Currently unavailable'}
        </p>

        {/* Add to Cart Button */}
        <button
          className="btn btn-primary btn-add-cart w-100"
          onClick={handleAddToCart}
          disabled={product.stock === 0}
        >
          <i className="bi bi-cart3 me-2"></i>
          Add to Cart
        </button>

        <button
          className="btn btn-outline-primary btn-buy-now w-100"
          onClick={handleBuyNow}
          disabled={product.stock === 0}
        >
          <i className="bi bi-lightning-charge me-2"></i>
          Buy Now
        </button>

        {/* Quick View Link */}
        <Link to={`/product/${product.searchId || product.id}`} className="quick-view">
          <i className="bi bi-eye me-1"></i>Quick View
        </Link>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="toast-notification">
          {toastMessage}
        </div>
      )}
      {loginPrompt && <LoginRequiredPrompt message={loginPrompt} onClose={() => setLoginPrompt('')} />}
    </div>
  );
};

export default ProductCard;
