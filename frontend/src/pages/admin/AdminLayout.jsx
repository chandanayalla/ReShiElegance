import React, { useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import AdminNavbar from '../../components/AdminNavbar';
import './Admin.css';

const AdminLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="admin-shell">
      <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      {isSidebarOpen && <button type="button" className="admin-sidebar-backdrop" aria-label="Close admin menu" onClick={() => setIsSidebarOpen(false)} />}
      <div className="admin-main">
        <AdminNavbar onMenuToggle={() => setIsSidebarOpen((open) => !open)} />
        <div className="admin-content">{children}</div>
      </div>
    </div>
  );
};

export default AdminLayout;
