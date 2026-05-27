import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import './ProductCard.css';

const ProductCard = ({ product, onAddToCart }) => {
  const { addToCart } = useContext(CartContext);
  const { toggleWishlist, isInWishlist } = useContext(WishlistContext);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleAddToCart = () => {
    addToCart(product, 1);
    setToastMessage('Added to cart!');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
    onAddToCart && onAddToCart();
  };

  const handleWishlist = () => {
    toggleWishlist(product);
    const inWishlist = isInWishlist(product.id);
    setToastMessage(inWishlist ? 'Removed from wishlist' : 'Added to wishlist!');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const inWishlist = isInWishlist(product.id);

  return (
    <div className="product-card">
      {/* Image Container */}
      <div className="product-image-container">
        <Link to={`/product/${product.id}`}>
          <div className="image-hover">
            <img
              src={product.images?.[0] || 'https://via.placeholder.com/300x400'}
              alt={product.name}
              className="product-image"
            />
          </div>
        </Link>

        {/* Badges */}
        <div className="product-badges">
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
        <Link to={`/product/${product.id}`}>
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

        {/* Add to Cart Button */}
        <button
          className="btn btn-primary btn-add-cart w-100"
          onClick={handleAddToCart}
          disabled={product.stock === 0}
        >
          <i className="bi bi-cart3 me-2"></i>
          Add to Cart
        </button>

        {/* Quick View Link */}
        <Link to={`/product/${product.id}`} className="quick-view">
          <i className="bi bi-eye me-1"></i>Quick View
        </Link>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="toast-notification">
          {toastMessage}
        </div>
      )}
    </div>
  );
};

export default ProductCard;
