import React from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import AdminNavbar from '../../components/AdminNavbar';
import './Admin.css';

const AdminLayout = ({ children }) => {
  return (
    <div className="admin-shell">
      <AdminSidebar />
      <div className="admin-main">
        <AdminNavbar />
        <div className="admin-content">{children}</div>
      </div>
    </div>
  );
};

export default AdminLayout;
