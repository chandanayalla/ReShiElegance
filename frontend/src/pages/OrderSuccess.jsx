import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './OrderSuccess.css';

const OrderSuccess = () => {
  const { state } = useLocation();
  const order = state?.order;
  const orderId = order?.id || order?._id || 'Unavailable';

  return (
    <>
      <Navbar />

      <div className="success-container">
        <div className="container-fluid py-5">
          <div className="success-content">
            <div className="success-icon">
              <i className="bi bi-check-circle"></i>
            </div>
            <h1>🎉 Order Confirmed</h1>
            <p className="success-message">
              Thank you for shopping with ReshiElegance. Our team will contact you shortly on your registered mobile number for further order and delivery details.
            </p>

            <div className="order-details">
              <div className="detail-item">
                <span className="label">Order ID:</span>
                <span className="value">#{orderId}</span>
              </div>
              <div className="detail-item">
                <span className="label">Payment:</span>
                <span className="value">Successful</span>
              </div>
              <div className="detail-item">
                <span className="label">Status:</span>
                <span className="value status">Confirmed</span>
              </div>
            </div>

            <div className="success-actions">
              <Link to="/shop" className="btn btn-outline-primary btn-lg">
                <i className="bi bi-shop me-2"></i>Continue Shopping
              </Link>
            </div>

            <div className="support-info">
              <p>
                <i className="bi bi-chat-dots"></i>
                Our ReshiElegance team will call you for order and delivery follow-up.
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
