import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { AuthContext } from '../context/AuthContext';
import './Account.css';

const Account = () => {
  const navigate = useNavigate();
  const { user, updateProfile, logout, loading } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setName(user?.name || '');
  }, [user]);

  if (loading) {
    return <div className="container py-5 text-center">Loading your account...</div>;
  }

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="container py-5 text-center">
          <h1>Sign in to view your account</h1>
          <p className="text-muted">Your cart and wishlist are saved to your customer account.</p>
          <Link to="/login" className="btn btn-primary">Login</Link>
          <Link to="/register" className="btn btn-outline-primary ms-2">Sign Up</Link>
        </div>
        <Footer />
      </>
    );
  }

  const handleSave = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');
    if (!name.trim()) {
      setError('Please enter your name.');
      return;
    }

    setIsSaving(true);
    try {
      await updateProfile({ name: name.trim() });
      setMessage('Profile updated successfully.');
    } catch (saveError) {
      setError(saveError?.message || 'Unable to update your profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <>
      <Navbar />

      <div className="account-container">
        <div className="container-fluid py-5">
          <h1 className="mb-4">My Account</h1>

          <div className="row">
            <div className="col-lg-3 mb-4">
              <div className="account-sidebar">
                <div className="user-profile">
                  <div className="avatar">
                    <i className="bi bi-person-circle"></i>
                  </div>
                  <h5>{user?.name}</h5>
                  <p>{user?.email}</p>
                </div>

                <div className="menu-items">
                  <a href="#profile" className="menu-item active">
                    <i className="bi bi-person"></i>
                    Profile Information
                  </a>
                  <Link to="/cart" className="menu-item">
                    <i className="bi bi-bag"></i>
                    My Cart
                  </Link>
                  <Link to="/wishlist" className="menu-item">
                    <i className="bi bi-heart"></i>
                    My Wishlist
                  </Link>
                  <a href="#orders" className="menu-item">
                    <i className="bi bi-receipt"></i>
                    My Orders
                  </a>
                  <button type="button" className="menu-item border-0 bg-transparent" onClick={handleLogout}>
                    <i className="bi bi-box-arrow-right"></i>
                    Logout
                  </button>
                </div>
              </div>
            </div>

            <div className="col-lg-9">
              <div className="account-content">
                <div className="content-card">
                  <h4>Profile Information</h4>
                  {error && <div className="alert alert-danger">{error}</div>}
                  {message && <div className="alert alert-success">{message}</div>}
                  <form onSubmit={handleSave}>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Name</label>
                        <input type="text" className="form-control" value={name} onChange={(event) => setName(event.target.value)} />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Email</label>
                        <input type="email" className="form-control" value={user.email || ''} readOnly />
                      </div>
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={isSaving}>
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </form>
                </div>

                <div className="content-card mt-4" id="orders">
                  <h4>Recent Orders</h4>
                  <p className="text-muted">Your orders will appear here after checkout. <Link to="/shop">Start shopping</Link></p>
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

export default Account;
