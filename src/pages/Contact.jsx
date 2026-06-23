import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './Info.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${API_URL}/api/contact/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitted(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
        setTimeout(() => {
          setSubmitted(false);
        }, 5000);
      } else {
        setError(data.message || 'Failed to send message. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
      console.error('Error sending contact form:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="info-container">
        <div className="container-fluid py-5">
          <h1>Contact Us</h1>
          <div className="info-content">
            <div className="row">
              <div className="col-md-6 mb-4">
                <h4>Get In Touch</h4>
                <p>We'd love to hear from you. Whether you have questions, feedback, or just want to say hello, feel free to reach out!</p>

                <div style={{ marginTop: '2rem' }}>
                  <h6 style={{ color: 'var(--primary-color)', marginBottom: '1rem' }}>Contact Information</h6>
                  <p>
                    <i className="bi bi-telephone" style={{ marginRight: '0.75rem', color: 'var(--primary-color)' }}></i>
                    <strong>Phone:</strong> +91 7815861896
                  </p>
                  <p>
                    <i className="bi bi-envelope" style={{ marginRight: '0.75rem', color: 'var(--primary-color)' }}></i>
                    <strong>Email:</strong> reshielegancee@gmail.com
                  </p>
                  <p>
                    <i className="bi bi-geo-alt" style={{ marginRight: '0.75rem', color: 'var(--primary-color)' }}></i>
                    <strong>Address:</strong> Tuni,Andhra Pradesh, India
                  </p>
                </div>

                <div style={{ marginTop: '2rem' }}>
                  <h6 style={{ color: 'var(--primary-color)', marginBottom: '1rem' }}>Follow Us</h6>
                  <p>
                    <a 
                      href="https://www.instagram.com/reshi_elegancee?utm_source=qr&igsh=YjZreWpuaWdyZGJ2" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ 
                        color: 'var(--primary-color)', 
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        fontSize: '1rem'
                      }}
                    >
                      <i className="bi bi-instagram" style={{ fontSize: '1.25rem' }}></i>
                      <span style={{ fontWeight: '600' }}>@reshi_elegancee</span>
                    </a>
                  </p>
                </div>
              </div>

              <div className="col-md-6">
                <div className="contact-form">
                  <h5>Send us a Message</h5>
                  {submitted && (
                    <div className="alert alert-success" role="alert">
                      <i className="bi bi-check-circle me-2"></i>
                      Thank you! We'll get back to you soon.
                    </div>
                  )}
                  {error && (
                    <div className="alert alert-danger" role="alert">
                      <i className="bi bi-exclamation-circle me-2"></i>
                      {error}
                    </div>
                  )}
                  <form onSubmit={handleSubmit}>
                    <div className="form-group">
                      <label className="form-label">Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        disabled={loading}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        disabled={loading}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Subject</label>
                      <input
                        type="text"
                        className="form-control"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        disabled={loading}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Message</label>
                      <textarea
                        className="form-control"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        disabled={loading}
                      ></textarea>
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                      {loading ? 'Sending...' : 'Send Message'}
                    </button>
                  </form>
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

export default Contact;
