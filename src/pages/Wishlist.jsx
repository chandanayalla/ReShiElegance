import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import Footer from '../components/Footer';
import { WishlistContext } from '../context/WishlistContext';
import './Wishlist.css';

const Wishlist = () => {
  const { wishlistItems, removeFromWishlist } = useContext(WishlistContext);

  if (wishlistItems.length === 0) {
    return (
      <>
        <Navbar />
        <div className="wishlist-container empty-wishlist">
          <div className="container-fluid py-5">
            <div className="text-center">
              <i className="bi bi-heart"></i>
              <h2>Your Wishlist is Empty</h2>
              <p>Save your favorite sarees for later!</p>
              <Link to="/shop" className="btn btn-primary btn-lg">
                Start Shopping
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="wishlist-container">
        <div className="container-fluid py-5">
          <h1 className="mb-4">My Wishlist</h1>
          <p className="wishlist-count">{wishlistItems.length} items in your wishlist</p>

          <div className="row g-4">
            {wishlistItems.map(product => (
              <div key={product.id} className="col-lg-4 col-md-6">
                <div className="wishlist-item">
                  <ProductCard product={product} />
                  <button
                    className="btn-remove-wishlist"
                    onClick={() => removeFromWishlist(product.id)}
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Wishlist;
