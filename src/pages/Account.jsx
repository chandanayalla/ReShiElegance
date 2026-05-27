import React, { useContext } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { AuthContext } from '../context/AuthContext';
import './Account.css';

const Account = () => {
  const { user, updateProfile } = useContext(AuthContext);

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
                  <a href="#addresses" className="menu-item">
                    <i className="bi bi-geo-alt"></i>
                    Address Book
                  </a>
                  <a href="#orders" className="menu-item">
                    <i className="bi bi-bag"></i>
                    My Orders
                  </a>
                  <a href="#wishlist" className="menu-item">
                    <i className="bi bi-heart"></i>
                    My Wishlist
                  </a>
                  <a href="#settings" className="menu-item">
                    <i className="bi bi-gear"></i>
                    Settings
                  </a>
                </div>
              </div>
            </div>

            <div className="col-lg-9">
              <div className="account-content">
                <div className="content-card">
                  <h4>Profile Information</h4>
                  <form>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Name</label>
                        <input type="text" className="form-control" value={user?.name} />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Email</label>
                        <input type="email" className="form-control" value={user?.email} />
                      </div>
                    </div>
                    <button type="submit" className="btn btn-primary">Save Changes</button>
                  </form>
                </div>

                <div className="content-card mt-4">
                  <h4>Recent Orders</h4>
                  <p className="text-muted">No orders yet. <a href="/shop">Start shopping</a></p>
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
