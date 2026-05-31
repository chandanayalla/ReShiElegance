import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { CartContext } from '../context/CartContext';
import './Cart.css';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, getTotalPrice } = useContext(CartContext);

  const subtotal = getTotalPrice();
  const shipping = subtotal > 999 ? 0 : 100;
  const tax = subtotal * 0.05;
  const total = subtotal + shipping + tax;

  if (cartItems.length === 0) {
    return (
      <>
        <Navbar />
        <div className="cart-container empty-cart">
          <div className="container-fluid py-5">
            <div className="text-center">
              <i className="bi bi-cart-x"></i>
              <h2>Your Cart is Empty</h2>
              <p>Add some beautiful sarees to get started!</p>
              <Link to="/shop" className="btn btn-primary btn-lg">
                Continue Shopping
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

      <div className="cart-container">
        <div className="container-fluid py-5">
          <h1 className="mb-4">Shopping Cart</h1>

          <div className="row">
            {/* Cart Items */}
            <div className="col-lg-8 mb-4">
              <div className="cart-items-section">
                {cartItems.map(item => (
                  <div key={item.id} className="cart-item">
                    <div className="item-image">
                      <img src={item.images?.[0]} alt={item.name} />
                    </div>

                    <div className="item-details">
                      <h5>{item.name}</h5>
                      <p className="category">{item.category}</p>
                      <p className="price">₹{item.price.toLocaleString()}</p>
                    </div>

                    <div className="item-quantity">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                        <i className="bi bi-dash"></i>
                      </button>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          updateQuantity(item.id, parseInt(e.target.value) || 1)
                        }
                      />
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                        <i className="bi bi-plus"></i>
                      </button>
                    </div>

                    <div className="item-total">
                      <p>₹{(item.price * item.quantity).toLocaleString()}</p>
                    </div>

                    <button
                      className="btn-remove"
                      onClick={() => removeFromCart(item.id)}
                      title="Remove"
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="col-lg-4">
              <div className="order-summary">
                <h4>Order Summary</h4>

                <div className="summary-row">
                  <span>Subtotal ({cartItems.length} items)</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>

                <div className="summary-row">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? 'free' : ''}>
                    {shipping === 0 ? 'FREE' : `₹${shipping}`}
                  </span>
                </div>

                <div className="summary-row">
                  <span>Tax (5%)</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>

                <div className="promo-code">
                  <input type="text" placeholder="Enter promo code" />
                  <button className="btn btn-outline-primary">Apply</button>
                </div>

                <div className="summary-divider"></div>

                <div className="summary-total">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>

                <Link to="/checkout" className="btn btn-primary btn-lg w-100">
                  Proceed to Checkout
                </Link>

                <Link to="/shop" className="btn btn-outline-primary w-100 mt-2">
                  Continue Shopping
                </Link>

                <div className="security-info">
                  <i className="bi bi-shield-check"></i>
                  <span>Secure checkout powered by Razorpay</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sticky checkout bar */}
      <div className="mobile-checkout-bar d-lg-none">
        <div className="container-fluid">
          <div className="mobile-checkout-inner">
            <div className="mobile-total">Total: ₹{total.toFixed(2)}</div>
            <Link to="/checkout" className="btn btn-primary">Checkout</Link>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Cart;
