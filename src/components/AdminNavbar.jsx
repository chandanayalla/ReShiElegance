import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminAuthContext } from '../context/AdminAuthContext';

const AdminNavbar = () => {
  const { admin, logout } = useContext(AdminAuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="admin-navbar d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between mb-4">
      <div>
        <h5 className="mb-1">Welcome back, {admin?.name || 'Admin'}</h5>
        <p className="text-muted mb-0">Manage products, orders, and inventory for ReShi Elegance.</p>
      </div>
      <button type="button" className="btn btn-outline-pink rounded-pill mt-3 mt-md-0" onClick={handleLogout}>
        <i className="bi bi-box-arrow-right me-2"></i>Logout
      </button>
    </div>
  );
};

export default AdminNavbar;
