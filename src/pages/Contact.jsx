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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setFormData({ name: '', email: '', subject: '', message: '' });
      setSubmitted(false);
    }, 3000);
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
                    <strong>Phone:</strong> +91 98765 43210
                  </p>
                  <p>
                    <i className="bi bi-envelope" style={{ marginRight: '0.75rem', color: 'var(--primary-color)' }}></i>
                    <strong>Email:</strong> hello@reshielegance.com
                  </p>
                  <p>
                    <i className="bi bi-geo-alt" style={{ marginRight: '0.75rem', color: 'var(--primary-color)' }}></i>
                    <strong>Address:</strong> New Delhi, India
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
                      ></textarea>
                    </div>
                    <button type="submit" className="btn btn-primary">
                      Send Message
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
