import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AdminAuthContext } from '../context/AdminAuthContext';

const AdminSidebar = () => {
  const { logout } = useContext(AdminAuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <aside className="admin-sidebar p-4">
      <div className="sidebar-brand mb-5 text-center text-md-start">
        <div className="brand-logo mb-3">
          <span className="brand-circle"></span>
        </div>
        <h3 className="mb-1">ReShi Elegance</h3>
        <p className="text-muted small">Admin Panel</p>
      </div>

      <nav className="nav flex-column gap-2">
        <NavLink to="/admin/dashboard" className="nav-link">
          <i className="bi bi-speedometer2 me-2"></i>Dashboard
        </NavLink>
        <NavLink to="/admin/products" className="nav-link">
          <i className="bi bi-box-seam me-2"></i>Products
        </NavLink>
        <NavLink to="/admin/orders" className="nav-link">
          <i className="bi bi-list-check me-2"></i>Orders
        </NavLink>
        <button type="button" className="btn btn-link nav-link mt-3 text-danger text-start p-0" onClick={handleLogout}>
          <i className="bi bi-box-arrow-right me-2"></i>Logout
        </button>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
