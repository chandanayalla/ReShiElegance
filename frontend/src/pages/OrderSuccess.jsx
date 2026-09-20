import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './OrderSuccess.css';

const formatCurrency = (value) => `₹${Number(value || 0).toLocaleString('en-IN')}`;

const formatDate = (value) => {
  if (!value) return 'Just now';
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? 'Just now'
    : date.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
};

const getItems = (order) => (Array.isArray(order?.products) ? order.products : []);

const OrderSuccess = () => {
  const { state } = useLocation();
  let storedOrder = null;
  try {
    storedOrder = JSON.parse(sessionStorage.getItem('reshiLastOrder') || 'null');
  } catch {
    storedOrder = null;
  }
  const order = state?.order || storedOrder;
  const items = getItems(order);
  const orderId = order?.id || order?._id;
  const paymentSuccessful = String(order?.paymentStatus || '').toLowerCase() === 'paid';
  const isConfirmed = String(order?.status || '').toLowerCase() === 'confirmed';

  if (!order || !orderId || !paymentSuccessful || !isConfirmed) {
    return (
      <>
        <Navbar />
        <main className="success-container">
          <div className="container-fluid py-5">
            <section className="success-content success-error" aria-live="polite">
              <div className="error-icon"><i className="bi bi-exclamation-lg" /></div>
              <p className="eyebrow">Order confirmation</p>
              <h1>We could not load your order details</h1>
              <p className="success-message">
                Your order has not been marked as confirmed on this page. Please contact ReshiElegance support before trying payment again.
              </p>
              <div className="success-actions">
                <Link to="/contact" className="btn btn-primary btn-lg">Contact Support</Link>
                <Link to="/" className="btn btn-outline-primary btn-lg">Back to Home</Link>
              </div>
            </section>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="success-container">
        <div className="container-fluid py-5">
          <div className="success-content">
            <div className="success-icon" aria-hidden="true">
              <i className="bi bi-check2"></i>
            </div>
            <p className="eyebrow">ReshiElegance order update</p>
            <h1>🎉 Order Confirmed!</h1>
            <p className="success-message">
              Thank you for shopping with ReshiElegance <span aria-label="love">♥</span>
            </p>

            <section className="order-card" aria-label="Order summary">
              <div className="order-card-heading">
                <div>
                  <p className="card-kicker">Order summary</p>
                  <h2>Thank you, {order.customerName || 'there'}</h2>
                </div>
                <span className="status-badge"><i className="bi bi-check-circle-fill" /> Confirmed</span>
              </div>

              <div className="order-meta">
                <div className="detail-item detail-item-order-id">
                  <span className="label">Order ID</span>
                  <span className="value order-id">#{orderId}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Order date</span>
                  <span className="value">{formatDate(order.createdAt)}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Payment</span>
                  <span className="value payment-success"><i className="bi bi-check2-circle" /> Successful</span>
                </div>
              </div>

              <div className="items-heading">
                <h3>Order items</h3>
                <span>{items.length} {items.length === 1 ? 'item' : 'items'}</span>
              </div>
              <div className="order-items">
                {items.map((item, index) => {
                  const quantity = Number(item.quantity || item.qty || 1);
                  const image = item.image || item.imageUrl || item.images?.[0];
                  return (
                    <div className="order-item" key={`${item.id || item.name || 'item'}-${index}`}>
                      {image ? <img src={image} alt="" className="item-image" /> : <div className="item-image item-image-placeholder"><i className="bi bi-bag-heart" /></div>}
                      <div className="item-copy">
                        <strong>{item.name || item.title || 'Product'}</strong>
                        <span>Quantity × {quantity}</span>
                      </div>
                      <span className="item-total">{formatCurrency(Number(item.price || item.amount || 0) * quantity)}</span>
                    </div>
                  );
                })}
              </div>

              <div className="order-total">
                <span>Total amount</span>
                <strong>{formatCurrency(order.total)}</strong>
              </div>
            </section>

            <p className="follow-up-message">
              Your order has been successfully placed. Our ReshiElegance team will contact you shortly on your registered mobile number for further order and delivery details.
            </p>

            <p className="screenshot-note"><i className="bi bi-camera" /> Please take a screenshot of this confirmation page for your records.</p>
            <p className="reference-note">Please keep your Order ID for future reference.</p>

            <div className="success-actions">
              <Link to="/shop" className="btn btn-outline-primary btn-lg">
                <i className="bi bi-shop me-2"></i>Continue Shopping
              </Link>
              <Link to="/" className="btn btn-primary btn-lg">
                <i className="bi bi-house me-2"></i>Back to Home
              </Link>
            </div>

            <div className="support-info">
              <i className="bi bi-shield-check" /> Secure payment confirmed
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default OrderSuccess;
