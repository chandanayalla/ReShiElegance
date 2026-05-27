import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './OrderSuccess.css';

const OrderSuccess = () => {
  return (
    <>
      <Navbar />

      <div className="success-container">
        <div className="container-fluid py-5">
          <div className="success-content">
            <div className="success-icon">
              <i className="bi bi-check-circle"></i>
            </div>
            <h1>Order Placed Successfully!</h1>
            <p className="success-message">
              Thank you for your order. Your beautiful sarees are on their way!
            </p>

            <div className="order-details">
              <div className="detail-item">
                <span className="label">Order ID:</span>
                <span className="value">#RES{Math.floor(Math.random() * 1000000)}</span>
              </div>
              <div className="detail-item">
                <span className="label">Estimated Delivery:</span>
                <span className="value">5-7 business days</span>
              </div>
              <div className="detail-item">
                <span className="label">Status:</span>
                <span className="value status">Order Confirmed</span>
              </div>
            </div>

            <div className="success-actions">
              <Link to="/orders" className="btn btn-primary btn-lg">
                <i className="bi bi-bag me-2"></i>View Orders
              </Link>
              <Link to="/shop" className="btn btn-outline-primary btn-lg">
                <i className="bi bi-shop me-2"></i>Continue Shopping
              </Link>
            </div>

            <div className="support-info">
              <p>
                <i className="bi bi-chat-dots"></i>
                Questions? Contact us at <strong>hello@reshielegance.com</strong>
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default OrderSuccess;
