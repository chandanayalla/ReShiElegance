import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import './Checkout.css';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, getTotalPrice, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const subtotal = getTotalPrice();
  const shipping = subtotal > 999 ? 0 : 100;
  const tax = subtotal * 0.05;
  const total = subtotal + shipping + tax;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const loadRazorpay = () => new Promise((resolve, reject) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => reject(new Error('Unable to load Razorpay checkout.'));
    document.body.appendChild(script);
  });

  const buildOrderPayload = () => ({
    customerName: `${formData.firstName} ${formData.lastName}`.trim(),
    customerEmail: formData.email,
    customerPhone: formData.phone,
    address: {
      line1: formData.address,
      city: formData.city,
      state: formData.state,
      zipCode: formData.zipCode,
      country: formData.country,
    },
    products: cartItems.map((item) => ({
      id: item.id,
      name: item.name,
      price: Number(item.price || 0),
      quantity: item.quantity,
      image: item.images?.[0] || item.image || '',
    })),
    subtotal,
    shipping,
    tax,
    total,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsProcessing(true);

    try {
      const orderPayload = buildOrderPayload();

      if (paymentMethod === 'cod') {
        await api.post('/orders', { ...orderPayload, paymentStatus: 'cod' });
        clearCart();
        navigate('/order-success');
        return;
      }

      await loadRazorpay();
      const { data: razorpayOrder } = await api.post('/payments/razorpay/order', { amount: total });

      const options = {
        key: razorpayOrder.keyId,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: 'ReShi Elegance',
        description: 'Premium women clothing order',
        order_id: razorpayOrder.id,
        prefill: {
          name: orderPayload.customerName,
          email: orderPayload.customerEmail,
          contact: orderPayload.customerPhone,
        },
        theme: { color: '#8f2346' },
        handler: async (response) => {
          await api.post('/payments/razorpay/verify', {
            ...response,
            order: orderPayload,
          });
          clearCart();
          navigate('/order-success');
        },
        modal: {
          ondismiss: () => setIsProcessing(false),
        },
      };

      const checkout = new window.Razorpay(options);
      checkout.on('payment.failed', (response) => {
        setError(response.error?.description || 'Payment failed. Please try again.');
        setIsProcessing(false);
      });
      checkout.open();
      setIsProcessing(false);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Checkout failed. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="checkout-container">
        <div className="container-fluid py-5">
          <h1 className="mb-4">Checkout</h1>

          <div className="row">
            {/* Checkout Form */}
            <div className="col-lg-8 mb-4">
              <form id="checkoutForm" onSubmit={handleSubmit}>
                {error && <div className="alert alert-danger">{error}</div>}
                {/* Billing Information */}
                <div className="checkout-section">
                  <h4>Billing Information</h4>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">First Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Last Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Phone</label>
                      <input
                        type="tel"
                        className="form-control"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-12 mb-3">
                      <label className="form-label">Address</label>
                      <input
                        type="text"
                        className="form-control"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">City</label>
                      <input
                        type="text"
                        className="form-control"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">State</label>
                      <input
                        type="text"
                        className="form-control"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">ZIP Code</label>
                      <input
                        type="text"
                        className="form-control"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="checkout-section">
                  <h4>Payment Method</h4>
                  <div className="payment-options">
                    {[
                      { id: 'razorpay', name: 'Razorpay Secure Checkout', icon: 'bi-credit-card' },
                      { id: 'cod', name: 'Cash on Delivery', icon: 'bi-box2-heart' },
                    ].map(method => (
                      <div key={method.id} className="payment-option">
                        <input
                          type="radio"
                          id={method.id}
                          name="paymentMethod"
                          value={method.id}
                          checked={paymentMethod === method.id}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                        />
                        <label htmlFor={method.id}>
                          <i className={`bi ${method.icon}`}></i>
                          <span>{method.name}</span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="btn btn-primary btn-lg w-100"
                  disabled={isProcessing || cartItems.length === 0}
                >
                  {isProcessing ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Processing...
                    </>
                  ) : (
                    paymentMethod === 'razorpay' ? 'Pay with Razorpay' : 'Place COD Order'
                  )}
                </button>
              </form>
            </div>

            {/* Order Summary */}
            <div className="col-lg-4">
              <div className="order-summary">
                <h4>Order Summary</h4>

                <div className="summary-items">
                  {cartItems.map(item => (
                    <div key={item.id} className="summary-item">
                      <div className="item-info">
                        <h6>{item.name}</h6>
                        <span>Qty: {item.quantity}</span>
                      </div>
                      <span>₹{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                <div className="summary-divider"></div>

                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
                </div>
                <div className="summary-row">
                  <span>Tax (5%)</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>

                <div className="summary-divider"></div>

                <div className="summary-total">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>

                <div className="security-badge">
                  <i className="bi bi-shield-check"></i>
                  <span>Secure & Encrypted</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sticky order bar */}
      <div className="mobile-order-bar d-lg-none">
        <div className="container-fluid">
          <div className="mobile-order-inner">
            <div className="mobile-total">₹{total.toFixed(2)}</div>
            <button form="checkoutForm" className="btn btn-primary">Place Order</button>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Checkout;
